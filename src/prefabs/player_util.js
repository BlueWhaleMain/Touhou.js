import prefabs from "../prefabs.js";
import {ABox, clear_screen, entities, getLayer, height, L, Sounds, Tags, width, config} from "../util.js";
import power_orb from "./power_orb.js";

let _;

export default function player_util() {
    const inst = new prefabs();
    inst.X = 440;
    inst.Y = 760;
    inst.option = {};
    inst.option.shoot_delay = 3;
    inst.shoot_delay = 0;
    inst.highSpeed = 8;
    inst.lowSpeed = 4;
    inst.hitBox = new ABox(3);
    inst.grazeBox = new ABox(16);
    inst.pickBox = new ABox(60);
    inst.pickLine = 3 / 4;
    inst.bombTime = -1;
    inst.indTime = -10;
    inst.miss = false;
    inst.player_count = config["Player"];
    inst.bomb_count = 3;
    inst.power = 0;
    inst.point = 0;
    inst.graze = 0;
    inst.inScreen = function () {
        const p = inst.grazeBox.inScreen(inst.X, inst.Y, 46, 14, 832, 940);
        inst.X = p[0];
        inst.Y = p[1]
    };
    inst.div = document.createElement("div");
    inst.div.addEventListener("left", function () {
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.X -= inst.lowSpeed
        } else {
            inst.X -= inst.highSpeed
        }
        inst.inScreen()
    });
    inst.div.addEventListener("right", function () {
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.X += inst.lowSpeed
        } else {
            inst.X += inst.highSpeed
        }
        inst.inScreen()
    });
    inst.div.addEventListener("up", function () {
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.Y -= inst.lowSpeed
        } else {
            inst.Y -= inst.highSpeed
        }
        inst.inScreen()
    });
    inst.div.addEventListener("down", function () {
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.Y += inst.lowSpeed
        } else {
            inst.Y += inst.highSpeed
        }
        inst.inScreen()
    });
    inst.div.addEventListener("shoot", function () {
        if (inst.shoot_delay === 0) {
            inst.shoot();
            window.score += 100;
            window.score += inst.power * 100;
            Sounds.shoot.currentTime = 0;
            _ = Sounds.shoot.play();
            inst.shoot_delay = inst.option.shoot_delay
        }
    });
    inst.div.addEventListener("bomb", function () {
        if (inst.bomb_count > 0 && inst.bombTime < 0) {
            inst.bomb();
            inst.bomb_count--;
            inst.miss = false
        }
    });
    inst.die = function () {
        if (inst.miss) {
            return
        }
        if (inst.indTime < 0) {
            inst.miss = true;
            _ = Sounds.miss.play()
        }
    };
    inst.addComponent("PlayerTick", function () {
        this.tick = function () {
            if (inst.miss) {
                if (inst.indTime < 0) {
                    inst.indTime++
                }
                if (inst.indTime === 0) {
                    inst.indTime = 300;
                    if (inst.player_count > 0) {
                        inst.player_count--
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
                        entities.push(power_orb(inst.X, inst.Y, -22, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, 22, Math.min(4 - inst.Y * inst.pickLine, 0), "big"));
                        entities.push(power_orb(inst.X, inst.Y, -30, -inst.Y * inst.pickLine, "big"));
                        entities.push(power_orb(inst.X, inst.Y, 30, -inst.Y * inst.pickLine, "big"));
                    }
                    inst.X = 440;
                    inst.Y = 760;
                    clear_screen(function (entity) {
                        return entity.tags.has(Tags.hostile)
                    });
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
        const ctx = getLayer(0);
        const layer = getLayer(2);
        this.draw = function () {
            if (window.slow) {
                layer.save();
                layer.translate(inst.X, inst.Y);
                layer.fillStyle = "red";
                layer.shadowColor = "red";
                layer.shadowBlur = 3;
                layer.beginPath();
                layer.arc(0, 0, inst.hitBox.r + 1, 0, 2 * Math.PI);
                layer.closePath();
                layer.fill();
                layer.strokeStyle = "rgba(255,255,255,0.05)";
                layer.lineWidth = 1;
                layer.shadowColor = "white";
                layer.shadowBlur = 4;
                layer.beginPath();
                layer.arc(0, 0, inst.pickBox.r, 0, 2 * Math.PI);
                layer.stroke();
                layer.beginPath();
                layer.arc(0, 0, inst.pickBox.r - 2, 0, 2 * Math.PI);
                layer.stroke();
                // layer.save();
                // ro += L;
                // if (ro > 90 * L) {
                //     ro = 0
                // }
                // layer.rotate(ro);
                // layer.globalCompositeOperation = "lighter";
                // layer.drawImage(Images.ply_border_01, -32, -32);
                // layer.restore();
                layer.fillStyle = "white";
                layer.shadowColor = "white";
                layer.rotate(L * frames * 6);
                layer.fillRect(-inst.hitBox.r, -inst.hitBox.r, inst.hitBox.r * 2, inst.hitBox.r * 2);
                layer.restore();
            }
            if (inst.miss && inst.indTime < 0) {
                ctx.save();
                ctx.globalCompositeOperation = "source-atop";
                ctx.fillStyle = "rgba(255,0,10,0.5)";
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        }
    });
    return inst
}
