declare namespace APJS {
  /**
   * @description TweenType — determines which subclass of TweenAnimation is used.
   * Each type maps to a specific animation capability:
   * - Transform: TweenTransform — animate position, rotation, or scale between start/end values
   * - TransformPath: TweenTransformPath — animate along a path of waypoints
   * - TransformFollow: TweenTransformFollow — animate to follow a target transform
   * - Material: TweenMaterial — animate material properties (albedo color, emission color, UV offset)
   * @enum
   * @property  None - No animation type assigned
   * @property  Transform - TweenTransform: animate position/rotation/scale from start to end values
   * @property  TransformPath - TweenTransformPath: animate along a multi-point path
   * @property  TransformFollow - TweenTransformFollow: animate to follow a target object's transform
   * @property  Material - TweenMaterial: animate material properties (albedo, emission, UV)
   */
  enum TweenType {
    None,
    Transform,
    TransformPath,
    TransformFollow,
    Material,
  }
  
  /**
   * @class Tween
   * @extends DynamicComponent
   * @description Container for the Tween animation system. Exposes only `tweenType`
   * and `tweenAnimation`. **All animation config lives on the subclass returned by
   * `tweenAnimation` — NOT on Tween itself.**
   *
   * Changing `tweenType` recreates the internal object; previous config on the old subtype is lost.
   * `TweenType.None` keeps the base placeholder `TweenAnimation`, which exposes no concrete tween
   * behavior until a real subtype is selected.
   * Pattern: get Tween → set tweenType → get tweenAnimation → cast → configure.
   * Do NOT `getComponent('TweenXxx')` on subclasses directly.
   *
   * @example
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.Transform;
   * const anim = tween.tweenAnimation as TweenTransform;
   * anim.object = targetSceneObject;
   * anim.duration = 1.0;
   * anim.startVector3 = new Vector3f(0, 0, 0);
   * anim.endVector3 = new Vector3f(5, 0, 0);
   * anim.start();
   */
  class Tween extends DynamicComponent {
    protected constructor();
  
    /**
       * @description The internal animation object — **the only config entry point.**
       * Cast based on `tweenType`:
       * - Transform → `TweenTransform` (startVector3, endVector3, offsetVector3...)
       * - TransformPath → `TweenTransformPath` (pointsPathVector3, durations, orientation...)
       * - TransformFollow → `TweenTransformFollow` (followTarget, startVector3...)
       * - Material → `TweenMaterial` (startColor, endColor, startVector2...)
       * All inherit `duration`, `delay`, `playMode`, `easingFunction`, `easingType`,
       * `object`, `targetType`, `motionType`, `start/pause/resume/stop` from TweenAnimation.
       *
       * When `tweenType` is `None`, this returns a base `TweenAnimation` placeholder that
       * only exposes the shared properties above and performs no actual tween until a
       * concrete subtype is selected. Always cast to the subclass matching the current
       * `tweenType`: casting to a non-matching subclass does not convert the object — the
       * mismatched subclass-specific properties read their default values and have no effect.
       */
    get tweenAnimation(): TweenAnimation;
  
    /**
       * @description Gets the type of tween animation. Changing this property recreates the
       * internal animation object. Use `TweenType.Transform` for position/rotation/scale,
       * `TweenType.TransformPath` for path-based animation, `TweenType.TransformFollow` for
       * following a target, or `TweenType.Material` for material property animation.
       * @returns The tween type.
       */
    get tweenType(): TweenType;
  
    /**
       * @description Sets the type of tween animation.
       * @param value - The tween type to set.
       */
    set tweenType(value: TweenType);
  }
  
  /**
   * @description TweenPlayMode — playback mode for the Tween animation system.
   * Used by `TweenAnimation.playMode` to control loop behavior.
   * @enum
   * @property  Loop - Loop the animation continuously
   * @property  LoopOnce - Play the animation once and stop
   * @property  PingPong - Play forward then reverse, continuously
   * @property  PingPongOnce - Play forward then reverse once, then stop
   */
  enum TweenPlayMode {
    Loop,
    LoopOnce,
    PingPong,
    PingPongOnce,
  }
  
  /**
   * @description TweenMotionType — how the tween interpolates between start and end values.
   * Used by `TweenAnimation.motionType` to control animation behavior.
   * @enum
   * @property  FromTo - Animate from `startValue` to `endValue`
   * @property  To - Animate from current value to `endValue`
   * @property  Offset - Animate from current value by an `offsetValue` amount
   */
  enum TweenMotionType {
    FromTo,
    To,
    Offset,
  }
  
