/**
 * Business voice allowlist. Values are the official user-facing Chinese names.
 * 向用户介绍或确认音色时，只使用这里的正式中文名，不展示或猜测底层服务标识。
 */
export declare const SpeechVoice: {
    /** 清新女声 */
    readonly FreshFemale: "清新女声";
    /** 熊二 */
    readonly BearTwo: "熊二";
    /** 猴哥 */
    readonly MonkeyBrother: "猴哥";
    /** 娇羞猴哥 */
    readonly ShyMonkeyBrother: "娇羞猴哥";
    /** 四郎 */
    readonly Emperor: "四郎";
    /** 娇媚女主 */
    readonly CharmingHeroine: "娇媚女主";
    /** 小孩 */
    readonly Child: "小孩";
    /** 港剧女声 */
    readonly HongKongDramaFemale: "港剧女声";
    /** 懒小羊 */
    readonly LazyLittleSheep: "懒小羊";
    /** 春日姐姐 */
    readonly SpringSister: "春日姐姐";
    /** 这英 */
    readonly ZheYing: "这英";
    /** 夹子音 */
    readonly SweetNasalVoice: "夹子音";
    /** 咆哮哥 */
    readonly RoaringBrother: "咆哮哥";
    /** 华妃 */
    readonly ConcubineHua: "华妃";
    /** 紫薇说唱 */
    readonly ZiweiRap: "紫薇说唱";
    /** 暖心哥哥 */
    readonly WarmheartedBrother: "暖心哥哥";
    /** 文艺女声 */
    readonly ArtisticFemale: "文艺女声";
    /** 猴哥说唱 */
    readonly MonkeyBrotherRap: "猴哥说唱";
    /** 清爽男大 */
    readonly RefreshingMaleAdult: "清爽男大";
    /** 文艺男声 */
    readonly ArtisticMale: "文艺男声";
    /** 水果舞曲 */
    readonly FruitDance: "水果舞曲";
    /** 康康舞曲 */
    readonly KangkangDance: "康康舞曲";
    /** 歌唱达人 */
    readonly SingingExpert: "歌唱达人";
    /** 摇滚男生 */
    readonly RockMale: "摇滚男生";
    /** 说唱小哥 */
    readonly Rapper: "说唱小哥";
};

export type SpeechVoice = typeof SpeechVoice[keyof typeof SpeechVoice];

export interface TextToSpeechOptions {
    /** Defaults to SpeechVoice.FreshFemale ("清新女声"). Only SpeechVoice values are accepted. */
    voice?: SpeechVoice;
    /** Defaults to 1. Must be finite and within [0.5, 2]; not rounded to 0.1 steps. */
    speed?: number;
}

export interface TextToSpeechCallbacks {
    /** Source installed and play() invoked; not confirmation that sound has reached the speaker. */
    onStart?: () => void;
    /** Natural playback completion only; not emitted for stop(), replacement or destroy(). */
    onEnd?: () => void;
    /** Immediate rejection is reported synchronously; later synthesis/install failures asynchronously. */
    onError?: (error: Error) => void;
}

/**
 * Shared online speech output for dynamic runtime text; requires network access.
 * Prefer prerecorded audio for fixed lines. Gameplay owns stopping on recording
 * end and coordinating microphone recognition with speech output.
 * 半双工对话由玩法编排：播报前停止识别，播放自然结束后才重新允许用户输入；
 * onError 或主动取消也要退出等待状态，不能期待 stop() 触发 onEnd。
 */
export interface TextToSpeech {
    /**
     * Synthesizes and automatically plays 1-1024 UTF-8 bytes, not JS characters.
     * Text is neither trimmed nor truncated. Invalid text, voice or speed is
     * rejected before replacing an existing task; a valid new synthesis replaces
     * the previous task/playback without a queue.
     * Returns true when accepted, not when synthesis/playback finishes.
     * A rejection returns false and invokes the supplied onError synchronously;
     * do not handle the same failure twice via both the return value and callback.
     */
    speak(text: string, options?: TextToSpeechOptions, callbacks?: TextToSpeechCallbacks): boolean;
    /** Stops playback and ignores the in-flight result; does not cancel the native network request. */
    stop(): void;
    /** Pauses playback only; no-op during synthesis and does not prevent later automatic playback. */
    pause(): void;
    /** Resumes paused playback; no-op during synthesis. */
    resume(): void;
    /**
     * Stops the shared gameplay handle and removes its callbacks/listeners,
     * affecting all holders. Does not destroy the APJS synthesizer.
     * Discard this handle after cleanup; reacquire through the factory.
     */
    destroy(): void;
}

/**
 * Call from Game2D Scene.create() with that scene; the APJS synthesizer is prepared
 * earlier by Game2D.onInit. Returns null if runtime initialization is unavailable.
 * Repeated calls return the same handle and rebind its reporting scene, not an
 * independent player. Clean up the previous gameplay before switching scenes.
 */
export declare function createTextToSpeech(scene: unknown): TextToSpeech | null;

/** Null-safe destroy(); affects the shared gameplay handle, not the underlying APJS object. */
export declare function destroyTextToSpeechHandle(
    handle: TextToSpeech | null | undefined,
): void;
