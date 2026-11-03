export interface ImageCaptionOptions {
    texture: APJS.Texture;
    prompt?: string;
    temperature?: number;
    maxResultLength?: number;
    timeoutMs?: number;
    resolutionRatio?: number;
}

export interface CurrentFrameCaptionOptions {
    prompt?: string;
    temperature?: number;
    maxResultLength?: number;
    timeoutMs?: number;
    resolutionRatio?: number;
}

export interface TextGenerationOptions {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxResultLength?: number;
    timeoutMs?: number;
}

export interface ImageCaptionCallbacks {
    onStart?: () => void;
    onDelta?: (delta: string, fullText: string) => void;
    onComplete?: (text: string) => void;
    onError?: (error: Error) => void;
}

export interface ImageCaptionTask {
    cancel(): void;
}

type ImageCaptionRuntime = {
    generate(
        scene: unknown,
        options: ImageCaptionOptions,
        callbacks?: ImageCaptionCallbacks,
    ): ImageCaptionTask;
    generateCurrentFrame(
        scene: unknown,
        options: CurrentFrameCaptionOptions,
        callbacks?: ImageCaptionCallbacks,
    ): ImageCaptionTask;
    generateText(
        scene: unknown,
        options: TextGenerationOptions,
        callbacks?: ImageCaptionCallbacks,
    ): ImageCaptionTask;
};

function getRuntime(): ImageCaptionRuntime {
    const runtime = APJS?.ImageCaption as unknown as ImageCaptionRuntime | undefined;
    if (!runtime || typeof runtime.generate !== 'function') {
        throw new Error('APJS.ImageCaption is unavailable in the current runtime');
    }
    return runtime;
}

export function generateImageCaption(
    scene: unknown,
    options: ImageCaptionOptions,
    callbacks?: ImageCaptionCallbacks,
): ImageCaptionTask {
    return getRuntime().generate(scene, options, callbacks);
}

export function generateCurrentFrameCaption(
    scene: unknown,
    options: CurrentFrameCaptionOptions,
    callbacks?: ImageCaptionCallbacks,
): ImageCaptionTask {
    return getRuntime().generateCurrentFrame(scene, options, callbacks);
}

export function generateText(
    scene: unknown,
    options: TextGenerationOptions,
    callbacks?: ImageCaptionCallbacks,
): ImageCaptionTask {
    const runtime = getRuntime();
    if (typeof runtime.generateText !== 'function') {
        throw new Error('APJS.ImageCaption.generateText is unavailable in the current runtime');
    }
    return runtime.generateText(scene, options, callbacks);
}
