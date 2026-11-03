declare namespace APJS {
  class SocialFeatures {
  }
  
  /**
   * 业务门面只暴露两个能力：
   * - sendRequest: 通过 Game2D.onEvent 桥接统一收发
   * - saveMessageForPublish: 走 publish 写回
   */
  class SocialService {
    constructor(scene: IRequestScene);
  }
  
  class POI {
  }
  
  class Checkin {
  }
  
  class PersonalInfo {
  }
  
  class FriendAvatars {
  }
  
  class AIConversation {
  }
  
  class ImageCaption {
  }
  
  /**
   * @namespace SpeechText
   * @description Reports text processed by online speech abilities to the host.
   */
  namespace SpeechText {
    /**
     * @description Reports recognized or synthesized text to the host.
     * @param scene An APJS Scene, or a scene container whose sys.engineScene is an APJS Scene.
     * @param text The recognized or synthesized text.
     * @returns Whether the message was sent.
     */
    function report(scene: unknown, text: string): boolean;
  }
  
  /**
   * @namespace SpeechRecognition
   * @description Speech recognition entry. Call during onInit.
   */
  namespace SpeechRecognition {
    function getOrCreateBuilder(): SpeechRecognizerBuilder;
  }
  
  /**
   * @enum SpeechRecognitionEventType
   * @description Speech recognition event type.
   */
  enum SpeechRecognitionEventType {
    RecognizedSuccess,
    RecognizedFailed,
  }
  
  /**
   * @class SpeechRecognizer
   * @description Speech recognizer.
   * @example
   * OnInit() {
   *     const builder = SpeechRecognition.getOrCreateBuilder();
   *     builder.setDetectorSource(AudioSourceType.Microphone, null);
   *     this.recognizer = builder.build() as SpeechRecognizer;
   *     if (this.recognizer) {
   *         this.recognizer.eventEmitter.on(SpeechRecognitionEventType.RecognizedSuccess, (event) => {
   *             const words = event.args[0];
   *             console.log('Recognized:', words);
   *         });
   *         this.recognizer.start();
   *     }
   * }
   */
  class SpeechRecognizer implements IAudioDetector {
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
     * @description Start speech recognition.
     */
    start(): void;
  
    /**
     * @description Stop speech recognition.
     */
    stop(): void;
  }
  
  /**
   * @class SpeechRecognizerBuilder
   * @description Speech recognizer builder.
   */
  class SpeechRecognizerBuilder extends AudioDetectorBuilder<SpeechRecognizer> {
    protected constructor();
  
    /**
     * @description Build the SpeechRecognizer during OnInit, otherwise it will return null.
     */
    build(): SpeechRecognizer | null;
  }
  
  /**
   * @enum TextToSpeechEventType
   * @description Text to speech lifecycle event type.
   */
  enum TextToSpeechEventType {
    SynthesisSucceeded,
    PlaybackStarted,
    PlaybackEnded,
  }
  
  /**
   * @enum VoiceType
   * @description Voice type for TTS.
   */
  enum VoiceType {
    Rapper,
    WarmheartedBrother,
    RefreshingMaleAdult,
    RoaringBrother,
    ArtisticMale,
    ConcubineHua,
    ArtisticFemale,
    MonkeyBrotherRap,
    LazyLittleSheep,
    NaYing,
    YangMi,
    NasalVoice,
    MonkeyBrother,
    Child,
    FreshFemaleVoice,
    ShyMonkeyBrother,
    SisterSpring,
    Emperor,
    HongKongDramaFemale,
    BearTwo,
  }
  
  /**
   * @class TextToSpeechSynthesizer
   * @description Text to speech synthesizer.
   * @example
   * OnInit() {
   *     const builder = TextToSpeech.createBuilder();
   *     this.synthesizer = builder.build() as TextToSpeechSynthesizer;
   *     if (this.synthesizer) {
   *         this.synthesizer.synthesize('Hello world', VoiceType.FreshFemaleVoice, () => {
   *             console.log('Synthesize Success');
   *             this.synthesizer.play();
   *         }, (errorMsg) => {
   *             console.log('Synthesize Failed:', errorMsg);
   *         });
   *     }
   * }
   */
  class TextToSpeechSynthesizer implements IAudioDetector {
    protected constructor();
  
    enabled: boolean;
  
    /**
     * @description The event emitter for synthesis and playback lifecycle events.
     */
    get eventEmitter(): IEventEmitter;
  
    /**
     * @description The speech speed (0.5-2.0).
     */
    get speed(): number;
  
    set speed(value: number);
  
    /**
     * @description The volume of the synthesizer (0-100).
     */
    get volume(): number;
  
    set volume(value: number);
  
    /**
     * @description Pause playing current audio.
     */
    pause(): void;
  
    /**
     * @description Play the synthesized audio.
     */
    play(): void;
  
    /**
     * @description Resume playing current audio.
     */
    resume(): void;
  
    /**
     * @description Stop playing current audio.
     */
    stop(): void;
  
    /**
     * @description Start text to speech synthesis. Call play after synthesis succeeds.
     * @param text The text to synthesize.
     * @param voice The voice type.
     * @param onSuccess Callback when synthesis succeeds.
     * @param onFail Callback when synthesis fails.
     * @returns Whether the task was started successfully.
     */
    synthesize(text: string, voice: VoiceType, onSuccess: () => void, onFail: (errorMessage: string) => void): boolean;
  }
  
  /**
   * @class TextToSpeechSynthesizerBuilder
   * @description Text to speech synthesizer builder.
   */
  class TextToSpeechSynthesizerBuilder extends AudioDetectorBuilder<TextToSpeechSynthesizer> {
    protected constructor();
  
    /**
     * @description Build the TextToSpeechSynthesizer during OnInit, otherwise it will return null.
     */
    build(): TextToSpeechSynthesizer | null;
  }
  
  /**
   * @namespace TextToSpeech
   * @description Text-to-speech entry. Call during onInit.
   */
  namespace TextToSpeech {
    function createBuilder(): TextToSpeechSynthesizerBuilder;
  }
}