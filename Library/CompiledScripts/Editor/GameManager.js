const APJS = globalThis.orion['@orion/orion-sdk/EditorFramework'].APJS;

const {BasicScriptNode} = require('./BasicScriptNode');
const {
  customNode,
  component,
  input,
  output,
  serializeSceneObjectFlag,
  serializeProperty,
  label, readOnly, slider, spinBox, dropDown,
  textArea, header, showIf, tooltip, separator,
  space, groupBegin, groupEnd, disablePin,
} = require('./OrionDecorators');

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
// 圣诞帽大作战 — Santa Cap Catcher（抖音「像塑」版）
// 由 Effect House（TikTok）工程迁移：场景沿用主场景，脚本按像塑 Game2D + Vision API 重写。
// 玩法：头部（额头）对准金圈，接住从天上掉落的圣诞帽；漏接或接到炸弹会扣分/扣命。
// 状态机：CALIBRATION -> COUNTDOWN -> PLAYING -> RESULT
const Game2D_1 = require("./UserScriptRuntime/Game2D");
const Vision_1 = require("./Vision");
const STATE_CALIB = 0;
const STATE_COUNT = 1;
const STATE_PLAY = 2;
const STATE_RESULT = 3;
const SCR_W = 720;
const SCR_H = 1280;
const ITEM_COUNT = 6; // Item0..Item5，固定池
const COUNT_STEP = 0.72; // 倒计时每步时长（秒）
// 动态 UI 文案（所有静态/动态文案统一在此维护，进入对应状态时由脚本覆盖场景文字）
const UI = {
    calibTitle: '圣诞帽大作战',
    calibSub: '头在圈内 · 帽子会从天上掉下来',
    calibBtn: '开始挑战',
    hudScore: (s) => '得分 ' + Math.max(0, s),
    hudLife: (m, t) => '未接 ' + m + '/' + t,
    resTitle: '时间到！',
    resScore: (s) => '本局得分 ' + Math.max(0, s),
    rankLow: '圣诞临时工',
    rankMid: '灵活的圣诞小精灵',
    rankHigh: '圣诞王牌',
    resShare1: '@你的好朋友来挑战！',
    resShare2: '点击下方按钮，使用同款特效合拍！',
    resBtn: '再玩一次',
};
class MainScene extends Game2D_1.Scene {
    constructor() {
        super(...arguments);
        // ---------- 对象引用（场景对象名，见 main.scene） ----------
        this.snow = [];
        this.items = [];
        this.ring = null;
        this.burst = null;
        this.flash = null;
        this.barFill = null;
        this.calibBtn = null;
        this.resBtn = null;
        this.scoreTxt = null;
        this.lifeTxt = null;
        this.countTxt = null;
        this.resScoreTxt = null;
        this.resRankTxt = null;
        this.calibTitleTxt = null;
        this.calibSubTxt = null;
        this.calibBtnTxt = null;
        this.resTitleTxt = null;
        this.resShare1Txt = null;
        this.resShare2Txt = null;
        this.resBtnTxt = null;
        this.calibGroup = [];
        this.playGroup = [];
        this.resGroup = [];
        // ---------- 运行时状态 ----------
        this.state = STATE_CALIB;
        this.score = 0;
        this.miss = 0;
        this.consec = 0;
        this.correct = 0;
        this.timeLeft = 30;
        this.spawnTimer = 0;
        this.countTimer = 0;
        this.countStep = 0;
        this.faceHold = 0;
        this.flashT = 0;
        this.burstT = 0;
        this.popupT = 0;
        this.ready = false;
        // 额头点（屏幕像素，左上原点），初始屏幕中部
        this.fx = SCR_W / 2;
        this.fy = SCR_H / 2;
        // Burst 基准尺寸（场景 StarBurst 初始显示尺寸）
        this.burstBase = 340;
        this.onPointerDown = (pointer) => {
            if (!pointer)
                return;
            const px = pointer.x;
            const py = pointer.y;
            if (this.state === STATE_CALIB && this.hitButton(this.calibBtn, px, py)) {
                this.playSfx('SfxClick');
                this.startCountdown();
            }
            else if (this.state === STATE_RESULT && this.hitButton(this.resBtn, px, py)) {
                this.playSfx('SfxClick');
                this.enterCalibration();
            }
        };
        this.onRecordStart = () => {
            this.enterCalibration();
        };
        this.onRecordEnd = () => {
            if (this.state === STATE_PLAY) {
                this.endRound();
            }
            else {
                this.enterCalibration();
            }
        };
    }
    // ---------------------------------------------------------------- 初始化
    create() {
        this.vision = (0, Vision_1.install)(this);
        // 背景雪花（初始随机撒布，不依赖场景初始坐标）
        const snowNames = ['Snow0', 'Snow1', 'Snow2', 'Snow3'];
        for (let i = 0; i < snowNames.length; i++) {
            const s = this.add.existing(snowNames[i]);
            if (s) {
                s.setPosition(this.rnd(0, SCR_W), this.rnd(-200, SCR_H));
                this.snow.push(s);
            }
        }
        // 道具池：0-3 普通帽，4 金帽，5 炸弹
        const itemNames = ['Item0', 'Item1', 'Item2', 'Item3', 'Item4', 'Item5'];
        const types = [0, 0, 0, 0, 1, 2];
        for (let i = 0; i < ITEM_COUNT; i++) {
            const slot = {
                obj: this.add.existing(itemNames[i]),
                active: false,
                type: types[i],
                x: 0,
                y: 0,
                speed: 0,
            };
            this.items.push(slot);
        }
        // 玩法 / 校准 / 结算 对象组
        this.ring = this.add.existing('PlayRing');
        this.burst = this.add.existing('Burst');
        this.flash = this.add.existing('Flash');
        this.barFill = this.add.existing('BarFill');
        this.calibBtn = this.add.existing('CalibBtn');
        this.resBtn = this.add.existing('ResBtn');
        this.scoreTxt = this.add.existing('HudScore');
        this.lifeTxt = this.add.existing('HudLife');
        this.countTxt = this.add.existing('CountText');
        this.resScoreTxt = this.add.existing('ResScore');
        this.resRankTxt = this.add.existing('ResRank');
        this.calibTitleTxt = this.add.existing('CalibTitle');
        this.calibSubTxt = this.add.existing('CalibSub');
        this.calibBtnTxt = this.add.existing('CalibBtnText');
        this.resTitleTxt = this.add.existing('ResTitle');
        this.resShare1Txt = this.add.existing('ResShare1');
        this.resShare2Txt = this.add.existing('ResShare2');
        this.resBtnTxt = this.add.existing('ResBtnText');
        this.calibGroup = this.collect(this.add.existing('CalibDim'), this.add.existing('CalibRing'), this.add.existing('CalibTitle'), this.add.existing('CalibSub'), this.add.existing('CalibBtn'), this.add.existing('CalibBtnText'));
        this.playGroup = this.collect(this.ring, this.items[0].obj, this.items[1].obj, this.items[2].obj, this.items[3].obj, this.items[4].obj, this.items[5].obj, this.add.existing('HudPlate'), this.scoreTxt, this.lifeTxt, this.add.existing('BarBg'), this.barFill, this.burst, this.countTxt, this.flash);
        this.resGroup = this.collect(this.add.existing('ResCard'), this.add.existing('ResTitle'), this.resScoreTxt, this.resRankTxt, this.add.existing('ResShare1'), this.add.existing('ResShare2'), this.resBtn, this.add.existing('ResBtnText'));
        // 输入与录制生命周期
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('RecordStart', this.onRecordStart, this);
        this.input.on('RecordEnd', this.onRecordEnd, this);
        this.enterCalibration();
        this.ready = true;
    }
    // ---------------------------------------------------------------- 工具
    rnd(a, b) {
        return a + Math.random() * (b - a);
    }
    collect(...objs) {
        const out = [];
        for (let i = 0; i < objs.length; i++) {
            if (objs[i])
                out.push(objs[i]);
        }
        return out;
    }
    showGroup(nodes, on) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i])
                nodes[i].setVisible(on).setActive(on);
        }
    }
    hitButton(btn, px, py) {
        if (!btn)
            return false;
        const hw = btn.displayWidth / 2;
        const hh = btn.displayHeight / 2;
        return Math.abs(px - btn.x) < hw && Math.abs(py - btn.y) < hh;
    }
    playSfx(name) {
        try {
            this.sound.play(name);
        }
        catch (e) {
            /* ignore */
        }
    }
    // ---------------------------------------------------------------- 流程
    enterCalibration() {
        this.state = STATE_CALIB;
        this.score = 0;
        this.miss = 0;
        this.consec = 0;
        this.correct = 0;
        this.timeLeft = this.param().roundSeconds;
        this.spawnTimer = 0;
        this.countTimer = 0;
        this.countStep = 0;
        this.faceHold = 0;
        this.flashT = 0;
        this.burstT = 0;
        this.popupT = 0;
        this.fx = SCR_W / 2;
        this.fy = SCR_H / 2;
        this.param().speedMulSet(1);
        this.resetItemVisibility();
        if (this.ring)
            this.ring.setPosition(this.fx, this.fy);
        if (this.burst)
            this.burst.setVisible(false).setActive(false);
        if (this.flash)
            this.flash.setVisible(false).setActive(false);
        if (this.countTxt) {
            this.countTxt.setText('');
            this.countTxt.setVisible(false).setActive(false);
        }
        if (this.barFill)
            this.barFill.setDisplaySize(560, 20);
        this.refreshHud();
        if (this.calibTitleTxt)
            this.calibTitleTxt.setText(UI.calibTitle);
        if (this.calibSubTxt)
            this.calibSubTxt.setText(UI.calibSub);
        if (this.calibBtnTxt)
            this.calibBtnTxt.setText(UI.calibBtn);
        this.showGroup(this.playGroup, false);
        this.showGroup(this.resGroup, false);
        this.showGroup(this.calibGroup, true);
    }
    param() {
        return this.game;
    }
    startCountdown() {
        if (this.state !== STATE_CALIB)
            return;
        this.state = STATE_COUNT;
        this.countTimer = 0;
        this.countStep = 0;
        if (this.countTxt)
            this.countTxt.setAlpha(1);
        this.showGroup(this.calibGroup, false);
        this.showGroup(this.playGroup, true);
        // playGroup 会把所有帽子点亮，未生成（active=false）的帽子会静止在默认位置
        this.resetItemVisibility();
        this.showGroup(this.resGroup, false);
        this.refreshHud();
    }
    resetItemVisibility() {
        for (let i = 0; i < this.items.length; i++) {
            const slot = this.items[i];
            slot.active = false;
            if (slot.obj)
                slot.obj.setVisible(false).setActive(false);
        }
    }
    startPlaying() {
        this.state = STATE_PLAY;
        this.timeLeft = this.param().roundSeconds;
        this.spawnTimer = 0.25;
        this.score = 0;
        this.miss = 0;
        this.consec = 0;
        this.correct = 0;
        this.param().speedMulSet(1);
        if (this.countTxt)
            this.countTxt.setText('');
        this.refreshHud();
    }
    endRound() {
        if (this.state === STATE_RESULT)
            return;
        this.state = STATE_RESULT;
        let rank = UI.rankLow;
        if (this.score > 15)
            rank = UI.rankHigh;
        else if (this.score > 5)
            rank = UI.rankMid;
        // 先覆盖文案再显示结算组，避免旧文字闪现
        if (this.resScoreTxt)
            this.resScoreTxt.setText(UI.resScore(this.score));
        if (this.resRankTxt)
            this.resRankTxt.setText(rank);
        if (this.resTitleTxt)
            this.resTitleTxt.setText(UI.resTitle);
        if (this.resShare1Txt)
            this.resShare1Txt.setText(UI.resShare1);
        if (this.resShare2Txt)
            this.resShare2Txt.setText(UI.resShare2);
        if (this.resBtnTxt)
            this.resBtnTxt.setText(UI.resBtn);
        this.showGroup(this.playGroup, false);
        this.showGroup(this.calibGroup, false);
        this.showGroup(this.resGroup, true);
        if (this.burst)
            this.burst.setVisible(false).setActive(false);
        if (this.flash)
            this.flash.setVisible(false).setActive(false);
        this.playSfx('SfxSuccess');
    }
    refreshHud() {
        if (this.scoreTxt)
            this.scoreTxt.setText(UI.hudScore(this.score));
        if (this.lifeTxt)
            this.lifeTxt.setText(UI.hudLife(this.miss, this.param().maxMiss));
    }
    addMiss(n) {
        this.miss += n;
        this.consec += n;
        this.flashT = 0.32;
        this.playSfx('SfxFail');
        this.refreshHud();
        if (this.miss >= this.param().maxMiss || this.consec >= this.param().maxConsecMiss) {
            this.endRound();
        }
    }
    // ---------------------------------------------------------------- 生成
    spawnOne() {
        const r = Math.random();
        const want = r < 0.65 ? 0 : r < 0.8 ? 1 : 2;
        let slot = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].active && this.items[i].type === want) {
                slot = i;
                break;
            }
        }
        if (slot < 0) {
            for (let i = 0; i < this.items.length; i++) {
                if (!this.items[i].active) {
                    slot = i;
                    break;
                }
            }
        }
        if (slot < 0)
            return;
        const s = this.items[slot];
        s.active = true;
        s.x = this.rnd(100, 610);
        s.y = 80;
        const boost = s.type === 1 ? 1.3 : 1;
        s.speed = this.param().baseSpeed * this.param().speedMul() * boost;
        if (s.obj) {
            s.obj.setPosition(s.x, s.y);
            s.obj.setVisible(true).setActive(true);
        }
    }
    // ---------------------------------------------------------------- 每帧更新
    update(time, delta) {
        if (!this.ready)
            return;
        const dt = Math.min(delta / 1000, 0.1);
        this.updateSnow(dt);
        this.updateFace(dt);
        this.updateEffects(dt);
        if (this.state === STATE_CALIB) {
            if (this.hasFace())
                this.faceHold += dt;
            else
                this.faceHold = 0;
            if (this.faceHold > 1.2)
                this.startCountdown();
            return;
        }
        if (this.state === STATE_COUNT) {
            this.countTimer += dt;
            const step = Math.floor(this.countTimer / COUNT_STEP);
            if (step !== this.countStep && step < 4) {
                this.countStep = step;
                this.playSfx('SfxClick');
                if (this.countTxt) {
                    this.countTxt.setColor(step < 3 ? '#FFFFFF' : '#FFD966');
                    this.countTxt.setAlpha(1);
                    this.countTxt.setPosition(SCR_W / 2, 580);
                    this.countTxt.setText(step === 0 ? '3' : step === 1 ? '2' : step === 2 ? '1' : '开始！');
                }
            }
            if (this.countTimer > COUNT_STEP * 4)
                this.startPlaying();
            return;
        }
        if (this.state === STATE_PLAY) {
            this.updatePlaying(dt);
            return;
        }
    }
    // 人脸检测：额头锚点 -> 屏幕坐标（Game2D 720x1280 左上原点）
    hasFace() {
        try {
            const faces = this.vision.getFaces();
            return faces.length > 0;
        }
        catch (e) {
            return false;
        }
    }
    updateFace(dt) {
        let has = false;
        try {
            const faces = this.vision.getFaces();
            if (faces.length > 0) {
                const face = faces[0];
                const p = face.getAnchor('forehead', 'center');
                if (p) {
                    const tx = Math.max(60, Math.min(660, p.x * SCR_W));
                    const ty = Math.max(90, Math.min(1160, p.y * SCR_H));
                    const k = Math.min(1, dt * 18);
                    this.fx += (tx - this.fx) * k;
                    this.fy += (ty - this.fy) * k;
                    has = true;
                }
            }
        }
        catch (e) {
            has = false;
        }
        if (!has) {
            const k = Math.min(1, dt * 4);
            this.fx += (SCR_W / 2 - this.fx) * k;
            this.fy += (SCR_H / 2 - this.fy) * k;
        }
        if (this.ring)
            this.ring.setPosition(this.fx, this.fy);
    }
    updateSnow(dt) {
        for (let i = 0; i < this.snow.length; i++) {
            const s = this.snow[i];
            if (!s)
                continue;
            let y = s.y + (28 + i * 11) * dt;
            let x = s.x + Math.sin(y * 0.01 + i * 40) * 6 * dt;
            if (y > SCR_H + 40) {
                y = -40;
                x = this.rnd(0, SCR_W);
            }
            s.setPosition(x, y);
        }
    }
    // ---------------------------------------------------------------- 游玩中
    updatePlaying(dt) {
        this.timeLeft -= dt;
        if (this.timeLeft <= 0) {
            this.endRound();
            return;
        }
        // 计时条
        if (this.barFill) {
            const k = Math.max(0, Math.min(1, this.timeLeft / this.param().roundSeconds));
            this.barFill.setDisplaySize(560 * k, 20);
        }
        // 生成
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = this.param().spawnInterval / Math.min(1.6, this.param().speedMul());
            this.spawnOne();
        }
        const scoreBefore = this.score;
        for (let i = 0; i < this.items.length; i++) {
            const slot = this.items[i];
            if (!slot.active || !slot.obj)
                continue;
            slot.y += slot.speed * dt;
            slot.obj.setPosition(slot.x, slot.y);
            const dx = Math.abs(slot.x - this.fx);
            const dy = Math.abs(slot.y - this.fy);
            const reach = this.param().speedMul() >= 1.4 ? 1.08 : 1;
            if (dx < this.param().catchRadiusX * reach && dy < this.param().catchRadiusY * reach) {
                // 接住
                slot.active = false;
                slot.obj.setVisible(false).setActive(false);
                if (slot.type === 2) {
                    this.score -= 2;
                    this.showPopup('-2', this.fx, this.fy - 100, true);
                    this.addMiss(1);
                    if (this.state !== STATE_PLAY)
                        return;
                }
                else {
                    const gain = slot.type === 1 ? 3 : 1;
                    this.score += gain;
                    this.correct += 1;
                    this.consec = 0;
                    this.param().speedMulSet(Math.min(1.8, 1 + 0.1 * Math.floor(this.correct / 5)));
                    this.showPopup('+' + gain, this.fx, this.fy - 100, false);
                    this.triggerBurst(this.fx, this.fy);
                    if (slot.type === 1)
                        this.playSfx('SfxSuccess');
                    else
                        this.playSfx('SfxPop');
                    this.refreshHud();
                }
                continue;
            }
            if (slot.y > 1300) {
                slot.active = false;
                slot.obj.setVisible(false).setActive(false);
                if (slot.type !== 2) {
                    this.addMiss(1);
                    if (this.state !== STATE_PLAY)
                        return;
                }
            }
        }
        if (this.state !== STATE_PLAY)
            return;
        if (this.score !== scoreBefore)
            this.refreshHud();
    }
    // ---------------------------------------------------------------- FX
    showPopup(label, x, y, isBad) {
        if (!this.countTxt)
            return;
        this.countTxt.setText(label);
        this.countTxt.setColor(isBad ? '#FF4040' : '#FFD966');
        this.countTxt.setAlpha(1);
        this.countTxt.setPosition(x, y);
        this.popupT = 0.55;
    }
    triggerBurst(x, y) {
        if (!this.burst)
            return;
        this.burst.setPosition(x, y);
        this.burstBase = this.burst.displayWidth > 0 ? this.burst.displayWidth : 340;
        this.burst.setVisible(true).setActive(true);
        this.burstT = 0.35;
    }
    updateEffects(dt) {
        if (this.flashT > 0) {
            this.flashT -= dt;
            if (this.flash) {
                this.flash.setVisible(true).setActive(true);
                this.flash.setAlpha(Math.max(0, Math.min(0.5, this.flashT * 1.6)));
            }
            if (this.flashT <= 0 && this.flash) {
                this.flash.setAlpha(0);
                this.flash.setVisible(false).setActive(false);
            }
        }
        if (this.burstT > 0) {
            this.burstT -= dt;
            if (this.burst) {
                const k = Math.max(0, this.burstT / 0.35);
                this.burst.setAlpha(k);
                if (this.burstT > 0) {
                    const s = this.burstBase + (0.35 - this.burstT) * 320;
                    this.burst.setDisplaySize(s, s);
                }
            }
            if (this.burstT <= 0 && this.burst) {
                this.burst.setAlpha(0);
                this.burst.setVisible(false).setActive(false);
            }
        }
        if (this.popupT > 0) {
            this.popupT -= dt;
            if (this.countTxt) {
                this.countTxt.setAlpha(Math.max(0, this.popupT / 0.55));
                this.countTxt.setPosition(this.countTxt.x, this.countTxt.y - 90 * dt);
                if (this.popupT <= 0 && this.state === STATE_PLAY) {
                    this.countTxt.setText('');
                }
            }
        }
    }
}
/**
 * 入口组件：暴露可调参数（Inspector 脚本参数面板）
 */
