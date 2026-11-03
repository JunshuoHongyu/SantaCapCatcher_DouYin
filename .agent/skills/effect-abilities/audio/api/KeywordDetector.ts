/**
 * Keyword-detection audio entry for generated gameplay scripts.
 *
 * Use this only when the design explicitly needs keyword detection / keyword
 * spotting logic. Import the helpers from `./KeywordDetector` and register
 * target keywords before starting detection.
 *
 * Runtime usage rules:
 * - Register keywords before starting detection.
 * - Choose the correct keyword type: `chineseWord`, `chinesePinyin`, or
 *   `englishWord`.
 * - Use hit/miss callbacks for gameplay feedback; keep fallback UI behavior in
 *   gameplay code.
 * IMPORTANT:
 * - Implementation: Wraps `APJS.AudioDetectionModule` with shared keyword handles.
 * - Constraints: Requires keywords registration before `onInit` or `start`.
 * - Maintenance: This file is a provided runtime adapter; do not modify it from
 *   gameplay scripts.
 */

import {Game2D} from './Game2D';

const KEYWORD_DETECTOR_LOG_TAG = '[KeywordDetector]';

export type AudioSourceType = number;
export type KeywordType = 'chineseWord' | 'chinesePinyin' | 'englishWord';

type AudioSourceNodeLike = {
    getSourceNode?: () => unknown;
};

type RuntimeKeywordEvent = {
    args?: unknown[];
};

type RuntimeKeywordEventEmitter = {
    on?: (eventType: number, callback: (event: RuntimeKeywordEvent) => void, context?: object) => void;
    off?: (eventType: number, callback: (event: RuntimeKeywordEvent) => void, context?: object) => void;
};

type RuntimeKeywordDetector = {
    enabled: boolean;
    targetKeywords: string[];
    eventEmitter?: RuntimeKeywordEventEmitter;
    destroy?: () => void;
};

type KeywordBuilderLike = {
    setDetectorSource?: (
        type: AudioSourceType,
        audioComponent: AudioComponentLike | null,
    ) => KeywordBuilderLike;
    setKeywordType?: (type: number) => KeywordBuilderLike;
    build?: () => RuntimeKeywordDetector | null;
};

export interface AudioComponentLike {
    getAudioClipPlayer?: () => AudioSourceNodeLike | null;
}

export interface AudioSourceOptions {
    sourceType?: AudioSourceType;
    audioComponent?: AudioComponentLike | null;
}

export interface KeywordDetectionOptions extends AudioSourceOptions {
    keywordType?: KeywordType;
}

export interface KeywordDetector {
    enabled: boolean;
    keywordType: KeywordType;
    start(): void;
    stop(): void;
    isStarted(): boolean;
    setTargetKeywords(keywords: string[]): void;
    getTargetKeywords(): string[];
    onKeywordHit(callback: (keywords: string[]) => void, context?: object): void;
    offKeywordHit(callback: (keywords: string[]) => void, context?: object): void;
    onKeywordMiss(callback: () => void, context?: object): void;
    offKeywordMiss(callback: () => void, context?: object): void;
    destroy(): void;
}

type KeywordDestroyable = KeywordDetector | null | undefined;

type ListenerEntry<TValue> = {
    callback: (value: TValue) => void;
    context?: object;
};

type VoidListenerEntry = {
    callback: () => void;
    context?: object;
};

const DEFAULT_MICROPHONE_SOURCE_TYPE = APJS.AudioSourceType.Microphone;
const DEFAULT_KEYWORD_TYPE: KeywordType = 'chineseWord';

let registeredKeywordOptions: KeywordDetectionOptions = {
    sourceType: DEFAULT_MICROPHONE_SOURCE_TYPE,
    audioComponent: null,
    keywordType: DEFAULT_KEYWORD_TYPE,
};
let builtKeywordOptions: KeywordDetectionOptions | null = null;
let keywordInitDidRun = false;
let sharedKeywordRuntimeHandle: RuntimeKeywordDetector | null = null;
let sharedKeywordDetectorWrapper: SharedKeywordDetector | null = null;

const normalizeKeywordType = (keywordType?: KeywordType): KeywordType => {
    switch (keywordType) {
        case 'chinesePinyin':
            return 'chinesePinyin';
        case 'englishWord':
            return 'englishWord';
        case 'chineseWord':
        default:
            return DEFAULT_KEYWORD_TYPE;
    }
};

const normalizeKeywordDetectionOptions = (
    options?: KeywordDetectionOptions,
): KeywordDetectionOptions => {
    return {
        sourceType: options?.sourceType ?? DEFAULT_MICROPHONE_SOURCE_TYPE,
        audioComponent: options?.audioComponent ?? null,
        keywordType: normalizeKeywordType(options?.keywordType),
    };
};

