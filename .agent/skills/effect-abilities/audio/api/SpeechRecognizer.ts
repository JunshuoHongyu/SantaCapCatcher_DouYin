/**
 * Speech recognition adapter for generated gameplay scripts.
 *
 * The APJS recognizer is created during Game2D.onInit. Gameplay code obtains
 * the shared handle from createSpeechRecognizer() in Scene.create().
 */

import {Game2D} from './Game2D';

type RuntimeEvent = {args?: unknown[]};
type RuntimeEventEmitter = {
    on?: (eventType: number, callback: (event: RuntimeEvent) => void, context?: object) => void;
    off?: (eventType: number, callback: (event: RuntimeEvent) => void, context?: object) => void;
};
type RuntimeSpeechRecognizer = {
    enabled: boolean;
    eventEmitter?: RuntimeEventEmitter;
    start(): void;
    stop(): void;
};
type RuntimeSpeechRecognizerBuilder = {
    setDetectorSource?: (sourceType: number, audioComponent: null) => RuntimeSpeechRecognizerBuilder;
    build?: () => RuntimeSpeechRecognizer | null;
};
type SpeechTextAPI = {
    report?: (scene: unknown, text: string) => boolean;
};
type ListenerEntry<T> = {callback: (value: T) => void; context?: object};

export interface SpeechRecognizer {
    enabled: boolean;
    start(): void;
    stop(): void;
    isStarted(): boolean;
    onResult(callback: (text: string) => void, context?: object): void;
    offResult(callback: (text: string) => void, context?: object): void;
    onError(callback: (error: Error) => void, context?: object): void;
    offError(callback: (error: Error) => void, context?: object): void;
    destroy(): void;
}

const LOG_TAG = '[SpeechRecognizer]';
let sharedRuntimeHandle: RuntimeSpeechRecognizer | null = null;
let sharedWrapper: SharedSpeechRecognizer | null = null;

const getRuntimeEventType = (name: 'RecognizedSuccess' | 'RecognizedFailed'): number | undefined => {
    return APJS.SpeechRecognitionEventType?.[name];
};

const reportSensorText = (scene: unknown, text: string): void => {
    const speechText = APJS.SpeechText as unknown as SpeechTextAPI | undefined;
    speechText?.report?.(scene, text);
};

const removeListener = <T>(listeners: Array<ListenerEntry<T>>, callback: (value: T) => void, context?: object): void => {
    const index = listeners.findIndex(entry => entry.callback === callback && entry.context === context);
    if (index >= 0) {
        listeners.splice(index, 1);
    }
};

class SharedSpeechRecognizer implements SpeechRecognizer {
    private readonly resultListeners: Array<ListenerEntry<string>> = [];
    private readonly errorListeners: Array<ListenerEntry<Error>> = [];
    private started = false;
    private scene: unknown;

    private readonly onRuntimeResult = (event: RuntimeEvent): void => {
        const text = typeof event.args?.[0] === 'string' ? event.args[0] : '';
        if (!text) {
            return;
        }
        for (const entry of this.resultListeners.slice()) {
            entry.callback.call(entry.context, text);
        }
        reportSensorText(this.scene, text);
    };

    private readonly onRuntimeError = (event: RuntimeEvent): void => {
        const message = typeof event.args?.[0] === 'string' ? event.args[0] : 'Speech recognition failed';
        const error = new Error(message);
        for (const entry of this.errorListeners.slice()) {
            entry.callback.call(entry.context, error);
        }
    };

    constructor(private readonly runtimeHandle: RuntimeSpeechRecognizer, scene: unknown) {
        this.scene = scene;
        this.subscribeRuntimeListeners();
    }

    public get enabled(): boolean {
        return this.runtimeHandle.enabled;
    }

    public set enabled(value: boolean) {
        this.runtimeHandle.enabled = value;
    }

    public bindScene(scene: unknown): void {
        this.scene = scene;
    }

    public start(): void {
        this.started = true;
        this.runtimeHandle.start();
    }

    public stop(): void {
        this.started = false;
        this.runtimeHandle.stop();
    }

    public isStarted(): boolean {
        return this.started;
    }

    public onResult(callback: (text: string) => void, context?: object): void {
        this.resultListeners.push({callback, context});
    }

    public offResult(callback: (text: string) => void, context?: object): void {
        removeListener(this.resultListeners, callback, context);
    }

    public onError(callback: (error: Error) => void, context?: object): void {
        this.errorListeners.push({callback, context});
    }

    public offError(callback: (error: Error) => void, context?: object): void {
        removeListener(this.errorListeners, callback, context);
    }

    public destroy(): void {
        this.stop();
        this.unsubscribeRuntimeListeners();
        this.resultListeners.length = 0;
        this.errorListeners.length = 0;
        if (sharedWrapper === this) {
            sharedWrapper = null;
        }
    }

    private subscribeRuntimeListeners(): void {
        const successType = getRuntimeEventType('RecognizedSuccess');
        const failedType = getRuntimeEventType('RecognizedFailed');
        if (successType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(successType, this.onRuntimeResult, this);
        }
        if (failedType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(failedType, this.onRuntimeError, this);
        }
    }

    private unsubscribeRuntimeListeners(): void {
        const successType = getRuntimeEventType('RecognizedSuccess');
        const failedType = getRuntimeEventType('RecognizedFailed');
        if (successType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(successType, this.onRuntimeResult, this);
        }
        if (failedType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(failedType, this.onRuntimeError, this);
        }
    }
}

Game2D.injectInitHandler(() => {
    const builder = APJS.SpeechRecognition?.getOrCreateBuilder?.() as RuntimeSpeechRecognizerBuilder | null;
    builder?.setDetectorSource?.(APJS.AudioSourceType.Microphone, null);
    sharedRuntimeHandle = builder?.build?.() ?? null;
    if (!sharedRuntimeHandle) {
        console.warn(`${LOG_TAG} failed to build runtime recognizer during onInit`);
    }
});

export function createSpeechRecognizer(scene: unknown): SpeechRecognizer | null {
    if (!sharedRuntimeHandle) {
        console.warn(`${LOG_TAG} called before recognizer initialization`);
        return null;
    }
    if (!sharedWrapper) {
        sharedWrapper = new SharedSpeechRecognizer(sharedRuntimeHandle, scene);
    } else {
        sharedWrapper.bindScene(scene);
    }
    return sharedWrapper;
}

export function destroySpeechRecognizerHandle(
    handle: SpeechRecognizer | null | undefined,
): void {
    handle?.destroy();
}
