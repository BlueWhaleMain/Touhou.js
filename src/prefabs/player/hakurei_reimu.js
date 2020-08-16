import {
    ABox,
    entities,
    getLayer,
    L,
    LAYER_MAPPING,
    newAudio,
    newImage,
    RBox,
    resources,
    session,
    transTo, EVENT_MAPPING
} from "../../util.js";
import PlayerUtil from "../player_util.js";
import HakureiReimuBill from "../hakurei_reimu_bill.js";
import HakureiReimuLightBall from "../hakurei_reimu_light_ball.js";
import SealingNeedle from "../sealing_needle.js";
import {makeMovableArc} from "../../components/movable.js";

let _;
const soundOfShoot = newAudio(resources.Sounds.shoot);
const soundOfLaser = newAudio(resources.Sounds.laser);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
const hakureiReimuNormal = document.createElement("canvas");
hakureiReimuNormal.width = 32;
hakureiReimuNormal.height = 48;
const hakureiReimuNormalCtx = hakureiReimuNormal.getContext("2d");
const texture = newImage(resources.Images.player.hakureiReimuShot);
const hakureiReimu = newImage(resources.Images.player.hakureiReimu);
texture.addEventListener("load", function () {
    hakureiReimuNormalCtx.drawImage(texture, 0, 0, 32, 48, 0, 0, 32, 48)
});

