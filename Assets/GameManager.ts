// 圣诞帽大作战 — Santa Cap Catcher（抖音「像塑」版）
// 由 Effect House（TikTok）工程迁移：场景沿用主场景，脚本按像塑 Game2D + Vision API 重写。
// 玩法：头部（额头）对准金圈，接住从天上掉落的圣诞帽；漏接或接到炸弹会扣分/扣命。
// 状态机：CALIBRATION -> COUNTDOWN -> PLAYING -> RESULT
import {Game2D, GameObject, Scene, Sprite, Text, Pointer} from './UserScriptRuntime/Game2D';
import {install, Vision, Face, Point2D} from './Vision';

const STATE_CALIB = 0;
const STATE_COUNT = 1;
const STATE_PLAY = 2;
const STATE_RESULT = 3;

const SCR_W = 720;
const SCR_H = 1280;
const ITEM_COUNT = 6;        // Item0..Item5，固定池
const COUNT_STEP = 0.72;     // 倒计时每步时长（秒）

// 动态 UI 文案（所有静态/动态文案统一在此维护，进入对应状态时由脚本覆盖场景文字）
const UI = {
  calibTitle: '圣诞帽大作战',
  calibSub: '头在圈内 · 帽子会从天上掉下来',
  calibBtn: '开始挑战',
  hudScore: (s: number) => '得分 ' + Math.max(0, s),
  hudLife: (m: number, t: number) => '未接 ' + m + '/' + t,
  resTitle: '时间到！',
  resScore: (s: number) => '本局得分 ' + Math.max(0, s),
  rankLow: '圣诞临时工',
  rankMid: '灵活的圣诞小精灵',
  rankHigh: '圣诞王牌',
  resShare1: '@你的好朋友来挑战！',
  resShare2: '点击下方按钮，使用同款特效合拍！',
  resBtn: '再玩一次',
};

interface ItemSlot {
  obj: Sprite | null;
  active: boolean;
  type: number; // 0 普通帽 1 金帽 2 炸弹
  x: number;
  y: number;
  speed: number;
}

class MainScene extends Scene {
  public vision!: Vision;

  // ---------- 对象引用（场景对象名，见 main.scene） ----------
  private snow: Sprite[] = [];
  private items: ItemSlot[] = [];
  private ring: Sprite | null = null;
  private burst: Sprite | null = null;
  private flash: Sprite | null = null;
  private barFill: Sprite | null = null;
  private calibBtn: Sprite | null = null;
  private resBtn: Sprite | null = null;
  private scoreTxt: Text | null = null;
  private lifeTxt: Text | null = null;
  private countTxt: Text | null = null;
  private resScoreTxt: Text | null = null;
  private resRankTxt: Text | null = null;
  private calibTitleTxt: Text | null = null;
  private calibSubTxt: Text | null = null;
  private calibBtnTxt: Text | null = null;
  private resTitleTxt: Text | null = null;
  private resShare1Txt: Text | null = null;
  private resShare2Txt: Text | null = null;
  private resBtnTxt: Text | null = null;
  private calibGroup: GameObject[] = [];
  private playGroup: GameObject[] = [];
  private resGroup: GameObject[] = [];

  // ---------- 运行时状态 ----------
  private state: number = STATE_CALIB;
  private score: number = 0;
  private miss: number = 0;
  private consec: number = 0;
  private correct: number = 0;
  private timeLeft: number = 30;
  private spawnTimer: number = 0;
  private countTimer: number = 0;
  private countStep: number = 0;
  private faceHold: number = 0;
  private flashT: number = 0;
  private burstT: number = 0;
  private popupT: number = 0;
  private ready: boolean = false;

  // 额头点（屏幕像素，左上原点），初始屏幕中部
  private fx: number = SCR_W / 2;
  private fy: number = SCR_H / 2;

  // Burst 基准尺寸（场景 StarBurst 初始显示尺寸）
  private burstBase: number = 340;

