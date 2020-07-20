import Prefab from "../prefab.js";
import {clearEntity, modifyEntity, entities, getLayer, height, L, Sounds, Tags, width, config, boss} from "../util.js";
import powerOrb from "./power_orb.js";

let _;

const ctx = getLayer(0);
const ctx2 = getLayer(2);
export default function PlayerUtil() {
    const inst = new Prefab(440, 940);
    inst.shootDelay = 0;
    inst.bombTime = -1;
    inst.indTime = -60;
    inst.miss = false;
    inst.playerCount = config["Player"];
    inst.bombCount = 3;
    inst.power = 0;
    inst.point = 0;
    inst.graze = 0;
    inst.hideTime = 0;
    inst.callback = {};
    inst.inScreen = function () {
        const p = inst.sizeBox.inScreen(inst.X, inst.Y, 46, 14, 832, 940);
        inst.X = p[0];
        inst.Y = p[1]
    };
    inst.die = function () {
        if (inst.miss || inst.hideTime) {
            return
        }
        if (inst.indTime < 0) {
            inst.miss = true;
            _ = Sounds.miss.play()
        }
        // 被弹回调
        if (typeof inst.callback.die === "function") {
            inst.callback.die(inst)
        }
    };
    inst.addComponent("PlayerTick", function () {
        this.tick = function () {
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
                inst.bombCount--;
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
            if (inst.miss) {
                if (inst.indTime < 0) {
                    inst.indTime++
                }
                if (inst.indTime === 0) {
                    inst.miss = false;
                    if (inst.playerCount > 0) {
                        entities.push(powerOrb(inst.X, inst.Y, 0, Math.min(28 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(powerOrb(inst.X, inst.Y, -26, Math.min(20 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(powerOrb(inst.X, inst.Y, 26, Math.min(20 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(powerOrb(inst.X, inst.Y, -44, Math.min(18 - inst.Y * inst.pickLine, 0)));
                        entities.push(powerOrb(inst.X, inst.Y, 44, Math.min(18 - inst.Y * inst.pickLine, 0)));
                        entities.push(powerOrb(inst.X, inst.Y, -56, -inst.Y * inst.pickLine));
                        entities.push(powerOrb(inst.X, inst.Y, 56, -inst.Y * inst.pickLine));
                    } else {
                        entities.push(powerOrb(inst.X, inst.Y, -20, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(powerOrb(inst.X, inst.Y, 20, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(powerOrb(inst.X, inst.Y, -32, -inst.Y * inst.pickLine, "big"));
                        entities.push(powerOrb(inst.X, inst.Y, 32, -inst.Y * inst.pickLine, "big"));
                    }
                    clearEntity(function (entity) {
                        return entity.tags.has(Tags.hostile)
                    });
                    modifyEntity(function (entity) {
                        if (entity.tags.has(Tags.enemy)) {
                            if (entity.components["health"] && !entity.components["health"].indestructible) {
                                entity.components["health"].doDelta(-100)
                            }
                            return true
                        }
                    });
                    for (let i = 0; i < boss.length; i++) {
                        boss[i].components["health"].doDelta(-100);
                    }
                    if (inst.playerCount > 0) {
                        if (window.practice) {
                            // inst.tags.add(Tags.death)
                        } else {
                            inst.playerCount--
                        }
                    } else {
                        inst.tags.add(Tags.death)
                    }
                    inst.deadPOS = {
                        X: inst.X, Y: inst.Y
                    };
                    inst.X = 440;
                    inst.Y = 940;
                    inst.inScreen();
                    inst.hideTime = 96;
                    inst.indTime = 210;
                    inst.bombCount = 3;
                    inst.power = 0;
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
                        if (inst.indTime > -10) {
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
            if (window.slow) {
                ctx2.save();
                if (inst.deadPOS) {
                    ctx2.translate(inst.deadPOS.X, inst.deadPOS.Y)
                } else {
                    ctx2.translate(inst.X, inst.Y)
                }
                ctx2.fillStyle = "red";
                ctx2.shadowColor = "red";
                ctx2.shadowBlur = 3;
                ctx2.beginPath();
                ctx2.arc(0, 0, inst.hitBox.r + 1, 0, 2 * Math.PI);
                ctx2.closePath();
                ctx2.fill();
                ctx2.strokeStyle = "rgba(255,255,255,0.05)";
                ctx2.lineWidth = 1;
                ctx2.shadowColor = "white";
                ctx2.shadowBlur = 4;
                ctx2.beginPath();
                ctx2.arc(0, 0, inst.pickBox.r, 0, 2 * Math.PI);
                ctx2.stroke();
                ctx2.beginPath();
                ctx2.arc(0, 0, inst.pickBox.r - 2, 0, 2 * Math.PI);
                ctx2.stroke();
                // ctx2.save();
                // ro += L;
                // if (ro > 90 * L) {
                //     ro = 0
                // }
                // ctx2.rotate(ro);
                // ctx2.globalCompositeOperation = "lighter";
                // ctx2.drawImage(Images.playerBorder, -32, -32);
                // ctx2.restore();
                ctx2.fillStyle = "white";
                ctx2.shadowColor = "white";
                ctx2.rotate(L * frame * 6);
                frame++;
                if (frame > 60) {
                    frame = 0
                }
                ctx2.fillRect(-inst.hitBox.r, -inst.hitBox.r, inst.hitBox.r * 2, inst.hitBox.r * 2);
                ctx2.restore();
            }
            if (inst.hideTime > 0) {
                return
            }
            if (inst.miss && inst.indTime < 0) {
                ctx.save();
                ctx.globalCompositeOperation = "source-atop";
                ctx.fillStyle = "rgba(255,0,10,0.3)";
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        }
    });
    return inst
}