let GameManager = class GameManager extends Game2D_1.Game2D {
    constructor() {
        super(...arguments);
        this.baseSpeed = 300;
        this.spawnInterval = 0.85;
        this.catchRadiusX = 118;
        this.catchRadiusY = 112;
        this.maxMiss = 8;
        this.maxConsecMiss = 5;
        this.roundSeconds = 30;
        this._speedMul = 1;
    }
    onInit() {
        super.onInit();
        this._speedMul = 1;
    }
    onStart() {
        this.startGame(MainScene);
    }
    speedMul() {
        return this._speedMul;
    }
    speedMulSet(v) {
        this._speedMul = v;
    }
};
__decorate([
    label('下落速度（像素/秒）'),
    serializeProperty()
], GameManager.prototype, "baseSpeed", void 0);
__decorate([
    label('生成间隔（秒）'),
    serializeProperty()
], GameManager.prototype, "spawnInterval", void 0);
__decorate([
    label('接取判定宽度（半宽，像素）'),
    serializeProperty()
], GameManager.prototype, "catchRadiusX", void 0);
__decorate([
    label('接取判定高度（半高，像素）'),
    serializeProperty()
], GameManager.prototype, "catchRadiusY", void 0);
__decorate([
    label('最大漏接数'),
    serializeProperty()
], GameManager.prototype, "maxMiss", void 0);
__decorate([
    label('最大连续漏接数'),
    serializeProperty()
], GameManager.prototype, "maxConsecMiss", void 0);
__decorate([
    label('单局时长（秒）'),
    serializeProperty()
], GameManager.prototype, "roundSeconds", void 0);
GameManager = __decorate([
    component()
], GameManager);
exports.GameManager = GameManager;
