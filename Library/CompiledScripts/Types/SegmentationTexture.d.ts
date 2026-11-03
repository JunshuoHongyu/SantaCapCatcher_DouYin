declare namespace APJS {
  /**
   * @description Enum Segmentation type.
   * @enum {number}
   * @property Portrairt - Portrairt segmentation (Historical misspelling).
   * @property Hair - Hair segmentation.
   * @property Head - Head segmentation.
   * @property Hand - Hand segmentation.
   * @property Cloth - Cloth segmentation.
   * @property Sky - Sky segmentation.
   * @property Ground - Ground segmentation.
   * @property Building - Building segmentation.
   * @property Skin - Skin segmentation.
   * @property Pet - Pet segmentation.
   * @property Ear - Ear segmentation.
   * @property Lip - Lip segmentation.
   * @property Teeth - Teeth segmentation.
   * @property Eye - Eye segmentation.
   * @property Saliency - Saliency segmentation.
   * @property Face - Face segmentation.
   */
  enum SegmentationType {
    Portrairt,
    Hair,
    Head,
    Hand,
    Cloth,
    Sky,
    Ground,
    Building,
    Skin,
    Pet,
    Ear,
    Lip,
    Teeth,
    Eye,
    Saliency,
    Face,
  }
  
  /**
   * @description Enum Pet type.
   * @enum {number}
   * @property Cat - detect cat.
   * @property Dog - detect dog.
   */
  enum PetType {
    Cat,
    Dog,
  }
  
  /**
   * @class SegmentationTexture
   * @description Screen-texture provider that renders a segmentation mask.
   * The active mask algorithm is selected by {@link segmentationType}; related secondary settings
   * such as {@link trackIndex} and {@link petType} only have effect for compatible segmentation
   * types. The default internal type is `-1`, which means no active segmentation mode.
   */
  class SegmentationTextureProvider extends ScreenTextureProvider implements IDynamicAsset {
    protected constructor();
  
    /**
     * @description Whether the generated mask output is inverted.
     * `true` swaps foreground and background in the mask; `false` keeps the original output.
     */
    get invertMask(): boolean;
  
    set invertMask(value: boolean);
  
    /**
     * @description Selected pet categories used when `segmentationType` is `SegmentationType.Pet`.
     * Values must come from the {@link PetType} enum.
     * Reading or writing this property when `segmentationType` is not `Pet` will take effect
     * when `segmentationType` is set to `Pet`.
     * `null`, `undefined`, or an empty array on set are silently ignored.
     */
    get petType(): PetType[];
  
    set petType(value: PetType[]);
  
    /**
     * @description The segmentation type used by this provider.
     * Determines which segmentation algorithm is active and which secondary properties (`trackIndex`, `petType`) apply.
     * Default is `-1` (not a valid {@link SegmentationType} value), meaning no segmentation is active.
     * Setting a value outside the enum leaves the provider inactive.
     */
    get segmentationType(): SegmentationType;
  
    set segmentationType(value: SegmentationType);
  
    /**
     * @description Smoothness factor applied to the segmentation mask edge. Valid range: `[0, 1]`.
     * A value of `0` produces the sharpest edge, while `1` (default) produces the softest edge.
     */
    get smoothness(): number;
  
    set smoothness(value: number);
  
    /**
     * @description Tracked face/body indices for the current segmentation type.
     * Supported types: `Head`, `Hand`, `Pet`, `Ear`, `Lip`, `Teeth`, `Face`, `Eye`.
     * Getter returns the array for the active type, or `[]` for types that do not use tracked indices
     * (e.g. `Portrairt`, `Hair`, `Cloth`, `Sky`).
     * `null`, `undefined`, or an empty array are silently ignored.
     * Setting when `segmentationType` is not one of the 8 supported types is also a no-op.
     */
    get trackIndex(): number[];
  
    set trackIndex(value: number[]);
  }
}