  /**
   * @description TweenTargetType - which property to animate. Used by `TweenAnimation.targetType`.
   * - Position, Rotation, Scale: available in TweenTransform, TweenTransformPath, TweenTransformFollow
   * - AlbedoColor, EmissionColor, UV: available in TweenMaterial
   * @enum
   * @property Position - Animate position
   * @property Rotation - Animate rotation
   * @property Scale - Animate scale
   * @property AlbedoColor - Animate base (albedo) color
   * @property EmissionColor - Animate emission color
   * @property UV - Animate UV offset
   */
  enum TweenTargetType {
    Position,
    Rotation,
    Scale,
    AlbedoColor,
    EmissionColor,
    UV,
  }
  
  /**
   * @description TweenOrientation - Object orientation control method in path mode
   * @enum
   * @property Fixed - Fixed orientation
   * @property Path - Follow path direction
   */
  enum TweenOrientation {
    Fixed,
    Path,
  }
  
  /**
   * @description TweenPathType - Path type
   * @enum
   * @property Curve - Curve path
   * @property Straight - Straight path
   */
  enum TweenPathType {
    Curve,
    Straight,
  }
  
  /**
   * @description TweenEasingFunction - the easing curve shape used by the Tween animation.
   * Used by `TweenAnimation.easingFunction`. Combine with `TweenEasingType` to control
   * the direction (In, Out, InOut) of the easing curve.
   * @enum
   * @property Linear - Linear interpolation (no easing)
   * @property Quadratic - Quadratic easing curve
   * @property Cubic - Cubic easing curve
   * @property Quartic - Quartic easing curve
   * @property Quintic - Quintic easing curve
   * @property Sinusoidal - Sinusoidal easing curve
   * @property Exponential - Exponential easing curve
   * @property Circular - Circular easing curve
   * @property Elastic - Elastic (spring-like) easing curve
   * @property Back - Back (overshoot) easing curve
   * @property Bounce - Bounce easing curve
   * @property GeneratePow - Custom power function easing
   */
  enum TweenEasingFunction {
    Linear,
    Quadratic,
    Cubic,
    Quartic,
    Quintic,
    Sinusoidal,
    Exponential,
    Circular,
    Elastic,
    Back,
    Bounce,
    GeneratePow,
  }
  
  /**
   * @description TweenEasingType - the direction of the easing curve.
   * Used by `TweenAnimation.easingType`. Combine with `TweenEasingFunction` to fully define
   * the easing behavior. Note: `None` is only valid when `easingFunction` is `Linear`.
   * @enum
   * @property None - No easing direction (only valid with Linear easingFunction)
   * @property In - Ease in (slow start)
   * @property Out - Ease out (fast start, slow end)
   * @property InOut - Ease in and out (slow start and end)
   */
  enum TweenEasingType {
    None,
    In,
    Out,
    InOut,
  }
  
  /**
   * @class TweenAnimation
   * @description Base class for all tween types. **Do NOT use directly.** Access via
   * `Tween.tweenAnimation` and cast to subclass (TweenTransform, TweenTransformPath,
   * TweenTransformFollow, or TweenMaterial) based on `tweenType`.
   * Provides common properties: `duration`, `delay`, `playMode`, `easingFunction`,
   * `easingType`, `object`, `targetType`, `motionType`, and playback methods.
   * The default base instance uses `TweenType.None`, so it mainly acts as a placeholder until a
   * concrete tween subtype is selected on the owning {@link Tween} component.
   */
  class TweenAnimation extends ScriptCustomObject {
    protected constructor();
  
    /**
     * @description Delay in seconds before the animation starts after calling `start()`.
     * Defaults to 0 (no delay). Changing it at runtime takes effect the next time the
     * animation is (re)started.
     */
    get delay(): number;
  
    set delay(value: number);
  
    /**
       * @description Animation duration in seconds (one cycle, excluding PingPong reverse).
       */
    get duration(): number;
  
    set duration(value: number);
  
    /**
     * @description Easing curve shape.
     * Combine with `easingType`. Non-Linear auto-defaults
     * easingType to Out if it was None.
     * `GeneratePow` uses a custom power exponent (default 4) configured in the editor;
     * a larger exponent produces a sharper curve. It is not parameterized through this API.
     */
    get easingFunction(): TweenEasingFunction;
  
