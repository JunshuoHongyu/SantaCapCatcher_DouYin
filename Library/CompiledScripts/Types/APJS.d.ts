declare namespace APJS {
  /**
   * @class
   * An axis-aligned bounding box defined by a minimum corner
   * `(minX, minY, minZ)` and a maximum corner `(maxX, maxY, maxZ)`.
   * `new AABB()` creates a zero-sized box at the origin.
   * No range validation is performed; the relationship `min ≤ max`
   * is not enforced — keep all six values consistent when editing.
   * @example
   * let aabb_1 = new AABB(new Vector3f(-1, -1, -1), new Vector3f(1, 1, 1));
   */
  class AABB {
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * @param min - The minimum corner of the box.
     * @param max - The maximum corner of the box.
     */
    constructor(min?: Vector3f, max?: Vector3f);
    /**
     * @description The minimum x-coordinate. No range validation;
     * the relationship `minX ≤ maxX` is not enforced.
     */
    get minX(): number;
    /**
     * @description The minimum x-coordinate. No range validation;
     * the relationship `minX ≤ maxX` is not enforced.
     */
    set minX(value: number);
    /**
     * @description The minimum y-coordinate. No range validation;
     * the relationship `minY ≤ maxY` is not enforced.
     */
    get minY(): number;
    /**
     * @description The minimum y-coordinate. No range validation;
     * the relationship `minY ≤ maxY` is not enforced.
     */
    set minY(value: number);
    /**
     * @description The minimum z-coordinate. No range validation;
     * the relationship `minZ ≤ maxZ` is not enforced.
     */
    get minZ(): number;
    /**
     * @description The minimum z-coordinate. No range validation;
     * the relationship `minZ ≤ maxZ` is not enforced.
     */
    set minZ(value: number);
    /**
     * @description The maximum x-coordinate. No range validation;
     * the relationship `minX ≤ maxX` is not enforced.
     */
    get maxX(): number;
    /**
     * @description The maximum x-coordinate. No range validation;
     * the relationship `minX ≤ maxX` is not enforced.
     */
    set maxX(value: number);
    /**
     * @description The maximum y-coordinate. No range validation;
     * the relationship `minY ≤ maxY` is not enforced.
     */
    get maxY(): number;
    /**
     * @description The maximum y-coordinate. No range validation;
     * the relationship `minY ≤ maxY` is not enforced.
     */
    set maxY(value: number);
    /**
     * @description The maximum z-coordinate. No range validation;
     * the relationship `minZ ≤ maxZ` is not enforced.
     */
    get maxZ(): number;
    /**
     * @description The maximum z-coordinate. No range validation;
     * the relationship `minZ ≤ maxZ` is not enforced.
     */
    set maxZ(value: number);
    /**
     * @description Returns whether this AABB is equal to the specified `v` AABB.
     * Equality uses the native `AABB` `operator==`, which compares the min and max corners directly.
     * No tolerance is applied.
     * @param v - The AABB to compare with.
     * @returns A boolean indicating whether the two AABBs are equal.
     */
    equals(v: AABB): boolean;
    /**
     * @description Returns a clone of this AABB.
     * @returns A new instance of AABB with the same properties as this one.
     */
    clone(): AABB;
    /**
     * @description Returns a string representation of the AABB.
     * @example
     * new AABB(new Vector3f(-1, -2, -3), new Vector3f(1, 2, 3)).toString()
     * // "AABB(min: -1.00000, -2.00000, -3.00000,\n     max: 1.00000, 2.00000, 3.00000)"
     * @returns A string representation of this AABB.
     */
    toString(): string;
    /**
     * @description Returns `true` if this AABB overlaps or touches `other`
     * (face, edge, or corner contact counts as intersection).
     * Undefined behavior if either box has `min > max` on any axis.
     * @param other - The other AABB to check for intersection.
     * @returns Whether the two AABBs intersect.
     */
    intersects(other: AABB): boolean;
  }
  /**
   * @namespace AlgorithmManager
   * @description Access point for the current frame's algorithm results exposed by the engine,
   * such as face detection, face attributes, and related tracking data.
   * Call `APJS.AlgorithmManager.getResult()` from per-frame callbacks such as `Script.onUpdate()`
   * when you need the latest result for that frame. Repeated calls within the same frame reuse
   * the same result wrapper.
   * `getResult()` itself does not use `null` or `undefined` to signal "no result".
   * When a category has no output in the current frame, check the matching `get*Count()` method
   * or category-specific execution state before reading indexed items.
   * The cached wrapper is cleared at the start of the next runtime update, so treat the returned
   * result object and the objects read from it as current-frame data and reacquire them each frame
   * instead of caching them across frames.
   * @example
   * // Read face tracking data every frame inside a Script component
   * // Head orientation, face actions (eye blink), and face attributes (happy expression)
   * onUpdate(deltaTime: number): void {
   *   const result = APJS.AlgorithmManager.getResult();
   *   const faceCount = result.getFaceCount();
   *   if (faceCount > 0) {
   *     const face = result.getFaceBaseInfo(0);
   *     console.log("yaw:", face.yaw, "pitch:", face.pitch);
   *
   *     if (face.hasAction(APJS.FaceAction.EyeBlink)) {
   *       console.log("User blinked!");
   *     }
   *   }
   *   if (result.getFaceAttributeCount() > 0) {
   *     const faceAttr = result.getFaceAttributeInfo(0);
   *     if (faceAttr.expressionType == APJS.FaceAttrExpression.Happy) {
   *       console.log("User is happy!");
   *     }
   *   }
   * }
   */
  namespace AlgorithmManager {
    /**
     * @description Returns the shared parameter-setter handle for subsequent
     * algorithm inference. Calling this method alone does not change parameters
     * or run inference. Use setHand3DParam to bind the camera for 3D hand tracking.
     * @returns The same AlgorithmParams handle on each call.
     * @see AlgorithmParams.setHand3DParam
     */
    function getAlgorithmParams(): AlgorithmParams;
    /**
     * @description Returns the current frame's algorithm result wrapper.
     * The returned object exposes typed accessors such as face count, face base
     * information, and face attribute information. Repeated calls within the same
     * frame return the same wrapper object.
     * This method does not return `null` when there are no algorithm outputs for the
     * current frame. Instead, use the matching `get*Count()` method, or a category's
     * `get*IsExecuted()` method when available, to decide whether indexed reads are valid.
     * The wrapper is cached only for the current frame and is cleared before the next
     * runtime `onUpdate()` cycle, so reacquire it each frame and avoid relying on object
     * identity across frames.
     * Nullable accessors for optional landmarks, masks and classification must
     * still be checked even when the corresponding tracker count is positive.
     * Reading a result does not trigger another inference or change Graph settings.
     * @returns A current-frame AlgorithmResult, including when no targets are detected.
     *
     * @example
     * const result = APJS.AlgorithmManager.getResult();
     * if (result.getFaceCount() > 0) {
     *   const face = result.getFaceBaseInfo(0);
     *   const isLookingLeft = face.yaw > 0.2;
     * }
     */
    function getResult(): AlgorithmResult;
  }
  /**
   * @description Algorithm parameter setters returned by AlgorithmManager.getAlgorithmParams().
   * Repeated calls to that method return the same handle. Obtain the handle from
   * AlgorithmManager; its constructor is not part of the public API.
   * Parameter bindings are shared by scripts in the current runtime and are
   * released when that runtime is destroyed.
   */
  class AlgorithmParams {
    protected constructor();
    /**
     * @description Binds the camera used by subsequent 3D hand inference. Its FOV
     * is synchronized each frame; call this again when replacing the camera.
     * This does not trigger inference or change an already produced result.
     * Bind once in onStart after assigning the camera in the Inspector, then read
     * getHand3DInfo during onUpdate. Later changes to the bound camera's fov are
     * picked up automatically for subsequent inference. A later call replaces
     * the shared binding; removing just the calling script does not clear it.
     * Scripts and Graph consumers sharing this tracker must use a consistent FOV.
     * This setter only configures the camera; it does not enable a tracker that
     * another consumer has disabled. Graph enable/disable controls remain effective.
     * Results remain in camera space; this does not apply the camera's world transform.
     * @param param - Camera configuration containing the scene's perspective camera.
     * @returns Nothing. The binding is retained until replaced or the runtime is destroyed.
     * @throws RangeError if camera.fov is missing, non-finite, or outside the open
     * interval (0, 180) degrees. Keep the bound FOV valid on later frames as well;
     * an invalid later value is skipped during synchronization.
     * @example
     * ```ts
     * // Attach this component to a scene object and assign camera in the Inspector.
     * @component()
     * export class Read3DHand extends APJS.BasicScriptComponent {
     *   @serializeProperty() camera!: APJS.Camera;
     *
     *   onStart(): void {
     *     APJS.AlgorithmManager.getAlgorithmParams().setHand3DParam({camera: this.camera});
     *   }
     *
     *   onUpdate(): void {
     *     const result = APJS.AlgorithmManager.getResult();
     *     for (let i = 0; i < result.getHand3DCount(); ++i) {
     *       const hand = result.getHand3DInfo(i);
     *       if (!hand) continue;
     *       const indexTip = hand.landmarks[8];
     *       console.log(indexTip.x, indexTip.y, indexTip.z); // Camera-space meters.
     *     }
     *   }
     * }
     * ```
     */
    setHand3DParam(param: Hand3DParam): void;
  }
  /**
   * @interface AlgorithmResult
   * @description Typed accessors for the current frame's algorithm outputs returned by `APJS.AlgorithmManager.getResult()`.
   * Each `get*Count()` method reports how many results of that category are available in the current frame.
   * Use the matching indexed accessor to read items from the same result set.
   * Call accessors from a Script component attached to the active scene, and read
   * results during `onUpdate()`. The editor collects the algorithm dependencies
   * referenced by the script; reading a result does not start another inference.
   * Reacquire the result and its data each frame. Treat returned objects, points
   * and buffers as read-only; copy the values you need to retain across frames.
   * A positive count does not guarantee that an optional landmark or mask output
   * is available. Check nullable results before accessing their fields.
   * @example
   * const result = APJS.AlgorithmManager.getResult();
   * const faceCount = result.getFaceCount();
   *
   * if (faceCount > 0) {
   *   const face = result.getFaceBaseInfo(0);
   *   console.log("first face yaw:", face.yaw);
   * }
   */
  interface AlgorithmResult {
    /**
     * @description Returns the current number of 2D hand results. Use this count
     * only with getHand2DInfo; the 3D hand tracker has its own result set.
     * This is the same count as the existing getHandCount.
     * @returns Number of hand slots in this frame, or 0 when none are available.
     * @see AlgorithmResult.getHand2DInfo
     */
    getHand2DCount(): number;
    /**
     * @description Reads a 2D hand's 22 normalized image landmarks, gesture and
     * handedness from the current frame. Point 0 is the wrist, 8 the index fingertip
     * and 21 the palm center; see Hand2DInfo.landmarks for the complete ordering.
     * Its index and ID cannot be used to match results from getHand3DInfo.
     * The existing getHandInfo returns the same result for the same index.
     * @param index - Zero-based integer in [0, getHand2DCount()).
     * @returns The current hand, or null when that result is unavailable.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getHand2DCount(); ++i) {
     *     const hand = result.getHand2DInfo(i);
     *     if (!hand) continue;
     *     const tip = hand.landmarks[8];
     *     console.log(hand.ID, hand.getHandType(), hand.action, tip.x, tip.y);
     *   }
     * }
     */
    getHand2DInfo(index: number): Hand2DInfo | null;
    /**
     * @description Returns the current number of HAvatar 3D hand results.
     * Indices, IDs and handedness belong to this tracker independently of Hand2DInfo.
     * A Graph consumer can disable the shared tracker; this count can then become
     * 0 until inference resumes. Reading this count does not enable the tracker.
     * @returns Number of slots to read with getHand3DInfo, or 0 when unavailable.
     * @see AlgorithmResult.getHand3DInfo
     */
    getHand3DCount(): number;
    /**
     * @description Reads 21 hand landmarks in camera space, measured in meters.
     * The origin is the camera optical center; X points right, Y up, Z backward.
     * Point 0 is the wrist and 8 the index fingertip. There is no palm-center point 21.
     * To use the scene camera's FOV, bind it with AlgorithmParams.setHand3DParam
     * before reading subsequent frames. This does not transform points to world space.
     * Script and Graph consumers of this tracker must use a consistent camera FOV.
     * Graph enable/disable controls apply to the shared tracker. After it is
     * disabled, this accessor can return null until inference resumes; reading
     * results or binding a camera does not override the Graph's enable state.
     * @param index - Zero-based integer in [0, getHand3DCount()).
     * @returns The current hand, or null for an invalid index or unavailable output.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getHand3DCount(); ++i) {
     *     const hand = result.getHand3DInfo(i);
     *     if (!hand) continue;
     *     const wrist = hand.landmarks[0];
     *     console.log(hand.ID, hand.getHandType(), wrist.x, wrist.y, wrist.z);
     *   }
     * }
     */
    getHand3DInfo(index: number): Hand3DInfo | null;
    /**
     * @description Returns the current number of 2D body skeleton slots.
     * Use this with getBody2DInfo; it does not count 3D body results.
     * @returns Number of skeleton slots, or 0 when none are available.
     * @see AlgorithmResult.getBody2DInfo
     */
    getBody2DCount(): number;
    /**
     * @description Reads a body's 18 normalized image landmarks and bounding rectangle.
     * Each point has a corresponding landmarkValidities flag; use a point only when
     * its flag is 1. A non-null skeleton may still contain unavailable points.
     * Indices and tracking IDs belong to the 2D skeleton result set.
     * @param index - Zero-based integer in [0, getBody2DCount()).
     * @returns The current skeleton, or null for an invalid index or unavailable output.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getBody2DCount(); ++i) {
     *     const body = result.getBody2DInfo(i);
     *     if (!body || body.landmarkValidities[4] !== 1) continue;
     *     const rightWrist = body.landmarks[4];
     *     console.log(body.ID, rightWrist.x, rightWrist.y);
     *   }
     * }
     */
    getBody2DInfo(index: number): Body2DInfo | null;
    /**
     * @description Returns the current number of 3D body result slots, preserving
     * the existing getBodyCount behavior. Check each result's detected flag.
     * @returns Number of slots to read with getBody3DInfo, or 0 when unavailable.
     * @see AlgorithmResult.getBody3DInfo
     */
    getBody3DCount(): number;
    /**
     * @description Reads the detection state of a 3D body result in this frame.
     * Check both the result and its detected flag. The public Body3DInfo surface
     * exposes detected; it does not expose joint positions or world transforms.
     * The existing getBodyInfo returns the same result for the same index.
     * @param index - Zero-based integer in [0, getBody3DCount()).
     * @returns The current body result, or null when that result is unavailable.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getBody3DCount(); ++i) {
     *     const body = result.getBody3DInfo(i);
     *     if (body && body.detected) console.log('3D body detected', i);
     *   }
     * }
     */
    getBody3DInfo(index: number): Body3DInfo | null;
    /**
     * @description Reads 20 normalized image points for each iris of the requested
     * base face. Point 0 is the center; points 1-19 follow the rim in algorithm order.
     * A detected base face does not guarantee that iris landmarks are available.
     * @param index - Zero-based base-face index in [0, getFaceCount()) in this frame.
     * @returns Both iris point arrays, or null for an invalid index or unavailable output.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getFaceCount(); ++i) {
     *     const iris = result.getFaceIrisInfo(i);
     *     if (!iris) continue;
     *     const leftCenter = iris.leftLandmarks[0];
     *     console.log(leftCenter.x, leftCenter.y);
     *   }
     * }
     */
    getFaceIrisInfo(index: number): FaceIrisInfo | null;
    /**
     * @description Returns ideal and actual contours for getFaceBaseInfo(index).ID.
     * Matches the contour's face ID in the same frame; contour result order can differ
     * from base face order. Each contour contains 44 normalized image points;
     * see FaceContourInfo for the ideal/actual distinction and point definitions.
     * @param index - Zero-based base-face index in [0, getFaceCount()) in this frame.
     * @returns Both contours, or null for an invalid index or no matching contour output.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getFaceCount(); ++i) {
     *     const contour = result.getFaceContourInfo(i);
     *     if (!contour) continue;
     *     const chin = contour.actualLandmarks[22];
     *     console.log(chin.x, chin.y);
     *   }
     * }
     */
    getFaceContourInfo(index: number): FaceContourInfo | null;
    /**
     * @description Reads the first base face's 52 expression coefficients in the
     * fixed order documented by FaceBlendShapeInfo.blendshapeWeights. This accessor
     * has no face-index parameter. Values are forwarded without clamping to [0, 1].
     * To drive a mesh, pass a coefficient to MorpherComponent.setBlendShapeWeight
     * using the matching channel name authored on that mesh. Algorithm indices and
     * mesh channel names are mapped explicitly; channel names are case-sensitive.
     * @returns Current expression weights, or null when no valid output is available.
     * @see MorpherComponent.setBlendShapeWeight
     * @example
     * ```ts
     * // Assign the mesh object's existing MorpherComponent in the Inspector.
     * // The mesh must have a jaw-opening blend-shape channel named "jawOpen";
     * // replace that name below with the exact channel name on your mesh.
     * @component()
     * export class DriveJawOpen extends APJS.BasicScriptComponent {
     *   @serializeProperty() morpher!: APJS.MorpherComponent;
     *
     *   onUpdate(): void {
     *     const expression = APJS.AlgorithmManager.getResult().getFaceBlendShapeInfo();
     *     if (!expression) return;
     *     // Algorithm channel 24 is JawOpen; write its value to the mesh each frame.
     *     this.morpher.setBlendShapeWeight('jawOpen', expression.blendshapeWeights[24]);
     *   }
     * }
     * ```
     */
    getFaceBlendShapeInfo(): FaceBlendShapeInfo | null;
    /**
     * @description Returns the number of hand tracker slots that can be queried
     * for segmentation. A slot can exist while its mask is unavailable, so check
     * getHandMask for null even when this count is positive.
     * @returns Number of slots, or 0 when no hands are available.
     * @see AlgorithmResult.getHandMask
     */
    getHandMaskCount(): number;
    /**
     * @description Reads the segmentation mask for a hand tracker slot. The result
     * contains width * height grayscale bytes in row-major order. Use its actual
     * dimensions each frame; they need not equal the preview image dimensions.
     * Indices belong to this hand result set and cannot identify a 3D hand result.
     * @param index - Zero-based integer in [0, getHandMaskCount()).
     * @returns The current mask, or null for an invalid index or unavailable segmentation.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getHandMaskCount(); ++i) {
     *     const handMask = result.getHandMask(i);
     *     if (!handMask) continue;
     *     const x = Math.floor(handMask.width / 2);
     *     const y = Math.floor(handMask.height / 2);
     *     const intensity = handMask.mask[y * handMask.width + x] / 255;
     *     console.log(i, intensity);
     *   }
     * }
     */
    getHandMask(index: number): HandMaskInterface | null;
    /**
     * @description Reads the current portrait-matting foreground mask. This is one
     * image-level mask, with no person index. Pixels are row-major coverage bytes
     * from 0 to 255; use width and height from this result when sampling.
     * An all-zero mask is a valid output with no foreground coverage.
     * @returns The current mask, or null when no valid mask buffer is available.
     * @example
     * onUpdate(): void {
     *   const person = APJS.AlgorithmManager.getResult().getPersonMask();
     *   if (!person) return;
     *   const x = Math.floor(person.width / 2);
     *   const y = Math.floor(person.height / 2);
     *   const foregroundCoverage = person.mask[y * person.width + x] / 255;
     *   console.log(foregroundCoverage);
     * }
     */
    getPersonMask(): PersonMaskInterface | null;
    /**
     * @description Returns matching image classifications ordered by confidence descending.
     * Candidates must reach the fixed model's individual thresholds. This is a
     * multi-label result: several labels can match in the same frame. Candidate
     * indices are positions in this filtered list, not model class IDs.
     * @returns null until a valid output exists, or the current candidate list.
     * A valid result with no matches has count 0; do not read candidate 0 in that case.
     * @example
     * onUpdate(): void {
     *   const classification = APJS.AlgorithmManager.getResult().getImageClassificationInfo();
     *   if (!classification) return;
     *   for (let i = 0; i < classification.count; ++i) {
     *     console.log(classification.getLabel(i), classification.getConfidence(i));
     *   }
     * }
     */
    getImageClassificationInfo(): ImageClassificationInfo | null;
    /**
     * @description Returns the body result at `index` from the current frame's body
     * result set. Valid indexes are `0` to `getBodyCount() - 1`.
     * Out-of-range indexes return `null`.
     * @param index - The index in the current frame's body result set.
     * @returns {BodyInfo} The body result at `index`, or `null` when `index` is out of range.
     * @deprecated Use getBody3DInfo.
     */
    getBodyInfo(index: number): BodyInfo;
    /**
     * @description Returns the number of body results available in the current frame.
     * Use this with `getBodyInfo(index)`.
     * Returns `0` when the current frame has no body results to read.
     * @returns number
     * @deprecated Use getBody3DCount.
     */
    getBodyCount(): number;
    /**
     * @description Returns the number of face attribute results available in the current frame.
     * Face attribute results describe regular detected human faces. Use this count
     * with `getFaceAttributeInfo(index)` before reading an attribute result.
     * @returns {number}
     */
    getFaceAttributeCount(): number;
    /**
     * @description Returns the face attribute result at `index` from the current frame's
     * face attribute result set. When used together with face detection, the same
     * regular-face index is used; first check that
     * `index < getFaceAttributeCount()`. Out-of-range indexes return `null`.
     * @param {number} index - The index in the current frame's face attribute result set.
     * @returns {FaceAttributeInterface} The face attribute result at `index`, or `null` when `index` is out of range.
     */
    getFaceAttributeInfo(index: number): FaceAttributeInterface;
    /**
     * @description Returns the face base result at `index` from the current frame's
     * detected face result set. Valid indexes are `0` to `getFaceCount() - 1`.
     * Out-of-range indexes return `null`.
     * @param {number} index - The face index in the current frame.
     * @returns {Face106Interface} The face base result at `index`, or `null` when `index` is out of range.
     */
    getFaceBaseInfo(index: number): Face106Interface;
    /**
     * @description Returns the number of detected faces available in the current frame.
     * Use this with `getFaceBaseInfo(index)`. Face indexes start at `0`.
     * Returns `0` when the current frame has no detected face results.
     * @returns {number}
     */
    getFaceCount(): number;
    /**
     * @description Reads fine landmarks for the requested base face: 22 per eye,
     * 13 per eyebrow and 64 for the lips, all in normalized image coordinates.
     * See FaceExtraInfo for the complete point order. Base-face detection alone
     * does not guarantee these optional arrays are available in the current frame.
     * @param index - Zero-based base-face index in [0, getFaceCount()) in this frame.
     * @returns All five point arrays, or null for an invalid index or incomplete output.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getFaceCount(); ++i) {
     *     const extra = result.getFaceExtraInfo(i);
     *     if (!extra) continue;
     *     const upperLipMidpoint = extra.lipLandmarks[7];
     *     console.log(upperLipMidpoint.x, upperLipMidpoint.y);
     *   }
     * }
     */
    getFaceExtraInfo(index: number): FaceExtraInfo | null;
    /**
     * @description Returns the face-region mask for the face at `index`.
     * The mask is a square grayscale buffer in its own normalized square space
     * (top-left origin, row-major), not aligned pixel-for-pixel with the input
     * camera image; see {@link FaceFaceMaskInterface.faceMask} for the layout.
     * Valid indexes are `0` to `getFaceCount() - 1`; out-of-range returns
     * `null`.
     * Reacquire this result each frame. A detected face may have no usable mask;
     * check the result, a positive faceMaskSize and the buffer length before sampling.
     * For input-image pixels, apply warpMatrix first; see FaceFaceMaskInterface.warpMatrix.
     * @param {number} index - Zero-based base-face index in [0, getFaceCount()).
     * @returns {FaceFaceMaskInterface} The face-region mask for the face at `index`, or `null` when `index` is out of range.
     * @example
     * // Call during onUpdate with pixel coordinates in the algorithm's input image.
     * // x/y use the same frame before preview resizing or display mirroring.
     * function sampleFaceMaskAtInputPixel(index: number, x: number, y: number): number | undefined {
     *   const result = APJS.AlgorithmManager.getResult();
     *   if (index < 0 || index >= result.getFaceCount()) return undefined;
     *   const info = result.getFaceFaceMask(index);
     *   if (!info || info.faceMaskSize <= 0) return undefined;
     *   const size = info.faceMaskSize;
     *   const m = info.warpMatrix;
     *   if (info.faceMask.length !== size * size || m.length !== 6) return undefined;
     *   // Map input-image pixels to mask pixels using the row-major 2x3 matrix.
     *   const u = Math.round(m[0] * x + m[1] * y + m[2]);
     *   const v = Math.round(m[3] * x + m[4] * y + m[5]);
     *   if (!Number.isFinite(u) || !Number.isFinite(v)) return undefined;
     *   if (u < 0 || v < 0 || u >= size || v >= size) return undefined;
     *   return info.faceMask[v * size + u] / 255;
     * }
     */
    getFaceFaceMask(index: number): FaceFaceMaskInterface;
    /**
     * @description Returns the mouth-region mask for the face at `index`.
     * The mask is a square grayscale buffer in its own normalized square space
     * (top-left origin, row-major), not aligned pixel-for-pixel with the input
     * camera image; see {@link FaceMouthMaskInterface.faceMask} for the layout.
     * Valid indexes are `0` to `getFaceCount() - 1`; out-of-range returns
     * `null`.
     * Reacquire this result each frame. A detected face may have no usable mask;
     * check the result, a positive faceMaskSize and the buffer length before sampling.
     * For input-image pixels, apply warpMatrix first; see FaceMouthMaskInterface.warpMatrix.
     * @param {number} index - Zero-based base-face index in [0, getFaceCount()).
     * @returns {FaceMouthMaskInterface} The mouth-region mask for the face at `index`, or `null` when `index` is out of range.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getFaceCount(); ++i) {
     *     const info = result.getFaceMouthMask(i);
     *     if (!info || info.faceMaskSize <= 0) continue;
     *     const size = info.faceMaskSize;
     *     if (info.faceMask.length !== size * size) continue;
     *     const x = Math.floor(size / 2);
     *     const y = Math.floor(size / 2);
     *     console.log(info.ID, info.faceMask[y * size + x] / 255);
     *   }
     * }
     */
    getFaceMouthMask(index: number): FaceMouthMaskInterface;
    /**
     * @description Returns the face pet result at `index` from the current frame's
     * face pet result set. This index is independent of `getFaceCount()` (face pet
     * detection is a separate algorithm). Valid indexes are `0` to
     * `getFacePetInfoCount() - 1`. Out-of-range indexes return `null`.
     * The returned result can represent different `facePetType` values (cat, dog,
     * or human); filter by `facePetType` if only one type is needed.
     * @param {number} index - The index in the current frame's face pet result set.
     * @returns {FacePetInfoInterface} The face pet result at `index`, or `null` when `index` is out of range.
     */
    getFacePetInfo(index: number): FacePetInfoInterface;
    /**
     * @description Returns the number of face pet results available in the current frame.
     * Use this with `getFacePetInfo(index)`. This count is independent of
     * `getFaceCount()` and may include entries of any `facePetType` (cat, dog, human).
     * @returns {number}
     */
    getFacePetInfoCount(): number;
    /**
     * @description Returns the teeth-region mask for the face at `index`.
     * Valid indexes are `0` to `getFaceCount() - 1`; out-of-range returns
     * `null`.
     * Reacquire this result each frame. A detected face may have no usable mask;
     * check the result, a positive faceMaskSize and the buffer length before sampling.
     * For input-image pixels, apply warpMatrix first; see FaceTeethMaskInterface.warpMatrix.
     * @param {number} index - Zero-based base-face index in [0, getFaceCount()).
     * @returns {FaceTeethMaskInterface} The teeth-region mask for the face at `index`, or `null` when `index` is out of range.
     * @example
     * onUpdate(): void {
     *   const result = APJS.AlgorithmManager.getResult();
     *   for (let i = 0; i < result.getFaceCount(); ++i) {
     *     const info = result.getFaceTeethMask(i);
     *     if (!info || info.faceMaskSize <= 0) continue;
     *     const size = info.faceMaskSize;
     *     if (info.faceMask.length !== size * size) continue;
     *     const x = Math.floor(size / 2);
     *     const y = Math.floor(size / 2);
     *     console.log(info.ID, info.faceMask[y * size + x] / 255);
     *   }
     * }
     */
    getFaceTeethMask(index: number): FaceTeethMaskInterface;
    /**
     * @description Returns the number of detected hands in the current frame.
     * Use this with `getHandInfo(index)`. Returns `0` when no hands are
     * detected.
     * @returns {number}
     * @deprecated Use getHand2DCount.
     */
    getHandCount(): number;
    /**
     * @description Returns the hand detection result at `index`. Valid indexes
     * are `0` to `getHandCount() - 1`; out-of-range returns `null`.
     * @param {number} index - The index in the current frame's hand result set.
     * @returns {HandInfo} The hand detection result at `index`, or `null` when `index` is out of range.
     * @deprecated Use getHand2DInfo.
     */
    getHandInfo(index: number): HandInfo;
  }
  /**
   * @description AnimatedTextureEvent
   * @enum
   * @property {number} PlayBegin
   * @property {number} PlayEnd
   * @property {number} LoopBegin
   * @property {number} LoopEnd
   * @property {number} KeyFrame
   * @property {number} Pause
   * @property {number} Resume
   * @example
   * const imageComponent = this.getSceneObject().getComponent('Image') as APJS.Image;
   * const tex = imageComponent.texture;
   * const emitter = APJS.EventManager.getObjectEmitter(tex);
   * emitter.on(APJS.AnimatedTextureEvent.LoopEnd, this.onLoopEnd, this);
   */
  enum AnimatedTextureEvent {
    PlayBegin,
    PlayEnd,
    LoopBegin,
    LoopEnd,
    KeyFrame,
    Pause,
    Resume
  }
  /**
   * @description AnimatedTexturePlayMode
   * @enum
   * @property {number} Forward
   * @property {number} PingPong
   * @property {number} Randomize
   * @property {number} Shuffle
   */
  enum AnimatedTexturePlayMode {
    Forward = 0,
    PingPong = 1,
    Randomize = 2,
    Shuffle = 3
  }
  /**
   * @class AnimatedTextureProvider
   * @description Provider that plays a `TextureSequence` as an animated texture.
   * Default playback settings are `reverse = false`, `playMode = Forward`, `loopCount = -1`,
   * `fps = 12`, and `duration = 0`.
   * Assigning `textureSequence` updates `frameCount` from the sequence and then calls `reset()`.
   * Once a frame count is available, `fps` and `duration` stay linked:
   * setting `fps` recalculates `duration` as `frameCount / fps`, while setting `duration`
   * recalculates `fps` as `Math.round(frameCount / duration)` and the stored duration then snaps
   * to that integer-fps result.
   * `loopCount = 0` disables time-based playback updates and also makes `seekTime()` a no-op.
   * Playback state methods operate on the current in-memory settings: `play()` / `resume()` only flip the
   * playing state, `pause()` only stops advancing time, `stop()` resets to the first frame, and `reset()`
   * rebuilds playback from the full current sequence while keeping properties such as `playMode`, `reverse`,
   * `loopCount`, `fps`, and `duration`.
   */
  class AnimatedTextureProvider extends TextureDelegateProvider {
    /**
     * @description Gets whether the animation plays in reverse.
     * @returns True if animation plays in reverse, false otherwise
     */
    get reverse(): boolean;
    /**
     * @description Sets whether the animation plays in reverse.
     * @param value True if animation plays in reverse, false otherwise
     */
    set reverse(value: boolean);
    /**
     * @description Gets or sets the play mode used to build each loop's frame order.
     * Default: `AnimatedTexturePlayMode.Forward`.
     */
    get playMode(): AnimatedTexturePlayMode;
    /**
     * @description Sets the play mode of the animation.
     * @param value The play mode to set (Forward, PingPong, Randomize, or Shuffle)
     */
    set playMode(value: AnimatedTexturePlayMode);
    /**
     * @description Gets how many times the animation should loop.
     * Default: `-1`.
     * `0` disables playback updates and time seeking.
     * Positive values play a finite number of loops.
     * Negative values keep looping.
     */
    get loopCount(): number;
    /**
     * @description Sets how many times the animation should loop.
     * Default: `-1`.
     * `0` disables playback updates and time seeking.
     * Positive values play a finite number of loops.
     * Negative values keep looping.
     */
    set loopCount(value: number);
    /**
     * @description Gets the animation frame rate in frames per second.
     * Default: `12`.
     */
    get fps(): number;
    /**
     * @description Sets the animation frame rate in frames per second.
     * Default: `12`.
     * Invalid values (`<= 0`) are ignored.
     * When a frame count is available, changing `fps` updates `duration` to `frameCount / fps`.
     */
    set fps(value: number);
    /**
     * @description Gets the duration of the animation in seconds.
     * Default: `0`.
     */
    get duration(): number;
    /**
     * @description Sets the duration of the animation in seconds.
     * Default: `0`.
     * Invalid values (`<= 0`) are ignored.
     * When a frame count is available, changing `duration` recalculates `fps` as
     * `Math.round(frameCount / duration)`. The stored duration then follows that resolved `fps`.
     */
    set duration(value: number);
    /**
     * @description reset and set the start and end index of the animation. The index range from 0 to frameCount - 1.
     * Both inputs are rounded to integers and clamped into `[0, frameCount - 1]`.
     * The interval length is computed inclusively from `min(from, to)` to `max(from, to)`.
     * The stored `startIndex` / `endIndex` keep the caller's order, so `from > to` creates a descending range
     * for play modes that read the endpoints directly.
     * @param from - start index of the animation
     * @param to - end index of the animation
     */
    playFromTo(from: number, to: number): void;
    /**
     * @description Starts the animation playback.
     * If playback is already running, this call keeps the current frame/time state unchanged.
     */
    play(): void;
    /**
     * @description Pauses animation playback.
     * There is no playing-state precondition: this sets the internal playing flag to `false`
     * and emits the pause event even if playback was already stopped or paused.
     */
    pause(): void;
    /**
     * @description Stops animation playback, resets to initial state, and displays the first frame.
     */
    stop(): void;
    /**
     * @description Resumes the animation playback.
     * This only switches the playing state back on and continues from the current frame/time state.
     * If `stop()` was called earlier, playback resumes from the reset start state that `stop()` prepared.
     */
    resume(): void;
    /**
     * @description Resets the animation to its initial state and restarts playback.
     * This resets the active range to the full current sequence, sets local time/frame state back to the start,
     * and restarts playback without changing the configured `playMode`, `reverse`, `loopCount`, `fps`, or `duration`.
     * If no valid `textureSequence` / atlas data is available, playback is turned off instead.
     */
    reset(): void;
    /**
     * @description Get current playing frame index, the index range from 0 to frameCount - 1
     * @returns Current frame index
     */
    getCurrentPlayingFrame(): number;
    /**
     * @description Gets the total number of frames in the animation sequence.
     * @returns Total frame count
     */
    getFrameCount(): number;
  }
  /**
   * @class Animation
   * @description Animation. Stores keyframe based animations. Used by Animator to play back animations.
   */
  class Animation extends AObject {
    protected constructor();
    /**
     * @description Total length of the animation in seconds. default: `0`.
     * @readonly
     * @return the duration in seconds.
     */
    get duration(): number;
    /**
     * @description Start time of the default clip in seconds. Used as the
     * playback start point when an {@link Animator} plays this animation's
     * default clip. Not validated against {@link endTime} or {@link duration}.
     * default: `0`.
     * @return the start time in seconds.
     */
    get startTime(): number;
    /**
     * @description End time of the default clip in seconds. Used as the
     * playback end point when an {@link Animator} plays this animation's
     * default clip. Not clamped to {@link duration} or auto-synced with
     * {@link startTime}. default: `0`.
     * @return the end time in seconds.
     */
    get endTime(): number;
    /**
     * @readonly
     * @description The frame count of the animation.
     * Determined by the track with the highest number of frames.
     * Returns `0` when the animation has no tracks, or when every track has an empty key list.
     * Enabling animation compression on import may reduce this value.
     * @type {number}
     */
    get frameCount(): number;
    /**
     * @description Gets the default `wrapMode` stored on this animation.
     * @type {AnimationWrapMode}
     */
    get wrapMode(): AnimationWrapMode;
    /**
     * @description Sets the default `wrapMode` stored on this animation.
     * @type {AnimationWrapMode}
     */
    set wrapMode(inWrapMode: AnimationWrapMode);
    /**
     * @description Gets the default playback speed multiplier.
     * @return the speed multiplier.
     */
    get speed(): number;
    /**
     * @description Sets the default playback speed multiplier.
     * - `1.0` = normal speed;
     * - `0` = frozen (animation stays at the current frame but does not stop).
     * Must be ≥ 0; negative values produce undefined behavior.
     * Range `[0, 10]` (enforced by the editor). Default: `1.0`.
     * @param inSpeed - the speed multiplier.
     */
    set speed(inSpeed: number);
  }
  /**
   * @description AnimazEventType
   * @enum
   */
  enum AnimationEventType {
    /** Animation start event. */
    AnimationStart,
    /** Animation end event. */
    AnimationEnd,
  }
  /**
   * @description AnimationWrapMode
   * @enum
   */
  enum AnimationWrapMode {
    /** When time reaches the end of the animation clip, the clip will automatically stop playing. */
    Once = 1,
    /** When time reaches the end of the animation clip, time will continue at the beginning. */
    Repeat = 0,
    /** When time reaches the end of the animation clip, time will ping pong back between beginning and end. */
    PingPong = -1,
    /** Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing. */
    ClampForever = -2
  }
  /**
   * @class Animator
   * @description Component that manages the animation resources attached to a scene object and controls playback on this animator.
   * Use it to query animations by name, switch the current playback animation, and listen for events from an animation's default clip.
   * @example
   * const skeletonRoot = scene.findSceneObject("SkeletonAndRenderRoot");
   * const animator = skeletonRoot.getComponent("Animator") as APJS.Animator;
   * const anim = animator.getAnimation("walk");
   * if (anim) {
   *     animator.playback = anim;
   * }
   *
   * const emitter = animator.getEmitter("walk");
   * emitter?.on(APJS.AnimationEventType.AnimationEnd, (event) => {
   *     const nextAnim = animator.getAnimation("idle");
   *     if (nextAnim) { animator.playback = nextAnim; }
   * });
   */
  class Animator extends Component {
    protected constructor();
    /**
     * @description Gets the event emitter for the specified animation.
     * The `animationName` must match the {@link Animation.name} of an animation
     * registered on this animator (i.e. one of the entries in {@link Animator.animations}).
     * Matching is case-sensitive and exact; aliases or state-machine state names are not
     * accepted.
     * Returns `undefined` if the animation does not exist or has no default clip.
     * The first call for a given animation creates a new emitter and caches it; subsequent
     * calls with the same name return the same instance.
     * @param animationName - The animation name, exactly as defined on the animator.
     * @returns The animation event emitter instance, or `undefined` if the animation cannot be resolved.
     * @example
     * const emitter = animator.getEmitter('walk');
     * emitter?.on(APJS.AnimationEventType.AnimationEnd, (event: APJS.IEvent) => {
     *     const animation = event.args[0] as APJS.Animation;
     *     animator.playback = animation;
     * });
     */
    getEmitter(animationName: string): IEventEmitter | undefined;
    /**
     * @description Returns whether the specified animation is currently playing.
     * <br/>The `animationName` must match the {@link Animation.name} of an animation
     * registered on this animator (i.e. one of the entries in {@link Animator.animations}).
     * Matching is case-sensitive and exact; passing an empty string or a name that does
     * not exist returns `false` and logs a warning rather than throwing.
     * Returns `false` when the animation has been paused or stopped, or when it has no default clip.
     * @param animationName - The name of the animation to query, exactly as defined on the animator.
     * @returns True if the specified animation is playing, otherwise false.
     * @example
     *     const isPlaying = animator.isPlaying('walk');
     */
    isPlaying(animationName: string): boolean;
    /**
     * @description Gets the animation resource currently playing on this animator's default layer.
     * Returns `null` if the default layer has no running clip.
     * @returns The animation resource currently playing on the default layer, or `null` if none is available.
     * @example
     * const current = animator.playback;
     * if (current) {
     *     console.log(current.frameCount);
     * }
     */
    get playback(): Animation | null;
    /**
     * @description Sets the animation resource currently played on this animator's default layer.
     * When a non-null animation is assigned at runtime, this animator adds it to `animations` first if needed, then immediately plays that animation's default clip.
     * Set to `null` to stop all animations currently playing on this animator.
     * @param animation - The animation resource to play, or `null` to stop all animations.
     * @example
     * animator.playback = walkAnimation; // start playing a different animation
     */
    set playback(animation: Animation | null);
    /**
     * @description Gets the list of all animation resources associated with this animator.
     * The returned array is a snapshot of the current animation list.
     * Editing that array does not change this animator until you assign the modified array back through `animations`.
     * @returns The current animation resource list.
     * @example
     * const anims = animator.animations;
     * console.log(anims.length);
     */
    get animations(): Animation[];
    /**
     * @description Sets the list of all animation resources associated with this animator.
     * This replaces the animator's current animation list with `value`.
     * @param value - The full animation resource list to assign.
     */
    set animations(value: Animation[]);
    /**
     * @description Gets the animation resource with the specified name.
     * <br/>The `name` must match the {@link Animation.name} of an animation registered
     * on this animator (i.e. one of the entries in {@link Animator.animations}); matching
     * is case-sensitive and exact, and aliases or state-machine names are not accepted.
     * <br/>If no animation with the given name exists, the underlying RTTI returns a
     * native null and this method resolves to a falsy value (`null`/`undefined`); always
     * null-check the result before using it.
     * @param name - The animation name, exactly as defined on the animator.
     * @returns The animation resource with the specified name, or `null` if none matches.
     * @example
     * const anim = animator.getAnimation('walk');
     * if (anim) {
     *     animator.playback = anim;
     * }
     */
    getAnimation(name: string): Animation;
    /**
     * @description Play animation exclusively in the default layer.
     * @deprecated Use `playback` instead.
     * @param animationName - The animation name, exactly as defined on the animator.
     * @param wrapMode - loopCount or wrap mode, a value above 0 means loopCount
     * @param speed - play speed
     * @param fadeTime - blend weight fade duration, if is 0, do transition immediately
     * @example
     * // Play the 'walk' animation registered on the animator.
     * animator.play('walk', AnimationWrapMode.Repeat, 1.0, 0.3);
     */
    play(animationName: string, wrapMode: number | AnimationWrapMode, speed: number, fadeInTime?: number): void;
    /**
     * @description stop all animations playing in this animator
     * @example
     * animator.stopAll();
     */
    stopAll(): void;
    /**
     * @description pause all animations playing in this animator
     * @example
     * animator.pauseAll();
     */
    pauseAll(): void;
    /**
     * @description resume all animations playing in this animator
     * @example
     * animator.resumeAll();
     */
    resumeAll(): void;
  }
  /**
   * @class AObject
   * @description Common base class for many APJS objects that expose shared object identity data.
   * Use `AObject` when you only need common information such as the object's `name`, `guid`, `handle`, or equality,
   * instead of APIs that are specific to a concrete subclass.
   */
  class AObject {
    protected constructor();
    /**
     * @description Gets the name of the object.
     * Default: `''`, unless the concrete object sets another initial name.
     * This API does not enforce any format or uniqueness constraint.
     */
    get name(): string;
    /**
     * @description Sets the name of the object.
     * This API stores the assigned string as-is and does not enforce any format
     * or uniqueness constraint.
     * @param value - The name to set for the object.
     */
    set name(value: string);
  }
  /**
   * @class AudioAsset
   * @description Audio clip of resource.
   */
  class AudioAsset extends AObject {
    protected constructor();
  }
  /**
   * @class AudioDetectorBuilder
   * @description The base builder for audio detectors.
   * Use it to choose which audio source the detector reads from before calling `build()`.
   */
  abstract class AudioDetectorBuilder<T> {
    protected constructor();
    /**
     * @description Set the source of the detector.
     * `Microphone` reads from the microphone input and `Music` reads from the online music input;
     * both ignore `audioComponent`.
     * `ExternalFile` reads from the `audioComponent`'s audio clip player, so `audioComponent` must be provided.
     * `None` leaves the builder without a valid detector source.
     * This method always stores the requested source choice on the builder and returns the builder itself;
     * source validation happens later during `build()`. In particular, `ExternalFile` with a missing player and
     * `None` both lead to a builder state that cannot produce a working detector.
     * @param type - The audio source type to use.
     * @param audioComponent - Pass the audio component that plays the external audio file when `type` is `ExternalFile`;
     * otherwise pass `null`.
     * @example
     * audioDetectorBuilder
     *     .setDetectorSource(APJS.AudioSourceType.ExternalFile, audioComponent)
     *     .build();
     * @returns Builder instance for chaining.
     */
    setDetectorSource(type: AudioSourceType, audioComponent: IAudioComponent | null): this;
  }
  /**
   * @enum AudioSourceType
   * @description The type of audio source for detection.
   */
  enum AudioSourceType {
    None = 0,
    Microphone = 1,
    Music = 2,
    ExternalFile = 3
  }
  /**
   * @class BaseAudioDetector
   * @description The base class for audio detectors with common functionality.
   * Implements {@link IAudioDetector} so every subclass exposes the same `enabled` switch
   * that gates whether the detector actively produces detection results, and centralises
   * the per-frame extractor wiring used by concrete detectors. Concrete detector classes add
   * their own result accessors on top of this base.
   */
  abstract class BaseAudioDetector implements IAudioDetector {
    protected constructor();
    /**
     * @description Whether the detector is enabled.
     * The default value is `true`.
     * When disabled, detector result APIs no longer return detection results and instead return their corresponding no-result values.
     */
    enabled: boolean;
  }
  /**
   * @class BasicScriptComponent
   * @description Base class for script components attached to SceneObjects.
   * Extend this class to implement runtime behavior, respond to lifecycle callbacks, and access the host object through `getSceneObject()`.
   *
   * @example
   * class Rotator extends APJS.BasicScriptComponent {
   *   onInit() {
   *     console.log('onInit');
   *   }
   *
   *   onStart() {
   *     console.log('onStart');
   *   }
   *
   *   onUpdate(deltaTime: number) {
   *     console.log('onUpdate', deltaTime);
   *   }
   *
   *   onDestroy() {
   *     console.log('onDestroy');
   *   }
   * }
   *
   * Lifecycle order for a normally enabled component:
   * 1. `onInit()` — called after the component is added to a SceneObject.
   * 2. `onEnable()` — called after `onInit()` when the component becomes enabled and active.
   * 3. `onStart()` — called before the first frame update.
   * 4. `onUpdate(deltaTime)` — called every frame while the component stays enabled.
   * 5. `onDisable()` — called when the component becomes disabled or invisible, and before `onDestroy()`.
   * 6. `onDestroy()` — called when the component is destroyed.
   * `onEnable()`/`onDisable()` may fire multiple times as the enabled/visible state toggles.
   */
  abstract class BasicScriptComponent extends DynamicComponent {
    /**
     * @description Get the scene object this component is attached to.
     * @returns The scene object this component is attached to.
     */
    getSceneObject(): SceneObject;
    /**
     * @description Called by the engine when the component becomes enabled and active.
     * It is triggered when the component's `enabled` property is set to `true`, or when
     * the SceneObject becomes visible while the component is enabled.
     * For a normally enabled component it runs after `onInit()` and before the first
     * `onStart()`. It may be called multiple times over the component's lifetime as the
     * enabled/visible state toggles.
     */
    onEnable(): void;
    /**
     * @description Called by the engine when the component becomes disabled.
     * It is triggered when the component's `enabled` property is set to `false`, or when
     * the SceneObject becomes invisible while the component is enabled. It also runs before
     * `onDestroy()` when an enabled component is removed or destroyed.
     * It may be called multiple times over the component's lifetime, paired with `onEnable()`.
     */
    onDisable(): void;
    /**
     * @description Called by engine when component is added to SceneObject, will be called even if component is disabled.
     */
    onInit(): void;
    /**
     * @description Called by engine when component is started, will not be called if component is disabled.
     */
    onStart(): void;
    /**
     * @description Called by engine every frame.
     * @param deltaTime - Time duration from last update in seconds.
     */
    onUpdate(deltaTime: number): void;
    /**
     * @description Called by engine every frame after all systems updated.
     * @param deltaTime - Time duration from last update in seconds.
     */
    onLateUpdate(deltaTime: number): void;
    /**
     * @description Called by engine when component is destroyed.
     */
    onDestroy(): void;
    /**
     * @description Called by the runtime when a global event is dispatched.
     *
     * Only pre-registered event types are delivered here (`AppEventType.COMPAT_BEF`,
     * `EventType.DUAL_INSTANCE`, `EventType.SCENE_COMPONENTS_ADDED_OR_REMOVED`).
     * For other event types such as Touch or RecordStart, use
     * `EventManager.getGlobalEmitter().on()` instead — it automatically subscribes
     * to the native event type and is the recommended approach for all new code.
     *
     * @param event - The event object.
     *
     * @example
     * // Recommended: use GlobalEmitter for Touch / Record events
     * export class MyScript extends APJS.BasicScriptComponent {
     *   onStart() {
     *     const emitter = APJS.EventManager.getGlobalEmitter();
     *     emitter.on(APJS.EventType.Touch, this.onTouch, this);
     *   }
     *   onDestroy() {
     *     const emitter = APJS.EventManager.getGlobalEmitter();
     *     emitter.off(APJS.EventType.Touch, this.onTouch, this);
     *   }
     *   private onTouch(event: APJS.IEvent) {
     *     const touch = event.args[0] as APJS.TouchData;
     *   }
     * }
     */
    onEvent(event: IEvent): void;
  }
  /**
   * @class BeatDetector
   * @description A beat detector implementation.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Beat);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     this.detector = builder.build();
   * }
   * onUpdate(dt: number) {
   *     if (this.detector) {
   *         const result = this.detector.getResult();
   *         console.log(result);
   *     }
   * }
   */
  class BeatDetector extends BaseAudioDetector {
    protected constructor();
    /**
     * @description Gets the current beat detection result.
     *
     * All rhythm patterns are quantified to 3/4 or 4/4 time:
     * - 4/4 time: cycles through 1 → 2 → 3 → 4 → 1 → ...
     * - 3/4 time: cycles through 1 → 2 → 3 → 1 → ...
     *
     * Value 1 represents the onset beat (first beat of each measure).
     * There is typically a ~2 second accuracy delay before the detector stabilizes.
     *
     * @returns The current beat position in the measure (1-based), or -1 when no result is available.
     */
    getResult(): number;
  }
  /**
   * @class BeatDetectorBuilder
   * @description A builder for beat detector to configure the detector's audio source and then build the detector.
   * The source settings stored on this builder are the ones used by `build()`.
   * In normal usage, call `setDetectorSource(...)` before `build()`.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Beat);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     const detector = builder.build();
   * }
   */
  class BeatDetectorBuilder extends AudioDetectorBuilder<BeatDetector> {
    protected constructor();
    /**
     * @description Set the source of the beat detector.
     * `Microphone` reads from the microphone input and `Music` reads from the online music input;
     * both ignore `audioComponent`.
     * `ExternalFile` reads from the `audioComponent`'s audio clip player, so `audioComponent` must be provided.
     * `None` leaves the builder without a valid detector source.
     * The selected source and component are stored on the builder and applied when `build()` is called.
     * @param type - The audio source type to use.
     * @param audioComponent - The audio component that plays the external audio file when `type` is `ExternalFile`.
     * @returns Builder instance for chaining.
     */
    setDetectorSource(type: AudioSourceType, audioComponent: IAudioComponent | null): this;
    /**
     * @description Build the beat detector from the source configuration currently stored on this builder.
     * Returns `null` only when the detector type is unavailable in the current runtime (`isAvailable === false`).
     * Source misconfiguration does not produce `null` here: `build()` still creates a detector instance, but an
     * invalid source choice such as `None` or an `ExternalFile` source without a usable audio player prevents the
     * detector from wiring a working extractor node and therefore from producing results.
     * @returns Detector instance of the beat detector, or `null` when this detector type is unavailable.
     */
    build(): BeatDetector | null;
  }
  /**
   * @description Enumeration representing blend factors used in blending operations.
   * @enum
   */
  enum BlendFactor {
    /** Blending factor that uses zero as the source and destination color values. */
    Zero,
    /** Blending factor that uses one as the source and destination color values. */
    One,
    /** Blending factor that uses the source color as the source value. */
    SrcColor,
    /** Blending factor that uses one minus the source color as the source value. */
    OneMinusSrcColor,
    /** Blending factor that uses the destination color as the source value. */
    DstColor,
    /** Blending factor that uses one minus the destination color as the source value. */
    OneMinusDstColor,
    /** Blending factor that uses the source alpha as the source value. */
    SrcAlpha,
    /** Blending factor that uses one minus the source alpha as the source value. */
    OneMinusSrcAlpha,
    /** Blending factor that uses the destination alpha as the source value. */
    DstAlpha,
    /** Blending factor that uses one minus the destination alpha as the source value. */
    OneMinusDstAlpha
  }
  /**
   * @description Defines the blend operations that can be used for blending colors.
   * @enum
   */
  enum BlendOperation {
    /** Adds the source and destination colors. */
    Add,
    /** Subtracts the destination color from the source color. */
    Subtract,
    /** Subtracts the source color from the destination color. */
    ReverseSubtract,
    /** Takes the minimum of the source and destination colors. */
    Min,
    /** Takes the maximum of the source and destination colors. */
    Max
  }
  /**
   * @class BlendState
   * @extends AObject
   * @description Represents the blend state for color blending in the rendering pipeline.
   * APJS getters and setters here operate on the first color attachment (`attachments[0]`) only;
   * if the native blend state has no attachment yet, the first setter call creates that attachment.
   * For advanced multi-attachment cases, work with the native blend state directly through the
   * inherited native accessors. The native RHI fallback for a missing color attachment is blend
   * disabled with `src = ONE`, `dst = ZERO`, and blend operations set to `ADD`.
   *
   * @example <caption>Basic Usage: Setting Up Alpha Blending</caption>
   * // Create a new blend state for alpha blending
   * const blendState = new BlendState();
   * blendState.enabled = true;
   * blendState.srcColorFactor = BlendFactor.SrcAlpha;
   * blendState.dstColorFactor = BlendFactor.OneMinusSrcAlpha;
   * blendState.colorBlendOperation = BlendOperation.Add;
   * blendState.srcAlphaFactor = BlendFactor.SrcAlpha;
   * blendState.dstAlphaFactor = BlendFactor.OneMinusSrcAlpha;
   * blendState.alphaBlendOperation = BlendOperation.Add;
   *
   * // Apply the blend state to a material
   * material.mainPass.blendState = blendState;
   *
   * @example <caption>Advanced Usage: Setting Up Additive Blending</caption>
   * // Create a new blend state for additive blending
   * const additiveBlendState = new BlendState();
   * additiveBlendState.enabled = true;
   * additiveBlendState.srcColorFactor = BlendFactor.SrcAlpha;
   * additiveBlendState.dstColorFactor = BlendFactor.One;
   * additiveBlendState.colorBlendOperation = BlendOperation.Add;
   * additiveBlendState.srcAlphaFactor = BlendFactor.SrcAlpha;
   * additiveBlendState.dstAlphaFactor = BlendFactor.One;
   * additiveBlendState.alphaBlendOperation = BlendOperation.Add;
   *
   * // Apply the blend state to a material
   * material.mainPass.blendState = additiveBlendState;
   *
   * @see BlendFactor
   * @see BlendOperation
   */
  class BlendState extends AObject {
    /**
     * @description Constructs a BlendState object.
     * @param rtti The native color blend state to wrap (optional).
     */
    constructor();
    /**
     * @description Indicates whether blending is enabled for the color attachment state.
     * This script property reflects the first color attachment only.
     * @returns True if blending is enabled, false otherwise.
     */
    get enabled(): boolean;
    /**
     * @description Sets the enabled state of the blend state for the first attachment.
     * This does not change the blend factors or operations; it only toggles whether the first attachment uses them.
     * @param value True to enable blending, false otherwise.
     */
    set enabled(value: boolean);
    /**
     * @description The source color blend factor for the first attachment in the blend state.
     * The native fallback default is `BlendFactor.One` until the first attachment is explicitly configured.
     * Only takes effect when {@link enabled} is `true`.
     * @returns The source color blend factor.
     */
    get srcColorFactor(): BlendFactor;
    /**
     * @description Sets the source color blend factor for the first attachment.
     * @param value The source color blend factor to set.
     */
    set srcColorFactor(value: BlendFactor);
    /**
     * @description The destination color blend factor for the first attachment in the blend state.
     * The native fallback default is `BlendFactor.Zero` until the first attachment is explicitly configured.
     * Only takes effect when {@link enabled} is `true`.
     * @returns The destination color blend factor.
     */
    get dstColorFactor(): BlendFactor;
    /**
     * @description Sets the destination color blend factor for the first attachment.
     * @param value The destination color blend factor to set.
     */
    set dstColorFactor(value: BlendFactor);
    /**
     * @description The source alpha blend factor for the first color attachment in the blend state.
     * The native fallback default is `BlendFactor.One` until the first attachment is explicitly configured.
     * Configured independently from the color factors and only takes effect when {@link enabled} is `true`.
     * @returns The source alpha blend factor.
     */
    get srcAlphaFactor(): BlendFactor;
    /**
     * @description Sets the source alpha blend factor for the first attachment.
     * @param value The source alpha blend factor to set.
     */
    set srcAlphaFactor(value: BlendFactor);
    /**
     * @description The destination alpha blend factor for the first color attachment in the blend state.
     * The native fallback default is `BlendFactor.Zero` until the first attachment is explicitly configured.
     * Configured independently from the color factors and only takes effect when {@link enabled} is `true`.
     * @returns The destination alpha blend factor.
     */
    get dstAlphaFactor(): BlendFactor;
    /**
     * @description Sets the destination alpha blend factor for the first attachment.
     * @param value The destination alpha blend factor to set.
     */
    set dstAlphaFactor(value: BlendFactor);
    /**
     * @description The blend operation for the first color attachment in the blend state.
     * The native fallback default is `BlendOperation.Add`, which combines the source and
     * destination colors using their respective blend factors. Only takes effect when
     * {@link enabled} is `true`.
     * @returns The color blend operation.
     */
    get colorBlendOperation(): BlendOperation;
    /**
     * @description Sets the color blend operation for the first attachment.
     * @param value The color blend operation to set.
     */
    set colorBlendOperation(value: BlendOperation);
    /**
     * @description The blend operation for alpha blending in the first color attachment in the blend state.
     * The native fallback default is `BlendOperation.Add`. Configured independently from
     * {@link colorBlendOperation} and only takes effect when {@link enabled} is `true`.
     * @returns The alpha blend operation.
     */
    get alphaBlendOperation(): BlendOperation;
    /**
     * @description Sets the alpha blend operation for the first attachment in the blend state.
     * @param value The alpha blend operation to set.
     */
    set alphaBlendOperation(value: BlendOperation);
  }
  /**
   * @description Current-frame 2D body skeleton in normalized image coordinates.
   * Obtain this with AlgorithmResult.getBody2DInfo and check for null. Reacquire
   * the result each frame and check landmarkValidities for every point you use.
   * The 18-element array length alone does not mean all points were detected.
   * Treat the rectangle, point array and validity array as read-only.
   */
  interface Body2DInfo {
    /** @description Tracking ID within the 2D skeleton tracker. */
    readonly ID: number;
    /** @description Normalized body bounding rectangle. */
    readonly rect: Rect;
    /**
     * @description 18 landmarks in tracker order:
     * 0 Nose; 1 Neck; 2 RightShoulder; 3 RightElbow; 4 RightWrist;
     * 5 LeftShoulder; 6 LeftElbow; 7 LeftWrist; 8 RightHip; 9 RightKnee;
     * 10 RightAnkle; 11 LeftHip; 12 LeftKnee; 13 LeftAnkle;
     * 14 RightEye; 15 LeftEye; 16 RightEar; 17 LeftEar.
     * Check landmarkValidities before using each point. No component-specific mirroring is applied.
     */
    readonly landmarks: Vector2f[];
    /** @description 18 flags in landmark order: 1 means detected, 0 means unavailable. */
    readonly landmarkValidities: Uint8Array;
  }
  /** @description 3D body result sharing the existing BodyInfo contract. */
  type Body3DInfo = BodyInfo;
  /**
   * @interface
   * @description A current-frame result from the 3D body tracker.
   * Accessed via {@link AlgorithmResult.getBody3DInfo}. Valid only
   * for the frame in which it was produced.
   * @deprecated Use Body3DInfo.
   */
  interface BodyInfo {
    /**
     * @readonly
     * @description Whether this body is detected in the current frame. `false` means
     * this entry should be treated as not detected.
     * @type {boolean}
     */
    readonly detected: boolean;
  }
  /**
   * @class BoxCollider
   * @description Represents a box-shaped collider component used for physics collision detection.
   * Use this when the collision shape is best approximated by a rectangular
   * volume, such as crates, walls, or simple hitboxes.
   * Inherited properties such as {@link center}, {@link rotation},
   * {@link isTangible}, and {@link emitCollisionEvent} still apply.
   *
   * @example
   * const box = obj.getComponent("BoxCollider") as APJS.BoxCollider;
   * box.size = new APJS.Vector3f(20, 10, 6); // change the size of the box collider
   * box.center = new APJS.Vector3f(0, 2, 0); // change the center of the box collider
   */
  class BoxCollider extends Collider {
    protected constructor();
    /**
     * @description Gets or sets the authored size of the box collider.
     * This is the full width, height, and depth of the box shape in local
     * collider space. Defaults to (8, 8, 8), which is the same as the default cube size.
     * @returns {Vector3f} The size vector with x, y, z dimensions of the box collider
     */
    get size(): Vector3f;
    /**
     * @description Sets the size of the box collider. Updates the physical properties of the collider when changed.
     * @param value The new size vector with x, y, z dimensions for the box collider
     */
    set size(value: Vector3f);
  }
  /**
   * @class BoxCollider2D
   * @description A rectangular 2D collider.
   * Use this for simple 2D boundaries such as character hitboxes, walls,
   * floors, or trigger regions.
   * Inherited properties such as {@link offset}, {@link isTangible}, and
   * {@link emitCollisionEvent} still apply.
   *
   * @example
   * const box = obj.getComponent("BoxCollider2D") as APJS.BoxCollider2D;
   * box.size = new APJS.Vector2f(40, 20); // change the size of the box collider
   * box.offset = new APJS.Vector2f(0, 10); // change the offset of the box collider
   */
  class BoxCollider2D extends Collider2D {
    protected constructor();
    /**
     * @description Gets or sets the authored size of the 2D box collider.
     * This is the full width and height of the rectangular shape.
     * @type {Vector2f}
     */
    get size(): Vector2f;
    /**
     * @description Sets the size of the box collider.
     * @param value - The new size of the box collider.
     */
    set size(value: Vector2f);
  }
  /**
   * @class Camera
   * @description
   * A Camera is a device through which the player views the world.
   * <br/>It defines the visible region via projection (perspective or orthographic),
   * clipping planes (near/far), field of view, viewport rect, and render layers.
   * <br/>The camera looks down its local <b>negative Z-axis</b>; use
   * {@link Quaternionf.lookAt} or Transform rotation to aim it.
   * <br/>Use `sceneObject.addComponent("Camera")` to create one camera component.
   * @example
   * // Get the existing camera from the scene
   * const camObj = this.getSceneObject().scene.findSceneObject("Camera");
   * const cam = camObj.getComponent("Camera") as APJS.Camera;
   *
   * // Change camera properties
   * cam.cameraType = APJS.CameraType.Perspective;
   * cam.fov = 45; // 45 degrees
   * cam.near = 0.1;
   * cam.far = 1000;
   * cam.clearColor = new APJS.Color(0.2, 0.2, 0.2, 1);
   *
   * // Convert pixel screen coordinates to a world-space ray for picking
   * const ray = cam.ScreenPointToRay(new APJS.Vector2f(screenX, screenY));
   *
   * // Implement a third-person follow camera
   * const player = this.getSceneObject().scene.findSceneObject("Player"); // Player can be a sphere for example
   * const targetPos = player.getTransform().getWorldPosition().clone();
   * const offset = new APJS.Vector3f(0, 8, 20);
   * camObj.getTransform().setWorldPosition(targetPos.add(offset));
   * const forward = camObj.getTransform().getWorldPosition().subtract(targetPos).normalize();
   * camObj.getTransform().localRotation = APJS.Quaternionf.lookAt(forward, new APJS.Vector3f(0, 1, 0));
   */
  class Camera extends Component {
    protected constructor();
    /**
     * @description The color used to clear this Camera's render target before drawing, when `inputTexture` is null.
     * Only takes effect when `clearType` includes color clearing; ignored otherwise.
     * If `inputTexture` is assigned and color clearing is active, that texture provides the base color instead.
     */
    get clearColor(): Color;
    /**
     * @description Sets the clear color for the camera.
     * Only affects rendering when `clearType` includes color clearing and `inputTexture` is null.
     * @param color - The new clear color for the camera.
     */
    set clearColor(color: Color);
    /**
     * @description Gets the clear type of the current camera.
     */
    get clearType(): CameraClearType;
    /**
     * @description Sets the type of clearing operation for the camera.
     * @param type - The new clear type for the camera.
     */
    set clearType(type: CameraClearType);
    /**
     * @description Gets the type of the camera, which can be either CameraType.Ortho or CameraType.Perspective.
     */
    get cameraType(): CameraType;
    /**
     * @description Sets the type of the camera.
     * @param type - The new type for the camera.
     */
    set cameraType(type: CameraType);
    /**
     * @description The orthographic height of the camera if the camera type is orthographic.
     * Only meaningful when `cameraType` is `CameraType.Ortho`.
     * Default: `1.0`. Recommended range: `[0, 99]`.
     * The value is forwarded as-is and is not clamped at this layer.
     */
    get orthoHeight(): number;
    /**
     * @description Sets the orthographic height of the camera.
     * Only meaningful when `cameraType` is `CameraType.Ortho`.
     * @param height - The new orthographic height for the camera.
     */
    set orthoHeight(height: number);
    /**
     * @description The distance of the far clipping plane.
     * Objects farther than this value are not rendered.
     * Default: 1000
     */
    get far(): number;
    /**
     * @description Sets the far clipping plane of the camera, defining the maximum distance at which objects are visible.
     * APJS forwards this value directly and does not enforce `far > near` in this layer.
     * @param value - The new far clipping plane for the camera.
     */
    set far(value: number);
    /**
     * @description The distance of the near clipping plane.
     * Objects closer than this value are not rendered.
     * Default: 0.1
     */
    get near(): number;
    /**
     * @description Sets the near clipping plane of the camera, defining the closest distance at which objects are visible.
     * APJS forwards this value directly and does not enforce positivity or a `near < far` relationship in this layer.
     * @param value - The new near clipping plane for the camera.
     */
    set near(value: number);
    /**
     * @description The Camera's field of view in degrees.
     * Only effective when {@link cameraType} is {@link CameraType.Perspective}.
     * range: [0.0, 180.0] default: 60.0
     */
    get fov(): number;
    /**
     * @description Sets the field of view (FOV) for the camera.
     * @param value - The new field of view for the camera.
     */
    set fov(value: number);
    /**
     * @description Gets the field of view type for the camera.
     * The native default is `CameraFovType.Custom`.
     * This setting is only meaningful for perspective cameras.
     */
    get fovType(): CameraFovType;
    /**
     * @description Sets the field of view type for the camera.
     * `CameraFovType.Custom` uses the stored `fov` value.
     * `CameraFovType.Physical` lets the native camera use platform/device FOV when the physical-FOV
     * feature is enabled; otherwise this mode may not change the effective projection.
     * @param value - The new field of view type for the camera.
     */
    set fovType(value: CameraFovType);
    /**
     * @description The texture blit to the render target as the base color at the start of each frame, before scene objects are rendered on top.
     * Only takes effect when `clearType` includes color clearing (e.g. `CameraClearType.Color`, `CameraClearType.ColorDepth`); ignored otherwise.
     * When null and color clearing is active, `clearColor` is used instead.
     * Its size is not guaranteed to match `renderTexture` or the preview viewport.
     */
    get inputTexture(): Texture | null;
    /**
     * @description Sets the texture to blit to the render target as the base color each frame.
     * Only effective when `clearType` includes color clearing; ignored otherwise.
     * @param value - The new input texture for the camera.
     */
    set inputTexture(value: Texture | null);
    /**
     * @description Gets the set of layers this Camera will render.
     */
    get renderLayer(): LayerSet;
    /**
     * @description Sets the render layer for the camera.
     * @param value - The new render layer for the camera.
     */
    set renderLayer(value: LayerSet);
    /**
     * @description The RenderTexture this camera renders scene objects into each frame.
     * Defaults to the Final Render Output bound by the runtime; can be replaced with a custom RenderTexture via the setter.
     * Its dimensions are not guaranteed to match `inputTexture` or the preview viewport.
     */
    get renderTexture(): Texture;
    /**
     * @description Sets a custom `RenderTexture` as this camera's output render target.
     * The input must be a `RenderTexture`.
     * Passing `null` clears the current render texture.
     * Passing any other texture type logs an error and leaves the current target unchanged.
     * @param value - The new render texture for the camera.
     */
    set renderTexture(value: Texture);
    /**
     * @description Gets the depth texture currently assigned to this camera.
     * The returned texture is the `DrawTexture` used as the camera's depth attachment source.
     */
    get depthRenderTexture(): Texture;
    /**
     * @description Sets the depth texture for the camera.
     * The input must be a `DrawTexture`.
     * Passing `null` clears the current depth texture.
     * Passing any other texture type logs an error and leaves the current depth texture unchanged.
     * @param value - The new depth render texture for the camera.
     */
    set depthRenderTexture(value: Texture);
    /**
     * @description The camera viewport, in normalized coordinates.
     * Default: `(0, 0, 1, 1)`, which covers the full render target.
     * `x` and `y` are offsets, and `width` and `height` are sizes, all relative
     * to the current render target.
     * Values outside `[0, 1]` are allowed. The effective viewport is clipped
     * to the current render target.
     */
    get viewport(): Rect;
    /**
     * @description Sets the camera viewport in normalized coordinates.
     * `x` and `y` are offsets, and `width` and `height` are sizes, all relative
     * to the current render target.
     * Values outside `[0, 1]` are allowed. The effective viewport is clipped
     * to the current render target.
     * @param value - The new viewport for the camera.
     */
    set viewport(value: Rect);
    /**
     * @description The sorting order the Camera renders in. Every frame, Cameras render in ascending order determined by their renderOrder properties.
     */
    get renderOrder(): number;
    /**
     * @description Sets the render order of the camera.
     * @param value - The new render order for the camera.
     */
    set renderOrder(value: number);
    /**
     * @readonly
     * @description Get the current projection matrix of the camera.
     */
    get projectionMatrix(): Matrix4x4f;
    /**
     * @description Converts a point from view port space to world space.
     * <br/>Viewport coordinates are normalized: (0, 0) is the bottom-left and (1, 1) is the top-right.
     * The Z component specifies the world-unit depth from the camera's near plane.
     * @param viewPortPoint - A point in view port space represented as a Vector3f (x, y in [0, 1]; z is depth).
     * @returns The corresponding point in world space as a Vector3f.
     * @example
     * // for default camera at (0, 0, 40), the following call returns (0, 0, 30)
     * const worldPos = cam.viewportToWorldPoint(new APJS.Vector3f(0.5, 0.5, 10));
     */
    viewportToWorldPoint(viewPortPoint: Vector3f): Vector3f;
    /**
     * @description Projects a point from world space to viewport space.
     * The returned viewport coordinates use a normalized range where `x` and `y` are typically in `[0, 1]`, with `(0, 0)` at the bottom-left of the viewport and `(1, 1)` at the top-right.
     * The returned `z` value represents the distance from the camera along its view direction, in world units.
     * @param worldPoint - A point in world space represented as a Vector3f.
     * @returns The calculated point in viewport space as a Vector3f.
     * @example
     * // for default camera at (0, 0, 40), the following call returns (0.5, 0.5, 10)
     * const viewportPos = cam.worldToViewportPoint(new APJS.Vector3f(0, 0, 30));
     */
    worldToViewportPoint(worldPoint: Vector3f): Vector3f;
    /**
     * @description Converts a screen space position to a world space position.
     * @param screenPoint - A point in screen space represented as a `Vector3f`.
     * <br/>`x` and `y` are pixel coordinates with a bottom-left origin, in the
     * <br/>current render target and camera viewport.
     * <br/>This is different from {@link TouchData.position}, which uses normalized
     * <br/>coordinates with a top-left origin.
     * <br/>`z` is the distance along the camera viewing axis in world units.
     * <br/>Use the `z` value from {@link worldToScreenPoint} to round-trip correctly.
     * @returns The corresponding world space position as a `Vector3f`.
     * @example
     * // for the default camera at (0, 0, 40), using the center of the current
     * // render target with z = 30 returns (0, 0, 10)
     * const worldPos = cam.screenToWorldPoint(new APJS.Vector3f(360, 640, 30));
     */
    screenToWorldPoint(screenPoint: Vector3f): Vector3f;
    /**
     * @description Converts a world space position to a screen space position.
     * @param worldPoint - The world space point as a `Vector3f`.
     * @returns The corresponding screen space position as a `Vector3f`.
     * <br/>`x` and `y` are pixel coordinates with a bottom-left origin, in the
     * <br/>current render target and camera viewport.
     * <br/>This is different from {@link TouchData.position}, which uses normalized
     * <br/>coordinates with a top-left origin.
     * <br/>The returned `z` component is the distance along the camera viewing axis
     * <br/>in world units.
     * @example
     * // for the default camera at (0, 0, 40), the following call returns the
     * // center of the current render target, with z = 30
     * const screenPos = cam.worldToScreenPoint(new APJS.Vector3f(0, 0, 10));
     * // Use screenPoint.x and screenPoint.y to position a 2D UI indicator
     * const screenPointVec3f = cam.worldToScreenPoint(enemy.getTransform().getWorldPosition());
     * const screenPos = new APJS.Vector2f(screenPointVec3f.x, screenPointVec3f.y); // pixel coordinates
     */
    worldToScreenPoint(worldPoint: Vector3f): Vector3f;
    /**
     * @description Generates a ray from the specified position in this camera's viewport space.
     * <br/>Viewport coordinates are normalized: (0, 0) is the bottom-left and (1, 1) is the top-right.
     * Useful for generating rays from UI elements whose positions are in normalized layout space.
     * @param viewportPoint - A point in viewport space represented as a Vector2f (range [0, 1]).
     * @returns The calculated world space ray as a Ray object.
     * @example
     * // For a default camera at (0, 0, 40) and a default cube at (0, 0, 0)
     * // with box collider size (8, 8, 8), the following call logs (0, 0, 4).
     * // The ray to the center of the screen hits the front face of the cube first, and the front face is at z = 4.
     * const ray = cam.viewportPointToRay(new APJS.Vector2f(0.5, 0.5));
     * const hits = APJS.Physics3D.raycast(ray, 1000, true);
     * console.log("raycastHit:", hits[0].point);
     */
    viewportPointToRay(viewportPoint: Vector2f): Ray;
    /**
     * @description Generates a ray from the screen position in this camera's view space.
     * <br/>The screen coordinate system origin (0, 0) is at the bottom-left,
     * with x increasing rightward and y increasing upward, measured in pixels.
     * This is the screen-space counterpart of {@link viewportPointToRay}.
     * The capitalized method name is kept for backward compatibility with the native API;
     * prefer `ScreenPointToRay` in new code.
     * @param screenPoint - A point in screen space represented as a Vector2f (pixels).
     * @returns The calculated world space ray as a Ray object.
     * @example
     * // For a default camera at (0, 0, 40) and a default cube at (0, 0, 0)
     * // with box collider size (8, 8, 8), the following call logs (0, 0, 4).
     * // The ray to the center of the screen hits the front face of the cube first, and the front face is at z = 4.
     * const ray = cam.ScreenPointToRay(new APJS.Vector2f(640, 360));
     * const hits = APJS.Physics3D.raycast(ray, 500, true);
     * console.log("raycastHit:", hits[0].point);
     */
    ScreenPointToRay(screenPoint: Vector2f): Ray;
    /**
     * @description Retrieves the transformation matrix that converts coordinates from world space to clip space.
     * @returns The 4x4 matrix representing the world-to-clip space transformation.
     */
    getWorldToClipMatrix(): Matrix4x4f;
    /**
     * @description Get the matrix that transforms from camera space to world space.
     * Use this to calculate where in the world a specific camera space point is located.
     * @returns The transformation matrix from camera space to world space.
     */
    getCameraToWorldMatrix(): Matrix4x4f;
    /**
     * @description Retrieves the matrix that transforms coordinates from world space to camera space.
     * <br/>This matrix is commonly known as the "view matrix" in graphics literature.
     * <br/>It can be used to determine the position of game objects in camera space or to specify a custom camera location independent of its transform.
     * @returns The transformation matrix from world space to camera space.
     */
    getWorldToCameraMatrix(): Matrix4x4f;
    /**
     * @description Gets the camera's forward direction, also known as the look-at direction.
     * This method returns the normalized vector that the camera is currently looking toward
     * (i.e., the default camera looks in the world-space direction of -Z in camera space, returns (0, 0, -1)).
     * <br/>When constructing a follow-camera with {@link Quaternionf.lookAt}, pass
     * `cameraPosition.subtract(targetPosition)` as the forward vector — NOT
     * `targetPosition.subtract(cameraPosition)` — because `lookAt` aligns the object's
     * positive Z-axis, which is opposite to the camera's view direction.
     * @returns The forward direction vector of the camera.
     * @example
     * const forward = cam.getLookAt();
     * const right = forward.cross(new APJS.Vector3f(0, 1, 0)).normalize();
     */
    getLookAt(): Vector3f;
  }
  /**
   * @description Specifies what to clear when a camera renders.
   * @enum
   */
  enum CameraClearType {
    /** Clear color only. */
    Color,
    /** Clear depth only. */
    Depth,
    /** Clear color and depth. */
    ColorDepth,
    /** Clear nothing. */
    Dont,
    /** Clear depth and stencil. */
    DepthStencil,
    /** Clear color, depth and stencil. */
    ColorDepthStencil,
    /** Clear stencil only. */
    Stencil,
    /** Clear color and stencil. */
    ColorStencil,
    /** Clear with a texture. */
    Texture,
    /** Clear depth with a texture. */
    TextureDepth
  }
  /**
   * @description Defines how the camera's Field of View (FOV) is determined.
   * @enum
   */
  enum CameraFovType {
    /** Custom FOV setting. */
    Custom,
    /** FOV based on physical properties. */
    Physical
  }
  /**
   * @description Defines the projection type of a camera.
   * @enum
   */
  enum CameraType {
    /** Perspective projection. */
    Perspective,
    /** Orthogonal projection. */
    Ortho
  }
  /**
   * @class CapsuleCollider
   * @description Represents a capsule-shaped collider component used for physics collision detection.
   * Use this for rounded elongated volumes such as characters, limbs, or
   * simple props that need smoother contact than a box.
   * APJS exposes {@link radius} (default 5) and {@link height} (default 8) for
   * the shape. It does not expose a separate capsule direction property.
   * Both values are expressed in the collider's local units and are additionally
   * scaled by the object's world scale at runtime. The two are independent: the
   * total length of the capsule along its axis is `height + 2 * radius`.
   * The authored values are stored in local collider space and are applied to the native collider
   * when the component is initialized or when these properties are updated afterward.
   *
   * @example
   * const capsule = obj.getComponent("CapsuleCollider") as APJS.CapsuleCollider;
   * capsule.radius = 4; // change the radius of the capsule collider
   * capsule.height = 16; // change the height of the capsule collider
   * capsule.center = new APJS.Vector3f(0, 8, 0); // change the center of the capsule collider
   */
  class CapsuleCollider extends Collider {
    protected constructor();
    /**
     * @description Gets or sets the authored radius of the capsule collider,
     * in the collider's local units (additionally scaled by world scale at
     * runtime). This is the radius of the rounded caps. Larger values make the
     * capsule thicker. Should be positive. Defaults to 5.
     * @returns {number} The radius of the capsule collider
     */
    get radius(): number;
    /**
     * @description Sets the radius of the capsule collider.
     * @param value - The radius value to set.
     */
    set radius(value: number);
    /**
     * @description Gets or sets the authored height of the capsule collider,
     * in the collider's local units (additionally scaled by world scale at
     * runtime). This is the length of the straight cylindrical middle section,
     * excluding the two rounded caps, so the full capsule length along its axis
     * is `height + 2 * {@link radius}`. {@link radius} and height are independent
     * and not clamped against each other. Should be positive. Defaults to 8.
     * @returns {number} The height of the capsule collider
     */
    get height(): number;
    /**
     * @description Sets the height of the capsule collider.
     * @param value - The height value to set.
     */
    set height(value: number);
  }
  /**
   * @description
   * <br/>CaptureFrameHelper is a helper class to capture camera output.
   * <br/>It captures from a camera's current `renderTexture` by scheduling a one-shot copy after
   * the next `AFTER_RENDER` event, and returns the destination texture immediately.
   * @example
   * let texture = APJS.CaptureFrameHelper.captureCameraOutput(camera);
   * @class CaptureFrameHelper
   */
  class CaptureFrameHelper {
    protected constructor();
    /**
     *
     * @description capture camera output to a texture
     * @param camera The camera to capture output from.
     * @param cropRect The crop rectangle to apply to the captured frame in normalized texture coordinates (default is Rect(0, 0, 1, 1)). x and y represent the crop origin, width and height represent the crop size, and each value is typically in the range [0, 1]. For example, Rect(0, 0, 1, 1) captures the full output, Rect(0, 0, 0.5, 0.5) captures the bottom-left quarter, and x + width / y + height should not exceed 1.
     * @param resolutionRatio The resolution ratio to apply to the captured frame (default is 1.0).
     * Values greater than `1.0` are clamped to full resolution, and values less than or equal to
     * `0.002` fall back to a `1x1` capture texture.
     * @returns The captured texture, or null if capture failed.
     * Returns `null` when the camera is missing or has no `renderTexture` to copy from.
     * @example
     * const texture = CaptureFrameHelper.captureCameraOutput(camera, new Rect(0, 0, 1, 1), 0.5);
     */
    static captureCameraOutput(camera: Camera, cropRect?: Rect, resolutionRatio?: number): Texture | null;
  }
  /**
   * @class CircleCollider2D
   * @description A circular 2D collider.
   * Use this for round 2D collision volumes such as wheels, projectiles,
   * pickups, or simple trigger regions.
   * Inherited properties such as {@link offset}, {@link isTangible}, and
   * {@link emitCollisionEvent} still apply.
   * `radius` defines the authored circle size used by the collider itself.
   * The serialized `fitImage` flag does not overwrite `radius` inside the APJS layer; any image-fit
   * behavior is consumed elsewhere from serialized data.
   *
   * @example
   * const circle = obj.getComponent("CircleCollider2D") as APJS.CircleCollider2D;
   * circle.radius = 16; // change the radius of the circle collider
   * circle.isTangible = false; // use as a circular trigger region
   */
  class CircleCollider2D extends Collider2D {
    protected constructor();
    /**
     * @description Gets or sets the authored radius of the 2D circle collider,
     * in local 2D units (additionally scaled by the object's world scale at
     * runtime). Larger values produce a larger circular collision region.
     * Should be positive. Defaults to 1.
     * @type {number}
     */
    get radius(): number;
    /**
     * @description Sets the radius of the circle collider.
     */
    set radius(value: number);
    /**
     * @description Gets or sets the serialized "fit image" flag for this circle collider.
     * Default: `false`.
     * The APJS layer only stores this flag and does not modify `radius` or rebuild the collider when the flag changes;
     * any "fit the attached image" behavior is consumed elsewhere from the serialized value.
     */
    get fitImage(): boolean;
    set fitImage(value: boolean);
  }
  /**
   * @class Collider
   * @description Base class for 3D collision shapes.
   * Use a collider to define how a SceneObject participates in 3D contact
   * tests, trigger detection, and rigid body collision response.
   * Typically it is used alongside a {@link RigidBody}.
   *
   * {@link isTangible} is the main collision-vs-trigger switch.
   * When {@link emitCollisionEvent} is enabled, APJS collects every contact
   * this collider had during the most recent physics update and emits
   * {@link CollisionEvent.Enter}, {@link CollisionEvent.Stay}, and
   * {@link CollisionEvent.Exit} on the following frame.
   * Most authored properties on this class start as local configuration values and are pushed to
   * the native collider after initialization, or immediately when an initialized collider is updated.
   *
   * @example
   * const collider = obj.getComponent("BoxCollider") as APJS.BoxCollider;
   * collider.isTangible = true; // the collider cannot be passed through
   * collider.emitCollisionEvent = true;
   * APJS.EventManager.getObjectEmitter(collider).on(
   *   APJS.CollisionEvent.Enter, (ev) => {
   *     const infos = ev.args[0] as APJS.CollisionInfo[];
   *   }
   * );
   */
  class Collider extends DynamicComponent {
    protected constructor();
    /**
     * @description Gets or sets whether the collider is tangible. Default is true.
     * When true, objects collide with it normally. When false, it becomes a
     * trigger — objects can pass through it, but collision events can still be detected.
     */
    get isTangible(): boolean;
    set isTangible(value: boolean);
    /**
     * @description Gets or sets the collider's local center offset relative to the SceneObject.
     * Use this to shift the collision shape without moving the visual object itself,
     * such as placing a hitbox slightly in front of a character.
     * Default: `(0, 0, 0)` in local units.
     * When an initialized collider is not attached to a rigid body, APJS multiplies this offset by
     * the SceneObject's world scale before forwarding it to the native collider.
     */
    get center(): Vector3f;
    set center(value: Vector3f);
    /**
     * @description Gets or sets whether this collider is marked as interactable for the Physics Interactor path.
     * When enabled, APJS adds a dedicated interaction bit to the collider's category mask so
     * Physics Interactor Script Graph Node can pick and drag it. This does not change normal collision behavior.
     * Default: `true`.
     * This flag only affects the Physics Interactor pickup / drag path and does not by itself enable collision events.
     */
    get interactable(): boolean;
    set interactable(value: boolean);
    /**
     * @description Gets or sets the physics material used by this collider.
     * The assigned material provides dynamic friction, static friction, and bounciness
     * values for contact response.
     * Default: `null`, which makes the collider use this class's built-in fallback coefficients
     * (`dynamic=0.6`, `static=0.61`, `restitution=0.3 * 0.96` in the native mapping path).
     * When a `PhysicsMaterial` is assigned, its public coefficients are typically expected in `[0, 1]`.
     */
    get physicsMaterial(): PhysicsMaterial | null;
    set physicsMaterial(value: PhysicsMaterial | null);
    /**
     * @description Local rotation offset of the collider shape, stored as a quaternion.
     * This rotates the collision shape relative to the SceneObject or attached RigidBody,
     * without rotating the visual object itself. It is a collider configuration value,
     * not the live world-space rotation currently simulated by physics.
     * Default: identity quaternion `(0, 0, 0, 1)`.
     * APJS stores the authored quaternion as-is and does not normalize or validate it at this layer.
     */
    get rotation(): Quaternionf;
    set rotation(value: Quaternionf);
    /**
     * @description Same local collider rotation as {@link rotation}, expressed as Euler angles in degrees.
     * Use this when you want to rotate the collision shape relative to the object.
     * This is not the current world-space rotation of the physics body.
     * Default: `(0, 0, 0)`.
     * APJS converts between this value and {@link rotation} through
     * {@link Quaternionf.makeFromEulerAngles} and {@link Quaternionf.toEulerAngles},
     * so the component meaning follows `Quaternionf`: `(pitch, yaw, roll)`.
     */
    get eulerAngles(): Vector3f;
    set eulerAngles(value: Vector3f);
    /**
     * @description Gets or sets whether APJS should emit collision callbacks for this collider.
     * Default: `false`.
     * When enabled, APJS collects every contact this collider had during the
     * most recent physics update — including contacts that begin and end
     * between two frames — and emits {@link CollisionEvent.Enter},
     * {@link CollisionEvent.Stay}, and {@link CollisionEvent.Exit} on the
     * following frame.
     * The event payload is `ev.args[0]` as an array of {@link CollisionInfo}.
     * Disabling it clears the cached collision state.
     */
    get emitCollisionEvent(): boolean;
    set emitCollisionEvent(value: boolean);
  }
  /**
   * @class Collider2D
   * @description Base class for 2D collision shapes.
   * Use a collider to define how a SceneObject participates in 2D collision
   * response and trigger detection, typically alongside a {@link RigidBody2D}.
   * Authored properties such as {@link offset}, {@link physicsMaterial}, and
   * {@link isTangible} are stored on the APJS side first, then pushed to the
   * native 2D collider as soon as one is created or updated.
   *
   * When {@link emitCollisionEvent} is enabled, the native 2D listener buffers
   * hit data and APJS emits {@link CollisionEvent2D.Enter},
   * {@link CollisionEvent2D.Stay}, and {@link CollisionEvent2D.Exit}
   * during update.
   *
   * @example
   * const collider = obj.getComponent("BoxCollider2D") as APJS.BoxCollider2D;
   * collider.isTangible = false; // behave like a trigger
   * collider.emitCollisionEvent = true;
   * APJS.EventManager.getObjectEmitter(collider).on(
   *   APJS.CollisionEvent2D.Enter, (ev) => {
   *     const infos = ev.args[0] as APJS.CollisionInfo2D[];
   *   }
   * );
   */
  class Collider2D extends DynamicComponent {
    protected constructor();
    /**
     * @description Gets or sets the collider shape offset authored in the
     * collider object's local 2D space, expressed in local 2D units.
     * Default: `(0, 0)`.
     * APJS later converts this authored offset into the attached rigid body's
     * local frame using the current 2D transform before recreating or updating
     * the native collider.
     * @type {Vector2f}
     */
    get offset(): Vector2f;
    set offset(value: Vector2f);
    /**
     * @description Gets or sets the physics material used by this collider.
     * Default: `null`, which leaves the collider using its current built-in 2D
     * coefficients (`friction=0.2`, `restitution=0.0` before any material override).
     * When a material is assigned, APJS forwards `staticFriction` and
     * `bounciness * 0.96` to the native collider. APJS does not clamp these values
     * at this layer.
     */
    get physicsMaterial(): PhysicsMaterial | null;
    set physicsMaterial(value: PhysicsMaterial | null);
    /**
     * @description Gets or sets whether this 2D collider is tangible.
     * Default: `true`.
     * When true, the collider participates in normal collision response.
     * When false, it behaves like a trigger: objects can pass through it,
     * but contacts can still be reported through {@link emitCollisionEvent}.
     * @type {boolean}
     */
    get isTangible(): boolean;
    set isTangible(value: boolean);
    /**
     * @description Gets or sets whether this collider should emit scripted 2D
     * collision callbacks.
     * Default: `false`.
     * When enabled, the native 2D listener buffers hit data and APJS emits
     * {@link CollisionEvent2D.Enter}, {@link CollisionEvent2D.Stay}, and
     * {@link CollisionEvent2D.Exit} during update.
     * The event payload is `ev.args[0]` as an array of {@link CollisionInfo2D}.
     * Disabling it clears the buffered events.
     * @type {boolean}
     */
    get emitCollisionEvent(): boolean;
    set emitCollisionEvent(value: boolean);
  }
  /**
   * @class CollisionEvent
   * @description 3D collision event types. Use with {@link EventManager.getObjectEmitter} on a {@link Collider}
   * to listen for collision callbacks. The event payload (`ev.args[0]`) is an array of {@link CollisionInfo}.
   *
   * **Requires** `collider.emitCollisionEvent = true` to be set first.
   *
   * @example
   * const collider = obj.getComponent("BoxCollider") as APJS.BoxCollider;
   * collider.emitCollisionEvent = true;
   * EventManager.getObjectEmitter(collider).on(CollisionEvent.Enter, (ev) => {
   *     const infos = ev.args[0] as CollisionInfo[];
   *     for (const info of infos) {
   *         console.log("Hit", info.otherObject?.name, "at", info.point);
   *     }
   * });
   */
  class CollisionEvent {
    constructor();
    /**
     * @readonly
     * @description Fired once when this collider is found colliding with another collider for the first time.
     * In 3D, APJS computes this by comparing the current contact set with the previous update.
     * @type {UserEventType}
     */
    static get Enter(): UserEventType;
    /**
     * @readonly
     * @description Fired on each update while this collider continues colliding with the same other collider.
     * @type {UserEventType}
     */
    static get Stay(): UserEventType;
    /**
     * @readonly
     * @description Fired once when a collider that was colliding on the previous update is no longer colliding.
     * @type {UserEventType}
     */
    static get Exit(): UserEventType;
  }
  /**
   * @class CollisionEvent2D
   * @description  2D collision event types. Use with {@link EventManager.getObjectEmitter} on a {@link Collider2D}
   * to listen for collision callbacks. The event payload (`ev.args[0]`) is an array of {@link CollisionInfo2D}.
   *
   * **Requires** `collider.emitCollisionEvent = true` to be set first.
   *
   * @example
   * const collider = obj.getComponent("Collider2D") as APJS.Collider2D;
   * collider.emitCollisionEvent = true;
   * APJS.EventManager.getObjectEmitter(collider).on(APJS.CollisionEvent2D.Enter, (ev) => {
   *     const infos = ev.args[0] as APJS.CollisionInfo2D[];
   *     for (const info of infos) {
   *         console.log("Hit", info.otherObject?.name, "at", info.point);
   *     }
   * });
   */
  class CollisionEvent2D {
    constructor();
    /**
     * @readonly
     * @description Fired once when the 2D physics engine reports that this collider has just started colliding.
     * @type {UserEventType}
     */
    static get Enter(): UserEventType;
    /**
     * @readonly
     * @description Fired on each physics step while the 2D physics engine reports that the collision is still active.
     * @type {UserEventType}
     */
    static get Stay(): UserEventType;
    /**
     * @readonly
     * @description Fired once when the 2D physics engine reports that a previous collision has ended.
     * @type {UserEventType}
     */
    static get Exit(): UserEventType;
  }
  /**
   * @class CollisionInfo
   * @description Information about a single 3D collision contact point.
   * Returned in the event payload of {@link CollisionEvent}.
   */
  class CollisionInfo {
    constructor(point: Vector3f, normal: Vector3f, otherObject: SceneObject | null);
    /**
     * @description World-space contact point.
     */
    readonly point: Vector3f;
    /**
     * @description World-space contact normal at the contact point.
     * APJS forwards the physics contact normal unchanged. It does not reverse
     * the normal for the other collider's listener, so do not assume it points
     * outward from the collider receiving this event.
     */
    readonly normal: Vector3f;
    /**
     * @description The SceneObject that owns the other collider in this collision pair.
     * This is null if APJS cannot resolve that collider back to a SceneObject.
     */
    readonly otherObject: SceneObject | null;
  }
  /**
   * @class CollisionInfo2D
   * @description  * Information about a single 2D collision contact point.
   * Returned in the event payload of {@link CollisionEvent2D}.
   */
  class CollisionInfo2D {
    constructor(point: Vector2f, normal: Vector2f, otherObject: SceneObject | null);
    /**
     * @description World-space contact point.
     */
    readonly point: Vector2f;
    /**
     * @description World-space contact normal at the contact point.
     * It is a unit-length vector (magnitude 1) describing the contact direction
     * between the two colliders. For the same contact, the value reported to one
     * collider and the value reported to the other point in opposite directions.
     */
    readonly normal: Vector2f;
    /**
     * @description The SceneObject that owns the other collider in this collision pair.
     * This is null if APJS cannot resolve that collider back to a SceneObject.
     */
    readonly otherObject: SceneObject | null;
  }
  /**
   * @class Color
   * @description A mutable RGBA color with channels inrange `[0, 1]`.
   * `1` is full intensity / opaque, `0` is none / fully transparent.
   * Values are not clamped; values outside `[0, 1]` are stored as-is.
   * @example
   * const white = new Color(1, 1, 1, 1);
   */
  class Color {
    /**
     * @description The red channel. Defaults to `0`. Normalized linear range
     * `[0, 1]`; not clamped — values outside this range are passed through.
     */
    r: number;
    /**
     * @description The green channel. Defaults to `0`. Normalized linear range
     * `[0, 1]`; not clamped — values outside this range are passed through.
     */
    g: number;
    /**
     * @description The blue channel. Defaults to `0`. Normalized linear range
     * `[0, 1]`; not clamped — values outside this range are passed through.
     */
    b: number;
    /**
     * @description The alpha (opacity) channel. Defaults to `0` (fully transparent).
     * Normalized linear range `[0, 1]`; not clamped — values outside this range
     * are passed through.
     */
    a: number;
    /**
     * @constructor
     * @param r - The red component of the color, or an existing Color object. Defaults to 0 if not provided.
     * @param g - The green component of the color. Defaults to 0 if not provided.
     * @param b - The blue component of the color. Defaults to 0 if not provided.
     * @param a - The alpha (opacity) component of the color. Defaults to 0 if not provided.
     */
    constructor(r?: number, g?: number, b?: number, a?: number);
    /**
     * @description Compares the current color with another color for equality.
     * Returns `true` only when `r`, `g`, `b`, and `a` are all exactly equal.
     * @param v - The color to compare against.
     * @returns A boolean indicating whether the two colors are equal.
     */
    equals(v: Color): boolean;
    /**
     * @description Converts the color to a string representation.
     * @returns A string representation of the color in the format "Color(R: r, G: g, B: b, A: a)" where r, g, b, and a are fixed to 5 decimal places.
     */
    toString(): string;
    /**
     * @description Creates and returns a copy of the current color instance.
     * @returns A new Color object with the same properties as the original.
     */
    clone(): Color;
    /**
     * @description Compares two colors for equality.
     * @param v0 - The first color to compare.
     * @param v1 - The second color to compare.
     * @returns True if the colors are equal, false otherwise.
     */
    static equals(v0: Color, v1: Color): boolean;
  }
  /**
   * @description Represents the color channels that can be masked in a graphics operation.
   * @enum
   */
  enum ColorMask {
    /** Red channel mask. */
    R,
    /** Green channel mask. */
    G,
    /** Blue channel mask. */
    B,
    /** Alpha channel mask. */
    A
  }
  /**
   * @class CommandBuffer
   * @extends AObject
   * @description Records graphics commands for later execution by `Scene.commitCommandBuffer`.
   * Commands execute in the order they were added and remain in the buffer after a commit. Call
   * {@link clearAll} before recording a different batch in a reused buffer.
   * A same-named property stored on a Material can mask a value set with `setGlobal*`; use a
   * {@link MaterialPropertyBlock} for values that belong to one draw.
   *
   * ### Core Features
   * - Records graphics commands for ordered execution
   * - Supports rendering operations like drawing meshes and clearing render targets
   * - Enables texture operations such as blitting and setting global textures
   * - Provides temporary render texture management
   * - Allows setting global shader properties
   * - Can be committed to the renderer for execution
   *
   * ### Matrix setup
   * The `matrix` passed to {@link drawMesh} is the mesh's model-to-world matrix; it does not combine
   * camera matrices into a shader's `u_MVP`. Bind exactly the uniforms declared by the vertex shader.
   * For a shader that declares `u_MVP`, setting only `u_View` and `u_Projection` is insufficient:
   * explicitly set `u_MVP` to projection-view-model order. A screen-visible 3D draw therefore needs
   * a Camera reference; the model-to-world `matrix` alone commonly clips or misplaces the mesh. Use
   * a {@link MaterialPropertyBlock} for `u_MVP` when the Material stores the same property name,
   * because Material properties mask `setGlobal*` values. A block changes only its named uniforms,
   * so a block containing `u_MVP` does not replace an unrelated `setGlobalColor` or other global.
   * For every perspective 3D draw whose shader declares `u_MVP`, add `u_MVP` to the block passed to
   * {@link drawMesh}; if that block already carries a data uniform, add `u_MVP` to the same block.
   * Clone the projection matrix because {@link Matrix4x4f.multiply} modifies its receiver. A recorded draw retains its
   * MaterialPropertyBlock, so update that block before each commit when only uniform values change.
   * Rebuild the command sequence when command
   * arguments such as the mesh, material, or render target change. Identity matrices are appropriate
   * only when the shader already outputs clip-space positions, such as for a full-screen quad.
   *
   * @example <caption>Draw a 3D mesh into a render texture</caption>
   * const world = transform.getWorldMatrix();
   * const view = camera.getWorldToCameraMatrix();
   * const projection = camera.projectionMatrix;
   * const mvp = projection.clone().multiply(view).multiply(world);
   * const properties = new APJS.MaterialPropertyBlock();
   * // This shader declares both `uniform mat4 u_MVP` and `uniform mat4 u_MatrixValue`.
   * // A data uniform such as `u_MatrixValue` is independent from the vertex transform in `u_MVP`.
   * properties.setMatrix('u_MVP', mvp);
   *
   * const commandBuffer = new APJS.CommandBuffer();
   * commandBuffer.setRenderTexture(renderTexture);
   * commandBuffer.clearRenderTexture(
   *   true,
   *   true,
   *   new APJS.Color(0, 0, 0, 0),
   *   1
   * );
   * commandBuffer.setGlobalMatrix('u_MatrixValue', matrixValue);
   * commandBuffer.drawMesh(mesh, world, material, 0, 0, properties);
   * this.getSceneObject().scene.commitCommandBuffer(commandBuffer);
   *
   * @example <caption>Texture Operations: Blitting</caption>
   * const commandBuffer = new APJS.CommandBuffer();
   * commandBuffer.blit(sourceTexture, destinationRenderTexture);
   * this.getSceneObject().scene.commitCommandBuffer(commandBuffer);
   *
   * @example <caption>Use a temporary render texture</caption>
   * const commandBuffer = new APJS.CommandBuffer();
   * const temporary = commandBuffer.propertyToID('temporary');
   * const descriptor = new APJS.RenderTextureCreateDesc();
   * descriptor.width = 1024;
   * descriptor.height = 1024;
   * commandBuffer.getTemporaryRT(temporary, descriptor, false);
   * commandBuffer.blit(source, temporary);
   * commandBuffer.blit(temporary, output);
   * commandBuffer.releaseTemporaryRT(temporary);
   * this.getSceneObject().scene.commitCommandBuffer(commandBuffer);
   *
   * @see Material
   * @see Mesh
   * @see Texture
   * @see RenderTextureCreateDesc
   */
  class CommandBuffer extends AObject {
    /**
     * @constructor
     * @param rtti - An optional native command buffer object. If not provided, a new one will be created.
     */
    constructor();
    /**
     * @description Adds a command to copy a texture to another. The source is sampled and the
     * destination must be a writable render texture (or a temporary render texture ID). The copy
     * runs when the buffer is committed.
     *
     * @param src - The source texture or temporary render texture ID.
     * @param dest - The destination render texture or temporary render texture ID.
     * `dest` must be a `RenderTexture`; any other texture type logs an error and the command is skipped.
     */
    blit(src: Texture | number, dest: Texture | number): void;
    /**
     * @description Adds a command to copy a texture to another using a material. The copy runs
     * when the buffer is committed.
     *
     * @param src - The source texture or temporary render texture ID.
     * @param dest - The destination render texture or temporary render texture ID.
     * `dest` must be a `RenderTexture`; any other texture type logs an error and the command is skipped.
     * @param material - The material to use for the blit operation.
     * @param shaderPass - The shader pass index to use; pass `-1` to apply all passes.
     * @param isCache - Whether to enable the native command cache for this blit.
     * @param properties - An optional block of material properties applied just before the blit.
     */
    blitWithMaterial(src: Texture | number, dest: Texture | number, material: Material, shaderPass: number, isCache: boolean, properties?: MaterialPropertyBlock): void;
    /**
     * @description Removes every recorded command from the buffer. Call this before rebuilding a
     * command sequence; it is not required before the first use of a new buffer.
     */
    clearAll(): void;
    /**
     * @description Adds a command to clear the active render target. Requires a render target to
     * have been set first via {@link setRenderTexture}.
     *
     * @param clearColor - Whether to clear the color buffer.
     * @param clearDepth - Whether to clear the depth buffer.
     * @param backgroundColor - The color to clear with.
     * @param depth - The depth value to clear with, in the normalized `[0, 1]` range.
     */
    clearRenderTexture(clearColor: boolean, clearDepth: boolean, backgroundColor: Color, depth: number): void;
    /**
     * @description Adds a command to draw a mesh. The draw runs when the buffer is committed.
     * The `matrix` supplies the model-to-world transform. It does not replace camera uniforms
     * declared by a custom shader. For a perspective 3D shader that declares `u_MVP`, always pass
     * a `properties` block containing `u_MVP = projection * view * matrix`; omitting it commonly
     * clips the mesh into a rectangle or makes it invisible. Keep unrelated `setGlobal*` values on
     * the command buffer.
     *
     * @param mesh - The mesh to draw.
     * @param matrix - The model-to-world transformation matrix.
     * @param material - The material to use.
     * @param submeshIndex - The index of the submesh to render, in `[0, submeshCount - 1]`.
     * @param shaderPass - The shader pass index to use. Use `-1` to render all passes.
     * @param properties - Optional material properties applied just before this draw call.
     * @param isCache - Whether to enable the native command cache for this draw (default `false`).
     */
    drawMesh(mesh: Mesh, matrix: Matrix4x4f, material: Material, submeshIndex: number, shaderPass: number, properties?: MaterialPropertyBlock | undefined, isCache?: boolean): void;
    /**
     * @description Adds a command to set a global shader color property.
     * Applies to subsequent draw commands in this buffer until overwritten. Use a
     * {@link MaterialPropertyBlock} when the value should apply to only one draw.
     *
     * @param name - The shader property name to bind, matching a uniform declared in the shader.
     * @param color - The color value to set.
     */
    setGlobalColor(name: string, color: Color): void;
    /**
     * @description Adds a command to set a global shader float property.
     * Applies to subsequent draw commands in this buffer until overwritten. Use a
     * {@link MaterialPropertyBlock} when the value should apply to only one draw.
     *
     * @param name - The shader property name to bind, matching a uniform declared in the shader.
     * @param value - The float value to set.
     */
    setGlobalFloat(name: string, value: number): void;
    /**
     * @description Adds a command to set a global shader vector property.
     * Applies to subsequent draw commands in this buffer until overwritten. Use a
     * {@link MaterialPropertyBlock} when the value should apply to only one draw.
     *
     * @param name - The shader property name to bind, matching a uniform declared in the shader.
     * @param value - The vector value to set.
     */
    setGlobalVector(name: string, value: Vector4f): void;
    /**
     * @description Adds a command to set a global shader matrix property.
     * Applies to subsequent draw commands in this buffer until overwritten. For a 3D draw, the
     * common camera matrices are `u_View`, `u_Projection`, and
     * `u_MVP = projection * view * model`; use the names declared by the shader.
     * Setting another matrix uniform, such as `u_MatrixValue`, does not provide the vertex transform:
     * if the vertex shader declares `u_MVP`, bind `u_MVP` separately for the same draw.
     *
     * @param name - The shader property name to bind, matching a uniform declared in the shader.
     * @param value - The matrix value to set.
     */
    setGlobalMatrix(name: string, value: Matrix4x4f): void;
    /**
     * @description Adds a command to set a global shader texture property.
     * Applies to subsequent draw commands in this buffer until overwritten. Use a
     * {@link MaterialPropertyBlock} when the texture should apply to only one draw.
     * Passing `null` is a no-op.
     *
     * @param name - The shader property name to bind, matching a sampler declared in the shader.
     * @param texture - The texture to set, or a temporary render texture ID obtained from {@link propertyToID}.
     */
    setGlobalTexture(name: string, texture: number | Texture): void;
    /**
     * @description Adds a command to set the active render target. Subsequent draw and clear
     * commands in this buffer target it once it executes. A falsy `target` is a no-op.
     * The texture must be a `RenderTexture`; any other texture type logs an error and leaves the
     * active render target unchanged.
     *
     * @param target - The render target texture, or a temporary render texture ID obtained from {@link propertyToID}.
     */
    setRenderTexture(target: Texture | number): void;
  }
  /**
   * @class Component
   * @description
   * Base class for everything attached to a SceneObject.
   * <br/>Note that your code will never directly create a Component. Instead, you write script code, and attach the script to a SceneObject.
   * <br/>Note that SceneObject.addComponent() can return null if the component type is invalid or cannot be added.
   * <br/>Typical usage is: obtain a component from `SceneObject.addComponent()` or `getComponent()`,
   * inspect or toggle {@link enabled}, query the effective state with {@link isInheritedEnabled},
   * and use {@link getSceneObject} to reach the owning object.
   * @example
   * ```typescript
   * const sceneObject = scene.findSceneObject("Cube");
   * if (sceneObject) {
   *   const renderCom = sceneObject.addComponent("MeshRenderer");
   *   if (renderCom) {
   *     renderCom.enabled = true;
   *   }
   * }
   * ```
   */
  class Component extends AObject {
    protected constructor();
    /**
     * @description Gets whether the component is enabled. True if the component is enabled, false otherwise.
     */
    get enabled(): boolean;
    /**
     * @description Sets whether the component is enabled. True to enable the component, false to disable it.
     */
    set enabled(value: boolean);
    /**
     * @description Checks the component's effective enabled state.
     * The inherited part comes from the attached {@link SceneObject}'s visibility in the hierarchy.
     * Unlike {@link enabled}, which only reflects the component's own flag, this returns `true`
     * only when the component is enabled and its attached scene object is visible.
     * If the component is not attached to a scene object, this behaves the same as {@link enabled}.
     * @returns `true` if the component is effectively enabled, `false` otherwise.
     */
    isInheritedEnabled(): boolean;
    /**
     * @description Gets the scene object this component is attached to.
     * @returns The scene object this component is attached to.
     * if the component is not attached to a scene object, this returns `null`.
     */
    getSceneObject(): SceneObject;
  }
  /**
   * @class ConstantForce2D
   * @description Returned by {@link RigidBody2D.addForceAt} when using continuous force modes
   * ({@link ForceMode2D.Force} or {@link ForceMode2D.Acceleration}).
   * Holds the computed world-space force and torque generated by the force application.
   * These values can be reused with {@link RigidBody2D.addForce} and {@link RigidBody2D.addTorque}
   * to apply additional or opposite continuous forces.
   *
   * Applying the negated force/torque (multiplied by -1) does not undo existing motion.
   * It only cancels the continuous force contribution, so the object may continue moving
   * with its current linear or angular velocity.
   *
   * Applying the negated force/torque again (equivalent to multiplying by -2 relative
   * to the original force) produces a continuous force in the opposite direction.
   *
   * Not returned for instantaneous modes ({@link ForceMode2D.Impulse}, {@link ForceMode2D.VelocityChange}).
   */
  class ConstantForce2D {
    /** World-space force in Newtons, as a `Vector2f` where `x`/`y` are the force components along the world X/Y axes. */
    readonly worldForce: Vector2f;
    /** World-space torque in Newton-meters. */
    readonly worldTorque: number;
    constructor(worldForce: Vector2f, worldTorque: number);
  }
  /**
   * @class ConstantForce3D
   * @description Returned by {@link RigidBody.addForceAt} when using continuous force modes
   * ({@link ForceMode3D.Force} or {@link ForceMode3D.Acceleration}).
   * Holds the computed world-space force and torque generated by the force application.
   * These values can be reused with {@link RigidBody.addForce} and {@link RigidBody.addTorque}
   * to apply additional or opposite continuous forces.
   *
   * Applying the negated force/torque (multiplied by -1) does not undo existing motion.
   * It only cancels the continuous force contribution, so the object may continue moving
   * with its current linear or angular velocity.
   *
   * Applying the negated force/torque again (equivalent to multiplying by -2 relative
   * to the original force) produces a continuous force in the opposite direction.
   *
   * Not returned for instantaneous modes ({@link ForceMode3D.Impulse}, {@link ForceMode3D.VelocityChange}).
   */
  class ConstantForce3D {
    /**
     * @description World-space force in Newtons.
     */
    readonly worldForce: Vector3f;
    /**
     * @description World-space torque in Newton-meters.
     */
    readonly worldTorque: Vector3f;
    constructor(worldForce: Vector3f, torque: Vector3f);
  }
  /**
   * @description Defines the culling mode for rendering.
   * @enum
   */
  enum CullMode {
    /** No faces are culled. */
    None,
    /** Front-facing faces are culled. */
    Front,
    /** Back-facing faces are culled. */
    Back,
    /** Both front and back-facing faces are culled. */
    FrontAndBack
  }
  /**
   * @description Defines the depth comparison function used for depth testing.
   * @enum
   */
  enum DepthFunction {
    /** Depth test never passes. */
    Never,
    /** Depth test passes if the incoming depth value is less than the stored depth value. */
    Less,
    /** Depth test passes if the incoming depth value is equal to the stored depth value. */
    Equal,
    /** Depth test passes if the incoming depth value is less than or equal to the stored depth value. */
    LessOrEqual,
    /** Depth test passes if the incoming depth value is greater than the stored depth value. */
    Greater,
    /** Depth test passes if the incoming depth value is not equal to the stored depth value. */
    NotEqual,
    /** Depth test passes if the incoming depth value is greater than or equal to the stored depth value. */
    GreaterOrEqual,
    /** Depth test always passes. */
    Always
  }
  /**
   * @namespace DeviceInfo
   * @description Static utility namespace for querying information about the current device and camera input.
   * Use it to read environment values such as the operating system, camera facing type, and current camera input resolution.
   * This type is not meant to be instantiated.
   */
  namespace DeviceInfo {
    /**
     * @description Gets the operating system of the current device.
     * @returns The operating system type of the device.
     */
    function getOS(): OS;
    /**
     * @description Gets the camera facing type of the device.
     * Returns the numeric camera-facing identifier reported by the platform.
     * `0` means the front camera and `1` means the rear camera.
     * @returns The camera facing type identifier.
     */
    function getCameraFacingType(): number;
    /**
     * @memberof DeviceInfo
     * @description Gets the resolution of the current device camera input texture.
     * The returned vector uses pixel units: `x` is the input texture width and `y` is the input texture height.
     */
    function getDeviceCameraResolution(): Vector2f;
  }
  /**
   * @class DirectionalLight
   * @description Represents a directional light source in the scene.
   * This light exposes a group of shadow settings that work together: shadow
   * rendering starts only when {@link castShadow} is enabled; soft shadow tuning
   * is only meaningful when {@link softShadow} is enabled; and manual frustum
   * controls such as {@link shadowFrustumArea}, {@link shadowFrustumNear}, and
   * {@link shadowFrustumFar} are only used when {@link shadowAutoFrustum} is `false`.
   */
  class DirectionalLight extends Light {
    protected constructor();
    /**
     * @description Gets whether this light casts shadows.
     * Default: `false`.
     * When disabled, the engine hides or ignores the other shadow tuning fields.
     */
    get castShadow(): boolean;
    /**
     * @description Sets whether this light casts shadows.
     * When disabled, the engine hides or ignores the other shadow tuning fields.
     */
    set castShadow(value: boolean);
    /**
     * @description Gets the resolution of the shadow map texture in pixels.
     * `x` is the width and `y` is the height of the shadow map texture.
     * Default: `(256, 256)`. Engine-side power-of-two values are recommended; values are passed through to the native layer without clamping.
     */
    get shadowResolution(): Vector2f;
    /**
     * @description Sets the resolution of the shadow map texture in pixels.
     * `x` is the width and `y` is the height of the shadow map texture.
     */
    set shadowResolution(value: Vector2f);
    /**
     * @description Gets the shadow bias to prevent shadow acne (self-shadowing artifacts).
     * Default: `0`.
     * Recommended range: `[0, 1]`.
     */
    get shadowBias(): number;
    /**
     * @description Sets the shadow bias to prevent shadow acne (self-shadowing artifacts).
     * Recommended range: `[0, 1]`.
     */
    set shadowBias(value: number);
    /**
     * @description Gets the strength of the shadows.
     * Conventionally a normalized factor in `[0, 1]` where `0` makes shadows invisible and `1` applies full-strength shadows; the value is multiplied into shader output without clamping.
     * Runtime default: `1`.
     */
    get shadowStrength(): number;
    /**
     * @description Sets the strength of the shadows.
     * Conventionally a normalized factor in `[0, 1]` where `0` makes shadows invisible and `1` applies full-strength shadows; the value is multiplied into shader output without clamping.
     */
    set shadowStrength(value: number);
    /**
     * @description Gets whether to use soft shadows.
     * Default: `false`.
     */
    get softShadow(): boolean;
    /**
     * @description Sets whether to use soft shadows.
     */
    set softShadow(value: boolean);
    /**
     * @description Gets the softness of the shadows when soft shadows are enabled.
     * This value only affects rendering when {@link softShadow} is `true`.
     */
    get shadowSoftness(): number;
    /**
     * @description Sets the softness of the shadows when soft shadows are enabled.
     * This API does not clamp or validate the stored value.
     * Range: [0, 5], default: 1
     * This value only affects rendering when {@link softShadow} is `true`.
     */
    set shadowSoftness(value: number);
    /**
     * @description Gets the color of the shadows cast by this light.
     * Default: black `(0, 0, 0, 1)`.
     * APJS exposes this as a `Color`, but only the RGB channels are forwarded to
     * the native light; alpha is not stored in the native shadow color field.
     * Each RGB channel uses the normalized `[0, 1]` range and is not clamped.
     */
    get shadowColor(): Color;
    /**
     * @description Sets the color of the shadows cast by this light.
     * Only `r`, `g`, and `b` are forwarded to the native light; the alpha channel
     * is ignored by this wrapper.
     */
    set shadowColor(value: Color);
    /**
     * @description Gets the width and height of the square shadow area, using the same unit scale as the scene's world coordinates.
     * Default: `100`.
     * Together with `shadowFrustumNear` and `shadowFrustumFar`, this defines the manual shadow frustum.
     * Only takes effect when `shadowAutoFrustum` is `false`; when auto-frustum is enabled, the engine recomputes the size from the scene caster/receiver bounds and ignores this field.
     */
    get shadowFrustumArea(): number;
    /**
     * @description Sets the width and height of the square shadow area, using the same unit scale as the scene's world coordinates.
     * Together with `shadowFrustumNear` and `shadowFrustumFar`, this defines the manual shadow frustum.
     * Only takes effect when `shadowAutoFrustum` is `false`.
     */
    set shadowFrustumArea(value: number);
    /**
     * @description Gets whether the shadow frustum should be calculated automatically.
     * Default: `true`.
     * When enabled, the engine recomputes shadow frustum bounds from scene data and
     * ignores manual frustum controls such as {@link shadowFrustumArea},
     * {@link shadowFrustumNear}, and {@link shadowFrustumFar}.
     */
    get shadowAutoFrustum(): boolean;
    /**
     * @description Sets whether the shadow frustum should be calculated automatically.
     * When enabled, the engine recomputes shadow frustum bounds from scene data and
     * ignores manual frustum controls such as {@link shadowFrustumArea},
     * {@link shadowFrustumNear}, and {@link shadowFrustumFar}.
     */
    set shadowAutoFrustum(value: boolean);
    /**
     * @description Gets the near plane of the shadow frustum, using the same unit scale as the scene's world coordinates.
     * Default: `1`. This value must be less than `shadowFrustumFar`.
     * This API does not clamp or validate the stored value.
     * Only takes effect when `shadowAutoFrustum` is `false`; otherwise the engine recomputes near/far from the scene bounds and ignores this field.
     */
    get shadowFrustumNear(): number;
    /**
     * @description Sets the near plane of the shadow frustum, using the same unit scale as the scene's world coordinates.
     * This value must be less than `shadowFrustumFar`. This API does not clamp or validate the assigned value.
     * Only takes effect when `shadowAutoFrustum` is `false`.
     */
    set shadowFrustumNear(value: number);
    /**
     * @description Gets the far plane of the shadow frustum, using the same unit scale as the scene's world coordinates.
     * Default: `100`. This value must be greater than `shadowFrustumNear`.
     * This API does not clamp or validate the stored value.
     * Only takes effect when `shadowAutoFrustum` is `false`; otherwise the engine recomputes near/far from the scene bounds and ignores this field.
     */
    get shadowFrustumFar(): number;
    /**
     * @description Sets the far plane of the shadow frustum, using the same unit scale as the scene's world coordinates.
     * This value must be greater than `shadowFrustumNear`. This API does not clamp or validate the assigned value.
     * Only takes effect when `shadowAutoFrustum` is `false`.
     */
    set shadowFrustumFar(value: number);
  }
  /**
   * @class DistanceJoint2D
   * @description A 2D distance joint. Maintains a fixed distance between two anchor points on connected bodies.
   * Uses a spring constraint internally, where the connected anchors act like spring endpoints.
   * @example
   * // Set a distance joint between two objects (configured in editor via connectedBody reference)
   * const distanceJoint = obj.getComponent("DistanceJoint2D") as APJS.DistanceJoint2D;
   * distanceJoint.breakable = false; // Disable the joint from breaking
   */
  class DistanceJoint2D extends Joint2D {
    protected constructor();
  }
  /**
   * @class DynamicBitset
   * @description A set of bits that can be dynamically resized.
   * `new DynamicBitset()` creates a bitset with `64` bits, all initialized to `0`.
   * @example
   * ```ts
   * const bitset = new APJS.DynamicBitset();
   * bitset.set(3);
   * bitset.set(5, 0);
   *
   * const enabled = bitset.test(3);
   * const text = bitset.toString();
   * ```
   */
  class DynamicBitset {
    /**
     * @constructor
     * @description Constructs a new DynamicBitset with `64` bits, all initialized to `0`.
     */
    constructor();
    /**
     * @constructor
     * @description Constructs a new DynamicBitset with a specified number of bits.
     * @param num_bits - The initial number of bits.
     * @param value - The initial fill value passed to the native bitset constructor.
     */
    constructor(num_bits: number, value: number);
    /**
     * @description Compares this DynamicBitset with another for equality.
     * @param v - The DynamicBitset to compare with.
     * @returns `true` if the two bitsets are equal, `false` otherwise.
     */
    equals(v: DynamicBitset): boolean;
    /**
     * @description Returns a debug string for the current bitset state.
     * The native output format is:
     * `numbits:<numBits>; numblock:<numBlocks>; hexadecimal:0x<blockN> <blockN-1> ...`
     * Each storage block is appended in uppercase hexadecimal from the highest block index to the lowest.
     * @example
     * ```ts
     * const bitset = new APJS.DynamicBitset(64, 0b1010111);
     * const text = bitset.toString();
     * // "numbits:64; numblock:2; hexadecimal:0x0 57 "
     * ```
     * @returns A native-formatted debug string describing the current bitset contents.
     */
    toString(): string;
    /**
     * @description Tests whether the bit at zero-based index `v` is set to `1`.
     * Use indices in the range `[0, numBits - 1]`.
     * Current engine tests show that `test(numBits)` returns `false`.
     * @param v - The zero-based bit index to test.
     * @returns `true` if the bit at index `v` is set, `false` otherwise.
     */
    test(v: number): boolean;
    /**
     * @description Checks if any bit is set to 1.
     * @returns `true` if at least one bit is set, `false` otherwise.
     */
    any(): boolean;
    /**
     * @description Checks if no bits are set to 1.
     * @returns `true` if no bits are set, `false` otherwise.
     */
    none(): boolean;
    /**
     * @description Resets the bit at zero-based index `v` to `0`.
     * Current engine tests show that calling `reset()` with an index outside the bitset range leaves the bitset unchanged.
     * @param v - The zero-based bit index to clear.
     * @returns The modified DynamicBitset instance.
     */
    reset(v: number): DynamicBitset;
    /**
     * @description Sets bits in the bitset.
     * `set()` sets all bits to `1`, `set(index)` sets one bit to `1`, and `set(index, value)` sets one bit to the specified value.
     * Current script tests use `value` as `0` or `1`.
     * @param v - The zero-based bit index to set.
     * @param v1 - The value written to the bit at `v`.
     */
    set(v?: number, v1?: number): void;
    /**
     * @description Compares two DynamicBitset instances for equality.
     * @param a - The first bitset to compare.
     * @param b - The second bitset to compare.
     * @returns `true` if the two bitsets are equal, `false` otherwise.
     */
    static equals(v0: DynamicBitset, v1: DynamicBitset): boolean;
  }
  /**
   * @class DynamicChain
   * @description A dynamic chain component for simulating secondary motion on a transform hierarchy.
   * Most user-facing controls, including `damping`, `elasticity`, `stiffness`, `inertia`, and `physicsAnimationRate`, are typically set in the range [0, 1].
   * `force` works together with `isLocalForce`, `isRelative`, and `relativeTarget` to determine which coordinate space the force uses.
   * `physicsAnimationRate` takes effect only when `physicsAnimation` is enabled.
   */
  class DynamicChain extends DynamicComponent {
    protected constructor();
    /**
     * @description Gets the user-facing damping control for the dynamic chain.
     * This property controls how strongly the chain resists oscillation or vibration.
     * Range: [0, 1], larger values make the chain more stable by damping motion more effectively, while smaller values make it more fluid and less stable.
     * The default value is 0.2.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong damping.
     * @returns The damping value of the dynamic chain.
     */
    get damping(): number;
    /**
     * @description Sets the user-facing damping control for the dynamic chain.
     * This property controls how strongly the chain resists oscillation or vibration.
     * Range: [0, 1], larger values make the chain more stable by damping motion more effectively, while smaller values make it more fluid and less stable.
     * The default value is 0.2.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong damping.
     * @param value - The damping value of the dynamic chain.
     */
    set damping(value: number);
    /**
     * @description Gets the user-facing elasticity control for the dynamic chain.
     * This property controls the spring-like behavior of the chain.
     * Range: [0, 1], larger values make the chain bouncier and more elastic, while smaller values make it more rigid.
     * The default value is 0.1.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong elasticity.
     */
    get elasticity(): number;
    /**
     * @description Sets the user-facing elasticity control for the dynamic chain.
     * This property controls the spring-like behavior of the chain.
     * Range: [0, 1], larger values make the chain bouncier and more elastic, while smaller values make it more rigid.
     * The default value is 0.1.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong elasticity.
     * @param value - The elasticity value of the dynamic chain.
     */
    set elasticity(value: number);
    /**
     * @description Gets the user-facing stiffness control for the dynamic chain.
     * This property controls the strength of the chain's spring-like behavior.
     * Range: [0, 1], larger values make the chain more rigid and reduce oscillation under the same force, while smaller values make it more fluid and easier to oscillate.
     * The default value is 0.2.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong stiffness.
     */
    get stiffness(): number;
    /**
     * @description Sets the user-facing stiffness control for the dynamic chain.
     * This property controls the strength of the chain's spring-like behavior.
     * Range: [0, 1], larger values make the chain more rigid and reduce oscillation under the same force, while smaller values make it more fluid and easier to oscillate.
     * The default value is 0.2.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong stiffness.
     * @param value - The stiffness value of the dynamic chain.
     */
    set stiffness(value: number);
    /**
     * @description Gets the user-facing inertia control for the dynamic chain.
     * This property controls how strongly the chain resists changes in motion.
     * Range: [0, 1], larger values make the chain more stable and slower to start or stop moving under the same force, while smaller values make it more responsive and fluid.
     * The default value is 0.5.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong inertia.
     */
    get inertia(): number;
    /**
     * @description Sets the user-facing inertia control for the dynamic chain.
     * This property controls how strongly the chain resists changes in motion.
     * Range: [0, 1], larger values make the chain more stable and slower to start or stop moving under the same force, while smaller values make it more responsive and fluid.
     * The default value is 0.5.
     * Values outside the recommended range are not clamped and are applied directly, which can produce unexpectedly weak or strong inertia.
     * @param value - The inertia value of the dynamic chain.
     */
    set inertia(value: number);
    /**
     * @description Gets the consistent external force applied to the dynamic chain.
     */
    get force(): Vector3f;
    /**
     * @description Sets the user-facing continuous external force applied to the dynamic chain.
     * This property simulates pushes or pulls such as gravity-like effects, collisions, or user input.
     * The value must be a `Vector3f(x, y, z)`.
     * The default value is `Vector3f(0, 0, 0)`.
     * Coordinate system: world space by default, local space when `isLocalForce` is `true`, and relative to `relativeTarget` when `isRelative` is `true`.
     * @param value - The continuous external force applied to the dynamic chain.
     */
    set force(value: Vector3f);
    /**
     * @description Gets whether the force applied to the dynamic chain uses local space or world space.
     * When `true`, the force is applied in the chain's local space, relative to its orientation and position.
     * When `false`, the force is applied in world space.
     */
    get isLocalForce(): boolean;
    /**
     * @description Sets whether the force applied to the dynamic chain uses local space or world space.
     * When `true`, the force is applied in the chain's local space, relative to its orientation and position.
     * When `false`, the force is applied in world space.
     * @param value - Whether the force is applied in the chain's local space.
     */
    set isLocalForce(value: boolean);
    /**
     * @description Gets whether the chain uses relative or absolute positioning.
     * When `true`, the chain is positioned relative to another object or chain link in the scene.
     * When `false`, the chain uses an absolute position and orientation in world space.
     * If `true` but {@link relativeTarget} is `null`, the chain falls back to world space and
     * behaves the same as the `false` case until a `relativeTarget` is assigned.
     */
    get isRelative(): boolean;
    /**
     * @description Sets whether the chain uses relative or absolute positioning.
     * When `true`, the chain is positioned relative to another object or chain link in the scene.
     * When `false`, the chain uses an absolute position and orientation in world space.
     * If `true` but {@link relativeTarget} is `null`, the chain falls back to world space and
     * behaves the same as the `false` case until a `relativeTarget` is assigned.
     * @param value - Whether the chain uses relative positioning.
     */
    set isRelative(value: boolean);
    /**
     * @description Gets whether overlay of physical and animation effects is enabled for the dynamic chain.
     * When this component and an `Animation` component are attached to the same entity, animation does not take effect unless this option is enabled.
     * When enabled, animation and physical simulation are blended together.
     */
    get physicsAnimation(): boolean;
    /**
     * @description Sets whether overlay of physical and animation effects is enabled for the dynamic chain.
     * When this component and an `Animation` component are attached to the same entity, animation does not take effect unless this option is enabled.
     * When enabled, animation and physical simulation are blended together.
     * @param value - Whether overlay of physical and animation effects is enabled for the dynamic chain.
     */
    set physicsAnimation(value: boolean);
    /**
     * @description Gets the blend amount between physical and animation effects for the dynamic chain. Only valid when `physicsAnimation` is enabled.
     * Range: [0, 1]. The larger the value, the more physical simulation is blended with animation-driven motion.
     * The default value is 0.0.
     * This value takes effect only when `physicsAnimation` is enabled.
     */
    get physicsAnimationRate(): number;
    /**
     * @description Sets the blend amount between physical and animation effects for the dynamic chain. Only valid when `physicsAnimation` is enabled.
     * Range: [0, 1]. The larger the value, the more physical simulation is blended with animation-driven motion.
     * The default value is 0.0.
     * This value takes effect only when `physicsAnimation` is enabled.
     * @param value - The animation physics blending value for the dynamic chain.
     */
    set physicsAnimationRate(value: number);
  }
  /**
   * @class DynamicComponent
   */
  class DynamicComponent extends Component {
    protected constructor();
  }
  /**
   * @class EdgeCollider2D
   * @description An open 2D edge collider made from connected line segments.
   * Use this for boundaries such as ledges, slopes, or outlines that should
   * not behave like a filled polygon.
   * Inherited properties such as {@link offset}, {@link isTangible}, and
   * {@link emitCollisionEvent} still apply.
   * The shape comes from {@link points}, authored in the collider's local 2D
   * space; at least two points are required to form a valid edge. Assigning
   * {@link points} after the collider exists rebuilds it. If fewer than two
   * points are provided, no valid edge is produced.
   *
   * @example
   * const edge = obj.getComponent("EdgeCollider2D") as APJS.EdgeCollider2D;
   * edge.points = [
   *   new APJS.Vector2f(-10, 0),
   *   new APJS.Vector2f(0, -10),
   *   new APJS.Vector2f(10, 0),
   * ]; // change the points of the edge collider to a fold line that folds downwards.
   */
  class EdgeCollider2D extends Collider2D {
    protected constructor();
    /**
     * @description Gets or sets the points that define this edge collider.
     * The points are connected in order to form an open chain of line
     * segments. At least two points are required to create a valid edge.
     * The points are defined in local space of the collider.
     * @type {Vector2f[]}
     */
    get points(): Vector2f[];
    set points(value: Vector2f[]);
  }
  /**
   * @class EnvironmentLight
   * @description Represents an environment light component.
   * Typical setup is: choose the affected {@link renderLayer}, assign a cubemap
   * through {@link environmentMap}, then tune {@link intensity},
   * {@link rotation}, and {@link color} for the final lighting look.
   */
  class EnvironmentLight extends Component {
    protected constructor();
    /**
     * @description Gets the render layer of the environment light.
     * The returned {@link LayerSet} is the layer mask currently stored on the
     * native environment-light component. It is 64-bit wide, with zero-based
     * layer indices in `[0, 63]`. Modifying the returned set in place is not
     * guaranteed to write back; assign a {@link LayerSet} to this property to
     * apply changes. The default set of affected layers is configured in the editor.
     */
    get renderLayer(): LayerSet;
    /**
     * @description Sets the render layer of the environment light.
     * This replaces the native environment-light layer mask with the provided
     * {@link LayerSet}.
     */
    set renderLayer(value: LayerSet);
    /**
     * @description Sets the environment map used for specular reflections.
     * Only cubemap textures are accepted by this API.
     * Passing `null` clears the current cubemap. Passing a non-cubemap texture leaves the current value unchanged.
     */
    set environmentMap(value: Texture);
    /**
     * @description Gets the environment map used for specular reflections.
     * The returned texture is the current cubemap texture stored on the native environment light.
     */
    get environmentMap(): Texture;
    /**
     * @description Sets the intensity of the environment light.
     * The default value is `1.0`.
     * This value controls the strength of environment-map lighting.
     * The recommended range is [`0.0`, `7`]. Values are not clamped, and negative values may produce unexpected shading.
     */
    set intensity(value: number);
    /**
     * @description Gets the intensity value currently stored on the native environment light.
     * The default value is `1.0`.
     * This value controls the strength of environment-map lighting.
     * The recommended range is [`0.0`, `7`]. Values are not clamped, and negative values may produce unexpected shading.
     */
    get intensity(): number;
    /**
     * @description Sets the rotation of the environment light, the unit is round(e.g. when the value is 0.5, the environment light has rotated 180 degrees).
     * Recommended range: `[0, 1]`.
     */
    set rotation(value: number);
    /**
     * @description Gets the environment-light rotation in degrees.
     * This is the current value stored on the native component.
     */
    get rotation(): number;
    /**
     * @description The tint color of the environment light.
     * APJS forwards the provided {@link Color} to the native tint color field, where
     * all four RGBA channels are applied as a multiplier on the environment lighting.
     * Each channel uses the normalized linear range `[0, 1]` and is not clamped.
     */
    set color(color: Color);
    /**
     * @description The tint color of the environment light.
     * This is the current tint {@link Color} stored on the native environment light.
     * Each channel uses the normalized linear range `[0, 1]`.
     */
    get color(): Color;
  }
  /**
   * @namespace
   * EventManager
   */
  /**
   * @namespace EventManager
   * @description Static entry point for APJS events.
   * Use it to define custom event types, create event objects, and retrieve
   * emitters for the global scope, a specific object, or gesture input.
   */
  namespace EventManager {
    /**
     * @description Defines a user-defined event type.
     * This method allows you to create and register a custom event type with a unique identifier,
     * which can be used to trigger and handle events in your application.
     * Passing the same `eventName` again returns the same event type value.
     *
     * @param eventName - The unique identifier for the user event type. Can be either a number or a string.
     * @returns The newly defined or existing UserEventType associated with the provided identifier.
     *
     * @example
     * ```ts
     * const USER_EVENT_01: UserEventType = APJS.EventManager.defineUserEventType(42);
     * const USER_EVENT_02: UserEventType = APJS.EventManager.defineUserEventType('foo');
     * ```
     */
    function defineUserEventType(eventName: number | string): UserEventType;
    /**
     * @description Creates and returns a new event instance based on the provided event type.
     * @param eventType - The type of the event, which can be either a numeric code or a predefined UserEventType enum value.
     * @returns An `IEvent` whose initial `type` is `eventType` and whose initial `args` is `[]`.
     * @example
     * ```ts
     * const event = APJS.EventManager.createEvent(myEventType);
     * ```
     */
    function createEvent(eventType: number | UserEventType): IEvent;
    /**
     * @description Retrieves the global event emitter instance.
     * Repeated calls return the same emitter for the current APJS runtime.
     * @returns The global event emitter instance.
     * @example
     * ```ts
     * const emitter = APJS.EventManager.getGlobalEmitter();
     * emitter.emit(myEvent);
     * ```
     */
    function getGlobalEmitter(): IEventEmitter;
    /**
     * @description Retrieves the event emitter associated with a given object.
     * @param obj - The object for which to get the event emitter. This can be an AObject.
     * @returns The event emitter for the specified object. Returns undefined when `obj` is falsy;
     * callers that may pass uncertain inputs should null-check the result.
     * @example
     * ```ts
     * const emitter = APJS.EventManager.getObjectEmitter(myObject);
     * emitter.emit(myEvent);
     * ```
     */
    function getObjectEmitter(obj: AObject): IEventEmitter;
    /**
     * @description Retrieves the event emitter associated with gesture.
     * Use it to subscribe to {@link GestureType.Tap}, {@link GestureType.LongTap},
     * {@link GestureType.Drag}, and {@link GestureType.Drop}. Gesture callbacks
     * receive {@link GestureInfo} in `event.args[0]`.
     * @returns The event emitter for gesture input.
     * @example
     * const emitter = APJS.EventManager.getGestureEmitter();
     * const callback = (event:APJS.IEvent) => {
     *   const gestureInfo = event.args[0] as APJS.GestureInfo;
     *   const offset = gestureInfo.endPoint.clone().subtract(gestureInfo.startPoint);
     *   // Do something with drag offset
     * }
     * emitter.on(GestureType.Drag, callback)
     */
    function getGestureEmitter(): IEventEmitter;
  }
  /**
   * @description Event type
   * @enum
   * @example
   *  let callback = (event:IEvent) => {
   *    const touchInfo = event.args[0] as APJS.TouchData;
   *    const touchPhase = touchInfo.phase;
   *    ...
   *
   *  }
   *
   *  const globalEmitter = APJS.EventManager.getGlobalEmitter();
   *  globalEmitter.on(APJS.EventType.Touch, callback);
   */
  enum EventType {
    /**
     * @description Touch event. The event args are [TouchData].
     */
    Touch,
    /**
     * @description Record start event. The event args are empty.
     */
    RecordStart,
    /**
     * @description Record end event. The event args are empty.
     */
    RecordEnd
  }
  /**
   * @description Controls where the thickness specified by {@link Text3D.extrudeDepth} lies relative
   * to the original flat glyph plane. It changes the placement of the generated depth, not its total
   * thickness: for depth `d`, the resulting local-Z ranges are `[-d/2, d/2]`, `[0, d]`, and `[-d, 0]`.
   * @enum
   * @example
   * text3D.extrudeDepth = 0.2;
   * text3D.extrudeDirection = APJS.ExtrudeDirection.Forward;
   */
  enum ExtrudeDirection {
    /** Centers the depth on the glyph plane, extending half of extrudeDepth toward both -Z and +Z. */
    Both,
    /** Keeps the original glyph plane at local Z = 0 and places all generated depth toward local +Z. */
    Forward,
    /** Keeps the original glyph plane at local Z = 0 and places all generated depth toward local -Z. */
    Back
  }
  /**
   * @interface
   * @description Snapshot of a single detected face's basic landmark and pose result.
   * Returned by {@link FaceBaseInfoInterface.getFaceBaseInfo} and contains the unique
   * tracking `ID`, the `score`, the bounding `rect`, head pose angles
   * (`pitch` / `roll` / `yaw`), the 106-point landmark layout (`pointsArray`),
   * per-point `visibilityArray`, and the helper `hasAction` for facial actions.
   * All numeric properties are read-only snapshots; the array properties share a common
   * length / index convention (see `pointsArray` and `visibilityArray`).
   */
  interface Face106Interface {
    /**
     * @readonly
     * @description Each detected face has a unique faceID. When a face that was
     * lost during tracking is detected again, it will have a new faceID.
     */
    readonly ID: number;
    /**
     * @readonly
     * @description Inter-eye distance, normalized by the input texture width (i.e. native `eye_dist / width`).
     * The value is a unit-less scalar in the same horizontal-normalized space as `pointsArray.x`;
     * it is not an absolute pixel distance.
     */
    readonly eyeDistance: number;
    /**
     * @readonly
     * @description Pitch angle in radians. Runtime verification shows negative values
     * represent the head tilting upward and positive values represent the head
     * tilting downward.
     * @example
     * const face = result.getFaceBaseInfo(0);
     * const upWard = face.pitch < -0.2;
     * const downWard = face.pitch > 0.2;
     */
    readonly pitch: number;
    /**
     * @readonly
     * @description Flat `Float32Array` of 106 face landmark points, length `212`, laid out as `[x0, y0, x1, y1, ..., x105, y105]`.
     * Coordinates are expressed in normalized input-texture space (`x` divided by width, `y` is `1 - py / height` so the Y axis points up),
     * but runtime values are not guaranteed to be clamped to `[0, 1]`; points may fall outside the nominal image extent.
     * The point order follows the standard ST/LM-106 face landmark convention used by the native algorithm (e.g. eyes around indices 74/75/77, nose tip near index 46).
     */
    readonly pointsArray: Float32Array;
    /**
     * @readonly
     * @description Bounding rectangle of the detected face in normalized coordinates [0.0, 1.0],
     * relative to the camera input image. `x` and `y` represent the bottom-left corner;
     * `width` extends rightward and `height` extends upward.
     */
    readonly rect: Rect;
    /**
     * @readonly
     * @description Roll angle in radians. Runtime verification shows positive values
     * represent a left tilt and negative values represent a right tilt around the
     * forward axis.
     * @example
     * const face = result.getFaceBaseInfo(0);
     * const isTiltedLeft = face.roll > 0.2;
     * const isTiltedRight = face.roll < -0.2;
     */
    readonly roll: number;
    /**
     * @readonly
     * @description Confidence score in the range [0, 1].
     */
    readonly score: number;
    /**
     * @readonly
     * @description Per-landmark visibility indicators, length `106`, with index `i`
     * corresponding to the `i`-th point in `pointsArray`. Values are reported by the
     * native model; do not assume they are always exact `0.0` / `1.0` flags. Runtime
     * verification also shows the current model may report `-1` for every point when
     * visibility is unavailable / not populated, so consumers should treat this array
     * as model-specific numeric metadata rather than a guaranteed boolean mask.
     */
    readonly visibilityArray: Float32Array;
    /**
     * @readonly
     * @description Yaw angle in radians. Runtime verification shows positive values
     * represent the face turning left and negative values represent the face turning
     * right.
     * @example
     * const face = result.getFaceBaseInfo(0);
     * const facingLeft = face.yaw > 0.2;
     * const facingRight = face.yaw < -0.2;
     */
    readonly yaw: number;
    /**
     * @description Returns whether the specified facial action is currently detected
     * for this face.
     * @param action - A {@link FaceAction} enum value, or its underlying numeric value
     * (a non-negative integer). For an unknown / unsupported numeric input this method
     * simply returns `false` rather than throwing.
     * @example
     * const face = result.getFaceBaseInfo(0);
     * if (face.hasAction(APJS.FaceAction.MouthAh)) {
     *   // react to an open mouth
     * }
     */
    hasAction(action: number | FaceAction): boolean;
  }
  /**
   * @description Enum representing various facial actions that face can perform.
   * @enum
   * @property BrowJump Causes the face eyebrows to jump.
   * @property EyeBlink Makes the face blink both eyes.
   * @property EyeBlinkLeft Makes the face blink only the left eye.
   * @property EyeBlinkRight Makes the face blink only the right eye.
   * @property HeadPitch Tilts the face head up and down.
   * @property HeadYaw Turns the face head side to side.
   * @property MouthAh Opens the face mouth in an "ah" shape.
   * @property MouthPout Puts the face mouth into a pouting position.
   * @property SideNod Nods the face head from side to side.
   */
  enum FaceAction {
    BrowJump,
    EyeBlink,
    EyeBlinkLeft,
    EyeBlinkRight,
    HeadPitch,
    HeadYaw,
    MouthAh,
    MouthPout,
    SideNod
  }
  /**
   * @description Enum representing facial expression categories returned by face
   * attribute analysis.
   * @enum
   * @property Unknown The expression could not be classified.
   * @property Angry Angry expression.
   * @property Disgust Disgusted expression.
   * @property Fear Fearful expression.
   * @property Happy Happy expression.
   * @property Sad Sad expression.
   * @property Surprise Surprised expression.
   * @property Neutral Neutral expression.
   */
  enum FaceAttrExpression {
    Unknown,
    Angry,
    Disgust,
    Fear,
    Happy,
    Sad,
    Surprise,
    Neutral
  }
  /**
   * @description Gender attribute of a face.
   * @enum
   * @property Unknown The gender is unknown.
   * @property Male The gender is male.
   * @property Female The gender is female.
   */
  enum FaceAttrGender {
    Unknown,
    Male,
    Female
  }
  /**
   * @interface
   * @description Snapshot of per-face attribute estimates produced by the face-attribute model.
   * Includes age (`age`), attractiveness (`attractive`), gender signals (`gender` and the
   * raw `boyProbability`), the discrete `expressionType`, the per-class
   * `expressionProbabilities` array, and the convenience `happyScore`. Indices into
   * `expressionProbabilities` align with the {@link FaceAttrExpression} enum values
   * (excluding `Unknown`); see that property for the exact order.
   */
  interface FaceAttributeInterface {
    /**
     * @readonly
     * @description Predicted age value in the range [0, 100].
     */
    readonly age: number;
    /**
     * @readonly
     * @description Attractiveness score in the range [0, 100].
     */
    readonly attractive: number;
    /**
     * @readonly
     * @description Probability of being male in the range [0.0, 1.0].
     */
    readonly boyProbability: number;
    /**
     * @readonly
     * @description Per-expression probability scores. Fixed length of `7`;
     * indices follow {@link FaceAttrExpression} values `0..6` (excluding
     * `Unknown`): `[Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral]`.
     * Each value is in the range `[0, 1]`.
     */
    readonly expressionProbabilities: Float32Array;
    /**
     * @readonly
     * @description The classified facial expression. See {@link FaceAttrExpression}.
     * @example
     * const attr = result.getFaceAttributeInfo(0);
     * if (attr.expressionType === APJS.FaceAttrExpression.Happy) {
     *   // react to a smile
     * }
     */
    readonly expressionType: FaceAttrExpression;
    /**
     * @readonly
     * @description Gender classification. See {@link FaceAttrGender}.
     */
    readonly gender: FaceAttrGender;
    /**
     * @readonly
     * @description Degree of happiness in the range [0, 100].
     */
    readonly happyScore: number;
  }
  /**
   * @description Expression weights for the first base face in the current frame.
   * Obtain this with AlgorithmResult.getFaceBlendShapeInfo and check for null.
   * The array has exactly 52 entries; each index identifies the same channel on
   * subsequent frames. Reacquire the result each frame. Copy the Float32Array if
   * you need historical weights or want to clamp values for your own effect.
   */
  interface FaceBlendShapeInfo {
    /**
     * @description 52 coefficients in the following order. Values are not clamped to [0, 1].
     * 0 BrowDownLeft; 1 BrowDownRight; 2 BrowInnerUp; 3 BrowOuterUpLeft; 4 BrowOuterUpRight;
     * 5 CheekPuff; 6 CheekSquintLeft; 7 CheekSquintRight; 8 EyeBlinkLeft; 9 EyeBlinkRight;
     * 10 EyeLookDownLeft; 11 EyeLookDownRight; 12 EyeLookInLeft; 13 EyeLookInRight;
     * 14 EyeLookOutLeft; 15 EyeLookOutRight; 16 EyeLookUpLeft; 17 EyeLookUpRight;
     * 18 EyeSquintLeft; 19 EyeSquintRight; 20 EyeWideLeft; 21 EyeWideRight;
     * 22 JawForward; 23 JawLeft; 24 JawOpen; 25 JawRight; 26 MouthClose;
     * 27 MouthDimpleLeft; 28 MouthDimpleRight; 29 MouthFrownLeft; 30 MouthFrownRight;
     * 31 MouthFunnel; 32 MouthLeft; 33 MouthLowerDownLeft; 34 MouthLowerDownRight;
     * 35 MouthPressLeft; 36 MouthPressRight; 37 MouthPucker; 38 MouthRight;
     * 39 MouthRollLower; 40 MouthRollUpper; 41 MouthShrugLower; 42 MouthShrugUpper;
     * 43 MouthSmileLeft; 44 MouthSmileRight; 45 MouthStretchLeft; 46 MouthStretchRight;
     * 47 MouthUpperUpLeft; 48 MouthUpperUpRight; 49 NoseSneerLeft; 50 NoseSneerRight; 51 TongueOut.
     */
    readonly blendshapeWeights: Float32Array;
  }
  /**
   * @description Two 44-point contours in normalized image coordinates, associated
   * with the requested base face by face ID in the current frame.
   * Obtain this with AlgorithmResult.getFaceContourInfo using a base-face index,
   * and check for null. Reacquire the result each frame; array positions identify
   * contour landmarks, not faces. Treat both point arrays as read-only.
   * Source: https://bytedance.larkoffice.com/docx/R72edXQMxo6WrmxYq1OcrW8tnAg.
   */
  interface FaceContourInfo {
    /**
     * @description 44 ideal contour points. 0 is the forehead top; 0-22 descend
     * along image left to the chin, and 22-43 ascend along image right.
     * Landmark pairs: 2/42 forehead corners, 3/41 frontotemporal prominences,
     * 4/40 sideburns, 5/39 auxiliary temple points, 6/38 temples, 8/36 cheekbones,
     * 11/33 cheek-jaw hollows, 14/30 jawbone, 15/29 lower bony prominences,
     * 17/27 hollows along the lower jaw edge, 20/24 chin sides; 22 is the chin tip.
     * Other indices sample the contour between these points in algorithm order.
     */
    readonly idealLandmarks: Vector2f[];
    /**
     * @description 44 actual contour points, with the same index meanings as
     * idealLandmarks. Forehead points follow the hairline; the ideal contour
     * regularizes their spacing and shape. Both contours coincide below the forehead.
     */
    readonly actualLandmarks: Vector2f[];
  }
  /**
   * @description Fine facial landmarks in normalized image coordinates, in algorithm order.
   * Obtain this with AlgorithmResult.getFaceExtraInfo using the current base-face
   * index. The getter returns null unless all five point arrays are available.
   * Reacquire this current-frame result on every update. Treat the arrays as read-only;
   * copy coordinates if they must be retained or modified by your effect.
   * Point definitions: https://bytedance.larkoffice.com/wiki/wikcn1Y8WcbOFBHfVjNj0e6LVId (Figure 2).
   */
  interface FaceExtraInfo {
    /**
     * @description 22 left-eye points. 0 is the outer canthus, 11 the inner canthus;
     * 1-10 follow the upper lid from outer to inner, 12-21 the lower lid from inner to outer.
     */
    readonly leftEyeLandmarks: Vector2f[];
    /** @description 22 right-eye points, with the same ordering as leftEyeLandmarks. */
    readonly rightEyeLandmarks: Vector2f[];
    /**
     * @description 13 left-eyebrow points. 0 is the tail; 1-6 follow the upper edge
     * from tail to head, and 7-12 the lower edge from tail to head. 6 and 12 are the
     * upper and lower inner ends. Indices retain the algorithm's sampling order.
     */
    readonly leftEyebrowLandmarks: Vector2f[];
    /** @description 13 right-eyebrow points, with the same ordering as leftEyebrowLandmarks. */
    readonly rightEyebrowLandmarks: Vector2f[];
    /**
     * @description 64 lip points. In the frontal reference image, each of the following
     * 15-point segments runs from image left to right: 0-14 upper outer lip,
     * 15-29 upper inner lip, 30-44 lower inner lip, 45-59 lower outer lip.
     * 60/61 are the image-left/right outer corners; 62/63 are the image-left/right
     * inner corners. 7, 22, 37 and 52 are the middle points of the four segments.
     * Intermediate samples retain algorithm order; uniform interpolation is not guaranteed.
     */
    readonly lipLandmarks: Vector2f[];
  }
  /**
   * @interface
   * @description Snapshot of a single face's whole-face mask result. Exposes the unique
   * tracking `ID`, the square mask buffer (`faceMask`), and its edge length
   * (`faceMaskSize`). The mask describes per-pixel face coverage and is only valid for
   * the frame in which it was produced; consumers should re-fetch it via
   * {@link FaceBaseInfoInterface.getFaceFaceMask} on subsequent frames rather than
   * caching the buffer.
   */
  interface FaceFaceMaskInterface {
    /**
     * @readonly
     * @description Each detected face has a unique faceID. When a face that was
     * lost during tracking is detected again, it will have a new faceID.
     */
    readonly ID: number;
    /**
     * @readonly
     * @description Face mask data as a square grayscale image of size
     * `faceMaskSize × faceMaskSize`. Pixels are stored row-major with the origin at
     * the top-left corner: the value for column `x`, row `y` is
     * `faceMask[y * faceMaskSize + x]` (`x` to the right, `y` downward). The mask
     * lives in its own normalized square space and is not aligned pixel-for-pixel
     * with the input camera image. Pixel values range `[0, 255]`; higher values
     * indicate stronger face-region confidence, `0` means outside the mask.
     */
    readonly faceMask: Uint8Array;
    /**
     * @readonly
     * @description Edge length, in pixels, of the square `faceMask` image.
     * `0` means no mask is available for this face.
     */
    readonly faceMaskSize: number;
    /**
     * @description Six row-major affine coefficients mapping input-image pixel
     * coordinates to mask pixel coordinates: u = m[0]*x + m[1]*y + m[2],
     * v = m[3]*x + m[4]*y + m[5]. Use pixels of the algorithm's input image from
     * the same frame, not normalized coordinates or resized preview pixels.
     * Treat this matrix as read-only. Check mask availability and sample only
     * within the square mask's bounds; the following example uses nearest pixels.
     * @example
     * // Call during onUpdate with pixel coordinates in the algorithm's input image.
     * function sampleFaceMaskAtInputPixel(x: number, y: number): number | undefined {
     *   const result = APJS.AlgorithmManager.getResult();
     *   if (result.getFaceCount() === 0) return undefined;
     *   const info = result.getFaceFaceMask(0);
     *   if (!info || info.faceMaskSize <= 0) return undefined;
     *   const size = info.faceMaskSize;
     *   const m = info.warpMatrix;
     *   if (info.faceMask.length !== size * size || m.length !== 6) return undefined;
     *   const u = Math.round(m[0] * x + m[1] * y + m[2]);
     *   const v = Math.round(m[3] * x + m[4] * y + m[5]);
     *   if (!Number.isFinite(u) || !Number.isFinite(v)) return undefined;
     *   if (u < 0 || v < 0 || u >= size || v >= size) return undefined;
     *   return info.faceMask[v * size + u] / 255;
     * }
     */
    readonly warpMatrix: Float32Array;
  }
  /**
   * @description Selects the tracked landmark loop used to generate the inset mesh. Eye, nose, mouth,
   * and head regions are shared by human, cat, and dog topologies; brows, inner mouth, and irises are
   * human-only, while ears are available only for cat and dog. Left and right refer to the subject's
   * own sides. The public {@link FaceInsetRenderer.faceArea} property is read-only.
   * @enum
   */
  enum FaceInsetAreaType {
    /** Builds the mesh around the subject's right eye; available for human, cat, and dog. */
    RightEye = "RIGHT_EYE",
    /** Builds the mesh around the subject's left eye; available for human, cat, and dog. */
    LeftEye = "LEFT_EYE",
    /** Builds the mesh around the subject's right eyebrow; available only for human faces. */
    RightBrow = "RIGHT_BROW",
    /** Builds the mesh around the subject's left eyebrow; available only for human faces. */
    LeftBrow = "LEFT_BROW",
    /** Builds the mesh around the nose; available for human, cat, and dog. */
    Nose = "NOSE",
    /** Builds the mesh around the outer mouth contour; available for human, cat, and dog. */
    Mouth = "MOUTH",
    /** Builds the mesh around the inner-mouth opening; available only for human faces. */
    InnerMouth = "INNER_MOUTH",
    /** Builds the mesh around the outer tracked face or head contour for the selected topology. */
    Head = "HEAD",
    /** Builds the mesh around the subject's left iris; available only for human faces. */
    LeftIris = "LEFT_IRIS",
    /** Builds the mesh around the subject's right iris; available only for human faces. */
    RightIris = "RIGHT_IRIS",
    /** Builds the mesh around the subject's right ear; available only for cat and dog. */
    RightEar = "RIGHT_EAR",
    /** Builds the mesh around the subject's left ear; available only for cat and dog. */
    LeftEar = "LEFT_EAR"
  }
  /**
   * @description Controls how the face inset source color is composited with the camera framebuffer.
   * In the member descriptions, "source" is the sampled and color-adjusted inset, while "background"
   * is the framebuffer color already rendered at the same pixel. The selected mode is authored in the
   * Inspector and reported by the read-only {@link FaceInsetRenderer.blendMode} property because a mode
   * change requires rebuilding the material pass and shader variant.
   * @enum
   */
  enum FaceInsetBlendMode {
    /** Disables blending and writes the source output directly. */
    Disabled = "Disabled_v2",
    /** Alpha-composites the source over the background. */
    Normal = "Normal_v2",
    /** Keeps the darker value of each source and background color channel. */
    Darken = "Darken_v2",
    /** Multiplies source and background channels, usually producing a darker result. */
    Multiply = "Multiply_v2",
    /** Keeps the lighter value of each source and background color channel. */
    Lighten = "Lighten_v2",
    /** Applies inverse multiplication, usually producing a lighter result. */
    Screen = "Screen_v2",
    /** Adds source and background channels and clamps the result to 1. */
    LinearDodge = "Linear_Dodge_v2",
    /** Darkens the background by increasing contrast according to the source. */
    ColorBurn = "Color_Burn_v2",
    /** Computes max(background + source - 1, 0), producing a linear darkening effect. */
    LinearBurn = "Linear_Burn_v2",
    /** Brightens the background by decreasing contrast according to the source. */
    ColorDodge = "Color_Dodge_v2",
    /** Multiplies dark background channels and screens light background channels. */
    Overlay = "Overlay_v2",
    /** Applies a soft contrast change according to the source. */
    SoftLight = "Soft_Light_v2",
    /** Multiplies or screens according to whether each source channel is below 0.5. */
    HardLight = "Hard_Light_v2",
    /** Applies color burn below source 0.5 and color dodge above source 0.5. */
    VividLight = "Vivid_Light_v2",
    /** Applies linear burn below source 0.5 and linear dodge above source 0.5. */
    LinearLight = "Linear_Light_v2",
    /** Replaces only source-driven dark or light channel extremes. */
    PinLight = "Pin_Light_v2",
    /** Thresholds vivid-light output to 0 or 1 for a posterized result. */
    HardMix = "Hard_Mix_v2",
    /** Uses the absolute difference between source and background channels. */
    Difference = "Difference_v2",
    /** Produces a lower-contrast difference using background + source - 2 * background * source. */
    Exclusion = "Exclusion_v2",
    /** Uses deterministic per-pixel noise and source alpha to create speckled coverage. */
    Dissolve = "Dissolve_v2",
    /** Compares luminance and keeps the entire darker color. */
    DarkerColor = "Darker_Color_v2",
    /** Compares luminance and keeps the entire lighter color. */
    LighterColor = "Lighter_Color_v2",
    /** Computes max(background + source - 1, 0), matching the current shader implementation. */
    Subtract = "Subtract_v2",
    /** Divides source RGB by background RGB in the current shader implementation. */
    Divide = "Divide_v2",
    /** Uses source hue with background saturation and lightness. */
    Hue = "Hue_v2",
    /** Uses source saturation with background hue and lightness. */
    Saturation = "Saturation_v2",
    /** Uses source hue and saturation with background lightness. */
    Color = "Color_v2",
    /** Uses source lightness with background hue and saturation. */
    Luminosity = "Luminosity_v2",
    /** Halves source alpha before normal compositing, producing a half-strength blend. */
    Average = "Average_v2"
  }
  /**
   * @class FaceInsetRenderer
   * @extends Renderer
   * @description Tracks a configured facial region, builds a mesh from its landmarks, and renders an
   * input texture on that mesh.
   */
  class FaceInsetRenderer extends Renderer {
    protected constructor();
    /**
     * @description The landmark model selected when the component was created. This value is read-only at runtime.
     * @readonly
     */
    get faceType(): FaceInsetType;
    /**
     * @description The landmark region selected when the component was created. This value is read-only at runtime.
     * @readonly
     */
    get faceArea(): FaceInsetAreaType;
    /**
     * @description The 1-based ID of the face to render, in the range `1` to `5`.
     */
    get faceID(): number;
    set faceID(value: number);
    /**
     * @description The texture sampled on the generated face-region mesh. Setting null clears the
     * source texture, so the renderer has no valid image to sample.
     * @type {Texture}
     */
    get inputTexture(): Texture | null;
    set inputTexture(value: Texture | null);
    /**
     * @description Scales source UVs around the tracked region center. (1, 1) is unchanged; 0 on an
     * axis samples only the center on that axis; a larger magnitude samples farther from the center,
     * making texture features appear smaller; a negative value also mirrors that axis. No fixed
     * range is enforced. The getter returns a copy; assign it back after changing x or y.
     * @type {Vector2f}
     */
    get inputTextureScale(): Vector2f;
    set inputTextureScale(value: Vector2f);
    /**
     * @description Offsets source UVs after scaling. (0, 0) is unchanged; positive and negative
     * values move sampling in the corresponding UV direction, and a larger absolute value moves it
     * farther. Native code applies one tenth of this value and does not enforce a range. The getter
     * returns a copy; assign it back after changing x or y.
     * @type {Vector2f}
     */
    get inputTextureUVOffset(): Vector2f;
    set inputTextureUVOffset(value: Vector2f);
    /**
     * @description Outer feather amount in the supported range [0, 1]. 0 creates no outer falloff
     * ring; larger values extend a wider transparent falloff beyond the landmarks. At 1, the
     * generated ring width is 10% of the tracked eye distance. Native code clamps only values below
     * 0.
     */
    get outerFeather(): number;
    set outerFeather(value: number);
    /**
     * @description Inner feather amount in the supported range [0, 1]. The center remains opaque; 0
     * keeps the landmark boundary opaque, while 1 fades the boundary to transparent. Larger values
     * therefore create a stronger inward fade. Native code clamps only values below 0.
     */
    get innerFeather(): number;
    set innerFeather(value: number);
    /**
     * @description Overall opacity in the supported range [0, 1]. 0 makes the inset invisible, while
     * 1 preserves the alpha produced by the texture and feathering. The value is not clamped by
     * APJS.
     * @type {number}
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * @description The blend mode authored in the Inspector, which determines how the inset source
     * color is composited with the camera framebuffer. This value is read-only at runtime because
     * changing modes requires rebuilding the material pass and its shader variant.
     * @readonly
     * @type {FaceInsetBlendMode}
     */
    get blendMode(): FaceInsetBlendMode;
    /**
     * @description Mixes the sampled texture RGB toward this color. Color channels use the supported
     * range [0, 1]; alpha 0 leaves texture RGB unchanged, while alpha 1 replaces it completely with
     * this color's RGB. The getter returns a copy; assign it back after changing a channel.
     * @type {Color}
     */
    get fillColor(): Color;
    set fillColor(value: Color);
    /**
     * @description Whether to draw an outline inside the outer feather ring. The outline is
     * suppressed when outerFeather is below 0.001 because no usable outer ring exists.
     */
    get outlineEnabled(): boolean;
    set outlineEnabled(value: boolean);
    /**
     * @description Outline RGBA color. Channels use the supported range [0, 1]; alpha 0 is
     * transparent and alpha 1 is fully opaque before overall opacity and feathering are applied. The
     * getter returns a copy; assign it back after changing a channel.
     * @type {Color}
     */
    get outlineColor(): Color;
    set outlineColor(value: Color);
    /**
     * @description Outline thickness in the supported range [0, 1]. 0 confines the outline to the
     * outer edge; larger values extend it farther inward, and values near 1 produce the widest
     * outline. The native shader threshold is capped at 0.99.
     * @type {number}
     */
    get outlineThickness(): number;
    set outlineThickness(value: number);
    /**
     * @description Enables both depth testing and depth writing for the inset pass. When true,
     * nearer depth-tested geometry can occlude the inset and the inset also contributes to the depth
     * buffer.
     * @type {boolean}
     */
    get depthTest(): boolean;
    set depthTest(value: boolean);
    /**
     * @description Boundary subdivision quality in the supported integer range [0, 10]. 0 and 1
     * keep the original landmark polygon; values above 1 generate that many Catmull-Rom samples per
     * boundary segment. Higher values produce a smoother contour with more geometry and processing
     * cost.
     */
    get quality(): number;
    set quality(value: number);
  }
  /**
   * @description Selects the landmark topology used to build a {@link FaceInsetRenderer} mesh. It also
   * determines which {@link FaceInsetAreaType} values are valid. The public
   * {@link FaceInsetRenderer.faceType} property reports the authoring-time selection and is read-only.
   * @enum
   */
  enum FaceInsetType {
    /** Uses human-face landmarks and supports human-only brows, inner mouth, and iris regions. */
    Human = "HUMAN",
    /** Uses cat-face landmarks and supports pet ear regions in addition to shared facial regions. */
    Cat = "CAT",
    /** Uses dog-face landmarks and supports pet ear regions in addition to shared facial regions. */
    Dog = "DOG"
  }
  /**
   * @description Iris landmarks in normalized image coordinates, in algorithm order.
   * Obtain this with AlgorithmResult.getFaceIrisInfo and check for null before use.
   * Both arrays contain 20 points. Reacquire the result each frame and treat its
   * points as read-only; base-face detection alone does not imply iris availability.
   */
  interface FaceIrisInfo {
    /**
     * @description 20 left-iris points: 0 is the center and 1-19 are the rim.
     * In the frontal reference image, 1 starts at the top; successive rim points
     * follow image left, bottom and image right back toward the top.
     * Source: https://bytedance.larkoffice.com/wiki/wikcn1Y8WcbOFBHfVjNj0e6LVId (Figure 2).
     */
    readonly leftLandmarks: Vector2f[];
    /** @description 20 right-iris points, with the same ordering as leftLandmarks. */
    readonly rightLandmarks: Vector2f[];
  }
  /**
   * @class FaceMakeup
   * @description Represents a face makeup component that handles facial makeup rendering with customizable properties such as texture, opacity, and color.
   */
  class FaceMakeup extends Component {
    protected constructor();
    /**
     * @description Gets or sets the intensity level of the face makeup component.
     * Recommended range is `[0, 1]`, where `0` hides the effect and `1` is full strength.
     * Default: `1`.
     */
    get intensity(): number;
    set intensity(value: number);
    /**
     * @description Gets the main texture applied to the face makeup component.
     * Returns `null` when no main texture has been bound yet.
     */
    get makeupTexture(): Texture | null;
    /**
     * @description Sets the main texture applied to the face makeup component.
     * Passing `null` does not clear the currently displayed texture; the previous
     * texture remains visible until a new non-null texture is assigned.
     */
    set makeupTexture(value: Texture | null);
    /**
     * @description Gets whether the opacity effect is enabled for the face makeup component.
     * When `true`, the bound {@link opacityTexture} and {@link color} participate in makeup
     * compositing; when `false`, both are ignored. Default: `false`.
     */
    get opacityEnabled(): boolean;
    /**
     * @description Sets whether the opacity effect is enabled for the face makeup component.
     */
    set opacityEnabled(value: boolean);
    /**
     * @description Gets the texture used for opacity control in the face makeup component.
     * Returns `null` when no opacity texture has been bound yet.
     */
    get opacityTexture(): Texture | null;
    /**
     * @description Sets the texture used for opacity control in the face makeup component.
     * Only takes visible effect when `opacityEnabled` is `true`. Passing `null` clears the
     * cached reference on the component but does NOT unbind the previously bound native texture
     * from the material — the previously assigned opacity texture continues to be used until a
     * new non-null texture is supplied.
     */
    set opacityTexture(value: Texture | null);
    /**
     * @description Gets the base color applied to the face makeup component.
     */
    get color(): Color;
    /**
     * @description Sets the base color applied to the face makeup component.
     * Only takes visible effect when {@link opacityEnabled} is `true`.
     * Each channel of `value` (`r`, `g`, `b`, `a`) is expected to be in `[0, 1]` (linear / RGBA),
     * matching the {@link Color} convention used elsewhere in APJS, and is forwarded as-is to
     * the material's `_BaseColor` uniform without clamping.
     */
    set color(value: Color);
    /**
     * @description Sets a float uniform on a single face index.
     * Unlike {@link setMaterialProperty} which applies to all faces, this targets one tracked face slot.
     * The `key` must match the shader uniform name used by the bound face makeup material.
     * Only supports `number` (float) values — for vec4/mat4/texture use the dedicated setters
     * or {@link setMaterialProperty} instead.
     *
     * @param {string} key - Shader uniform name. Common keys and values are _Intensity, _Opacity
     * @param {number} face - The tracked face index to apply the property to. Must be a non-negative
     * integer; index `0` refers to the first tracked face. Out-of-range or unknown indices are
     * silently ignored (no error, no effect).
     * @param {number} value - Float value to set. Forwarded as-is to the shader uniform without clamping.
     * @example
     * comp.setMaterialPropertyByIndex("_Intensity", 1, 1.0);
     * comp.setMaterialPropertyByIndex("_Intensity", 1, 0.8);
     * comp.setMaterialPropertyByIndex("_Intensity", 2, 0.5);
     */
    setMaterialPropertyByIndex(key: string, face: number, value: number): void;
    /**
     * @description Sets a shader uniform on **all face indexes** for this makeup component.
     *
     * The `key` must match the shader uniform name used by the bound face makeup material.
     * Known shader keys used by this component include:
     * - `"_Intensity"` (float): overall makeup intensity
     * - `"_BaseColor"` (Vector4f): RGBA tint color
     * - `"_BaseTexture"` (Texture): main makeup texture
     * - `"_EnableOpacity"` (float): 0 or 1, whether opacity mask is enabled
     * - `"_OpacityTexture"` (Texture): opacity mask texture
     *
     * **Silent failure:** passing an unrecognized key or a value whose type does not match
     * the shader's uniform type produces no error — the call is simply ignored.
     *
     * **No caching:** the value is forwarded to the native shader but NOT stored in JS.
     * The dedicated setters ({@link makeupTexture}, {@link opacityTexture}, {@link color},
     * {@link opacityEnabled}, {@link intensity}) are convenience wrappers around this method
     * with fixed keys — prefer them when available, as they cache values and provide type safety.
     *
     * **All faces vs per-face:** use {@link setMaterialPropertyByIndex} to target a single face index.
     *
     * @param {string} key - Shader uniform name.
     * @param {number | Vector4f | Matrix4x4f | Texture} value - The value to set.
     *
     * @example
     * comp.setMaterialProperty("_Intensity", 0.8);
     * @example
     * comp.setMaterialProperty("_BaseColor", new Vector4f(1, 0, 0, 1));
     * @example
     * comp.setMaterialProperty("_BaseTexture", myTexture);
     */
    setMaterialProperty(key: string, value: number | Vector4f | Matrix4x4f | Texture): void;
  }
  /**
   * @interface
   * @description Snapshot of a single face's mouth mask result. Exposes the unique
   * tracking `ID`, the square mask buffer (`faceMask`), and its edge length
   * (`faceMaskSize`). The mask describes per-pixel mouth coverage and is only valid
   * for the frame in which it was produced; consumers should re-fetch it via
   * {@link FaceBaseInfoInterface.getFaceMouthMask} on subsequent frames rather than
   * caching the buffer.
   */
  interface FaceMouthMaskInterface {
    /**
     * @readonly
     * @description Each detected face has a unique faceID. When a face that was
     * lost during tracking is detected again, it will have a new faceID.
     */
    readonly ID: number;
    /**
     * @readonly
     * @description Mouth mask data as a square grayscale image of size
     * `faceMaskSize × faceMaskSize`. Pixels are stored row-major with the origin at
     * the top-left corner: the value for column `x`, row `y` is
     * `faceMask[y * faceMaskSize + x]` (`x` to the right, `y` downward). The mask
     * lives in its own normalized square space and is not aligned pixel-for-pixel
     * with the input camera image. Pixel values range `[0, 255]`; higher values
     * indicate stronger mouth-region confidence, `0` means outside the mask.
     */
    readonly faceMask: Uint8Array;
    /**
     * @readonly
     * @description Edge length, in pixels, of the square `faceMask` image.
     * `0` means no mask is available for this face.
     */
    readonly faceMaskSize: number;
    /**
     * @description Six row-major affine coefficients mapping input-image pixel
     * coordinates to mask pixel coordinates: u = m[0]*x + m[1]*y + m[2],
     * v = m[3]*x + m[4]*y + m[5]. Use pixels of the algorithm's input image from
     * the same frame, not normalized coordinates or resized preview pixels.
     * Treat this matrix as read-only. Check mask availability and sample only
     * within the square mask's bounds; the following example uses nearest pixels.
     * @example
     * // Call during onUpdate with pixel coordinates in the algorithm's input image.
     * function sampleMouthMaskAtInputPixel(x: number, y: number): number | undefined {
     *   const result = APJS.AlgorithmManager.getResult();
     *   if (result.getFaceCount() === 0) return undefined;
     *   const info = result.getFaceMouthMask(0);
     *   if (!info || info.faceMaskSize <= 0) return undefined;
     *   const size = info.faceMaskSize;
     *   const m = info.warpMatrix;
     *   if (info.faceMask.length !== size * size || m.length !== 6) return undefined;
     *   const u = Math.round(m[0] * x + m[1] * y + m[2]);
     *   const v = Math.round(m[3] * x + m[4] * y + m[5]);
     *   if (!Number.isFinite(u) || !Number.isFinite(v)) return undefined;
     *   if (u < 0 || v < 0 || u >= size || v >= size) return undefined;
     *   return info.faceMask[v * size + u] / 255;
     * }
     */
    readonly warpMatrix: Float32Array;
  }
  /**
   * @interface
   * @description Read-only snapshot of a single face detected by the pet-face
   * algorithm in the current frame. The detected category (cat, dog, etc.) is
   * indicated by `facePetType`. All properties are valid only for the producing
   * frame.
   */
  interface FacePetInfoInterface {
    /**
     * @readonly
     * @description Each detected pet face has a unique faceID. When a pet face
     * that was lost during tracking is detected again, it will have a new
     * faceID.
     */
    readonly ID: number;
    /**
     * @readonly
     * @description Bitmask describing the pet face's per-feature open/close state.
     * Only the lowest 3 bits are currently defined (other bits are reserved by the native model):
     * - bit 0 (`action & 0x1`): left eye - `0` closed, `1` open
     * - bit 1 (`action & 0x2`): right eye - `0` closed, `1` open
     * - bit 2 (`action & 0x4`): mouth - `0` closed, `1` open
     * Example: `action = 0b011` means left eye open, right eye open, mouth closed.
     */
    readonly action: number;
    /**
     * @readonly
     * @description Ear status. `0` = ears upright; `1` = ears drooping.
     * Only meaningful for `facePetType` values whose anatomy supports it (typically
     * dogs / cats); for the human entry of {@link FacePetType} the value is reported
     * but does not carry a useful interpretation.
     */
    readonly earType: number;
    /**
     * @readonly
     * @description Discrete pet face category for this detection (e.g. cat / dog / human).
     * The set of possible values is defined by {@link FacePetType}; a face is classified
     * into exactly one type per frame based on the native model output.
     */
    readonly facePetType: FacePetType;
    /**
     * @readonly
     * @description Pitch angle in radians. Negative values represent the head tilting up,
     * positive values represent the head tilting down. Typical values stay within
     * roughly `[-pi/2, pi/2]`.
     */
    readonly pitch: number;
    /**
     * @readonly
     * @description Flat `Float32Array` of 2D pet-face landmarks laid out as
     * `[x0, y0, x1, y1, ...]`. The array always contains 90 point slots (180 floats);
     * the number of valid points depends on `facePetType` (cat: 82, dog: 76) and the
     * point order follows the native pet-landmark convention for that type. Coordinates
     * are normalized to the input texture, in the same space as
     * {@link Face106Interface.pointsArray}: `x` is divided by width and `y` is
     * `1 - py / height` (the Y axis points up), both typically in `[0, 1]`.
     */
    readonly pointsArray: Float32Array;
    /**
     * @readonly
     * @description Bounding rectangle of the detected pet face in normalized
     * coordinates `[0.0, 1.0]`, relative to the camera input image, in the same
     * space as {@link Face106Interface.rect}. `x` and `y` are the bottom-left
     * corner; `width` and `height` extend rightward and upward.
     */
    readonly rect: Rect;
    /**
     * @readonly
     * @description Roll angle in radians. Negative values indicate left tilt and
     * positive values indicate right tilt around the forward axis. Runtime verification
     * shows values can span roughly `[-pi, pi]`.
     */
    readonly roll: number;
    /**
     * @readonly
     * @description Confidence score in the range `[0, 1]`. Higher values indicate
     * a more confident detection; consumers typically use a threshold (e.g. `0.5`)
     * to decide whether to consume the result for this frame.
     */
    readonly score: number;
    /**
     * @readonly
     * @description Yaw angle in radians. Negative values indicate the pet face
     * turning right, positive values indicate turning left, with `0` meaning the
     * face is roughly aligned with the camera's forward direction. Typical values
     * stay within roughly `[-pi/2, pi/2]`.
     */
    readonly yaw: number;
  }
  /**
   * @description Represents different types of face pets.
   * @enum
   * @property Cat Represents a cat face pet.
   * @property Dog Represents a dog face pet.
   * @property Human Represents a human face pet.
   * @property Others Represents other types of face pets.
   */
  enum FacePetType {
    Cat,
    Dog,
    Human,
    Others
  }
  /**
   * @class FaceReshapeRenderer
   * @description Represents a face reshape renderer that provides advanced facial reshaping capabilities.
   * It supports precise control over facial features with pre-defined warp configurations,
   * enabling both large-scale adjustments (e.g., face slimming) and fine-grained operations (e.g., eye shape refinement).
   * The renderer supports selecting multiple tracked faces and provides methods to manage feature weights dynamically.
   *
   * ### Usage Examples
   * @example <caption>Feature Weight Control</caption>
   * // Activate specific reshape feature on touch
   * const scene = this.getSceneObject().scene;
   * const sceneObject = scene.findSceneObject('FaceReshape');
   * if (!sceneObject) return;
   * const reshapeRenderer = sceneObject.getComponent('FaceReshapeRenderer') as APJS.FaceReshapeRenderer;
   * const features = reshapeRenderer.getFeatureNames();
   * let currentIndex = 0;
   * function onTouch() {
   *   features.forEach((feature, index) => {
   *     reshapeRenderer.setFeatureWeight(feature, index === currentIndex ? 1.0 : 0);
   *   });
   *   currentIndex = (currentIndex + 1) % features.length;
   * }
   * @extends Renderer
   */
  class FaceReshapeRenderer extends Renderer {
    protected constructor();
    /**
     * @description IDs of faces to apply reshaping to, using one-based face slots
     * in the range `1` to `5`. Default after construction is `[1, 2, 3, 4, 5]`.
     * Setting an empty array `[]` disables reshaping for all faces. If any ID is outside
     * the supported range, the assignment is rejected and the previous selection is preserved.
     * Duplicate IDs are preserved.
     * @type {number[]}
     */
    get faceIDs(): number[];
    set faceIDs(value: number[]);
    /**
     * @description Returns the list of face reshape feature names supported by the
     * currently bound model. The order matches the underlying organ warp configuration
     * and is stable across calls within the same component instance, so callers can use
     * the index returned here directly with {@link getFeatureWeight} / {@link setFeatureWeight}.
     * The returned array is the live internal storage — do not mutate it.
     * @returns {string[]} Array of face reshape feature names
     */
    getFeatureNames(): string[];
    /**
     * @description Gets the weight value of the face reshape feature with the specified name or index.
     * @param feature The face reshape feature, identified either by name (string, must match an entry
     * in {@link getFeatureNames}) or by zero-based index (number) into that array. Unknown names or
     * out-of-range indices return `0`.
     * @returns The current weight value of the face reshape feature, or `0` when the feature does not
     * exist or is not currently bound.
     */
    getFeatureWeight(feature: string | number): number;
    /**
     * @description Sets the weight value of the face reshape feature with the specified name or index.
     * The new weight applies to subsequent frames; no immediate refresh / repaint is needed.
     * @param feature The face reshape feature, identified either by name (string, must match an entry
     * in {@link getFeatureNames}) or by zero-based index (number) into that array. Unknown names or
     * out-of-range indices are silently ignored — the call does nothing and does not throw.
     * @param weight Target weight; clamped to `[0, 1]` (values below `0` are treated as `0`,
     * values above `1` are treated as `1`).
     */
    setFeatureWeight(feature: string | number, weight: number): void;
  }
  /**
   * @class FaceStretchComponent
   * @extends Component
   * @description Applies an authored landmark displacement to a tracked human, cat, or dog face.
   */
  class FaceStretchComponent extends Component {
    protected constructor();
    /**
     * @description The landmark and deformation template selected when the component was created.
     * This value is read-only at runtime.
     * @readonly
     */
    get faceType(): FaceStretchType;
    /**
     * @description Stretch intensity in the supported range [0, 100]. 0 keeps every tracked point
     * at its original position; 100 applies the full authored displacement; intermediate values
     * linearly interpolate between them. Higher values therefore produce stronger deformation.
     * APJS forwards values outside this range without clamping.
     */
    get intensity(): number;
    set intensity(value: number);
    /**
     * @description The 1-based ID of the face to stretch, in the range `1` to `5`.
     */
    get faceID(): number;
    set faceID(value: number);
  }
  /**
   * @description Identifies the landmark topology and authored displacement-point set used by a
   * {@link FaceStretchComponent}. The selected template must match the tracked subject; the public
   * {@link FaceStretchComponent.faceType} property reports the authoring-time choice and is read-only.
   * @enum
   */
  enum FaceStretchType {
    /** Applies the authored human deformation points to the human-face landmark topology. */
    Human,
    /** Applies the authored dog deformation points to the dog-face landmark topology. */
    Dog,
    /** Applies the authored cat deformation points to the cat-face landmark topology. */
    Cat
  }
  /**
   * @interface
   * FaceTeethMaskInterface
   * @description Per-face teeth mask result produced by the native face-warp algorithm.
   * Despite the shared `face_mask` field name (the native layer reuses the same
   * `FaceBaseMask` structure for face / mouth / teeth masks), this interface
   * specifically carries the **teeth** mask channel intended for teeth-targeted
   * effects (whitening, highlights, etc.). Use `FaceFaceMaskInterface` for the
   * whole-face mask and `FaceMouthMaskInterface` for the mouth mask.
   */
  interface FaceTeethMaskInterface {
    /**
     * @readonly
     * @description Each detected face has a unique faceID. When a face that was
     * lost during tracking is detected again, it will have a new faceID.
     */
    readonly ID: number;
    /**
     * @readonly
     * @description Teeth mask data, a contiguous 8-bit single-channel image buffer of size
     * `faceMaskSize x faceMaskSize` whose array length is exactly `faceMaskSize * faceMaskSize`.
     * The buffer is laid out in row-major order (left to right, top to bottom). Each element is in `[0, 255]`,
     * representing the per-pixel teeth-mask intensity from the native model; larger values indicate
     * stronger teeth coverage, with `0` meaning fully outside the mask.
     * The mask is defined in its own warped texture space rather than the input image space.
     */
    readonly faceMask: Uint8Array;
    /**
     * @readonly
     * @description Edge length, in pixels, of the square teeth-mask image. The mask buffer
     * always satisfies `faceMask.length === faceMaskSize * faceMaskSize`. A value of `0`
     * (or any non-positive value) means no teeth mask is available for this frame and
     * downstream rendering / sampling should be skipped.
     */
    readonly faceMaskSize: number;
    /**
     * @description Six row-major affine coefficients mapping input-image pixel
     * coordinates to mask pixel coordinates: u = m[0]*x + m[1]*y + m[2],
     * v = m[3]*x + m[4]*y + m[5]. Use pixels of the algorithm's input image from
     * the same frame, not normalized coordinates or resized preview pixels.
     * Treat this matrix as read-only. Check mask availability and sample only
     * within the square mask's bounds; the following example uses nearest pixels.
     * @example
     * // Call during onUpdate with pixel coordinates in the algorithm's input image.
     * function sampleTeethMaskAtInputPixel(x: number, y: number): number | undefined {
     *   const result = APJS.AlgorithmManager.getResult();
     *   if (result.getFaceCount() === 0) return undefined;
     *   const info = result.getFaceTeethMask(0);
     *   if (!info || info.faceMaskSize <= 0) return undefined;
     *   const size = info.faceMaskSize;
     *   const m = info.warpMatrix;
     *   if (info.faceMask.length !== size * size || m.length !== 6) return undefined;
     *   const u = Math.round(m[0] * x + m[1] * y + m[2]);
     *   const v = Math.round(m[3] * x + m[4] * y + m[5]);
     *   if (!Number.isFinite(u) || !Number.isFinite(v)) return undefined;
     *   if (u < 0 || v < 0 || u >= size || v >= size) return undefined;
     *   return info.faceMask[v * size + u] / 255;
     * }
     */
    readonly warpMatrix: Float32Array;
  }
  /**
   * @description Mipmap filtering mode for a texture.
   * @enum
   */
  enum FilterMipmapMode {
    /** No mipmap filtering. */
    None,
    /** Selects the nearest mipmap level. */
    Nearest,
    /** Selects the two nearest mipmap levels and linearly interpolates between them. */
    Linear
  }
  /**
   * @description Texture filtering mode.
   * @enum
   */
  enum FilterMode {
    /** Point filtering - selects the nearest pixel. */
    Nearest,
    /** Bilinear filtering - interpolates between 4 nearest pixels. */
    Linear
  }
  /**
   * @class FixedJoint
   * @description A 3D fixed joint. Completely locks two RigidBodies together
   * — they maintain fixed relative position and rotation.
   * Internally uses a distance joint + fixed rotation constraint pair.
   * {@link breakingForce} applies to the positional constraint and
   * {@link breakingTorque} applies to the rotation constraint.
   * If either internal constraint breaks, only that constraint stops solving.
   *
   * @example
   * const fixedJoint = obj.getComponent("FixedJoint") as APJS.FixedJoint;
   * fixedJoint.breakingForce = -1; // disable positional break checks
   * fixedJoint.breakingTorque = -1; // disable rotational break checks
   */
  class FixedJoint extends Joint3D {
    protected constructor();
  }
  /**
   * @class FixedJoint2D
   * @description A 2D fixed joint. Completely locks two bodies together — they maintain fixed relative
   * position and rotation. Can optionally break at {@link breakingForce} or {@link breakingTorque}
   * thresholds if {@link breakable} is set.
   * @example
   * // Set a fixed joint between two objects (configured in editor via connectedBody reference)
   * const fixedJoint = obj.getComponent("FixedJoint2D") as APJS.FixedJoint2D;
   * fixedJoint.breakingForce = -1; // disable positional break checks
   * fixedJoint.breakingTorque = -1; // disable rotational break checks
   */
  class FixedJoint2D extends Joint2D {
    protected constructor();
  }
  /**
   * @enum ForceMode2D
   * @description Defines how force is applied to a 2D rigid body.
   *
   * | Mode | What you set | Actual effect | Example (10N on 1kg vs 100kg) |
   * |------|-------------|---------------|-------------------------------|
   * | `Force` | Newtons | a = F/m (mass matters) | 10 vs 0.1 m/s^2 |
   * | `Acceleration` | m/s^2 | a = input (mass ignored) | 10 vs 10 m/s^2 both |
   * | `Impulse` | Newton-seconds | dv = F/m, single frame | 10 vs 0.1 m/s velocity change |
   * | `VelocityChange` | m/s | dv = input, single frame | 10 vs 10 m/s velocity change |
   *
   * @example
   * // Continuous push downward — heavy objects fall slower
   * rigidBody.addForce(new APJS.Vector2f(0, -5), APJS.ForceMode2D.Force);
   * // Instant kick upward — regardless of mass
   * rigidBody.addForce(new APJS.Vector2f(0, 50), APJS.ForceMode2D.VelocityChange);
   */
  enum ForceMode2D {
    /** Continuous force, uses mass (a = F/m). Applied every frame. */
    Force = 0,
    /** Continuous acceleration, ignores mass (a = F). Applied every frame. */
    Acceleration = 1,
    /** Instantaneous impulse, uses mass (dv = F/m). Applied once. */
    Impulse = 2,
    /** Instantaneous velocity change, ignores mass (dv = F). Applied once. */
    VelocityChange = 3
  }
  /**
   * @enum ForceMode3D
   * @description Defines how force is applied to a 3D rigid body.
   *
   * | Mode | What you set | Actual effect | Example (10N on 1kg vs 100kg) |
   * |------|-------------|---------------|-------------------------------|
   * | `Force` | Newtons | a = F/m (mass matters) | 10 vs 0.1 m/s^2 |
   * | `Acceleration` | m/s^2 | a = input (mass ignored) | 10 vs 10 m/s^2 both |
   * | `Impulse` | Newton-seconds | dv = F/m, single frame | 10 vs 0.1 m/s velocity change |
   * | `VelocityChange` | m/s | dv = input, single frame | 10 vs 10 m/s velocity change |
   *
   * @example
   * // Push upward — heavy objects accelerate less
   * rigidBody.addForce(new APJS.Vector3f(0, 50, 0), APJS.ForceMode3D.Force);
   * // Push upward — all objects accelerate the same
   * rigidBody.addForce(new APJS.Vector3f(0, 50, 0), APJS.ForceMode3D.Acceleration);
   * // Instant kick — like an explosion
   * rigidBody.addForce(new APJS.Vector3f(0, 500, 0), APJS.ForceMode3D.Impulse);
   */
  enum ForceMode3D {
    Force = 0,
    Acceleration = 1,
    Impulse = 2,
    VelocityChange = 3
  }
  /**
   * @class GestureInfo
   * @description The gesture info is carried by gesture event, record the info of one gesture.
   * @example
   * const emitter = APJS.EventManager.getGestureEmitter();
   * const callback = (event:APJS.IEvent) => {
   *   const gestureInfo = event.args[0] as APJS.GestureInfo;
   *   const point = gestureInfo.endPoint;
   *   ...
   * }
   * emitter.on(GestureType.LongTap, callback)
   * @extends AObject
   */
  class GestureInfo extends AObject {
    protected constructor();
    /**
     * @readonly
     * @description The gesture type of this gesture.
     */
    get type(): GestureType;
    /**
     * @readonly
     * @description The gesture start position of this gesture. Only valid when gesture type is Drag or Drop. The value is 0 - 1. 0 is the top-left corner of the screen. 1 is the bottom-right corner of the screen. For other gesture types this is not populated and returns `(0, 0)`.
     */
    get startPoint(): Vector2f;
    /**
     * @readonly
     * @description The gesture end position of this gesture. Valid for all gesture types. The value is 0 - 1. 0 is the top-left corner of the screen. 1 is the bottom-right corner of the screen.
     */
    get endPoint(): Vector2f;
    /**
     * @readonly
     * @description Start dragging. When a drag-and-drop action occurs, a series of Drag events will be received. This flag can be used to obtain the event that triggered the drag-and-drop action. Only valid when gesture type is Drag. For other gesture types it is `false`.
     * @example Control the position of an object by drag gesture.
     * const gestureEmitter = APJS.EventManager.getGestureEmitter();
     * const dragCallback = (event:APJS.IEvent) => {
     *   const gestureInfo = event.args[0] as APJS.GestureInfo;
     *   if (gestureInfo.firstTrigger) {
     *     this.currentDragStartPoint = gestureInfo.startPoint;
     *     this.startAnchoredPosition = this.imageTransform.anchoredPosition;
     *   }
     *   const offset = gestureInfo.endPoint.clone().subtract(this.currentDragStartPoint);
     *   this.imageTransform.anchoredPosition = offset.multiply(new APJS.Vector2f(screenResolution.x, -screenResolution.y)).add(this.startAnchoredPosition);
     * }
     * gestureEmitter.on(APJS.GestureType.Drag, dragCallback);
     */
    get firstTrigger(): boolean;
    /**
     * @readonly
     * @description The duration of long-tap gesture. Only valid for LongTap gesture. The value is in milliseconds. For other gesture types it is `0`.
     */
    get duration(): number;
  }
  /**
   * @description GestureType
   * @enum
   * @property Invalid - An invalid / unrecognized gesture.
   * @property Tap - A tap gesture.
   * @property LongTap - A long tap gesture.
   * @property Drag - A drag gesture.
   * @property Drop - A drop gesture.
   */
  enum GestureType {
    Invalid = -1,
    Tap,
    LongTap,
    Drag,
    Drop
  }
  /**
   * @enum GifEvent
   * @description Historical event names for GIF playback. Unlike some newer event enums that use PascalCase members, `GifEvent` keeps its original lowerCamelCase member names for compatibility.
   * @property {number} playBeginEventType
   * @property {number} playEndEventType
   * @property {number} pauseEventType
   * @property {number} resumeEventType
   * @property {number} playKeyFrameEventType
   * @example
   * const imageComponent = this.getSceneObject().getComponent('Image') as APJS.Image;
   * const tex = imageComponent.texture;
   * const emitter = APJS.EventManager.getObjectEmitter(tex);
   * emitter.on(APJS.GifEvent.playEndEventType, this.onPlayEnd, this);
   */
  enum GifEvent {
    playBeginEventType,
    playEndEventType,
    pauseEventType,
    resumeEventType,
    playKeyFrameEventType
  }
  /**
   * @class GifTextureProvider
   * @description GIF texture playback provider. It supports `playFromStart`, `pause`, `resume`, and frame/time seeking, but does not expose the same stop/reset surface as some other animated texture providers.
   */
  class GifTextureProvider extends TextureDelegateProvider {
    /**
     * @description Gets the loop count of the GIF asset.
     * - `-1` (default): play indefinitely; the loop never completes.
     * - `0`: do not animate - the provider stays on frame `0` (special-cased in `onUpdate`).
     * - positive integer `N`: play exactly `N` loops, then stop on the last frame and emit `playEndEventType`.
     * - other negative values: playback is treated as already completed.
     */
    get loopCount(): number;
    /**
     * @description Sets the loop count of the GIF asset.
     * `-1` plays indefinitely, `0` freezes on the first frame during time-based playback updates,
     * positive integers limit the total number of loops, and other negative values are treated as already completed.
     * @param value - The loop count to set.
     */
    set loopCount(value: number);
    /**
     * @description Gets the playback frame rate of the GIF asset, in frames per second.
     * Default is `25`.
     */
    get fps(): number;
    /**
     * @description Sets the playback frame rate of the GIF asset, in frames per second.
     * Invalid values (`<= 0`) are ignored, and assigning the current fps is a no-op.
     * On a successful change, playback state is reset and the loop / frame indices go back to `0`.
     * @param value - The frames per second to set.
     */
    set fps(value: number);
    /**
     * @description Gets the total playback duration of the GIF asset, in **seconds**.
     * This is a derived value computed as `frameCount / fps`; it is not stored independently.
     */
    get duration(): number;
    /**
     * @description Sets the playback duration of the GIF asset, in **seconds**, by adjusting `fps`.
     * The frame count is fixed by the underlying GIF asset and is not changed.
     * Invalid values (`<= 0`) and assigning the current duration are ignored.
     * On a successful change, playback state is reset.
     * @param value - The desired duration, in seconds.
     */
    set duration(value: number);
    /**
     * @description Returns the total frame count of the bound GIF asset.
     */
    getFrameCount(): number;
    /**
     * @description Returns the current playing frame index of the GIF asset.
     * The index is zero-based; valid range is `[0, frameCount - 1]`.
     * - During normal playback (including while paused) returns the integer floor of the
     *   current internal frame index.
     * - After all loops have completed (when `loopCount > 0`), returns `frameCount - 1`
     *   (the last frame), matching what is currently displayed.
     * @returns The current playing frame index of the GIF asset.
     */
    getCurrentPlayingFrame(): number;
    /**
     * @description Plays the GIF asset from the start.
     */
    playFromStart(): void;
    /**
     * @description Pauses playback at the current frame.
     * Repeated calls keep playback paused and still emit the GIF pause event.
     */
    pause(): void;
    /**
     * @description Resumes playback from the current frame.
     * Repeated calls while already playing keep playback running and still emit the GIF resume event.
     */
    resume(): void;
    /**
     * @description Seeks to the specified frame index and applies the resulting frame to the texture.
     * The index is zero-based; valid indices are `[0, frameCount - 1]`. Out-of-range indices are
     * clamped: negative values become `0`, and indices `>= frameCount` become `frameCount - 1`.
     * The provider's current frame index is updated to the clamped value.
     * @param frameIndex - The zero-based frame index to seek to.
     */
    seek(frameIndex: number): void;
  }
  /**
   * @class GSplat
   * @description An opaque 3D Gaussian Splatting dataset containing position, covariance, color,
   * opacity, and optional spherical-harmonic data. Public scripts can assign this resource to a
   * GSplatRenderer but cannot edit its packed records directly.
   */
  class GSplat extends AObject {
    protected constructor();
  }
  /**
   * @class GSplatCollider
   * @description A generated 3D compound collider built from GSplat sample data.
   * Internally it creates multiple sphere colliders, so it behaves like a
   * sampled volume rather than a single primitive shape.
   * Public settings such as {@link isTangible} and {@link interactable}
   * propagate across the generated internal colliders.
   *
   * @example
   * const gsplatCollider = obj.getComponent("GSplatCollider") as APJS.GSplatCollider;
   * gsplatCollider.isTangible = true;
   * gsplatCollider.interactable = false;
   */
  class GSplatCollider extends Collider {
    protected constructor();
    /**
     * @description Gets or sets whether this generated GSplat collider is
     * tangible.
     * When true, its internal sphere colliders participate in normal collision
     * response. When false, they behave like triggers.
     * This setting is applied across the full generated collider set.
     * @type {boolean}
     */
    get isTangible(): boolean;
    set isTangible(value: boolean);
    /**
     * @description Gets or sets whether this generated GSplat collider is
     * interactable through the Physics Interactor path.
     * APJS applies the interaction category bit across the internal collider
     * set. This does not change normal collision behavior.
     * @type {boolean}
     */
    get interactable(): boolean;
    set interactable(value: boolean);
  }
  /**
   * @class GSplatRenderer
   * @description Renders a 3D Gaussian Splatting resource.
   * The built-in GSplat material exposes its tint through the `u_TintColor` color property. Materials
   * returned by {@link Renderer.materials} are shared references, so changing this property affects
   * every renderer that uses the same material. Custom materials are not required to provide it.
   * @example
   * const renderer = sceneObject.getComponent('GSplatRenderer') as APJS.GSplatRenderer;
   * const material = renderer.materials[0];
   * if (material) {
   *   material.setColor('u_TintColor', new APJS.Color(1, 0, 0, 1));
   * }
   */
  class GSplatRenderer extends Renderer {
    protected constructor();
    /**
     * @description The Gaussian Splatting dataset to render, or null when no dataset has been
     * assigned. Assigning another resource replaces the positions, covariance, color, opacity, and
     * optional SH data used by this renderer.
     */
    get gsplat(): GSplat | null;
    /**
     * @description Assigns a Gaussian Splatting dataset to render. A non-null dataset is required.
     * Passing `null` is not supported as a way to clear the assignment: native logs a warning and
     * leaves the current dataset unchanged.
     * @param value - The GSplat dataset to render.
     */
    set gsplat(value: GSplat);
    /**
     * @description Whether to skip depth sorting before rendering. false sorts splats for more correct
     * alpha compositing; true avoids the sorting work but can produce visible ordering and
     * transparency artifacts, especially when splats overlap.
     */
    get disableSort(): boolean;
    set disableSort(value: boolean);
    /**
     * @description Selects covariance-based Gaussian splats or fixed-size screen-space points.
     * pointSize affects only Point mode.
     */
    get renderMode(): GSplatRenderMode;
    set renderMode(value: GSplatRenderMode);
    /**
     * @description Screen-space point size used only in Point mode. The Inspector-supported integer
     * range is [1, 20]; larger values draw larger points. Native rendering floors values below 0.1
     * but APJS otherwise does not clamp the value.
     */
    get pointSize(): number;
    set pointSize(value: number);
    /**
     * @description Controls view-dependent spherical-harmonic color. Enabled sets maximum SH order to
     * 2, Disabled sets it to 0, and SHOnly sets it to 2 while suppressing base RGB. The effective order
     * is also limited by the assigned resource's SH data.
     */
    get shLightingMode(): GSplatSHLightingMode;
    set shLightingMode(value: GSplatSHLightingMode);
  }
  /**
   * @description Selects how each record in a GSplat resource is rasterized. Splat uses the record's
   * projected covariance and opacity for the normal Gaussian appearance; Point is a fixed-size
   * diagnostic or stylized representation controlled by GSplatRenderer.pointSize.
   * @enum
   * @property {number} Splat Draws covariance-oriented screen-space ellipses with Gaussian alpha falloff and source opacity.
   * @property {number} Point Draws fixed-size circular screen-space points, ignores each record's covariance, uses GSplatRenderer.pointSize, and forces the rendered point alpha to 1.
   */
  enum GSplatRenderMode {
    Splat,
    Point,
  }
  /**
   * @description Controls whether view-dependent spherical-harmonic (SH) color contributes to a
   * {@link GSplatRenderer}. This convenience enum maps to the renderer's internal maximum SH order and
   * base-color multiplier; the effective SH order cannot exceed the data stored in the assigned
   * {@link GSplat} resource.
   * @enum
   */
  enum GSplatSHLightingMode {
    /**
     * Renders base color plus view-dependent SH color, requests maximum SH order 2, and falls back to
     * the highest order available in the resource.
     */
    Enabled = 0,
    /** Sets maximum SH order to 0, rendering only the resource's view-independent base color. */
    Disabled = 1,
    /**
     * Suppresses base RGB and requests only view-dependent SH color up to order 2. A resource without
     * SH coefficients therefore contributes no directional RGB color in this mode.
     */
    SHOnly = 2
  }
  /** @description 2D hand result sharing the existing HandInfo contract. */
  type Hand2DInfo = HandInfo;
  /**
   * @description HAvatar hand tracking result, independent of Hand2DInfo.
   * Its result index, count and ID must not be used to match the independent 2D tracker.
   * Obtain this with AlgorithmResult.getHand3DInfo and check for null. Reacquire
   * the result each frame and treat its points as read-only. Indices can change
   * across frames; use ID only to associate observations within this tracker.
   */
  interface Hand3DInfo {
    /** @description Tracking ID within the HAvatar tracker across frames. */
    readonly ID: number;
    /**
     * @description 21 camera-space points in meters. The origin is the camera optical
     * center; X points right, Y up, Z backward. No scene/world transform is applied.
     * 0 Wrist; 1-4 Thumb CMC/MCP/IP/Tip; 5-8 Index MCP/PIP/DIP/Tip;
     * 9-12 Middle MCP/PIP/DIP/Tip; 13-16 Ring MCP/PIP/DIP/Tip;
     * 17-20 Little MCP/PIP/DIP/Tip. CMC means carpometacarpal, MCP metacarpophalangeal,
     * IP interphalangeal, PIP proximal interphalangeal, DIP distal interphalangeal.
     * The HAvatar root translation refers to point 9; point 0 remains the wrist.
     * There is no palm-center point 21 and no per-point validity output.
     * Absolute positions are not guaranteed comparable across devices.
     * Source: https://bytedance.larkoffice.com/docx/XOksdh3Dno50hwxwgaicOynnnle.
     */
    readonly landmarks: Vector3f[];
    /**
     * @description Reads HAvatar's handedness classification for this observation.
     * It is independent of the classification returned by the 2D hand tracker.
     * @returns 'leftHand' or 'rightHand'.
     */
    getHandType(): string;
  }
  /**
   * @description Camera binding passed to AlgorithmParams.setHand3DParam for
   * subsequent 3D hand inference. Assign a scene Camera in the script's Inspector
   * before starting preview. The binding reads the camera's FOV, not its transform.
   * @see AlgorithmParams.setHand3DParam
   */
  interface Hand3DParam {
    /**
     * @description Perspective camera whose vertical field of view is synchronized
     * with 3D hand inference each frame. Its fov is measured in degrees and must
     * be finite, greater than 0 and less than 180. Changes to this camera's fov
     * are followed automatically; call setHand3DParam again to bind another camera.
     */
    camera: Camera;
  }
  /**
   * @description Hand gesture classifications returned by {@link HandInfo.action}.
   * The descriptions match the gesture names shown by the Gesture Detection visual scripting node.
   * @enum
   * @property Three Backhand 3-Finger Pointing Up.
   * @property Four 4-Finger Pointing Up.
   * @property Fist Fist.
   * @property HandOpen Open Palm.
   * @property Rock "I Love You" gesture.
   * @property Rock2 Horns.
   * @property IndexFingerUp Index Pointing Up.
   * @property Victory Victory.
   * @property ThumbUp Thumb Up.
   * @property HeartA Hand Heart (Thumb Up).
   * @property HeartB Hand Heart (Thumb Down).
   * @property HeartC Open Fist Heart.
   * @property HeartD Finger Heart.
   * @property Pistol Index Pointing.
   * @property Pistol2 2-Finger Pointing.
   * @property Swear 3-Finger Pointing Up.
   * @property OK "OK" gesture.
   * @property Phonecall "Call Me" gesture.
   * @property BigV V (Thumb and Index).
   * @property Namaste Touching Palms.
   * @property Beg Kung Fu Salute (Fist Uncovered).
   * @property Pray "Pray" gesture.
   * @property PlamUp Palm Up. The API member intentionally uses the legacy spelling `PlamUp`.
   * @property Thanks Kung Fu Salute (Fist Covered).
   * @property Holdface Wrist V.
   * @property Salute Salute.
   * @property Spread Palm To Front.
   * @property Cabbage Pinched Fingers.
   * @property ThumbDown Thumb Down.
   * @property DoubleFingerUp Index and Middle Pointing Up.
   * @property Unknown The hand is tracked, but its gesture is not one of the recognized actions.
   * @property Undetect No hand action can be classified.
   */
  enum HandAction {
    Beg,
    BigV,
    Cabbage,
    DoubleFingerUp,
    Fist,
    Four,
    HandOpen,
    HeartA,
    HeartB,
    HeartC,
    HeartD,
    Holdface,
    IndexFingerUp,
    Namaste,
    OK,
    Phonecall,
    Pistol,
    Pistol2,
    PlamUp,
    Pray,
    Rock,
    Rock2,
    Salute,
    Spread,
    Swear,
    Thanks,
    Three,
    ThumbDown,
    ThumbUp,
    Unknown,
    Undetect,
    Victory
  }
  /**
   * @interface
   * @description Snapshot of a single detected hand. Exposes the tracking `ID`,
   * the discrete current gesture `action`, the bounding `rect`, the in-plane
   * `rotation` value forwarded from the native hand SDK, and a helper
   * {@link Hand2DInfo.getHandType} for left / right classification.
   *
   * `action` (gesture) and `getHandType()` (left / right) are independent dimensions of
   * the same hand and can be combined freely - reading one does not affect the other.
   * All numeric properties are read-only snapshots valid only for the producing frame.
   * @deprecated Use Hand2DInfo.
   */
  interface HandInfo {
    /**
     * @readonly
     * @description Tracking ID assigned to the detected hand. Default value before any detection
     * is `-1`. The native side does not guarantee a particular numeric range or upper bound;
     * treat the value as an opaque identifier and only compare for equality.
     * @type {number}
     */
    readonly ID: number;
    /**
     * @readonly
     * @description The discrete gesture this hand is currently making, expressed as a
     * {@link HandAction} enum value (e.g. fist, palm, pointing). This is the gesture /
     * action dimension of the hand and is independent of the left / right classification
     * returned by {@link Hand2DInfo.getHandType}: a single hand always has both an `action`
     * and a hand type, and the two should be read separately.
     * @type {HandAction}
     */
    readonly action: HandAction;
    /**
     * @readonly
     * @description Normalized 2D landmarks for this hand. Each item is a
     * `Vector2f` in tracker index order, with `x` and `y` expressed in normalized
     * image coordinates. The array is a snapshot of the current frame.
     *
     * Landmark indices:
     * - `0`: wrist
     * - `1`-`4`: thumb CMC, MCP, IP, tip
     * - `5`-`8`: index finger MCP, PIP, DIP, tip
     * - `9`-`12`: middle finger MCP, PIP, DIP, tip
     * - `13`-`16`: ring finger MCP, PIP, DIP, tip
     * - `17`-`20`: little finger MCP, PIP, DIP, tip
     * - `21`: palm center
     *
     * @example
     * ```ts
     * const result = APJS.AlgorithmManager.getResult();
     * const hand = result.getHand2DInfo(0);
     * if (hand) {
     *   const indexFingerTip = hand.landmarks[8];
     *   console.log(indexFingerTip.x, indexFingerTip.y);
     * }
     * ```
     * @type {Vector2f[]}
     */
    readonly landmarks: Vector2f[];
    /**
     * @readonly
     * @description Bounding rectangle of the detected hand in normalized coordinates `[0.0, 1.0]`,
     * relative to the input image. `x` and `y` are the bottom-left corner; `width` extends rightward
     * and `height` extends upward in the same Y-up normalized space used by other hand fields.
     * @type {Rect}
     */
    readonly rect: Rect;
    /**
     * @readonly
     * @description Hand rotation angle (`rot_angle`) reported by the native hand-tracking model.
     * Runtime verification shows this value is expressed in degrees and typically falls within
     * `[-180, 180]`. Default value before any detection is `0`.
     * @type {number}
     */
    readonly rotation: number;
    /**
     * @description getHandType
     * @returns {string}
     */
    getHandType(): string;
  }
  /**
   * @description Current-frame grayscale mask for one hand, using the hand
   * segmentation image's layout. Obtain this with AlgorithmResult.getHandMask
   * and check for null. Width and height are positive, and the buffer length is
   * width * height. Sample integer pixel coordinates with mask[y * width + x],
   * where 0 <= x < width and 0 <= y < height. Dimensions can vary; do not substitute
   * the preview's dimensions. Treat the buffer as read-only and reacquire it each
   * frame, or copy it with new Uint8Array(mask) to retain the producing frame.
   */
  interface HandMaskInterface {
    /** @description Row-major grayscale bytes, 0-255, with width * height elements. */
    readonly mask: Uint8Array;
    /** @description Actual mask width in pixels. */
    readonly width: number;
    /** @description Actual mask height in pixels. */
    readonly height: number;
  }
  /**
   * @namespace
   * HapticsModule
   * @description Provides haptic feedback related functionality
   */
  namespace HapticsModule {
    /**
     * Triggers device vibration
     * @param duration Vibration duration in milliseconds, range 10-200, default 30
     * @param strength Vibration strength (0-1), default 0.7
     * @param frequency Vibration frequency (0-1), default 0.5
     */
    function triggerVibration(duration?: number, strength?: number, frequency?: number): void;
  }
  /**
   * @class HingeJoint
   * @description A 3D hinge joint. Allows two RigidBody objects to rotate
   * relative to each other around a single axis (specified by {@link axis}).
   * Optionally limited by {@link minAngle}/{@link maxAngle} when
   * {@link useLimits} is enabled.
   * Internally uses a distance constraint + angular hinge constraint pair.
   * {@link breakingForce} applies to the positional constraint and
   * {@link breakingTorque} applies to the angular hinge constraint.
   * If either internal constraint breaks, only that constraint stops solving.
   *
   * @example
   * const hingeJoint = obj.getComponent("HingeJoint") as APJS.HingeJoint;
   * hingeJoint.breakingForce = -1; // disable positional break checks
   * hingeJoint.breakingTorque = -1; // disable angular break checks
   * hingeJoint.useLimits = true;
   * hingeJoint.minAngle = 0;
   * hingeJoint.maxAngle = 90; // allow two bodies to rotate up to 90 degrees
   */
  class HingeJoint extends Joint3D {
    protected constructor();
    /**
     * @description Enables or disables hinge angle limits.
     * When false, the hinge falls back to the full engine-supported range instead of using {@link minAngle} and {@link maxAngle}.
     * @type {boolean}
     */
    get useLimits(): boolean;
    set useLimits(value: boolean);
    /**
     * @description Minimum allowed relative rotation around the hinge axis, in degrees.
     * This limit is measured between the two connected bodies and is used only when {@link useLimits} is enabled.
     * Expected range is `[-180, 180]` and should not exceed {@link maxAngle}. Defaults to -180.
     * @type {number}
     */
    get minAngle(): number;
    set minAngle(value: number);
    /**
     * @description Maximum allowed relative rotation around the hinge axis, in degrees.
     * This limit is measured between the two connected bodies and is used only when {@link useLimits} is enabled.
     * Expected range is `[-180, 180]` and should not be less than {@link minAngle}. Defaults to 180.
     * @type {number}
     */
    get maxAngle(): number;
    set maxAngle(value: number);
  }
  /**
   * @class HingeJoint2D
   * @description A 2D hinge joint. Allows two bodies to rotate relative to each other around a single axis (like a door hinge).
   * Optionally constrained by {@link minAngle} and {@link maxAngle} when {@link useLimits} is enabled.
   * @example
   * // Set a hinge between two objects (configured in editor via connectedBody reference)
   * const hingeJoint = obj.getComponent("HingeJoint2D") as APJS.HingeJoint2D;
   * hingeJoint.useLimits = true;
   * hingeJoint.minAngle = -45;
   * hingeJoint.maxAngle = 45;
   */
  class HingeJoint2D extends Joint2D {
    protected constructor();
    /**
     * @description Enables or disables relative angle limits for this 2D hinge.
     * When enabled, {@link minAngle} and {@link maxAngle} constrain the relative rotation between the two connected bodies.
     * @type {boolean}
     */
    get useLimits(): boolean;
    set useLimits(value: boolean);
    /**
     * @description Maximum allowed relative hinge angle in degrees.
     * This limit applies to the relative rotation between the two connected bodies and is used only when {@link useLimits} is enabled.
     * @type {number}
     */
    get maxAngle(): number;
    set maxAngle(value: number);
    /**
     * @description Minimum allowed relative hinge angle in degrees.
     * This limit applies to the relative rotation between the two connected bodies and is used only when {@link useLimits} is enabled.
     * @type {number}
     */
    get minAngle(): number;
    set minAngle(value: number);
  }
  /**
   * @description Defines local horizontal alignment types for text typesetting, which refers to the horizontal alignment relative to the writing direction. Specifically, when the text is written horizontally, this alignment corresponds to the visually horizontal direction. Conversely, in vertical writing mode, this alignment translates to the visually vertical direction.
   * @enum
   */
  enum HorizontalAlignment {
    /** Align to left edge. */
    Left,
    /** Center horizontally. */
    Center,
    /** Align to right edge. */
    Right,
    /** Justifies text to fill the container width. */
    Flush
  }
  /**
   * @interface IAudioComponent
   * @description The interface for audio component to get the audio clip player.
   */
  interface IAudioComponent {
  }
  /**
   * @interface IAudioDetector
   * @description Common control surface implemented by every audio detector
   * (e.g. {@link BaseAudioDetector} subclasses such as the sound-event detector).
   * Currently exposes a single `enabled` switch that gates whether the detector
   * actively produces detection results; when `enabled = false` the detector's
   * result accessors return their no-result values instead of live data.
   * Additional control surface beyond `enabled` is exposed by the concrete
   * detector classes, not by this interface.
   */
  interface IAudioDetector {
    /**
     * @description Whether the detector is enabled.
     * Default for built-in detectors is `true`. Setting `false` immediately
     * suspends detection: subsequent reads of detector-specific result APIs
     * return their no-result values until `enabled` is set back to `true`.
     */
    enabled: boolean;
  }
  /**
   * @interface
   * @description Represents an event dispatched through the event system.
   * @example
   *  const emitter = APJS.EventManager.getGlobalEmitter();
   *  emitter.on(APJS.EventType.Touch, (event: APJS.IEvent) => {
   *    const touch = event.args[0] as APJS.TouchData;
   *    console.log(event.type, touch.phase);
   *  });
   */
  interface IEvent {
    /**
     * @description The numeric event type.
     * Valid values include:
     * - {@link EventType}, which identifies built-in global events such as touch
     *   and record callbacks;
     * - {@link SceneEventType}, which identifies built-in scene lifecycle events
     *   such as `OnStart`, `OnUpdate`, and `OnLateUpdate`;
     * - {@link GifEvent}, which identifies GIF playback events emitted by
     *   `GifTextureProvider`; and
     * - {@link UserEventType} values returned by `EventManager.defineUserEventType`,
     *   which identify custom user-defined events.
     */
    get type(): number | UserEventType;
    /**
     * @description Sets the numeric event type.
     * Valid values include:
     * - {@link EventType}, which identifies built-in global events such as touch
     *   and record callbacks;
     * - {@link SceneEventType}, which identifies built-in scene lifecycle events
     *   such as `OnStart`, `OnUpdate`, and `OnLateUpdate`;
     * - {@link GifEvent}, which identifies GIF playback events emitted by
     *   `GifTextureProvider`; and
     * - {@link UserEventType} values returned by `EventManager.defineUserEventType`,
     *   which identify custom user-defined events.
     */
    set type(value: number | UserEventType);
    /**
     * @description Arguments passed with the event.
     * The payload shape depends on {@link type}. Common values include
     * `[TouchData]` for `EventType.Touch`, `[IPinchInfo]` for pinch events,
     * `[CollisionInfo[]]` or `[CollisionInfo2D[]]` for collision events, and
     * `[{ eventType, eventName, prevFrameIndex, curFrameIndex, gifTexture }]`
     * for {@link GifEvent}. These are common examples, not a complete list; user
     * code may also emit arbitrary payloads through `EventManager.createEvent`.
     */
    get args(): any[];
    /**
     * @description Replaces the event payload.
     * Arrays are shallow-copied with `Array.from` before storage. For compatibility, runtime code
     * also accepts `undefined` and normalizes it to `[]`.
     * @param args - The arguments to be set for the event.
     */
    set args(args: any[]);
  }
  /**
   * @interface
   * @description Provides an interface for emitting and listening to events.
   */
  interface IEventEmitter {
    /**
     * @description Registers an event listener for a specified event type.
     * A registration is identified by the `(eventType, callback, context)` triple.
     * Registering the same triple again is ignored (no duplicate listeners are added),
     * so a callback fires at most once per emit. Use a different `callback` or `context`
     * to register a distinct listener.
     * @param eventType - The type of event to listen for.
     * @param callback - The callback function to be invoked when the event is triggered.
     * @param context - The execution context for the callback function.
     * @example
     * ```ts
     * emitter.on(myEventType, this.onMyEventType, this);
     * ```
     */
    on(eventType: number | UserEventType, callback: (event: IEvent) => void, context?: object): void;
    /**
     * @description Registers a one-time event listener for a specified event type.
     * The listener fires at most once: it is automatically removed before the
     * callback is invoked, so a callback that re-emits the same event will not
     * re-enter itself. Matching rules are identical to {@link IEventEmitter.on}
     * (the `(eventType, callback, context)` triple).
     * @param eventType - The type of event to listen for.
     * @param callback - The callback function to be invoked when the event is triggered.
     * @param context - The execution context for the callback function.
     * @example
     * ```ts
     * emitter.once(myEventType, this.onMyEventType, this);
     * ```
     */
    once(eventType: number | UserEventType, callback: (event: IEvent) => void, context?: object): void;
    /**
     * @description Unregisters an event listener for a specified event type.
     * Removes the registration matching the exact `(eventType, callback, context)`
     * triple previously passed to {@link IEventEmitter.on} or
     * {@link IEventEmitter.once}. If no such registration exists this is a no-op
     * (no throw). Only one matching registration is removed per call.
     * @param eventType - The type of event to unregister.
     * @param callback - The callback function that was previously registered.
     * @param context - The execution context that was used when registering the callback.
     * @example
     * ```ts
     * emitter.off(myEventType, this.onMyEventType, this);
     * ```
     */
    off(eventType: number | UserEventType, callback: (event: IEvent) => void, context?: object): void;
    /**
     * Emits a specified event.
     * Dispatch is synchronous: every matching listener (registered via
     * {@link IEventEmitter.on} or {@link IEventEmitter.once}) is invoked in
     * registration order before this call returns. Listeners registered via
     * `once` are removed before being invoked. The method returns `void` and
     * does not surface listener exceptions to the caller. The event payload
     * shape is determined by the event type; see {@link IEvent} for the
     * `type -> args` mapping.
     * @param event - The event object to be emitted.
     * @example
     * ```ts
     * emitter.emit(APJS.EventManager.createEvent(MY_EVENT_TYPE));
     * ```
     */
    emit(event: IEvent): void;
  }
  /**
   * @class Image
   * @description A component for rendering images.
   * It can be used to display textures on the screen.
   * By modifying properties such as texture and opacity, you can customize the image appearance.
   * By using setMaterialProperty, you can implement effects such as progress bars, timer bars, and water levels.
   */
  class Image extends Renderer {
    protected constructor();
    /**
     * @description Gets the texture currently bound to this Image.
     * Returns the currently bound texture, or `null` when no texture is bound.
     */
    get texture(): Texture;
    /**
     * @description Sets the texture bound to this Image.
     * At runtime, assigning `null` or `undefined` clears the current texture binding.
     */
    set texture(value: Texture);
    /**
     * @description The opacity of the image.
     * Default: 1, range: [0, 1]
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * @description The base color (tint) applied to the rendered image.
     * RGBA channels are each in the range `[0, 1]`; values are forwarded to the
     * native renderer as-is (out-of-range values are passed through and may be
     * clamped by the underlying material/shader).
     * The alpha channel multiplies with {@link opacity} to produce the final
     * fragment alpha; setting `color.a` to `0` makes the image fully transparent
     * regardless of {@link opacity}.
     */
    get color(): Color;
    set color(value: Color);
    /**
     * @description The size of the image rect in scene/world units. `x` is the width and `y` is the height.
     * The default value is `(2, 2)`. Negative width or height values are clamped to `0`.
     *
     * How `size` works with `stretchMode`:
     * - `Fill`: stretches the texture to the `size` rect.
     * - `Fit`: scales the texture to fit inside the `size` rect while keeping its aspect ratio.
     * - `Crop`: scales the texture to cover the `size` rect while keeping its aspect ratio.
     * - Tiled / nine-slice modes: use `size` as the laid-out region.
     */
    get size(): Vector2f;
    set size(value: Vector2f);
    /**
     * @description The pivot point of the Image, expressed in normalized image-rect coordinates.
     * Default `(0.5, 0.5)` (center). `(0, 0)` is the bottom-left corner of the
     * image rect and `(1, 1)` is the top-right corner. Values outside `[0, 1]`
     * are still passed through and place the pivot outside the image rect.
     */
    get pivot(): Vector2f;
    /**
     * @description Sets the pivot point of the Image, expressed in normalized image-rect coordinates.
     * Default `(0.5, 0.5)` (center). `(0, 0)` is the bottom-left corner of the
     * image rect and `(1, 1)` is the top-right corner. Values outside `[0, 1]`
     * are still passed through and place the pivot outside the image rect.
     * @param value - The pivot point to assign.
     */
    set pivot(value: Vector2f);
    /**
     * @description Whether the image is mirrored along its horizontal axis.
     * Default `false`. Flipping is purely a render-time effect: it does not
     * change {@link size}, {@link pivot}, or the `Vector3f` returned by
     * {@link getWorldCorners} / {@link getContentWorldCorners}.
     */
    get flipX(): boolean;
    set flipX(value: boolean);
    /**
     * @description Whether the image is mirrored along its vertical axis.
     * Default `false`. Flipping is purely a render-time effect: it does not
     * change {@link size}, {@link pivot}, or the `Vector3f` returned by
     * {@link getWorldCorners} / {@link getContentWorldCorners}.
     */
    get flipY(): boolean;
    set flipY(value: boolean);
    /**
     * @description Determines how the texture is laid out inside the {@link size} rect.
     * Supported values are `Fit`, `FitWidth`, `FitHeight`, `Stretch`, `Fill`, `FillAndCut`,
     * and `TextureSize`. For Image, setting `TextureSize` falls back to `Fill`.
     */
    get stretchMode(): StretchMode;
    set stretchMode(value: StretchMode);
    /**
     * @description Gets the current Image material property value for the specified key.
     * Reads the current value stored in this Image's material property map for the exact `key` string.
     * For general material properties, keys commonly come from properties exposed by the Image's current material.
     * Built-in Filled-mode keys such as `_filledType`, `_startPoint`, and `_filledRange` are also supported when the Image DrawMode is configured as Filled in the editor.
     * @param key - The material property key to read.
     * @returns The current stored value for `key`, or the engine's empty result if no value is found.
     */
    getMaterialProperty(key: string): number | Vector2f | Vector3f | Vector4f | Texture | Matrix4x4f;
    /**
     * @description Dynamically sets a material property for the current Image at runtime.
     * For an Image configured with Filled DrawMode, use this API to update `_startPoint` and
     * `_filledRange` at runtime, thereby controlling the portion of the image that is displayed.
     * Stores the exact `key` and `value` pair in this Image's material property map.
     * For general material properties, keys typically come from properties exposed by the Image's current material.
     * This APJS layer does not validate the key name before storing it.
     * Commonly used to implement material property-driven UI effects such as health bars, progress bars,
     * timer bars, water levels, pole growth, and image slicing effects.
     *
     * Note: Image DrawMode cannot be changed via script API. You must configure
     * the Image DrawMode (for example, switch to "Filled") in the editor first.
     *
     * When the Image DrawMode is set to "Filled", this API also supports these
     * built-in fill keys:
     *
     * 1. Fill type: key = "_filledType", number
     *    - 0: Horizontal fill, the visible area grows from left to right.
     *    - 1: Vertical fill, the visible area grows from top to bottom.
     *      This describes the visual fill direction only; it does not redefine the screen coordinate origin used by other APIs.
     *
     * 2. Fill start point: key = "_startPoint", number, in the range [0, 1]
     *    - For horizontal fill: the start position from left to right.
     *    - For vertical fill: the start position from top to bottom.
     *      For example: 0 means start from the very left/top, 0.5 means start from the center.
     *
     * 3. Fill range (progress): key = "_filledRange", number, in the range [0, 1]
     *    - Represents the current fill percentage: 0 is 0%, 1 is 100%.
     *
     * Setting one of these keys only affects rendering when the current Image setup actually consumes that key,
     * for example through the configured material or Filled draw mode.
     *
     * Example:
     * ```ts
     * // Horizontal fill, starting from the left, currently filled to 50%
     * image.setMaterialProperty("_filledType", 0);
     * image.setMaterialProperty("_startPoint", 0.0);
     * image.setMaterialProperty("_filledRange", 0.5);
     * ```
     * @param key - The material property key to write.
     * @param arg1 - The value to set.
     */
    setMaterialProperty(key: string, arg1: number | Vector2f | Vector3f | Vector4f | Texture | Matrix4x4f): void;
  }
  /**
   * @description Current-frame image classification candidates that reach their
   * individual thresholds, ordered by confidence descending. Multiple labels may
   * match; an available result with no matches has count 0.
   * Obtain this with AlgorithmResult.getImageClassificationInfo and check for
   * null before reading count. Iterate with 0 <= index < count; both accessors
   * refer to the same candidate at that index. Reacquire the result each frame:
   * the candidate order and count can change. Indices are not model class IDs,
   * and getConfidence values from a multi-label model need not sum to 1.
   * Public labels use PascalCase. Leading numeric category IDs and the C300
   * suffixes _c2 / _c1_c2 are removed; words are joined with an uppercase initial
   * letter and no underscores. Other spelling is preserved.
   * For example, 2252_alone becomes Alone, Cherry_blossoms becomes CherryBlossoms,
   * and KingPenguin_c2 becomes KingPenguin. Duplicate labels do not merge candidates.
   * The fixed C300 model can return the following public labels:
   * Shoes; Sunglasses; Dress; Miniskirt; Kimono;
   * Uniforms; HanfuPhoto; Underwear; Swimsuit; WeddingDress;
   * EthnicCustoms; Cheongsam; PhysicalEducation; Yoga; LuYing;
   * Ski; Mountaineering; Swimming; PaoBu; Dancer;
   * Halloween; Christmas; Party; Birthday; Jiehunzhao;
   * NewYear; Graduation; MilitaryTraining; Concert; Cosplay;
   * Shopping; Reading; HoldingHands; Performance; CardGame;
   * Shineijiudianjucan; Selfie; FamilyPhotography; QinZiSheYing; Group;
   * Yinger; Ertong; OldMan; Crowd; Two;
   * Alone; Student; PregnantWoman; Desert; Hill;
   * MountainSnowy; Cave; MoutainPath; TerracedField; FormalGarden;
   * Farm; Lawn; Jungle; FlowerSea; Islet;
   * Underwater; Lake; Ocean; Pond; WaterDroplets;
   * Creek; Waterfall; Reef; Beach; Sky;
   * Galaxy; Lightning; Sunset; Rainbow; CloudSea;
   * BlueSkyAndWhiteClouds; DarkClouds; Moon; Nightscape; Fireworks;
   * Bonfire; Neon; RainyDay; Xuejing; Fog;
   * Flower; Tree; Tulip; Sunflower; Cactus;
   * Lotus; CherryBlossoms; Rose; Lavender; Dandelion;
   * Ginkgo; Reed; DuoRouZhiWu; RapeFlower; PottedPlant;
   * MapleLeaf; Mianshi; Zhongcan; Hotpot; AmericalFastFood;
   * HaiXian; Grill; Sushi; ShaLa; Snacks;
   * Dessert; Cake; Fruit; Drink; BreadNew;
   * Bookstore; Restaurant; Hospital; Bar; TheMall;
   * School; Shiwaiyoulechagn; Carrousel; Park; Site;
   * FerrisWheel; Fountain; Cbd; Street; FoodCourt;
   * InteriorDesign; AmusementArcade; Ktv; MovieTheater; Playground;
   * SoccerField; BadmintonIndoor; Snooker; GolfCourse; Baseball;
   * BasketballCourtIndoor; TennisOutdoor; Swimming; Gymnasimum; Ruin;
   * RoyalPalace; Tower; Stele; Gujianzhu; Castle;
   * WesternArch; Statue; Xiangcunjianzhu; Bicycle; Motorcycle;
   * TrafficFlow; Car; Bus; Aircraft; Ship;
   * Subway; SubwayPlatform; GaoTie; LightRail; TrainStation;
   * Bridge; ZhanDao; Road; Doll; SrCamera;
   * Guitar; Book; Crafts; Screen; Tv;
   * Mobilephone; PcGame; Anime; ScrawlMark; Calligraphy;
   * Sketch; Bankcard; CardData; Qrcode; Text;
   * Puzzle; SolidcolorBg; Jellyfish; Goldfish; Tortoise;
   * KingPenguin; Bird; Peacock; Cat; Dog;
   * Monkey; Deer; Panda; Sheep; Camel;
   * Horse; Cattle; Tiger; Giraffe; Hamster;
   * Elepant; Pig; Rabbit;
   */
  interface ImageClassificationInfo {
    /**
     * @description Number of candidates reaching their individual model thresholds
     * in this frame. A value of 0 means the available output has no matching labels.
     */
    readonly count: number;
    /**
     * @description Reads the label of a candidate in the current filtered list.
     * Labels use PascalCase without numeric category prefixes or C300 suffixes; see
     * ImageClassificationInfo for the complete public label list.
     * @param index - Zero-based integer in [0, count), in descending confidence order.
     * @returns The public label paired with getConfidence(index).
     * @throws RangeError for a non-integer, negative or out-of-range index.
     * @see AlgorithmResult.getImageClassificationInfo
     */
    getLabel(index: number): string;
    /**
     * @description Reads the confidence of a candidate that passed its model threshold.
     * Scores are forwarded from the model without normalizing across candidates.
     * @param index - Zero-based integer in [0, count), in descending confidence order.
     * @returns The score paired with getLabel(index). Candidate 0 has the highest score.
     * @throws RangeError for a non-integer, negative or out-of-range index.
     * @see AlgorithmResult.getImageClassificationInfo
     */
    getConfidence(index: number): number;
  }
  /**
   * @description Pinch event information.
   * @interface
   */
  interface IPinchInfo {
    /**
     * Scale ratio relative to the initial two-pointer distance.
     * `1` = unchanged, `> 1` = fingers moved apart, `< 1` = fingers moved closer.
     * Range: `[0, +∞)`. Returns `1` when the initial distance is zero.
     */
    scale: number;
    /**
     * Signed rotation in radians between the current and initial two-pointer direction.
     * Positive = counter-clockwise, negative = clockwise. Range: `(-π, π]`.
     */
    angle: number;
  }
  /**
   * @class Joint2D
   * @description Base class for all 2D joints. A joint connects two RigidBody2D objects together,
   * constraining their relative motion.
   *
   * Subclasses: {@link FixedJoint2D}, {@link HingeJoint2D}, {@link SpringJoint2D}, {@link DistanceJoint2D}.
   *
   * **Record/Reset:** Joints are reactivated during record start. Configuration properties (anchor, breaking force, limits) are preserved.
   *
   * @example
   * // Set a hinge between two objects (configured in editor via connectedBody reference)
   * const hingeJoint = obj.getComponent("HingeJoint2D") as APJS.HingeJoint2D;
   * hingeJoint.useLimits = true;
   * hingeJoint.minAngle = -45;
   * hingeJoint.maxAngle = 45;
   */
  class Joint2D extends DynamicComponent {
    protected constructor();
    /**
     * @description Local anchor point on this body.
     * The value is authored in this joint's own local 2D space, not world space.
     * Default: `(0, 0)`. Changing it after the joint is initialized rebuilds the
     * joint so the new anchor takes effect immediately.
     * @type {Vector2f}
     */
    get anchor(): Vector2f;
    set anchor(value: Vector2f);
    /**
     * @description Local anchor point on the connected body.
     * The value is authored in the connected body's local 2D space, not world space.
     * Default: `(0, 0)`. Changing it after the joint is initialized rebuilds the
     * joint so the new anchor takes effect immediately.
     * @type {Vector2f}
     */
    get connectedAnchor(): Vector2f;
    set connectedAnchor(value: Vector2f);
    /**
     * @description Enables or disables break thresholds for this joint. Defaults to false.
     * When false, {@link breakingForce} and {@link breakingTorque} are ignored.
     * @type {boolean}
     */
    get breakable(): boolean;
    set breakable(value: boolean);
    /**
     * @description Force threshold that breaks this joint, in 2D physics force units.
     * This is a break limit, not a force actively applied by the joint, and it is used only when {@link breakable} is true.
     * It is compared against the joint's reaction force each step; the joint breaks once that force reaches the threshold.
     * A negative value disables the force break check. Defaults to 9999.
     * @type {number}
     */
    get breakingForce(): number;
    set breakingForce(value: number);
    /**
     * @description Torque threshold that breaks this joint, in 2D physics torque units.
     * This is a break limit, not a torque actively applied by the joint, and it is used only when {@link breakable} is true.
     * It is compared against the joint's reaction torque each step; the joint breaks once that torque reaches the threshold.
     * A negative value disables the torque break check. Defaults to 9999.
     * @type {number}
     */
    get breakingTorque(): number;
    set breakingTorque(value: number);
  }
  /**
   * @class Joint3D
   * @description Base class for all 3D joints. A joint connects two RigidBody objects together,
   * constraining their relative motion.
   *
   * Subclasses: {@link FixedJoint}, {@link HingeJoint}, {@link SpringJoint}, {@link PointJoint}.
   *
   * @example
   * const fixedJoint = obj.getComponent("FixedJoint") as APJS.FixedJoint;
   * fixedJoint.breakingForce = -1; // disable positional break checks
   */
  class Joint3D extends DynamicComponent {
    protected constructor();
    /**
     * @description Force threshold that breaks this 3D joint.
     * This is a break limit, not a force actively applied by the joint.
     * A value of -1 disables break checks for this constraint.
     * When a joint breaks, only the native constraint stops solving.
     * The connected RigidBodies keep their current motion and can still be
     * affected by gravity, external forces, collisions, and any other joints
     * that remain active.
     * For compound joints such as {@link FixedJoint} and {@link HingeJoint},
     * this force limit applies only to the positional constraint part.
     * The angular part has its own break threshold via
     * {@link breakingTorque}.
     * @type {number}
     */
    get breakingForce(): number;
    set breakingForce(value: number);
    /**
     * @description Torque threshold that breaks this 3D joint, expressed in the
     * engine's internal torque units.
     * This is a break limit, not a torque actively applied by the joint.
     * A value of -1 disables break checks for this constraint.
     * This property is used only by joint types that create a second angular
     * constraint, such as {@link FixedJoint} and {@link HingeJoint}; for joints
     * without an angular constraint it has no effect. Defaults to 9999.
     * @type {number}
     */
    get breakingTorque(): number;
    set breakingTorque(value: number);
    /**
     * @description Local anchor point on this body.
     * It is authored relative to this joint's own SceneObject and converted to a world-space point when the native joint is created.
     * The conversion happens only at joint creation, so changing this at runtime
     * after the joint exists does not move the existing anchor; the joint must be
     * recreated for a new value to take effect. Defaults to `(0, 0, 0)`.
     * @type {Vector3f}
     */
    get anchor(): Vector3f;
    set anchor(value: Vector3f);
    /**
     * @description Local anchor point on the connected body.
     * It is authored relative to the connected body and converted to a world-space point when the native joint is created.
     * The conversion happens only at joint creation, so changing this at runtime
     * after the joint exists does not move the existing anchor; the joint must be
     * recreated for a new value to take effect. A connected body must be set for
     * the joint to be created; without one the joint is not built. Defaults to
     * `(0, 0, 0)`.
     * @type {Vector3f}
     */
    get connectedAnchor(): Vector3f;
    set connectedAnchor(value: Vector3f);
  }
  /**
   * @class JsonAsset
   * @description A read-only JSON resource asset. Wraps a text-based asset (`.json` file)
   * imported by the editor and exposes its parsed content through {@link JsonAsset.json}.
   * Each access of {@link JsonAsset.json} parses the underlying raw text on demand and returns
   * a fresh JS value, so multiple reads do not share the same object reference; mutating the
   * returned value does not write back to the asset, and there is no setter. When the file
   * cannot be loaded, the JSON cannot be parsed, or the top-level value is not an object/array,
   * {@link JsonAsset.json} returns `undefined` and an error is logged via the engine logger.
   * Typical usage: assign a JSON file to a serialized `JsonAsset` field in a script and read
   * `asset.json` at runtime to access configuration data.
   */
  class JsonAsset {
    protected constructor();
    /**
     * @readonly
     * @description Gets the parsed JSON object or array represented by this asset.
     * Each access parses the current raw text and returns a <b>new</b> JS value;
     * the returned object is <b>not</b> shared with any cache, and mutating it
     * (e.g. `obj.foo = 1`) does <b>not</b> write back to the asset or persist.
     * Returns `undefined` when the file cannot be loaded, the JSON is invalid,
     * or the top-level value is not an object/array.
     * @type {any}
     * @example
     * const data = jsonAsset.json;
     * if (data) {
     *     console.log(data.someField);
     * }
     */
    get json(): any;
  }
  /**
   * @class LayerSet
   * @description A bitset-backed set of render or query layers.
   * Layer indices are zero-based and map directly to the underlying `DynamicBitset`.
   * The default constructor (`new LayerSet()`) creates a 64-bit set with all layers
   * disabled; an explicit positive bit count may be passed to allocate a different
   * width (passing `0` falls back to 64). The bit count is fixed once the LayerSet
   * is constructed; methods such as {@link LayerSet.set}/{@link LayerSet.get} do
   * not grow the set, and accessing an index `>= numBits` is forwarded to the
   * native `DynamicBitset` without runtime range checks at the APJS layer.
   * The set's internal width is observable via the `numbits:<n>` field of
   * {@link LayerSet.toString}.
   */
  class LayerSet {
    /**
     * @description Constructs a LayerSet instance.
     * @param bitset - Optional parameter that can be:
     *   - A number representing the count of bits for a new DynamicBitset
     *   - Undefined/null, in which case a new DynamicBitset with 64 bits is created
     * @param mask - Optional parameter representing the mask value for the DynamicBitset. Defaults to 0 if not provided.
     */
    constructor(bitset?: number, mask?: number);
    /**
     * @description Clears the layer set by setting all bits to false up to the
     * requested width. Note this does NOT reallocate the underlying storage:
     * the bit count of the LayerSet itself is fixed at construction time, and
     * `bitsNum` only controls how many bits are walked through and zeroed.
     * @param bitsNum - Optional number of leading bits to clear. When omitted,
     *                  `null`, or `0`, defaults to `64`. Valid range is `0` to
     *                  the bit count of this LayerSet (default `64`).
     * @returns This LayerSet instance for chaining.
     */
    clear(bitsNum?: number): this;
    /**
     * @description Retrieves the enabled state of a specific zero-based layer index.
     * @param layerIndex - The index of the layer to retrieve.
     * @returns A boolean indicating whether the specified layer is active or not.
     * @example
     * if (camera.renderLayer.get(sceneObject.layer)) {
     *   // Do something.
     * }
     */
    get(layerIndex: number): boolean;
    /**
     * @description Sets the enabled state of a specific zero-based layer index.
     * @param layer - The index of the layer to set.
     * @param value - The boolean value to assign to the layer.
     * @returns This LayerSet instance for chaining.
     * @example
     *
     * const LAYER_DEFAULT = 0;
     * const LAYER_1 = 1;
     * camera.renderLayer = camera.renderLayer.set(LAYER_DEFAULT, true);
     * camera.renderLayer = camera.renderLayer.set(LAYER_1, true);
     */
    set(layer: number, value: boolean): this;
    /**
     * @description Checks if the layer set is empty (all bits are false).
     * @returns A boolean indicating whether all layers are inactive.
     */
    isEmpty(): boolean;
    /**
     * @description Compares the current LayerSet with another LayerSet for equality.
     * Equality requires both LayerSets to share the same bit count and identical bit
     * patterns; LayerSets with different widths are never equal even if all set bits
     * fall within the smaller width. Comparing against `null`/`undefined` is not
     * supported.
     * @param v - The LayerSet to compare against.
     * @returns A boolean indicating whether the two LayerSets have identical bit patterns.
     */
    equals(v: LayerSet): boolean;
    /**
     * @description Returns the native `DynamicBitset` debug string used by this layer set.
     * The format starts with `numbits:<numBits>; numblock:<numBlocks>; hexadecimal:0x`
     * and then appends storage blocks in uppercase hexadecimal from the highest block to the lowest.
     * @example
     * ```ts
     * const layers = new APJS.LayerSet();
     * layers.set(0, true).set(2, true).set(4, true);
     * const text = layers.toString();
     * // "numbits:64; numblock:2; hexadecimal:0x0 15 "
     * ```
     * @returns A debug string representing the current bit pattern of the layer set.
     */
    toString(): string;
  }
  /**
   * @class Light
   * @description Represents a light source in the scene.
   */
  class Light extends Component {
    protected constructor();
    /**
     * @description Gets the color of the light.
     * default: `APJS.Color(1, 1, 1, 1)`
     * The returned "Color" only contains the RGB channels, the alpha channel is set to 1.
     */
    get color(): Color;
    /**
     * @description Sets the color of the light.
     * Only the `r`, `g`, `b` channels are written to the native light color; `a` is
     * ignored by this API. Use {@link Light.intensity} to scale the resulting
     * radiance — `color` carries the tint, `intensity` carries the magnitude.
     */
    set color(value: Color);
    /**
     * @description Gets the light intensity scalar.
     * Range: [0.0, 7.0], default `1.0` set by editor.
     */
    get intensity(): number;
    /**
     * @description Sets the light intensity scalar.
     * Range: [0.0, 7.0], default `1.0` set by editor.
     */
    set intensity(value: number);
    /**
     * @description Gets the {@link LayerSet} that are affected by this light.
     * The set is 64-bit wide, with zero-based layer indices in `[0, 63]`; only scene
     * objects on an enabled layer receive this light. By default, all 64 layers are enabled.
     */
    get renderLayer(): LayerSet;
    /**
     * @description Sets the {@link LayerSet} that are affected by this light.
     * Layer indices are zero-based and in `[0, 63]`. Changes take effect from the next
     * rendered frame; modifying the {@link LayerSet} returned by the getter in place is not
     * guaranteed to apply, so assign a {@link LayerSet} to this property.
     */
    set renderLayer(value: LayerSet);
  }
  /**
   * @class LookAt
   * @description Orients this object toward a target each frame. When {@link target} is `null`,
   * the look-at computation is skipped and the orientation is left unchanged.
   */
  class LookAt extends Component {
    protected constructor();
    /**
     * @description Target transform. Role depends on {@link mode}:
     * - `LookAtDirection`: aim direction = target's world forward axis.
     * - `LookAtPoint`: aim direction = target.worldPosition − this.worldPosition.
     * `null` skips the look-at calculation. default: `null`.
     * @return the target transform, or `null`.
     */
    get target(): Transform | null;
    /**
     * @description Target transform. Pass `null` to disable.
     * @param value - The target transform.
     */
    set target(value: Transform | null);
    /**
     * @description Look-at mode. default: `LookAtDirection`.
     * - `LookAtDirection`: aim = target's world forward axis.
     * - `LookAtPoint`: aim = target.worldPosition − this.worldPosition.
     * @return the look-at mode.
     */
    get mode(): LookAtMode;
    /**
     * @description Look-at mode.
     * @param value - The mode.
     */
    set mode(value: LookAtMode);
    /**
     * @description World-up reference. default: `SceneY`.
     * - `SceneX / SceneY / SceneZ`: fixed scene axes.
     * - `ObjectX / ObjectY / ObjectZ`: this object's world axes.
     * - `TargetX / TargetY / TargetZ`: target's world axes (skipped when target is `null`).
     * @return the world-up mode.
     */
    get worldUp(): LookAtWorldUp;
    /**
     * @description World-up reference.
     * @param value - The world-up mode.
     */
    set worldUp(value: LookAtWorldUp);
    /**
     * @description Local axis that points toward the target. default: `Z`.
     * Must differ from {@link directionUp}; same axis or opposite sign yields a
     * degenerate frame (orientation may flip or freeze).
     * @return the aim direction.
     */
    get directionAim(): LookAtDirection;
    /**
     * @description Local axis that points toward the target.
     * @param value - The aim direction.
     */
    set directionAim(value: LookAtDirection);
    /**
     * @description Local axis aligned with the world-up direction. default: `Y`.
     * Must not be the same axis as {@link directionAim} (e.g. aim=`X` + up=`X` or
     * aim=`X` + up=`NegativeX`); when they conflict, the aim/up mapping is skipped
     * and only the raw look-at rotation plus {@link offsetRotation} is applied.
     * @return the up direction.
     */
    get directionUp(): LookAtDirection;
    /**
     * @description Local axis aligned with the world-up direction.
     * @param value - The up direction.
     */
    set directionUp(value: LookAtDirection);
    /**
     * @description Additional Euler rotation applied after look-at, in degrees
     * `(pitch, yaw, roll)` using the native YXZ rotation order. Applied in the
     * look-at result's local space. default: `(0, 0, 0)`.
     * @return the offset rotation.
     */
    get offsetRotation(): Vector3f;
    /**
     * @description Additional Euler rotation in degrees `(pitch, yaw, roll)`, YXZ order.
     * @param value - The offset rotation.
     */
    set offsetRotation(value: Vector3f);
  }
  /**
   * @description Specifies the forward direction of a transform.
   * @enum
   */
  enum LookAtDirection {
    X,
    Y,
    Z,
    NegativeX,
    NegativeY,
    NegativeZ
  }
  /**
   * @description Specifies the mode of LookAt.
   * @enum
   */
  enum LookAtMode {
    /** The object will look towards a specified direction. */
    LookAtDirection,
    /** The object will look at a specified point in world space. */
    LookAtPoint
  }
  /**
   * @description Defines the world-up vector for the look-at calculation.
   * @enum
   */
  enum LookAtWorldUp {
    /** Use the scene's positive Y-axis as the world up vector. */
    SceneY,
    /** Use the target's positive Y-axis as the world up vector. */
    TargetY,
    /** Use the object's positive X-axis as the world up vector. */
    ObjectX,
    /** Use the object's positive Y-axis as the world up vector. */
    ObjectY,
    /** Use the object's positive Z-axis as the world up vector. */
    ObjectZ,
    /** Use the scene's positive X-axis as the world up vector. */
    SceneX,
    /** Use the scene's positive Z-axis as the world up vector. */
    SceneZ,
    /** Use the target's positive X-axis as the world up vector. */
    TargetX,
    /** Use the target's positive Z-axis as the world up vector. */
    TargetZ
  }
  /**
   * @class Material
   * @description Material. This class exposes all properties from a material, allowing you to animate them. You can also use it to set custom shader properties that can't be accessed through the inspector.
   */
  class Material extends AObject {
    protected constructor();
    /**
     * @description The render queue index controlling draw order. Lower values render earlier.
     * Valid range is integer `[1, 4999]`. When set to `-1` (default) with an `XShader` bound, falls back to `xshader.renderQueue`.
     */
    get renderQueue(): number;
    /**
     * @description Sets the render queue for the material. Valid range is integer `[1, 4999]`.
     */
    set renderQueue(value: number);
    /**
     * @description Gets the render passes for this material. Prefers `xshader.passes` when
     * an `XShader` is bound, otherwise falls back to the material's own passes.
     */
    get passes(): Pass[];
    /**
     * @description Replaces the render passes. Follows the same `XShader`-first rule as the getter.
     */
    set passes(value: Pass[]);
    /**
     * @description Checks whether a shader macro is enabled on this material (case-sensitive).
     * Only macros added via {@link Material.enableMacro} are reported.
     * @param value - The macro name to check.
     * @returns `true` if the macro was enabled and not yet removed, `false` otherwise.
     * @example
     * material.enableMacro('USE_NORMAL_MAP', 1);
     * material.isMacroEnabled('USE_NORMAL_MAP'); // true
     */
    isMacroEnabled(value: string): boolean;
    /**
     * @description Creates an independent copy of this material. Properties, macros, and
     * passes are deep-copied; GPU resources (textures, XShader) are reference-shared.
     * @returns A new {@link Material} instance.
     */
    clone(): Material;
    /**
     * @description Sets a `float` property by name. The value is stored regardless of whether
     * the shader declares this uniform; unmatched names have no visible effect.
     * @param name - Property key matching a shader-declared float uniform.
     * @param value - The float value to write.
     */
    setFloat(name: string, value: number): void;
    /**
     * @description Reads a `float` property by name.
     * @param name - Property key matching a shader-declared float uniform.
     * @returns The float value, or `undefined` when not found. A name stored under a
     * different property type is treated as not found.
     */
    getFloat(name: string): number | undefined;
    /**
     * @description Sets a `mat4` property by name. The matrix is stored by value and is kept
     * regardless of whether the shader declares this uniform; unmatched names have no visible effect.
     * @param name - Property key matching a shader-declared `mat4` uniform.
     * @param m - The matrix value to write; `null` / `undefined` is ignored.
     */
    setMatrix(name: string, m: Matrix4x4f): void;
    /**
     * @description Reads a `mat4` property by name.
     * @param name - Property key matching a shader-declared `mat4` uniform.
     * @returns A {@link Matrix4x4f}, or `undefined` when not found. A name stored under a
     * different property type is treated as not found.
     */
    getMatrix(name: string): Matrix4x4f | undefined;
    /**
     * @description Sets a texture property by name. Passing `null` / `undefined` is a no-op
     * and does **not** clear the existing binding.
     * @param name - Property key matching a shader-declared texture sampler slot.
     * @param texture - The texture to bind; `null` / `undefined` is ignored.
     */
    setTexture(name: string, texture: Texture): void;
    /**
     * @description Reads a texture property by name.
     * @param name - Property key matching a shader-declared texture sampler slot.
     * @returns The bound {@link Texture}, or `null` when not found. Note that this method
     * uses `null` for the empty result, unlike {@link getFloat} / {@link getMatrix} which
     * return `undefined`.
     */
    getTexture(name: string): Texture | null;
    /**
     * @description Sets an `int` property by name. Non-integer values are not rounded;
     * truncation behavior is platform-defined. The value is stored regardless of whether the
     * shader declares this uniform; unmatched names have no visible effect.
     * @param name - Property key matching a shader-declared int uniform.
     * @param value - The integer value to write.
     */
    setInt(name: string, value: number): void;
    /**
     * @description Reads an `int` property by name.
     * @param name - Property key matching a shader-declared int uniform.
     * @returns The integer value, or `undefined` when not found. A name stored under a
     * different property type is treated as not found.
     */
    getInt(name: string): number | undefined;
    /**
     * @description Enables a shader macro with a numeric value, making it available to the
     * shader at draw time. Triggers a shader rebuild when the value changes; same-value
     * reassignment is a no-op.
     * @param macro - The macro name (case-sensitive).
     * @param value - The numeric value to store for the macro.
     * @example
     * material.enableMacro('USE_NORMAL_MAP', 1);
     * material.enableMacro('SAMPLE_COUNT', 4);
     */
    enableMacro(macro: string, value: number): void;
    /**
     * @description Removes a previously enabled shader macro. Unknown or already-disabled
     * names are silently ignored.
     * @param macro - The macro name to disable (case-sensitive).
     */
    disableMacro(macro: string): void;
    /**
     * @description The first render pass of this material. Prefers `xshader.passes[0]` when
     * an `XShader` is bound. If no passes exist, a fresh {@link Pass} is created and
     * inserted as a side effect. Only touches index `0`; use {@link Material.passes} to
     * replace the full list.
     */
    get mainPass(): Pass;
    /**
     * @description Sets the main pass for the material.
     * @param value - The Pass object to set as the main pass.
     */
    set mainPass(value: Pass);
    /**
     * @description Checks whether a float property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasFloatKey(key: string): boolean;
    /**
     * @description Checks whether a Vector4 property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasVector4Key(key: string): boolean;
    /**
     * @description Checks whether a Vector3 property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasVector3Key(key: string): boolean;
    /**
     * @description Checks whether a Vector2 property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasVector2Key(key: string): boolean;
    /**
     * @description Checks whether a matrix property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasMatrixKey(key: string): boolean;
    /**
     * @description Checks whether a texture property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasTextureKey(key: string): boolean;
    /**
     * @description Checks whether an integer property with the given name exists.
     * @param key - The property name to check.
     * @returns `true` if the property exists.
     */
    hasIntKey(key: string): boolean;
    /**
     * @description Sets a vector property by name. The dimension is inferred from the runtime
     * type: {@link Vector2f} → `vec2`, {@link Vector3f} → `vec3`, {@link Vector4f} → `vec4`.
     * Dimensions are not auto-converted. Passing a {@link Vector4f} writes the same `vec4`
     * slot as {@link setColor}; use {@link setColor} when the value is a color.
     * @param name - Property key matching a shader-declared vector uniform.
     * @param value - The vector value.
     */
    setVector(name: string, value: Vector2f | Vector3f | Vector4f): void;
    /**
     * @description Reads a vector property by name. Lookup order: `vec2` → `vec3` → `vec4`.
     * Use `instanceof` to narrow the returned union.
     * @param name - Property key matching a shader-declared vector uniform.
     * @returns A {@link Vector2f}, {@link Vector3f}, or {@link Vector4f}; `undefined` if not found.
     * @example
     * const v = material.getVector('u_Param');
     * if (v instanceof Vector4f) { console.log(v.x, v.y, v.z, v.w); }
     */
    getVector(name: string): Vector2f | Vector3f | Vector4f | undefined;
    /**
     * @description Sets a `vec4` property by name using a {@link Color}. Writes as
     * `(r, g, b, a)`. A falsy `color` is a no-op. This targets the same `vec4` slot as
     * {@link setVector} called with a {@link Vector4f}; the only difference is that the
     * channels are sourced from the color's `r`/`g`/`b`/`a`.
     * @param name - Property key matching a shader-declared `vec4` uniform.
     * @param color - The color to write; a falsy value is ignored.
     */
    setColor(name: string, color: Color): void;
    /**
     * @description Reads a {@link Color} from a `vec4` property by name. The four components
     * are mapped back as `r = x`, `g = y`, `b = z`, `a = w`. Returns `undefined` when the
     * property is absent or not stored as a `vec4` (e.g. a `vec2`/`vec3` of the same name).
     * @param name - Property key matching a shader-declared `vec4` uniform.
     * @returns A {@link Color}, or `undefined` when not found.
     */
    getColor(name: string): Color | undefined;
  }
  /**
   * @class MaterialPropertyBlock
   * @extends AObject
   * @description A per-renderer override container for material properties. Values written
   * here override the corresponding uniform on the renderer for that draw call and never
   * mutate the source {@link Material}.
   */
  class MaterialPropertyBlock extends AObject {
    /**
     * @constructor
     * @param rtti - Optional parameter for initializing the block with existing RTTI data.
     */
    constructor();
    /**
     * @description Sets a float property.
     * @param name - Property key matching a shader-declared float uniform.
     * @param val - The float value to store.
     */
    setFloat(name: string, val: number): void;
    /**
     * @description Sets a float-array property. `Float32Array` is forwarded as-is;
     * `number[]` is copied into a `Float32Array`. Passing `undefined` is a no-op.
     * @param name - Property key matching a shader-declared `float[]` uniform.
     * @param data - The packed float values; `undefined` is ignored.
     */
    setFloatArray(name: string, data: number[] | Float32Array): void;
    /**
     * @description Sets a vec2-array property. Tightly packed `[x0, y0, x1, y1, ...]`.
     * `Float32Array` is uploaded as-is; `Vector2f[]` is flattened. `undefined` is a no-op.
     * @param name - Property key matching a shader-declared `vec2[]` uniform.
     * @param data - Packed `Float32Array` or `Vector2f[]`; `undefined` is ignored.
     */
    setVector2Array(name: string, data: Vector2f[] | Float32Array): void;
    /**
     * @description Sets a vec3-array property. Tightly packed `[x0, y0, z0, ...]`.
     * `Float32Array` is uploaded as-is; `Vector3f[]` is flattened. `undefined` is a no-op.
     * @param name - Property key matching a shader-declared `vec3[]` uniform.
     * @param data - Packed `Float32Array` or `Vector3f[]`; `undefined` is ignored.
     */
    setVector3Array(name: string, data: Vector3f[] | Float32Array): void;
    /**
     * @description Sets a texture property. A falsy `texture` is silently ignored and does
     * **not** clear the existing binding.
     * @param name - Property key matching a shader-declared sampler slot.
     * @param texture - The texture to bind; a falsy value is ignored.
     */
    setTexture(name: string, texture: Texture): void;
    /**
     * @description Sets a vec4-array property. Tightly packed `[x0, y0, z0, w0, ...]`.
     * `Float32Array` is uploaded as-is; `Vector4f[]` is flattened. `undefined` is a no-op.
     * @param name - Property key matching a shader-declared `vec4[]` uniform.
     * @param data - Packed `Float32Array` or `Vector4f[]`; `undefined` is ignored.
     */
    setVector4Array(name: string, data: Vector4f[] | Float32Array): void;
    /**
     * @description Sets a `mat4` property by name. The matrix is stored by value and follows the
     * column-major layout of {@link Matrix4x4f}.
     * @param name - Property key matching a shader-declared `mat4` uniform.
     * @param mat - The matrix to store.
     */
    setMatrix(name: string, mat: Matrix4x4f): void;
    /**
     * @description Sets a vector property. Dimension is inferred from the runtime type:
     * {@link Vector2f} → `vec2`, {@link Vector3f} → `vec3`, {@link Vector4f} → `vec4`.
     * Dimensions are independent and not auto-converted.
     * @param name - Property key matching a shader-declared vector uniform.
     * @param value - Vector value; runtime type selects the target dimension slot.
     */
    setVector(name: string, value: Vector2f | Vector3f | Vector4f): void;
  }
  /**
   * @class Matrix3x3f
   * @description A 3x3 transformation matrix used for 3D linear transforms (rotation,
   * scale, shear) without translation. Storage and indexing follow the **column-major**
   * convention shared by the rest of APJS math types.
   *
   * Create an identity matrix with `new Matrix3x3f()`, or supply nine column-major
   * values to `new Matrix3x3f(...)`. Use `set` to update individual entries.
   */
  class Matrix3x3f {
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * Values are supplied one column at a time, matching {@link get} and {@link set}:
     * `m0`-`m2` are column 0, `m3`-`m5` are column 1, and `m6`-`m8` are column 2.
     * @param m0 - The value at position (row 0, column 0).
     * @param m1 - The value at position (row 1, column 0).
     * @param m2 - The value at position (row 2, column 0).
     * @param m3 - The value at position (row 0, column 1).
     * @param m4 - The value at position (1,1).
     * @param m5 - The value at position (row 2, column 1).
     * @param m6 - The value at position (row 0, column 2).
     * @param m7 - The value at position (row 1, column 2).
     * @param m8 - The value at position (2,2).
     */
    constructor(m0?: number, m1?: number, m2?: number, m3?: number, m4?: number, m5?: number, m6?: number, m7?: number, m8?: number);
    /**
     * @description Retrieves the value at the specified row and column in the 3x3 matrix.
     * @param row - The row index (0-based) of the element to retrieve.
     * @param column - The column index (0-based) of the element to retrieve.
     * @returns The value at the specified row and column.
     */
    get(row: number, column: number): number;
    /**
     * @description Sets the value at a specified row and column in the matrix.
     * @param row - The row index (0-based).
     * @param column - The column index (0-based).
     * @param value - The value to set at the specified position.
     * @returns This instance of Matrix3x3f for method chaining.
     */
    set(row: number, column: number, value: number): this;
    /**
     * @description Returns a copy of the first column (column index 0) of the matrix
     * as a `Vector3f`.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column0(): Vector3f;
    /**
     * @description Sets the first column of the 3x3 matrix with the provided Vector3f values.
     */
    set column0(value: Vector3f);
    /**
     * @description Returns a copy of the second column of the 3x3 matrix as a `Vector3f`.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column1(): Vector3f;
    /**
     * @description Sets the second column of the 3x3 matrix with the provided Vector3f values.
     */
    set column1(value: Vector3f);
    /**
     * @description Returns a copy of the third column of the 3x3 matrix as a `Vector3f`.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column2(): Vector3f;
    /**
     * @description Sets the third column of the 3x3 matrix with the provided Vector3f values.
     */
    set column2(value: Vector3f);
    /**
     * @description Compares this matrix with another matrix for equality.
     * This is a strict element-wise comparison with no floating-point tolerance. Use
     * {@link Matrix3x3f.compareApproximately} when approximate comparison is needed.
     * @param other - The Matrix3x3f object to compare with this matrix.
     * @returns A boolean indicating whether the two matrices are equal.
     */
    equals(other: Matrix3x3f): boolean;
    /**
     * @description Returns a clone of the current Matrix3x3f instance.
     * @returns A new Matrix3x3f object with the same data as the original.
     */
    clone(): Matrix3x3f;
    /**
     * @description Returns a string representation of this matrix.
     *
     * Each element is formatted with `Number.prototype.toFixed(5)` (five decimal digits,
     * fixed notation; large magnitudes are not switched to exponential form). Elements are
     * laid out in row-major reading order with three rows on three lines.
     *
     * Format example for an identity matrix:
     * ```
     * Matrix3x3f(1.00000, 0.00000, 0.00000,
     *            0.00000, 1.00000, 0.00000,
     *            0.00000, 0.00000, 1.00000)
     * ```
     *
     * Intended for logging / debugging only — the format is human-readable, not stable
     * for parsing.
     *
     * @returns The formatted string.
     */
    toString(): string;
    /**
     * @description Performs element-wise addition of another matrix to this matrix, in place.
     * Non-finite values such as `Infinity`, `-Infinity`, and `NaN` are not handled
     * specially and propagate according to normal floating-point arithmetic.
     * @param other - The matrix to add to this matrix.
     * @returns This matrix instance after performing the addition operation.
     */
    add(other: Matrix3x3f): this;
    /**
     * @description Performs element-wise subtraction of another matrix from this matrix, in place.
     * Non-finite values such as `Infinity`, `-Infinity`, and `NaN` are not handled
     * specially and propagate according to normal floating-point arithmetic.
     * @param other - The matrix to subtract from this matrix.
     * @returns This matrix instance after performing the subtraction operation.
     */
    subtract(other: Matrix3x3f): this;
    /**
     * @description Multiplies this matrix in place.
     * When `other` is a `Matrix3x3f`, this performs standard matrix multiplication
     * (`this * other`). When `other` is a `number`, it scales every element of this
     * matrix by that scalar.
     * @param other - The matrix or scalar to multiply this matrix by.
     * @returns This matrix instance after performing the multiplication operation.
     */
    multiply(other: Matrix3x3f | number): this;
    /**
     * @description Multiplies each element of the matrix by a scalar value in place.
     * @param scalar - The scalar value to multiply each element of the matrix by.
     * @returns This matrix instance after performing the scalar multiplication.
     */
    multiplyScalar(scalar: number): this;
    /**
     * @description Divides each element of the current matrix by the corresponding element of another matrix.
     * If a divisor is `0`, the result may become `Infinity` or `NaN`. Existing `NaN`
     * values also propagate according to normal floating-point arithmetic.
     * @param other - The matrix to divide by.
     * @returns This matrix after performing the division.
     */
    divide(other: Matrix3x3f): this;
    /**
     * @description Computes and sets this matrix to its inverse.
     * If this matrix is not invertible, it is replaced with a zero matrix.
     * @returns This matrix instance after computing the inverse.
     */
    inverse(): this;
    /**
     * @description Computes and sets this matrix to its transpose in place.
     * @returns This matrix instance after computing the transpose.
     */
    transpose(): this;
  }
  /**
   * @class Matrix4x4f
   * @description A 4x4 transformation matrix used for arbitrary affine 3D transforms
   * (translation, rotation, scale, shear) and projective / perspective transforms via
   * homogeneous coordinates. Storage and indexing follow the **column-major** convention
   * shared by the rest of APJS math types.
   *
   * All Euler-angle related methods on `Matrix4x4f` (e.g. {@link Matrix4x4f.getEulerAngles})
   * use **radians**, whereas {@link Transform.localEulerAngles} / {@link Transform.getWorldEulerAngles}
   * use **degrees**; convert with `radians = degrees * Math.PI / 180` when crossing the boundary.
   *
   * Create an identity matrix with `new Matrix4x4f()`, or supply 16 column-major
   * values to `new Matrix4x4f(...)`. Use `compose` for translation, rotation,
   * and scale, or `Matrix4x4f.makeFromRotation` for a rotation matrix.
   */
  class Matrix4x4f {
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * Values are supplied one column at a time, matching {@link get} and {@link set}:
     * `m0`-`m3` are column 0, `m4`-`m7` are column 1, and so on.
     * @param m0 - Value at row 0, column 0 of the matrix.
     * @param m1 - Value at row 1, column 0 of the matrix.
     * @param m2 - Value at row 2, column 0 of the matrix.
     * @param m3 - Value at row 3, column 0 of the matrix.
     * @param m4 - Value at row 0, column 1 of the matrix.
     * @param m5 - Value at row 1, column 1 of the matrix.
     * @param m6 - Value at row 2, column 1 of the matrix.
     * @param m7 - Value at row 3, column 1 of the matrix.
     * @param m8 - Value at row 0, column 2 of the matrix.
     * @param m9 - Value at row 1, column 2 of the matrix.
     * @param m10 - Value at row 2, column 2 of the matrix.
     * @param m11 - Value at row 3, column 2 of the matrix.
     * @param m12 - Value at row 0, column 3 of the matrix.
     * @param m13 - Value at row 1, column 3 of the matrix.
     * @param m14 - Value at row 2, column 3 of the matrix.
     * @param m15 - Value at row 3, column 3 of the matrix.
     */
    constructor(m0?: number, m1?: number, m2?: number, m3?: number, m4?: number, m5?: number, m6?: number, m7?: number, m8?: number, m9?: number, m10?: number, m11?: number, m12?: number, m13?: number, m14?: number, m15?: number);
    /**
     * @description Retrieves the value at the specified row and column in the matrix.
     * @param row - The row index of the desired element (0-based).
     * @param column - The column index of the desired element (0-based).
     * @returns The value at the specified row and column.
     */
    get(row: number, column: number): number;
    /**
     * @description Sets the value at a specified row and column in the matrix.
     * @param row - The row index (0-based).
     * @param column - The column index (0-based).
     * @param value - The value to set at the specified position.
     * @returns This instance of Matrix4x4f for method chaining.
     */
    set(row: number, column: number, value: number): this;
    /**
     * @description Sets the values of a specified row in the matrix using a Vector4f.
     * @param row - The index of the row to set [0-3]. Out-of-range values are not validated
     *   and may write to unintended indices without throwing.
     * @param v - A Vector4f containing the values (c0, c1, c2, c3) for the row.
     * @returns This instance of Matrix4x4f with the updated row values.
     */
    setRow(row: number, v: Vector4f): this;
    /**
     * @description Sets the values of a specified column in the matrix.
     * @param col - The index of the column to set (0-3). Out-of-range values are not
     *   validated and may write to unintended indices without throwing.
     * @param v - A Vector4f object containing the new values for the column (r0, r1, r2, r3).
     * @returns This instance of Matrix4x4f with the updated column values.
     */
    setColumn(col: number, v: Vector4f): this;
    /**
     * @description Returns a copy of the first column (column index 0) of the matrix
     * as a `Vector4f`. The vector's `x`, `y`, `z`, `w` map to rows 0, 1, 2, 3 of that column.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column0(): Vector4f;
    /**
     * @description Sets the first column of the 4x4 matrix with the provided Vector4f values.
     * The vector's `x`, `y`, `z`, `w` are written to rows 0, 1, 2, 3 of column 0 respectively.
     */
    set column0(value: Vector4f);
    /**
     * @description Returns a copy of the second column of the 4x4 matrix as a `Vector4f`.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column1(): Vector4f;
    /**
     * @description Sets the second column of the 4x4 matrix with the provided Vector4f values.
     */
    set column1(value: Vector4f);
    /**
     * @description Returns a copy of the third column of the 4x4 matrix as a `Vector4f`.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column2(): Vector4f;
    /**
     * @description Sets the third column of the 4x4 matrix with the provided Vector4f values.
     */
    set column2(value: Vector4f);
    /**
     * @description Returns a copy of the fourth column of the 4x4 matrix as a `Vector4f`.
     * The returned vector is a new instance — mutating it does not change the matrix; use
     * the setter to write back.
     */
    get column3(): Vector4f;
    /**
     * @description Sets the fourth column of the 4x4 matrix with the provided Vector4f values.
     */
    set column3(value: Vector4f);
    /**
     * @description Returns whether this matrix and `other` have exactly the same 16 values.
     *
     * This is a strict element-wise comparison with no floating-point tolerance. Use
     * {@link Matrix4x4f.compareApproximately} when approximate comparison is needed.
     *
     * @param other - The Matrix4x4f object to compare with this matrix.
     * @returns A boolean indicating whether the two matrices are equal.
     */
    equals(other: Matrix4x4f): boolean;
    /**
     * @description Returns a clone of the current Matrix4x4f instance.
     * @returns - A new Matrix4x4f object with the same data as the original.
     */
    clone(): Matrix4x4f;
    /**
     * @description Returns a formatted string representation of the matrix showing all 16 elements.
     * @returns A string representation of the matrix with elements arranged in a 4x4 grid.
     * Format example for an identity matrix:
     * ```
     * Matrix4x4f(1.00000, 0.00000, 0.00000, 0.00000,
     *            0.00000, 1.00000, 0.00000, 0.00000,
     *            0.00000, 0.00000, 1.00000, 0.00000,
     *            0.00000, 0.00000, 0.00000, 1.00000)
     * ```
     */
    toString(): string;
    /**
     * @description Performs element-wise addition of another matrix to this matrix, in place.
     * Non-finite values such as `Infinity`, `-Infinity`, and `NaN` are not handled
     * specially and propagate according to normal floating-point arithmetic.
     * @param other - The matrix to add to this matrix.
     * @returns This matrix instance after performing the addition operation.
     */
    add(other: Matrix4x4f): this;
    /**
     * @description Performs element-wise subtraction of another matrix from this matrix, in place.
     * Non-finite values such as `Infinity`, `-Infinity`, and `NaN` are not handled
     * specially and propagate according to normal floating-point arithmetic.
     * @param other - The matrix to subtract from this matrix.
     * @returns This matrix instance after performing the subtraction operation.
     */
    subtract(other: Matrix4x4f): this;
    /**
     * @description Multiplies this matrix in place.
     * When `other` is a `Matrix4x4f`, this performs standard matrix multiplication
     * (`this * other`). When `other` is a `number`, it scales every element of this
     * matrix by that scalar.
     * @param other - The matrix or scalar to multiply this matrix by.
     * @returns This matrix instance after performing the multiplication operation.
     */
    multiply(other: Matrix4x4f | number): this;
    /**
     * @description Multiplies each element of the matrix by a scalar value in place.
     * Equivalent to `multiply(scalar)` when passing a number; prefer this method when the
     * operand is always a scalar, and use {@link multiply} when the operand may be a matrix.
     * @param scalar - The scalar value to multiply each element of the matrix by.
     * @returns This matrix instance after performing the scalar multiplication.
     */
    multiplyScalar(scalar: number): this;
    /**
     * @description Divides each element of the current matrix by the corresponding element of another matrix.
     * If a divisor is `0`, the result may become `Infinity` or `NaN`. Existing `NaN`
     * values also propagate according to normal floating-point arithmetic.
     * @param other - The matrix to divide by.
     * @returns This matrix after performing the division.
     */
    divide(other: Matrix4x4f): this;
    /**
     * @description Returns an Euler angle representation of this matrix's rotation.
     * The result uses the engine's native `YXZ` Euler convention and is intended to match
     * {@link Matrix4x4f.makeFromEulerAngles}. Near singular configurations, the result may
     * be non-unique.
     * @returns - A vector containing the Euler angles (pitch, yaw, roll) in radians.
     */
    getEulerAngles(): Vector3f;
    /**
     * @description Computes and sets this matrix to its inverse.
     * If this matrix is not invertible, it is replaced with a zero matrix.
     * @returns This matrix instance after computing the inverse.
     */
    inverse(): this;
    /**
     * @description Multiplies the given direction vector by this matrix and returns the resulting vector.
     * Treats `dir` as a homogeneous direction with `w = 0`, so the translation column is
     * ignored. This method returns the transformed xyz components directly and does not
     * perform a perspective divide.
     * @param dir - The direction vector to be multiplied.
     * @returns A new Vector3f representing the result of the multiplication.
     */
    multiplyDirection(dir: Vector3f): Vector3f;
    /**
     * @description Multiplies the given 3D point by this 4x4 matrix and returns the resulting point.
     * Treats `point` as a homogeneous position with `w = 1`, so the translation column is
     * applied. This method returns the transformed xyz components directly and does not
     * perform a perspective divide.
     * @param point - The 3D point to be multiplied by the matrix.
     * @returns A new Vector3f representing the result of the multiplication.
     */
    multiplyPoint(point: Vector3f): Vector3f;
    /**
     * @description Multiplies the given vector by this 4x4 matrix and returns the resulting vector.
     * Uses this class's column-vector convention and computes the full homogeneous result
     * `M * vec`, including the returned `w` component. This method does not perform a
     * perspective divide.
     *
     * Example:
     * ```ts
     * const m = new Matrix4x4f(
     *   1, 0, 0, 0,
     *   0, 1, 0, 0,
     *   0, 0, 1, 0,
     *   10, 20, 30, 1
     * );
     * const result = m.multiplyVector(new Vector4f(1, 2, 3, 1));
     * // result is Vector4f(11, 22, 33, 1)
     * ```
     * @param vec - A 4-dimensional vector (Vector4f) to be multiplied by the matrix.
     * @returns The resulting 4-dimensional vector after multiplication.
     */
    multiplyVector(vec: Vector4f): Vector4f;
    /**
     * @description Computes and sets this matrix to its transpose.
     * @returns This matrix instance after computing the transpose.
     */
    transpose(): this;
    /**
     * @description Replaces this matrix with a pure translation matrix.
     * The upper-left `3x3` is reset to identity, the translation column is set from `v`,
     * and the bottom row becomes `(0, 0, 0, 1)`.
     * @param v - The translation vector to be applied.
     * @returns This instance of Matrix4x4f with the updated translation.
     */
    setTranslate(v: Vector3f): this;
    /**
     * @description Applies a translation by post-multiplying this matrix with the
     * translation matrix built from `vec` (`this = this * T(vec)`).
     * The translation is expressed in the current basis of this matrix, and only the
     * translation column is updated.
     * @param vec - The translation vector to apply to this matrix.
     * @returns This matrix instance after applying the translation transformation.
     */
    translate(vec: Vector3f): this;
    /**
     * @description Sets this matrix to a scaling matrix using the specified scaling factors.
     * All non-scale entries are cleared to `0`, and the bottom-right element is set to `1`.
     * @param v - A Vector3f representing the scaling factors along the x, y, and z axes.
     * @returns This matrix instance after setting it to the scaling matrix.
     */
    setScale(v: Vector3f): this;
    /**
     * @description Applies a non-uniform scale by post-multiplying this matrix with the
     * diagonal scale matrix built from `vec` (`this = this * S(vec)`).
     * @param vec - A Vector3f object representing the scaling factors along each axis.
     * @returns The modified Matrix4x4f instance.
     */
    scale(vec: Vector3f): this;
    /**
     * @description Sets the matrix to a rotation that aligns the vector `from` to the vector `to`.
     * This replaces the current matrix with a rotation-only transform.
     * This method does not normalize or validate the inputs. Both `from` and `to` must be
     * normalized, non-zero vectors. Other inputs produce implementation-defined results.
     * @param from - The initial vector.
     * @param to - The target vector.
     * @returns This matrix with the applied rotation.
     */
    setFromToRotation(from: Vector3f, to: Vector3f): this;
    /**
     * @description Returns the xyz components of the **first column** of the matrix.
     * The returned vector is not normalized; any scale or shear stored in that column is
     * preserved.
     * @returns - The X-axis column as stored in the matrix.
     */
    getAxisX(): Vector3f;
    /**
     * @description Returns the xyz components of the **second column** of the matrix.
     * The returned vector is not normalized; any scale or shear stored in that column is
     * preserved.
     * @returns - The Y-axis column as stored in the matrix.
     */
    getAxisY(): Vector3f;
    /**
     * @description Returns the xyz components of the **third column** of the matrix.
     * The returned vector is not normalized; any scale or shear stored in that column is
     * preserved.
     * @returns - The Z-axis column as stored in the matrix.
     */
    getAxisZ(): Vector3f;
    /**
     * @description Sets this matrix to the identity matrix.
     * @returns This matrix instance after setting it to the identity matrix.
     */
    setIdentity(): this;
    /**
     * @description Decomposes the matrix into its translation, rotation, and scale components.
     * Overwrites the provided output objects in place. Translation is taken from the
     * matrix's translation column, scale is derived from the magnitudes of the first three
     * columns, and rotation is computed from the remaining rotation part.
     * If the matrix contains a mirrored basis, the negative sign is reported on `scale.x`.
     * This overload does not return shear/skew separately; use a TRS-style affine matrix for
     * the most predictable result.
     * @param translation - The vector to store the translation component.
     * @param rotation - The quaternion to store the rotation component.
     * @param scale - The vector to store the scale component.
     */
    getDecompose(translation: Vector3f, rotation: Quaternionf, scale: Vector3f): void;
    /**
     * @description Replaces this matrix with a TRS transform built from translation,
     * rotation, and scale.
     * Under this class's column-vector convention, the result is equivalent to
     * `T(translation) * R(rotation) * S(scale)`.
     * @param translation - The translation vector to apply.
     * @param rotation - The quaternion representing the rotation to apply.
     * @param scale - The scaling vector to apply.
     * @returns This instance of Matrix4x4f with the applied transformations.
     */
    compose(translation: Vector3f, rotation: Quaternionf, scale: Vector3f): this;
    /**
     * @description Approximate comparison of the two Matrix4x4f matrices by comparing the value of each dimension with a specified tolerance.
     * @param mat1 - The first Matrix4x4f to compare.
     * @param mat2 - The second Matrix4x4f to compare.
     * @param dist - The tolerance value for comparison.
     * @returns A boolean indicating whether the two matrices are approximately equal within the given tolerance.
     */
    static compareApproximately(mat1: Matrix4x4f, mat2: Matrix4x4f, dist: number): boolean;
    /**
     * @description Returns a rotation-only model matrix that orients an object so its
     * forward direction points from `eye` toward `center`.
     * This is a model matrix (object-to-world), not a view matrix (world-to-camera).
     * @param eye - The reference position used to compute the forward direction.
     * @param center - The target position the object should face.
     * @param up - The upward direction used to build the orientation basis, typically (0, 1, 0).
     * @returns A new rotation-only Matrix4x4f.
     */
    static lookAt(eye: Vector3f, center: Vector3f, up: Vector3f): Matrix4x4f;
    /**
     * @description Returns a new 4x4 rotation matrix from the specified Euler angles (in radians).
     * Uses the same native `YXZ` Euler convention as {@link Matrix4x4f.getEulerAngles}.
     * @param euler - A Vector3f representing the Euler angles.
     * @returns A new Matrix4x4f instance constructed from the given Euler angles.
     */
    static makeFromEulerAngles(euler: Vector3f): Matrix4x4f;
    /**
     * @description Returns a new 4x4 matrix with the specified rotation.
     * @param rotation - A Quaternionf representing the desired rotation.
     * @returns A new Matrix4x4f instance with the applied rotation.
     */
    static makeFromRotation(rotation: Quaternionf): Matrix4x4f;
    /**
     * @description Returns a new 4x4 matrix with the specified scaling factors.
     * @param scale - A Vector3f representing the scaling factors along the x, y, and z axes.
     * @returns A new Matrix4x4f instance with the applied scaling.
     */
    static makeFromScale(scale: Vector3f): Matrix4x4f;
    /**
     * @description Returns a new 4x4 matrix with the specified translation applied.
     * @param translation - A Vector3f representing the translation to apply.
     * @returns A new Matrix4x4f with the given translation.
     */
    static makeFromTranslation(translation: Vector3f): Matrix4x4f;
    /**
     * @description Generates a right-handed orthographic projection matrix.
     * Camera looks along **-Z**; `zNear`/`zFar` are positive distances.
     * Depth maps `z = -zNear` → `-1`, `z = -zFar` → `+1`.
     * No validation; violating `zFar > zNear > 0`, `right > left`, or `top > bottom`
     * causes division by zero or a flipped axis.
     * @param left - Left clipping plane coordinate.
     * @param right - Right clipping plane coordinate.
     * @param bottom - Bottom clipping plane coordinate.
     * @param top - Top clipping plane coordinate.
     * @param zNear - Positive distance to the near plane.
     * @param zFar - Positive distance to the far plane.
     * @returns A new orthographic projection matrix.
     */
    static orthographic(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix4x4f;
    /**
     * @description Generates a right-handed perspective projection matrix.
     * Camera looks along **-Z**; `zNear`/`zFar` are positive distances.
     * Depth maps `z = -zNear` → `-1`, `z = -zFar` → `+1` after perspective divide.
     * `fovY` is in **degrees**; {@link Camera.fov} is in radians — convert when forwarding.
     * No validation; `aspect` ≤ 0, `fovY` ≤ 0, or `zNear` = `zFar` produces `Infinity`/`NaN`.
     * @param fovY - Vertical field of view in degrees.
     * @param aspect - Viewport aspect ratio (width / height).
     * @param zNear - Positive distance to the near plane.
     * @param zFar - Positive distance to the far plane.
     * @returns A new perspective projection matrix.
     */
    static perspective(fovY: number, aspect: number, zNear: number, zFar: number): Matrix4x4f;
  }
  /**
   * @class Mesh
   * @description Represents a 3D mesh, containing vertices, indices, and other geometric data.
   * @remarks The constructor is protected for internal use.
   */
  class Mesh extends AObject {
    protected constructor();
    /**
     * @description Gets the axis-aligned bounding box. The returned object is a reference
     * to the mesh's bounding box.
     * @return the bounding box.
     */
    get boundingBox(): AABB;
    /**
     * @description Sets the axis-aligned bounding box. The value is forwarded as-is
     * without validation or recalculation from vertex data.
     */
    set boundingBox(aabb: AABB);
    /**
     * @description Describes the layout of per-vertex data in the vertex buffer.
     * Each entry has:
     * - `attribute` — the semantic slot (e.g. `VertexAttributeType.Position`, `VertexAttributeType.Normal`, `VertexAttributeType.TexCoord0`).
     * - `name` — the shader-facing string identifier.
     * - `componentCount` — number of floats per vertex for this attribute (1–4).
     * Use this to compute stride and offset when parsing the raw buffer from {@link getVertices}.
     * @return array of vertex attribute descriptors.
     */
    getVertexAttributes(): VertexAttributeDesc[];
    /**
     * @description Gets the number of vertices in the mesh.
     * @returns The vertex count.
     */
    getVertexCount(): number;
    /**
     * @description Gets the topology of the mesh.
     * @returns The mesh topology.
     */
    getTopology(): MeshTopology;
    /**
     * @description Raw interleaved vertex buffer as a flat Float32Array. Layout depends on
     * the mesh's vertex attribute configuration (see {@link getVertexAttributes}); the
     * first attribute typically starts at offset 0. To extract only positions, use
     * {@link getVertexAttributes} to compute stride and offset, or use the private
     * `getVertexArray()` helper.
     * @return the raw vertex buffer data.
     */
    getVertices(): Float32Array;
    /**
     * @description Concatenated 16-bit triangle indices from all sub-meshes.
     * Every three consecutive values `(i0, i1, i2)` form one triangle referencing
     * the vertex stream from {@link getVertices}.
     * - Non-`Triangles` topology: if any sub-mesh's topology is not
     *   `MeshTopology.Triangles`, the entire result is cleared to an empty array.
     * - Index upper limit: stored as `Uint16Array`, so each index is in `[0, 65535]`.
     *   Sub-meshes with 32-bit indices that exceed this range cannot be represented;
     *   use per-submesh accessors instead.
     * @return a Uint16Array whose length is a multiple of 3 (or empty).
     */
    getTriangles(): Uint16Array;
  }
  /**
   * @class MeshCollider
   * @description A 3D collider that uses mesh geometry for collision.
   * Use this when primitive shapes such as boxes, spheres, or capsules are not
   * accurate enough for the object.
   * A mesh must be assigned before the collider can initialize; the mesh is
   * authored in the editor (it is not set through a scripting property). When the
   * SceneObject also has a skinned mesh renderer using the same mesh, the
   * collider follows that deforming mesh at runtime. If no mesh is assigned, the
   * collider fails to initialize.
   * {@link convex} switches the runtime shape toward convex-hull collision.
   *
   * @example
   * const meshCollider = obj.getComponent("MeshCollider") as APJS.MeshCollider;
   * meshCollider.convex = true; // simpler convex-hull collision
   */
  class MeshCollider extends Collider {
    protected constructor();
    /**
     * @description Gets or sets whether this mesh collider should use convex-hull
     * collision.
     * When enabled, the runtime shape is simplified toward a convex hull.
     * This is often faster or more stable than full mesh collision, but it may
     * be less accurate for complex concave geometry.
     * @type {boolean}
     */
    get convex(): boolean;
    /**
     * @description Sets whether to use a convex hull for collision detection.
     * When enabled, the mesh is simplified to its convex hull which improves performance
     * but may be less accurate for complex meshes.
     */
    set convex(value: boolean);
  }
  /**
   * @class MeshRenderer
   * @description Renderer component that draws a static {@link Mesh} using a shared
   * {@link Material}. Attach a `MeshRenderer` to a {@link SceneObject} that already owns a
   * mesh to make the geometry visible to the rendering pipeline.
   */
  class MeshRenderer extends Renderer {
    protected constructor();
    /**
     * @description Retrieves the mesh associated with the MeshRenderer.
     * @returns The mesh object.
     */
    get mesh(): Mesh;
    /**
     * @description Sets the mesh for this renderer.
     * The new mesh takes effect on the next render frame.
     * @param value - The mesh to set for the renderer.
     */
    set mesh(value: Mesh);
    /**
     * @description Gets the first shared material used by the MeshRenderer. This is the same
     * material that {@link mainPass} reads its first pass from.
     * @returns The shared material, or `null` if none is assigned.
     */
    get mainMaterial(): Material | null;
    /**
     * @description Sets the main material for the MeshRenderer.
     * The material is shared — mutating it affects all renderers that reference it.
     * Setting `null` detaches the material, after which {@link mainPass} returns `null`.
     * @param value - The material to set as the main material, or `null` to detach.
     */
    set mainMaterial(value: Material | null);
    /**
     * @description Retrieves the main pass from this renderer's shared material.
     * Returns `null` when no shared material is assigned or the material has no passes.
     * @returns The first pass of the shared material, or `null` if unavailable.
     */
    get mainPass(): Pass | null;
    /**
     * @description Retrieves the renderer's axis-aligned bounding box in world space.
     * The AABB is derived from the assigned mesh's bounds transformed by the
     * scene object's world matrix. The value is recomputed on each call. When no mesh
     * is assigned (or the mesh has empty bounds), the last computed box is returned,
     * which is an empty/default AABB if none has been computed yet.
     * @returns The bounding box wrapped as an APJS {@link AABB}.
     */
    getBoundingBox(): AABB;
  }
  /**
   * @description Represents the topology of a mesh, defining how vertices are connected to form primitives.
   * @enum
   */
  enum MeshTopology {
    /** Each vertex is a separate point. */
    Points,
    /** Each pair of consecutive vertices forms a line segment. */
    Lines,
    /** A series of lines where each vertex connects to the next and the last vertex connects back to the first. */
    LineLoop,
    /** A series of connected line segments where each vertex (except the first) uses the previous vertex as an endpoint. */
    LineStrip,
    /** Each set of three consecutive vertices forms a triangle. */
    Triangles,
    /** A series of triangles where each new vertex (after the first two) forms a triangle with the previous two vertices. */
    TriangleStrip,
    /** A series of triangles where each new vertex (after the first two) forms a triangle with the first vertex and the previous vertex. */
    TriangleFan,
    /** The mesh topology is unknown or not specified. */
    Unknown
  }
  /**
   * @class MorpherComponent
   * @description Component that drives blend-shape (morph-target) deformation on a mesh.
   *
   * The morpher reads the base mesh referenced by the host renderer and combines it with
   * named blend-shape channels at runtime to produce the deformed result. Per-channel
   * weights are managed via {@link MorpherComponent.hasBlendShapeWeight},
   * {@link MorpherComponent.getBlendShapeWeight}, {@link MorpherComponent.setBlendShapeWeight}
   * and {@link MorpherComponent.clearBlendShapeWeights}; whether normals are recomputed
   * after morphing is controlled by {@link MorpherComponent.calculateNormal}.
   *
   * Instances are obtained from a scene object that already owns a renderer with
   * blend-shape channels (`sceneObject.getComponent('MorpherComponent')`); construct
   * directly only via the engine's component creation path.
   */
  class MorpherComponent extends Component {
    constructor();
    /**
     * @description Gets or sets whether to calculate normals for the morphed mesh.
     * When true, normals are calculated to ensure proper lighting on the morphed mesh.
     * When false, performance may be better but lighting may appear incorrect.
     */
    get calculateNormal(): boolean;
    set calculateNormal(value: boolean);
    /**
     * @description Checks whether this morpher has a weight registered for the blend
     * shape with the specified name.
     *
     * **Name source.** `name` must exactly match a blend shape channel name as
     * authored on the source mesh asset (typically a glTF/FBX morph target name or
     * the channel name configured on the SkinMeshRenderer's mesh). To enumerate the
     * available channel names at runtime, query the underlying mesh asset's
     * blend-shape metadata; channel names are **case-sensitive** and not normalized
     * (whitespace is preserved). Passing an unknown or differently-cased name simply
     * returns `false`; this method does not throw.
     *
     * @param name The blend shape channel name, exactly as defined on the mesh asset.
     * @returns True if a weight exists for the blend shape, false otherwise.
     */
    hasBlendShapeWeight(name: string): boolean;
    /**
     * @description Gets the current weight value of the blend shape channel with the
     * specified name.
     *
     * **Name source.** As with {@link MorpherComponent.hasBlendShapeWeight}, `name`
     * must exactly match a blend shape channel authored on the source mesh asset and
     * is **case-sensitive**.
     *
     * **Disambiguating "missing" from "weight is 0".** This method returns `0` both
     * when the channel exists with a weight of zero and when no channel of that name
     * is registered. To distinguish the two cases, call
     * {@link MorpherComponent.hasBlendShapeWeight} first:
     * ```ts
     * if (morpher.hasBlendShapeWeight(name)) {
     *   const w = morpher.getBlendShapeWeight(name); // truly the channel's weight
     * } else {
     *   // channel does not exist; getBlendShapeWeight would also return 0
     * }
     * ```
     *
     * @param name The blend shape channel name, exactly as defined on the mesh asset.
     * @returns The weight value of the blend shape channel, or `0` if no channel is registered with that name.
     */
    getBlendShapeWeight(name: string): number;
    /**
     * @description Sets the weight value of the blend shape channel with the specified name.
     *
     * **Name source.** Pass a blend shape channel name that already exists on the
     * source mesh asset (i.e. the same names you would see via
     * {@link MorpherComponent.hasBlendShapeWeight}). Channel names are
     * **case-sensitive** and are taken verbatim from the authoring tool (glTF/FBX
     * morph target name or the SkinMeshRenderer mesh's blend-shape channel).
     *
     * **Unknown-channel behavior.** If no channel exists with the given name on the
     * underlying mesh asset, the call is a **silent no-op** — no weight slot is
     * created and no error is raised. Driving the model requires a matching channel
     * on the source mesh; production code should pass a known channel name and may
     * call `hasBlendShapeWeight` first if the input is untrusted.
     *
     * @param name The blend shape channel name, exactly as defined on the mesh asset.
     * @param weight The weight value to set for the blend shape channel (typically `[0, 1]`; values outside this range are accepted but their visual effect depends on the source mesh).
     */
    setBlendShapeWeight(name: string, weight: number): void;
    /**
     * @description Resets all blend shape weights to 0, effectively clearing all morphing effects.
     * This returns the mesh to its base state without any blend shape deformations.
     */
    clearBlendShapeWeights(): void;
  }
  /**
   * @enum Mp4Event
   * @description MP4 playback events emitted on the texture's object emitter.
   * Each event has one payload object in `event.args[0]` with `eventType`
   * (the Mp4Event value), `eventName` (the event name string), and `mp4Texture`
   * (the texture emitting the event).
   * `KeyFrameInSecond` also provides `prevTime` and `curTime` in seconds.
   * During normal playback it is emitted on each active playback update,
   * not once per second. Compare the times to detect crossed second boundaries,
   * accounting for loops and seeks rather than counting callbacks as seconds.
   * @property {number} PlayBegin
   * @property {number} PlayEnd
   * @property {number} Pause
   * @property {number} Resume
   * @property {number} KeyFrameInSecond
   * @property {number} Stop
   * @example
   * // Pass the texture playing the video; keep the returned function for cleanup.
   * function watchVideoProgress(texture: APJS.Texture): () => void {
   *   const emitter = APJS.EventManager.getObjectEmitter(texture);
   *   const onProgress = (event: APJS.IEvent): void => {
   *     const info = event.args[0];
   *     console.log(info.eventType);  // APJS.Mp4Event.KeyFrameInSecond
   *     console.log(info.eventName);  // "MP4_KEY_SEC"
   *     console.log(info.mp4Texture); // The texture emitting this event
   *     console.log(info.prevTime, info.curTime); // Playback times in seconds
   *   };
   *   emitter.on(APJS.Mp4Event.KeyFrameInSecond, onProgress);
   *   // Call this later to unsubscribe from the same texture with the same callback.
   *   return () => emitter.off(APJS.Mp4Event.KeyFrameInSecond, onProgress);
   * }
   */
  enum Mp4Event {
    PlayBegin,
    PlayEnd,
    Pause,
    Resume,
    KeyFrameInSecond,
    Stop
  }
  /**
   * @class Mp4TextureProvider
   * @description Texture provider that decodes an MP4 video and exposes the
   * latest decoded frame as a regular {@link Texture}.
   *
   * Playback is controlled by {@link Mp4TextureProvider.play}, {@link Mp4TextureProvider.pause},
   * {@link Mp4TextureProvider.resume} and {@link Mp4TextureProvider.stop}, and loops according to
   * {@link Mp4TextureProvider.loopCount}. State transitions emit the corresponding
   * {@link Mp4Event} (`PlayBegin`, `Pause`, `Resume`, `Stop`, and `PlayEnd`)
   * on the texture's object emitter. `KeyFrameInSecond` reports playback updates,
   * not a once-per-second tick; its payload times are in seconds.
   * The {@link Mp4TextureProvider.duration} and {@link Mp4TextureProvider.currentTime}
   * properties are expressed in microseconds (1 second = 1,000,000).
   */
  class Mp4TextureProvider extends TextureDelegateProvider {
    /**
     * @description Gets the number of times the video will loop.
     *
     * - `-1` (default): loop indefinitely; `PlayEnd` is never emitted from the loop
     *   counter and the time wraps back to `0` on every cycle.
     * - `0`: do not advance time — the texture is held at frame `0` (see
     *   {@link Mp4TextureProvider.seekTime}).
     * - Any positive integer `n`: play `n` cycles, then emit `Mp4Event.PlayEnd` and stop
     *   advancing.
     *
     * The value is read by the native loop logic; this wrapper does not clamp out-of-range
     * values, but values other than the documented set are not guaranteed to be meaningful.
     */
    get loopCount(): number;
    /**
     * @description Sets the number of times the video will loop. See the getter for the
     * accepted values; assigning resets the playback state via
     * {@link Mp4TextureProvider.reset} (loop index back to 0, time back to 0, playing
     * resumed).
     */
    set loopCount(value: number);
    /**
     * @readonly
     * @description The total length of the video, in <b>microseconds</b>
     * (1 second = 1,000,000). Returns `-1` when the controller or its video
     * info is not yet available.
     * @type {number}
     */
    get duration(): number;
    /**
     * @readonly
     * @description The current playback position in the video, in
     * <b>microseconds</b> (1 second = 1,000,000). Use the same unit as
     * {@link Mp4TextureProvider.duration}; divide by 1,000,000 to convert to seconds.
     * While paused (via {@link Mp4TextureProvider.pause}) the value holds at the
     * position reached so far; {@link Mp4TextureProvider.stop} and
     * {@link Mp4TextureProvider.play} reset it to `0`.
     * @type {number}
     */
    get currentTime(): number;
    /**
     * @description Starts video playback from the beginning.
     */
    play(): void;
    /**
     * @description Pauses video playback at the current position.
     */
    pause(): void;
    /**
     * @description Resumes paused video playback.
     */
    resume(): void;
    /**
     * @description Stops video playback and resets to initial state.
     */
    stop(): void;
  }
  /**
   * @class OnsetDetector
   * @description Detects the onsets (note attacks / transients) in an audio stream in real time.
   *
   * An onset is detected when the difference in spectrum magnitude between the current and
   * previous audio frames exceeds the configured threshold. Higher threshold = less sensitive,
   * fewer onsets triggered; lower threshold = more sensitive.
   *
   * The detector consumes audio frame-by-frame from the audio graph; each call to
   * {@link OnsetDetector.getResult} returns the value computed for the most recent
   * processed frame, or `-1` while no frame is yet available (e.g. before the first
   * audio buffer has been pushed through the graph). For continuous polling, call
   * `getResult()` from `onUpdate` so each frame's value is read in step with the
   * engine update.
   *
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Onset) as APJS.OnsetDetectorBuilder;
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     builder.setThreshold(20);
   *     this.detector = builder.build();
   * }
   * onUpdate(dt: number) {
   *     if (this.detector) {
   *         const result = this.detector.getResult();
   *         console.log(result);
   *     }
   * }
   */
  class OnsetDetector extends BaseAudioDetector {
    protected constructor();
    /**
     * @description Gets the current onset detection result.
     *
     * The value represents the onset energy of the current audio frame.
     * A higher value indicates a stronger note attack or transient.
     *
     * @returns The onset energy value in the range [0, 1024], or -1 when no result is available.
     */
    getResult(): number;
  }
  /**
   * @class OnsetDetectorBuilder
   * @description A builder for onset detector to set the source of the detector and build the detector.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Onset);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     const detector = builder.build();
   * }
   */
  class OnsetDetectorBuilder extends AudioDetectorBuilder<OnsetDetector> {
    protected constructor();
    /**
     * @description Set the source of the detector.
     * `Microphone` reads from the microphone input and `Music` reads from the online music input;
     * both ignore `audioComponent`.
     * `ExternalFile` reads from the `audioComponent`'s audio clip player, so `audioComponent` must be provided.
     * `None` leaves the builder without a valid detector source.
     * @param type - The type of audio source. When the type is ExternalFile, the audioComponent must be provided.
     * @param audioComponent - The audio component which plays the external audio file; pass `null` for other source types.
     * @example
     * audioDetectorBuilder
     *     .setDetectorSource(APJS.AudioSourceType.ExternalFile, audioComponent)
     *     .build();
     * @returns Builder instance for chaining.
     */
    setDetectorSource(type: AudioSourceType, audioComponent: IAudioComponent | null): this;
    /**
     * @description Set the threshold of the onset detection.
     * @param threshold - The threshold of the onset detection. value range [0, 160]. default value is 10.
     */
    setThreshold(threshold: number): this;
    /**
     * @description Build the onset detector. The detector should be built in `onInit`.
     * Returns `null` when audio detection is not available in the current runtime
     * environment; otherwise returns the built detector. A misconfigured source
     * (e.g. `None`, or `ExternalFile` without a valid audio component) still returns a
     * detector instance but it will not produce results.
     */
    build(): OnsetDetector | null;
  }
  /**
   * @description Device OS
   * @enum
   * @property Android - Android system.
   * @property IOS - IOS system.
   * @property Windows - Windows system
   * @property MacOS - MacOS system.
   * @property Linux - Linux system.
   * @property HarmonyOS - HarmonyOS system.
   */
  enum OS {
    Android = 0,
    IOS = 1,
    Windows = 2,
    MacOS = 3,
    Linux = 4,
    HarmonyOS = 5
  }
  /**
   * @class Pass
   * @description Represents a single render pass of a {@link Material}.
   * Each Material exposes one or more {@link Pass} objects via
   * {@link Material.mainPass} and {@link Material.passes}; modifying a Pass
   * (uniforms, render state, keywords, etc.) directly affects how the owning
   * material renders. Pass instances are created and managed by the engine and
   * should not be constructed manually.
   */
  class Pass extends AObject {
    protected constructor();
    /**
     * @description Indicates whether depth testing is enabled for the pass.
     * @returns True if depth testing is enabled, false otherwise.
     */
    get depthTest(): boolean;
    /**
     * @description Sets the depth test state for the render pass.
     * @param value - True to enable depth testing, false otherwise.
     */
    set depthTest(value: boolean);
    /**
     * @description Indicates whether depth writing is enabled for the pass.
     * @returns True if depth writing is enabled, false otherwise.
     */
    get depthWrite(): boolean;
    /**
     * @description Sets the depth write state for the pass.
     * @param value - True to enable depth writing, false otherwise.
     */
    set depthWrite(value: boolean);
    /**
     * @description The depth function used for depth comparison in the rendering pass.
     * @returns The depth function.
     */
    get depthFunction(): DepthFunction;
    /**
     * @description Sets the depth function for the pass.
     * @param value - The depth function to set.
     */
    set depthFunction(value: DepthFunction);
    /**
     * @description The stencil state of the pass.
     * After modifying the returned object, assign it back to this property to apply the
     * change to the pass: `const state = pass.stencilState; state.enable = true;
     * pass.stencilState = state;`. Mutating the returned object alone does not refresh
     * the pass render state.
     * @return the stencil state.
     */
    get stencilState(): StencilState;
    /**
     * @description Applies a stencil state to the pass. Use this assignment after changing
     * any property on an object returned by {@link stencilState}. The existing {@link depthTest},
     * {@link depthWrite}, and {@link depthFunction} values are preserved.
     * @param value - The stencil state to set.
     */
    set stencilState(value: StencilState);
    /**
     * @description The blend state of the pass, which defines how colors are blended during rendering.
     * @return The blend state.
     */
    get blendState(): BlendState;
    /**
     * @description Sets the blend state for the pass.
     * @param value - The blend state to set.
     */
    set blendState(value: BlendState);
    /**
     * @description Controls which color channels (R, G, B, A) are written to the
     * screen. Combine {@link ColorMask} flags with bitwise OR to enable multiple
     * channels (e.g. `ColorMask.R | ColorMask.G | ColorMask.B` writes RGB but
     * not alpha). Channels not included in the mask are left unchanged in the
     * output. default: `0xF` (all channels enabled).
     * @return the color write mask.
     */
    get colorMask(): ColorMask;
    /**
     * @description Sets the color mask for the pass.
     * @param value - The color mask to set.
     */
    set colorMask(value: ColorMask);
    /**
     * @description The culling mode for the rendering pass, which determines how triangles are culled based on their orientation.
     * @returns The cull mode.
     */
    get cullMode(): CullMode;
    /**
     * @description Sets the cull mode for the pass.
     * @param value - The cull mode to set.
     */
    set cullMode(value: CullMode);
  }
  /**
   * @description Current-frame person foreground mask from portrait matting.
   * Obtain this with AlgorithmResult.getPersonMask and check for null. It covers
   * the image rather than one indexed person. Width and height are positive, and
   * the buffer length is width * height; sample mask[y * width + x] at integer
   * coordinates within these bounds. An all-zero buffer is a valid empty mask.
   * Treat the buffer as read-only and reacquire it each frame, or copy its bytes
   * when retaining historical output. Use the actual mask dimensions each frame.
   */
  interface PersonMaskInterface {
    /** @description Row-major foreground coverage bytes, 0-255, with width * height elements. */
    readonly mask: Uint8Array;
    /** @description Actual mask width in pixels. */
    readonly width: number;
    /** @description Actual mask height in pixels. */
    readonly height: number;
  }
  /**
   * @class PetFaceCapture
   * @description Provides script access to the pet landmark target configured by a Pet Face Capture component.
   */
  class PetFaceCapture extends Component {
    protected constructor();
    /**
     * @description The cat or dog landmark detector selected when this component was created. This
     * value is read-only at runtime and does not identify a face index.
     * @readonly
     */
    get trackingTarget(): PetFaceTrackingType;
    /**
     * @description The 1-based ID of the pet face to track, in the range `1` to `5`.
     */
    get faceID(): number;
    set faceID(value: number);
  }
  /**
   * @description Identifies the pet landmark detector wrapped by a {@link PetFaceCapture}. This value
   * describes the tracked species, not a face index, and reports the component's authoring-time
   * configuration through {@link PetFaceCapture.trackingTarget}.
   * @enum
   */
  enum PetFaceTrackingType {
    /** Indicates that the wrapped native component is configured to track cat faces. */
    Cat = 2,
    /** Indicates that the wrapped native component is configured to track dog faces. */
    Dog = 3
  }
  /**
   * 2D physics world manager (singleton). Provides global physics settings,
   * raycasting, and controls the 2D physics simulation.
   *
   * `Physics2D.*` static accessors expose world settings; see each property's runtime behavior.
   * Per-object properties (mass, velocity, etc.) are set on individual {@link RigidBody2D} components.
   *
   * ## Record / Reset
   * When recording starts, `resetPhysics()` is called automatically (if `auto_reset_effect` is enabled),
   * restoring all bodies to their initial positions and velocities.
   *
   * @example
   * // Get the configured world gravity in m/s^2
   * const gravity = APJS.Physics2D.gravity; // Vector2f(0, -9.8) by default
   * // Slow down physics simulation
   * APJS.Physics2D.timeSpeed = 0.5;
   * // Cast a ray
   * const ray = new APJS.Ray(new APJS.Vector3f(0, 10, 0), new APJS.Vector3f(0, -1, 0));
   * const hits = APJS.Physics2D.raycast2D(ray, 100, true);
   */
  class Physics2D {
    /**
     * @description Global 2D gravity acceleration in m/s^2.
     * Default is (0, -9.8), simulating Earth-like gravity pulling downward.
     * Applied when the physics world initializes. Runtime assignment only changes the cached value,
     * not the gravity of the existing physics world.
     * Per-body gravity can be controlled via {@link RigidBody2D.useGravity} and {@link RigidBody2D.gravityScale}.
     * **Not reset** on record start — retains the value you set.
     * @default new Vector2f(0, -9.8)
     */
    static get gravity(): Vector2f;
    static set gravity(value: Vector2f);
    /**
     * @description Scales how fast the 2D physics simulation steps forward.
     * 1.0 runs at normal simulation speed, 0.5 runs in slow motion, and 0.0 stops physics updates.
     * Runtime changes scale simulation time, not script update delta time or the gravity setting.
     * **Not reset** on record start.
     * @default 1.0
     */
    static get timeSpeed(): number;
    static set timeSpeed(value: number);
    /**
     * @description Casts a ray through the 2D physics world and returns the matching hits.
     *
     * @param ray The ray with origin and direction. Origin and direction are interpreted in 2D world XY space; Z is ignored. Direction must be non-zero.
     * @param maxDistance Maximum cast distance in 2D world units. Must be positive.
     * @param nearest If true, returns only the closest hit. If false, returns all hits along the ray (up to 16). The non-nearest hits are returned in the order the engine reports them, not sorted by distance.
     * @param layerMask Optional layer mask to filter which layers can be hit. If omitted, all layers are tested.
     * @returns Array of {@link RaycastHit2D}. Empty array if nothing was hit.
     *
     * @example
     * // Shoot a ray downward from (100, 200) to detect what's below
     * const ray = new APJS.Ray(new APJS.Vector3f(100, 200, 0), new APJS.Vector3f(0, -1, 0));
     * const hits = APJS.Physics2D.raycast2D(ray, 50, true);
     * if (hits.length > 0) {
     *     console.log("Hit at:", hits[0].point);
     * }
     */
    static raycast2D(ray: Ray, maxDistance: number, nearest: boolean, layerMask?: LayerSet): RaycastHit2D[];
  }
  /**
   * @class Physics3D
   * @description 3D physics world manager (singleton). Provides global 3D physics settings,
   * raycasting, and controls the PBD physics simulation.
   *
   * `Physics3D.*` static accessors expose world settings; see each property's runtime behavior.
   * Per-object properties (mass, velocity, etc.) are set on individual {@link RigidBody} components.
   *
   * ## Record / Reset
   * When recording starts, `resetPhysics()` is called automatically (if `auto_reset_effect` is enabled),
   * which resets all body positions/velocities, reinitializes cloth/soft body actors, and clears collision state.
   * Global properties (gravity, timeScale) are **not** reset.
   *
   * @example
   * // Get world gravity (~Earth gravity in internal units, 9.8 * gravityFactor)
   * const gravity = APJS.Physics3D.gravity; // Vector3f(0, -980, 0) by default
   * // Cast a ray downward from (0, 10, 0)
   * const origin = new APJS.Vector3f(0, 10, 0);
   * const dir = new APJS.Vector3f(0, -1, 0);
   * const hits = APJS.Physics3D.raycast(
   *     new APJS.Ray(origin, dir), 100, true);
   */
  class Physics3D {
    /**
     * @description 3D world gravity acceleration in internal engine units. Default is (0, -980, 0).
     * The value 980 = 9.8 m/s^2 * {@link gravityFactor} (100), making gravity consistent
     * with forces applied via {@link RigidBody.addForce} (which are also scaled internally).
     *
     * Bodies with {@link RigidBody.useGravity} enabled read this when initialized.
     * Runtime assignment changes the cached value but does not refresh existing bodies' gravity forces.
     * For custom gravity on one body, disable its useGravity and apply a continuous force instead.
     * **Not reset** on record start.
     */
    static get gravity(): Vector3f;
    static set gravity(value: Vector3f);
    /**
     * @description Scale used to initialize world gravity and to scale body force and torque inputs.
     * Defaults to `100` in normal mode, `10` in framerate-independent mode (set automatically during init).
     *
     * Runtime changes affect subsequent force and torque applications, but do not recompute
     * world gravity or forces already applied. Prefer per-body forces over changing this global scale.
     */
    static get gravityFactor(): number;
    static set gravityFactor(value: number);
    /**
     * @description 3D physics simulation time multiplier. Default is 1.0.
     * Scales the delta time passed to the simulator, not script update delta time.
     * The default fixed-step mode ignores this delta time; runtime writes do not slow or pause it.
     * Time scaling requires framerate-independent or slow-motion mode selected during initialization.
     * Assigning this property at runtime does not switch those modes.
     * **Not reset** on record start.
     */
    static get timeScale(): number;
    static set timeScale(value: number);
    /**
     * @description Casts a ray in 3D space and returns hit information.
     * @param ray The ray with origin and direction.
     * @param maxDistance Maximum cast distance.
     * @param nearest If true, returns only the closest hit; if false, all hits.
     * @param layerMask Optional {@link LayerSet} to filter which layers are tested.
     *   Each enabled bit selects the matching physics category. Defaults to 0xffffff (all category bits).
     *   Colliders use their SceneObject layer for categories 0-10; higher layers share category 10.
     * @returns Array of {@link RaycastHit3D}. Empty array if nothing was hit.
     *
     * @example
     * // Cast downward and get the first hit
     * const origin = new APJS.Vector3f(0, 10, 0);
     * const dir = new APJS.Vector3f(0, -1, 0);
     * const hits = APJS.Physics3D.raycast(
     *     new APJS.Ray(origin, dir), 50, true);
     * if (hits.length > 0) {
     *     console.log("Hit:", hits[0].colliderObject?.name);
     * }
     * @example
     * // Only hit objects on layer 1
     * const layerMask = new APJS.LayerSet();
     * layerMask.set(1, true);
     * const hits = APJS.Physics3D.raycast(ray, 50, false, layerMask);
     */
    static raycast(ray: Ray, maxDistance: number, nearest: boolean, layerMask?: LayerSet): RaycastHit3D[];
  }
  /**
   * @class PhysicsMaterial
   * @description Physics material used to control collider contact response.
   * Its public properties `staticFriction`, `dynamicFriction`, and `bounciness` typically use values in the range [0, 1], and their default values are 0.
   * These properties work together to control how surfaces resist sliding and how strongly they bounce after collision.
   * In 2D physics, the collider uses `staticFriction` as its friction value. Changing `dynamicFriction` alone does not change the actual 2D friction result.
   * The material takes effect after it is assigned to a `Collider` or `Collider2D` that participates in physics simulation.
   */
  class PhysicsMaterial extends AObject {
    protected constructor();
    /**
     * @description Gets the static friction coefficient.
     * Range: [0, 1].
     * Larger values make surfaces harder to start sliding when they are in contact.
     * The default value is 0.
     * @type {number}
     */
    get staticFriction(): number;
    /**
     * @description Sets the static friction coefficient.
     * Range: [0, 1].
     * Larger values make surfaces harder to start sliding when they are in contact.
     * The default value is 0.
     * @param value - The static friction coefficient.
     */
    set staticFriction(value: number);
    /**
     * @description Gets the dynamic friction coefficient.
     * Range: [0, 1].
     * Larger values make surfaces lose motion more quickly while sliding in contact.
     * The default value is 0.
     * In 2D physics, dynamic friction is currently treated the same as `staticFriction`, so this value does not take effect independently.
     * @type {number}
     */
    get dynamicFriction(): number;
    /**
     * @description Sets the dynamic friction coefficient.
     * Range: [0, 1].
     * Larger values make surfaces lose motion more quickly while sliding in contact.
     * The default value is 0.
     * In 2D physics, dynamic friction is currently treated the same as `staticFriction`, so this value does not take effect independently.
     * @param value - The dynamic friction coefficient.
     */
    set dynamicFriction(value: number);
    /**
     * @description Gets the bounciness (also elasticity).
     * Range: [0, 1].
     * Larger values make the material more elastic and bouncier after collision.
     * The default value is 0.
     * @type {number}
     */
    get bounciness(): number;
    /**
     * @description Sets the bounciness (also elasticity).
     * Range: [0, 1].
     * Larger values make the material more elastic and bouncier after collision.
     * The default value is 0.
     * @param value - The bounciness value.
     */
    set bounciness(value: number);
  }
  /**
   * @description Controls which target-space data drives the entity containing {@link PinToMesh}.
   * `Local` follows the target transform origin and does not resolve {@link PinToMesh.uv}; the two
   * position modes resolve the UV0 surface point, while only `PositionAndDirection` also replaces the
   * entity rotation with a mesh-derived surface frame.
   * @enum
   */
  enum PinOrientation {
    /**
     * Uses the target transform origin plus position offset, ignores the UV surface point, and
     * preserves the pinned entity's existing rotation.
     */
    Local,
    /** Moves the entity to the resolved UV surface point plus offset while preserving its rotation. */
    Position,
    /**
     * Moves the entity to the resolved UV surface point and aligns it to the mesh-derived frame;
     * {@link PinToMesh.useVertexNormal} selects smooth vertex normals or the triangle face normal.
     */
    PositionAndDirection
  }
  /**
   * @class PinToMesh
   * @description Pins an entity to a target Renderer mesh at a UV0 coordinate. Position-based modes
   * require a target mesh with triangle indices and UV0 data; an unresolved UV leaves the pin invalid.
   */
  class PinToMesh extends Component {
    protected constructor();
    /**
     * @description The target Transform whose entity supplies the Renderer mesh. MeshRenderer and
     * SkinMeshRenderer targets are supported when their mesh has triangles and UV0 data. null or an
     * invalid mesh prevents the pin from resolving.
     */
    get target(): Transform | null;
    /**
     * @description Sets the target mesh to pin to.
     */
    set target(value: Transform | null);
    /**
     * @description UV0 coordinate used to find a triangle and interpolate its 3D surface point. The
     * supported range for each component is [0, 1]; increasing U or V moves according to the mesh's
     * authored UV layout. APJS does not clamp the value, and a coordinate outside all UV triangles
     * leaves the pin unresolved.
     */
    get uv(): Vector2f;
    /**
     * @description Sets the UV coordinate on the target mesh to pin to.
     */
    set uv(value: Vector2f);
    /**
     * @description Position offset applied from the resolved pin frame. (0, 0, 0) stays on the
     * computed point; a larger vector magnitude moves the entity farther away in scene units. No
     * fixed range is enforced.
     */
    get offsetPosition(): Vector3f;
    /**
     * @description Sets the position offset from the pinned point.
     */
    set offsetPosition(value: Vector3f);
    /**
     * @description Additional XYZ Euler rotation in degrees. It is applied only in
     * PositionAndDirection mode; (0, 0, 0) keeps the computed surface orientation, and larger
     * absolute angles rotate farther, with each axis repeating every 360 degrees. No fixed range is
     * enforced.
     */
    get offsetRotation(): Vector3f;
    /**
     * @description Sets the rotation offset from the pinned point.
     */
    set offsetRotation(value: Vector3f);
    /**
     * @description Selects whether the target origin, UV-derived position, or UV-derived position and
     * surface frame drive the pinned entity.
     */
    get orientation(): PinOrientation;
    /**
     * @description Sets the orientation mode of the pinned object.
     */
    set orientation(value: PinOrientation);
    /**
     * @description Controls the surface normal used by PositionAndDirection. true interpolates vertex
     * normals for smooth orientation across triangles; false uses the current triangle's face normal
     * for a faceted result. If the mesh has no normal stream, the implementation falls back to the
     * face normal.
     */
    get useVertexNormal(): boolean;
    /**
     * @description Sets whether to use the vertex normal for orientation.
     */
    set useVertexNormal(value: boolean);
  }
  /**
   * @class PitchDetector
   * @description Detects the fundamental pitch (f0) of the audio source in real time.
   *
   * The higher the pitch, the greater the returned value.
   * Typical human voice range is approximately 85 Hz (deep male) to 255 Hz (high female).
   * Musical instruments can reach up to 650 Hz within this detector's range.
   *
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Pitch);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     this.detector = builder.build();
   * }
   * onUpdate(dt: number) {
   *     if (this.detector) {
   *         const result = this.detector.getResult();
   *         console.log(result);
   *     }
   * }
   */
  class PitchDetector extends BaseAudioDetector {
    protected constructor();
    /**
     * @description Gets the current pitch detection result.
     *
     * The value represents the detected fundamental frequency in Hz.
     * A larger value means a higher pitch.
     *
     * @returns The detected pitch in Hz, in the range [45, 650]. Returns -1 when no pitch is detected
     * (e.g., during silence or non-pitched noise).
     */
    getResult(): number;
  }
  /**
   * @class PitchDetectorBuilder
   * @description A builder for pitch detector to set the source of the detector and build the detector.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Pitch);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     const detector = builder.build();
   * }
   */
  class PitchDetectorBuilder extends AudioDetectorBuilder<PitchDetector> {
    protected constructor();
    /**
     * @description Set the source of the detector.
     * @param type - The type of audio source. Default is None. When the type is ExternalFile, the audioComponent must be provided.
     * @param audioComponent - The audio component which plays the external audio file.
     * @example
     * audioDetectorBuilder
     *     .setDetectorSource(APJS.AudioSourceType.ExternalFile, audioComponent)
     *     .build();
     * @returns Builder instance for chaining.
     */
    setDetectorSource(type: AudioSourceType, audioComponent: IAudioComponent | null): this;
    /**
     * @description Build the pitch detector. Note that the detector should be built in onInit, otherwise it will return null.
     */
    build(): PitchDetector | null;
  }
  /**
   * @class PointJoint
   * @description A 3D point joint. Keeps this joint's {@link anchor} and
   * {@link connectedAnchor} at the same world-space position while still
   * allowing the connected RigidBodies to rotate relative to each other.
   * Internally uses a single zero-length distance joint without an
   * additional rotation constraint.
   * Can break at {@link breakingForce}. If it breaks, only that distance
   * constraint stops solving; the connected RigidBodies do not freeze.
   *
   * @example
   * const pointJoint = obj.getComponent("PointJoint") as APJS.PointJoint;
   * pointJoint.breakingForce = -1; // keep the point constraint from breaking
   */
  class PointJoint extends Joint3D {
    protected constructor();
  }
  /**
   * @class PointLight
   * @description Represents a point light source in 3D space. It emits light
   * equally in all directions from the light's world position, fading with distance.
   * Key parameters:
   * <br/>- {@link PointLight.attenuationRange}: distance (in world units) over which the light fades;
   *   range `[0.01, 9999]`, values below `0.01` are clamped.
   * <br/>- {@link Light.color}: RGB tint, channels in `[0, 1]`, default `(1, 1, 1)`.
   * <br/>- {@link Light.intensity}: brightness scalar, range `[0, 7]`, default `1`.
   * <br/>- {@link Light.renderLayer}: the {@link LayerSet} of scene objects this light affects.
   */
  class PointLight extends Light {
    protected constructor();
    /**
     * @description Gets the attenuation range of the point light.
     * The value uses the same distance unit as the scene transform.
     * It controls how quickly the light fades as distance increases in world space.
     * Larger values make the light affect a farther area, while smaller values make it fade more quickly.
     * Range: [`0.01`, `9999`]. Values less than `0.01` are clamped to `0.01`.
     */
    get attenuationRange(): number;
    /**
     * @description Sets the attenuation range of the point light.
     * The value uses the same distance unit as the scene transform.
     * It controls how quickly the light fades as distance increases in world space.
     * Larger values make the light affect a farther area, while smaller values make it fade more quickly.
     * Range: [`0.01`, `9999`]. Values less than `0.01` are clamped to `0.01`.
     */
    set attenuationRange(value: number);
  }
  /**
   * @class PolygonCollider2D
   * @description A filled 2D polygon collider.
   * It can represent convex shapes directly and concave shapes through convex
   * decomposition data stored on the component.
   *
   * @example
   * const polygon = obj.getComponent("PolygonCollider2D") as APJS.PolygonCollider2D;
   * polygon.offset = new APJS.Vector2f(0, 0);
   * polygon.isTangible = true;
   */
  class PolygonCollider2D extends Collider2D {
    protected constructor();
  }
  /**
   * @class PolylineCollider2D
   * @description A collider that generates a polyline shape for physics and rendering.
   * ### Core Features
   * - Generates a ribbon-like polyline collider from a list of Vector2f points
   * - Automatically synchronizes the physics collider shape with the visual mesh
   * - Supports dynamic updates of width, points, and resolution (pixelPerUnit) at runtime
   *
   * ### Physics & Rendering Integration
   * Unlike standard colliders, PolylineCollider2D automatically generates a renderable mesh based on its shape.
   * - **Rendering:** To make the line visible, you must assign the `.renderMesh` property to a `MeshRenderer` component on the same or different object.
   * - **Physics:** Internally, it creates a composite PolygonCollider. It requires a `RigidBody2D` to function in the physics simulation (it will auto-attach to one if available, or create a static one).
   *
   * @example Basic Usage: Creating a V-Shape Line
   * // Add the component via script (not available in the editor UI)
   * const polyline = sceneObject.addComponent('PolylineCollider2D') as PolylineCollider2D;
   *
   * // 1. Configure visual properties
   * polyline.width = 20.0;
   * polyline.pixelPerUnit = 32.0;
   *
   * // 2. Define points (e.g. a V-shape)
   * const points = [
   *   new Vector2f(-100, 100),
   *   new Vector2f(0, 0),
   *   new Vector2f(100, 100)
   * ];
   *
   * // 3. Set positions (This triggers Mesh generation and Physics update)
   * polyline.positions = points;
   *
   * // 4. Visualize it (Optional)
   * // Assign the generated mesh to a MeshRenderer to see it
   * const meshRenderer = sceneObject.getComponent('MeshRenderer') as MeshRenderer | null;
   * if (meshRenderer) {
   *   meshRenderer.mesh = polyline.getRenderMesh();
   * }
   */
  class PolylineCollider2D extends Collider2D {
    constructor();
    /**
     * @property positions
     * @description Set or Get the center positions of points in the polyline collider.
     * Points are given in pixel-space coordinates (converted to world units by
     * dividing by {@link PolylineCollider2D.pixelPerUnit}).
     * At least 2 points are required to build a valid collider and mesh; with
     * fewer points (including an empty array) the geometry is treated as invalid,
     * the collider stops colliding, and {@link getRenderMesh} yields no geometry.
     * * **Note:** Setting this property will trigger a regeneration of the collider geometry.
     */
    get positions(): Array<Vector2f>;
    set positions(value: Array<Vector2f>);
    /**
     * @property width
     * @description Line width in pixels. Divided by {@link PolylineCollider2D.pixelPerUnit} to
     * convert to world units. Non-positive values are clamped to a minimum effective width
     * (0.01 world units) so the collider never collapses to zero thickness.
     * Default: `1.0`.
     */
    get width(): number;
    set width(value: number);
    /**
     * @property pixelPerUnit
     * @description Pixels-per-unit scale that converts pixel-space values (both
     * {@link PolylineCollider2D.width} and {@link PolylineCollider2D.positions}) to world units.
     * Must be > 0; a zero or negative value produces undefined geometry.
     * Default: `32.0`.
     */
    get pixelPerUnit(): number;
    set pixelPerUnit(value: number);
    /**
     * @description Returns the renderable mesh for this polyline. The mesh is lazily synced
     * on access when the shape has changed; otherwise returns the cached mesh.
     * @returns The mesh, or `null` when there are fewer than 2 positions (insufficient
     * geometry to form a ribbon). Once a mesh has been created, invalid geometry clears
     * its vertex data but does not reset the return to `null`.
     */
    getRenderMesh(): Mesh | null;
  }
  /**
   * @class Prefab
   * @description
   * This is the type of Prefab
   * <br/>Prefabs allow you to create reusable SceneObject instances
   */
  class Prefab extends AObject {
    protected constructor();
    /**
     * @description Instantiates a copy of this prefab as a child of `parent`.
     * The new instance joins the same scene as `parent`.
     * @param parent - The parent scene object that will own the new instance.
     * Required; must be a live `SceneObject` attached to a scene.
     * @returns The instantiated scene object, or `null` if instantiation fails — for example
     * when this prefab holds no valid prefab data, or when `parent` is not a live scene object
     * attached to a scene.
     */
    instantiate(parent: SceneObject): SceneObject | null;
  }
  /**
   * @class Provider
   * @description base Provider for texture and mesh
   * @inheritdoc
   */
  class Provider {
  }
  /**
   * @class Quaternionf
   * A quaternion `{x, y, z, w}` representing a rotation in 3D space.
   * The four components are mutable plain numbers; only the combination is
   * meaningful as a rotation — do not interpret individual components in isolation.
   * Compared to Euler angles, quaternions support smooth interpolation
   * ({@link slerp} / {@link lerp}) and do not suffer from gimbal lock.
   * Use {@link multiply} to concatenate multiple rotations into a single quaternion.
   * Rotation operations assume a unit quaternion; call {@link normalize}
   * after manual component changes or accumulated multiplications to avoid drift.
   * Angle inputs/outputs use **radians**.
   */
  class Quaternionf {
    /**
     * @description The x component of the quaternion vector part.
     * Defaults to `0`. No range validation is performed;
     * for a valid rotation the four components must satisfy `x² + y² + z² + w² = 1`.
     * Create rotations with `Quaternionf.makeFromAngleAxis` or
     * `Quaternionf.makeFromEulerAngles`; use `set(x, y, z, w)` to assign all four components at once.
     */
    x: number;
    /**
     * @description The y component of the quaternion vector part.
     * Defaults to `0`. No range validation is performed;
     * for a valid rotation the four components must satisfy `x² + y² + z² + w² = 1`.
     * Create rotations with `Quaternionf.makeFromAngleAxis` or
     * `Quaternionf.makeFromEulerAngles`; use `set(x, y, z, w)` to assign all four components at once.
     */
    y: number;
    /**
     * @description The z component of the quaternion vector part.
     * Defaults to `0`. No range validation is performed;
     * for a valid rotation the four components must satisfy `x² + y² + z² + w² = 1`.
     * Create rotations with `Quaternionf.makeFromAngleAxis` or
     * `Quaternionf.makeFromEulerAngles`; use `set(x, y, z, w)` to assign all four components at once.
     */
    z: number;
    /**
     * @description The w (scalar) component of the quaternion.
     * Defaults to `1` (identity rotation). No range validation is performed;
     * for a valid rotation the four components must satisfy `x² + y² + z² + w² = 1`.
     * Create rotations with `Quaternionf.makeFromAngleAxis` or
     * `Quaternionf.makeFromEulerAngles`; use `set(x, y, z, w)` to assign all four components at once.
     */
    w: number;
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * @param x - The x component of the quaternion (optional).
     * @param y - The y component of the quaternion (optional).
     * @param z - The z component of the quaternion (optional).
     * @param w - The w component of the quaternion (optional).
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * @description Sets the quaternion data with the specified x, y, z, and w components.
     * @param x - The x component of the quaternion.
     * @param y - The y component of the quaternion.
     * @param z - The z component of the quaternion.
     * @param w - The w component of the quaternion.
     * @returns This instance of Quaternionf with updated values.
     */
    set(x: number, y: number, z: number, w: number): this;
    /**
     * @description Creates and returns a clone of the current Quaternionf instance.
     * @returns A new Quaternionf object with the same values as the original.
     */
    clone(): Quaternionf;
    /**
     * @description Returns the dot product of the current quaternion with another quaternion.
     * @param other - The quaternion to calculate the dot product with.
     * @returns The dot product as a number.
     */
    dot(other: Quaternionf): number;
    /**
     * @description Strict component-wise equality (`===`). No tolerance, no antipodal
     * handling — `q` and `-q` (same rotation) are **not** equal.
     * For approximate comparison use `Math.abs(a.dot(b)) > 1 - epsilon`.
     * @param other - The quaternion to compare with.
     * @returns `true` if all four components are strictly equal.
     */
    equals(other: Quaternionf): boolean;
    /**
     * @description Returns the rotation angle in `[0, π]` radians.
     * Assumes a unit quaternion; the result is meaningless otherwise.
     * @returns The rotation angle in radians.
     */
    getAngle(): number;
    /**
     * @description Returns the rotation axis as a unit vector.
     * Assumes a unit quaternion. For the identity rotation (angle ≈ 0) the axis
     * is undefined and the result may contain `Infinity` or `NaN`.
     * @returns The rotation axis as a `Vector3f`.
     */
    getAxis(): Vector3f;
    /**
     * @description Inverts this quaternion **in place** to represent the
     * opposite rotation. Valid only for a unit quaternion; on a non-unit
     * quaternion the result is the conjugate, not the true inverse.
     * Modifies this quaternion in place and returns it for chaining.
     * @returns This instance after inversion.
     */
    inverse(): this;
    /**
     * @description Multiplies this quaternion by `other` in place (`this = this * other`).
     * Not commutative: `a * b` means "apply rotation `b` first, then `a`".
     * Both operands should be unit quaternions; call {@link normalize} after
     * long chains to compensate for floating-point drift.
     * @param other - The right-hand-side quaternion.
     * @returns This quaternion after multiplication.
     */
    multiply(other: Quaternionf): Quaternionf;
    /**
     * @description Returns the result of rotating `other` by this quaternion.
     * Assumes a unit quaternion; the result is meaningless otherwise.
     * @param other - The vector to be rotated.
     * @returns A new `Vector3f` representing the rotated vector.
     */
    multiplyVector(other: Vector3f): Vector3f;
    /**
     * @description Normalizes this quaternion in place to unit length.
     * If the length is `0`, resets to identity `(0, 0, 0, 1)`.
     * Modifies this quaternion in place and returns it for chaining.
     * @returns This quaternion after normalization.
     */
    normalize(): Quaternionf;
    /**
     * @description Converts this quaternion to its Euler-angle representation.
     * The intrinsic rotation order is **Y → X → Z** (yaw → pitch → roll);
     * components map to `(x = pitch, y = yaw, z = roll)`. All values are
     * in **radians**. Assumes a unit quaternion.
     * @returns A {@link Vector3f} containing `(pitch, yaw, roll)` in radians.
     */
    toEulerAngles(): Vector3f;
    /**
     * @description Returns a string representation of the quaternion.
     * @returns A string representation of the quaternion in the format "Quaternionf(x, y, z, w)".
     */
    toString(): string;
    /**
     * @description Returns a new quaternion representing a rotation by `angle`
     * radians around `axis`. `axis` must be a unit vector; a non-unit axis
     * produces a non-unit quaternion. A zero-length axis produces undefined
     * results.
     * @param angle - The rotation angle in **radians**.
     * @param axis - The rotation axis; must be unit length.
     * @returns A new {@link Quaternionf} representing the rotation.
     */
    static makeFromAngleAxis(angle: number, axis: Vector3f): Quaternionf;
    /**
     * @description Returns a new quaternion built from Euler angles.
     * The intrinsic rotation order is **Y → X → Z** (yaw → pitch → roll);
     * `eulerVec` is interpreted as `(x = pitch, y = yaw, z = roll)` in **radians**.
     * @param eulerVec - A {@link Vector3f} of `(pitch, yaw, roll)` in radians.
     * @returns A new {@link Quaternionf} created from the given Euler angles.
     */
    static makeFromEulerAngles(eulerVec: Vector3f): Quaternionf;
    /**
     * @description Returns the identity quaternion.
     * @returns The identity quaternion represented as a Quaternionf object.
     */
    static identity(): Quaternionf;
    /**
     * @description Linearly interpolates between `a` and `b`, choosing the
     * shorter great-circle path when `a · b < 0`. The result is **not**
     * normalized — call {@link normalize} before using it as a rotation.
     * For constant angular velocity use {@link slerp}.
     * @param a - The first quaternion.
     * @param b - The second quaternion.
     * @param t - Interpolation factor; not clamped to `[0, 1]`.
     * @returns A new linearly interpolated quaternion (not normalized).
     */
    static lerp(a: Quaternionf, b: Quaternionf, t: number): Quaternionf;
    /**
     * @description Returns a quaternion that rotates the local `+Z` axis to
     * point along `forward`, with `up` as the reference up direction.
     * Inputs do not need to be pre-normalized. Zero-length `forward` or `up`,
     * or parallel `forward`/`up`, return the identity quaternion.
     * @param forward - The forward direction.
     * @param up - The reference up direction.
     * @returns A new {@link Quaternionf} representing the orientation.
     */
    static lookAt(forward: Vector3f, up: Vector3f): Quaternionf;
    /**
     * @description Returns the shortest-arc rotation that maps `from` to `to`.
     * Inputs do not need to be pre-normalized. Parallel inputs return the
     * identity; anti-parallel inputs return a 180° rotation around an
     * arbitrary perpendicular axis. Zero-length inputs return the identity.
     * @param from - The initial direction.
     * @param to - The target direction.
     * @returns A {@link Quaternionf} representing the shortest-arc rotation.
     */
    static rotationFromTo(from: Vector3f, to: Vector3f): Quaternionf;
    /**
     * @description Spherically interpolates between `a` and `b` along the
     * shorter great-circle arc, producing a unit quaternion. Both inputs
     * should be unit quaternions. `t` is not clamped; only `0` and `1`
     * are special-cased to return clones.
     * @param a - The starting quaternion.
     * @param b - The ending quaternion.
     * @param t - Interpolation factor; not clamped to `[0, 1]`.
     * @returns A new unit {@link Quaternionf} on the great-circle path.
     */
    static slerp(a: Quaternionf, b: Quaternionf, t: number): Quaternionf;
    /**
     * @description Returns the rotation angle between `a` and `b` in `[0, π]`
     * radians. Antipodal quaternions are treated as the same rotation.
     * Both inputs must be unit quaternions; the result is incorrect on non-unit inputs.
     * @param a - The first quaternion.
     * @param b - The second quaternion.
     * @returns The angle in radians, in `[0, π]`.
     */
    static angleBetween(a: Quaternionf, b: Quaternionf): number;
  }
  /**
   * @class Ray
   * @description An infinite half-line in 3D space defined by a world-space
   * `origin` and a unit-length `direction`. Used as input to spatial queries
   * such as {@link Physics3D.raycast} and {@link Physics2D.raycast2D}.
   *
   * Setting `direction` auto-normalizes the vector. A zero-length direction
   * produces `NaN` components. Reading `direction` always returns a unit vector.
   *
   * Equality is strict component-wise (`===`) comparison with no tolerance.
   */
  class Ray {
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * @param origin - The starting point of the ray as a 3D vector.
     * @param direction - The direction vector, not an endpoint. To aim at a target,
     * pass target minus origin. Provide both vectors to initialize the ray;
     * omitting direction creates a default ray without using origin.
     */
    constructor(origin: Vector3f, direction?: Vector3f);
    /**
     * @description Gets the origin point of the ray.
     * @returns The origin point of the ray.
     */
    get origin(): Vector3f;
    /**
     * @description Sets the origin of the ray to the specified Vector3f value.
     * @param value - The Vector3f value to set as the origin of the ray.
     */
    set origin(value: Vector3f);
    /**
     * @description The direction of the ray (always unit-length after setting).
     * @returns The direction vector of the ray.
     */
    get direction(): Vector3f;
    /**
     * @description Sets the ray direction to the given vector.
     * The value is **auto-normalized** before being stored — you do not need
     * to normalize it yourself. A zero-length vector will produce `NaN`
     * components after normalization.
     * @param value - The direction vector (will be normalized automatically).
     */
    set direction(value: Vector3f);
    /**
     * @description Creates and returns a deep copy of the current ray.
     * @returns A new instance of Ray with the same origin and direction as the original.
     */
    clone(): Ray;
    /**
     * @description Strict component-wise equality (`===`) on both `origin`
     * and `direction`. No tolerance.
     * @param other - The ray to compare with.
     * @returns `true` only when origin and direction match exactly.
     */
    equals(other: Ray): boolean;
    /**
     * @description Returns a string representation of this ray.
     * @example
     * new Ray(new Vector3f(1, 2, 3), new Vector3f(0, 1, 0)).toString()
     * // "Ray(origin: 1.00000, 2.00000, 3.00000,\n     dir: 0.00000, 1.00000, 0.00000)"
     * @returns A string representation of this ray.
     */
    toString(): string;
  }
  /**
   * Result of a 2D raycast. Returned by {@link Physics2D.raycast2D}.
   */
  class RaycastHit2D {
    /**
     * @description World-space point where the ray touched this hit.
     */
    readonly point: Vector2f;
    /**
     * @description World-space surface normal at the hit point.
     */
    readonly normal: Vector2f;
    /**
     * @description The Collider2D component that the ray hit.
     * This is null if the hit SceneObject does not expose a Collider2D component through APJS.
     */
    readonly collider: Collider2D | null;
    /**
     * @description The SceneObject that owns the hit collider.
     * This is null if APJS cannot resolve the hit collider back to a SceneObject.
     */
    readonly colliderObject: SceneObject | null;
    constructor(point: Vector2f, normal: Vector2f, collider: Collider2D | null, colliderObject: SceneObject | null);
  }
  /**
   * Result of a 3D raycast. Returned by {@link Physics3D.raycast}.
   */
  class RaycastHit3D {
    /**
     * @description World-space point where the ray first touched this hit.
     */
    readonly point: Vector3f;
    /**
     * @description World-space surface normal at the hit point.
     */
    readonly normal: Vector3f;
    /**
     * @description The collider component that the ray hit.
     * This is null if the hit SceneObject does not expose a Collider component through APJS.
     */
    readonly collider: Collider | null;
    /**
     * @description The SceneObject that owns the hit collider.
     * This is null if APJS cannot resolve the hit collider back to a SceneObject.
     */
    readonly colliderObject: SceneObject | null;
    constructor(point: Vector3f, normal: Vector3f, collider: Collider | null, colliderObject: SceneObject | null);
  }
  /**
   * @class Rect
   * @description A mutable rectangle value with `x`, `y`, `width`, and `height`.
   * `new Rect()` creates `(0, 0, 0, 0)`.
   */
  class Rect {
    /**
     * @description The x-coordinate of the rectangle's origin corner, from which `width` extends.
     * The coordinate space and units depend on the API consuming this rectangle.
     * Default is `0`. No range validation is performed.
     */
    x: number;
    /**
     * @description The y-coordinate of the rectangle's origin corner, from which `height` extends.
     * The coordinate space and units depend on the API consuming this rectangle.
     * Default is `0`. No range validation is performed.
     */
    y: number;
    /**
     * @description The width of the rectangle.
     * Default is `0`. No range validation is performed.
     */
    width: number;
    /**
     * @description The height of the rectangle.
     * Default is `0`. No range validation is performed.
     */
    height: number;
    /**
     * @constructor
     * @param x - The x-coordinate of the rectangle or another Rect instance to clone.
     * @param y - The y-coordinate of the rectangle. Defaults to 0 if not provided.
     * @param width - The width of the rectangle. Defaults to 0 if not provided.
     * @param height - The height of the rectangle. Defaults to 0 if not provided.
     */
    constructor(x?: number, y?: number, width?: number, height?: number);
    /**
     * @description Creates and returns a deep copy of the current rectangle.
     * @returns A new instance of Rect with the same properties as the original.
     */
    clone(): Rect;
    /**
     * @description Determines if this rectangle is equal to another rectangle.
     * Performs a strict component-wise comparison of `x`, `y`, `width`, and `height`
     * with no floating-point tolerance; all four fields must match exactly.
     * @param other - The rectangle to compare with.
     * @returns Whether the rectangles are equal.
     */
    equals(other: Rect): boolean;
    /**
     * @description Returns a string representation of the rectangle.
     * The format is `Rect(x, y, width, height)`, and each number is written with `5` decimal places.
     *
     * @example
     * ```ts
     * new Rect(1, 2, 3, 4).toString(); // "Rect(1.00000, 2.00000, 3.00000, 4.00000)"
     * ```
     * @returns A formatted string describing the rectangle.
     */
    toString(): string;
  }
  /**
   * @class Renderer
   * @description Base component for objects that can be rendered. Owns the
   * shared {@link Material} list applied to the underlying mesh and the
   * shadow configuration ({@link shadowMode}). Concrete renderer types
   * (`MeshRenderer`, `SkinMeshRenderer`, etc.) extend this base class and
   * add geometry-specific behavior.
   *
   * The two public surfaces are:
   * - {@link materials} — the shared materials applied to the renderer; assigning
   *   new materials replaces the entire list and is shared across all renderers
   *   that hold the same {@link Material} reference (mutating one affects all).
   * - {@link shadowMode} — combines the underlying `castShadow` and `receiveShadow`
   *   booleans; only effective on `MeshRenderer` / `SkinMeshRenderer` (set on
   *   other subclasses is ignored).
   *
   */
  class Renderer extends Component {
    protected constructor();
    /**
     * @description Returns the **shared** materials applied to this renderer.
     * Each call constructs a new JavaScript array, but the {@link Material}
     * elements are **live references** to the same `Material` instances held
     * by the engine — mutating any property (uniforms, textures, blend state,
     * etc.) on a returned element affects every renderer that uses that
     * material instance. Slots that the engine reports as empty are returned
     * as the same falsy value the engine produced (do not assume non-null).
     * The returned array length matches the renderer's slot count.
     */
    get materials(): Material[];
    /**
     * @description Sets the materials for rendering.
     */
    set materials(value: Material[]);
    /**
     * @description Gets the sorting order of the Renderer.
     * @returns The current sorting order.
     */
    get sortingOrder(): number;
    /**
     * @description Sets the sorting order of the renderer, which determines the rendering priority relative to other renderers.
     */
    set sortingOrder(value: number);
    /**
     * @description Indicates whether the sorting order is automatically managed.
     */
    get autoSortingOrder(): boolean;
    /**
     * @description Sets whether the renderer should automatically manage the sorting order of its elements.
     */
    set autoSortingOrder(value: boolean);
    /**
     * @description Gets the shadow mode of the renderer.
     */
    get shadowMode(): ShadowMode;
    /**
     * @description Sets the shadow mode for the Renderer. This determines whether the object casts and/or receives shadows.
     */
    set shadowMode(value: ShadowMode);
  }
  /**
   * @class RenderTextureProvider
   * @description A `TextureProvider` for render textures.
   * Use {@link Texture} when you need the texture object itself, such as passing it
   * to another API or binding it as an input. Use `RenderTextureProvider` when you
   * need to configure how that render texture is produced, such as its input
   * texture, clear behavior, or render-texture properties.
   */
  class RenderTextureProvider extends TextureProvider {
    protected constructor();
    /**
     * @description Gets the clear type that is applied to the render texture.
     * Default: {@link CameraClearType.Texture}.
     * @returns The current clear type used for this render texture.
     */
    get clearType(): CameraClearType;
    /**
     * @description Sets the clear type for the render texture. Takes effect on the
     * next render. Texture-based clear types use {@link inputTexture} (falling back
     * to {@link clearColor} when no input texture is bound); color-based clear types
     * use {@link clearColor}.
     * @param ct The camera clear type to use for this render texture.
     */
    set clearType(ct: CameraClearType);
    /**
     * @description Gets the color used to clear the render texture when
     * {@link inputTexture} is `undefined`/`null`. RGBA channels use the same
     * `[0, 1]` convention as {@link Color}. The returned `Color` is a separate
     * object; changing it does not update the render texture unless you assign
     * it back through this property.
     * @default Color(0,0,0,1)
     * @returns The clear color for the render texture.
     */
    get clearColor(): Color;
    /**
     * @description Sets the color used to clear the render texture when
     * {@link inputTexture} is `undefined`/`null`. RGBA channels use the same
     * `[0, 1]` convention as {@link Color}. The current channel values are
     * copied from the assigned `Color`.
     * @param color The clear color to use for the render texture.
     */
    set clearColor(color: Color);
    /**
     * @description Gets the input texture currently feeding this render texture.
     *
     * **Empty-value semantics — `undefined` vs `null`.** This API uses
     * `Texture | undefined` to mean "no input texture is assigned"; a `null` value
     * is treated equivalently in the setter (see below). Note this differs from
     * `Camera.inputTexture`, which uses `Texture | null` for the same concept.
     * The discrepancy is purely a historical API style difference — both shapes
     * mean "no input"; APJS does **not** distinguish between `undefined` and
     * `null` for these slots. New code should prefer the `?` (undefined) form on
     * `RenderTextureProvider` and the explicit `null` form on `Camera`, but
     * checks of the form `if (rt.inputTexture)` work uniformly.
     *
     * @returns The input texture, or `undefined` if no input texture is bound;
     * when `undefined`, the render texture is cleared with `clearColor` instead
     * of being copied from a source.
     */
    get inputTexture(): Texture | undefined;
    /**
     * @description Sets the input texture for this render texture. Both `undefined`
     * and `null` clear the binding and cause the render texture to fall back to
     * {@link clearColor}. The input texture is only used when {@link clearType} is a
     * texture-based mode; with a color-based clear type it is ignored.
     */
    set inputTexture(value: Texture | undefined);
    /**
     * @description Sets the width of the render texture in pixels.
     * This API does not validate a minimum value; use a positive integer.
     * If this render texture is not resizable, the call has no effect and does not report failure.
     * @param value The new width in pixels.
     */
    setWidth(value: number): void;
    /**
     * @description Sets the height of the render texture in pixels.
     * This API does not validate a minimum value; use a positive integer.
     * If this render texture is not resizable, the call has no effect and does not report failure.
     * @param value The new height in pixels.
     */
    setHeight(value: number): void;
  }
  /**
   * Runtime resource loader bound to the current effect. Assets placed under
   * the project's `Assets/Resources` directory are bundled with the effect
   * package and can be dynamically loaded at runtime through this class by
   * their original project paths, supporting single and batch loading as well
   * as path enumeration.
   *
   * Supported asset types:
   * - Texture (`.png`, `.jpg`, `.jpeg`, `.bmp`, `.gifTex`, `.animTex`)
   * - Material (`.omtl`, `.mg`)
   * - Prefab (`.prefab`)
   * - Mesh / Model (`.fbx`, `.obj`, `.glb`, `.gltf`)
   * - JsonAsset (`.userjson`)
   *
   * @example
   * ```ts
   * // Load a texture using its full path (relative to Assets/Resources).
   * const icon = APJS.Resources.load('icon.png');
   *
   * // Load by base path (suffix omitted).
   * const material = APJS.Resources.load('character');
   * ```
   */
  namespace Resources {
    /**
     * Load a resource by its original project path. The path may be supplied
     * with or without its file suffix; when multiple resources share the same
     * base path, the first match is returned.
     *
     * Supported asset types:
     * - Texture (`.png`, `.jpg`, `.jpeg`, `.bmp`, `.gifTex`, `.animTex`)
     * - Material (`.omtl`, `.mg`)
     * - Prefab (`.prefab`)
     * - Mesh / Model (`.fbx`, `.obj`, `.glb`, `.gltf`)
     * - JsonAsset (`.userjson`)
     *
     * @param path - The original project path of the resource to load.
     * @returns The loaded resource instance, or `null` if the current scene has
     * no active asset manager or the path cannot be resolved to a known
     * resource.
     *
     * @example
     * ```ts
     * // Load a texture using its full path (relative to Assets/resources).
     * const icon = APJS.Resources.load('icon.png');
     *
     * // Load by base path (suffix omitted).
     * const material = APJS.Resources.load('character');
     *
     * if (icon) {
     *   // Use the loaded resource...
     * }
     * ```
     */
    function load(path: string): any;
    /**
     * Load every resource that matches the given project path. When the path
     * is supplied without a file suffix, all resources sharing the same base
     * path are returned, ordered by resource type priority (images first,
     * followed by materials, prefabs and meshes).
     *
     * Supported asset types:
     * - Texture (`.png`, `.jpg`, `.jpeg`, `.bmp`, `.gifTex`, `.animTex`)
     * - Material (`.omtl`, `.mg`)
     * - Prefab (`.prefab`)
     * - Mesh / Model (`.fbx`, `.obj`, `.glb`, `.gltf`)
     * - JsonAsset (`.userjson`)
     *
     * @param path - The original project path of the resources to load. The
     * path is resolved relative to `Assets/resources` and may be specified
     * with or without a file suffix.
     * @returns The loaded resource instances in priority order, or an empty
     * array when the current scene has no active asset manager or the path
     * cannot be resolved to any resource.
     *
     * @example
     * ```ts
     * // Load every material variant that shares the same base path.
     * const materials = APJS.Resources.loadAll('PBR');
     *
     * // Load a specific material by its full path.
     * const pbr = APJS.Resources.loadAll('PBR.omtl');
     *
     * for (const material of materials) {
     *   // Use each loaded material...
     * }
     * ```
     */
    function loadAll(path: string): any[];
    /**
     * Check whether a resource is available under the given project path. The
     * path is resolved relative to `Assets/resources` and may be supplied with
     * or without a file suffix.
     *
     * @param path - The original project path of the resource to check.
     * @returns `true` when the path resolves to at least one bundled asset,
     * `false` otherwise.
     *
     * @example
     * ```ts
     * if (APJS.Resources.exist('icon.png')) {
     *   const icon = APJS.Resources.load('icon.png');
     *   // Use the loaded resource...
     * }
     * ```
     */
    function exist(path: string): boolean;
    /**
     * Get every original project path of the resources bundled with the current
     * effect package. Paths are returned in their original casing as authored
     * in the Effect House project.
     *
     * @returns An array of original project paths; empty when no resources are
     * bundled with the current effect.
     *
     * @example
     * ```ts
     * const paths = APJS.Resources.getAllPaths();
     * for (const path of paths) {
     *   console.log(path);
     * }
     * ```
     */
    function getAllPaths(): string[];
  }
  /**
   * @class RigidBody
   * @description A 3D physics rigid body component. Attach to a SceneObject to enable 3D PBD physics simulation.
   *
   * Combines with {@link Collider} to form a complete physical object.
   *
   * **Record/Reset:** On record start, position, rotation, and velocity are reset to initial values.
   * Configuration properties (mass, damping, static, freeze, etc.) are preserved.
   *
   * @example
   * const obj = scene.findSceneObject("Ball");
   * if (obj) {
   *     const rb = obj.getComponent("RigidBody") as APJS.RigidBody;
   *     rb.mass = 5.0;
   *     rb.addForce(new APJS.Vector3f(0, 500, 0), APJS.ForceMode3D.Impulse);
   * }
   */
  class RigidBody extends DynamicComponent {
    protected constructor();
    /**
     * @description Gets or sets the mass of the rigid body in kilograms.
     * Mass must be positive and greater than zero. Changing mass during simulation affects the body's inertia and response to forces.
     * @default 1.0
     */
    get mass(): number;
    set mass(value: number);
    /**
     * @description Gets or sets the linear damping coefficient that reduces linear velocity over time.
     * Recommended range [0, 1]: 0 means no damping, 1 means maximum damping; higher values slow the body faster.
     * Values are not clamped; stay within [0, 1] for predictable behavior.
     * @default 0.0
     */
    get damping(): number;
    set damping(value: number);
    /**
     * @description Gets or sets the angular damping coefficient that reduces angular velocity over time.
     * Recommended range [0, 1]: 0 means no damping, 1 means maximum damping; higher values slow rotation faster.
     * Values are not clamped; stay within [0, 1] for predictable behavior.
     * @default 0.0
     */
    get angularDamping(): number;
    set angularDamping(value: number);
    /**
     * @description Gets or sets the continuous force applied to the rigid body in world space.
     * Force is measured in Newtons and is applied continuously during physics simulation.
     * Setting this replaces the previous continuous force value. This does NOT affect forces added via {@link addForce}.
     * To apply multiple forces cumulatively, use {@link addForce} instead.
     * @default Vector3f(0, 0, 0)
     */
    get force(): Vector3f;
    set force(value: Vector3f);
    /**
     * @description Gets or sets the continuous torque (the external force that causes a rigid body to rotate) applied to the rigid body in world space.
     * Torque is measured in Newton-meters and is applied continuously during physics simulation.
     * Setting this replaces the previous continuous torque value. This does NOT affect torques added via {@link addTorque}.
     * To apply multiple torques cumulatively, use {@link addTorque} instead.
     * @default Vector3f(0, 0, 0)
     */
    get torque(): Vector3f;
    set torque(value: Vector3f);
    /**
     * @description Gets or sets whether movement along the X-axis is frozen.
     * When frozen, the rigid body cannot move along the X-axis but can still rotate freely.
     * Constraint is applied during the next physics simulation step.
     * @default false
     */
    get freezeX(): boolean;
    set freezeX(value: boolean);
    /**
     * @description Gets or sets whether movement along the Y-axis is frozen.
     * When frozen, the rigid body cannot move along the Y-axis but can still rotate freely.
     * Constraint is applied during the next physics simulation step.
     * @default false
     */
    get freezeY(): boolean;
    set freezeY(value: boolean);
    /**
     * @description Gets or sets whether movement along the Z-axis is frozen.
     * When frozen, the rigid body cannot move along the Z-axis but can still rotate freely.
     * Constraint is applied during the next physics simulation step.
     * @default false
     */
    get freezeZ(): boolean;
    set freezeZ(value: boolean);
    /**
     * @description Gets or sets whether the rigid body behaves as an immovable kinematic body.
     * When enabled, the PBD simulator stops treating this body as dynamically simulated.
     * Use this for environment geometry or authored placement that should not respond to forces.
     *
     * Switching at runtime takes effect immediately. If set before the body is initialized,
     * the value is applied when the body is created.
     * @default false
     */
    get static(): boolean;
    set static(value: boolean);
    /**
     * @description Blend animation with physics. When enabled, a hidden kinematic "shadow body" follows
     * the animation, and the real physics rigid body is pulled toward it via spring-like joints.
     *
     * - `physicsAnimation = false`: pure physics (forces/gravity drive motion)
     * - `physicsAnimation = true`, `rate = 0`: pure animation (body exactly follows animation)
     * - `physicsAnimation = true`, `rate = 0.5`: blend (physics and animation mix)
     * - `physicsAnimation = true`, `rate = 1.0`: mostly physics, loosely follows animation
     *
     * **Requires** the SceneObject or an ancestor to have an Animator component.
     * If no Animator is found in the hierarchy, setting `physicsAnimation = true` is
     * **silently ignored** (no shadow body/joints are created and the flag has no effect).
     * **Performance:** Creates two additional constraints per body.
     * @default false
     */
    get physicsAnimation(): boolean;
    set physicsAnimation(value: boolean);
    /**
     * @description Controls the blend between animation and physics when {@link physicsAnimation} is enabled.
     *
     * Range [0, 1]:
     * - `0` = pure animation (rigid body rigidly follows the animated transform)
     * - `1` = mostly physics (animation only loosely guides, gravity/forces dominate)
     *
     * Internally maps to joint compliance: low rate = stiff springs = tight animation tracking.
     * When {@link physicsAnimation} is `false`, the value is stored but not applied; it takes effect
     * the next time physics animation is enabled.
     * @default 0.0
     */
    get physicsAnimationRate(): number;
    set physicsAnimationRate(value: number);
    /**
     * @description Gets or sets whether scene gravity contributes to this body's
     * continuous external force.
     * When enabled, APJS adds `Physics3D.gravity * mass` to the body's accumulated
     * external force. Disabling gravity removes that contribution without changing
     * any other forces already applied to the body.
     * @default true
     */
    get useGravity(): boolean;
    set useGravity(value: boolean);
    /**
     * @description World-space position of the rigid body (meters). Reads from the physics engine;
     * writing teleports the body immediately, bypassing velocity/force simulation.
     *
     * Do NOT modify Transform.position directly on a physics-controlled object —
     * the physics engine will overwrite it on the next frame.
     * Use this property or {@link addForce} instead to move the body.
     *
     * @example
     * // Teleport a physics body to (0, 5, 0)
     * rigidBody.position = new APJS.Vector3f(0, 5, 0);
     * // For smooth movement, use forces:
     * rigidBody.addForce(new APJS.Vector3f(0, 10, 0), APJS.ForceMode3D.Impulse);
     * @default Vector3f(0, 0, 0)
     */
    get position(): Vector3f;
    set position(value: Vector3f);
    /**
     * @description Current world-space rotation of the rigid body, returned as a quaternion.
     * Once the body is created, the getter reflects the live orientation from the physics engine.
     * Writing teleports the body's rotation immediately, bypassing torque and angular-velocity simulation.
     *
     * Do NOT modify Transform.rotation directly on a physics-controlled object —
     * the physics engine will overwrite it on the next frame.
     * Use this property, {@link eulerAngles}, or {@link addTorque} instead.
     *
     * @example
     * // Teleport rotation (90 degrees around Y axis, 1.57 radians)
     * rigidBody.rotation = APJS.Quaternionf.makeFromEulerAngles(new APJS.Vector3f(0, 1.57, 0));
     * // For smooth rotation, use torque:
     * rigidBody.addTorque(new APJS.Vector3f(0, 10, 0), APJS.ForceMode3D.Impulse);
     * @default Quaternionf(0, 0, 0, 1)
     */
    get rotation(): Quaternionf;
    set rotation(value: Quaternionf);
    /**
     * @description Current world-space rotation of the rigid body as Euler angles in radians
     * (rotation order XYZ). The getter reflects the live orientation from the physics engine.
     * Writing teleports the body immediately. For smooth rotation, use {@link addTorque}.
     *
     * Do NOT modify Transform.eulerAngles directly — it will be overwritten.
     * Prefer {@link rotation} over this property to avoid gimbal lock.
     * @default Vector3f(0, 0, 0)
     */
    get eulerAngles(): Vector3f;
    set eulerAngles(value: Vector3f);
    /**
     * @description World-space linear velocity in meters per second (m/s).
     * The getter returns the live simulator value, and writing overrides the current physics-computed velocity immediately.
     * For gradual changes, use {@link addForce} instead.
     * @default Vector3f(0, 0, 0)
     */
    get velocity(): Vector3f;
    set velocity(value: Vector3f);
    /**
     * @description World-space angular velocity in radians per second.
     * The vector points along the rotation axis, the getter returns the live simulator value,
     * and writing overrides the current physics-computed angular velocity immediately.
     * For gradual changes, use {@link addTorque} instead.
     * @default Vector3f(0, 0, 0)
     */
    get angularVelocity(): Vector3f;
    set angularVelocity(value: Vector3f);
    /**
     * @description Gets or sets the diagonal inertia tensor of the rigid body.
     * These values describe resistance to angular acceleration around the body's principal axes.
     * They are usually computed automatically from mass and collider shape, but can be overridden for custom behavior.
     * Each component should be positive; a component at or near zero locks rotation around that axis.
     * Changes take effect immediately only after the body has been created.
     * @default Vector3f(1, 1, 1)
     */
    get inertiaTensor(): Vector3f;
    set inertiaTensor(value: Vector3f);
    /**
     * @description Adds force at the rigid body's center of mass.
     *
     * Force modes:
     * - `Force`: adds continuous force and scales with mass
     * - `Acceleration`: adds continuous acceleration independent of mass
     * - `Impulse`: applies an immediate impulse and changes velocity instantly
     * - `VelocityChange`: applies an immediate velocity change independent of mass
     *
     * @example
     * const explosionForce = new APJS.Vector3f(0, 100, 0);
     * rigidBody.addForce(explosionForce, APJS.ForceMode3D.Impulse);
     * @param force - The world-space force vector to apply.
     * @param mode - The type of force application. Defaults to {@link ForceMode3D.Force}.
     */
    addForce(force: Vector3f, mode?: ForceMode3D): void;
    /**
     * @description Adds torque at the rigid body's center of mass.
     *
     * Force modes:
     * - `Force`: adds continuous torque and scales with mass
     * - `Acceleration`: adds continuous angular acceleration independent of mass
     * - `Impulse`: applies an immediate angular impulse
     * - `VelocityChange`: applies an immediate angular velocity change independent of mass
     *
     * @example
     * const explosionTorque = new APJS.Vector3f(0, 100, 0);
     * rigidBody.addTorque(explosionTorque, APJS.ForceMode3D.Impulse);
     * @param torque - The world-space torque vector to apply.
     * @param mode - The type of torque application. Defaults to {@link ForceMode3D.Force}.
     */
    addTorque(torque: Vector3f, mode?: ForceMode3D): void;
    /**
     * @description Applies a force at a specific point, which may also generate torque.
     * If `isLocal` is true, both `force` and `position` are interpreted in the object's local space
     * and converted to world space before applying the force.
     * @example push something at a specific point
     * // Apply a push at the edge of the object to make it swing
     * const pushForce = new APJS.Vector3f(0, 0, 10); // Push forward
     * const pushPoint = new APJS.Vector3f(1, 0, 0);  // Right edge
     * rigidBody.addForceAt(pushForce, pushPoint, false, APJS.ForceMode3D.Impulse);
     * @param force - The force vector to apply.
     * @param position - The application point.
     * @param isLocal - If true, `force` and `position` are in local space. Defaults to false.
     * @param mode - The mode of the force (Force, Impulse, etc.). Defaults to {@link ForceMode3D.Force}.
     * @returns {ConstantForce3D | null} A world-space handle for continuous modes; null for instantaneous modes.
     */
    addForceAt(force: Vector3f, position: Vector3f, isLocal?: boolean, mode?: ForceMode3D): ConstantForce3D | null;
  }
  /**
   * @class RigidBody2D
   * @description A 2D physics rigid body component. Attach to a SceneObject to enable 2D physics simulation.
   *
   * Combines with {@link Collider2D} to form a complete physical object: the RigidBody2D handles
   * motion (position, velocity, forces) while the Collider2D defines the shape for collision detection.
   *
   * **Record/Reset:** On record start, position, rotation, and velocity are reset to initial values.
   * Configuration properties (mass, damping, static, freeze, etc.) are preserved.
   *
   * @example
   * const obj = scene.findSceneObject("Player");
   * if (obj) {
   *     const rb = obj.getComponent("RigidBody2D") as APJS.RigidBody2D;
   *     rb.mass = 2.0;
   *     rb.addForce(new APJS.Vector2f(0, 50), APJS.ForceMode2D.Impulse);
   * }
   */
  class RigidBody2D extends DynamicComponent {
    protected constructor();
    /**
     * @description Gets or sets whether this body behaves like a non-moving physics body.
     * When enabled, the simulator switches this body away from dynamic simulation,
     * clears accumulated force and torque, and resets its runtime linear and
     * angular velocity to zero. Re-enabling dynamic behavior restores the serialized
     * initial velocity values.
     */
    get static(): boolean;
    set static(value: boolean);
    /**
     * @description Gets or sets whether gravity affects this body.
     * When enabled, the simulator uses this body's current {@link gravityScale}.
     * When disabled, APJS pushes a native gravity scale of `0` while keeping the
     * stored `gravityScale` value unchanged for later reuse.
     */
    get useGravity(): boolean;
    set useGravity(value: boolean);
    /**
     * @description Gets or sets the body's mass in kilograms.
     * Larger mass reduces acceleration from the same applied force and affects collision response.
     * Mass should be positive; a non-positive value (`<= 0`) is treated as `1.0 kg`.
     * Mass only affects `dynamic` bodies and has no effect on `static`/`kinematic` bodies.
     * @default 1.0
     */
    get mass(): number;
    set mass(value: number);
    /**
     * @description Gets or sets the position of the RigidBody2D in world coordinates.
     * Position represents the center of mass of the body in 2D space.
     * Setting this property teleports the body immediately instead of moving it through simulation.
     * Do NOT modify `ScreenTransform.anchoredPosition` directly on a physics body —
     * the engine will overwrite it on the next frame. Use this property or {@link addForce} instead.
     *
     * Note: When converting from screen pixels to 2D physics world units, divide by 32.
     * @example
     * rigidBody2D.position = new Vector2f(5, 3); // teleport to (5m, 3m)
     */
    get position(): Vector2f;
    set position(value: Vector2f);
    /**
     * @description Gets or sets this body's authored rotation in radians.
     * Rotation is measured counter-clockwise from the positive X-axis.
     * Setting this property rotates the body immediately instead of moving it through simulation.
     * Do NOT modify `ScreenTransform.rotation` directly on a physics body —
     * the engine will overwrite it on the next frame. Use this property or {@link addTorque} instead.
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * @description Gets or sets the body's linear damping coefficient.
     * Recommended range [0, 1]: 0 means no damping, 1 means maximum damping; larger values make
     * linear velocity decay faster. Values are not clamped; stay within [0, 1] for predictable behavior.
     */
    get damping(): number;
    set damping(value: number);
    /**
     * @description Gets or sets the body's angular damping coefficient.
     * Recommended range [0, 1]: 0 means no damping, 1 means maximum damping; larger values make
     * angular velocity decay faster. Values are not clamped; stay within [0, 1] for predictable behavior.
     */
    get angularDamping(): number;
    set angularDamping(value: number);
    /**
     * @description Gets or sets whether this body is locked against horizontal movement.
     * Enabling the lock immediately zeroes the body's current horizontal velocity and prevents
     * further horizontal motion; disabling it restores normal horizontal movement.
     */
    get freezeX(): boolean;
    set freezeX(value: boolean);
    /**
     * @description Gets or sets whether this body is locked against vertical movement.
     * Enabling the lock immediately zeroes the body's current vertical velocity and prevents
     * further vertical motion; disabling it restores normal vertical movement.
     */
    get freezeY(): boolean;
    set freezeY(value: boolean);
    /**
     * @description **In 2D this freezes rotation, not Z-axis translation.** Despite the
     * `freezeZ` name (mirrored from `RigidBody`'s 3D rotation/translation lock layout),
     * the 2D rigid body has only one rotational degree of freedom — around the Z axis —
     * so this flag locks/unlocks that rotation. Setting it to `true` prevents the body
     * from spinning under physics forces or collisions; X/Y translation is controlled
     * separately by `freezeX` / `freezeY`. Enabling the lock immediately zeroes the body's
     * current angular velocity; disabling it restores normal rotation.
     *
     * Note: this is **not** equivalent to `RigidBody.freezeZ` (3D), which freezes
     * translation along the world Z axis.
     */
    get freezeZ(): boolean;
    set freezeZ(value: boolean);
    /**
     * @description Gets or sets the continuous force applied to the rigid body in world space.
     * Force is measured in Newtons and is applied continuously during physics simulation.
     * Setting this replaces the previous continuous force value. This does NOT affect forces added via {@link addForce}.
     * To apply multiple forces cumulatively, use {@link addForce} instead.
     */
    get force(): Vector2f;
    set force(value: Vector2f);
    /**
     * @description Gets or sets the continuous torque applied to the rigid body in world space.
     * Torque is measured in Newton-meters and is applied continuously during physics simulation.
     * Setting this replaces the previous continuous torque value. This does NOT affect torques added via {@link addTorque}.
     * To apply multiple torques cumulatively, use {@link addTorque} instead.
     */
    get torque(): number;
    set torque(value: number);
    /**
     * @description Gets or sets the multiplier applied to global 2D gravity for this body.
     * For example, 0 disables gravity, 1 uses normal gravity, and 2 doubles it.
     * If {@link useGravity} is false, this value is stored but not pushed to the simulator until gravity is re-enabled.
     */
    get gravityScale(): number;
    set gravityScale(value: number);
    /**
     * @description Gets or sets the initial linear velocity of the RigidBody2D in meters per second.
     * This value is serialized and applied when the body is first created.
     * To read/write runtime velocity, use the `velocity` property instead.
     */
    get initialVelocity(): Vector2f;
    set initialVelocity(value: Vector2f);
    /**
     * @description Gets or sets the initial angular velocity of the RigidBody2D in radians per second.
     * This value is serialized and applied when the body is first created.
     * To read/write runtime angular velocity, use the `angularVelocity` property instead.
     */
    get initialAngularVelocity(): number;
    set initialAngularVelocity(value: number);
    /**
     * @description Gets or sets the rigid body's world-space linear velocity in meters per second.
     * Once the body is created, the getter returns the live simulator velocity.
     * Setting this property changes the current runtime state only; use {@link initialVelocity} for startup configuration.
     */
    get velocity(): Vector2f;
    set velocity(value: Vector2f);
    /**
     * @description Gets or sets the rigid body's angular velocity in radians per second.
     * Positive values indicate counter-clockwise rotation.
     * Once the body is created, the getter returns the live simulator value.
     * Setting this property changes the current runtime state only; use {@link initialAngularVelocity} for startup configuration.
     */
    get angularVelocity(): number;
    set angularVelocity(value: number);
    /**
     * @description Adds force to this body.
     * Continuous modes accumulate force or acceleration until removed. Instantaneous
     * modes apply an impulse immediately.
     *
     * Force modes:
     * - `Force`: continuous force and mass-dependent acceleration
     * - `Acceleration`: continuous acceleration independent of mass
     * - `Impulse`: immediate velocity change scaled by mass
     * - `VelocityChange`: immediate velocity change independent of mass
     *
     * @param force - The world-space force vector in 2D physics units.
     * @param mode - The force mode to apply. Defaults to {@link ForceMode2D.Force}.
     */
    addForce(force: Vector2f, mode?: ForceMode2D): void;
    /**
     * @description Adds torque to this body.
     * Continuous modes accumulate torque or angular acceleration until removed.
     * Instantaneous modes apply angular impulse immediately.
     *
     * @param torque - The torque value in Newton-meters.
     * @param mode - The force mode to apply. Defaults to {@link ForceMode2D.Force}.
     */
    addTorque(torque: number, mode?: ForceMode2D): void;
    /**
     * @description Applies force at a specific point, which may also generate torque.
     * If `isLocal` is true, both `force` and `position` are converted from local
     * space to world space before the force is applied.
     *
     * Continuous modes return a {@link ConstantForce2D} describing the world-space
     * force and torque contribution so it can later be removed. Instantaneous modes
     * return `null`.
     *
     * @example
     * const pushForce = new APJS.Vector2f(10, 0); // Push right
     * const cornerPos = new APJS.Vector2f(0.5, 0.5); // Top-right corner in local space
     * rigidBody2D.addForceAt(pushForce, cornerPos, true, APJS.ForceMode2D.Impulse);
     * @param force - The force vector to apply.
     * @param position - The application point.
     * @param isLocal - If true, interprets inputs in local space. Defaults to false.
     * @param mode - The force mode. Defaults to {@link ForceMode2D.Force}.
     * @returns A world-space handle for continuous modes; `null` for instantaneous modes.
     */
    addForceAt(force: Vector2f, position: Vector2f, isLocal?: boolean, mode?: ForceMode2D): ConstantForce2D | null;
  }
  /**
   * @class Scene
   * @description In scripts, access the current scene from the mounted scene object.
   * @example
   * const currScene = this.getSceneObject().scene;
   */
  class Scene extends AObject {
    protected constructor();
    /**
     * @description Creates and adds a scene object to this scene.
     * The `name` is stored as provided. It does not need to be unique, and an empty string is allowed.
     * The created scene object starts as a root-level scene object with no parent until you reparent it.
     * @param name - The name of the SceneObject to create.
     * @returns The created SceneObject.
     * @example
     * const scene = this.getSceneObject().scene;
     * const newObj = scene.createSceneObject('SpawnedObject');
     * const transform = newObj.getTransform();
     * transform.localPosition = new APJS.Vector3f(0, 0, 0);
     * newObj.layer = this.getSceneObject().layer;
     */
    createSceneObject(name: string): SceneObject;
    /**
     * @description Removes a scene object from the scene.
     * <br/>Returns false if the object does not belong to the scene or is invalid.
     * @param obj - The object to remove from the scene.
     * @returns Returns true if the object was removed successfully; otherwise false.
     * @example
     * let foundObj = this.getSceneObject().scene.findSceneObject('newObj');
     * if (foundObj) {
     *   this.getSceneObject().scene.removeSceneObject(foundObj);
     * }
     */
    removeSceneObject(obj: SceneObject): boolean;
    /**
     * @description
     * Returns the root scene objects of the Scene — those whose transform has no parent.
     * The result is a new array snapshot taken at call time, ordered by the scene's internal
     * creation/registration order; later changes to the scene are not reflected in it.
     */
    getRootSceneObjects(): SceneObject[];
    /**
     * @description
     * Returns every scene object in the Scene, both root objects and their descendants.
     * The result is a new array snapshot taken at call time, ordered by the scene's internal
     * creation/registration order (not by hierarchy); later changes to the scene are not
     * reflected in it.
     * @example
     * const sceneObjects = this.getSceneObject().scene.getAllSceneObjects();
     * sceneObjects.forEach((obj) => {
     *   console.log(obj.name);
     * });
     */
    getAllSceneObjects(): SceneObject[];
    /**
     * @description Finds a scene object by its exact, case-sensitive name.
     * When `root` is omitted or is not a `SceneObject`, the search starts from the scene's root-level scene objects.
     * When `root` is provided, the search checks `root` first and then walks its descendants in depth-first order,
     * returning the first matching scene object.
     * @param name - The exact name to search for.
     * @param root - Optional subtree root.
     * @returns The first matching scene object, or `null` if no match is found.
     * @example
     * const foundObj = this.getSceneObject().scene.findSceneObject('newObj');
     * if (foundObj) {
     *   const transform = foundObj.getComponent('Transform') as APJS.Transform;
     *   console.log(transform.localPosition.toString());
     * }
     */
    findSceneObject(name: string, root?: SceneObject): SceneObject | null;
    /**
     * @description Post a reset event which will take effects next frame. The reset result is the same as "reset on record" feature. This feature works only if the "Reset on Record" setting is "on," which is the default setting.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   private currentScore: number;
     *   onStart() {
     *     // the score should be reset when record start
     *     let callback = (event:IEvent) => {
     *       this.currentScore = 0;
     *       ...
     *     }
     *
     *     const globalEmitter = APJS.EventManager.getGlobalEmitter();
     *     globalEmitter.on(APJS.EventType.RecordStart, callback);
     *   }
     *   onUpdate(deltaTime: number) {
     *     // When the score exceeds the limit, a manual reset can be triggered, which will activate all reset logic for the record event.
     *     if (this.currentScore > 100) {
     *       this.getSceneObject().scene.postResetEvent();
     *     }
     *   }
     * }
     */
    postResetEvent(): void;
    /**
     * @description Submits a recorded `CommandBuffer` to this scene.
     * Create the buffer with `new CommandBuffer()`, record the commands you need, and then pass it here.
     * The submitted commands are executed during the scene's render flow. Depending on when you call this method,
     * they can take effect in the current rendering work or in a later render step.
     * This method does not return whether submission or execution succeeded.
     * @param buffer - A `CommandBuffer` that already contains the commands to run.
     * @example
     * const cmdBuffer = new APJS.CommandBuffer();
     * cmdBuffer.clearAll();
     * cmdBuffer.blit(sourceTexture, targetTexture);
     * this.getSceneObject().scene.commitCommandBuffer(cmdBuffer);
     */
    commitCommandBuffer(buffer: CommandBuffer): void;
  }
  /**
   * @class SceneObject
   * @description
   * <br/>SceneObject is the base class for all SceneObjects in Scenes.
   * <br/>can use scene.createSceneObject() to create one SceneObject
   */
  class SceneObject extends AObject {
    protected constructor();
    /**
     * @description The enabled status of the SceneObject itself.
     * This is the local/self flag and does not include inherited visibility from ancestors.
     * Use {@link SceneObject.isEnabledInHierarchy} to read the effective hierarchy state.
     */
    get enabled(): boolean;
    /**
     * @description Sets whether the SceneObject is enabled, which affects its visibility and interaction in the scene.
     * If need to enable child SceneObject, use {@link SceneObject.setEnabledInHierarchy} instead.
     * This setter changes only the SceneObject's local/self flag and does not propagate inherited
     * visibility changes to descendants. For script-driven SceneObject show/hide, prefer
     * {@link SceneObject.setEnabledInHierarchy} so hierarchy propagation and descendant
     * lifecycle notification paths run.
     */
    set enabled(enabled: boolean);
    /**
     * @description The zero-based numeric layer used for selective rendering and filtering.
     * Cameras and other layer-based systems compare this value against their render-layer masks.
     * Range: [0, 63], default 0. Values outside this range are not validated by this API.
     */
    get layer(): number;
    /**
     * @description Sets the zero-based numeric layer of the SceneObject.
     * Range: [0, 63], default 0.
     * @param value - The layer number to assign.
     */
    set layer(value: number);
    /**
     * @readonly
     * @tsd_constant
     * @description The scene to which this scene object belongs.
     */
    get scene(): Scene;
    /**
     * @tsd_constant
     * @description The parent of the scene object.
     * Reparenting does not compensate for the new parent's transform, so world
     * position, rotation and scale may change. It does not automatically preserve world transforms.
     */
    get parent(): SceneObject | null;
    /**
     * @description Sets the parent of the SceneObject. If a new parent is provided, it reassigns the object's transform to the new parent.
     *              If no parent is provided (null), it removes the object from its current parent.
     */
    set parent(parent: SceneObject | null);
    /**
     * @description Gets whether the scene object is enabled in the hierarchy.
     * This property determines if the scene object and its components are visible and active.
     * This method reads the effective state, including inherited visibility from ancestors.
     * @returns True if the scene object is enabled in the hierarchy, false otherwise.
     */
    isEnabledInHierarchy(): boolean;
    /**
     * @description Sets this SceneObject's hierarchy-visible state.
     * Updates this object's native `visible` flag and recursively notifies descendant
     * `DynamicComponent`s of inherited visibility changes.
     * This does not change descendants' local `enabled` values.
     * The SceneObject's own local `enabled` flag is updated to the provided value.
     * Prefer this method for script-driven SceneObject visibility changes.
     * @param enabled - True to enable the object in hierarchy, false to disable it.
     */
    setEnabledInHierarchy(enabled: boolean): void;
    /**
     * @description Finds a descendant by name and returns it.
     * The search is recursive: it traverses the entire descendant subtree depth-first and
     * returns the first scene object whose name matches, not only direct children.
     * @param name - The name of the sceneObject to find.
     * @returns The found descendant SceneObject, or null if no matching name is found.
     */
    getChild(name: string): SceneObject | null;
    /**
     * @description Gets the direct child SceneObjects of this SceneObject.
     * The returned array is built from the current transform children list, does not recurse into
     * descendants, and preserves the current child-list order.
     * The result is a snapshot array: later hierarchy changes are not reflected in a previously
     * returned array.
     * @returns A snapshot array of direct child SceneObjects in current child-list order.
     */
    getChildren(): SceneObject[];
    /**
     * @description Adds a component of the specified type to the scene object.
     * @param type - The component type name, which must be one of the supported public APJS
     * component names (e.g. `'Camera'`, `'MeshRenderer'`, `'Animator'`, `'Text'`, `'BoxCollider'`,
     * a registered custom DynamicComponent name, etc.).
     * @returns The added component, or `null` if `type` is not a supported/recognized component
     * name or the component otherwise could not be created.
     */
    addComponent(type: string): Component | null;
    /**
     * @description Gets a component of the specified type from the scene object.
     * The type string should use the public APJS component name.
     * When several components of the same type are attached, the first one found on this scene
     * object (in attachment order) is returned.
     * @param type The type of component to get.
     * @returns The component of the specified type, or null if not found.
     */
    getComponent(type: string): Component | null;
    /**
     * @description Gets all components of the specified type from the scene object.
     * When provided, the type string should use the public APJS component name.
     * @param type - Optional the type of components to get.
     * @returns An array of components of the specified type or all components for no type input.
     */
    getComponents(type?: string): Component[];
    /**
     * @description Gets components of the specified type from this scene object and its descendants.
     * The type string should use the public APJS component name.
     * Results are ordered by a depth-first, pre-order traversal: this scene object's matching
     * components come first (in attachment order), followed by each child's subtree in child order.
     * @param type - Component type name.
     * @returns Matching components from the hierarchy.
     */
    getComponentsRecursive(type: string): Component[];
    /**
     * @description Creates a new scene object in the same scene and copies this object's current state into it.
     * The clone keeps the same name, transform type, enabled state, layer, hierarchy parent, visibility flag, tag,
     * asset manager, prefab object GUID, transform values, and current components.
     * Child scene objects are not cloned by this method.
     * @returns A cloned scene object.
     */
    clone(): SceneObject;
    /**
     * @description Gets this scene object's transform component.
     * @returns The transform component. Every scene object always has exactly one transform, so
     * this never returns null. Mutating the returned transform updates the scene object's
     * position, rotation, and scale.
     */
    getTransform(): Transform;
    /**
     * @description Removes the specified component instance from the scene object.
     * Pass the component instance currently attached to this scene object.
     * This method removes by instance, not by component type.
     * @param comp - The component instance to remove.
     * @returns `true` if the component was removed; `false` if `comp` is null/invalid (e.g. an
     * already-destroyed component).
     */
    removeComponent(comp: Component): boolean;
  }
  /**
   * @class ScreenTextureProvider
   * @description A `RenderTextureProvider` for `ScreenRenderTexture`.
   * A screen texture is a render texture with screen-related sizing behavior. Its
   * size can follow the screen, follow the input texture, or use a custom size,
   * depending on {@link sizeMode}. Use this provider when you need to configure
   * how that screen texture is produced. Use the `Texture` object itself when you
   * only need to pass the texture to another API or bind it as an input.
   * @example
   * const desc = new ScreenTextureCreateDesc();
   * const screenTexture = TextureUtils.createScreenTexture(desc);
   * const screenProvider = screenTexture.getControl() as ScreenTextureProvider;
   * screenProvider.sizeMode = ScreenTextureSizeMode.FollowScreen;
   */
  class ScreenTextureProvider extends RenderTextureProvider {
    protected constructor();
    /**
     * @description Get size mode for screen texture sizing.
     * @returns The size mode for screen texture sizing.
     */
    get sizeMode(): ScreenTextureSizeMode;
    /**
     * @description Sets the size mode for screen texture sizing. Default:
     * {@link ScreenTextureSizeMode.FollowScreen}. With `FollowScreen` the texture
     * matches the screen size and with `FollowInput` it matches the input texture
     * size; in both cases the custom normalized width/height are ignored. The custom
     * normalized size only takes effect when the mode is `Custom`. The new mode is
     * applied to the underlying texture on assignment.
     * @param value The size mode for screen texture sizing.
     */
    set sizeMode(value: ScreenTextureSizeMode);
  }
  /**
   * @description Defines the size modes for screen textures.
   * @enum {number}
   * @property FollowScreen Represents that the screen texture size follows the screen size.
   * @property FollowInput Represents that the screen texture size follows the input size.
   * @property Custom Represents that the screen texture size is custom.
   */
  enum ScreenTextureSizeMode {
    FollowScreen,
    FollowInput,
    Custom
  }
  /**
   * @class ScreenTransform
   * Manages screen space transformations for UI elements, including positioning, sizing, and anchoring.
   * Extends the base Transform class to provide UI-specific layout functionality such as anchor points,
   * pivot positioning, and screen space rect calculations.
   * ## Anchor modes (controlled by `anchors`)
   * `anchors = (left, right, bottom, top)` mapped to `(x, y, z, w)`,
   * each value normalized to [0, 1] relative to the parent rect.
   * - **Point anchor** (`x === y` and `z === w`): `sizeDelta` equals the element's absolute pixel size.
   * - **Stretch anchor** (`x !== y` or `z !== w`): `sizeDelta` = element size − anchor region size.
   *   Negative values mean the element is inset from the anchor edges.
   * ## Positioning
   * `anchoredPosition` is the pixel offset from the **anchor center** to the element's **pivot** point.
   * `anchorCenter = (Lerp(anchors.x, anchors.y, pivot.x), Lerp(anchors.z, anchors.w, pivot.y))`
   * in normalized parent space.
   * @example
   * // Fixed-size element centered in parent
   * st.anchors = new Vector4f(0.5, 0.5, 0.5, 0.5);
   * st.sizeDelta = new Vector2f(360, 640); // element is 360px wide, 640px tall
   * st.anchoredPosition = new Vector2f(0, 0);
   *
   * @example
   * // Full-screen stretch with 20px inset on each side
   * st.anchors = new Vector4f(0, 1, 0, 1);
   * st.sizeDelta = new Vector2f(-40, -40); // 20px inset on each side
   * // if you want to padding top 40px and bottom 0px
   * st.anchoredPosition = new Vector2f(0, -20);
   * // st.offsets = new Vector4f(20,-20,0,-40) is equivalent
   */
  class ScreenTransform extends Transform {
    constructor();
    /**
     * @description Gets or sets the pixel offset of the pivot point relative to the anchor center point.
     * Anchor center = Lerp(anchorLeft, anchorRight, pivot.x), Lerp(anchorBottom, anchorTop, pivot.y).
     * Unit: pixels. Default: (0, 0).
     * Example: anchors=(0.5,0.5,0.5,0.5), pivot=(0.5,0.5), anchoredPosition=(100,50) means
     * the element center is 100px to the right and 50px above the parent center.
     */
    get anchoredPosition(): Vector2f;
    set anchoredPosition(value: Vector2f);
    /**
     * @description Gets or sets the element size delta, in pixels. Meaning depends on anchor mode:
     * - Point anchor (anchors.x==anchors.y && anchors.z==anchors.w):
     *   sizeDelta IS the absolute element size. e.g. (360, 640) = 360px wide, 640px tall.
     * - Stretch anchor (anchors.x!=anchors.y || anchors.z!=anchors.w):
     *   sizeDelta = element size minus anchor region size. Negative = element is inset.
     *   e.g. anchors=(0,1,0,1), sizeDelta=(-40,-40) means 20px inset on each side.
     */
    get sizeDelta(): Vector2f;
    set sizeDelta(value: Vector2f);
    /**
     * @description Gets or sets the pivot point of the UI element, normalized to [0,1] range.
     * (0,0) represents the bottom-left corner, (1,1) represents the top-right corner.
     * Determines the origin point for rotation, scaling, and positioning calculations.
     */
    get pivot(): Vector2f;
    set pivot(value: Vector2f);
    /**
     * @description Gets or sets the anchor points as (left, right, bottom, top) = (x, y, z, w),
     * each normalized in [0,1] relative to the parent rect (0=left/bottom edge, 1=right/top edge).
     * - Point anchor (x==y, z==w): element attaches to a single point. e.g. (0.5,0.5,0.5,0.5) = parent center.
     * - Stretch anchor (x!=y or z!=w): element stretches with parent. e.g. (0,1,0,1) = fill parent.
     * - (0,0,0,0) = bottom-left corner; (1,1,1,1) = top-right corner. Default: (0.5,0.5,0.5,0.5).
     */
    get anchors(): Vector4f;
    set anchors(value: Vector4f);
    /**
     * @description Gets or sets the four edge positions of the element relative to the anchor center, in pixels.
     * Format: (left, right, bottom, top). Derived from anchoredPosition + sizeDelta + pivot (not stored independently):
     *   left   = anchoredPosition.x - sizeDelta.x * pivot.x
     *   right  = anchoredPosition.x + sizeDelta.x * (1 - pivot.x)
     *   bottom = anchoredPosition.y - sizeDelta.y * pivot.y
     *   top    = anchoredPosition.y + sizeDelta.y * (1 - pivot.y)
     * Writing offsets back-calculates and updates sizeDelta and anchoredPosition accordingly.
     * The values are not clamped: if `right < left` or `top < bottom`, the element's size becomes
     * negative on that axis. The current `pivot` is used as-is for the back-calculation, so the
     * resulting anchoredPosition depends on it.
     */
    get offsets(): Vector4f;
    set offsets(value: Vector4f);
    /**
     * @description Gets or sets the 2D scaling factor applied to the UI element.
     * Default is `(1, 1)` (no scaling). Values greater than 1 enlarge the element, while values
     * between 0 and 1 shrink it. A component of `0` collapses the element to zero size on that
     * axis (it becomes invisible); negative values mirror the element along that axis.
     * The scale is applied relative to the parent transform and centered on the pivot point.
     */
    get scale(): Vector2f;
    set scale(value: Vector2f);
    /**
     * @description Gets or sets the 2D rotation angle in degrees applied to the UI element.
     * Positive values = counter-clockwise. Rotation is relative to parent and centered on the pivot point.
     */
    get rotation(): number;
    set rotation(value: number);
  }
  /**
   * @description Defines the shadow casting and receiving modes for a renderable object.
   *
   * **Engine limitation — no combined "cast & receive" mode.**
   * Unlike many engines that expose a `CastAndReceive` (or "On") mode in addition to
   * `Off`/`ShadowsOnly`/`ReceiveOnly`, this enum is intentionally exclusive: a single
   * renderable can be a `Caster`, a `Receiver`, or `None`, but **not both at the same
   * time**. If you need an object to both cast and receive shadows, you must split it
   * into two renderables (for example, two materials/meshes on the same scene object)
   * and assign one `Caster` and one `Receiver`.
   *
   * @enum
   */
  enum ShadowMode {
    /** The object casts shadows but does not receive them. */
    Caster = 1,
    /** The object receives shadows but does not cast them. */
    Receiver = 2,
    /** The object neither casts nor receives shadows. */
    None = 0
  }
  /**
   * @class SkinMeshRenderer
   * @description A renderer component that draws a skinned {@link Mesh} deformed by skeletal
   * animation. It requires a mesh carrying skinning data (joint indices and weights) bound to a
   * skeleton; without skinning data it renders like a static mesh. {@link getBoundingBox} returns
   * the world-space bounds computed from the joint bounding boxes when a skin is present, or the
   * mesh bounds otherwise.
   */
  class SkinMeshRenderer extends Renderer {
    protected constructor();
    /**
     * @description Gets the mesh associated with the SkinMeshRenderer.
     */
    get mesh(): Mesh;
    /**
     * @description Sets the mesh for the SkinMeshRenderer. For correct skinning the mesh
     * must be compatible with the bound skeleton; a mesh without skinning data may not
     * deform. The new mesh takes effect on the next render frame.
     */
    set mesh(value: Mesh);
    /**
     * @description Gets the first shared material used by the SkinMeshRenderer.
     * The material is shared — mutating it affects all renderers that reference it.
     * @returns The shared material, or `null` if none is assigned.
     */
    get mainMaterial(): Material | null;
    /**
     * @description Sets the main material for the SkinMeshRenderer.
     * The material is shared — mutating it affects all renderers that reference it.
     * Setting `null` detaches the material, after which {@link mainPass} returns `null`.
     * @param value - The material to set as the main material, or `null` to detach.
     */
    set mainMaterial(value: Material | null);
    /**
     * @description Retrieves the main pass from this renderer's shared material.
     * Returns `null` when no shared material is assigned or the material has no passes.
     * The returned {@link Pass} wraps the shared material's first pass, so mutating it
     * affects every renderer that references that material.
     * @returns The first pass of the shared material, or `null` if unavailable.
     */
    get mainPass(): Pass | null;
    /**
     * @description Retrieves the renderer's axis-aligned bounding box in world space.
     * When a skin is assigned, the AABB is computed from the joint bounding boxes;
     * otherwise it is derived from the assigned mesh's bounds. The value is
     * recomputed on each call.
     * @returns The bounding box wrapped as an APJS {@link AABB}.
     */
    getBoundingBox(): AABB;
  }
  /**
   * @class SoundEventDetector
   * @description Sound event detector.
   * Reads the latest frame of audio features from its input source and exposes predicted sound event types.
   * Use `enabled` to temporarily stop reading results without rebuilding the detector.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.SoundEvent);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     this.detector = builder.build();
   * }
   * onUpdate(dt: number) {
   *     if (this.detector) {
   *         const results = this.detector.getResult();
   *         for (const result of results) {
   *             console.log(result.type, result.similarity);
   *         }
   *     }
   * }
   */
  class SoundEventDetector implements IAudioDetector {
    protected constructor();
    /**
     * @description Whether the detector is enabled.
     * Default: `true`.
     * When `false`, `getResult()` returns an empty array and `getSimilarityByType()` returns `-1`.
     * @example
     * this.audioEventDetector.enabled = false;
     */
    enabled: boolean;
    /**
     * @description Returns the current frame's sound event results.
     * Only event types whose similarity is greater than `0` are included in the returned array.
     * Each `similarity` is in the range `[0, 1]`. The array is ordered by sound event type
     * (matching the {@link SoundEventType} declaration order), not sorted by similarity.
     * Returns an empty array when the detector is disabled or no extractor result is available.
     * Results are trigger-like and may be absent in adjacent frames. Treat one result above
     * the chosen threshold as a successful detection; do not require it to remain present for
     * a continuous duration. For human imitations of animal sounds, use a threshold greater
     * than `0.01`.
     * @example
     * const results = this.audioEventDetector.getResult();
     * for (const result of results) {
     *   console.log(result.type, result.similarity);
     * }
     */
    getResult(): SoundEventResult[];
    /**
     * @description Returns the current frame's similarity for a specific sound event type.
     * The returned similarity is in the range `[0, 1]`, where higher values mean a stronger match.
     * Returns `-1` when the detector is disabled, no extractor result is available, or the type is not found.
     * When there are other event types, but the target type is not predicted, the return values will be `0` instead of `-1`.
     * Values may be intermittent because sound-event detection is trigger-like. Treat one value
     * above the chosen threshold as a hit instead of requiring a sustained sequence. For human
     * imitations of animal sounds, a value greater than `0.01` is sufficient.
     * @example
     * const catResult = this.audioEventDetector.getSimilarityByType(APJS.SoundEventType.Cat);
     * console.log(catResult);
     */
    getSimilarityByType(type: SoundEventType): number;
  }
  /**
   * @class SoundEventDetectorBuilder
   * @description Builder for SoundEventDetector.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.SoundEvent) as APJS.SoundEventDetectorBuilder;
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     const detector = builder.build();
   * }
   */
  class SoundEventDetectorBuilder extends AudioDetectorBuilder<SoundEventDetector> {
    protected constructor();
    /**
     * @description Build the SoundEventDetector. The detector should be built in `onInit`.
     * Returns `null` when audio detection is not available in the current runtime
     * environment, or when the configured source type is not one of `Microphone`,
     * `Music` or `ExternalFile` (e.g. left as `None`). Each call constructs and returns
     * a new detector instance; calling it repeatedly does not reuse a previously built
     * detector.
     */
    build(): SoundEventDetector | null;
  }
  /**
   * @class SoundEventResult
   * @description One sound event prediction returned by {@link SoundEventDetector.getResult()}.
   * @example
   * const results = this.audioEventDetector.getResult();
   * for (const result of results) {
   *   console.log(result.type, result.similarity);
   * }
   */
  class SoundEventResult {
    constructor(type: SoundEventType, similarity: number);
    /**
     * @description Detected sound event type.
     */
    type: SoundEventType;
    /**
     * @description Similarity score for this sound event type.
     * Range: [0, 1], where 1 means a high confidence of the sound event type.
     * Detection is strict for human imitations of animal sounds; a score greater than
     * `0.01` is a practical acceptance threshold for that use case.
     */
    similarity: number;
  }
  /**
   * @enum SoundEventType
   * @description Audio sound event type used by `SoundEventDetector` and related APIs
   * (e.g. `getSimilarityByType`).
   *
   * **String stability.** This is a string enum and the underlying string values
   * (e.g. `"Speech"`, `"Cat"`, `"BabyCry"`) correspond to the labels exported from
   * the underlying audio classification model. Reference them through
   * `APJS.SoundEventType.<Member>` rather than typing the raw string is recommended.
   *
   * **Case sensitivity.** The string values are **case-sensitive**. Always reference
   * them through `APJS.SoundEventType.<Member>` (or `SoundEventType.<Member>`) rather
   * than typing the raw string, so a future internal rename cannot silently break
   * your code.
   *
   * **Serialization / interop.** Because the values are plain strings, they may be
   * persisted (e.g. into save data, analytics events, or remote configs) and round-
   * tripped through `SoundEventType[someString as SoundEventType]`. When doing so,
   * always validate the incoming string against `Object.values(SoundEventType)`
   * before passing it to detector APIs — unknown strings are not guaranteed to throw
   * and may silently match nothing.
   * @example
   * const catResult = this.audioEventDetector.getSimilarityByType(APJS.SoundEventType.Cat);
   */
  enum SoundEventType {
    Speech = "Speech",
    Singing = "Singing",
    Whispering = "Whispering",
    Laughter = "Laughter",
    CryingAndSobbing = "CryingAndSobbing",
    Yell = "Yell",
    Whistling = "Whistling",
    Breathing = "Breathing",
    Snoring = "Snoring",
    Cough = "Cough",
    Sneeze = "Sneeze",
    Hiccup = "Hiccup",
    Fart = "Fart",
    FingerSnapping = "FingerSnapping",
    Clapping = "Clapping",
    HeartSoundsAndHeartbeat = "HeartSoundsAndHeartbeat",
    Cheering = "Cheering",
    Applause = "Applause",
    Dog = "Dog",
    Cat = "Cat",
    Moo = "Moo",
    Pig = "Pig",
    Sheep = "Sheep",
    CrowingAndCockADoodleDoo = "CrowingAndCockADoodleDoo",
    Duck = "Duck",
    ChirpAndTweet = "ChirpAndTweet",
    Crow = "Crow",
    FlyAndHousefly = "FlyAndHousefly",
    Frog = "Frog",
    Snake = "Snake",
    MusicBGM = "MusicBGM",
    EmergencyVehicle = "EmergencyVehicle",
    Doorbell = "Doorbell",
    Knock = "Knock",
    Typing = "Typing",
    Alarm = "Alarm",
    TelephoneBellRinging = "TelephoneBellRinging",
    AlarmClock = "AlarmClock",
    GunshotAndGunfire = "GunshotAndGunfire",
    WhiteNoise = "WhiteNoise"
  }
  /**
   * @class SpectrumDetector
   * @description Detects the raw audio frequency spectrum in real time.
   *
   * `getResult()` returns 512 spectrum magnitudes in decibels (dB), covering 0 Hz
   * to 22050 Hz and ordered from lower to higher frequencies. Values are typically
   * in [-100, -30], where a value closer to -30 represents a stronger frequency
   * component. These values are relative FFT magnitudes, not calibrated sound
   * pressure levels (dB SPL).
   * Each bin covers approximately 22050 / 512 ≈ 43 Hz.
   *
   * To derive a simple band-level summary, average consecutive dB bins. Dividing
   * the result into 8 equal bands of 64 bins maps to these approximate frequency
   * ranges:
   * - Band 0: 0 Hz – 2756 Hz (bins 0–63)
   * - Band 1: 2756 Hz – 5512 Hz (bins 64–127)
   * - Band 2: 5512 Hz – 8269 Hz (bins 128–191)
   * - Band 3: 8269 Hz – 11025 Hz (bins 192–255)
   * - Band 4: 11025 Hz – 13781 Hz (bins 256–319)
   * - Band 5: 13781 Hz – 16537 Hz (bins 320–383)
   * - Band 6: 16537 Hz – 19293 Hz (bins 384–447)
   * - Band 7: 19293 Hz – 22050 Hz (bins 448–511)
   *
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Spectrum);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     this.detector = builder.build();
   * }
   * onUpdate(dt: number) {
   *     const raw = this.detector.getResult(); // 512 dB magnitudes, typically [-100, -30]
   *     if (raw.length === 0) return;
   *
   *     // Overall average magnitude in dB
   *     const avgDb = raw.reduce((sum, v) => sum + v, 0) / raw.length;
   *
   *     // Divide into 8 frequency bands (64 bins each)
   *     const NUM_BANDS = 8;
   *     const BINS_PER_BAND = raw.length / NUM_BANDS; // 64
   *     const bands: number[] = [];
   *     for (let i = 0; i < NUM_BANDS; i++) {
   *         const slice = raw.slice(i * BINS_PER_BAND, (i + 1) * BINS_PER_BAND);
   *         bands[i] = slice.reduce((sum, v) => sum + v, 0) / slice.length;
   *     }
   *     console.log('avgDb:', avgDb, 'bandsDb:', bands);
   * }
   */
  class SpectrumDetector extends BaseAudioDetector {
    protected constructor();
    /**
     * @description Gets the current spectrum detection result.
     *
     * @returns Array of 512 spectrum magnitudes in dB, typically in [-100, -30],
     * or an empty array when no result is available.
     */
    getResult(): Array<number>;
  }
  /**
   * @class SpectrumDetectorBuilder
   * @description A builder for spectrum detector to set the source of the detector and build the detector.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Spectrum);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     const detector = builder.build();
   * }
   */
  class SpectrumDetectorBuilder extends AudioDetectorBuilder<SpectrumDetector> {
    protected constructor();
    /**
     * @description Set the source of the detector.
     * @param type - The type of audio source. Default is None. When the type is ExternalFile, the audioComponent must be provided.
     * @param audioComponent - The audio component which plays the external audio file.
     * @example
     * audioDetectorBuilder
     *     .setDetectorSource(APJS.AudioSourceType.ExternalFile, audioComponent)
     *     .build();
     * @returns Builder instance for chaining.
     */
    setDetectorSource(type: AudioSourceType, audioComponent: IAudioComponent | null): this;
    /**
     * @description Build the spectrum detector. Note that the detector should be built in onInit, otherwise it will return null.
     * @returns Detector instance of the spectrum detector.
     */
    build(): SpectrumDetector | null;
  }
  /**
   * @class SphereCollider
   * @description Represents a sphere-shaped collider component used for physics collision detection.
   * Use this for round collision volumes such as simple projectiles, pickups,
   * or approximate body volumes.
   * Inherited properties such as {@link center}, {@link isTangible}, and
   * {@link emitCollisionEvent} still apply.
   *
   * @example
   * const sphere = obj.getComponent("SphereCollider") as APJS.SphereCollider;
   * sphere.radius = 12;
   * sphere.isTangible = false; // use as a spherical trigger volume
   */
  class SphereCollider extends Collider {
    protected constructor();
    /**
     * @description Gets or sets the authored radius of the sphere collider.
     * Larger values produce a larger spherical collision volume around the object.
     * This is a radius value, not a diameter. Defaults to 5, the same as the default sphere size.
     */
    get radius(): number;
    set radius(value: number);
  }
  /**
   * @class
   * @description Represents a spot light, which emits light from a single point in a cone shape.
   */
  class SpotLight extends Light {
    protected constructor();
    /**
     * @description Gets the attenuation range of the spot light.
     * The value uses the same distance unit as the scene transform.
     * It controls how quickly the light fades as distance increases in world space.
     * Larger values make the light affect a farther area, while smaller values make it fade more quickly.
     * Range: [`0.01`, `+inf`). Values less than `0.01` are clamped to `0.01`.
     */
    get attenuationRange(): number;
    /**
     * @description Sets the attenuation range of the spot light.
     * The value uses the same distance unit as the scene transform.
     * It controls how quickly the light fades as distance increases in world space.
     * Larger values make the light affect a farther area, while smaller values make it fade more quickly.
     * Range: [`0.01`, `+inf`). Values less than `0.01` are clamped to `0.01`.
     */
    set attenuationRange(value: number);
    /**
     * @description Gets the inner angle of the spot light's cone, in degrees. Within this angle, the light is at its full intensity.
     * Default: `0`. Should be kept smaller than {@link outerAngle}; the light falls off from this angle out to the outer angle.
     */
    get innerAngle(): number;
    /**
     * @description Sets the inner angle of the spot light's cone, in degrees. Within this angle, the light is at its full intensity.
     * Default: `0`. This value is not clamped here; set it smaller than {@link outerAngle}, because the
     * outer angle is internally forced to stay at least slightly larger than the inner angle.
     */
    set innerAngle(value: number);
    /**
     * @description Gets the outer angle of the spot light's cone, in degrees. The light intensity gradually falls off from the inner angle to this outer angle.
     * Default: `45`. Beyond this angle the light contributes nothing.
     */
    get outerAngle(): number;
    /**
     * @description Sets the outer angle of the spot light's cone, in degrees. The light intensity gradually falls off from the inner angle to this outer angle.
     * Default: `45`. The stored value is forced to be at least slightly larger than {@link innerAngle}, so assigning a value
     * smaller than or equal to the current inner angle is raised to just above it.
     */
    set outerAngle(value: number);
  }
  /**
   * @class SpringJoint
   * @description A 3D spring joint that pulls two RigidBodies back toward their
   * initial relative positions. Can break at {@link breakingForce}; when it
   * breaks, only this joint stops solving.
   */
  class SpringJoint extends Joint3D {
    protected constructor();
    /**
     * @description Spring damping. Higher values make the spring settle faster.
     * Recommended range `[0, 1]`. Values outside this range are stored but produce
     * exponentially extreme behavior and should be avoided. default: `0`.
     * @returns The damping value.
     */
    get damping(): number;
    /**
     * @description Spring damping. Higher values make the spring settle faster.
     * Recommended range `[0, 1]`. Values outside this range are stored but produce
     * exponentially extreme behavior and should be avoided.
     * @param value - The damping value.
     */
    set damping(value: number);
    /**
     * @description Spring softness. Higher values let the bodies separate farther before
     * the spring pulls back strongly. Recommended range `[0, 1]`. Values outside this range
     * are stored but produce exponentially extreme behavior and should be avoided. default: `0`.
     * @returns The tolerance value.
     */
    get tolerance(): number;
    /**
     * @description Spring softness. Higher values let the bodies separate farther before
     * the spring pulls back strongly. Recommended range `[0, 1]`. Values outside this range
     * are stored but produce exponentially extreme behavior and should be avoided.
     * @param value - The tolerance value.
     */
    set tolerance(value: number);
  }
  /**
   * @class SpringJoint2D
   * @description A 2D spring joint that pulls two bodies back toward their initial relative positions.
   */
  class SpringJoint2D extends Joint2D {
    protected constructor();
    /**
     * @description Spring damping. Higher values make the spring settle faster.
     * Authoring range `[0, 1]` (enforced by the editor). Script values outside this range
     * are stored but produce exponentially extreme behavior and should be avoided. default: `0.7`.
     * @return the damping value.
     */
    get damping(): number;
    /**
     * @description Spring damping. Higher values make the spring settle faster.
     * Authoring range `[0, 1]` (enforced by the editor). Script values outside this range
     * are stored but produce exponentially extreme behavior and should be avoided.
     * @param value - The damping value.
     */
    set damping(value: number);
    /**
     * @description Spring softness. Higher values let the bodies separate farther before
     * the spring pulls back strongly. Authoring range `[0, 1]` (enforced by the editor).
     * Script values outside this range are stored but produce exponentially extreme
     * behavior and should be avoided. default: `0.5`.
     * @return the tolerance value.
     */
    get tolerance(): number;
    /**
     * @description Spring softness. Higher values let the bodies separate farther before
     * the spring pulls back strongly. Authoring range `[0, 1]` (enforced by the editor).
     * Script values outside this range are stored but produce exponentially extreme
     * behavior and should be avoided.
     * @param value - The tolerance value.
     */
    set tolerance(value: number);
  }
  /**
   * @description Stencil function used for comparing stencil values.
   * @enum
   */
  enum StencilFunction {
    /** The comparison never passes. */
    Never,
    /** The comparison passes if the reference value is less than the stored stencil value. */
    Less,
    /** The comparison passes if the reference value is equal to the stored stencil value. */
    Equal,
    /** The comparison passes if the reference value is less than or equal to the stored stencil value. */
    LessOrEqual,
    /** The comparison passes if the reference value is greater than the stored stencil value. */
    Greater,
    /** The comparison passes if the reference value is not equal to the stored stencil value. */
    NotEqual,
    /** The comparison passes if the reference value is greater than or equal to the stored stencil value. */
    GreaterOrEqual,
    /** The comparison always passes. */
    Always
  }
  /**
   * @description Defines the operations that can be performed on the stencil buffer.
   * @enum
   */
  enum StencilOperation {
    /** Keeps the current value of the stencil buffer. */
    Keep,
    /** Sets the stencil buffer to zero. */
    Zero,
    /** Replaces the current stencil buffer value with a reference value. */
    Replace,
    /** the current stencil buffer value and clamps it to the maximum representable unsigned integer. */
    IncrementAndClamp,
    /** Decrements the current stencil buffer value and clamps it to zero. */
    DecrementAndClamp,
    /** Bitwise inverts the current stencil buffer value. */
    Invert,
    /** Increments the current stencil buffer value and wraps it around if necessary. */
    IncrementAndWrap,
    /** Decrements the current stencil buffer value and wraps it around if necessary. */
    DecrementAndWrap
  }
  /**
   * @class DepthStencilState
   * @description Script-facing stencil state for a render pass.
   * Stencil testing is disabled by default.
   * APJS mirrors the operation, compare, mask, and reference accessors to both front and back faces
   * through one shared `StencilOpState`, which is created lazily on the first setter call.
   *
   * When this object comes from `Pass.stencilState`, changing it does not by itself refresh the
   * pass. Assign the modified object back afterward:
   * `const state = pass.stencilState; state.referenceValue = 1; pass.stencilState = state;`.
   */
  class StencilState extends AObject {
    protected constructor();
    /**
     * @description Indicates whether stencil testing is enabled.
     * @return whether stencil testing is enabled. default: `false`
     */
    get enable(): boolean;
    /**
     * @description Enables or disables the stencil test for the StencilState.
     * @param value - True to enable the stencil test, false to disable it.
     */
    set enable(value: boolean);
    /**
     * @description Operation to perform when the stencil test fails.
     * @return the stencil fail operation. default: `StencilOperation.Keep`
     */
    get failOperation(): StencilOperation;
    /**
     * @description Sets the operation to perform when the stencil test fails for both front and back faces.
     * The first write lazily creates one shared stencil operation state and applies the same value
     * to both faces.
     * @param value - The stencil operation to set.
     */
    set failOperation(value: StencilOperation);
    /**
     * @description Operation to perform when the stencil test passes.
     * @return the stencil pass operation. default: `StencilOperation.Keep`
     */
    get passOperation(): StencilOperation;
    /**
     * @description Sets the operation to perform when the stencil test passes for both front and back faces.
     * The first write lazily creates one shared stencil operation state and applies the same value
     * to both faces.
     * @param value - The stencil operation to set.
     */
    set passOperation(value: StencilOperation);
    /**
     * @description Comparison function for the stencil test.
     * @return the stencil compare function. default: `StencilFunction.Always`
     */
    get compareFunction(): StencilFunction;
    /**
     * @description Sets the compare function for the stencil state.
     * @param value - The stencil function to set.
     */
    set compareFunction(value: StencilFunction);
    /**
     * @description Mask applied to stencil-buffer compare operations. 32-bit unsigned;
     * range `[0, 255]`.
     * @return the compare mask. Default: 255
     */
    get readMask(): number;
    /**
     * @description Sets the read mask for the stencil state.
     * APJS mirrors the same value to both front and back compare masks. The underlying native field
     * is a `uint32`, and this wrapper does not clamp or validate the provided number.
     * @param value - The mask value to set for reading operations.
     */
    set readMask(value: number);
    /**
     * @description Mask applied to stencil-buffer write operations.
     * range `[0, 255]`. This wrapper does not validate or clamp the provided number.
     * @return the write mask. Default: 255
     */
    get writeMask(): number;
    /**
     * @description Sets the write mask for both front and back stencil states.
     * APJS mirrors the same value to both faces. The underlying native field is a `uint32`, and
     * this wrapper does not clamp or validate the provided number.
     * @param value - The mask value to set for writing operations.
     */
    set writeMask(value: number);
    /**
     * @description Reference value for the stencil test. 32-bit unsigned;
     * Values outside this range are truncated by the native uint32 binding without warning.
     * @return the reference value. Default: `0`. Range `[0, 0xFFFFFFFF]`.
     */
    get referenceValue(): number;
    /**
     * @description Sets the reference value for both front and back stencil operations.
     * Values outside `[0, 255]` are truncated by the native binding.
     * @param value - The reference value to set.
     */
    set referenceValue(value: number);
  }
  /**
   * @description Defines how an element should be stretched to fit a container.
   * @enum
   */
  enum StretchMode {
    /** Scales the content to fit the container while maintaining its aspect ratio. The content is not cropped. */
    Fit = 0,
    /** Scales the content to fit the container's width while maintaining its aspect ratio. */
    FitWidth = 1,
    /** Scales the content to fit the container's height while maintaining its aspect ratio. */
    FitHeight = 2,
    /** Stretches the content to fill the container, which may not preserve the aspect ratio. */
    Stretch = 3,
    /** Scales the content to fill the container while maintaining its aspect ratio. The content may be cropped. */
    Fill = 4,
    /** Alias for Fill. Scales the content to fill the container and crops if necessary. */
    FillAndCut = 5,
    /** The content is not scaled and its original size is used. */
    TextureSize = 6
  }
  /**
   * @class Text3D
   * @extends BaseText
   * @description Generates an individual 3D mesh and MeshRenderer for each supported glyph in a text string.
   */
  class Text3D extends Component {
    protected constructor();
    /**
     * @description The displayed text. Newline characters create additional lines. The engine
     * processes at most the first 50 characters for 3D glyph generation; spaces and newlines
     * participate in layout but do not create glyph meshes.
     */
    get text(): string;
    set text(value: string);
    /**
     * @description Font size in Inspector units, with supported range [1, 1000]. 1 produces the
     * smallest supported glyph scale, while larger values proportionally enlarge the text; the
     * default is 72. APJS converts this value to the native font-size scale but does not clamp it.
     */
    get fontSize(): number;
    set fontSize(value: number);
    /**
     * @description Additional spacing between adjacent characters, measured in multiples of the
     * text row height. The supported range is [0, 1]: 0 adds no extra gap, while 1 adds one row
     * height; larger values produce wider spacing. APJS does not clamp the value.
     * @type {number}
     */
    get letterSpacing(): number;
    set letterSpacing(value: number);
    /**
     * @description Additional spacing between lines, measured in multiples of the text row height.
     * The supported range is [0, 2]: 0 adds no extra gap, while 2 adds two row heights; larger values
     * move lines farther apart. APJS does not clamp the value.
     * @return float
     */
    get lineSpacing(): number;
    set lineSpacing(value: number);
    /**
     * @description Horizontal alignment of each laid-out line within the Text3D layout rectangle.
     * @type {Text3DHorizontalAlignment}
     */
    get horizontalAlignment(): Text3DHorizontalAlignment;
    set horizontalAlignment(value: Text3DHorizontalAlignment);
    /**
     * @description Vertical alignment of the complete laid-out text block within the Text3D layout rectangle.
     * @type {Text3DVerticalAlignment}
     */
    get verticalAlignment(): Text3DVerticalAlignment;
    set verticalAlignment(value: Text3DVerticalAlignment);
    /**
     * @description Glyph extrusion depth in the supported range [0, 1]. 0 produces flat glyph
     * geometry; larger values produce thicker geometry, with 1 being the maximum
     * Inspector-supported depth. APJS does not clamp the value.
     * @type {number}
     */
    get extrudeDepth(): number;
    set extrudeDepth(value: number);
    /**
     * @description Direction of extrusion along the glyph's local Z axis. Both straddles the
     * original glyph plane, Forward extends toward +Z, and Back extends toward -Z.
     */
    get extrudeDirection(): ExtrudeDirection;
    set extrudeDirection(value: ExtrudeDirection);
    /**
     * @description Whether each generated glyph MeshRenderer casts shadows. A visible result also
     * requires a shadow-capable light and receiving geometry.
     * @type {boolean}
     */
    get castShadow(): boolean;
    set castShadow(value: boolean);
    /**
     * @description Material assigned to every generated glyph MeshRenderer. Setting null clears the
     * material assignment, so generated glyph meshes normally produce no visible surface.
     * @type {Material}
     */
    get textMaterial(): Material | null;
    set textMaterial(value: Material | null);
    /**
     * @description Synchronously processes pending character, layout, 3D cache, and mesh changes.
     * Use it when updated geometry or bounds must be read before the next frame; render-entity and
     * material refresh still occurs in the normal system update.
     * @returns {void}
     */
    forceTypeSetting(): void;
  }
  /**
   * @description Controls the horizontal alignment of each laid-out line within the Text3D layout
   * rectangle. For multiline text, the engine applies the selected mode to each line independently;
   * it does not change character spacing, line spacing, or line breaks.
   * @enum
   */
  enum Text3DHorizontalAlignment {
    /** Places each line at the left edge of the Text3D layout rectangle. */
    Left,
    /** Centers each line horizontally within the Text3D layout rectangle. */
    Center,
    /** Places each line at the right edge of the Text3D layout rectangle. */
    Right
  }
  /**
   * @description Controls the vertical alignment of the complete laid-out text block within the
   * Text3D layout rectangle. Unlike horizontal alignment, this mode positions all lines as one block,
   * including the gaps introduced by {@link Text3D.lineSpacing}; it does not change the layout itself.
   * @enum
   */
  enum Text3DVerticalAlignment {
    /** Places the complete text block at the top edge of the Text3D layout rectangle. */
    Top = 5,
    /** Centers the complete text block vertically within the Text3D layout rectangle. */
    Center = 6,
    /** Places the complete text block at the bottom edge of the Text3D layout rectangle. */
    Bottom = 7
  }
  /**
   * @class Text
   * @description Represents a text component in the scene, used to display strings of text.
   * Style properties such as {@link fontSize}, {@link color}, {@link bold}, and {@link italic}
   * primarily mutate {@link activeTextStyle}, while layout properties such as
   * {@link horizontalAlignment}, {@link verticalAlignment}, {@link letterSpacing}, and
   * {@link lineSpacing} primarily mutate {@link typeSettingParam}.
   * New wrapper instances start with centered horizontal / vertical alignment, `AutoLineBreak`,
   * fixed font size, and vector background enabled.
   * Assigning {@link textLocale} also refreshes the fallback font list used for RTL locales.
   */
  class Text extends Renderer {
    protected constructor();
    /**
     * @description Gets the font size in pixels.
     * This wrapper does not clamp or enforce a minimum when reading or writing this value.
     */
    get fontSize(): number;
    /**
     * @description Sets the font size in pixels.
     * Default: 72 set by editor.
     * This wrapper does not clamp or enforce a minimum.
     */
    set fontSize(value: number);
    /**
     * @description Gets the font size in pixels.
     * This wrapper does not clamp or enforce a minimum when reading or writing this value.
     */
    get fontPixelSize(): number;
    /**
     * @description Sets the font size in pixels.
     * Default: 72 set by editor.
     * This wrapper does not clamp or enforce a minimum.
     */
    set fontPixelSize(value: number);
    /**
     * @description Gets the spacing between letters, in units of line height (same as
     * font size). Default is `0` (no extra gap). For example, with a font size of `32`,
     * a value of `0.5` adds `16` pixels of extra spacing between letters. Negative values
     * pull letters closer together; the value is not range-clamped.
     */
    get letterSpacing(): number;
    /**
     * @description Sets the spacing between letters, in units of line height (same as
     * font size). Default is `0` (no extra gap). For example, with a font size of `32`,
     * a value of `0.5` adds `16` pixels of extra spacing between letters. Negative values
     * pull letters closer together; the value is not range-clamped.
     */
    set letterSpacing(value: number);
    /**
     * @description Gets the spacing between lines, in units of line height (same as
     * font size). Default is `0` (no extra gap between baselines). For example, with a font
     * size of `32`, a value of `0.5` adds `16` pixels of extra spacing between lines. Negative
     * values move lines closer together; the value is not range-clamped.
     */
    get lineSpacing(): number;
    /**
     * @description Sets the spacing between lines, in units of line height (same as
     * font size). Default is `0` (no extra gap between baselines). For example, with a font
     * size of `32`, a value of `0.5` adds `16` pixels of extra spacing between lines. Negative
     * values move lines closer together; the value is not range-clamped.
     */
    set lineSpacing(value: number);
    /**
     * @description Gets the plain text content of the text component.
     */
    get text(): string;
    /**
     * @description Sets the plain text content of the text component.
     * Does not strip line breaks, escape sequences, or other characters.
     */
    set text(value: string);
    /**
     * @description Gets the global opacity of the text, its styles, and the background.
     * Range `[0, 1]`, default `1.0`. Values outside this range are forwarded as-is
     * (no clamping); rendering multiplies this value into the text and background alpha.
     */
    get opacity(): number;
    /**
     * @description Sets the global opacity of the text, its styles, and the background.
     * Range `[0, 1]`, default `1.0`. Values outside this range are forwarded as-is
     * (no clamping); rendering multiplies this value into the text and background alpha.
     */
    set opacity(value: number);
    /**
     * @description Gets the current bold state based on font style.
     * Returns `true` only when the bold style flag is set on the active text style. Note this
     * reflects the requested flag, not whether the font actually rendered a bold glyph.
     */
    get bold(): boolean;
    /**
     * @description Sets the current bold state based on font style.
     * The bold style flag is toggled regardless of the font. The bold appearance only shows if
     * the active font provides a bold variant; if it does not, the flag has no visible effect and
     * the text keeps its regular weight.
     */
    set bold(enable: boolean);
    /**
     * @description Gets the current italic state based on font style.
     * Returns `true` only when the italic style flag is set on the active text style. Note this
     * reflects the requested flag, not whether the font actually rendered an italic glyph.
     */
    get italic(): boolean;
    /**
     * @description Sets the current italic state based on font style.
     * The italic style flag is toggled regardless of the font. The italic appearance only shows
     * if the active font provides an italic variant; if it does not, the flag has no visible
     * effect and the text keeps its upright form.
     */
    set italic(enable: boolean);
    /**
     * @description Gets the local horizontal alignment relative to the writing direction.
     * Values: `Left`, `Center`, `Right`, `Flush` (justified). When set to `Flush` and
     * the text contains RTL characters, the alignment falls back to `Center`.
     */
    get horizontalAlignment(): HorizontalAlignment;
    /**
     * @description Sets the local horizontal alignment relative to the writing direction.
     * Values: `Left`, `Center`, `Right`, `Flush` (justified). When set to `Flush` and
     * the text contains RTL characters, the alignment falls back to `Center`.
     * @example
     * ```ts
     * text.horizontalAlignment = HorizontalAlignment.Center;
     * ```
     */
    set horizontalAlignment(value: HorizontalAlignment);
    /**
     * @description Gets the local vertical alignment relative to the writing direction.
     * Values: `Top`, `Center`, `Bottom`. This mapping is independent of the current
     * writing mode (horizontal or vertical).
     */
    get verticalAlignment(): VerticalAlignment;
    /**
     * @description Sets the local vertical alignment relative to the writing direction.
     * Values: `Top`, `Center`, `Bottom`. This mapping is independent of the current
     * writing mode (horizontal or vertical).
     * @example
     * ```ts
     * text.verticalAlignment = VerticalAlignment.Center;
     * ```
     */
    set verticalAlignment(value: VerticalAlignment);
    /**
     * @description Gets or sets the fill color used for the text glyphs.
     * This affects the primary letter fill layer only and does not create,
     * remove, or recolor outline or shadow layers.
     */
    get color(): Color;
    set color(value: Color);
    /**
     * @description Gets the color of an existing outline layer.
     * Outline layers must already exist in editor-authored text data. Script can
     * read or recolor them, but cannot create or remove them.
     *
     * @example
     * // Gets the color of the first outline
     * const color = text.getOutlineColorAtIndex(0);
     * @param index - The outline layer index (0-based); returns `undefined` if out of range.
     * @returns The outline color, or `undefined` if the index is out of range.
     */
    getOutlineColorAtIndex(index: number): Color | undefined;
    /**
     * @description Sets the color of an existing outline layer.
     * Outline layers must already exist in editor-authored text data. Script can
     * recolor them, but cannot create or remove them.
     *
     * @example
     * // Sets the color of the first outline
     * const color = new Color(1, 1, 1, 1);
     * text.setOutlineColorAtIndex(0, color);
     * @param index - The outline layer index (0-based); silently ignored if out of range.
     * @param color - The new outline color.
     */
    setOutlineColorAtIndex(index: number, color: Color): void;
    /**
     * @description Gets the color of an existing shadow layer.
     * Shadow layers must already exist in editor-authored text data. Script can
     * read or recolor them, but cannot create or remove them.
     *
     * @example
     * // Gets the color of the first shadow
     * const color = text.getShadowColorAtIndex(0);
     * @param index - The shadow layer index (0-based); returns `undefined` if out of range.
     * @returns The shadow color, or `undefined` if the index is out of range.
     */
    getShadowColorAtIndex(index: number): Color | undefined;
    /**
     * @description Sets the color of an existing shadow layer.
     * Shadow layers must already exist in editor-authored text data. Script can
     * recolor them, but cannot create or remove them.
     *
     * @example
     * // Sets the color of the first shadow
     * const color = new Color(1, 1, 1, 1);
     * text.setShadowColorAtIndex(0, color);
     * @param index - The shadow layer index (0-based); silently ignored if out of range.
     * @param color - The new shadow color.
     */
    setShadowColorAtIndex(index: number, color: Color): void;
    /**
     * @description Returns the number of outline layers currently defined on this text.
     * @returns The outline layer count.
     */
    getOutlineCount(): number;
    /**
     * @description Returns the number of shadow layers currently defined on this text.
     * @returns The shadow layer count.
     */
    getShadowCount(): number;
  }
  /**
   * @class Texture
   * @description Base wrapper for runtime texture objects such as `Texture2D`, `TextureCube`,
   * `RenderTexture`, `DrawTexture`, and related derived texture types.
   * Use {@link getControl} to access the provider object that exposes editable settings for the
   * concrete texture source.
   */
  class Texture extends AObject {
    protected constructor();
    /**
     * @description Gets whether mipmapping is enabled for this texture.
     * Default: `false`.
     * @returns Whether mipmapping is enabled.
     */
    get enableMipmap(): boolean;
    /**
     * @description Enables or disables mipmapping for this texture.
     * New native textures default to `false`.
     * Setting this property forwards the boolean directly to native texture state. In native code,
     * disabling mipmaps forces the mip-level count back to `1`, while enabling restores the
     * texture's possible mip count.
     * Native texture code explicitly warns that toggling this at runtime may be expensive because
     * texture uploads can be slow.
     * @param value - Whether to enable mipmapping.
     */
    set enableMipmap(value: boolean);
    /**
     * @description Gets the minimization filter mode of this texture.
     * Default: {@link FilterMode.Linear}.
     * @returns The current minimization filter mode.
     */
    get filterMin(): FilterMode;
    /**
     * @description Sets the minimization filter mode of this texture.
     * Default: {@link FilterMode.Linear}.
     * @param value - The filter mode to set for minimization.
     */
    set filterMin(value: FilterMode);
    /**
     * @description Gets the magnification filter mode of this texture.
     * Default: {@link FilterMode.Linear}.
     * @returns The current magnification filter mode.
     */
    get filterMag(): FilterMode;
    /**
     * @description Sets the magnification filter mode of this texture.
     * Default: {@link FilterMode.Linear}.
     * @param value - The filter mode to set for magnification.
     */
    set filterMag(value: FilterMode);
    /**
     * @description Gets the mipmap filtering mode of this texture.
     * New native textures default to {@link FilterMipmapMode.None}.
     * This property controls how sampling chooses between mip levels when mipmaps are available.
     * @returns The current mipmap mode.
     */
    get filterMipmap(): FilterMipmapMode;
    /**
     * @description Sets the mipmap filtering mode of this texture.
     * New native textures default to {@link FilterMipmapMode.None}.
     * This property controls how sampling chooses between mip levels when mipmaps are available.
     * @param value - The mipmap filtering mode to set.
     */
    set filterMipmap(value: FilterMipmapMode);
    /**
     * @description Gets the wrap mode for the `S` coordinate dimension.
     * `S` is the first texture-coordinate dimension.
     * Default: {@link WrapMode.Clamp}.
     * @returns The current wrap mode for the `S` coordinate dimension.
     */
    get wrapModeS(): WrapMode;
    /**
     * @description Sets the wrap mode for the `S` coordinate dimension.
     * `S` is the first texture-coordinate dimension.
     * Default: {@link WrapMode.Clamp}.
     * @param value - The wrap mode to set for the `S` coordinate dimension.
     */
    set wrapModeS(value: WrapMode);
    /**
     * @description Gets the wrap mode for the `T` coordinate dimension.
     * `T` is the second texture-coordinate dimension.
     * Default: {@link WrapMode.Clamp}.
     * @returns The current wrap mode for the `T` coordinate dimension.
     */
    get wrapModeT(): WrapMode;
    /**
     * @description Sets the wrap mode for the `T` coordinate dimension.
     * `T` is the second texture-coordinate dimension.
     * Default: {@link WrapMode.Clamp}.
     * @param value - The wrap mode to set for the `T` coordinate dimension.
     */
    set wrapModeT(value: WrapMode);
    /**
     * @description Gets the wrap mode for the `R` coordinate dimension.
     * `R` is the third texture-coordinate dimension.
     * Default: {@link WrapMode.Clamp}.
     * @returns The current wrap mode for the `R` coordinate dimension.
     */
    get wrapModeR(): WrapMode;
    /**
     * @description Sets the wrap mode for the `R` coordinate dimension.
     * `R` is the third texture-coordinate dimension.
     * Default: {@link WrapMode.Clamp}.
     * @param value - The wrap mode to set for the `R` coordinate dimension.
     */
    set wrapModeR(value: WrapMode);
    /**
     * @description Gets the maximum anisotropy level of this texture.
     * New native textures default to `1`.
     * Native texture state stores this as an integer sampler parameter.
     * @returns The maximum anisotropy level as a number.
     */
    get maxAnisotropy(): number;
    /**
     * @description Sets the maximum anisotropy level of this texture.
     * New native textures default to `1`.
     * Larger values can improve texture quality at oblique viewing angles. Native texture code caps
     * values above `16` to `16` (`MAX_TEXTURE_ANISOTROPY`), but APJS does not clamp negative or
     * otherwise low values in this layer before forwarding them.
     * @param value - The maximum anisotropy level to set.
     */
    set maxAnisotropy(value: number);
    /**
     * @description Retrieves the current native width of this texture in pixels.
     * APJS returns the native `width` field directly without recomputing or normalizing it.
     * @returns The width of the texture as a number.
     */
    getWidth(): number;
    /**
     * @description Retrieves the current native height of this texture in pixels.
     * APJS returns the native `height` field directly without recomputing or normalizing it.
     * @returns The height of the texture as a number.
     */
    getHeight(): number;
    /**
     * @description Retrieves the native depth value reported by this texture.
     * APJS returns the native `depth` / layer field directly. Native texture code returns `0` for
     * `Texture2D`.
     * @returns The depth of the texture as a number.
     */
    getDepth(): number;
    /**
     * @description Returns the {@link TextureProvider} associated with this texture.
     * The provider exposes the texture's underlying data source (for example an image asset,
     * render texture, or other dynamic source) and is the recommended way to inspect or replace
     * texture content from script.
     * In runtime builds, APJS first asks the dynamic-asset manager to load JSAsset providers if
     * needed, then tries to resolve a provider by this texture's `guid`. If no runtime provider is
     * found, APJS falls back to the cached provider created in the constructor or supplied by the
     * caller.
     * @returns The provider that backs this texture.
     */
    getControl(): TextureProvider;
  }
  /**
   * @class Texture2DProvider
   * @description A `TextureProvider` for 2D textures.
   * Use this provider when you need to configure or inspect 2D-texture-specific
   * state, such as readability, pixel access, the bound {@link ImageAsset}, or
   * alpha premultiplication metadata. Use the Texture object itself when you
   * only need to pass the texture to another API or bind it as an input.
   * @example
   * const tex = TextureUtils.createTexture2D();
   * const provider = tex.getControl() as Texture2DProvider;
   */
  class Texture2DProvider extends TextureProvider {
    protected constructor();
    /**
     * @description Gets whether the bound image's inner memory data is marked as alpha premultiplied.
     * This flag is read from `Texture2D.image.alphaPermul`, not from the texture sampler state.
     * Native `Image` objects default this inner-memory flag to `false`.
     * If this texture currently has no bound image, APJS returns `false`.
     * @default false
     */
    get alphaPremul(): boolean;
    /**
     * @description Sets whether the bound image's inner memory data is marked as alpha premultiplied.
     * This property only writes `Texture2D.image.alphaPermul`. It does not change sampler settings
     * or create a new image object for the texture.
     * If this texture currently has no bound image, the setter does nothing.
     * @param value - Whether to enable alpha premultiplication.
     */
    set alphaPremul(value: boolean);
  }
  /**
   * @class TextureDelegateProvider
   * @description
   * <br/><b>new TextureDelegateProvider() is an invalid constructor</b>
   * <br/>If you need a Delegate texture, you can get a texture by calling TextureUtil.createTextureDelegate()
   */
  class TextureDelegateProvider extends TextureProvider {
    protected constructor();
  }
  /**
   * @class TextureProvider
   * @description
   * TextureProvider. Basic properties and functionality of all TextureProviders
   * <br/>then you can use TextureUtil to create texture.
   */
  class TextureProvider extends Provider {
    protected constructor();
  }
  /**
   * @class TouchData
   * @description The touch data is carried by touch event, record the info of one touch point.
   */
  class TouchData extends AObject {
    protected constructor();
    /**
     * @readonly
     * @description The touch phase of this touch.
     * @returns The current phase of the touch as a TouchPhase enum value.
     */
    get phase(): TouchPhase;
    /**
     * @readonly
     * @description Gets the position of the touch in normalized screen coordinates.
     * Coordinates use the range [0, 1]. `x` is horizontal (0 = left, 1 = right).
     * This is the same coordinate format used by {@link TouchUtils.isScreenPointOnImage}.
     *
     * **Important:** `y` is in a flipped coordinate space — 0 = top of screen, 1 = bottom.
     * This is the **opposite** of standard screen space and world space (where y increases upward).
     * Always flip `y` before using the position for world-space calculations or UI placement:
     *
     * @example
     * const touch = event.args[0] as APJS.TouchData;
     * const touchPos = new APJS.Vector2f(touch.position.x, 1.0 - touch.position.y);
     * const screenPos = touchPos.clone().multiply(new APJS.Vector2f(720, 1280));
     *
     * @returns Normalized position of the touch as a Vector2f. Value range: x ∈ [0, 1], y ∈ [0, 1] (0 = top, 1 = bottom).
     */
    get position(): Vector2f;
    /**
     * @readonly
     * @description Get the touch pressure value reported by the underlying platform input API.
     * APJS forwards this value as-is; it does not normalize it or apply a fallback value.
     */
    get force(): number;
    /**
     * @readonly
     * @description Get the unique identifier for this touch.
     * @returns The unique ID of the touch, useful for tracking individual touches in multi-touch scenarios.
     */
    get touchId(): number;
    /**
     * @readonly
     * @description Get the number of active touches on the screen at the moment this touch
     * event was generated, including this touch itself.
     * @returns The total number of active touches on the screen.
     */
    get touchCount(): number;
  }
  /**
   * @description TouchPhase
   * @enum
   * @property Began - Touch screen began.
   * @property Moved - Touch screen moved.
   * @property Ended - Touch was lifted from the screen, This is the final phase of a touch.
   * @property Canceled - The device cancelled tracking for touch.
   */
  enum TouchPhase {
    Began,
    Moved,
    Ended,
    Canceled
  }
  /**
   * @namespace TouchUtils
   * @description Static helpers for touch-related queries and derived gestures.
   * This namespace contains hit-testing utilities for normalized touch points and the APJS pinch
   * event emitter entry point. Pinch events are exposed through {@link getPinchEmitter} and deliver
   * one {@link IPinchInfo}-shaped payload in `event.args[0]`.
   */
  namespace TouchUtils {
    /**
     * @description Whether a normalized touch point is on an image.
     * Although the parameter name is `screenPoint`, pass the normalized touch coordinates from `TouchData.position`.
     * @param {Vector2f} screenPoint A normalized touch point in the range [0, 1], typically from `TouchData.position`.
     * (0, 0) is the top-left corner of the screen; (1, 1) is the bottom-right corner; x increases rightward and y increases downward.
     * This is not the pixel-based screen space used by camera conversion APIs such as `Camera.screenToWorldPoint`
     * (which uses bottom-left origin with y increasing upward).
     * @param {Image} image The image component to judge. The image should be enabled and have a valid screen transform component. It should be rendered by a camera with the Orthographic type.
     * If `screenPoint` / `image` is missing, the image is invalid, or no compatible orthographic
     * camera can evaluate the image, this method returns `false`.
     * @returns {boolean} True if the normalized touch point is on the image, otherwise false.
     * @example
     * let callback = (event:APJS.IEvent) => {
     *     const touchInfo = event.args[0] as APJS.TouchData;
     *     if (touchInfo.phase === APJS.TouchPhase.Began && APJS.TouchUtils.isScreenPointOnImage(touchInfo.position, this.imageComponent)) {
     *         ...
     *     }
     * }
     * const globalEmitter = APJS.EventManager.getGlobalEmitter();
     * globalEmitter.on(APJS.EventType.Touch, callback);
     */
    function isScreenPointOnImage(screenPoint: Vector2f, image: Image): boolean;
    /**
     * @description Retrieves the singleton event emitter associated with pinch gestures.
     * The returned emitter derives pinch updates from global touch events and dispatches
     * `event.args[0]` as an {@link IPinchInfo} object with `scale` and `angle`.
     * Its `on` / `once` / `off` implementations ignore the `eventType` argument, so listener
     * registration is effectively keyed only by callback and optional context.
     * @returns The event emitter for pinch gestures.
     * @example
     * const emitter = APJS.TouchUtils.getPinchEmitter();
     * const callback = (event: APJS.IEvent) => {
     *   const pinchInfo = event.args[0] as APJS.IPinchInfo;
     *   const { scale, angle } = pinchInfo;
     *   // Do something with scale and angle, e.g. scale and rotate the image.
     *   this.imageTransform.scale = new APJS.Vector2f(scale, scale);
     *   this.imageTransform.rotation = angle * 180 / Math.PI;
     * }
     * emitter.on(0, callback); // The pinch emitter ignores eventName, so any number can be used.
     */
    function getPinchEmitter(): IEventEmitter;
  }
  /**
   * @class Transform
   * @description
   * Position, rotation and scale of an object.
   * <br/>Every object in a Scene has a Transform. It's used to store and manipulate the position, rotation and scale of the object.
   * <br/>Every Transform can have a parent, which allows you to apply position, rotation and scale hierarchically.
   * <br/>This is the hierarchy seen in the Hierarchy pane. You can iterate child transforms through the hierarchy APIs.
   * @example let transform = currObj.getTransform();
   */
  class Transform extends Component {
    protected constructor();
    /**
     * @description Get the Transform's position relative to its parent.
     * @returns The local position of the Transform.
     */
    get localPosition(): Vector3f;
    /**
     * @description Sets the local position of the transform using a Vector3f value.
     * @param value - The Vector3f value to set as the local position.
     */
    set localPosition(value: Vector3f);
    /**
     * @description Gets the Transform's rotation relative to its parent.
     * Returned as a unit quaternion `{x, y, z, w}`; only the combination encodes a rotation,
     * so do not interpret individual components in isolation.
     * @returns The local rotation as a Quaternionf.
     */
    get localRotation(): Quaternionf;
    /**
     * @description Sets the local rotation of the transform using a quaternion.
     * The value should be a unit quaternion (`x² + y² + z² + w² = 1`); non-normalized inputs
     * may produce skew or scale artifacts. The identity rotation is `{0, 0, 0, 1}`.
     * @param value - The Quaternionf value to set as the local rotation.
     */
    set localRotation(value: Quaternionf);
    /**
     * @description Gets the Transform's local euler angles in degrees.
     * <br/><b>Unit:</b> degrees. {@link Matrix4x4f.getEulerAngles} returns radians — convert when interoperating.
     * @returns The local Euler angles of the Transform.
     */
    get localEulerAngles(): Vector3f;
    /**
     * @description Sets the local Euler angles of the transform in degrees.
     * @param value - The Vector3f value to set as the local Euler angles.
     */
    set localEulerAngles(value: Vector3f);
    /**
     * @description Gets the Transform's scale relative to its parent.
     * @returns The local scale of the Transform.
     */
    get localScale(): Vector3f;
    /**
     * @description Sets the local scale of the transform using a Vector3f value.
     * @param value - The Vector3f value to set as the local scale.
     */
    set localScale(value: Vector3f);
    /**
     * @description Gets the local transformation matrix of the Transform.
     * The matrix combines local position, rotation and scale relative to the parent, and uses the
     * column-major convention shared by {@link Matrix4x4f}.
     * @returns The local matrix representing the object's position, rotation, and scale relative to its parent.
     */
    get localMatrix(): Matrix4x4f;
    /**
     * @description Sets the local transformation matrix of the object.
     * The matrix is interpreted column-major (see {@link Matrix4x4f}). It should be a valid affine
     * transform; the resulting localPosition/localRotation/localScale are derived from it, so shear
     * or non-affine parts are not represented exactly and are approximated.
     * @param value - The Matrix4x4f value to set as the local matrix.
     */
    set localMatrix(value: Matrix4x4f);
    /**
     * @description Get the world transformation matrix of this object.
     * <br/>Retrieving the world matrix may involve a matrix transformation operation.
     * @returns The world matrix representing the object's position, rotation, and scale in world space.
     */
    getWorldMatrix(): Matrix4x4f;
    /**
     * @description Sets the world transformation matrix for the object.
     * The matrix is interpreted column-major (see {@link Matrix4x4f}) and should be a valid affine
     * transform. The world position, rotation and scale are derived from it and combined with the
     * parent's world transform to update this object's local values, so shear or non-affine parts
     * are approximated.
     * @param matrix - The 4x4 matrix representing the new world transformation.
     */
    setWorldMatrix(matrix: Matrix4x4f): void;
    /**
     * @description Returns the Transform's position relative to the world.
     * <br/>Obtaining the position in world space may trigger a matrix transformation operation.
     * @returns The position of the Transform in world space.
     */
    getWorldPosition(): Vector3f;
    /**
     * @description Sets the Transform's position in world space.
     * <br/> Modifying the world position may result in a matrix transformation operation.
     * @param worldPosition - The desired world space position as a Vector3f.
     */
    setWorldPosition(worldPosition: Vector3f): void;
    /**
     * @description Returns the Transform's rotation relative to the world.
     * <br/>Obtaining the rotation in world space may trigger a matrix transformation operation.
     * Returned as a unit quaternion `{x, y, z, w}`; only the combination encodes a rotation, so do
     * not interpret individual components in isolation.
     * @returns The rotation of the transform in world space.
     */
    getWorldRotation(): Quaternionf;
    /**
     * @description Sets the Transform's rotation relative to the world.
     * <br/> Setting the world space rotation may trigger a matrix transformation operation.
     * The value should be a unit quaternion (`x² + y² + z² + w² = 1`); non-normalized inputs may
     * produce skew or scale artifacts. The identity rotation is `{0, 0, 0, 1}`.
     * @param worldRotation - The world space rotation as a Quaternionf.
     */
    setWorldRotation(worldRotation: Quaternionf): void;
    /**
     * @description Returns the Transform's Euler angles relative to the world.
     * <br/>Obtaining the rotation in world space may trigger a matrix transformation operation.
     * <br/><b>Unit:</b> degrees, applied in `YXZ` order (per-axis components: pitch X, yaw Y, roll Z).
     * {@link Matrix4x4f.getEulerAngles} returns radians — convert when interoperating.
     * @returns The world space Euler angles.
     */
    getWorldEulerAngles(): Vector3f;
    /**
     * @description Sets the Transform's Euler angles relative to the world.
     * <br/> Setting the world space rotation may trigger a matrix transformation operation.
     * <br/><b>Unit:</b> degrees, applied in `YXZ` order (per-axis components: pitch X, yaw Y, roll Z).
     * @param euler - The world space Euler angles.
     */
    setWorldEulerAngles(euler: Vector3f): void;
    /**
     * @description Returns the Transform's scale relative to the world.
     * <br/>Obtaining the scale in world space may trigger a matrix transformation operation.
     * @returns The scale of the transform in world space.
     */
    getWorldScale(): Vector3f;
    /**
     * @description Sets the Transform's scale relative to the world.
     * <br/>This may produce lossy results when parent objects are rotated, so assign to `localScale` instead if possible.
     * @param worldScale - the world space Scale as a Vector3f
     */
    setWorldScale(worldScale: Vector3f): void;
  }
  /**
   * @description Represents the event type for a user action, encoded as a number.
   */
  type UserEventType = number;
  /**
   * @class Vector2f
   * A two-dimensional vector.
   *
   * Most instance math methods (`add`, `subtract`, `multiply`, `divide`,
   * `multiplyScalar`, `normalize`, `set`, etc.) modify
   * this vector in place and return `this` for chaining. To compute a derived
   * value without mutating the source, {@link clone} first.
   *
   * @example
   * const next = pos.clone().add(velocity);
   */
  class Vector2f {
    /**
     * @description Represents the x-coordinate in a 2-dimensional vector.
     */
    x: number;
    /**
     * @description Represents the y-coordinate in a 2-dimensional vector.
     */
    y: number;
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * @param x - The x-coordinate of the vector (optional).
     * @param y - The y-coordinate of the vector (optional).
     */
    constructor(x?: number, y?: number);
    /**
     * @description Determines if this vector is equal to the specified vector.
     * This is a strict component-wise comparison with no floating-point tolerance.
     * @param vec - The vector to compare with.
     * @returns True if the vectors are equal, false otherwise.
     */
    equals(vec: Vector2f): boolean;
    /**
     * @description Sets the two-dimensional coordinates of this vector in place.
     * @param x - The x-coordinate to set.
     * @param y - The y-coordinate to set.
     * @returns This vector with updated coordinates.
     */
    set(x: number, y: number): this;
    /**
     * @description Creates and returns a new Vector2f with the same component values.
     * Use this before calling mutating math methods when the original value must be preserved.
     * @returns A new Vector2f with the same x and y values as this vector.
     */
    clone(): Vector2f;
    /**
     * @description Adds the components of `vec` to this vector in place.
     * @param vec - The vector whose components will be added to this vector.
     * @returns This vector with updated components after addition.
     */
    add(vec: Vector2f): this;
    /**
     * @description Subtracts the components of `vec` from this vector in place.
     * @param vec - The vector to subtract from this vector.
     * @returns This vector after subtraction.
     */
    subtract(vec: Vector2f): this;
    /**
     * @description Returns the angle in radians between the current vector and the specified vector `vec`.
     * The returned angle is in the closed range `[0, Math.PI]`.
     * If either vector has zero length, this method returns `Math.PI / 2` as the fallback value.
     * @param vec - The target vector to calculate the angle against.
     * @returns The angle in radians between the two vectors.
     */
    angleTo(vec: Vector2f): number;
    /**
     * @description Returns the squared length (magnitude) of the vector.
     * @returns The square of the vector's magnitude.
     */
    sqrMagnitude(): number;
    /**
     * @description Calculates and returns the magnitude (length) of the vector.
     * @returns The magnitude of the vector.
     */
    magnitude(): number;
    /**
     * @description Clamps the length of this vector to `length` in place.
     * If the current length exceeds `length`, the vector is scaled down to `length`.
     * Zero-length vectors are left unchanged. Negative `length` is not rejected
     * and will flip the direction, producing a vector with magnitude `abs(length)`.
     * @param length - The maximum length to clamp the vector to.
     * @returns This vector with its length clamped to the specified value.
     */
    clampLength(length: number): this;
    /**
     * @description Calculates and returns the Euclidean distance between the current vector and another vector `vec`.
     * @param vec - The target vector to which the distance is calculated.
     * @returns The distance between the two vectors.
     */
    distance(vec: Vector2f): number;
    /**
     * @description Divides this vector by `vec` component-wise in place.
     * Dividing by `0` produces `Infinity`, `-Infinity`, or `NaN` per component;
     * no exception is thrown.
     * @param vec - The vector to divide by, where each component divides the matching component of this vector.
     * @returns This vector after performing the division.
     */
    divide(vec: Vector2f): this;
    /**
     * @description Returns the dot product of the vector and `vec`.
     * @param vec - The vector to compute the dot product with.
     * @returns The dot product of the two vectors.
     */
    dot(vec: Vector2f): number;
    /**
     * @description Multiplies this vector in place.
     * If `value` is a number, both components are scaled by that number.
     * If `value` is a Vector2f, multiplication is performed component-wise.
     * When the operand is always a scalar, {@link multiplyScalar} is a more direct equivalent;
     * use this overload when the operand may be either a number or a Vector2f.
     * @param value - A number or another Vector2f to multiply with.
     * @returns This vector after performing the multiplication.
     */
    multiply(value: number | Vector2f): this;
    /**
     * @description Multiplies both components of this vector by `scale` in place.
     * @param scale - The scalar value to multiply the vector's components by.
     * @returns This vector with updated components.
     */
    multiplyScalar(scale: number): this;
    /**
     * @description Normalizes this vector in place so its magnitude becomes 1.
     * If the magnitude is zero, the vector is left unchanged.
     * @returns This vector after normalization.
     */
    normalize(): this;
    /**
     * @description Projects this vector onto `vec` in place.
     * If `vec` has zero length, this vector is set to `(0, 0)`.
     * @param vec - The vector to project onto.
     * @returns This vector after projection.
     */
    project(vec: Vector2f): this;
    /**
     * @description Reflects this vector across the plane defined by the normal `vec` in place.
     * `vec` must be a unit normal for a geometrically correct reflection; it is not
     * normalized automatically.
     *
     * @param vec - The normal vector defining the reflection plane.
     * @returns This vector after reflection.
     */
    reflect(vec: Vector2f): this;
    /**
     * @description Replaces each component with its reciprocal in place.
     * If `x` or `y` is `0`, the corresponding result becomes `Infinity` (or
     * `-Infinity` for `-0`); no exception is thrown.
     * @returns `this` after inversion.
     */
    inverse(): this;
    /**
     * @description Returns a string representation of the vector.
     * @returns A string in the format "Vector2f(x, y)" where x and y are fixed to 5 decimal places.
     */
    toString(): string;
    /**
     * @description Approximate comparison of the two vectors by the value of
     * each dimension with a specified distance threshold.
     * @param vec1 - The first vector to compare.
     * @param vec2 - The second vector to compare.
     * @param dist - The maximum allowed difference between corresponding
     * dimensions for the vectors to be considered approximately equal.
     * @returns A boolean indicating whether the two vectors are approximately
     * equal within the given distance threshold.
     * @example
     * let a = new Vector2f(0.0000001, 0.0000001);
     * let b = new Vector2f(0.0000000, 0.0000000);
     * Vector2f.compareApproximately(a, b, 0.0001); // true
     */
    static compareApproximately(vec1: Vector2f, vec2: Vector2f, dist: number): boolean;
    /**
     * @description Linearly interpolates between the two vectors `vecA` and `vecB` by the factor `t`.
     * @param vecA - The starting vector.
     * @param vecB - The ending vector.
     * @param t - The interpolation factor, typically ranging from 0 to 1.
     * @returns A new Vector2f representing the interpolated position between `vecA` and `vecB`.
     */
    static lerp(vecA: Vector2f, vecB: Vector2f, t: number): Vector2f;
    /**
     * @description Returns a new vector containing the largest value of each component from the two input vectors.
     * @param vecA - The first vector to compare.
     * @param vecB - The second vector to compare.
     * @returns A new Vector2f with components set to the maximum values from vecA and vecB.
     */
    static max(vecA: Vector2f, vecB: Vector2f): Vector2f;
    /**
     * @description Returns a new vector containing the smallest value of each component from the two input vectors.
     * @param vecA - The first vector to compare.
     * @param vecB - The second vector to compare.
     * @returns A new Vector2f with components set to the minimum values from vecA and vecB.
     */
    static min(vecA: Vector2f, vecB: Vector2f): Vector2f;
  }
  /**
   * @class Vector3f
   * A three-dimensional vector.
   *
   * Most instance math methods (`add`, `subtract`, `multiply`, `divide`,
   * `multiplyScalar`, `normalize`, `cross`, `set`, etc.)
   * modify this vector in place and return `this` for chaining. To compute a derived
   * value without mutating the source, {@link clone} first.
   *
   * @example
   * transform.localPosition = transform.localPosition.clone().add(delta);
   */
  class Vector3f {
    /**
     * @description Represents the x-coordinate in a 3-dimensional vector.
     */
    x: number;
    /**
     * @description Represents the y-coordinate in a 3-dimensional vector.
     */
    y: number;
    /**
     * @description Represents the z-coordinate in a 3-dimensional vector.
     */
    z: number;
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * @param x - The X component of the vector (optional).
     * @param y - The Y component of the vector (optional).
     * @param z - The Z component of the vector (optional).
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * @description Calculates and returns the magnitude (length) of the vector.
     * @returns The magnitude of the vector.
     */
    magnitude(): number;
    /**
     * @description Returns the squared magnitude (length) of the vector.
     * @returns The squared magnitude of the vector.
     */
    sqrMagnitude(): number;
    /**
     * @description Determines if this vector is equal to the specified vector.
     * Comparison is strict and component-wise: `x`, `y`, and `z` must all match exactly.
     * This method does not apply any floating-point tolerance.
     * @param other - The vector to compare with.
     * @returns A boolean indicating whether the vectors are equal.
     */
    equals(other: Vector3f): boolean;
    /**
     * @description Returns a string representation of the vector.
     * @returns A string in the format "Vector3f(x, y, z)" where x, y, and z are fixed to 5 decimal places.
     */
    toString(): string;
    /**
     * @description Sets the three-dimensional coordinates of this vector in place.
     * @param x - The x-coordinate value to set.
     * @param y - The y-coordinate value to set.
     * @param z - The z-coordinate value to set.
     * @returns This instance with updated coordinates.
     */
    set(x: number, y: number, z: number): this;
    /**
     * @description Returns the angle in radians between the current vector and another specified vector.
     * The returned angle is in the closed range `[0, Math.PI]`.
     * If either vector has zero length, this method returns `Math.PI / 2` as the fallback value.
     * @param other - The target vector to calculate the angle against.
     * @returns The angle in radians between the two vectors.
     */
    angleTo(other: Vector3f): number;
    /**
     * @description Clamps the length of this vector to `length` in place.
     * If the current length exceeds `length`, the vector is scaled down to `length`.
     * Zero-length vectors are left unchanged. A `length` of `0`, `NaN`, or another
     * falsy value falls back to `1`. Negative values are not rejected
     * and will flip the direction.
     * @param length - The maximum length to clamp the vector to.
     * @returns `this` after clamping.
     */
    clampLength(length: number): this;
    /**
     * @description Creates and returns a new Vector3f with the same component values.
     * Use this before calling mutating math methods when the original value must be preserved.
     * @returns A new Vector3f that is a clone of this vector.
     */
    clone(): Vector3f;
    /**
     * @description Computes the cross product with `other` and stores the result in this vector.
     * @param other - The vector to compute the cross product with.
     * @returns This vector after computing the cross product.
     */
    cross(other: Vector3f): this;
    /**
     * @description Calculates and returns the Euclidean distance between the current vector and another vector.
     * @param other - The target vector to calculate the distance to.
     * @returns The distance between the two vectors.
     */
    distance(other: Vector3f): number;
    /**
     * @description Divides this vector by `value` component-wise (or by a scalar) in place.
     * Dividing by `0` produces `Infinity`, `-Infinity`, or `NaN` per component;
     * no exception is thrown.
     * @param value - The divisor (Vector3f for component-wise, or number for scalar).
     * @returns `this` after division.
     */
    divide(value: number | Vector3f): this;
    /**
     * @description Returns the dot product of the vector and another vector.
     * @param other - The vector to compute the dot product with.
     * @returns The dot product of the two vectors.
     */
    dot(other: Vector3f): number;
    /**
     * @description Multiplies this vector in place.
     * If `value` is a Vector3f, multiplication is performed component-wise.
     * If `value` is a number, all components are scaled by that number.
     * @param value - A Vector3f or a number to multiply with the vector's components.
     * @returns This vector after multiplication.
     */
    multiply(value: number | Vector3f): this;
    /**
     * @description Multiplies all components of this vector by `scalar` in place.
     * @param scalar - The number to multiply each component of the vector by.
     * @returns This vector with updated components.
     */
    multiplyScalar(scalar: number): this;
    /**
     * @description Normalizes this vector in place so its magnitude becomes 1.
     * If the magnitude is zero, the vector is left unchanged.
     * @returns This vector after normalization.
     */
    normalize(): this;
    /**
     * @description Projects this vector onto `other` in place.
     * If `other` has zero length, this vector is set to `(0, 0, 0)`.
     * @param other - The vector onto which this vector is projected.
     * @returns This vector after projection.
     */
    project(other: Vector3f): this;
    /**
     * @description Projects this vector onto the plane defined by `normal` in place.
     * `normal` is normalized internally; it does not need to be a unit vector.
     * If `normal` has zero length, normalization yields `(0, 0, 0)` and this vector
     * is left unchanged.
     * @param normal - The normal vector of the plane to project onto.
     * @returns This vector after being projected onto the specified plane.
     */
    projectOnPlane(normal: Vector3f): this;
    /**
     * @description Reflects this vector across the plane defined by the normal `normal` in place.
     * `normal` must be a unit normal for a geometrically correct reflection; it is not
     * normalized automatically.
     * @param normal - The normal vector defining the reflection plane.
     * @returns This vector after reflection.
     */
    reflect(normal: Vector3f): this;
    /**
     * @description Adds the components of `other` to this vector in place.
     * @param other - The vector whose components will be added to this vector.
     * @returns This vector with updated components after addition.
     */
    add(other: Vector3f): this;
    /**
     * @description Subtracts the components of `other` from this vector in place.
     * @param other - The vector to subtract from this vector.
     * @returns This vector after subtraction.
     */
    subtract(other: Vector3f): this;
    /**
     * @description Replaces each component with its reciprocal in place.
     * If `x`, `y`, or `z` is `0`, the corresponding result becomes `Infinity`
     * (or `-Infinity` for `-0`); no exception is thrown.
     * @returns `this` after inversion.
     */
    inverse(): this;
    /**
     * @description Linearly interpolates between the two vectors `vecA` and `vecB` by the factor `t`.
     * @param vecA - The starting vector.
     * @param vecB - The ending vector.
     * @param t - The interpolation factor, typically ranging from 0 to 1.
     * @returns A new `Vector3f` that represents the interpolated position between `vecA` and `vecB`.
     */
    static lerp(vecA: Vector3f, vecB: Vector3f, t: number): Vector3f;
    /**
     * @description Approximately compares two vectors by the value of each component with a specified tolerance.
     * @param vec1 - The first vector to compare.
     * @param vec2 - The second vector to compare.
     * @param dist - The maximum allowed difference between corresponding
     * components for the vectors to be considered approximately equal.
     * @returns True if the vectors are approximately equal within the given tolerance, false otherwise.
     * @example
     * let a = new Vector3f(0.0000001, 0.0000001, 0.0000001);
     * let b = new Vector3f(0.0000000, 0.0000000, 0.0);
     * Vector3f.compareApproximately(a, b, 0.0001); // true
     */
    static compareApproximately(vec1: Vector3f, vec2: Vector3f, dist: number): boolean;
    /**
     * @description Returns a new vector containing the largest value of each component from the two input vectors.
     * @param vecA - The first vector to compare.
     * @param vecB - The second vector to compare.
     * @returns A new Vector3f instance with components set to the maximum values from vecA and vecB.
     */
    static max(vecA: Vector3f, vecB: Vector3f): Vector3f;
    /**
     * @description Returns a new vector containing the smallest value of each component from the two input vectors.
     * @param vecA - The first vector to compare.
     * @param vecB - The second vector to compare.
     * @returns A new Vector3f instance with components set to the minimum values from vecA and vecB.
     */
    static min(vecA: Vector3f, vecB: Vector3f): Vector3f;
  }
  /**
   * @class Vector4f
   * A four-dimensional vector.
   *
   * Most instance math methods (`add`, `subtract`, `multiply`, `divide`,
   * `multiplyScalar`, `normalize`, `set`, etc.)
   * modify this vector in place and return `this` for chaining. To compute a derived
   * value without mutating the source, {@link clone} first.
   *
   * @example
   * const dimmed = color.clone().multiplyScalar(0.5);
   */
  class Vector4f {
    /**
     * @description Represents the x-coordinate in a four-dimensional vector.
     */
    x: number;
    /**
     * @description Represents the y-coordinate in a four-dimensional vector.
     */
    y: number;
    /**
     * @description Represents the z-coordinate in a four-dimensional vector.
     */
    z: number;
    /**
     * @description Represents the w component of a four-dimensional vector.
     */
    w: number;
    /**
     * @constructor
     */
    constructor();
    /**
     * @constructor
     * @param x - The x component of the vector (optional).
     * @param y - The y component of the vector (optional).
     * @param z - The z component of the vector (optional).
     * @param w - The w component of the vector (optional).
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * @constructor
     * @param x - A 3-dimensional vector representing the first three
     * components of the new vector. The fourth component is assumed to be 0.
     */
    constructor(x: Vector3f);
    /**
     * @constructor
     * @param x - An instance of Vector4f to initialize the new object with.
     */
    constructor(x: Vector4f);
    /**
     * @description Sets the four-dimensional components of this vector in place.
     * @param x - The value for the x component.
     * @param y - The value for the y component.
     * @param z - The value for the z component.
     * @param w - The value for the w component.
     * @returns This instance with updated components.
     */
    set(x: number, y: number, z: number, w: number): this;
    /**
     * @description Calculates and returns the Euclidean length (magnitude) of the vector.
     * @returns The length (magnitude) of the vector.
     */
    magnitude(): number;
    /**
     * @description Calculates and returns the squared magnitude of the vector,
     * which is the dot product of the vector with itself.
     * @returns The squared magnitude (length) of the vector.
     */
    sqrMagnitude(): number;
    /**
     * @description Adds the components of `other` to this vector in place.
     * @param other - The Vector4f whose components will be added to this vector.
     * @returns This Vector4f after addition.
     */
    add(other: Vector4f): this;
    /**
     * @description Subtracts the components of `other` from this vector in place.
     * @param other - The vector to subtract from this vector.
     * @returns This vector after subtraction.
     */
    subtract(other: Vector4f): this;
    /**
     * @description Clamps the length of this vector to `length` in place.
     * If the current length exceeds `length`, the vector is scaled down to `length`.
     * Zero-length vectors are left unchanged. A `length` of `0`, `NaN`, or another
     * falsy value falls back to `1`. Negative values are not rejected
     * and will flip the direction.
     * @param length - The maximum length to clamp the vector to.
     * @returns `this` after clamping.
     */
    clampLength(length: number): this;
    /**
     * @description Creates and returns a new Vector4f with the same component values.
     * Use this before calling mutating math methods when the original value must be preserved.
     * @returns A new Vector4f with the same values as the original.
     */
    clone(): Vector4f;
    /**
     * @description Calculates and returns the Euclidean distance between this
     * vector and another vector in 4-dimensional space.
     * @param other - The target vector to calculate the distance to.
     * @returns The calculated distance
     */
    distance(other: Vector4f): number;
    /**
     * @description Divides this vector by `other` component-wise in place.
     * Dividing by `0` produces `Infinity`, `-Infinity`, or `NaN` per component;
     * no exception is thrown.
     * @param other - The vector to divide by.
     * @returns `this` after division.
     */
    divide(other: Vector4f): this;
    /**
     * @description Returns the dot product of the vector and another vector.
     * @param other - The vector to calculate the dot product with.
     * @returns The dot product.
     */
    dot(other: Vector4f): number;
    /**
     * @description Determines if this Vector4f is equal to another Vector4f.
     * Comparison is strict and component-wise: `x`, `y`, `z`, and `w` must all match exactly.
     * This method does not apply any floating-point tolerance.
     * @param other - The Vector4f to compare with.
     * @returns True if the two vectors are equal, false otherwise.
     */
    equals(other: Vector4f): boolean;
    /**
     * @description Multiplies this vector in place.
     * If `other` is a Vector4f, multiplication is performed component-wise.
     * If `other` is a number, all components are scaled by that number.
     * @param other - The vector or scalar to multiply with.
     * @returns This vector after performing the multiplication.
     */
    multiply(other: Vector4f | number): this;
    /**
     * @description Multiplies all components of this vector by `scalar` in place.
     * @param scalar - The number to multiply each component of the vector by.
     * @returns This vector after performing the multiplication.
     */
    multiplyScalar(scalar: number): this;
    /**
     * @description Normalizes this vector in place so its magnitude becomes 1.
     * If the magnitude is zero, the vector is left unchanged.
     * @returns This vector after normalization.
     */
    normalize(): this;
    /**
     * @description Replaces each component with its reciprocal in place.
     * If any component is `0`, the corresponding result becomes `Infinity`
     * (or `-Infinity` for `-0`); no exception is thrown.
     * @returns `this` after inversion.
     */
    inverse(): this;
    /**
     * @description Returns a string representation of the vector.
     * @returns A string in the format "Vector4f(x, y, z, w)" where x, y, z, and w are fixed to 5 decimal places.
     */
    toString(): string;
    /**
     * @description Approximate comparison of the two vectors by the value of
     * each component within a specified distance.
     * @param vec1 - The first vector to compare.
     * @param vec2 - The second vector to compare.
     * @param dist - The maximum allowed difference between corresponding
     * components of the vectors for them to be considered approximately equal.
     * @returns A boolean indicating whether the vectors are approximately equal within the given distance.
     * @example
     * let a = new Vector4f(0.0000001, 0.0000001, 0.0000001, 0.0);
     * let b = new Vector4f(0.0000000, 0.0000000, 0.0, 0.0);
     * Vector4f.compareApproximately(a, b, 0.0001); // true
     */
    static compareApproximately(vec1: Vector4f, vec2: Vector4f, dist: number): boolean;
    /**
     * @description Linearly interpolates between the two vectors 'vecA' and 'vecB' by the factor 't'.
     * `t` is not clamped in this helper. Values outside `[0, 1]` therefore extrapolate beyond
     * `vecA` and `vecB` instead of being limited to the segment between them.
     * @param vecA - The starting vector.
     * @param vecB - The ending vector.
     * @param t - The interpolation factor, typically ranging from 0 to 1.
     * @returns A new Vector4f that represents the interpolated position between 'vecA' and 'vecB'.
     */
    static lerp(vecA: Vector4f, vecB: Vector4f, t: number): Vector4f;
    /**
     * @description Returns a new vector containing the largest value of each component from the two input vectors.
     * @param vecA - The first vector to compare.
     * @param vecB - The second vector to compare.
     * @returns A new Vector4f with components being the maximum values from vecA and vecB.
     */
    static max(vecA: Vector4f, vecB: Vector4f): Vector4f;
    /**
     * @description Returns a new vector containing the smallest value of each component from the two input vectors.
     * @param vecA - The first vector to compare.
     * @param vecB - The second vector to compare.
     * @returns A new Vector4f instance with components set to the minimum values from vecA and vecB.
     */
    static min(vecA: Vector4f, vecB: Vector4f): Vector4f;
  }
  /**
   * @class VertexAttributeDesc
   * @description Describes one vertex-attribute entry in a mesh-creation request.
   * All three fields are optional and only take effect when set. Typically set `attribute` together
   * with the matching `name`.
   * @example
   * ```ts
   * let desc = new VertexAttributeDesc();
   * desc.attribute = VertexAttributeType.Position;
   * desc.name = "position";
   * ```
   */
  class VertexAttributeDesc {
    /**
     * @description The semantic slot of this vertex attribute. Optional; defaults to `undefined`,
     * in which case the entry contributes no semantic.
     */
    attribute?: VertexAttributeType;
    /**
     * @description The attribute name. Optional; defaults to `undefined`, and is not required
     * when the semantic slot is identified by {@link attribute}. When used, set it together
     * with {@link attribute}.
     */
    name?: string;
    /**
     * @description Number of components for this attribute. Valid values are 1–4, mapping to a
     * scalar, Vector2, Vector3 and Vector4 respectively; other values are ignored. Optional;
     * defaults to `undefined`.
     */
    componentCount?: number;
  }
  /**
   * @description Types of vertex attributes used in rendering.
   * @enum
   */
  enum VertexAttributeType {
    /** Represents the position attribute of a vertex. */
    Position,
    /** Represents the normal attribute of a vertex. */
    Normal,
    /** Represents the tangent attribute of a vertex. */
    Tangent,
    /** Represents the binormal attribute of a vertex. */
    BiNormal,
    /** Represents the color attribute of a vertex. */
    Color,
    /** Represents the weight attribute of a vertex, often used for skinning. */
    Weight,
    /** Represents the first texture coordinate attribute of a vertex. */
    TexCoord0,
    /** Represents the second texture coordinate attribute of a vertex. */
    TexCoord1,
    /** Represents the third texture coordinate attribute of a vertex. */
    TexCoord2,
    /** Represents the fourth texture coordinate attribute of a vertex. */
    TexCoord3,
    /** Represents the fifth texture coordinate attribute of a vertex. */
    TexCoord4,
    /** Represents the sixth texture coordinate attribute of a vertex. */
    TexCoord5,
    /** Represents the seventh texture coordinate attribute of a vertex. */
    TexCoord6,
    /** Represents the eighth texture coordinate attribute of a vertex. */
    TexCoord7,
    /** Historical name for the first user-defined vertex attribute. */
    UserDefine0,
    /** Historical name for the second user-defined vertex attribute. */
    UserDefine1,
    /** Represents the indices attribute of a vertex, typically used for bone indices in skinning. */
    Indices,
    /** Represents an offset to the position attribute of a vertex. */
    PositionOffset,
    /** Represents an offset to the normal attribute of a vertex. */
    NormalOffset,
    /** Represents an offset to the tangent attribute of a vertex. */
    TangentOffset,
    /** Represents an unknown or undefined vertex attribute type. */
    Unknown
  }
  /**
   * @description Defines local vertical alignment types for text typesetting, which refers to the vertical alignment relative to the writing direction. Specifically, when the text is written horizontally, this alignment corresponds to the visually vertical direction. Conversely, in vertical writing mode, this alignment translates to the visually horizontal direction.
   * @enum
   */
  enum VerticalAlignment {
    /** Align to top edge. */
    Top,
    /** Center vertically. */
    Center,
    /** Align to bottom edge. */
    Bottom
  }
  /**
   * @description VFXStopBehavior
   * @enum
   * @property StopEmittingAndClear - Stop emitting and clear all particles.
   * @property StopEmitting - Stop emitting but keep existing particles.
   */
  enum VFXStopBehavior {
    StopEmittingAndClear = 0,
    StopEmitting = 1
  }
  /**
   * @class VisualEffect
   * @description Component that controls a visual effect instance (playback, seed, camera binding,
   * and exposed slot values). **To stop an effect, use `stop()` — do NOT disable the component.**
   * `stop()` supports two modes: `StopEmitting` (stop emitting, keep existing particles) and
   * `StopEmittingAndClear` (stop and clear all particles immediately). Use `play()` / `pause()` /
   * `stop()` / `reset()` for lifecycle control.
   * APJS also tracks a wrapper-side `isEmitting` flag in addition to native `isPlaying`, exposes the
   * current profile through {@link asset}, forwards `setStartSeed()` directly to the native VFX
   * system seed setter, and can optionally mirror native alive-particle counts into a fresh JS
   * array through {@link aliveParticleCounts}.
   */
  class VisualEffect extends Component {
    protected constructor();
    /**
     * @description The VFX profile asset used by this effect.
     * The getter wraps the current native `profile` reference, and may be `null` when no
     * profile is assigned. The setter accepts `null` to detach the current profile.
     * Setting this property only swaps the native profile reference in this wrapper layer; it does
     * not automatically call `reset()`, `play()`, or rebuild exposed-slot caches.
     */
    get asset(): VisualEffectAsset;
    set asset(value: VisualEffectAsset);
    /**
     * @description Stop the visual effect playback.
     * @param behavior Stop behavior, default is StopEmittingAndClear,
     *                 StopEmittingAndClear will stop the effect and clear all particles,
     *                 StopEmitting will stop the effect but keep existing particles.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (this.visualEffectComponent.isEmitting && otherCondition) {
     *       this.visualEffectComponent.stop(APJS.VFXStopBehavior.StopEmitting);
     *     } else if (this.visualEffectComponent.isPlaying && otherCondition) {
     *       this.visualEffectComponent.stop(); // StopEmittingAndClear by default
     *     }
     *   }
     * }
     */
    stop(behavior?: VFXStopBehavior): void;
    /**
     * @description Sets the random seed for the VFX simulation.
     * No range validation is performed.
     * The new seed is used by subsequent simulation updates.
     * Calling this method does not automatically `reset()` or `play()` the effect.
     * @param seed Random seed value
     */
    setStartSeed(seed: number): void;
    /**
     * @description Reset the visual effect to its initial state.
     * Clears particle data and {@link aliveParticleCounts}.
     * Does not change whether the effect is currently playing.
     * Does not restore the random seed to its default value.
     * Does not modify the wrapper-side `isEmitting` flag by itself.
     */
    reset(): void;
    /**
     * @description Start or resume the visual effect playback.
     */
    play(): void;
    /**
     * @description Pause the visual effect playback.
     */
    pause(): void;
    /**
     * @description Emits a burst immediately.
     * Use this for one-shot burst behavior when the effect is already playing.
     * Has no effect if `isEmitting` is `false` (i.e. after `stop()` has been called).
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (this.visualEffectComponent.isPlaying && triggerBurstOnce) {
     *       this.visualEffectComponent.emit();
     *     }
     *   }
     * }
     */
    emit(): void;
    /**
     * @description Whether the VFX system is currently running (i.e. particles are still being
     * simulated and rendered). Remains `true` after `stop(StopEmitting)` until all existing
     * particles have naturally expired. Becomes `false` only after `stop(StopEmittingAndClear)`.
     */
    get isPlaying(): boolean;
    /**
     * @description Whether the effect is currently spawning new particles.
     * Becomes `false` after any `stop()` call regardless of the stop behavior.
     * While `isEmitting` is `false` but `isPlaying` is still `true`, existing
     * particles continue to simulate until they expire naturally.
     */
    get isEmitting(): boolean;
    /**
     * @description Current alive particle counts for each system in the effect.
     * Each getter call copies the current native counts into a new JS array.
     * The order matches the native particle-system order used by the effect.
     * Counts are refreshed during effect updates only while {@link enableAliveParticleCount} is `true`.
     * When tracking is disabled, the last available counts remain unchanged until tracking is enabled
     * again or the effect is {@link reset}.
     */
    get aliveParticleCounts(): number[];
    /**
     * @description Enable or disable tracking of alive particle counts.
     * Disabled by default.
     * When enabled, native effect updates perform extra work to rebuild {@link aliveParticleCounts}.
     * When disabled, {@link aliveParticleCounts} stops refreshing and keeps its last available
     * values; before any counts are collected, or after {@link reset}, reading it returns an empty array.
     */
    get enableAliveParticleCount(): boolean;
    set enableAliveParticleCount(value: boolean);
  }
  /**
   * @class VisualEffectAsset
   * @description Represents a VFX profile resource.
   * It stores graph structure, point caches, attribute maps,
   * and simulation settings (such as instancing and prewarm).
   * Used as the asset backing a VisualEffect component.
   * Runtime key-based getters/setters such as {@link hasBoolKey}, {@link getFloat}, or
   * {@link setVector} discover legal keys by scanning each {@link contextBlocks} entry's
   * `exposeProperties` maps. Those APIs edit the profile resource itself; a {@link VisualEffect}
   * component consumes the current profile through its {@link VisualEffect.asset} reference.
   */
  class VisualEffectAsset extends AObject {
    protected constructor();
    /**
     * @description Checks if the VFX profile has a boolean key.
     * The key must match an exposed boolean property name from the VFX profile.
     * @param name - The name to check for in the boolean map.
     * @returns A boolean indicating whether the property exists in the VFX Profile.
     */
    hasBoolKey(name: string): boolean;
    /**
     * @description Gets a named boolean value from VFX Profile.
     * The key must match an exposed boolean property name from the VFX profile.
     * @param name - The name of the boolean property.
     * @returns The value of the boolean property or undefined.
     */
    getBool(name: string): boolean | undefined;
    /**
     * @description Sets a named boolean value on the VFX Profile.
     * The key must match an exposed boolean property name from the VFX profile.
     * If multiple context blocks expose the same key, this method updates every matching block.
     * If no matching exposed boolean key exists, this method does nothing.
     * @param name - The name of the boolean property.
     * @param value - The boolean value to set.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (conditions) {
     *       // Set specific property to true
     *       const asset = this.visualEffectComponent.asset;
     *       if (asset.hasBoolKey('Bool_0_0') && !asset.getBool('Bool_0_0')) {
     *         asset.setBool('Bool_0_0', true);
     *       }
     *     }
     *   }
     * }
     */
    setBool(name: string, value: boolean): void;
    /**
     * @description Checks if the VFX profile has an integer key.
     *
     * Two kinds of keys are accepted:
     * - **Exposed integer property names** declared on a {@link VisualEffectAsset.contextBlocks} entry's
     *   `exposeProperties` (the names you author/expose in the VFX graph). Names must match exactly
     *   (case-sensitive). When multiple context blocks expose the same name, returns `true` if any block contains it.
     * - **Derived spawn keys** of the form `burstcount_<index>`, `spawnratemin_<index>`,
     *   or `spawnratemax_<index>`, where `<index>` is the zero-based position in
     *   {@link VisualEffectAsset.contextBlocks} (i.e. `contextBlocks[<index>]`). The prefix
     *   is matched case-insensitively. Returns `true` when `<index>` is a valid block index.
     *
     * To discover available exposed names, inspect the VFX graph's exposed properties in the editor
     * or iterate {@link VisualEffectAsset.contextBlocks}.
     * @param name - The integer key to check.
     * @returns `true` if the key matches an exposed int property or a supported derived spawn key.
     */
    hasIntKey(name: string): boolean;
    /**
     * @description Gets a named integer value from VFX Profile.
     * The key can be either an exposed integer property name or a supported derived spawn key such as `burstcount_<index>`, `spawnratemin_<index>`, or `spawnratemax_<index>`.
     * @param name - The name of the integer property.
     * @returns The value of the integer property or undefined.
     */
    getInt(name: string): number | undefined;
    /**
     * @description Sets a named integer value to VFX Profile.
     * The key can be either an exposed integer property name or a supported derived spawn key such as `burstcount_<index>`, `spawnratemin_<index>`, or `spawnratemax_<index>`.
     * For derived spawn keys, APJS writes the underlying float spawn parameters directly:
     * `burstcount_<index>` becomes `spawnRateMin = value - 0.0001` and
     * `spawnRateMax = value + 0.0001`; `spawnratemin/max_<index>` write the corresponding
     * float field as-is.
     * For exposed integer keys, APJS forwards the authored `number` directly and does not clamp,
     * round, or validate it in this wrapper layer. If no key matches, this method does nothing.
     * @param name - The name of the integer property.
     * @param value - The integer value to set.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (conditions) {
     *       // Set specific property to 10
     *       const asset = this.visualEffectComponent.asset;
     *       if (asset.hasIntKey('Int_0_0') && asset.getInt('Int_0_0') !== 10) {
     *         asset.setInt('Int_0_0', 10);
     *       }
     *     }
     *   }
     * }
     */
    setInt(name: string, value: number): void;
    /**
     * @description Checks if the VFX profile has a float key.
     * The key can be either an exposed float property name or a supported derived spawn key.
     * `<index>` is the zero-based position in {@link contextBlocks} (i.e. `contextBlocks[<index>]`).
     * Derived spawn keys are only meaningful when `contextBlocks[<index>]` is a Spawner context,
     * because the Spawn Rate block (which owns these properties) can only be placed in a Spawner context.
     * Supported derived spawn keys:
     * - `spawnrate_<index>` - number of particles spawned per second by the Spawn Rate block of `contextBlocks[<index>]`
     * - `burstdelay_<index>` - delay in seconds the Spawn Rate block of `contextBlocks[<index>]` waits before each Periodic Burst.
     *   Returns `true` whenever `contextBlocks[<index>]` exists, regardless of its context type.
     *   Note: {@link getFloat} for this key returns `undefined` when `delayMin` and `delayMax` differ by more than 0.0003.
     * - `delaymin_<index>` - minimum delay in seconds the Spawn Rate block of `contextBlocks[<index>]` waits before each burst (Random mode)
     * - `delaymax_<index>` - maximum delay in seconds the Spawn Rate block of `contextBlocks[<index>]` waits before each burst (Random mode)
     * @param name - The key to check for in the float map.
     * @returns A boolean indicating whether the property exists in the VFX Profile.
     */
    hasFloatKey(name: string): boolean;
    /**
     * @description Gets a named float value from VFX Profile.
     * Returns `undefined` when `name` is empty, no matching exposed/derived float key exists, or
     * a supported derived key cannot be resolved from the required underlying properties.
     * For `burstdelay_<index>`, APJS only returns a number when `delayMin` and `delayMax` differ
     * by less than `0.0003`; otherwise it returns `undefined`.
     * @param name - The name of the float property.
     * @returns The value of the float property or undefined.
     */
    getFloat(name: string): number | undefined;
    /**
     * @description Sets a named float value to VFX Profile.
     * Supports both exposed float keys and derived spawn keys.
     * For `spawnrate_<index>`, APJS rewrites several underlying float properties together:
     * `originalSpawnRate`, `spawnRateMin`, `spawnRateMax`, `delayMin`, and `delayMax`.
     * For `burstdelay_<index>`, `delaymin_<index>`, and `delaymax_<index>`, APJS writes the
     * corresponding delay fields directly. The wrapper does not clamp or validate `value`; if no
     * key matches, this method does nothing.
     * @param name - The name of the float property.
     * @param value - The float value to set.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (conditions) {
     *       // Set specific property to 100.0
     *       const asset = this.visualEffectComponent.asset;
     *       if (asset.hasFloatKey('Float_0_0') && asset.getFloat('Float_0_0') < 100.0) {
     *         asset.setFloat('Float_0_0', 100.0);
     *       }
     *     }
     *   }
     * }
     */
    setFloat(name: string, value: number): void;
    /**
     * @description Checks if the VFX profile has a texture key.
     *
     * Texture keys must match the **exposed texture property names** declared on a
     * {@link VisualEffectAsset.contextBlocks} entry's `exposeProperties.texmap` (the names
     * you expose in the VFX graph). Matching is exact and case-sensitive. If multiple
     * context blocks expose the same key, this method returns `true` whenever any matching
     * block contains it.
     *
     * To discover available texture key names, inspect the VFX graph's exposed texture
     * properties in the editor, or iterate {@link VisualEffectAsset.contextBlocks} at runtime.
     * @param name - The texture key to check.
     * @returns `true` if any context block exposes a texture under this name.
     */
    hasTextureKey(name: string): boolean;
    /**
     * @description Gets a named texture value from VFX Profile.
     * Texture keys must match exposed texture property names from the VFX graph/profile exactly.
     * @param name - The name of the texture property.
     * @returns The value of the texture property, or `null` when no matching exposed texture key exists or no texture is currently assigned.
     */
    getTexture(name: string): Texture | null;
    /**
     * @description Sets a named texture value to VFX Profile.
     * Texture keys must match exposed texture property names from the VFX graph/profile exactly.
     * If multiple context blocks expose the same key, this method updates every matching block.
     * @param name - The name of the texture property.
     * @param value - The texture value to set.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     .....
     *     if (conditions) {
     *       // Set Texture to newTexture
     *       const asset = this.visualEffectComponent.asset;
     *       if (asset.hasTextureKey('Texture_0_0') && !asset.getTexture('Texture_0_0')) {
     *         asset.setTexture('Texture_0_0', newTexture);
     *       }
     *     }
     *   }
     * }
     */
    setTexture(name: string, value: Texture): void;
    /**
     * @description Checks if the VFX profile has a vector key.
     *
     * Vector keys must match the **exposed vector property names** declared on a
     * {@link VisualEffectAsset.contextBlocks} entry's `exposeProperties` (the names you
     * expose in the VFX graph). The check covers vec2, vec3, and vec4 backed exposed
     * properties, so a vector key found here may resolve to a `Vector2f`, `Vector3f`,
     * or `Vector4f` value at read time. Matching is exact and case-sensitive. The
     * dimension is decided by which underlying map (`vec2map`, `vec3map`, or
     * `vec4map`) holds the entry; see {@link VisualEffectAsset.getVector} for the
     * exact return-type rules.
     *
     * To discover available vector key names, inspect the VFX graph's exposed
     * properties in the editor, or iterate {@link VisualEffectAsset.contextBlocks}
     * at runtime.
     * @param name - The vector key to check.
     * @returns `true` if any context block exposes a vec2/vec3/vec4 property under this name.
     */
    hasVectorKey(name: string): boolean;
    /**
     * @description Gets a named vector value from VFX Profile.
     * Vector keys must match exposed vector property names from the VFX graph/profile exactly.
     * Returns Vector2f for vec2 keys.
     * This wrapper currently reads vec2-backed keys from `vec2map` and vec4-backed keys from
     * `vec4map`. Although {@link hasVectorKey} also checks `vec3map`, this getter does not have a
     * dedicated vec3 branch in the current implementation.
     * For vec4-backed keys whose name starts with `Vector3f_`, this method trims the stored vec4 value to a Vector3f.
     * Other vec4-backed keys return Vector4f.
     * @param name - The name of the vector property.
     * @returns The value of the vector property, or `null` when no matching exposed vector key exists.
     */
    getVector(name: string): Vector2f | Vector3f | Vector4f | null;
    /**
     * @description Sets a named vector value to VFX Profile.
     * Vector keys must match exposed vector property names from the VFX graph/profile exactly.
     * For vec2-backed keys, pass Vector2f.
     * For vec4-backed keys, pass Vector4f, or pass Vector3f only for keys that use the `Vector3f_` naming convention and are stored internally as vec4.
     * This wrapper currently writes only `vec2map` and `vec4map` entries; it does not have a
     * dedicated `vec3map` write path in the current implementation.
     * When a Vector3f is written to a matching vec4-backed key, APJS stores it as `(x, y, z, 0)`.
     * If multiple context blocks expose the same key, this method updates every matching block.
     * If the passed vector type does not match the key's backing dimension (for example, a
     * Vector3f/Vector4f for a vec2 key, or a Vector2f for a vec4 key), the value is silently
     * ignored for that block and nothing is written.
     * @param name - The name of the vector property.
     * @param value - The vector value to set.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (conditions) {
     *       // Set Vector3f to (1.0, 0, 0)
     *       const asset = this.visualEffectComponent.asset;
     *       const value = new APJS.Vector3f(1.0, 0, 0);
     *       const current = asset.getVector('Vector3f_0_0');
     *       if (asset.hasVectorKey('Vector3f_0_0') && current && !current.equals(value)) {
     *         asset.setVector('Vector3f_0_0', value);
     *       }
     *     }
     *   }
     * }
     */
    setVector(name: string, value: Vector2f | Vector3f | Vector4f): void;
    /**
     * @description Checks if the VFX profile has a color key.
     *
     * Color keys are stored in the same vec4-backed `exposeProperties.vec4map` as
     * Vector4 keys, so a color key is essentially an exposed vec4 property authored
     * as a color in the VFX graph. Matching is exact and case-sensitive; if multiple
     * context blocks expose the same name, returns `true` if any block contains it.
     * Because color keys share the namespace with `Vector4f` keys, the same name will
     * also be reported by {@link VisualEffectAsset.hasVectorKey}; pick the lookup that
     * matches the value type you want to read with {@link VisualEffectAsset.getColor}
     * or {@link VisualEffectAsset.getVector}.
     *
     * To discover available color key names, inspect the VFX graph's exposed color
     * properties in the editor, or iterate {@link VisualEffectAsset.contextBlocks}
     * at runtime.
     * @param name - The color key to check.
     * @returns `true` if any context block exposes a vec4-backed color property under this name.
     */
    hasColorKey(name: string): boolean;
    /**
     * @description Gets a named color value from VFX Profile.
     * Color keys are exposed color properties stored in the profile's vec4-backed property map and must match exactly.
     * @param name - The name of the color property.
     * @returns The value of the color property, or `null` when no matching exposed color key exists or no vec4 value is currently available.
     */
    getColor(name: string): Color | null;
    /**
     * @description Sets a named color value to VFX Profile.
     * Color keys are exposed color properties stored in the profile's vec4-backed property map and must match exactly.
     * If multiple context blocks expose the same key, this method updates every matching block.
     * @param name - The name of the color property.
     * @param value - The color value to set.
     * @example
     * export class NewScriptComponent extends APJS.BasicScriptComponent {
     *   ......
     *   onUpdate(deltaTime: number) {
     *     if (conditions) {
     *       // Set Color to red
     *       const asset = this.visualEffectComponent.asset;
     *       const red = new APJS.Color(1.0, 0, 0, 1.0);
     *       const current = asset.getColor('Color_0_0');
     *       if (asset.hasColorKey('Color_0_0') && current && !current.equals(red)) {
     *         asset.setColor('Color_0_0', red);
     *       }
     *     }
     *   }
     * }
     */
    setColor(name: string, value: Color): void;
  }
  /**
   * @class VolumeDetector
   * @description Detects the overall volume level of the audio source in real time.
   *
   * Returns a value from 0 (complete silence) to 1 (loudest sound in the audio stream).
   * Useful for driving animations or transformations that respond to audio loudness.
   * For human voice detected from microphone input, practical reference points are:
   * `0.05` for soft, `0.10` for medium, `0.15` for loud, and `0.20` for very loud audio.
   * Build it through {@link VolumeDetectorBuilder}. Until the detector is enabled and the extractor
   * has produced at least one frame result, {@link getResult} returns `-1`.
   *
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Volume);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     this.detector = builder.build();
   * }
   * onUpdate(dt: number) {
   *     if (this.detector) {
   *         const result = this.detector.getResult();
   *         console.log(result);
   *     }
   * }
   */
  class VolumeDetector extends BaseAudioDetector {
    protected constructor();
    /**
     * @description Gets the current volume detection result.
     * Returns `-1` when the detector is disabled, when no frame result is available yet, or when
     * the current frame result has no values.
     * For human voice detected from microphone input, practical loudness reference values are:
     * soft `0.05`, medium `0.10`, loud `0.15`, and very loud `0.20`.
     * @returns A normalized volume value in the range [0, 1], or -1 when no result is available.
     */
    getResult(): number;
  }
  /**
   * @class VolumeDetectorBuilder
   * @description A builder for volume detector to set the source of the detector and build the detector.
   * Stores the source configuration provided by {@link setDetectorSource} and creates a new
   * {@link VolumeDetector} when {@link build} is called.
   * @example
   * onInit() {
   *     const builder = APJS.AudioDetectionModule.getOrCreateAudioDetectionBuilder(APJS.AudioDetectionType.Volume);
   *     builder.setDetectorSource(APJS.AudioSourceType.Microphone, null);
   *     const detector = builder.build();
   * }
   */
  class VolumeDetectorBuilder extends AudioDetectorBuilder<VolumeDetector> {
    protected constructor();
    /**
     * @description Set the source of the detector.
     * @param type - The type of audio source. Default is None. When the type is ExternalFile, the audioComponent must be provided.
     * APJS only stores these parameters in the builder at this step; the actual detector is not
     * created until {@link build} is called.
     * @param audioComponent - The audio component which plays the external audio file.
     * @example
     * audioDetectorBuilder
     *     .setDetectorSource(APJS.AudioSourceType.ExternalFile, audioComponent)
     *     .build();
     * @returns Builder instance for chaining.
     */
    setDetectorSource(type: AudioSourceType, audioComponent: IAudioComponent | null): this;
    /**
     * @description Build the volume detector. Note that the detector should be built in onInit, otherwise it will return null.
     * @returns Detector instance of the volume detector.
     */
    build(): VolumeDetector | null;
  }
  /**
   * @description Texture coordinate wrapping mode.
   * @enum
   */
  enum WrapMode {
    /** Tiles the texture, creating a repeating pattern. */
    Repeat,
    /** Clamps the texture to the last pixel at the edge. */
    Clamp,
    /** Tiles the texture, creating a repeating pattern by mirroring it at every integer boundary. */
    Mirror
  }
  interface UserGlobalType {
      [key: string]: any;
  }
  /**
   * Global
   * <br/>Global is a global object that can be used to store global variables.
   * <br/>You can use Global to store global variables that are used in multiple scripts.
   */
  const Global: UserGlobalType;
}
