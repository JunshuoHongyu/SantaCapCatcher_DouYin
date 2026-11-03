---
name: generative-ai
abilities:
 - AI对话
 - AI文本生成
description: 当玩法需要实时生成角色回复、点评、剧情、结果文案或图片配文时使用。持续 AI 对话是脚本驱动的轮次互动，应路由到 game2d-planner；玩家通过麦克风说话并由语音转文字提供 AI 输入，不提供键盘自由文字输入。多轮交互必须阅读 [AI对话](./AI对话.md)；生成单次文本（可仅使用文字，或参考图片、当前画面）必须阅读 [AI文本生成](./AI文本生成.md)；需要生成角色名称、人设、开场白或音色时，还必须读取 [角色设定生成](./角色设定生成.md)。
api:
  api/AIConversation.d.ts: [AI对话]
  api/ImageCaption.d.ts: [AI文本生成]
---