    set easingFunction(value: TweenEasingFunction);
  
    /**
     * @description Easing direction:
     * `None` (only valid with Linear), `In` (slow start),
     * `Out` (fast start), `InOut` (both).
     * Setting None on non-Linear is rejected.
     */
    get easingType(): TweenEasingType;
  
    set easingType(value: TweenEasingType);
  
    /**
     * @description Interpolation mode:
     * `FromTo` (start→end), `To` (current→end, ignores start values),
     * `Offset` (current+offset, ignores start/end values).
     */
    get motionType(): TweenMotionType;
  
    set motionType(value: TweenMotionType);
  
    /**
     * @description Target SceneObject to animate. Set to `null` to clear target.
     */
    get object(): SceneObject | null;
  
    set object(value: SceneObject | null);
  
    /**
     * @description Loop behavior:
     * `Loop` (continuous), `LoopOnce` (play once),
     * `PingPong` (forward+reverse continuous),
     * `PingPongOnce` (forward+reverse once).
     */
    get playMode(): TweenPlayMode;
  
    set playMode(value: TweenPlayMode);
  
    /**
     * @description Property to animate.
     * Transform/Path/Follow: `Position`/`Rotation`/`Scale`.
     * Material: `AlbedoColor`/`EmissionColor`/`UV`.
     * In Transform/Path/Follow subclasses only `Position`/`Rotation`/`Scale` are accepted;
     * any other value (including the Material types) is silently ignored and the current
     * value is kept.
     */
    get targetType(): TweenTargetType;
  
    set targetType(value: TweenTargetType);
  
    /**
     * @description Pause the tween animation. Call `resume()` to continue from the paused position.
     * Safe to call when not yet started or already paused (idempotent): the paused state is set
     * and no error is raised.
     */
    pause(): void;
  
    /**
     * @description Resume the tween animation from a paused state.
     * No-op if the animation is not currently paused.
     */
    resume(): void;
  
    /**
     * @description Start tween animation from initial state. Requires `object` to be set,
     * otherwise the call is ignored. If the animation is already playing or paused,
     * calling it again has no effect (it does not restart); use `stop()` first to replay
     * from the beginning.
     */
    start(): void;
  
    /**
     * @description Stop the tween animation and keep the current state.
     */
    stop(): void;
  }
  
  /**
   * @class TweenMaterial
   * @extends TweenAnimation
   * @description Tween subclass for material animations (color, UV offset).
   * **NOT a standalone component.** Access via Tween container:
   * ```
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.Material;
   * const anim = tween.tweenAnimation as TweenMaterial;
   * ```
   * targetType→property: AlbedoColor/EmissionColor→startColor/endColor; UV→startVector2/endVector2.
   * `object` must have MeshRenderer with instanced material.
   *
   * @example
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.Material;
   * const anim = tween.tweenAnimation as TweenMaterial;
   * anim.object = scene.findSceneObject('Cube');
   * anim.targetType = TweenTargetType.AlbedoColor;
   * anim.startColor = new Color(1, 1, 1, 1);
   * anim.endColor = new Color(1, 0, 0, 1);
   * anim.duration = 1.5;
   * anim.start();
   */
  class TweenMaterial extends TweenAnimation {
    protected constructor();
  
    /**
       * @description End color (AlbedoColor/EmissionColor). Used in FromTo and To modes.
       */
    get endColor(): Color;
  
    set endColor(value: Color);
  
    /**
       * @description End Vector2 (UV offset).
       */
    get endVector2(): Vector2f;
  
    set endVector2(value: Vector2f);
  
    /**
       * @description Start color (AlbedoColor/EmissionColor). Only when motionType=FromTo.
       */
    get startColor(): Color;
  
    set startColor(value: Color);
  
    /**
       * @description Start Vector2 (UV offset). Only when motionType=FromTo.
       */
    get startVector2(): Vector2f;
  
    set startVector2(value: Vector2f);
  
    /**
       * @description Target type. Only accepts AlbedoColor, EmissionColor, or UV. Others ignored.
       */
    set targetType(value: TweenTargetType);
  
    get targetType(): TweenTargetType;
  
    /**
       * @description Pause the tween animation. This will temporarily stop the transition between the start and end values.
       */
    pause(): void;
  