const isSameKeywordDetectionOptions = (
    left?: KeywordDetectionOptions,
    right?: KeywordDetectionOptions,
): boolean => {
    const normalizedLeft = normalizeKeywordDetectionOptions(left);
    const normalizedRight = normalizeKeywordDetectionOptions(right);
    return normalizedLeft.sourceType === normalizedRight.sourceType
        && normalizedLeft.audioComponent === normalizedRight.audioComponent
        && normalizedLeft.keywordType === normalizedRight.keywordType;
};

const toKeywordList = (keywords: string[]): string[] => {
    const normalized: string[] = [];
    const seen = new Set<string>();
    for (const keyword of keywords) {
        if (typeof keyword !== 'string') {
            continue;
        }
        const trimmed = keyword.trim();
        if (!trimmed || seen.has(trimmed)) {
            continue;
        }
        normalized.push(trimmed);
        seen.add(trimmed);
    }
    return normalized;
};

const getRuntimeKeywordTypeValue = (keywordType: KeywordType): number | undefined => {
    switch (keywordType) {
        case 'chinesePinyin':
            return APJS.KeywordType?.ChinesePinyin;
        case 'englishWord':
            return APJS.KeywordType?.EnglishWord;
        case 'chineseWord':
        default:
            return APJS.KeywordType?.ChineseWord;
    }
};

const getRuntimeKeywordEventType = (eventName: 'KeywordHit' | 'KeywordMiss'): number | undefined => {
    return APJS.KeywordEventType?.[eventName];
};

const getKeywordDetectionBuilder = (): KeywordBuilderLike | null => {
    const detectionType = APJS.AudioDetectionType?.Keyword;
    const builder = APJS.AudioDetectionModule?.getOrCreateAudioDetectionBuilder?.(detectionType) as KeywordBuilderLike | null;
    if (!builder) {
        console.warn(`${KEYWORD_DETECTOR_LOG_TAG} keyword builder unavailable`);
        return null;
    }
    return builder;
};

const buildKeywordRuntimeHandle = (options?: KeywordDetectionOptions): RuntimeKeywordDetector | null => {
    const normalizedOptions = normalizeKeywordDetectionOptions(options);
    const builder = getKeywordDetectionBuilder();
    if (!builder) {
        return null;
    }
    const runtimeKeywordType = getRuntimeKeywordTypeValue(
        normalizedOptions.keywordType ?? DEFAULT_KEYWORD_TYPE,
    );
    if (runtimeKeywordType === undefined) {
        console.warn(`${KEYWORD_DETECTOR_LOG_TAG} keyword type unavailable`, normalizedOptions.keywordType);
        return null;
    }
    builder.setDetectorSource?.(normalizedOptions.sourceType ?? DEFAULT_MICROPHONE_SOURCE_TYPE, normalizedOptions.audioComponent ?? null);
    builder.setKeywordType?.(runtimeKeywordType);
    return builder.build?.() ?? null;
};

const emitKeywordListeners = (entries: Array<ListenerEntry<string[]>>, keywords: string[]): void => {
    for (const entry of entries.slice()) {
        try {
            entry.callback.call(entry.context, keywords);
        } catch (error) {
            console.warn(`${KEYWORD_DETECTOR_LOG_TAG} keyword hit listener failed`, error);
        }
    }
};

const emitKeywordMissListeners = (entries: Array<VoidListenerEntry>): void => {
    for (const entry of entries.slice()) {
        try {
            entry.callback.call(entry.context);
        } catch (error) {
            console.warn(`${KEYWORD_DETECTOR_LOG_TAG} keyword miss listener failed`, error);
        }
    }
};

class SharedKeywordDetector implements KeywordDetector {
    public enabled = true;
    public readonly keywordType: KeywordType;

    private readonly hitListeners: Array<ListenerEntry<string[]>> = [];
    private readonly missListeners: Array<VoidListenerEntry> = [];
    private targetKeywords: string[] = [];
    private readonly onRuntimeKeywordHit = (event: RuntimeKeywordEvent): void => {
        const eventArgs = event?.args ?? [];
        const rawKeywords = Array.isArray(eventArgs[0]) ? eventArgs[0] : [];
        const keywords = Array.isArray(rawKeywords)
            ? rawKeywords.filter((value): value is string => typeof value === 'string')
            : [];
        emitKeywordListeners(this.hitListeners, keywords);
    };
    private readonly onRuntimeKeywordMiss = (): void => {
        emitKeywordMissListeners(this.missListeners);
    };

    constructor(
        private readonly runtimeHandle: RuntimeKeywordDetector,
        options?: KeywordDetectionOptions,
    ) {
        this.keywordType = normalizeKeywordType(options?.keywordType);
        this.targetKeywords = toKeywordList(Array.isArray(runtimeHandle.targetKeywords) ? runtimeHandle.targetKeywords : []);
        this.runtimeHandle.enabled = this.enabled;
        this.runtimeHandle.targetKeywords = this.targetKeywords.slice();
        this.subscribeRuntimeListeners();
    }

    public start(): void {
        this.enabled = true;
        this.runtimeHandle.enabled = true;
    }

