declare namespace APJS {
  /**
   * @class Filter
   * @description Applies LUT color grading and manual color correction to the camera render target.
   * Numeric setters are forwarded without runtime clamping; use the documented supported ranges.
   * The shader stages included in the exported effect are determined by the Inspector configuration.
   */
  class Filter extends DynamicComponent {
    protected constructor();
  
    /**
     * @description Indicates whether the LUT stage was enabled in the Inspector and included when the
     * effect was exported.
     * @readonly
     */
    readonly lutEnabled: boolean;
  
    /**
     * @description Brightness in the supported range [-1, 1]. The shader adds this value directly to
     * RGB: 0 is unchanged, negative values darken, and positive values brighten. The shader does not
     * clamp intermediate RGB values.
     */
    get colorCorrectionBrightness(): number;
  
    set colorCorrectionBrightness(value: number);
  
    /**
     * @description Contrast in the supported range [-1, 1]. 0 is unchanged; -1 collapses RGB to the
     * shader midpoint and removes contrast; 1 doubles each channel's distance from that midpoint.
     * Negative values flatten differences and positive values strengthen them.
     */
    get colorCorrectionContrast(): number;
  
    set colorCorrectionContrast(value: number);
  
    /**
     * @description Indicates whether the color-correction stage was enabled in the Inspector and
     * included when the effect was exported.
     * @readonly
     */
    get colorCorrectionEnabled(): boolean;
  
    /**
     * @description Exposure in the supported range [-1, 1]. 0 is unchanged; -1 maps to -3 stops and
     * multiplies RGB by 1/8; 1 maps to +3 stops and multiplies RGB by 8. Larger values brighten
     * exponentially and smaller values darken exponentially.
     */
    get colorCorrectionExposure(): number;
  
    set colorCorrectionExposure(value: number);
  
    /**
     * @description Saturation in the supported range [-1, 1]. 0 is unchanged; -1 produces grayscale;
     * 1 doubles the color distance from grayscale. Negative values reduce colorfulness and positive
     * values increase it.
     */
    get colorCorrectionSaturation(): number;
  
    set colorCorrectionSaturation(value: number);
  
    /**
     * @description White-balance temperature in the supported range [-1, 1]. 0 is neutral; negative
     * values shift the image cooler by favoring blue; positive values shift it warmer by favoring red
     * and reducing blue. Larger absolute values produce a stronger shift.
     */
    get colorCorrectionTemperature(): number;
  
    set colorCorrectionTemperature(value: number);
  
    /**
     * @description White-balance tint in the supported range [-1, 1]. 0 is neutral; negative values
     * shift toward green; positive values shift toward magenta. Larger absolute values produce a
     * stronger shift.
     */
    get colorCorrectionTint(): number;
  
    set colorCorrectionTint(value: number);
  
    /**
     * @description LUT blend intensity in the supported range [0, 1]. 0 preserves the original camera
     * color; 1 uses the full LUT-transformed color for opaque pixels; intermediate values linearly
     * blend between them.
     */
    get lutIntensity(): number;
  
    set lutIntensity(value: number);
  
    /**
     * @description LUT texture sampled by the filter shader. The shader expects a 64-level 3D color
     * cube laid out as 8 by 8 tiles, conventionally in a 512 by 512 texture. null disables the LUT
     * contribution even when lutEnabled is true.
     */
    get lutTexture(): Texture | null;
  
    set lutTexture(value: Texture | null);
  }
}