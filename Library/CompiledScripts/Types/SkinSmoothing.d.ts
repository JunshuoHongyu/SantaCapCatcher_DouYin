declare namespace APJS {
  /**
   * @class FaceRetouch
   * @extends DynamicComponent
   * @description Face retouch component for skin smoothing and related facial enhancement effects.
   * The exposed intensity properties are independent authoring controls in the `[0, 1]` range; the
   * component applies them to whichever faces are selected by {@link faceIDs}.
   */
  class FaceRetouch extends DynamicComponent {
    protected constructor();
  
    /**
  	     * @description dark circles reduction intensity, range [0, 1], default is 0.5.
  	     * Higher values produce a stronger dark circle reduction effect. Set to 1 for maximum reduction.
  	     * @type {number}
  	     */
    darkCirclesIntensity: number;
  
    /**
       * @description Eye brilliance intensity, range [0, 1], default is 0.5.
       * Controls how much the eyes are brightened and made to appear clearer/more sparkling;
       * higher values produce a stronger effect, while `0` disables it.
       * @type {number}
       */
    eyeBrillianceIntensity: number;
  
    /**
       * @description Skin texture intensity, range [0, 1], default is 0.5.
       * Controls how much the skin is smoothed: higher values reduce visible skin texture and
       * blemishes for a smoother look, while `0` leaves the skin texture unchanged.
       * @type {number}
       */
    skinTextureIntensity: number;
  
    /**
       * @description Smile lines intensity, range [0, 1], default is 0.5.
       * Controls how much the smile lines (nasolabial folds around the mouth) are softened;
       * higher values reduce their appearance more strongly, while `0` leaves them unchanged.
       * @type {number}
       */
    smileLinesIntensity: number;
  }
}