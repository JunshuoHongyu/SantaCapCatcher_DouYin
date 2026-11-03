/** Text-to-speech adapter for generated gameplay scripts. */

import {Game2D} from './Game2D';

/** Business voice allowlist. Values are the official user-facing Chinese names. */
export const SpeechVoice = {
    /** 清新女声 */
    FreshFemale: '清新女声',
    /** 熊二 */
    BearTwo: '熊二',
    /** 猴哥 */
    MonkeyBrother: '猴哥',
    /** 娇羞猴哥 */
    ShyMonkeyBrother: '娇羞猴哥',
    /** 四郎 */
    Emperor: '四郎',
    /** 娇媚女主 */
    CharmingHeroine: '娇媚女主',
    /** 小孩 */
    Child: '小孩',
    /** 港剧女声 */
    HongKongDramaFemale: '港剧女声',
    /** 懒小羊 */
    LazyLittleSheep: '懒小羊',
    /** 春日姐姐 */
    SpringSister: '春日姐姐',
    /** 这英 */
    ZheYing: '这英',
    /** 夹子音 */
    SweetNasalVoice: '夹子音',
    /** 咆哮哥 */
    RoaringBrother: '咆哮哥',
    /** 华妃 */
    ConcubineHua: '华妃',
    /** 紫薇说唱 */
    ZiweiRap: '紫薇说唱',
    /** 暖心哥哥 */
    WarmheartedBrother: '暖心哥哥',
    /** 文艺女声 */
    ArtisticFemale: '文艺女声',
    /** 猴哥说唱 */
    MonkeyBrotherRap: '猴哥说唱',
    /** 清爽男大 */
    RefreshingMaleAdult: '清爽男大',
    /** 文艺男声 */
    ArtisticMale: '文艺男声',
    /** 水果舞曲 */
    FruitDance: '水果舞曲',
    /** 康康舞曲 */
    KangkangDance: '康康舞曲',
    /** 歌唱达人 */
    SingingExpert: '歌唱达人',
    /** 摇滚男生 */
    RockMale: '摇滚男生',
    /** 说唱小哥 */
    Rapper: '说唱小哥',
} as const;

export type SpeechVoice = typeof SpeechVoice[keyof typeof SpeechVoice];

export interface TextToSpeechOptions {
    voice?: SpeechVoice;
    speed?: number;
}

export interface TextToSpeechCallbacks {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
}

export interface TextToSpeech {
    speak(text: string, options?: TextToSpeechOptions, callbacks?: TextToSpeechCallbacks): boolean;
    stop(): void;
    pause(): void;
    resume(): void;
    destroy(): void;
}

type RuntimeEvent = {args?: unknown[]};
type RuntimeEventEmitter = {
    on?: (eventType: number, callback: (event: RuntimeEvent) => void, context?: object) => void;
    off?: (eventType: number, callback: (event: RuntimeEvent) => void, context?: object) => void;
};
type RuntimeTextToSpeech = {
    enabled: boolean;
    speed: number;
    eventEmitter?: RuntimeEventEmitter;
    synthesize(
        text: string,
        voice: string,
        onSuccess: () => void,
        onFail: (message: string) => void,
    ): boolean;
    play(): void;
    stop(): void;
    pause(): void;
    resume(): void;
};
type RuntimeTextToSpeechBuilder = {build?: () => RuntimeTextToSpeech | null};
type SpeechTextAPI = {report?: (scene: unknown, text: string) => boolean};
type ActiveSpeech = {text: string; callbacks?: TextToSpeechCallbacks};

