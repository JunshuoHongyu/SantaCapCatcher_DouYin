declare namespace APJS {
  /**
   * Gradient mode for eyelash color gradient.
   * - Horizontal (0): gradient applied horizontally across the lashes.
   * - Random (1): gradient applied with random distribution.
   */
  enum Eyelashes3DGradientMode {
    Horizontal,
    Random,
  }
  
  /**
   * Union type of all adjustable eyelash property keys.
   * Each key maps to a specific value type and valid range:
   *
   * | Key            | Value Type      | Range / Notes                                      |
   * |----------------|-----------------|----------------------------------------------------|
   * | UpperOffset    | Vector3f   | 3D offset for upper lashes                         |
   * | LowerOffset    | Vector3f   | 3D offset for lower lashes                         |
   * | BlinkRotation  | number          | 0 ~ 30 (degrees), max blink rotation angle         |
   * | Length         | number          | -1 ~ 1, morpher-driven length adjustment           |
   * | Curl           | number          | -1 ~ 1, morpher-driven curl adjustment             |
   * | Density        | number          | -1 ~ 1, shader-driven density (0.2 default in editor)|
   * | Texture        | Texture    | Base color texture resource                        |
   * | Color          | Color      | Base tint color (RGBA)                             |
   * | Opacity        | number          | 0 ~ 1, overall opacity                             |
   * | GradientColor  | Color      | Gradient tint color (RGBA)                         |
   * | GradientMode   | Eyelashes3DGradientMode | See {@link Eyelashes3DGradientMode} (0 = Horizontal, 1 = Random) |
   * | GradientFlip   | boolean         | Whether to flip gradient direction                 |
   */
  type Eyelashes3DPropertyKey = 'UpperOffset' | 'LowerOffset' | 'BlinkRotation' | 'Length' | 'Curl' | 'Density' | 'Texture' | 'Color' | 'Opacity' | 'GradientColor' | 'GradientMode' | 'GradientFlip';
  
  /**
   * Scope for property get/set operations.
   * - 'Both': applies to both eyes. Value must be an array of two elements [leftValue, rightValue].
   * - 'Left': applies to left eye only.
   * - 'Right': applies to right eye only.
   */
  type Eyelashes3DScopeKey = 'Both' | 'Left' | 'Right';
  
  /**
   * @class Eyelashes3D
   * @description Dynamic component for 3D eyelash rendering on face meshes.
   * Use {@link setProperty} and {@link getProperty} to adjust eyelash appearance at runtime.
   * See {@link Eyelashes3DPropertyKey} for the full list of adjustable properties, their value types, and valid ranges.
   */
  class Eyelashes3D extends DynamicComponent {
    protected constructor();
  
    /**
     * @description Retrieves a single eyelash property.
     *
     * @param {Eyelashes3DPropertyKey} type - Property key.
     * @param {Eyelashes3DScopeKey} scope - 'Both' (returns [left, right] array), 'Left', or 'Right'.
     * @returns {any} Single value for 'Left'/'Right'; [left, right] array for 'Both'.
     *                Returns undefined when type is invalid or scope is unrecognized.
     *                The runtime type of each value follows the property key — see {@link Eyelashes3DPropertyKey}.
     *
     * @example
     * const [leftOp, rightOp] = comp.getProperty('Opacity', 'Both') as [number, number];
     * @example
     * const leftCurl = comp.getProperty('Curl', 'Left');
     */
    getProperty(type: Eyelashes3DPropertyKey, scope: Eyelashes3DScopeKey): any;
  
    restoreInitialPose(): void;
  
    /**
     * @description Sets a single eyelash property.
     *
     * **Silent failure:** returns void with no error when value type mismatches the expected type,
     * or when scope is 'Both' but value is not an array of length 2.
     *
     * @param {Eyelashes3DPropertyKey} type - Property key.
     * @param {Eyelashes3DScopeKey} scope - 'Both' (value = [left, right] array), 'Left', or 'Right'.
     * @param {any} value - The value to set. Its runtime type must match the property key — see {@link Eyelashes3DPropertyKey}.
     * @returns {void}
     *
     * @example
     * comp.setProperty('GradientMode', 'Both', [0, 0]);      // Horizontal on both eyes
     * @example
     * comp.setProperty('Curl', 'Left', 0.5);                  // curl left eye only
     * @example
     * comp.setProperty('BlinkRotation', 'Both', [15, 15]);    // 15 degrees both eyes
     */
    setProperty(type: Eyelashes3DPropertyKey, scope: Eyelashes3DScopeKey, value: any): void;
  }
}