    /**
       * @description Resume the tween animation. This will continue the transition between the start and end values.
       */
    resume(): void;
  
    /**
       * @description Start tween animation from initial state.
       */
    start(): void;
  
    /**
       * @description Stop the tween animation and keep the current state.
       */
    stop(): void;
  }
  
  /**
   * @class TweenTransform
   * @extends TweenAnimation
   * @description Tween subclass for transform animations (position, rotation, scale).
   * **NOT a standalone component.** Access via Tween container:
   * ```
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.Transform;
   * const anim = tween.tweenAnimation as TweenTransform;
   * ```
   * 3D (Transform): use Vector3 properties. 2D (ScreenTransform): Vector2 for Position/Scale,
   * number for Rotation. motionType controls which properties are used:
   * FromTo→start/end values, To→end only, Offset→offset only.
   *
   * @example
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.Transform;
   * const anim = tween.tweenAnimation as TweenTransform;
   * anim.object = scene.findSceneObject('Cube');
   * anim.targetType = TweenTargetType.Position;
   * anim.duration = 2.0;
   * anim.startVector3 = new Vector3f(0, 0, 0);
   * anim.endVector3 = new Vector3f(10, 0, 0);
   * anim.start();
   */
  class TweenTransform extends TweenAnimation {
    protected constructor();
  
    /**
       * @description End number (2D Rotation). Used in FromTo and To modes.
       * Angle in degrees about the 2D screen plane.
       */
    get endNumber(): number;
  
    set endNumber(value: number);
  
    /**
       * @description End Vector2 (2D Position/Scale). Used in FromTo and To modes.
       * In the object's local 2D space: anchored position for Position, scale factors for Scale.
       * Not used for Rotation (use `endNumber`).
       */
    get endVector2(): Vector2f;
  
    set endVector2(value: Vector2f);
  
    /**
       * @description End Vector3 (3D, all targets). Used in FromTo and To modes.
       * Interpreted in the object's local space: local position for Position, local Euler
       * angles in degrees for Rotation, and local scale factors for Scale.
       */
    get endVector3(): Vector3f;
  
    set endVector3(value: Vector3f);
  
    /**
       * @description Offset number (2D Rotation). Only used when motionType=Offset.
       * Angle offset in degrees, added to the object's current 2D rotation at start.
       */
    get offsetNumber(): number;
  
    set offsetNumber(value: number);
  
    /**
       * @description Offset Vector2 (2D Position/Scale). Only used when motionType=Offset.
       * Added to the object's current local 2D value at start: anchored position for Position,
       * scale factors for Scale.
       */
    get offsetVector2(): Vector2f;
  
    set offsetVector2(value: Vector2f);
  
    /**
       * @description Offset Vector3 (3D). Only used when motionType=Offset.
       * Added to the object's current local value at start: local position for Position,
       * local Euler angles in degrees for Rotation, local scale factors for Scale.
       */
    get offsetVector3(): Vector3f;
  
    set offsetVector3(value: Vector3f);
  
    /**
       * @description Start number (2D Rotation). Only used when motionType=FromTo.
       * Angle in degrees about the 2D screen plane.
       */
    get startNumber(): number;
  
    set startNumber(value: number);
  
    /**
       * @description Start Vector2 (2D Position/Scale). Only used when motionType=FromTo.
       * In the object's local 2D space: anchored position for Position, scale factors for Scale.
       * Not used for Rotation (use `startNumber`).
       */
    get startVector2(): Vector2f;
  
    set startVector2(value: Vector2f);
  
    /**
       * @description Start Vector3 (3D, all targets). Only used when motionType=FromTo.
       * Interpreted in the object's local space: local position for Position, local Euler
       * angles in degrees for Rotation, and local scale factors for Scale.
       */
    get startVector3(): Vector3f;
  
    set startVector3(value: Vector3f);
  
    /**
       * @description Target type. Only accepts Position, Rotation, or Scale. Others ignored.
       */
    set targetType(value: TweenTargetType);
  
    get targetType(): TweenTargetType;
  
    /**
       * @description Pauses the tween animation. While paused, `update` is skipped and
       * the transform holds its current value.  A subsequent {@link resume} continues
       * from the paused point. Calling pause again while already paused is a safe no-op.
       * Starting a new animation while paused immediately re-pauses it.
       */
    pause(): void;
  
