import {ABox, entities, EVENT_MAPPING, L, RBox, session, TAGS} from "../../util.js";
import PlayerUtil from "../player_util.js";
import {newImage} from "../../resources/images";
import {newAudio} from "../../resources/sounds";
import {resources} from "../../resources/manager";
import {getLayer, LAYER_MAPPING} from "../../layers/manager";
import kirisameMarisaBullet from "../kirisame_marisa_bullet";
import kirisameMarisaColdSpark from "../kirisame_marisa_cold_spark";
import kirisameMarisaLaser from "../kirisame_marisa_laser";

let _;
const soundOfShoot = newAudio(resources.Sounds.shoot);
const soundOfLaser = newAudio(resources.Sounds.laser);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
const kirisameMarisaNormal = document.createElement("canvas");
kirisameMarisaNormal.width = 32;
kirisameMarisaNormal.height = 48;
const kirisameMarisaNormalCtx = kirisameMarisaNormal.getContext("2d");
const texture = newImage(resources.Images.player.kirisameMarisaShot);
const kirisameMarisa = newImage(resources.Images.player.kirisameMarisa);
texture.addEventListener("load", function () {
    kirisameMarisaNormalCtx.drawImage(texture, 0, 0, 32, 48, 0, 0, 32, 48)
});

export default function KirisameMarisa() {
    const inst = PlayerUtil();
    inst.hitBox = new ABox(2.2);
    inst.grazeBox = new RBox(32, 48);
    inst.sizeBox = new RBox(32, 48);
    inst.pickBox = new ABox(48);
    inst.pickLine = 3 / 4;
    inst.bulletShootDelay = 0;
    inst.powerMax = 400;
    inst.indMin = -10;
    inst.tags.add(TAGS.human);
    inst.inScreen();
    let textureLayout = 200;
    let textureOpacity = 0;
    let layout = 0.02;
    let normalFrame = 0;
    let moveFrame = 0;
    let laserPutted = false
    inst.addComponent("KirisameMarisa", function () {
        this.tick = function () {
            if (!laserPutted) {
                entities.push(kirisameMarisaLaser(inst.X, inst.Y - 256 + 16).normal(200, 300));
                entities.push(kirisameMarisaLaser(inst.X - 5, inst.Y - 256 + 16).normal(300, Infinity));
                entities.push(kirisameMarisaLaser(inst.X + 5, inst.Y - 256 + 16).normal(300, Infinity));
                entities.push(kirisameMarisaLaser(inst.X - 16, inst.Y - 256 + 32 + 8).normal(400, Infinity));
                entities.push(kirisameMarisaLaser(inst.X + 16, inst.Y - 256 + 32 + 8).normal(400, Infinity));
                laserPutted = true
            }
            if (inst.bulletShootDelay > 0) {
                inst.bulletShootDelay--;
            }
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
    inst.addLayer("KirisameMarisa", function () {
        this.draw = function () {
            if (textureOpacity > 0) {
                layerUI.save();
                layerUI.globalAlpha = textureOpacity;
                layerUI.drawImage(kirisameMarisa, 25, textureLayout, 286, 373);
                layerUI.restore()
            }
            if (moveFrame) {
                layerStage.save();
                layerStage.translate(inst.X, inst.Y);
                layerStage.rotate(moveFrame * 2 * L);
                layerStage.drawImage(kirisameMarisaNormal, -16, -24 + inst.hideTime * 0.5);
                layerStage.restore()
            } else {
                layerStage.drawImage(kirisameMarisaNormal, inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
            }
        }
    });
    inst.callback.moveTo = function (op, slow) {
        let moveSpeed;
        if (slow || inst.bombTime > 0) {
            moveSpeed = 2
        } else {
            moveSpeed = 5
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
        if (inst.power < 99) {
            if (inst.bulletShootDelay === 0) {
                entities.push(kirisameMarisaBullet(inst.X, inst.Y, 0, -20, session.slow ? 'blue' : 'green'))
            }
        }
        if (inst.power >= 100 && inst.power <= 400) {
            if (inst.bulletShootDelay === 0) {
                entities.push(kirisameMarisaBullet(inst.X + 5, inst.Y, 0, -20, session.slow ? 'blue' : 'green'));
                entities.push(kirisameMarisaBullet(inst.X - 5, inst.Y, 0, -20, session.slow ? 'blue' : 'green'))
            }
        }
        if (inst.power >= 200 && inst.power < 300) {
            if (session.slow) {
                entities.push(kirisameMarisaColdSpark(inst.X, inst.Y, 0, -10));
            }
        }
        if (inst.power >= 300) {
            if (session.slow) {
                entities.push(kirisameMarisaColdSpark(inst.X - 5, inst.Y, 0, -10));
                entities.push(kirisameMarisaColdSpark(inst.X + 5, inst.Y, 0, -10))
            }
        }
        if (inst.power >= 400) {
            if (session.slow) {
                entities.push(kirisameMarisaColdSpark(inst.X - 32, inst.Y, 0, -10));
                entities.push(kirisameMarisaColdSpark(inst.X + 32, inst.Y, 0, -10))
            }
        }
        if (inst.bulletShootDelay === 0) {
            inst.bulletShootDelay = 6;
            soundOfShoot.currentTime = 0;
            _ = soundOfShoot.play()
        }
        inst.shootDelay = 3;
    };
    inst.callback.bomb = function () {
        textureOpacity = 0.6;
        soundOfLaser.currentTime = 0;
        _ = soundOfLaser.play();
    };
    inst.callback.normalBomb = function () {
        inst.spellName = "恋符「Master Spark」";
        inst.bombTime = 210;
        entities.push(kirisameMarisaLaser(inst.X, inst.Y - 512 / 2).masterSpark({
            startTime: 10,
            delayTime: 150,
            outTime: 60
        }));
    };
    inst.callback.missBomb = function () {
        inst.spellName = "魔炮「Final Spark」";
        inst.bombTime = 400;
        entities.push(kirisameMarisaLaser(inst.X, inst.Y - 512 / 2).masterSpark({
            startTime: 10,
            delayTime: 340,
            outTime: 60
        }, true));
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
KirisameMarisa.getName = function () {
    return "KirisameMarisa"
}