  // ---------------------------------------------------------------- 初始化
  create(): void {
    this.vision = install(this);

    // 背景雪花（初始随机撒布，不依赖场景初始坐标）
    const snowNames = ['Snow0', 'Snow1', 'Snow2', 'Snow3'];
    for (let i = 0; i < snowNames.length; i++) {
      const s = this.add.existing(snowNames[i]) as Sprite | null;
      if (s) {
        s.setPosition(this.rnd(0, SCR_W), this.rnd(-200, SCR_H));
        this.snow.push(s);
      }
    }

    // 道具池：0-3 普通帽，4 金帽，5 炸弹
    const itemNames = ['Item0', 'Item1', 'Item2', 'Item3', 'Item4', 'Item5'];
    const types = [0, 0, 0, 0, 1, 2];
    for (let i = 0; i < ITEM_COUNT; i++) {
      const slot: ItemSlot = {
        obj: this.add.existing(itemNames[i]) as Sprite | null,
        active: false,
        type: types[i],
        x: 0,
        y: 0,
        speed: 0,
      };
      this.items.push(slot);
    }

    // 玩法 / 校准 / 结算 对象组
    this.ring = this.add.existing('PlayRing') as Sprite | null;
    this.burst = this.add.existing('Burst') as Sprite | null;
    this.flash = this.add.existing('Flash') as Sprite | null;
    this.barFill = this.add.existing('BarFill') as Sprite | null;
    this.calibBtn = this.add.existing('CalibBtn') as Sprite | null;
    this.resBtn = this.add.existing('ResBtn') as Sprite | null;
    this.scoreTxt = this.add.existing('HudScore') as Text | null;
    this.lifeTxt = this.add.existing('HudLife') as Text | null;
    this.countTxt = this.add.existing('CountText') as Text | null;
    this.resScoreTxt = this.add.existing('ResScore') as Text | null;
    this.resRankTxt = this.add.existing('ResRank') as Text | null;
    this.calibTitleTxt = this.add.existing('CalibTitle') as Text | null;
    this.calibSubTxt = this.add.existing('CalibSub') as Text | null;
    this.calibBtnTxt = this.add.existing('CalibBtnText') as Text | null;
    this.resTitleTxt = this.add.existing('ResTitle') as Text | null;
    this.resShare1Txt = this.add.existing('ResShare1') as Text | null;
    this.resShare2Txt = this.add.existing('ResShare2') as Text | null;
    this.resBtnTxt = this.add.existing('ResBtnText') as Text | null;

    this.calibGroup = this.collect(
      this.add.existing('CalibDim'),
      this.add.existing('CalibRing'),
      this.add.existing('CalibTitle'),
      this.add.existing('CalibSub'),
      this.add.existing('CalibBtn'),
      this.add.existing('CalibBtnText'),
    );

    this.playGroup = this.collect(
      this.ring,
      this.items[0].obj,
      this.items[1].obj,
      this.items[2].obj,
      this.items[3].obj,
      this.items[4].obj,
      this.items[5].obj,
      this.add.existing('HudPlate'),
      this.scoreTxt,
      this.lifeTxt,
      this.add.existing('BarBg'),
      this.barFill,
      this.burst,
      this.countTxt,
      this.flash,
    );

    this.resGroup = this.collect(
      this.add.existing('ResCard'),
      this.add.existing('ResTitle'),
      this.resScoreTxt,
      this.resRankTxt,
      this.add.existing('ResShare1'),
      this.add.existing('ResShare2'),
      this.resBtn,
      this.add.existing('ResBtnText'),
    );

    // 输入与录制生命周期
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('RecordStart', this.onRecordStart, this);
    this.input.on('RecordEnd', this.onRecordEnd, this);

    this.enterCalibration();
    this.ready = true;
  }

  // ---------------------------------------------------------------- 工具
  private rnd(a: number, b: number): number {
    return a + Math.random() * (b - a);
  }

  private collect(...objs: (GameObject | null)[]): GameObject[] {
    const out: GameObject[] = [];
    for (let i = 0; i < objs.length; i++) {
      if (objs[i]) out.push(objs[i] as GameObject);
    }
    return out;
  }

