/**
 * Shared online microphone recognizer for generated gameplay scripts.
 * Requires microphone permission and network access. Gameplay owns when to stop
 * listening, including on recording end; STT/TTS coordination is not automatic.
 */
export interface SpeechRecognizer {
    /** Gates result/status updates only. Use stop(), not enabled=false, to end audio input. */
    enabled: boolean;
    /** Starts continuous recognition until stop(); receiving a final result does not stop it. */
    start(): void;
    /**
     * Stops audio input and subsequent result/status polling.
     * Does not flush the last utterance or clear extractor buffers. Rapid stop/start
     * does not guarantee isolation from results belonging to the previous capture.
     * A result already being dispatched can still reach its remaining listeners.
     *
     * 按住说话场景：松手不等于 ASR 已产生最终文本。不要在 pointerup 中先
     * stop() 再同步读取文本，并把空文本直接判为“没听清”；这会截断尚未返回的结果。
     * 松手时若尚无可提交的最终结果，标记待提交（例如 finalizing），保持识别开启，
     * 在 onResult 中接收最终文本后再 stop() 并提交。已有可提交的最终文本时可直接提交，
     * 不要无条件等待另一条回调。等待期间禁止重复开始一轮；录制结束、取消和错误退出
     * 仍需 stop() 并清理待提交状态。无内容不保证触发回调，保留玩法的无输入退出路径。
     */
    stop(): void;
    /** Requested start/stop state, not microphone permission or network/service health. */
    isStarted(): boolean;
    /**
     * Receives final text only, without interim results, confidence or exactly-once guarantees.
     * 按住说话的收尾状态也必须接收此回调，不能只允许 listening；参见 stop() 的说明。
     * 文字只能随最终识别结果更新，不能据此承诺逐字实时转写。
     */
    onResult(callback: (text: string) => void, context?: object): void;
    /** Removes one registration using the same callback and context passed to onResult. */
    offResult(callback: (text: string) => void, context?: object): void;
    /**
     * Receives reported service failures while recognition is running.
     * No recognized content is not an error: gameplay supplies its own waiting
     * timeout, retry prompt and exit condition. Listeners return no unsubscribe function.
     */
    onError(callback: (error: Error) => void, context?: object): void;
    /** Removes one registration using the same callback and context passed to onError. */
    offError(callback: (error: Error) => void, context?: object): void;
    /**
     * Stops recognition and removes all listeners on the shared gameplay handle,
     * including registrations made by other holders. Does not destroy the APJS
     * recognizer. Discard this handle after cleanup; reacquire through the factory.
     */
    destroy(): void;
}

/**
 * Call from Game2D Scene.create() with that scene; the APJS recognizer is prepared
 * earlier by Game2D.onInit. Returns null if runtime initialization is unavailable.
 * Repeated calls return the same handle and rebind its reporting scene, not an
 * independent recognizer. Clean up the previous gameplay before switching scenes.
 */
export declare function createSpeechRecognizer(scene: unknown): SpeechRecognizer | null;

/** Null-safe destroy(); affects the shared gameplay handle, not the underlying APJS object. */
export declare function destroySpeechRecognizerHandle(
    handle: SpeechRecognizer | null | undefined,
): void;
