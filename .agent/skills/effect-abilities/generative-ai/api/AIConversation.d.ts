/**
 * Public Agent-facing API for streamed AI text conversations.
 *
 * Recommended usage:
 * 1. Call `createAIConversation(scene, config)` once during scene setup and
 *    retain the returned session.
 * 2. Call `session.sendMessage(...)` when the user confirms an input.
 * 3. Render the `fullText` supplied by `onDelta` for streaming UI updates.
 * 4. Restore interactive state in both `onComplete` and `onError`.
 * 5. Call `reset()` when starting a new conversation without inherited context,
 *    and call `destroy()` when the owning scene or gameplay object is destroyed.
 *
 * @example
 * ```ts
 * import {createAIConversation, AIConversationSession} from './UserScriptRuntime/AIConversation';
 *
 * class MainScene {
 *   private conversation?: AIConversationSession;
 *
 *   create(): void {
 *     this.conversation = createAIConversation(this, {
 *       systemPrompt: '你是一名简洁、友好的游戏主持人，只输出玩家可见文案。',
 *       openingRemarks: '主持人到位，准备好接受挑战了吗？',
 *       temperature: 0.7,
 *       maxResultLength: 35,
 *       interactionMode: 'voice',
 *     });
 *   }
 *
 *   ask(text: string): void {
 *     this.conversation?.sendMessage(text, {
 *       onDelta: (_delta, fullText) => this.updateAnswer(fullText),
 *       onComplete: answer => this.finishAnswer(answer),
 *       onError: () => this.showFallbackAnswer(),
 *     });
 *   }
 * }
 * ```
 *
 * Runtime rules:
 * - Send messages sequentially within one session. Do not send another message
 *   until the current request completes or fails.
 * - Every request needs loading UI, a readable fallback, and error handling.
 * - Streaming requests are globally serialized by the current runtime.
 * - `cancel()` is a soft cancel: callbacks stop, but the transport may continue
 *   until a terminal response or timeout releases the global stream slot.
 * - Generated gameplay code must use this adapter instead of directly accessing
 *   `APJS.AIConversation`, constructing 0x29/SSE payloads, or copying fixed IDs.
 */
export interface AIConversationConfig {
    /** Complete role/system instruction used for every message in this session. */
    systemPrompt?: string;
    /** Sampling temperature in [0, 2]. Defaults to 0.7. */
    temperature?: number;
    /** Target reply length, clamped to [1, 200]. Defaults to 35. */
    maxResultLength?: number;
    /** Initial character line. Defaults to an empty string. */
    openingRemarks?: string;
    /** Conversation output mode. Defaults to `voice`. */
    interactionMode?: 'voice' | 'options';
    /** Number of generated choices in options mode, clamped to [2, 4]. Defaults to 4. */
    optionCount?: number;
    /** Initial choices appended to the opening line in options mode. */
    optionList?: string[];
    /** Request inactivity timeout in milliseconds. Defaults to 60000. */
    timeoutMs?: number;
    /** Maximum successful conversation rounds retained by this session. */
    maxRounds?: number;
}
export interface AIConversationCallbacks {
    /** Called after the backend establishes or resumes a conversation session. */
    onStart?: (sessionId: string) => void;
    /** Called for each text chunk. Render `fullText`, not only `delta`. */
    onDelta?: (delta: string, fullText: string) => void;
    /** Called once with the complete generated text. */
    onComplete?: (text: string) => void;
    /** Called on validation, transport, review, backend, or timeout failures. */
    onError?: (error: Error) => void;
}
export interface AIConversationSession {
    /** Sends one message. A session accepts only one pending message at a time. */
    sendMessage(message: string, callbacks?: AIConversationCallbacks): void;
    /** Soft-cancels delivery for the current request. */
    cancel(): void;
    /** Clears conversation context so the next request starts from round one. */
    reset(): void;
    /** Cancels pending delivery, clears context, and permanently closes this wrapper. */
    destroy(): void;
}
/** Creates a multi-round AI conversation session for the current scene. */
export declare function createAIConversation(scene: unknown, config?: AIConversationConfig): AIConversationSession;
