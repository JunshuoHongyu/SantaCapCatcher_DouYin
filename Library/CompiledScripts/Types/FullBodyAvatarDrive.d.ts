declare namespace APJS {
  /**
   * @description Enum representing the names of bones in a full-body avatar skeletal structure.
   * @enum {string}
   * @property Pelvis - The pelvis bone.
   * @property Spine1 - The first spine bone.
   * @property Spine2 - The second spine bone.
   * @property Spine3 - The third spine bone.
   * @property Neck - The neck bone.
   * @property Head - The head bone.
   * @property LeftShoulder - The left shoulder bone.
   * @property LeftUpperArm - The left upper arm bone.
   * @property LeftForeArm - The left forearm bone.
   * @property LeftHand - The left hand bone.
   * @property RightShoulder - The right shoulder bone.
   * @property RightUpperArm - The right upper arm bone.
   * @property RightForeArm - The right forearm bone.
   * @property RightHand - The right hand bone.
   * @property LeftThigh - The left thigh bone.
   * @property LeftShin - The left shin bone.
   * @property LeftFoot - The left foot bone.
   * @property RightThigh - The right thigh bone.
   * @property RightShin - The right shin bone.
   * @property RightFoot - The right foot bone.
   */
  enum FullBodyBoneName {
    Pelvis,
    Spine1,
    Spine2,
    Spine3,
    Neck,
    Head,
    LeftShoulder,
    LeftUpperArm,
    LeftForeArm,
    LeftHand,
    RightShoulder,
    RightUpperArm,
    RightForeArm,
    RightHand,
    LeftThigh,
    LeftShin,
    LeftFoot,
    RightThigh,
    RightShin,
    RightFoot,
  }
  
  /**
   * @class FullBodyAvatarDrive
   * @description Runtime component that drives a humanoid avatar skeleton from the body-tracking
   * result in the current effect.
   * Use {@link followBody} to choose whether the avatar root follows tracked body motion or only
   * receives bone rotations. Use {@link getBone} to access configured bone scene objects.
   */
  class FullBodyAvatarDrive extends DynamicComponent {
    protected constructor();
  
    /**
     * @description Whether the avatar follows tracked body motion. Default: `true`.
     * When `true`, the pelvis moves to the tracked position and losing tracking hides
     * the renderers. When `false`, the avatar stays in place; tracked rotations are
     * applied relative to the avatar root's orientation, and losing tracking keeps renderers
     * visible.
     */
    followBody: boolean;
  
    /**
     * @description Retrieves the scene object associated with a specified bone name.
     * @param boneName - The name of the bone to retrieve the scene object for.
     * @returns The configured scene object for that bone, or `null` if the bone is not bound in this component.
     */
    getBone(boneName: FullBodyBoneName): SceneObject | null;
  }
}