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

let _;
const soundOfShoot = newAudio(resources.Sounds.shoot);
const soundOfCat0 = newAudio(resources.Sounds.cat0);
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
        soundOfCat0.currentTime = 0;
        _ = soundOfCat0.play();
    };
    inst.callback.normalBomb = function () {
        inst.bombTime = 210;
        let spawn = [0, -80];
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "red", 60));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "purple", 70));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "blue", 80));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "water", 90));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "green", 100));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "gold", 110));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "orangered", 120));
        spawn = transTo(spawn[0], spawn[1], 45 * L);
        entities.push(HakureiReimuLightBall(inst.X + spawn[0], inst.Y + spawn[1], 3, 0, "hotpink", 130));
    };
    inst.callback.missBomb = function () {
        inst.bombTime = 400;
        let innerSpawn = [0, -40];
        entities.push(HakureiReimuLightBall(inst.X + innerSpawn[0], inst.Y + innerSpawn[1], 3, 0, "red", 120, true));
        innerSpawn = transTo(innerSpawn[0], innerSpawn[1], 120 * L);
        entities.push(HakureiReimuLightBall(inst.X + innerSpawn[0], inst.Y + innerSpawn[1], 3, 0, "green", 120, true));
        innerSpawn = transTo(innerSpawn[0], innerSpawn[1], 120 * L);
        entities.push(HakureiReimuLightBall(inst.X + innerSpawn[0], inst.Y + innerSpawn[1], 3, 0, "blue", 120, true));
        let outerSpawn = [0, -80];
        entities.push(HakureiReimuLightBall(inst.X + outerSpawn[0], inst.Y + outerSpawn[1], 3, 0, "water", 60, true));
        outerSpawn = transTo(outerSpawn[0], outerSpawn[1], 72 * L);
        entities.push(HakureiReimuLightBall(inst.X + outerSpawn[0], inst.Y + outerSpawn[1], 3, 0, "green", 60, true));
        outerSpawn = transTo(outerSpawn[0], outerSpawn[1], 72 * L);
        entities.push(HakureiReimuLightBall(inst.X + outerSpawn[0], inst.Y + outerSpawn[1], 3, 0, "gold", 60, true));
        outerSpawn = transTo(outerSpawn[0], outerSpawn[1], 72 * L);
        entities.push(HakureiReimuLightBall(inst.X + outerSpawn[0], inst.Y + outerSpawn[1], 3, 0, "orangered", 60, true));
        outerSpawn = transTo(outerSpawn[0], outerSpawn[1], 72 * L);
        entities.push(HakureiReimuLightBall(inst.X + outerSpawn[0], inst.Y + outerSpawn[1], 3, 0, "hotpink", 60, true));
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
