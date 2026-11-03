declare namespace APJS {
  /**
   * @class AudioComponent
   * @extends DynamicComponent
   * @description Audio component. Component that plays back audio.
   */
  class AudioComponent extends DynamicComponent implements IAudioComponent {
    protected constructor();
  
    /**
     * @readonly
     * @description Gets the duration of the audio in seconds.
     */
    get duration(): number;
  
    /**
     * @readonly
     * @description Whether the audio has finished playing.
     */
    get isFinished(): boolean;
  
    /**
     * @description The number of times the audio should loop.
     */
    get loopCount(): number;
  
    set loopCount(value: number);
  
    /**
     * @description The volume level (0-100) of the audio.
     */
    get volume(): number;
  
    set volume(value: number);
  
    /**
     * @description Pause audio playback.
     */
    pause(): void;
  
    /**
     * @description Start audio playback.
     */
    play(): void;
  
    /**
     * @description Resume audio playback.
     */
    resume(): void;
  
    /**
     * @description Stop audio playback.
     */
    stop(): void;
  }
  
  /**
   * @enum AudioDetectionType
   * @property Pitch Detect the pitch of the audio source in real time.
   * @property Beat Detect the rhythm pattern of a piece of music and output the beat in real time. All types of rhythm pattern will be quantified to 3/4 time or 4/4 time. The output value 1 represents the onset beat, which is usually the first beat of each measure. For example, music in 4/4 time will return 1, 2, 3, 4 in sequence, and music in 3/4 time will return 1, 2, 3 in sequence. Beats Detection is in the Audio category.
   * @property Onset Detect the onsets of notes in the musical audio in realtime based on a certain threshold.
   * @property Spectrum Divide the audio spectrum range (0 Hz to 22050 Hz) into 8 output bands, and detect the magnitude of each band in a range between 0 and 255.
   * @property Volume Detect the volume of the audio source in realtime.
   * @property SoundEvent Detect the sound events in the audio source in realtime.
   * @property Keyword Monitor an audio stream in real time and identify whether one or more specified keywords are present.
   */
  enum AudioDetectionType {
    Pitch,
    Beat,
    Onset,
    Spectrum,
    Volume,
    SoundEvent,
    Keyword,
  }
  
  /**
   * @namespace AudioDetectionModule
   * @description The module for audio detection to get the builder for the specified audio detection type.
   */
  namespace AudioDetectionModule {
    /**
     * @description Get the builder for the specified audio detection type. Should be called in the onInit method.
     * @param type The audio detection type.
     * @returns The builder for the specified audio detection type.
     * @example
     * onInit(): void {
     *    const audioDetectionBuilder = AudioDetectionModule.getOrCreateAudioDetectionBuilder(AudioDetectionType.SoundEvent);
     *    audioDetectionBuilder.setDetectorSource(AudioSourceType.Microphone, null);
     *    audioEventDetector = audioDetectionBuilder.build();
     * }
     */
    function getOrCreateAudioDetectionBuilder(type: AudioDetectionType): AudioDetectorBuilder<any> | null;
  }
  
  /**
   * @enum KeywordType
   * @description Keyword type.
   * @property ChineseWord: Chinese word.
   * @property ChinesePinyin: Chinese Pinyin like "ni3-hao3".
   * @property EnglishWord: English word.
   */
  enum KeywordType {
    ChineseWord,
    ChinesePinyin,
    EnglishWord,
  }
  
  /**
   * @enum KeywordEventType
   * @description Keyword event type.
   * @property KeywordHit: Keyword hit.
   * @property KeywordMiss: Keyword miss.
   */
  enum KeywordEventType {
    KeywordHit,
    KeywordMiss,
  }
  
  /**
   * @class KeywordDetector
   * @description Keyword detector.
   * @example
   * OnInit() {
   *     const builder = AudioDetectionModule.getAudioDetectionBuilder(AudioDetectionType.Keyword);
   *     builder.setDetectorSource(AudioSourceType.Microphone, null);
   *     builder.setKeywordType(KeywordType.EnglishWord);
   *     const detector = builder.build() as KeywordDetector;
   *     detector.targetKeywords = ['hello', 'world'];
   *     detector.on(KeywordEventType.KeywordHit, (event: IEvent) => {
   *         console.log('Keyword hit:', event.args[0]);
   *     });
   *     detector.on(KeywordEventType.KeywordMiss, (event: IEvent) => {
   *         console.log('Keyword miss!');
   *     });
   * }
   */
  class KeywordDetector implements IAudioDetector {
    protected constructor();
  
    /**
     * @description Whether the detector is enabled.
     */
    enabled: boolean;
  
    /**
     * @description The event emitter.
     */
    get eventEmitter(): IEventEmitter;
  
    /**
     * @description The keyword type. Readonly. Should be set in builder.
     */
    get keywordType(): KeywordType;
  
    /**
     * @description The target keywords.
     */
    get targetKeywords(): string[];
  
    set targetKeywords(value: string[]);
  }
  
  /**
   * @class KeywordDetectorBuilder
   * @description Keyword detector builder.
   */
  class KeywordDetectorBuilder extends AudioDetectorBuilder<KeywordDetector> {
    protected constructor();
  
    /**
     * @description Build the KeywordDetector. Note that the detector should be built in OnInit, otherwise it will return null.
     */
    build(): KeywordDetector | null;
  
    /**
     * @description Set the keyword type. Default is ChineseWord.
     * @param type The keyword type.
     */
    setKeywordType(type: KeywordType): this;
  }
}