const LOG_TAG = '[TextToSpeech]';
const MAX_TEXT_BYTES = 1024;
const DEFAULT_VOICE = SpeechVoice.FreshFemale;
const VOICE_ID_BY_NAME: Record<SpeechVoice, string> = {
    [SpeechVoice.FreshFemale]: 'xiaomei',
    [SpeechVoice.BearTwo]: 'zh_male_xionger',
    [SpeechVoice.MonkeyBrother]: 'zh_male_sunwukong_clone2',
    [SpeechVoice.ShyMonkeyBrother]: 'zh_male_hougedaiyu',
    [SpeechVoice.Emperor]: 'zh_male_silang',
    [SpeechVoice.CharmingHeroine]: 'zh_female_yangmi',
    [SpeechVoice.Child]: 'zh_female_xiaopengyou',
    [SpeechVoice.HongKongDramaFemale]: 'BV409_streaming',
    [SpeechVoice.LazyLittleSheep]: 'BV426_streaming',
    [SpeechVoice.SpringSister]: 'zh_female_jiyejizi',
    [SpeechVoice.ZheYing]: 'zh_female_naying',
    [SpeechVoice.SweetNasalVoice]: 'zh_female_jiazi',
    [SpeechVoice.RoaringBrother]: 'BV144_streaming',
    [SpeechVoice.ConcubineHua]: 'zh_female_huafei',
    [SpeechVoice.ZiweiRap]: 'zh_female_ziwei_rap',
    [SpeechVoice.WarmheartedBrother]: 'zh_male_inspirational',
    [SpeechVoice.ArtisticFemale]: 'BV428_streaming',
    [SpeechVoice.MonkeyBrotherRap]: 'zh_male_sunwukong_rap',
    [SpeechVoice.RefreshingMaleAdult]: 'BV452_streaming',
    [SpeechVoice.ArtisticMale]: 'zh_male_wenyinan',
    [SpeechVoice.FruitDance]: 'VOV201_bytesing3_shuiguowuqu',
    [SpeechVoice.KangkangDance]: 'VOV201_bytesing3_kangkangwuqu',
    [SpeechVoice.SingingExpert]: 'VOV106_bytesing3_aidelizan',
    [SpeechVoice.RockMale]: 'VOV106_bytesing3_kaqiusha',
    [SpeechVoice.Rapper]: 'BR001_streaming',
};
let sharedRuntimeHandle: RuntimeTextToSpeech | null = null;
let sharedWrapper: SharedTextToSpeech | null = null;

const getUtf8ByteLength = (text: string): number => {
    let bytes = 0;
    for (const char of text) {
        const codePoint = char.codePointAt(0) ?? 0;
        bytes += codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
    }
    return bytes;
};

const isSpeechVoice = (voice: unknown): voice is SpeechVoice => {
    if (typeof voice !== 'string') {
        return false;
    }
    for (const key of Object.keys(SpeechVoice)) {
        if (SpeechVoice[key as keyof typeof SpeechVoice] === voice) {
            return true;
        }
    }
    return false;
};

const getRuntimeEventType = (
    name: 'SynthesisSucceeded' | 'PlaybackStarted' | 'PlaybackEnded',
): number | undefined => APJS.TextToSpeechEventType?.[name];

const reportSensorText = (scene: unknown, text: string): void => {
    const speechText = APJS.SpeechText as unknown as SpeechTextAPI | undefined;
    speechText?.report?.(scene, text);
};

class SharedTextToSpeech implements TextToSpeech {
    private scene: unknown;
    private activeSpeech: ActiveSpeech | null = null;

    private readonly onSynthesisSucceeded = (event: RuntimeEvent): void => {
        const text = typeof event.args?.[0] === 'string' ? event.args[0] : '';
        if (text) {
            reportSensorText(this.scene, text);
        }
    };

    private readonly onPlaybackStarted = (): void => {
        this.activeSpeech?.callbacks?.onStart?.();
    };

    private readonly onPlaybackEnded = (): void => {
        const activeSpeech = this.activeSpeech;
        this.activeSpeech = null;
        activeSpeech?.callbacks?.onEnd?.();
    };

    constructor(private readonly runtimeHandle: RuntimeTextToSpeech, scene: unknown) {
        this.scene = scene;
        this.subscribeRuntimeListeners();
    }

    public bindScene(scene: unknown): void {
        this.scene = scene;
    }

