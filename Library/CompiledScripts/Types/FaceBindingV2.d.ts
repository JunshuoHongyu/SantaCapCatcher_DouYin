declare namespace APJS {
  /**
   * @description Face binding anchor types with corresponding vertex indices in standard face mesh.
   * <br/> **IMPORTANT**: Prefer preset anchors over Custom when possible.
   * <br/>
   * <br/> **Coordinate System** (local space, cm): Origin(0,0,0) roughly at nose bridge.
   * <br/> - X: [-8, 8] (Left- to Right+)
   * <br/> - Y: [-9, 11] (Down- to Up+)
   * <br/> - Z: [-6, 7] (Back- to Front+)
   * <br/>
   * <br/> **Custom Placement Suggestions**:
   * <br/> NoseTip(0, -1.2, 6.5), Cheeks(±3.5, -0.5, 4.5), Temples(±4.5, 5.0, 3.0),
   * <br/> UnderNose(0, -2.5, 5.8), MouthCorners(±1.8, -4.0, 5.5).
   * @example
   * ```typescript
   * // Using custom anchor
   * binding.anchorType = FaceBindingAnchorType.Custom;
   * binding.customAnchorPoint = new Vector3f(0, -1.2, 6.5); // Nose tip
   * ```
   * @enum
   */
  enum FaceBindingAnchorType {
  /** Face center, coordinates: (0, 0, 0). Best default for general face tracking. */
    
    FaceCenter,
  /** Left eye, coordinates: (-2.965, 1.806, 4.024). */
    
    LeftEye,
  /** Right eye, coordinates: (2.959, 1.801, 4.020). */
    
    RightEye,
  /** Forehead, coordinates: (0, 9.74, 3.468). */
    
    Forehead,
  /** Mouth center, coordinates: (0, -3.978, 5.621). Use for lip/nose-ring effects. */
    
    MouthCenter,
  /** Chin, coordinates: (0, -7.581, 5.6). */
    
    Chin,
  /** Left earlobe, coordinates: (-7.208, -1.843, -4.141). Behind the face plane. */
    
    LeftEarlobe,
  /** Right earlobe, coordinates: (7.208, -1.843, -4.141). Behind the face plane. */
    
    RightEarlobe,
  /**
     * Custom anchor. Uses coordinates from `customAnchorPoint`.
     * Only use this when no preset matches. Refer to the enum-level JSDoc for coordinate ranges
     * and common custom placement suggestions (nose tip, cheeks, temples, etc.).
     */
    
    Custom,
  }
  
  /**
   * @class FaceBinding
   * Class responsible for binding 3D objects to specific points on a detected face.
   * <br/> Supports various anchor points like eyes, forehead, mouth, etc.
   * <br/> The binding updates every frame against the configured target face. When the
   * selected face is unavailable or fitting data is not ready, the component stops applying the
   * binding and hides or disables the affected renderers until valid data returns.
   * @example
   * ```typescript
   * // Using preset anchor
   * const binding = this.getSceneObject().getComponent("FaceBinding") as FaceBinding;
   * binding.anchorType = FaceBindingAnchorType.MouthCenter;
   * ```
   */
  class FaceBinding extends DynamicComponent {
    protected constructor();
  
    /**
     * @description The anchor type, default is FaceCenter.
     */
    anchorType: FaceBindingAnchorType;
  
    /**
     * @description Custom anchor point offset in standard face mesh local space (cm).
     * <br/> Used only when anchorType is Custom.
     * <br/> Ranges: X[-8, 8] (Left->Right), Y[-9, 11] (Down->Up), Z[-6, 7] (Back->Front).
     * <br/> See FaceBindingAnchorType for preset coordinates and custom suggestions.
     */
    customAnchorPoint: Vector3f;
  
    /**
     * @description Gets the configured target face ID of this binding, in the range `1` to `5`.
     * This returns the selected slot, not the current face-tracking status.
     */
    get faceID(): number;
  
    /**
     * @description Sets the target face ID for the face binding, in the range `1` to `5`.
     * Non-integer values and values outside that range are rejected, log an error,
     * and leave the previous target unchanged.
     */
    set faceID(value: number);
  }
}