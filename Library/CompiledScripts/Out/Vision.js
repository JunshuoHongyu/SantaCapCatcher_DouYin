"use strict";
/**
 * Vision.ts - Visual Algorithm Adapter
 *
 * This file is designed to be copied into `Assets/Vision.ts`.
 *
 * Use this only when the design explicitly needs visual algorithms such as
 * Face, Hand, or Body.
 *
 * Provides an AI-friendly, standard API for accessing visual algorithm results.
 * It transforms proprietary APJS data structures into standard formats familiar
 * to LLMs, similar to MediaPipe/Web APIs.
 *
 * Runtime usage rules:
 * - Import `install` and `Vision`, declare `public vision!: Vision` on the Scene
 *   subclass, and assign `this.vision = install(this)` during setup.
 * - Always use explicit types for vision values in generated code.
 * - Coordinate values are normalized screen coordinates and should not be
 *   mirrored unless the design explicitly asks for mirrored interaction.
 * - Never modify this adapter from generated gameplay code; only call it.
 *
 * Implementation Details:
 * - This adapter maps ByteDance APJS 106-point landmark results to semantic parts.
 * - Symbol-alias driven: Export is controlled by `*.symbol-alias.json`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateTracker = exports.Body = exports.Hand = exports.Pet = exports.Face = exports.install = exports.Vision = void 0;
exports.Vision = {
    installed: true,
    isInstalled() {
        return true;
    },
    getFaces() {
        throw new Error('[Vision] Face API not available. Ensure Face capability exists in Assets/Vision.ts');
    },
    getPets() {
        throw new Error('[Vision] Pet API not available. Ensure Pet capability exists in Assets/Vision.ts');
    },
    getHands() {
        throw new Error('[Vision] Hand API not available. Ensure Hand capability exists in Assets/Vision.ts');
    },
    getBodies() {
        throw new Error('[Vision] Body API not available. Ensure Body capability exists in Assets/Vision.ts');
    },
    isBodyDetected() {
        throw new Error('[Vision] Body API not available. Ensure Body capability exists in Assets/Vision.ts');
    },
    /**
     * Helper: Converts a normalized bounding box to pixel coordinates.
     */
    toPixelRect(box, width, height) {
        return {
            x: box.x * width,
            y: box.y * height,
            width: box.width * width,
            height: box.height * height,
        };
    },
};
function install(scene) {
    scene.vision = exports.Vision;
    return exports.Vision;
}
exports.install = install;
var Face;
(function (Face) {
    function range(start, endInclusive) {
        const out = [];
        for (let i = start; i <= endInclusive; i++)
            out.push(i);
        return out;
    }
    /**
     * Index map for the 106-landmark convention.
     *
     * Parts used by this mapping:
     *   0..32   face contour (jawline)
     *   33..37  left eyebrow (main)
     *   38..42  right eyebrow (main)
     *   43..46  nose bridge
     *   43..51  nose (main)
     *   52..57  left eye outline (main)
     *   58..63  right eye outline (main)
     *   64..67  left eyebrow (extra)
     *   68..71  right eyebrow (extra)
     *   72..73  left eye (extra)
     *   74      left pupil
     *   75..76  right eye (extra)
     *   77      right pupil
     *   80..83  nose (extra)
     *   84..103 mouth (including inner mouth)
     * Notes:
     * - Upper lip: 84..90 + 96..100; Lower lip: 91..95 + 101..103
     *
     * `[]` means the part is geometrically derived from base landmarks
     * rather than directly mapped (see computeDerivedPart).
     */
    const FACE_PART_INDICES = {
        face: [],
        faceContour: range(0, 32),
        leftEyebrow: range(33, 37).concat(range(64, 67)),
        rightEyebrow: range(38, 42).concat(range(68, 71)),
        noseBridge: range(43, 46),
        nose: range(43, 51).concat(range(80, 83)),
        noseTip: [46],
        leftEye: range(52, 57).concat(range(72, 73)),
        leftPupil: [74],
        rightEye: range(58, 63).concat(range(75, 76)),
        rightPupil: [77],
        mouth: range(84, 103),
        upperLip: range(84, 90).concat(range(96, 100)),
        lowerLip: range(91, 95).concat(range(101, 103)),
        innerMouth: range(96, 103),
        forehead: [],
        leftCheek: [],
        rightCheek: [],
        chin: [16],
    };
    function pickPoints(landmarks, indices) {
        const pts = [];
        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i];
            if (idx >= 0 && idx < landmarks.length) {
                pts.push(landmarks[idx]);
            }
        }
        return pts;
    }
    function computeBox(points) {
        if (points.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        let minX = points[0].x, maxX = points[0].x;
        let minY = points[0].y, maxY = points[0].y;
        for (let i = 1; i < points.length; i++) {
            const p = points[i];
            if (p.x < minX)
                minX = p.x;
            if (p.x > maxX)
                maxX = p.x;
            if (p.y < minY)
                minY = p.y;
            if (p.y > maxY)
                maxY = p.y;
        }
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
    function computeCenter(points, fallbackBox) {
        if (points.length === 0) {
            return { x: fallbackBox.x + fallbackBox.width / 2, y: fallbackBox.y + fallbackBox.height / 2 };
        }
        let sx = 0, sy = 0;
        for (let i = 0; i < points.length; i++) {
            sx += points[i].x;
            sy += points[i].y;
        }
        return { x: sx / points.length, y: sy / points.length };
    }
    function expandBoxAroundCenter(center, halfW, halfH) {
        return {
            x: center.x - halfW,
            y: center.y - halfH,
            width: halfW * 2,
            height: halfH * 2,
        };
    }
    /**
     * Geometrically derive parts that have no direct landmark coverage.
     * Returns null when the part is not derived (caller should use the
     * standard index-based path).
     *
     * Convention: y axis points DOWN (y=1.0 is bottom of screen).
     */
    function computeDerivedPart(part, landmarks, faceBox) {
        switch (part) {
            case 'face':
                return {
                    points: [],
                    center: { x: faceBox.x + faceBox.width / 2, y: faceBox.y + faceBox.height / 2 },
                    box: faceBox,
                };
            case 'forehead': {
                const lb = pickPoints(landmarks, FACE_PART_INDICES.leftEyebrow);
                const rb = pickPoints(landmarks, FACE_PART_INDICES.rightEyebrow);
                if (lb.length === 0 || rb.length === 0)
                    return null;
                const lbBox = computeBox(lb);
                const rbBox = computeBox(rb);
                const eyebrowMidX = (lbBox.x + lbBox.width / 2 + rbBox.x + rbBox.width / 2) / 2;
                // y-down: smaller y is higher on screen.
                const eyebrowTopY = Math.min(lbBox.y, rbBox.y);
                const targetY = Math.max(faceBox.y, eyebrowTopY - faceBox.height * 0.30);
                const halfW = (faceBox.width * 0.55) / 2;
                const halfH = Math.max(0, (eyebrowTopY - targetY)) / 2;
                const center = { x: eyebrowMidX, y: (eyebrowTopY + targetY) / 2 };
                return {
                    points: [],
                    center,
                    box: expandBoxAroundCenter(center, halfW, Math.max(halfH, faceBox.height * 0.05)),
                };
            }
            case 'leftCheek':
            case 'rightCheek': {
                const isLeft = part === 'leftCheek';
                const eyeIndices = isLeft ? FACE_PART_INDICES.leftEye : FACE_PART_INDICES.rightEye;
                const eyePts = pickPoints(landmarks, eyeIndices);
                if (eyePts.length === 0)
                    return null;
                const eyeBox = computeBox(eyePts);
                // Mouth top as the lower bound of the cheek vertical range.
                const mouthPts = pickPoints(landmarks, FACE_PART_INDICES.mouth);
                const mouthBox = mouthPts.length > 0 ? computeBox(mouthPts) : null;
                const cx = eyeBox.x + eyeBox.width / 2;
                // Cheek center vertically halfway between eye-bottom and mouth-top.
                const eyeBottom = eyeBox.y + eyeBox.height; // y-down: smaller y is higher
                const mouthTop = mouthBox ? (mouthBox.y) : (faceBox.y + faceBox.height * 0.35);
                const cy = (eyeBottom + mouthTop) / 2;
                const halfW = Math.max(faceBox.width * 0.10, eyeBox.width * 0.6);
                const halfH = Math.max(faceBox.height * 0.06, Math.abs(eyeBottom - mouthTop) / 2);
                const center = { x: cx, y: cy };
                return {
                    points: [],
                    center,
                    box: expandBoxAroundCenter(center, halfW, halfH),
                };
            }
            default:
                return null;
        }
    }
    function getPartInfoFor(landmarks, faceBox, part) {
        const derived = computeDerivedPart(part, landmarks, faceBox);
        if (derived)
            return derived;
        const indices = FACE_PART_INDICES[part];
        const points = pickPoints(landmarks, indices);
        if (points.length === 0) {
            // Defensive: never throw — fall back to face box.
            return {
                points: [],
                center: { x: faceBox.x + faceBox.width / 2, y: faceBox.y + faceBox.height / 2 },
                box: faceBox,
            };
        }
        const box = computeBox(points);
        const center = computeCenter(points, box);
        return { points, center, box };
    }
    function getAnchorOf(info, anchor) {
        const b = info.box;
        switch (anchor) {
            case 'top': return { x: b.x + b.width / 2, y: b.y };
            case 'bottom': return { x: b.x + b.width / 2, y: b.y + b.height };
            case 'left': return { x: b.x, y: b.y + b.height / 2 };
            case 'right': return { x: b.x + b.width, y: b.y + b.height / 2 };
            case 'center':
            default: return info.center;
        }
    }
    const allowedActionNames = new Set([
        'BrowJump',
        'EyeBlink',
        'EyeBlinkLeft',
        'EyeBlinkRight',
        'HeadPitch',
        'HeadYaw',
        'MouthAh',
        'MouthPout',
        'SideNod',
    ]);
    function toFaceActionCode(action) {
        const map = {
            BrowJump: APJS.FaceAction.BrowJump,
            EyeBlink: APJS.FaceAction.EyeBlink,
            EyeBlinkLeft: APJS.FaceAction.EyeBlinkLeft,
            EyeBlinkRight: APJS.FaceAction.EyeBlinkRight,
            HeadPitch: APJS.FaceAction.HeadPitch,
            HeadYaw: APJS.FaceAction.HeadYaw,
            MouthAh: APJS.FaceAction.MouthAh,
            MouthPout: APJS.FaceAction.MouthPout,
            SideNod: APJS.FaceAction.SideNod,
        };
        const code = map[action];
        return typeof code === 'number' ? code : -1;
    }
    function getExpressionLabel(type) {
        switch (type) {
            case 0: return 'Angry';
            case 1: return 'Disgust';
            case 2: return 'Fear';
            case 3: return 'Happy';
            case 4: return 'Sad';
            case 5: return 'Surprise';
            case 6: return 'Neutral';
            default: return 'Unknown';
        }
    }
    function getGenderLabel(gender) {
        switch (gender) {
            case 1: return 'Male';
            case 2: return 'Female';
            default: return 'Unknown';
        }
    }
    function convertAttr(attr) {
        const expression = { type: 'Unknown', probs: [], happyScore: 0 };
        const demographics = { age: 0, gender: 'Unknown', boyProb: 0, attractive: 0 };
        expression.type = getExpressionLabel(attr.expressionType);
        if (attr.expressionProbabilities) {
            expression.probs = Array.from(attr.expressionProbabilities);
        }
        expression.happyScore = attr.happyScore;
        demographics.age = attr.age;
        demographics.gender = getGenderLabel(attr.gender);
        demographics.boyProb = attr.boyProbability;
        demographics.attractive = attr.attractive;
        return {
            expression,
            demographics,
        };
    }
    class FaceResultImpl {
        constructor(base, index, algoRes) {
            this.base = base;
            this.index = index;
            this.algoRes = algoRes;
            this.attrLoaded = false;
        }
        get id() {
            return this.base.ID;
        }
        get box() {
            if (!this.boxCache) {
                const rawRect = this.base.rect;
                if (!rawRect) {
                    this.boxCache = { x: 0, y: 0, width: 0, height: 0 };
                }
                else {
                    this.boxCache = {
                        x: rawRect.x,
                        y: 1.0 - (rawRect.y + rawRect.height),
                        width: rawRect.width,
                        height: rawRect.height,
                    };
                }
            }
            return this.boxCache;
        }
        get landmarks() {
            if (!this.landmarksCache) {
                const landmarks = [];
                const rawPoints = this.base.pointsArray;
                if (rawPoints) {
                    for (let j = 0; j + 1 < rawPoints.length; j += 2) {
                        const x = rawPoints[j];
                        const y = rawPoints[j + 1];
                        if (!Number.isFinite(x) || !Number.isFinite(y))
                            continue;
                        landmarks.push({ x, y: 1.0 - y });
                    }
                }
                this.landmarksCache = landmarks;
            }
            return this.landmarksCache;
        }
        get rotation() {
            return { pitch: -this.base.pitch, yaw: -this.base.yaw, roll: -this.base.roll };
        }
        get score() {
            return this.base.score;
        }
        hasAction(action) {
            if (!allowedActionNames.has(action))
                return false;
            const code = toFaceActionCode(action);
            if (!Number.isFinite(code) || code < 0)
                return false;
            return Boolean(this.base.hasAction(code));
        }
        ensureAttr() {
            if (this.attrLoaded)
                return this.attr;
            this.attrLoaded = true;
            if (!this.algoRes) {
                return undefined;
            }
            const count = this.algoRes.getFaceAttributeCount();
            if (this.index >= count) {
                return undefined;
            }
            this.attr = this.algoRes.getFaceAttributeInfo(this.index);
            return this.attr;
        }
        getAttr() {
            if (this.attrCache)
                return this.attrCache;
            const attr = this.ensureAttr();
            if (!attr)
                return undefined;
            this.attrCache = convertAttr(attr);
            return this.attrCache;
        }
        getPart(part) {
            return getPartInfoFor(this.landmarks, this.box, part);
        }
        getAnchor(part, anchor = 'center') {
            const info = getPartInfoFor(this.landmarks, this.box, part);
            return getAnchorOf(info, anchor);
        }
        getBox(part) {
            return getPartInfoFor(this.landmarks, this.box, part).box;
        }
    }
    function getResults() {
        const results = [];
        const algoRes = APJS.AlgorithmManager.getResult();
        if (!algoRes)
            return results;
        const count = algoRes.getFaceCount();
        if (count <= 0)
            return results;
        for (let i = 0; i < count; i++) {
            const baseInfo = algoRes.getFaceBaseInfo(i);
            if (baseInfo) {
                results.push(new FaceResultImpl(baseInfo, i, algoRes));
            }
        }
        return results;
    }
    Face.getResults = getResults;
})(Face = exports.Face || (exports.Face = {}));
exports.Vision.getFaces = Face.getResults;
exports.Vision.Face = Face;
var Pet;
(function (Pet) {
    function getPetTypeLabel(type) {
        switch (type) {
            case 1: return 'Cat';
            case 2: return 'Dog';
            case 3: return 'Human';
            case 99: return 'Others';
            default: return 'Others';
        }
    }
    function getResults() {
        const results = [];
        const algoRes = APJS.AlgorithmManager.getResult();
        if (!algoRes)
            return results;
        const count = algoRes.getFacePetInfoCount();
        if (count <= 0)
            return results;
        for (let i = 0; i < count; i++) {
            const info = algoRes.getFacePetInfo(i);
            if (info) {
                results.push(convert(info, i));
            }
        }
        return results;
    }
    Pet.getResults = getResults;
    function convert(info, index) {
        const rawRect = info.rect;
        const box = rawRect
            ? {
                x: rawRect.x,
                y: 1.0 - (rawRect.y + rawRect.height),
                width: rawRect.width,
                height: rawRect.height,
            }
            : { x: 0, y: 0, width: 0, height: 0 };
        const landmarks = [];
        const rawPoints = info.pointsArray;
        if (rawPoints) {
            for (let j = 0; j + 1 < rawPoints.length; j += 2) {
                const x = rawPoints[j];
                const y = rawPoints[j + 1];
                if (!Number.isFinite(x) || !Number.isFinite(y))
                    continue;
                landmarks.push({ x, y: 1.0 - y });
            }
        }
        return {
            id: index,
            type: getPetTypeLabel(info.facePetType),
            box: box,
            landmarks: landmarks,
            rotation: { pitch: -info.pitch, yaw: -info.yaw, roll: -info.roll },
            score: info.score
        };
    }
})(Pet = exports.Pet || (exports.Pet = {}));
exports.Vision.getPets = Pet.getResults;
exports.Vision.Pet = Pet;
var Hand;
(function (Hand) {
    const allowedActionNames = new Set([
        'Beg',
        'BigV',
        'Cabbage',
        'DoubleFingerUp',
        'Fist',
        'Four',
        'HandOpen',
        'HeartA',
        'HeartB',
        'HeartC',
        'HeartD',
        'Holdface',
        'IndexFingerUp',
        'Namaste',
        'OK',
        'Phonecall',
        'Pistol',
        'Pistol2',
        'PlamUp',
        'Pray',
        'Rock',
        'Rock2',
        'Salute',
        'Spread',
        'Swear',
        'Thanks',
        'Three',
        'ThumbDown',
        'ThumbUp',
        'Unknown',
        'Undetect',
        'Victory',
    ]);
    Hand.Keypoint = {
        Wrist: 0,
        ThumbRoot: 1,
        ThumbMcp: 2,
        ThumbIp: 3,
        ThumbTip: 4,
        IndexMcp: 5,
        IndexPip: 6,
        IndexDip: 7,
        IndexTip: 8,
        MiddleMcp: 9,
        MiddlePip: 10,
        MiddleDip: 11,
        MiddleTip: 12,
        RingMcp: 13,
        RingPip: 14,
        RingDip: 15,
        RingTip: 16,
        PinkyMcp: 17,
        PinkyPip: 18,
        PinkyDip: 19,
        PinkyTip: 20,
        PalmCenter: 21,
    };
    const FINGER_ATTACHMENTS = {
        thumbBase: { start: Hand.Keypoint.ThumbRoot, end: Hand.Keypoint.ThumbMcp, widthFactor: 0.29 },
        thumbMiddle: { start: Hand.Keypoint.ThumbMcp, end: Hand.Keypoint.ThumbIp, widthFactor: 0.29 },
        thumbTip: { start: Hand.Keypoint.ThumbIp, end: Hand.Keypoint.ThumbTip, widthFactor: 0.29 },
        indexBase: { start: Hand.Keypoint.IndexMcp, end: Hand.Keypoint.IndexPip, widthFactor: 0.26 },
        indexMiddle: { start: Hand.Keypoint.IndexPip, end: Hand.Keypoint.IndexDip, widthFactor: 0.19 },
        indexTip: { start: Hand.Keypoint.IndexDip, end: Hand.Keypoint.IndexTip, widthFactor: 0.19 },
        middleBase: { start: Hand.Keypoint.MiddleMcp, end: Hand.Keypoint.MiddlePip, widthFactor: 0.26 },
        middleMiddle: { start: Hand.Keypoint.MiddlePip, end: Hand.Keypoint.MiddleDip, widthFactor: 0.19 },
        middleTip: { start: Hand.Keypoint.MiddleDip, end: Hand.Keypoint.MiddleTip, widthFactor: 0.19 },
        ringBase: { start: Hand.Keypoint.RingMcp, end: Hand.Keypoint.RingPip, widthFactor: 0.26 },
        ringMiddle: { start: Hand.Keypoint.RingPip, end: Hand.Keypoint.RingDip, widthFactor: 0.19 },
        ringTip: { start: Hand.Keypoint.RingDip, end: Hand.Keypoint.RingTip, widthFactor: 0.19 },
        pinkyBase: { start: Hand.Keypoint.PinkyMcp, end: Hand.Keypoint.PinkyPip, widthFactor: 0.26 },
        pinkyMiddle: { start: Hand.Keypoint.PinkyPip, end: Hand.Keypoint.PinkyDip, widthFactor: 0.19 },
        pinkyTip: { start: Hand.Keypoint.PinkyDip, end: Hand.Keypoint.PinkyTip, widthFactor: 0.19 },
    };
    const previousKeypointsById = new Map();
    function normalizeHandType(raw) {
        if (typeof raw !== 'string')
            return 'Unknown';
        const lower = raw.toLowerCase();
        if (lower.includes('left'))
            return 'Left';
        if (lower.includes('right'))
            return 'Right';
        return 'Unknown';
    }
    function getHandType(info) {
        return normalizeHandType(info.getHandType());
    }
    function toHandAction(value) {
        const unknownCode = APJS.HandAction.Unknown;
        const name = APJS.HandAction[value];
        if (typeof name === 'string' && allowedActionNames.has(name)) {
            return { action: name, actionCode: value };
        }
        return { action: 'Unknown', actionCode: unknownCode };
    }
    function convertKeyPointsXYToPoints(keyPointsXY) {
        var _a;
        const count = Math.floor(((_a = keyPointsXY === null || keyPointsXY === void 0 ? void 0 : keyPointsXY.length) !== null && _a !== void 0 ? _a : 0) / 2);
        const points = [];
        for (let i = 0; i < count; i++) {
            points.push({
                x: keyPointsXY[i * 2],
                y: 1 - keyPointsXY[i * 2 + 1],
            });
        }
        return points;
    }
    function clonePoints(points) {
        return points.map(point => ({ x: point.x, y: point.y }));
    }
    function smoothKeypoints(id, current) {
        const previous = previousKeypointsById.get(id);
        if (!previous || previous.length !== current.length) {
            const firstFrame = clonePoints(current);
            previousKeypointsById.set(id, firstFrame);
            return firstFrame;
        }
        const smoothed = current.map((point, index) => {
            const last = previous[index];
            //平滑值  目前设为1
            const alpha = 1;
            const deltaX = point.x - last.x;
            const deltaY = point.y - last.y;
            const distance = Math.hypot(deltaX, deltaY);
            const softDeadZone = 0.007;
            let antiShakeTarget = last;
            if (distance > 0) {
                const effectiveDistance = distance - Math.min(distance, softDeadZone) * 0.92;
                const scale = effectiveDistance / distance;
                antiShakeTarget = {
                    x: last.x + deltaX * scale,
                    y: last.y + deltaY * scale,
                };
            }
            return {
                x: last.x + (antiShakeTarget.x - last.x) * alpha,
                y: last.y + (antiShakeTarget.y - last.y) * alpha,
            };
        });
        previousKeypointsById.set(id, clonePoints(smoothed));
        return smoothed;
    }
    function getAttachmentTransform(keypoints, part, viewportWidth, viewportHeight) {
        if (!Number.isFinite(viewportWidth) || viewportWidth <= 0 ||
            !Number.isFinite(viewportHeight) || viewportHeight <= 0) {
            throw new RangeError('[Vision] Hand attachment viewport dimensions must be positive finite numbers.');
        }
        if (keypoints.length <= Hand.Keypoint.PalmCenter)
            return undefined;
        const points = keypoints.map(point => ({
            x: point.x * viewportWidth,
            y: point.y * viewportHeight,
        }));
        if (points.some(point => !Number.isFinite(point.x) || !Number.isFinite(point.y)))
            return undefined;
        const palm = points[Hand.Keypoint.PalmCenter];
        const wrist = points[Hand.Keypoint.Wrist];
        const middleMcp = points[Hand.Keypoint.MiddleMcp];
        const referenceScale = Math.min(viewportWidth / 720, viewportHeight / 1280);
        const palmWidth = Math.max(70 * referenceScale, Math.hypot(points[Hand.Keypoint.IndexMcp].x - points[Hand.Keypoint.PinkyMcp].x, points[Hand.Keypoint.IndexMcp].y - points[Hand.Keypoint.PinkyMcp].y) * 1.75);
        const handAngle = Math.atan2(middleMcp.y - wrist.y, middleMcp.x - wrist.x) * 180 / Math.PI + 90;
        if (part === 'palm') {
            return {
                position: { x: palm.x, y: palm.y + palmWidth * 0.05 },
                size: { width: palmWidth, height: palmWidth },
                angle: handAngle,
            };
        }
        if (part === 'wrist') {
            const dx = wrist.x - palm.x;
            const dy = wrist.y - palm.y;
            return {
                position: { x: wrist.x + dx * 0.28, y: wrist.y + dy * 0.28 },
                size: {
                    width: palmWidth * 0.8,
                    height: Math.max(90 * referenceScale, Math.hypot(dx, dy) * 1.25),
                },
                angle: handAngle,
            };
        }
        const attachment = FINGER_ATTACHMENTS[part];
        if (!attachment)
            return undefined;
        const start = points[attachment.start];
        const end = points[attachment.end];
        return {
            position: {
                x: (start.x + end.x) * 0.5,
                y: (start.y + end.y) * 0.5,
            },
            size: {
                width: Math.max(16 * referenceScale, palmWidth * attachment.widthFactor),
                height: Math.hypot(end.x - start.x, end.y - start.y) * 1.18,
            },
            angle: Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI + 90,
        };
    }
    function getResults() {
        var _a, _b;
        const results = [];
        const algoRes = APJS.AlgorithmManager.getResult();
        if (!algoRes) {
            previousKeypointsById.clear();
            return results;
        }
        const count = algoRes.getHandCount();
        if (count <= 0) {
            previousKeypointsById.clear();
            return results;
        }
        const visibleIds = new Set();
        for (let i = 0; i < count; i++) {
            const info = algoRes.getHandInfo(i);
            if (!info)
                continue;
            const id = (_a = info.ID) !== null && _a !== void 0 ? _a : i;
            visibleIds.add(id);
            const rawRect = info.rect;
            const box = rawRect
                ? {
                    x: rawRect.x,
                    y: 1.0 - (rawRect.y + rawRect.height),
                    width: rawRect.width,
                    height: rawRect.height,
                }
                : { x: 0, y: 0, width: 0, height: 0 };
            const type = getHandType(info);
            const { action, actionCode } = toHandAction(info.action);
            const keypoints = smoothKeypoints(id, convertKeyPointsXYToPoints(info.keyPointsXY));
            results.push({
                id,
                type,
                action,
                actionCode: Number.isFinite(actionCode) ? actionCode : -1,
                box,
                rotation: (_b = info.rotation) !== null && _b !== void 0 ? _b : 0,
                keypoints,
                getAttachmentTransform(part, viewportWidth, viewportHeight) {
                    return getAttachmentTransform(keypoints, part, viewportWidth, viewportHeight);
                },
            });
        }
        previousKeypointsById.forEach((_value, id) => {
            if (!visibleIds.has(id)) {
                previousKeypointsById.delete(id);
            }
        });
        return results;
    }
    Hand.getResults = getResults;
})(Hand = exports.Hand || (exports.Hand = {}));
exports.Vision.getHands = Hand.getResults;
exports.Vision.Hand = Hand;
var Body;
(function (Body) {
    function getResults() {
        const results = [];
        const algoRes = APJS.AlgorithmManager.getResult();
        if (!algoRes)
            return results;
        const count = algoRes.getBodyCount();
        if (count <= 0)
            return results;
        for (let i = 0; i < count; i++) {
            const info = algoRes.getBodyInfo(i);
            if (!info)
                continue;
            const detected = Boolean(info.detected);
            results.push({
                id: i,
                detected,
            });
        }
        return results;
    }
    Body.getResults = getResults;
    function isDetected() {
        const algoRes = APJS.AlgorithmManager.getResult();
        if (!algoRes)
            return false;
        const count = algoRes.getBodyCount();
        for (let i = 0; i < count; i++) {
            const info = algoRes.getBodyInfo(i);
            if (info && info.detected)
                return true;
        }
        return false;
    }
    Body.isDetected = isDetected;
})(Body = exports.Body || (exports.Body = {}));
exports.Vision.getBodies = Body.getResults;
exports.Vision.isBodyDetected = Body.isDetected;
exports.Vision.Body = Body;
class StateTracker {
    constructor(targetTimeMs = 0, targetFrames = 0) {
        this.targetTimeMs = targetTimeMs;
        this.targetFrames = targetFrames;
        this.activeTime = 0;
        this.activeFrames = 0;
    }
    update(isActive, deltaMs = 0) {
        if (isActive) {
            this.activeTime += deltaMs;
            this.activeFrames += 1;
        }
        else {
            this.activeTime = 0;
            this.activeFrames = 0;
        }
        if (this.targetFrames > 0)
            return this.activeFrames >= this.targetFrames;
        if (this.targetTimeMs > 0)
            return this.activeTime >= this.targetTimeMs;
        return isActive;
    }
    reset() {
        this.activeTime = 0;
        this.activeFrames = 0;
    }
}
exports.StateTracker = StateTracker;