  private showGroup(nodes: GameObject[], on: boolean): void {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]) nodes[i].setVisible(on).setActive(on);
    }
  }

  private hitButton(btn: Sprite | null, px: number, py: number): boolean {
    if (!btn) return false;
    const hw = btn.displayWidth / 2;
    const hh = btn.displayHeight / 2;
    return Math.abs(px - btn.x) < hw && Math.abs(py - btn.y) < hh;
  }

  private playSfx(name: string): void {
    try {
      this.sound.play(name);
    } catch (e) {
      /* ignore */
    }
  }

  // ---------------------------------------------------------------- 流程
  private enterCalibration(): void {
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
    if (this.ring) this.ring.setPosition(this.fx, this.fy);
    if (this.burst) this.burst.setVisible(false).setActive(false);
    if (this.flash) this.flash.setVisible(false).setActive(false);
    if (this.countTxt) {
      this.countTxt.setText('');
      this.countTxt.setVisible(false).setActive(false);
    }
    if (this.barFill) this.barFill.setDisplaySize(560, 20);

    this.refreshHud();
    if (this.calibTitleTxt) this.calibTitleTxt.setText(UI.calibTitle);
    if (this.calibSubTxt) this.calibSubTxt.setText(UI.calibSub);
    if (this.calibBtnTxt) this.calibBtnTxt.setText(UI.calibBtn);
    this.showGroup(this.playGroup, false);
    this.showGroup(this.resGroup, false);
    this.showGroup(this.calibGroup, true);
  }

  private onPointerDown = (pointer: Pointer): void => {
    if (!pointer) return;
    const px: number = pointer.x;
    const py: number = pointer.y;
    if (this.state === STATE_CALIB && this.hitButton(this.calibBtn, px, py)) {
      this.playSfx('SfxClick');
      this.startCountdown();
    } else if (this.state === STATE_RESULT && this.hitButton(this.resBtn, px, py)) {
      this.playSfx('SfxClick');
      this.enterCalibration();
    }
  };

  private onRecordStart = (): void => {
    this.enterCalibration();
  };

  private onRecordEnd = (): void => {
    if (this.state === STATE_PLAY) {
      this.endRound();
    } else {
      this.enterCalibration();
    }
  };

  private param() {
    return this.game as GameManager;
  }

  private startCountdown(): void {
    if (this.state !== STATE_CALIB) return;
    this.state = STATE_COUNT;
    this.countTimer = 0;
    this.countStep = 0;
    if (this.countTxt) this.countTxt.setAlpha(1);
    this.showGroup(this.calibGroup, false);
    this.showGroup(this.playGroup, true);
    // playGroup 会把所有帽子点亮，未生成（active=false）的帽子会静止在默认位置
    this.resetItemVisibility();
    this.showGroup(this.resGroup, false);
    this.refreshHud();
  }

  private resetItemVisibility(): void {
    for (let i = 0; i < this.items.length; i++) {
      const slot = this.items[i];
      slot.active = false;
      if (slot.obj) slot.obj.setVisible(false).setActive(false);
    }
  }

  private startPlaying(): void {
    this.state = STATE_PLAY;
    this.timeLeft = this.param().roundSeconds;
    this.spawnTimer = 0.25;
    this.score = 0;
    this.miss = 0;
    this.consec = 0;
    this.correct = 0;
    this.param().speedMulSet(1);
    if (this.countTxt) this.countTxt.setText('');
    this.refreshHud();
  }

  private endRound(): void {
    if (this.state === STATE_RESULT) return;
    this.state = STATE_RESULT;
    let rank = UI.rankLow;
    if (this.score > 15) rank = UI.rankHigh;
    else if (this.score > 5) rank = UI.rankMid;

    // 先覆盖文案再显示结算组，避免旧文字闪现
    if (this.resScoreTxt) this.resScoreTxt.setText(UI.resScore(this.score));
    if (this.resRankTxt) this.resRankTxt.setText(rank);
    if (this.resTitleTxt) this.resTitleTxt.setText(UI.resTitle);
    if (this.resShare1Txt) this.resShare1Txt.setText(UI.resShare1);
    if (this.resShare2Txt) this.resShare2Txt.setText(UI.resShare2);
    if (this.resBtnTxt) this.resBtnTxt.setText(UI.resBtn);

    this.showGroup(this.playGroup, false);
    this.showGroup(this.calibGroup, false);
    this.showGroup(this.resGroup, true);
    if (this.burst) this.burst.setVisible(false).setActive(false);
    if (this.flash) this.flash.setVisible(false).setActive(false);
    this.playSfx('SfxSuccess');
  }

  private refreshHud(): void {
    if (this.scoreTxt) this.scoreTxt.setText(UI.hudScore(this.score));
    if (this.lifeTxt) this.lifeTxt.setText(UI.hudLife(this.miss, this.param().maxMiss));
  }

  private addMiss(n: number): void {
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
  private spawnOne(): void {
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
    if (slot < 0) return;

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
  update(time: number, delta: number): void {
    if (!this.ready) return;
    const dt = Math.min(delta / 1000, 0.1);

    this.updateSnow(dt);
    this.updateFace(dt);
    this.updateEffects(dt);

    if (this.state === STATE_CALIB) {
      if (this.hasFace()) this.faceHold += dt;
      else this.faceHold = 0;
      if (this.faceHold > 1.2) this.startCountdown();
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
      if (this.countTimer > COUNT_STEP * 4) this.startPlaying();
      return;
    }

    if (this.state === STATE_PLAY) {
      this.updatePlaying(dt);
      return;
    }
  }

  // 人脸检测：额头锚点 -> 屏幕坐标（Game2D 720x1280 左上原点）
  private hasFace(): boolean {
    try {
      const faces: Face.Result[] = this.vision.getFaces();
      return faces.length > 0;
    } catch (e) {
      return false;
    }
  }

  private updateFace(dt: number): void {
    let has = false;
    try {
      const faces: Face.Result[] = this.vision.getFaces();
      if (faces.length > 0) {
        const face: Face.Result = faces[0];
        const p: Point2D = face.getAnchor('forehead', 'center');
        if (p) {
          const tx = Math.max(60, Math.min(660, p.x * SCR_W));
          const ty = Math.max(90, Math.min(1160, p.y * SCR_H));
          const k = Math.min(1, dt * 18);
          this.fx += (tx - this.fx) * k;
          this.fy += (ty - this.fy) * k;
          has = true;
        }
      }
    } catch (e) {
      has = false;
    }
    if (!has) {
      const k = Math.min(1, dt * 4);
      this.fx += (SCR_W / 2 - this.fx) * k;
      this.fy += (SCR_H / 2 - this.fy) * k;
    }
    if (this.ring) this.ring.setPosition(this.fx, this.fy);
  }

  private updateSnow(dt: number): void {
    for (let i = 0; i < this.snow.length; i++) {
      const s = this.snow[i];
      if (!s) continue;
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
  private updatePlaying(dt: number): void {
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
      if (!slot.active || !slot.obj) continue;
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
          if (this.state !== STATE_PLAY) return;
        } else {
          const gain = slot.type === 1 ? 3 : 1;
          this.score += gain;
          this.correct += 1;
          this.consec = 0;
          this.param().speedMulSet(Math.min(1.8, 1 + 0.1 * Math.floor(this.correct / 5)));
          this.showPopup('+' + gain, this.fx, this.fy - 100, false);
          this.triggerBurst(this.fx, this.fy);
          if (slot.type === 1) this.playSfx('SfxSuccess');
          else this.playSfx('SfxPop');
          this.refreshHud();
        }
        continue;
      }

      if (slot.y > 1300) {
        slot.active = false;
        slot.obj.setVisible(false).setActive(false);
        if (slot.type !== 2) {
          this.addMiss(1);
          if (this.state !== STATE_PLAY) return;
        }
      }
    }

    if (this.state !== STATE_PLAY) return;
    if (this.score !== scoreBefore) this.refreshHud();
  }

  // ---------------------------------------------------------------- FX
  private showPopup(label: string, x: number, y: number, isBad: boolean): void {
    if (!this.countTxt) return;
    this.countTxt.setText(label);
    this.countTxt.setColor(isBad ? '#FF4040' : '#FFD966');
    this.countTxt.setAlpha(1);
    this.countTxt.setPosition(x, y);
    this.popupT = 0.55;
  }

  private triggerBurst(x: number, y: number): void {
    if (!this.burst) return;
    this.burst.setPosition(x, y);
    this.burstBase = this.burst.displayWidth > 0 ? this.burst.displayWidth : 340;
    this.burst.setVisible(true).setActive(true);
    this.burstT = 0.35;
  }

  private updateEffects(dt: number): void {
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
@component()
export class GameManager extends Game2D {
  @label('下落速度（像素/秒）')
  @serializeProperty()
  baseSpeed: number = 300;

  @label('生成间隔（秒）')
  @serializeProperty()
  spawnInterval: number = 0.85;

  @label('接取判定宽度（半宽，像素）')
  @serializeProperty()
  catchRadiusX: number = 118;

  @label('接取判定高度（半高，像素）')
  @serializeProperty()
  catchRadiusY: number = 112;

  @label('最大漏接数')
  @serializeProperty()
  maxMiss: number = 8;

  @label('最大连续漏接数')
  @serializeProperty()
  maxConsecMiss: number = 5;

  @label('单局时长（秒）')
  @serializeProperty()
  roundSeconds: number = 30;

  private _speedMul: number = 1;

  onInit(): void {
    super.onInit();
    this._speedMul = 1;
  }

  onStart(): void {
    this.startGame(MainScene);
  }

  speedMul(): number {
    return this._speedMul;
  }

  speedMulSet(v: number): void {
    this._speedMul = v;
  }
}
