# 圣诞帽大作战（抖音「像塑」Douyin AR 版）

**头部对准金圈，接住从天上掉落的圣诞帽**；漏接或接到炸弹会扣分。难度随连续命中逐渐提升。

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

## 已知限制 / 注意事项

- 场景文件来自 Effect House 5.15.0（orionSDK 9.4.0），像塑打开时会按自身兼容层解析；若弹出升级/修复提示，直接确认即可。
- `jsScriptSystems`（AmazingProRuntime / GraphSystem 等系统脚本）为引擎运行时注入，打开保存后由像塑自动接管。
- Vision 适配器按官方规范放在 `Assets/` 下，通过 `'./Vision'` 导入；请勿修改该文件本体。
- 未迁移：原工程中的滤镜美颜资源 `Assets/oart/`（场景未引用，无需迁移）、Translations 多语言目录（中文直出）。
- 提交发布请按像塑要求填写特效名称「圣诞帽大作战」与图标（`Icon/iconInfo.json` 可继续使用，或在编辑器里重新配置）。