    /**
       * @description Resumes a paused tween animation. No-op if the animation is not
       * paused.
       */
    resume(): void;
  
    /**
       * @description Starts the tween animation. Requires `object` (target transform)
       * to be set; otherwise the call is ignored. If the animation is already playing
       * or paused, this call has no effect.
       */
    start(): void;
  
    /**
       * @description Stops the tween animation. The transform stays at its current
       * interpolated value. The paused state and tween objects are preserved; calling
       * {@link start} afterward replays the animation from the beginning.
       */
    stop(): void;
  }
  
  /**
   * @class TweenTransformFollow
   * @extends TweenAnimation
   * @description Tween subclass for real-time target following.
   * **NOT a standalone component.** Access via Tween container:
   * ```
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.TransformFollow;
   * const anim = tween.tweenAnimation as TweenTransformFollow;
   * ```
   * Continuously tracks `followTarget` (Transform/ScreenTransform, NOT SceneObject).
   * 2D must follow 2D, 3D must follow 3D. playMode is ignored (always follows).
   *
   * @example
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.TransformFollow;
   * const anim = tween.tweenAnimation as TweenTransformFollow;
   * anim.object = myObject;
   * anim.followTarget = scene.findSceneObject('Target')?.getTransform() ?? null;
   * anim.targetType = TweenTargetType.Position;
   * anim.duration = 0.5;
   * anim.start();
   */
  class TweenTransformFollow extends TweenAnimation {
    protected constructor();
  
    /**
       * @description Transform or ScreenTransform to follow (**NOT a SceneObject**). Get via `sceneObject.getTransform()`. Must match 2D/3D dimension.
       */
    get followTarget(): Transform | null;
  
    set followTarget(value: Transform | null);
  
    /**
       * @description Start number value. Used for 2D Rotation only. Only used when `motionType` is `FromTo`.
       * Angle in degrees about the 2D screen plane.
       */
    get startNumber(): number;
  
    set startNumber(value: number);
  
    /**
       * @description Start Vector2 value. Used for 2D targets (Position, Scale). Only used when `motionType` is `FromTo`.
       * In the object's local 2D space: anchored position for Position, scale factors for Scale.
       * In `To` mode the object's current value is used as the start instead.
       */
    get startVector2(): Vector2f;
  
    set startVector2(value: Vector2f);
  
    /**
       * @description Start Vector3 value. Used for 3D targets. Only used when `motionType` is `FromTo`;
       * in `To` mode the current transform value is used as the start.
       * Interpreted in the object's local space: local position for Position, local Euler angles
       * in degrees for Rotation, local scale factors for Scale.
       */
    get startVector3(): Vector3f;
  
    set startVector3(value: Vector3f);
  
    /**
       * @description Target type. Only accepts Position, Rotation, or Scale. Others ignored.
       * @param value - Target type (Position, Rotation, or Scale)
       */
    set targetType(value: TweenTargetType);
  
    /**
       * @description Current animation target type.
       */
    get targetType(): TweenTargetType;
  
    /**
       * @description Pauses the tween animation for the follow target transform.
       * Sets the paused state and holds the current value. Safe to call before start or
       * when already paused (no-op). Call `resume()` to continue following.
       */
    pause(): void;
  
    /**
       * @description Resumes the tween animation for the follow target transform.
       * No-op if the animation is not currently paused.
       */
    resume(): void;
  
    /**
       * @description Start tween animation from initial state. Requires `object` and a
       * dimension-matching `followTarget` to be set, otherwise the call is ignored.
       * If already playing or paused, calling it again has no effect; use `stop()` first to replay.
       */
    start(): void;
  
    /**
       * @description Stop the tween animation and keep the current state.
       */
    stop(): void;
  }
  
  /**
   * @class TweenTransformPath
   * @extends TweenAnimation
   * @description Tween subclass for path-based animation along waypoints.
   * **NOT a standalone component.** Access via Tween container:
   * ```
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.TransformPath;
   * const anim = tween.tweenAnimation as TweenTransformPath;
   * ```
   * 3D: pointsPathVector3. 2D Position/Scale: pointsPathVector2. 2D Rotation: pointsPathNumber.
   * Path is closed (last→first), ≥2 points. fixedDuration=true uses duration; false uses
   * durations[]/delays[]. orientation: Fixed (keep rotation) or Path (face direction).
   *
   * @example
   * const tween = sceneObject.getComponent('Tween') as Tween;
   * tween.tweenType = TweenType.TransformPath;
   * const anim = tween.tweenAnimation as TweenTransformPath;
   * anim.object = scene.findSceneObject('Cube');
   * anim.pointsPathVector3 = [
   *   new Vector3f(0, 0, 0), new Vector3f(5, 3, 0), new Vector3f(10, 0, 0)
   * ];
   * anim.duration = 3.0;
   * anim.start();
   */
  class TweenTransformPath extends TweenAnimation {
    protected constructor();
  