export default function HakureiReimu() {
    const inst = PlayerUtil();
    inst.hitBox = new ABox(2);
    inst.grazeBox = new RBox(32, 48);
    inst.sizeBox = new RBox(32, 48);
    inst.pickBox = new ABox(40);
    inst.pickLine = 3 / 4;
    inst.shootCount = 0;
    inst.powerMax = 400;
    inst.indMin = -15;
    inst.inScreen();
    let textureLayout = 200;
    let textureOpacity = 0;
    let layout = 0.02;
    let normalFrame = 0;
    let moveFrame = 0;
    inst.addComponent("HakureiReimu", function () {
        this.tick = function () {
            if (textureOpacity > 0) {
                textureLayout -= 2.5;
                textureOpacity += layout;
                if (textureOpacity > 1 && textureLayout < 420) {
                    textureOpacity = 1;
                    layout = -0.01
                }
            }
            if (inst.hideTime > 0) {
                return
            }
            if (moveFrame) {
                if (moveFrame > 0) {
                    moveFrame -= 0.5
                } else {
                    moveFrame += 0.5
                }
                if (moveFrame > 7 || moveFrame < -7) {
                    moveFrame = 0
                }
            } else {
                normalFrame += 0.1;
                if (normalFrame > 7) {
                    normalFrame = 0
                }
            }
        }
    });
    inst.addLayer("HakureiReimu", function () {
        this.draw = function () {
            if (textureOpacity > 0) {
                layerUI.save();
                layerUI.globalAlpha = textureOpacity;
                layerUI.drawImage(hakureiReimu, 25, textureLayout, 286, 373);
                layerUI.restore()
            }
            if (moveFrame) {
                layerStage.save();
                layerStage.translate(inst.X, inst.Y);
                layerStage.rotate(moveFrame * 2 * L);
                layerStage.drawImage(hakureiReimuNormal, -16, -24 + inst.hideTime * 0.5);
                layerStage.restore()
            } else {
                layerStage.drawImage(hakureiReimuNormal, inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
            }
        }
    });
    inst.callback.moveTo = function (op, slow) {
        let moveSpeed;
        if (slow) {
            moveSpeed = 2
        } else {
            moveSpeed = 4
        }
        switch (op) {
            case EVENT_MAPPING.left:
                inst.X -= moveSpeed;
                if (moveFrame > -7) {
                    moveFrame--
                }
                break;
            case EVENT_MAPPING.right:
                inst.X += moveSpeed;
                if (moveFrame < 7) {
                    moveFrame++
                }
                break;
            case EVENT_MAPPING.up:
                inst.Y -= moveSpeed;
                break;
            case EVENT_MAPPING.down:
                inst.Y += moveSpeed;
                break;
            case EVENT_MAPPING.upperLeft:
                inst.X -= moveSpeed * Math.cos(45 * L);
                inst.Y -= moveSpeed * Math.cos(45 * L);
                break;
            case EVENT_MAPPING.lowerLeft:
                inst.X -= moveSpeed * Math.cos(45 * L);
                inst.Y += moveSpeed * Math.cos(45 * L);
                break;
            case EVENT_MAPPING.upperRight:
                inst.X += moveSpeed * Math.cos(45 * L);
                inst.Y -= moveSpeed * Math.cos(45 * L);
                break;
            case EVENT_MAPPING.lowerRight:
                inst.X += moveSpeed * Math.cos(45 * L);
                inst.Y += moveSpeed * Math.cos(45 * L);
                break;
        }
    };
    inst.callback.shoot = function () {
        inst.shootCount++;
        if (inst.shootCount > 1) {
            inst.shootCount = 0
        }
        if (inst.power < 99 || inst.power >= 400) {
            entities.push(HakureiReimuBill(inst.X, inst.Y, 0, -20))
        }
        if (inst.power >= 100 && inst.power < 400) {
            entities.push(HakureiReimuBill(inst.X + 5, inst.Y, 0, -20));
            entities.push(HakureiReimuBill(inst.X - 5, inst.Y, 0, -20))
        }
        let temp;
        if (inst.power >= 200 && inst.shootCount % 2 === 0 || inst.power >= 300) {
            if (session.slow) {
                entities.push(SealingNeedle(inst.X - 8, inst.Y - 2, 0, -20));
                entities.push(SealingNeedle(inst.X + 8, inst.Y - 2, 0, -20))
            } else {
                temp = transTo(0, -20, 30 * L);
                entities.push(HakureiReimuBill(inst.X - 8, inst.Y + 2, temp[0], temp[1], true));
                temp = transTo(0, -20, -30 * L);
                entities.push(HakureiReimuBill(inst.X + 8, inst.Y + 2, temp[0], temp[1], true))
            }
        }
        if (inst.power >= 400) {
            temp = transTo(0, -20, 10 * L);
            entities.push(HakureiReimuBill(inst.X, inst.Y, temp[0], temp[1]));
            temp = transTo(0, -20, -10 * L);
            entities.push(HakureiReimuBill(inst.X, inst.Y, temp[0], temp[1]));
            if (session.slow) {
                entities.push(SealingNeedle(inst.X - 32, inst.Y - 2, 0, -20));
                entities.push(SealingNeedle(inst.X + 32, inst.Y - 2, 0, -20))
            } else {
                temp = transTo(0, -20, 60 * L);
                entities.push(HakureiReimuBill(inst.X - 16, inst.Y + 2, temp[0], temp[1], true));
                temp = transTo(0, -20, -60 * L);
                entities.push(HakureiReimuBill(inst.X + 16, inst.Y + 2, temp[0], temp[1], true))
            }
        }
        inst.shootDelay = 6;
        session.score += 100;
        soundOfShoot.currentTime = 0;
        _ = soundOfShoot.play()
    };
    inst.callback.bomb = function () {
        textureOpacity = 0.6;
        soundOfLaser.currentTime = 0;
        _ = soundOfLaser.play();
    };
    inst.callback.normalBomb = function () {
        inst.spellName = "灵符「梦想妙珠」";
        inst.bombTime = 210;
        let speed = [3, 0];
        let entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "red", 60);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "purple", 70);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "blue", 80);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "water", 90);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "green", 100);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "gold", 110);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "orangered", 120);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        speed = transTo(speed[0], speed[1], 45 * L);
        entity = HakureiReimuLightBall(inst.X + speed[0] * 20, inst.Y + speed[1] * 20, speed[0], speed[1], "hotpink", 130);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
    };
    inst.callback.missBomb = function () {
        inst.spellName = "神灵「梦想封印·瞬」";
        inst.bombTime = 400;
        let innerSpeed = [0, -6];
        let entity = HakureiReimuLightBall(inst.X + innerSpeed[0] * 20, inst.Y + innerSpeed[1] * 20, innerSpeed[0], innerSpeed[1], "red", 120, true);
        makeMovableArc(entity, 2, 0, 0.5);
        entities.push(entity);
        innerSpeed = transTo(innerSpeed[0], innerSpeed[1], 120 * L);
        entity = HakureiReimuLightBall(inst.X + innerSpeed[0] * 20, inst.Y + innerSpeed[1] * 20, innerSpeed[0], innerSpeed[1], "green", 130, true);
        makeMovableArc(entity, 2, 0, 0.5);
        entities.push(entity);
        innerSpeed = transTo(innerSpeed[0], innerSpeed[1], 120 * L);
        entity = HakureiReimuLightBall(inst.X + innerSpeed[0] * 20, inst.Y + innerSpeed[1] * 20, innerSpeed[0], innerSpeed[1], "blue", 140, true);
        makeMovableArc(entity, 2, 0, 0.5);
        entities.push(entity);
        let outerSpeed = [0, -12];
        entity = HakureiReimuLightBall(inst.X + outerSpeed[0] * 20, inst.Y + outerSpeed[1] * 20, outerSpeed[0], outerSpeed[1], "water", 60, true);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        outerSpeed = transTo(outerSpeed[0], outerSpeed[1], 72 * L);
        entity = HakureiReimuLightBall(inst.X + outerSpeed[0] * 20, inst.Y + outerSpeed[1] * 20, outerSpeed[0], outerSpeed[1], "green", 70, true);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        outerSpeed = transTo(outerSpeed[0], outerSpeed[1], 72 * L);
        entity = HakureiReimuLightBall(inst.X + outerSpeed[0] * 20, inst.Y + outerSpeed[1] * 20, outerSpeed[0], outerSpeed[1], "gold", 80, true);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        outerSpeed = transTo(outerSpeed[0], outerSpeed[1], 72 * L);
        entity = HakureiReimuLightBall(inst.X + outerSpeed[0] * 20, inst.Y + outerSpeed[1] * 20, outerSpeed[0], outerSpeed[1], "orangered", 90, true);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
        outerSpeed = transTo(outerSpeed[0], outerSpeed[1], 72 * L);
        entity = HakureiReimuLightBall(inst.X + outerSpeed[0] * 20, inst.Y + outerSpeed[1] * 20, outerSpeed[0], outerSpeed[1], "hotpink", 100, true);
        makeMovableArc(entity, 2, 180, 0.5);
        entities.push(entity);
    };
    inst.callback.bombLay = function () {
        inst.indTime = 250
    };
    inst.callback.bombOut = function () {
        textureOpacity = 0;
        textureLayout = 200;
        layout = 0.02
    };
    return inst
}
