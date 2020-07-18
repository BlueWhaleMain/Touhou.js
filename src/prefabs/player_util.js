import prefabs from "../prefabs.js";
import {clear_screen, entities, getLayer, height, L, Sounds, Tags, width, config, boss} from "../util.js";
import power_orb from "./power_orb.js";

let _;

const ctx = getLayer(0);
const ctx2 = getLayer(2);
export default function player_util() {
    const inst = new prefabs();
    inst.X = 440;
    inst.Y = 760;
    inst.shoot_delay = 0;
    inst.bombTime = -1;
    inst.indTime = -10;
    inst.miss = false;
    inst.player_count = config["Player"];
    inst.bomb_count = 3;
    inst.power = 0;
    inst.point = 0;
    inst.graze = 0;
    inst.hide_time = 0;
    inst.inScreen = function () {
        const p = inst.grazeBox.inScreen(inst.X, inst.Y, 46, 14, 832, 940);
        inst.X = p[0];
        inst.Y = p[1]
    };
    inst.die = function () {
        if (inst.miss || inst.hide_time) {
            return
        }
        if (inst.indTime < 0) {
            inst.miss = true;
            _ = Sounds.miss.play()
        }
    };
    inst.addComponent("PlayerTick", function () {
        this.tick = function () {
            if (inst.hide_time > 0) {
                inst.hide_time--;
                inst.bomb_used = false;
                return
            }
            if (inst.shoot_delay > 0) {
                inst.shoot_delay--;
            }
            if (inst.bomb_used) {
                if (inst.miss) {
                    inst.bombTime = 500;
                    inst.miss = false
                } else {
                    inst.bombTime = 300
                }
                inst.bomb_used = false;
                inst.bomb_count--;
                _ = Sounds.cat0.play();
            }
            if (inst.miss) {
                if (inst.indTime < 0) {
                    inst.indTime++
                }
                if (inst.indTime === 0) {
                    inst.indTime = 300;
                    if (inst.player_count > 0) {
                        if (typeof inst.missCallBack === "function") {
                            inst.missCallBack()
                        }
                        inst.player_count--
                    } else {
                        inst.tags.add(Tags.death)
                    }
                    inst.bomb_count = 3;
                    inst.power = 0;
                    if (inst.player_count > 0) {
                        entities.push(power_orb(inst.X, inst.Y, 0, Math.min(28 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, -26, Math.min(20 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, 26, Math.min(20 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, -44, Math.min(18 - inst.Y * inst.pickLine, 0)));
                        entities.push(power_orb(inst.X, inst.Y, 44, Math.min(18 - inst.Y * inst.pickLine, 0)));
                        entities.push(power_orb(inst.X, inst.Y, -56, -inst.Y * inst.pickLine));
                        entities.push(power_orb(inst.X, inst.Y, 56, -inst.Y * inst.pickLine));
                    } else {
                        entities.push(power_orb(inst.X, inst.Y, -20, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, 20, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, -32, -inst.Y * inst.pickLine, "big"));
                        entities.push(power_orb(inst.X, inst.Y, 32, -inst.Y * inst.pickLine, "big"));
                    }
                    inst.hide_time = 30;
                    inst.X = 440;
                    inst.Y = 760;
                    clear_screen(function (entity) {
                        return entity.tags.has(Tags.hostile)
                    });
                    for (let i = 0; i < boss.length; i++) {
                        boss[i].components["health"].doDelta(-100);
                    }
                    inst.miss = false
                }
            } else {
                if (inst.bombTime > 0) {
                    inst.indTime = 10;
                    if (inst.bombLay) {
                        inst.bombLay()
                    }
                    inst.bombTime--
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
                    inst.indTime = 60;
                    if (inst.bombOut) {
                        inst.bombOut()
                    }
                    inst.bombTime = -1
                }
            }
        }
    });
    inst.addLayer("PlayerPoint", function () {
        // let ro = 0;
        let frame = 0;
        this.draw = function () {
            if (inst.hide_time > 0) {
                return
            }
            if (window.slow) {
                ctx2.save();
                ctx2.translate(inst.X, inst.Y);
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
                // ctx2.drawImage(Images.ply_border_01, -32, -32);
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
