import PlayerUtil from "../player_util.js";
import {
    ABox,
    clearEntity,
    entities,
    EVENT_MAPPING,
    getLayer,
    L,
    LAYER_MAPPING,
    newAudio,
    newImage,
    RBox,
    resources,
    session,
    TAGS,
    transTo
} from "../../util.js";
import RumiaBall from "../rumia_ball.js";
import GreenOrb from "../green_orb.js";
import {ob} from "../../observer.js"

let _;
const soundOfShoot = newAudio(resources.Sounds.shoot);
const soundOfCat0 = newAudio(resources.Sounds.cat0);
const soundOfSlash = newAudio(resources.Sounds.slash);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
const rumiaNormal = [];
const rumiaLeft = [];
const rumiaRight = [];
const texture = newImage(resources.Images.player.rumiaShot);
const rumia = newImage(resources.Images.bossRumia);
texture.addEventListener("load", function () {
    for (let i = 0; i < 8; i++) {
        rumiaNormal[i] = document.createElement("canvas");
        rumiaNormal[i].width = 32;
        rumiaNormal[i].height = 48;
        let ctx = rumiaNormal[i].getContext("2d");
        ctx.drawImage(texture, i * 32, 0, 32, 48, 0, 0, 32, 48);
        rumiaLeft[i] = document.createElement("canvas");
        rumiaLeft[i].width = 32;
        rumiaLeft[i].height = 48;
        ctx = rumiaLeft[i].getContext("2d");
        ctx.drawImage(texture, i * 32, 48, 32, 48, 0, 0, 32, 48);
        rumiaRight[i] = document.createElement("canvas");
        rumiaRight[i].width = 32;
        rumiaRight[i].height = 48;
        ctx = rumiaRight[i].getContext("2d");
        ctx.drawImage(texture, i * 32, 96, 32, 48, 0, 0, 32, 48);
    }
});

export default function Rumia() {
    const inst = PlayerUtil();
    inst.hitBox = new ABox(2);
    inst.grazeBox = new RBox(32, 48);
    inst.pickBox = new ABox(40);
    inst.sizeBox = new RBox(32, 48);
    inst.pickLine = 3 / 4;
    inst.shootCount = 0;
    inst.powerMax = 400;
    inst.tags.add(TAGS.monster);
    inst.inScreen();
    let textureLayout = 200;
    let textureOpacity = 0;
    let layout = 0.02;
    let normalFrame = 0;
    let moveFrame = 0;
    inst.addComponent("Rumia", function () {
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
    inst.addLayer("Rumia", function () {
        this.draw = function () {
            if (textureOpacity > 0) {
                layerUI.save();
                layerUI.globalAlpha = textureOpacity;
                layerUI.drawImage(rumia, 25, textureLayout, 286, 373);
                layerUI.restore()
            }
            if (moveFrame) {
                if (moveFrame > 0) {
                    layerStage.drawImage(rumiaRight[Math.floor(moveFrame)], inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
                } else {
                    layerStage.drawImage(rumiaLeft[Math.floor(-moveFrame)], inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
                }
            } else {
                layerStage.drawImage(rumiaNormal[Math.floor(normalFrame)], inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
            }
            if (inst.bombTime) {
                layerStage.save();
                layerStage.fillStyle = "black";
                layerStage.shadowColor = "white";
                layerStage.shadowBlur = 10;
                layerStage.beginPath();
                layerStage.arc(inst.X, inst.Y, inst.bombTime + 1, 0, 2 * Math.PI);
                layerStage.closePath();
                layerStage.fill();
                layerStage.restore()
            }
        }
    });
    inst.callback.moveTo = function (op, slow) {
        let moveSpeed;
        if (slow) {
            moveSpeed = 2
        } else {
            moveSpeed = 4.5
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
    inst.callback.shoot = function (slow) {
        let th = 45, tx = 15;
        if (slow) {
            th = 1;
            tx = 2
        }
        inst.shootCount++;
        if (inst.shootCount > 1) {
            inst.shootCount = 0
        }
        if (inst.power < 99) {
            entities.push(RumiaBall(inst.X, inst.Y, 0, -20));
        }
        if (inst.power >= 100) {
            entities.push(RumiaBall(inst.X + 5, inst.Y, 0, -20));
            entities.push(RumiaBall(inst.X - 5, inst.Y, 0, -20));
        }
        let temp;
        if (inst.power >= 200 && inst.shootCount % 2 === 0 || inst.power >= 300) {
            temp = transTo(0, -20, tx * L);
            entities.push(RumiaBall(inst.X - 8, inst.Y + 2, temp[0], temp[1]));
            temp = transTo(0, -20, -tx * L);
            entities.push(RumiaBall(inst.X + 8, inst.Y + 2, temp[0], temp[1]));
        }
        if (inst.power >= 400) {
            temp = transTo(0, -20, th * L);
            entities.push(RumiaBall(inst.X + 10, inst.Y + 5, temp[0], temp[1]));
            temp = transTo(0, -20, -th * L);
            entities.push(RumiaBall(inst.X - 10, inst.Y + 5, temp[0], temp[1]));
        }
        inst.shootDelay = 6;
        soundOfShoot.currentTime = 0;
        _ = soundOfShoot.play()
    };
    inst.callback.bomb = function () {
        textureOpacity = 0.6;
        soundOfCat0.currentTime = 0;
        _ = soundOfCat0.play();
    };
    inst.callback.normalBomb = function () {
        inst.spellName = "月符「月亮光」";
        inst.bombTime = 210
    };
    inst.callback.missBomb = function () {
        inst.spellName = "暗符「境界线」";
        inst.bombTime = 400
    };
    inst.callback.bombLay = function () {
        inst.indTime = 250;
        const box = new ABox(inst.bombTime);
        clearEntity(function (entity) {
            if (entity.atkBox) {
                if (entity.atkBox.isHit(entity.X, entity.Y, inst.X, inst.Y, box)) {
                    if (entity.tags.has(TAGS.hostile)) {
                        entities.push(GreenOrb(entity.X, entity.Y, 0, -2, "small"));
                        return true
                    } else if (entity.tags.has(TAGS.enemy)) {
                        const health = entity.components["health"]
                        if (health) {
                            health.doDelta(-Math.floor(inst.bombTime / 100))
                        }
                    }
                }
            }
        }, entities.length);
        for (let i = 0; i < session.stage.boss.length; i++) {
            let b = session.stage.boss[i];
            if (box.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                b.components["health"].doDelta(-Math.floor(inst.bombTime / 100))
            }
        }
    };
    inst.callback.bombOut = function () {
        textureOpacity = 0;
        textureLayout = 200;
        layout = 0.02;
        ob.dispatchEvent(EVENT_MAPPING.clearEntity, {isPlayer: true, drop: true});
        _ = soundOfSlash.play()
    };
    return inst
}
