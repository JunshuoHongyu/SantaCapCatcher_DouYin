/**
 * Thin Agent-facing adapter for the AI conversation APJS runtime.
 * Generated gameplay scripts should use this file instead of constructing the
 * underlying postMessage/SSE protocol themselves.
 */

export interface AIConversationConfig {
    systemPrompt?: string;
    temperature?: number;
    maxResultLength?: number;
    openingRemarks?: string;
    interactionMode?: 'voice' | 'options';
    optionCount?: number;
    optionList?: string[];
    timeoutMs?: number;
    maxRounds?: number;
}

export interface AIConversationCallbacks {
    onStart?: (sessionId: string) => void;
    onDelta?: (delta: string, fullText: string) => void;
    onComplete?: (text: string) => void;
    onError?: (error: Error) => void;
}

export interface AIConversationSession {
    sendMessage(message: string, callbacks?: AIConversationCallbacks): void;
    cancel(): void;
    reset(): void;
    destroy(): void;
}

type AIConversationRuntime = {
    createSession(scene: unknown, config?: AIConversationConfig): AIConversationSession;
};

export function createAIConversation(
    scene: unknown,
    config?: AIConversationConfig,
): AIConversationSession {
    const runtime = APJS?.AIConversation as unknown as AIConversationRuntime | undefined;
    if (!runtime || typeof runtime.createSession !== 'function') {
        throw new Error('APJS.AIConversation is unavailable in the current runtime');
    }
    return runtime.createSession(scene, config);
}
