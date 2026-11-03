# 圣诞帽大作战（抖音「像塑」Douyin AR 版）

由 **Effect House（TikTok 国际版）** 工程迁移而来的抖音特效工程。
玩法：**头部对准金圈，接住从天上掉落的圣诞帽**；漏接或接到炸弹会扣分。难度随连续命中逐渐提升。

## 工程结构

```
SantaCapCatcher _DouYin/
├─ effect.dyehpj                ← 工程配置（像塑/Douyin AR 格式，即打开的工程文件）
├─ Assets/
│  ├─ main.scene                 ← 场景（沿用原 Effect House 场景，静态中文文案） 
│  ├─ main.scene.extra           ← 场景编辑器元数据
│  ├─ GameManager.ts             ← 游戏脚本（Game2D + Vision API，中文）
│  ├─ GameManager.ts.extra       ← 脚本资源注册（GUID 与原工程一致，保证场景绑定有效）
│  ├─ Vision.ts / Vision.ts.extra← 人脸检测适配器（来自像塑 SDK）
│  ├─ language.json              ← 工程语言配置
│  ├─ *.png + *.png.extra        ← 贴图资源（原样迁移）
│  └─ Audio/ *.mp3 + *.extra     ← 音效资源（原样迁移）
├─ Icon/iconInfo.json            ← 图标信息
├─ SERVER_VALIDATION_PLAN.md     ← 服务端权威校验预案（接排行榜/权益前的架构蓝本）
└─ README.md                     ← 本说明
```

## 打开 / 预览

1. 启动「像塑」（Douyin AR，已安装于 `D:\Program Files (x86)\Douyin AR`）。
2. 在首页选择 **打开工程**，选择本目录下的 `effect.dyehpj`（或整个目录）。
3. 等待资源导入与脚本编译完成后，进入预览（需摄像头）。预览时：
   - 校准界面：把脸对准中间的金圈约 1 秒（或直接点「开始挑战」）即开始倒计时 3-2-1。
   - 游玩：用额头对准掉落的帽子接住它们。屏幕左上角显示得分和漏接数；漏接 8 次或连续漏接 5 次结束。
   - 结算：显示本局得分与称号，点「再玩一次」重开。
4. 手机测试：像塑连接「抖音」App 后可直接在真机预览（APP 内扫描）。

## 文案说明

**所有 UI 文案统一在 `Assets/GameManager.ts` 顶部的 `UI` 常量中维护**（与 TikTok 版架构一致），进入对应状态时由脚本 `setText` 覆盖场景文字，场景内的旧文字仅为占位：

| 位置 | 文案 | UI 常量 |
| --- | --- | --- |
| 校准标题 | 圣诞帽大作战 | `calibTitle` |
| 校准副标题 | 头在圈内 · 帽子会从天上掉下来 | `calibSub` |
| 开始按钮 | 开始挑战 | `calibBtn` |
| 得分 / 未接 | 得分 N / 未接 M/8 | `hudScore` / `hudLife`（动态） |
| 结算标题 | 时间到！ | `resTitle` |
| 本局得分 | 本局得分 N | `resScore`（动态） |
| 结算称号 | 圣诞临时工 / 灵活的圣诞小精灵 / 圣诞王牌 | `rankLow` / `rankMid` / `rankHigh` |
| 分享文案 | @你的好朋友来挑战！ / 点击下方按钮，使用同款特效合拍！ | `resShare1` / `resShare2` |
| 再玩一次 | 再玩一次 | `resBtn` |
| 倒计时 | 3 / 2 / 1 / 开始！ | 脚本内联 |

> 改任何文案只需编辑 `UI` 常量，无需动场景。

## 可从编辑器调整的参数（Inspector → 脚本参数面板）

选择场景中的 **GameManager** 对象可调整：下落速度、生成间隔、接取判定宽度/高度、最大漏接数、最大连续漏接数、单局时长。

## 与原工程（Effect House）的差异

| 项 | Effect House (TikTok) | 本工程（Douyin AR / 像塑） |
| --- | --- | --- |
| 脚本框架 | 老 APJS（BasicScriptComponent + EventManager） | 新版 Game2D（类 Phaser）+ Vision adapter |
| 人脸追踪 | AlgorithmManager.getResult() + rect | Vision.getFaces() → `getAnchor('forehead')` |
| UI 文案 | 英文（SANTA CAP CATCHER 等），启动时覆盖 | 场景直接是中文；动态文字中文 |
| 坐标 | 屏幕中心原点（anchoredPosition，+Y 向上） | 720×1280 左上原点（Game2D 设计分辨率） |
| 相机抖动 | 抖动 2D Camera Transform | 已移除（无对应 API），用红闪反馈替代 |
| 飘字字号 | 运行时改 fontSize（190→96） | 统一用场景字号（CountText），仅改内容/颜色/透明度 |

## 已知限制 / 注意事项

- 场景文件来自 Effect House 5.15.0（orionSDK 9.4.0），像塑打开时会按自身兼容层解析；若弹出升级/修复提示，直接确认即可。
- `jsScriptSystems`（AmazingProRuntime / GraphSystem 等系统脚本）为引擎运行时注入，打开保存后由像塑自动接管。
- Vision 适配器按官方规范放在 `Assets/` 下，通过 `'./Vision'` 导入；请勿修改该文件本体。
- 未迁移：原工程中的滤镜美颜资源 `Assets/oart/`（场景未引用，无需迁移）、Translations 多语言目录（中文直出）。
- 提交发布请按像塑要求填写特效名称「圣诞帽大作战」与图标（`Icon/iconInfo.json` 可继续使用，或在编辑器里重新配置）。

## 迁移记录

- 源工程：`E:\SantaCapCatcher\SantaCapCatcher`（Effect House 5.15.0）
- 目标工具：像塑 Douyin AR（安装于 `D:\Program Files (x86)\Douyin AR`），引擎版本 9.7.2
- 完成时间：2026-11-03
- 2026-11-04 审计整改：P0 分享文案中性化（@你的好朋友来挑战！）、文案源统一到 UI 常量、新增服务端校验预案文档；P1 产品形态决策 = 维持相机特效定位（不做小游戏重写）
