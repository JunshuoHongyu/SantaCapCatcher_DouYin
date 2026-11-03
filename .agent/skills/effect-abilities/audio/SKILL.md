---
name: audio
abilities:
 - 音量检测
 - 音高检测
 - 关键词检测
 - 语音转文字
 - 文本转语音
description: 检测音量、音高和关键词，将用户语音转为文字，或将动态文本合成为语音播放，适合声控互动、语音问答和角色语音回复等玩法。固定台词优先使用预制音频。 玩法输入路由、适用场景、内容覆盖范围及案例统一按 `.agent/skills/game2d-planner/references/audio-challenge.md` 规划；本 Skill 负责所选音频能力的 API、依赖和生命周期。
api:
  api/AudioDetector.d.ts: [音量检测, 音高检测]
  api/KeywordDetector.d.ts: [关键词检测]
  api/SpeechRecognizer.d.ts: [语音转文字]
  api/TextToSpeech.d.ts: [文本转语音]
---