    public stop(): void {
        this.enabled = false;
        this.runtimeHandle.enabled = false;
    }

    public isStarted(): boolean {
        return this.enabled;
    }

    public setTargetKeywords(keywords: string[]): void {
        this.targetKeywords = toKeywordList(keywords);
        this.runtimeHandle.targetKeywords = this.targetKeywords.slice();
    }

    public getTargetKeywords(): string[] {
        return this.targetKeywords.slice();
    }

    public onKeywordHit(callback: (keywords: string[]) => void, context?: object): void {
        this.hitListeners.push({callback, context});
    }

    public offKeywordHit(callback: (keywords: string[]) => void, context?: object): void {
        const index = this.hitListeners.findIndex(entry => entry.callback === callback && entry.context === context);
        if (index >= 0) {
            this.hitListeners.splice(index, 1);
        }
    }

    public onKeywordMiss(callback: () => void, context?: object): void {
        this.missListeners.push({callback, context});
    }

    public offKeywordMiss(callback: () => void, context?: object): void {
        const index = this.missListeners.findIndex(entry => entry.callback === callback && entry.context === context);
        if (index >= 0) {
            this.missListeners.splice(index, 1);
        }
    }

    public destroy(): void {
        this.stop();
        this.setTargetKeywords([]);
        this.unsubscribeRuntimeListeners();
        this.hitListeners.length = 0;
        this.missListeners.length = 0;
        if (sharedKeywordDetectorWrapper === this) {
            sharedKeywordDetectorWrapper = null;
        }
    }

    private subscribeRuntimeListeners(): void {
        const hitEventType = getRuntimeKeywordEventType('KeywordHit');
        const missEventType = getRuntimeKeywordEventType('KeywordMiss');
        if (hitEventType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(hitEventType, this.onRuntimeKeywordHit, this);
        }
        if (missEventType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(missEventType, this.onRuntimeKeywordMiss, this);
        }
    }

    private unsubscribeRuntimeListeners(): void {
        const hitEventType = getRuntimeKeywordEventType('KeywordHit');
        const missEventType = getRuntimeKeywordEventType('KeywordMiss');
        if (hitEventType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(hitEventType, this.onRuntimeKeywordHit, this);
        }
        if (missEventType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(missEventType, this.onRuntimeKeywordMiss, this);
        }
    }
}

Game2D.injectInitHandler(() => {
    keywordInitDidRun = true;
    builtKeywordOptions = normalizeKeywordDetectionOptions(registeredKeywordOptions);
    sharedKeywordRuntimeHandle = buildKeywordRuntimeHandle(builtKeywordOptions);
});

export const KeywordDetector = {
    registerKeywordDetectorInit(options?: KeywordDetectionOptions): void {
        const normalizedOptions = normalizeKeywordDetectionOptions(options);
        if (keywordInitDidRun) {
            if (!isSameKeywordDetectionOptions(builtKeywordOptions ?? undefined, normalizedOptions)) {
                console.warn(`${KEYWORD_DETECTOR_LOG_TAG} registerKeywordDetectorInit ignored after onInit`, normalizedOptions);
            }
            return;
        }
        registeredKeywordOptions = normalizedOptions;
    },

    createKeywordDetector(options?: KeywordDetectionOptions): KeywordDetector | null {
        const normalizedOptions = normalizeKeywordDetectionOptions(options);
        if (!isSameKeywordDetectionOptions(builtKeywordOptions ?? undefined, normalizedOptions)) {
            console.warn(`${KEYWORD_DETECTOR_LOG_TAG} createKeywordDetector option mismatch`, {
                built: builtKeywordOptions,
                next: normalizedOptions,
            });
            return null;
        }
        if (!sharedKeywordRuntimeHandle) {
            console.warn(`${KEYWORD_DETECTOR_LOG_TAG} createKeywordDetector called before keyword detector build`);
            return null;
        }
        if (!sharedKeywordDetectorWrapper) {
            sharedKeywordDetectorWrapper = new SharedKeywordDetector(sharedKeywordRuntimeHandle, builtKeywordOptions ?? normalizedOptions);
        }
        return sharedKeywordDetectorWrapper;
    },
};

/**
 * Register keyword detection initialization before `Game2D.onInit` runs.
 * Keep this for custom keyword type or custom source configuration.
 */
export function registerKeywordDetectorInit(options?: KeywordDetectionOptions): void {
    KeywordDetector.registerKeywordDetectorInit(options);
}

/**
 * Create the shared keyword detector that was already prepared for `Game2D.onInit`.
 * The default path uses microphone + Chinese word mode with no arguments.
 */
export function createKeywordDetector(options?: KeywordDetectionOptions): KeywordDetector | null {
    return KeywordDetector.createKeywordDetector(options);
}

export function destroyKeywordDetectorHandle(handle: KeywordDestroyable): void {
    try {
        handle?.destroy();
    } catch (error) {
        console.warn('[KeywordDetector] destroyKeywordDetectorHandle failed', error);
    }
}
