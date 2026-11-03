declare namespace APJS {
  /**
   * @description The scope of applying the eye color effect.
   * @enum
   */
  enum EyeApplyingScope {
    BothEyes,
    LeftEyeOnly,
    RightEyeOnly,
  }
  
  /**
   * @class EyeColor
   * @extends DynamicComponent
   * @description Runtime iris-color effect component.
   * `makeupTexture` supplies the base treatment and `intensity` controls its alpha. The material
   * applies `color` only while `isOpacityEnabled` is `true`; in that mode `opacityTexture` also
   * modulates alpha. The optional reflection pass is blended after the base treatment, so a strong
   * reflection texture or intensity can visually cover part of the base color result.
   * {@link applyingScope} limits the mask to both eyes, only the left eye, or only the right eye.
   */
  class EyeColor extends DynamicComponent {
    protected constructor();
  
    /**
     * @description The scope to apply the eye color effect to, can be both eyes, left eye, or right eye.
     * @default EyeApplyingScope.BothEyes
     */
    applyingScope: EyeApplyingScope;
  
    /**
     * @description Tint multiplied with the makeup texture while {@link isOpacityEnabled} is
     * `true`. With opacity disabled, this value is still stored but does not affect rendering.
     * To make a runtime recolor visible, set {@link isOpacityEnabled} to `true` before assigning
     * the new color; this does not change {@link intensity} or {@link applyingScope}.
     * Reflection is composited afterward and may visually cover the tinted base treatment.
     * @default new Color(1, 1, 1, 1) // Opaque white
     */
    color: Color;
  
    /**
     * @description The intensity of the eye color effect. Higher values make the color effect more prominent. Range [0.0, 1.0]
     * @default 0.0
     */
    intensity: number;
  
    /**
     * @description Whether the opacity-and-color branch is enabled.
     * When `true`, the material multiplies the base treatment by {@link color} and uses
     * {@link opacityTexture} to modulate alpha. When `false`, both operations are skipped,
     * so changing `color` alone does not change the rendered result.
     * @default false
     */
    isOpacityEnabled: boolean;
  
    /**
     * @description Whether the optional eye-reflection pass is enabled.
     * The pass uses {@link reflectionTexture} and {@link reflectionIntensity} when enabled.
     * @default false
     */
    isReflectionEnabled: boolean;
  
    /**
     * @description Makeup texture used to define the eye color effect.
     * When `null`, the base color still comes from {@link color} and {@link intensity}, but no
     * extra makeup texture is provided to the material.
     * @default null
     */
    makeupTexture: Texture | null;
  
    /**
     * @description Opacity texture used to control transparency in different eye regions.
     * This texture is only consumed when {@link isOpacityEnabled} is `true`.
     * @default null
     */
    opacityTexture: Texture | null;
  
    /**
     * @description The intensity of the reflection effect. Range [0.0, 1.0]
     * This value only affects rendering when {@link isReflectionEnabled} is `true`.
     * @default 0.0
     */
    reflectionIntensity: number;
  
    /**
     * @description Reflection texture used to simulate eye shine effects.
     * This texture is only consumed when {@link isReflectionEnabled} is `true`.
     * @default null
     */
    reflectionTexture: Texture | null;
  }
}