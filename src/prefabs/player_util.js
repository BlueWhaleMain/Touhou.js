import Prefab from "../prefab.js";
import {
    entities,
    getLayer,
    HEIGHT,
    L,
    TAGS,
    WIDTH,
    config,
    session,
    EVENT_MAPPING,
    GUI_SCREEN, newAudio, resources, LAYER_MAPPING, newImage
} from "../util.js";
import PowerOrb from "./power_orb.js";
import {ob} from "../observer.js"

let _;
const soundOfExtend = newAudio(resources.Sounds.extend);
const soundOfMiss = newAudio(resources.Sounds.miss);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
const playerSpellName = newImage(resources.Images.playerSpellName);
export default function PlayerUtil() {
    const inst = new Prefab(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT);
    inst.shootDelay = 0;
    inst.bombUsed = false;
    inst.bombTime = -1;
    inst.indTime = 60;
    inst.indMin = -60;
    inst.miss = false;
    inst.playerCount = config.Player;
    inst.bombCount = 3;
    inst.power = 0;
    inst.point = 0;
    inst.graze = 0;
    inst.hideTime = 96;
    inst.callback = {};
    inst.hitCount = 0;
    inst.inScreen = function () {
        const p = inst.sizeBox.inScreen(inst.X, inst.Y);
        inst.X = p[0];
        inst.Y = p[1]
    };
    inst.die = function () {
        if (inst.miss || inst.hideTime) {
            return
        }
        inst.hitCount++;
        if (inst.indTime < 0) {
            inst.miss = true;
            soundOfMiss.currentTime = 0;
            _ = soundOfMiss.play()
        }
        // 被弹回调
        if (typeof inst.callback.die === "function") {
            inst.callback.die(inst)
        }
    };
    let playerScore = 20000000;
    let psU = 20000000;
    inst.addComponent("PlayerTick", function () {
        this.tick = function () {
            if (session.score > playerScore) {
                playerScore += psU;
                if (psU < 160000000) {
                    psU *= 2
                } else {
                    psU = 20000000
                }
                _ = soundOfExtend.play();
                inst.playerCount++
            }
            if (inst.hideTime > 0) {
                inst.hideTime--;
                inst.bombUsed = false;
                return
            }
            if (inst.deadPOS) {
                inst.deadPOS = null
            }
            if (inst.shootDelay > 0) {
                inst.shootDelay--;
            }
            if (inst.bombUsed) {
                inst.bombUsed = false;
                if (!session.practice) {
                    if (!session.developerMode) {
                        inst.bombCount--;
                    }
                    if (inst.miss) {
                        inst.miss = false;
                        // 决死回调
                        if (typeof inst.callback.missBomb === "function") {
                            inst.callback.missBomb(inst)
                        }
                    } else {
                        // 普通回调
                        if (typeof inst.callback.normalBomb === "function") {
                            inst.callback.normalBomb(inst)
                        }
                    }
                    // 放B回调
                    if (typeof inst.callback.bomb === "function") {
                        inst.callback.bomb(inst)
                    }
                }
            }
            if (inst.miss) {
                if (inst.indTime < 0) {
                    inst.indTime++
                }
                if (inst.indTime === 0) {
                    inst.miss = false;
                    if (session.developerMode) {
                        return
                    }
                    ob.dispatchEvent(EVENT_MAPPING.miss);
                    if (session.practice) {
                        inst.indTime = 210;
                        return
                    }
                    // modifyEntity(function (entity) {
                    //     if (entity.tags.has(TAGS.enemy)) {
                    //         if (entity.components["health"] && !entity.components["health"].indestructible) {
                    //             entity.components["health"].doDelta(-100)
                    //         }
                    //         return true
                    //     }
                    // });
                    if (inst.playerCount > 0) {
                        inst.playerCount--
                    } else {
                        inst.tags.add(TAGS.death)
                    }
                    inst.deadPOS = {
                        X: inst.X, Y: inst.Y
                    };
                    inst.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2;
                    inst.Y = GUI_SCREEN.Y + GUI_SCREEN.HEIGHT;
                    inst.inScreen();
                    inst.hideTime = 96;
                    inst.indTime = 210;
                    inst.bombCount = 3;
                    inst.power = 0;
                    if (inst.playerCount > 0) {
                        entities.push(PowerOrb(inst.X, inst.Y, 0, Math.min(28 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(PowerOrb(inst.X, inst.Y, -26, Math.min(20 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(PowerOrb(inst.X, inst.Y, 26, Math.min(20 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(PowerOrb(inst.X, inst.Y, -44, Math.min(18 - inst.Y * inst.pickLine, 0)));
                        entities.push(PowerOrb(inst.X, inst.Y, 44, Math.min(18 - inst.Y * inst.pickLine, 0)));
                        entities.push(PowerOrb(inst.X, inst.Y, -56, -inst.Y * inst.pickLine));
                        entities.push(PowerOrb(inst.X, inst.Y, 56, -inst.Y * inst.pickLine));
                    } else {
                        entities.push(PowerOrb(inst.X, inst.Y, -20, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(PowerOrb(inst.X, inst.Y, 20, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(PowerOrb(inst.X, inst.Y, -32, -inst.Y * inst.pickLine, "big"));
                        entities.push(PowerOrb(inst.X, inst.Y, 32, -inst.Y * inst.pickLine, "big"));
                    }
                    // miss回调
                    if (typeof inst.callback.miss === "function") {
                        inst.callback.miss(inst)
                    }
                }
            } else {
                if (inst.bombTime > 0) {
                    inst.bombTime--;
                    // bomb运行回调
                    if (typeof inst.callback.bombLay === "function") {
                        inst.callback.bombLay(inst)
                    }
                }
                if (inst.bombTime < 0) {
                    if (inst.indTime > 0) {
                        inst.indTime--
                    } else {
                        if (inst.indTime > inst.indMin) {
                            inst.indTime--
                        }
                    }
                }
                if (inst.bombTime === 0) {
                    inst.bombTime = -1;
                    // bomb结束回调
                    if (typeof inst.callback.bombOut === "function") {
                        inst.callback.bombOut(inst)
                    }
                }
            }
        }
    });
    inst.addLayer("PlayerPoint", function () {
        // let ro = 0;
        let frame = 0;
        this.draw = function () {
            if (inst.bombTime > 0) {
                let layout = inst.bombTime * -6;
                if (layout < -300) {
                    layout = -300
                }
                layerTitle.drawImage(playerSpellName, 30, 600 + layout);
                layerTitle.save();
                layerTitle.font = "10px Comic Sans MS";
                layerTitle.fillStyle = "white";
                layerTitle.shadowColor = "black";
                layerTitle.shadowBlur = 5;
                layerTitle.fillText(inst.spellName, 40, 629 + layout);
                layerTitle.restore();
            }
            if (session.slow) {
                layerUI.save();
                if (inst.deadPOS) {
                    layerUI.translate(inst.deadPOS.X, inst.deadPOS.Y)
                } else {
                    layerUI.translate(inst.X, inst.Y)
                }
                layerUI.fillStyle = "red";
                layerUI.shadowColor = "red";
                layerUI.shadowBlur = 3;
                layerUI.beginPath();
                layerUI.arc(0, 0, inst.hitBox.r + 1, 0, 2 * Math.PI);
                layerUI.closePath();
                layerUI.fill();
                layerUI.strokeStyle = "rgba(255,255,255,0.05)";
                layerUI.lineWidth = 1;
                layerUI.shadowColor = "white";
                layerUI.shadowBlur = 4;
                layerUI.beginPath();
                layerUI.arc(0, 0, inst.pickBox.r, 0, 2 * Math.PI);
                layerUI.closePath();
                layerUI.stroke();
                layerUI.beginPath();
                layerUI.arc(0, 0, inst.pickBox.r - 2, 0, 2 * Math.PI);
                layerUI.closePath();
                layerUI.stroke();
                // layerUI.save();
                // ro += L;
                // if (ro > 90 * L) {
                //     ro = 0
                // }
                // layerUI.rotate(ro);
                // layerUI.globalCompositeOperation = "lighter";
                // layerUI.drawImage(playerBorder, -32, -32);
                // layerUI.restore();
                layerUI.fillStyle = "white";
                layerUI.shadowColor = "white";
                layerUI.rotate(L * frame * 6);
                frame++;
                if (frame > 60) {
                    frame = 0
                }
                layerUI.fillRect(-inst.hitBox.r, -inst.hitBox.r, inst.hitBox.r * 2, inst.hitBox.r * 2);
                layerUI.restore();
            }
            if (inst.hideTime > 0) {
                return
            }
            if (inst.miss && inst.indTime < 0) {
                layerStage.save();
                layerStage.globalCompositeOperation = "source-atop";
                layerStage.fillStyle = "rgba(255,0,10,0.3)";
                layerStage.fillRect(0, 0, WIDTH, HEIGHT);
                layerStage.restore();
            }
        }
    });
    ob.addEventListener(EVENT_MAPPING.left, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.left, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.right, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.right, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.up, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.up, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.down, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.down, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.upperLeft, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.upperLeft, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.lowerLeft, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.lowerLeft, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.upperRight, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.upperRight, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.lowerRight, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.moveTo === "function") {
            inst.callback.moveTo(EVENT_MAPPING.lowerRight, session.slow)
        }
        inst.inScreen()
    });
    ob.addEventListener(EVENT_MAPPING.shoot, function () {
        if (inst.hideTime > 0 || inst.miss) {
            return
        }
        if (typeof inst.callback.shoot === "function" && inst.shootDelay === 0) {
            inst.callback.shoot(session.slow)
        }
    });
    ob.addEventListener(EVENT_MAPPING.bomb, function () {
        if (inst.hideTime > 0 || inst.bombUsed || session.practice) {
            return
        }
        if (inst.bombCount > 0 && inst.bombTime < 0) {
            inst.bombUsed = true
        }
    });
    return inst
}