    public speak(
        text: string,
        options?: TextToSpeechOptions,
        callbacks?: TextToSpeechCallbacks,
    ): boolean {
        if (typeof text !== 'string' || text.length === 0) {
            callbacks?.onError?.(new Error('Text is empty'));
            return false;
        }
        if (getUtf8ByteLength(text) > MAX_TEXT_BYTES) {
            callbacks?.onError?.(new Error(`Text exceeds ${MAX_TEXT_BYTES} UTF-8 bytes`));
            return false;
        }
        const voice = options?.voice ?? DEFAULT_VOICE;
        if (!isSpeechVoice(voice)) {
            callbacks?.onError?.(new Error('Unsupported voice'));
            return false;
        }
        const speed = options?.speed ?? 1;
        if (!Number.isFinite(speed) || speed < 0.5 || speed > 2) {
            callbacks?.onError?.(new Error('Speed must be between 0.5 and 2.0'));
            return false;
        }

        this.activeSpeech = {text, callbacks};
        this.runtimeHandle.speed = speed;
        const accepted = this.runtimeHandle.synthesize(
            text,
            VOICE_ID_BY_NAME[voice],
            () => {
                if (this.activeSpeech?.text === text) {
                    this.runtimeHandle.play();
                }
            },
            message => {
                if (this.activeSpeech?.text !== text) {
                    return;
                }
                const activeSpeech = this.activeSpeech;
                this.activeSpeech = null;
                activeSpeech.callbacks?.onError?.(new Error(message));
            },
        );
        if (!accepted && this.activeSpeech?.text === text) {
            this.activeSpeech = null;
        }
        return accepted;
    }

    public stop(): void {
        this.activeSpeech = null;
        this.runtimeHandle.stop();
    }

    public pause(): void {
        this.runtimeHandle.pause();
    }

    public resume(): void {
        this.runtimeHandle.resume();
    }

    public destroy(): void {
        this.stop();
        this.unsubscribeRuntimeListeners();
        if (sharedWrapper === this) {
            sharedWrapper = null;
        }
    }

    private subscribeRuntimeListeners(): void {
        const synthesisType = getRuntimeEventType('SynthesisSucceeded');
        const startType = getRuntimeEventType('PlaybackStarted');
        const endType = getRuntimeEventType('PlaybackEnded');
        if (synthesisType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(synthesisType, this.onSynthesisSucceeded, this);
        }
        if (startType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(startType, this.onPlaybackStarted, this);
        }
        if (endType !== undefined) {
            this.runtimeHandle.eventEmitter?.on?.(endType, this.onPlaybackEnded, this);
        }
    }

    private unsubscribeRuntimeListeners(): void {
        const synthesisType = getRuntimeEventType('SynthesisSucceeded');
        const startType = getRuntimeEventType('PlaybackStarted');
        const endType = getRuntimeEventType('PlaybackEnded');
        if (synthesisType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(synthesisType, this.onSynthesisSucceeded, this);
        }
        if (startType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(startType, this.onPlaybackStarted, this);
        }
        if (endType !== undefined) {
            this.runtimeHandle.eventEmitter?.off?.(endType, this.onPlaybackEnded, this);
        }
    }
}

Game2D.injectInitHandler(() => {
    const builder = APJS.TextToSpeech?.createBuilder?.() as RuntimeTextToSpeechBuilder | null;
    sharedRuntimeHandle = builder?.build?.() ?? null;
    if (!sharedRuntimeHandle) {
        console.warn(`${LOG_TAG} failed to build runtime synthesizer during onInit`);
    }
});

export function createTextToSpeech(scene: unknown): TextToSpeech | null {
    if (!sharedRuntimeHandle) {
        console.warn(`${LOG_TAG} called before synthesizer initialization`);
        return null;
    }
    if (!sharedWrapper) {
        sharedWrapper = new SharedTextToSpeech(sharedRuntimeHandle, scene);
    } else {
        sharedWrapper.bindScene(scene);
    }
    return sharedWrapper;
}

export function destroyTextToSpeechHandle(handle: TextToSpeech | null | undefined): void {
    handle?.destroy();
}
