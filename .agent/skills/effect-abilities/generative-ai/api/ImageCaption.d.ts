/**
 * Input for generating a caption from an existing runtime texture.
 * The texture is copied before upload, so later changes to a RenderTexture do
 * not change the image used by the active request.
 */
export interface ImageCaptionOptions {
    /** Required image input. Static textures and runtime RenderTextures are supported. */
    texture: APJS.Texture;
    /**
     * Optional caption style and output requirement.
     * Keep it concise, for example: `幽默地点评画面，20字以内，只输出结果`.
     * When omitted, the workflow uses its default image-caption behavior.
     */
    prompt?: string;
    /** Creativity in [0, 1]. Defaults to 0.5. */
    temperature?: number;
    /** Expected output length in Chinese characters, clamped to [5, 100]. Defaults to 20. */
    maxResultLength?: number;
    /** Inactivity timeout in milliseconds. Defaults to 60000. */
    timeoutMs?: number;
    /** Image resolution multiplier in [0.1, 1]. Defaults to 1 for an existing texture. */
    resolutionRatio?: number;
}

/** Input for capturing the current scene output and generating its caption. */
export interface CurrentFrameCaptionOptions {
    /** Optional caption style and output requirement. */
    prompt?: string;
    /** Creativity in [0, 1]. Defaults to 0.5. */
    temperature?: number;
    /** Expected output length in Chinese characters, clamped to [5, 100]. Defaults to 20. */
    maxResultLength?: number;
    /** Inactivity timeout in milliseconds. Defaults to 60000. */
    timeoutMs?: number;
    /** Image resolution multiplier in [0.1, 1]. Use 0.5 when full resolution is unnecessary. */
    resolutionRatio?: number;
}

/** Input for generating standalone text without an image. */
export interface TextGenerationOptions {
    /**
     * Complete generation request, including topic, style, length and output format.
     * For example: `生成一句30字以内的赛博朋克风格获胜文案，只输出文案`.
     */
    prompt: string;
    /**
     * Optional stable role or output constraint. When omitted, the runtime uses
     * a single-turn text-generation prompt and asks the model to output only the result.
     */
    systemPrompt?: string;
    /** Creativity in [0, 2]. Defaults to 0.7. */
    temperature?: number;
    /** Expected output length, clamped to [1, 200]. Defaults to 35. */
    maxResultLength?: number;
    /** Inactivity timeout in milliseconds. Defaults to 60000. */
    timeoutMs?: number;
}

export interface ImageCaptionCallbacks {
    /** Called after the server accepts the streaming generation request. */
    onStart?: () => void;
    /** Called for each generated text chunk. Render `fullText` instead of appending `delta` blindly. */
    onDelta?: (delta: string, fullText: string) => void;
    /** Called once with the complete caption. */
    onComplete?: (text: string) => void;
    /** Called when validation, image upload, review, transport, parsing, or timeout fails. */
    onError?: (error: Error) => void;
}

export interface ImageCaptionTask {
    /**
     * Stops delivering callbacks. An already-sent network request may continue
     * internally until its terminal response or timeout releases the shared stream slot.
     */
    cancel(): void;
}

/**
 * Generates one caption from an existing texture.
 *
 * @example
 * ```ts
 * import {generateImageCaption} from './UserScriptRuntime/ImageCaption';
 *
 * const task = generateImageCaption(this, {
 *   texture: resultTexture,
 *   prompt: '幽默地点评画面，20字以内，只输出点评',
 *   maxResultLength: 20,
 * }, {
 *   onDelta: (_delta, fullText) => resultLabel.text = fullText,
 *   onComplete: text => console.log('caption=' + text),
 *   onError: error => console.error('caption failed=' + error.message),
 * });
 * ```
 *
 * Do not call this continuously from an update loop. Trigger it from a user
 * action or a clearly defined gameplay stage, and retain the returned task if
 * the request may need to be cancelled.
 */
export declare function generateImageCaption(
    scene: unknown,
    options: ImageCaptionOptions,
    callbacks?: ImageCaptionCallbacks,
): ImageCaptionTask;

/**
 * Captures the scene's final render output and generates one caption.
 * The implementation snapshots the output RenderTexture before asynchronous upload.
 *
 * @example
 * ```ts
 * import {generateCurrentFrameCaption} from './UserScriptRuntime/ImageCaption';
 *
 * generateCurrentFrameCaption(this, {
 *   prompt: '根据当前画面生成一句治愈文案，30字以内',
 *   resolutionRatio: 0.5,
 * }, {
 *   onDelta: (_delta, fullText) => resultLabel.text = fullText,
 *   onComplete: text => console.log('caption=' + text),
 *   onError: error => console.error('caption failed=' + error.message),
 * });
 * ```
 * The runtime captures the scene's final output texture. Do not create, find,
 * serialize, or bind a Camera solely for this API.
 */
export declare function generateCurrentFrameCaption(
    scene: unknown,
    options: CurrentFrameCaptionOptions,
    callbacks?: ImageCaptionCallbacks,
): ImageCaptionTask;

/**
 * Generates standalone text without capturing or uploading an image.
 * This is a single request: it does not retain conversation context and does
 * not require an AI conversation Profile.
 *
 * @example
 * ```ts
 * import {generateText} from './UserScriptRuntime/ImageCaption';
 *
 * generateText(this, {
 *   prompt: '生成一句30字以内的赛博朋克风格获胜文案，只输出文案',
 *   maxResultLength: 30,
 * }, {
 *   onDelta: (_delta, fullText) => resultLabel.text = fullText,
 *   onComplete: text => console.log('generated text=' + text),
 *   onError: error => console.error('text generation failed=' + error.message),
 * });
 * ```
 */
export declare function generateText(
    scene: unknown,
    options: TextGenerationOptions,
    callbacks?: ImageCaptionCallbacks,
): ImageCaptionTask;
