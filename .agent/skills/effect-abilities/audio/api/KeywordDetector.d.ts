/**
 * KeywordDetector.d.ts - Keyword Detection API Surface for Generated Gameplay
 *
 * Recommended usage:
 * 1) call `registerKeywordDetectorInit(...)` before `Game2D.onInit` if non-default
 *    mode is needed.
 * 2) call `createKeywordDetector(...)` in scene setup.
 * 3) bind `onKeywordHit(...)` and set target keywords.
 *
 * IMPORTANT RULES:
 * - Default: Microphone + Chinese word mode.
 * - Flow: Keywords must be registered/set before starting.
 * - Source: Default is microphone.
 * - Lifecycle: Initialized during `Game2D.onInit`.
 */

export type AudioSourceType = number;
export type KeywordType = 'chineseWord' | 'chinesePinyin' | 'englishWord';

type AudioSourceNodeLike = {
  getSourceNode?: () => unknown;
};

export interface AudioComponentLike {
  getAudioClipPlayer?: () => AudioSourceNodeLike | null;
}

export interface AudioSourceOptions {
  sourceType?: AudioSourceType;
  audioComponent?: AudioComponentLike | null;
}

export interface KeywordDetectionOptions extends AudioSourceOptions {
  keywordType?: KeywordType;
}

export interface KeywordDetector {
  enabled: boolean;
  keywordType: KeywordType;
  start(): void;
  stop(): void;
  isStarted(): boolean;
  setTargetKeywords(keywords: string[]): void;
  getTargetKeywords(): string[];
  onKeywordHit(callback: (keywords: string[]) => void, context?: object): void;
  offKeywordHit(callback: (keywords: string[]) => void, context?: object): void;
  onKeywordMiss(callback: () => void, context?: object): void;
  offKeywordMiss(callback: () => void, context?: object): void;
  destroy(): void;
}

export declare const KeywordDetector: {
  registerKeywordDetectorInit(options?: KeywordDetectionOptions): void;
  createKeywordDetector(options?: KeywordDetectionOptions): KeywordDetector | null;
};

export declare function registerKeywordDetectorInit(
  options?: KeywordDetectionOptions
): void;

export declare function createKeywordDetector(
  options?: KeywordDetectionOptions
): KeywordDetector | null;

export declare function destroyKeywordDetectorHandle(
  handle: KeywordDetector | null | undefined
): void;