    /**
       * @description The array of delays for each path segment in the animation.
       * Only available when `fixedDuration=false`.
       * The array may be shorter than the number of path segments or even empty;
       * segments beyond the array length fall back to the global `tweenAnimationDelay`.
       * Values are in seconds (≥ 0 recommended).
       */
    get delays(): number[];
  
    set delays(value: number[]);
  
    /**
       * @description The array of durations for each path segment in the animation.
       * Only available when `fixedDuration=false`.
       * The array may be shorter than the number of path segments or even empty;
       * segments beyond the array length fall back to the global `tweenAnimationDuration`.
       * Values are in seconds (≥ 0 recommended).
       */
    get durations(): number[];
  
    set durations(value: number[]);
  
    /**
       * @description When `true`, all path segments share the same duration (`tweenAnimationDuration`) and
       * delay (`tweenAnimationDelay`). When `false`, per-segment `durations[]` and `delays[]` arrays are used instead.
       */
    get fixedDuration(): boolean;
  
    set fixedDuration(value: boolean);
  
    /**
       * @description Orientation mode applied during Position animation.
       * `Fixed`: the object keeps its current rotation throughout the path.
       * `Path`: the object continuously faces the movement direction.
       * Has no effect on Rotation or Scale animations.
       */
    get orientation(): TweenOrientation;
  
    set orientation(value: TweenOrientation);
  
    /**
       * @description Path interpolation mode between waypoints.
       * `Curve`: smooth Catmull-Rom spline passing through all waypoints.
       * `Straight`: linear interpolation, producing straight line segments between consecutive waypoints.
       */
    get pathType(): TweenPathType;
  
    set pathType(value: TweenPathType);
  
    /**
       * @description Waypoints for 2D Rotation path animation (used when the target object has a `ScreenTransform` with `targetType=Rotation`).
       * Requires ≥ 2 values. The path is closed: the last value automatically loops back to the first.
       * Each value is an angle in degrees about the 2D screen plane.
       * If fewer than 2 values are provided, no animation is created.
       */
    get pointsPathNumber(): number[];
  
    set pointsPathNumber(value: number[]);
  
    /**
       * @description Waypoints for 2D Position or Scale path animation (used when the target object has a `ScreenTransform`).
       * Requires ≥ 2 points. The path is closed: the last point automatically loops back to the first.
       * Values are in the object's local 2D space (anchored position for Position, scale factors for Scale).
       * If fewer than 2 points are provided, no animation is created.
       */
    get pointsPathVector2(): Vector2f[];
  
    set pointsPathVector2(value: Vector2f[]);
  
    /**
       * @description Waypoints for 3D path animation (used when the target object has a 3D `Transform`).
       * Requires ≥ 2 points. The path is closed: the last point automatically loops back to the first.
       * Coordinates are in the object's local space (local position for Position; the same array is
       * reused as local Euler angles in degrees for Rotation and as local scale factors for Scale).
       * If fewer than 2 points are provided, no animation is created.
       */
    get pointsPathVector3(): Vector3f[];
  
    set pointsPathVector3(value: Vector3f[]);
  
    /**
       * @description The animation target type. Only `Position`, `Rotation`, and `Scale` are accepted;
       * other `TweenTargetType` values are silently ignored.
       */
    set targetType(value: TweenTargetType);
  
    get targetType(): TweenTargetType;
  
    /**
       * @description Pauses all active segment tweens and sets the internal paused state.
       */
    pause(): void;
  
    /**
       * @description Resumes all currently paused segment tweens and clears the internal paused state.
       */
    resume(): void;
  
    /**
       * @description Start tween animation from initial state.
       * If the animation is currently paused, tweens are started and then immediately re-paused.
       */
    start(): void;
  
    /**
       * @description Stop the tween animation and keep the current state.
       */
    stop(): void;
  }
}