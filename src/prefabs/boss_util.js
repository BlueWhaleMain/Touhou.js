import prefabs from "../prefabs.js";
import health from "../components/health.js";
import {getLayer, Tags, Images, Sounds, L, entities} from "../util.js";
import en_ep_ball from "./en_ep_ball.js";

let _;

const ctx = getLayer(1);
export default function boss_util() {
    const inst = new prefabs();
    inst.die_frame = 0;
    inst.dead = false;
    inst.addComponent("BossTick", function () {
        this.tick = function (inst) {
            if (inst.tags.has(Tags.death)) {
                if (inst.components["health"].getValue() <= inst.components["health"].getMin()) {
                    if (inst.die_frame > 0) {
                        if (inst.die_frame > 60) {
                            if (inst.die_frame % 6 === 0) {
                                Sounds.bomb_shoot.currentTime = 0;
                                _ = Sounds.bomb_shoot.play()
                            }
                            if (inst.die_frame > 180) {
                                Sounds.en_ep_1.currentTime = 0;
                                _ = Sounds.en_ep_1.play();
                                inst.dead = true
                            }
                            entities.push(en_ep_ball(inst.X, inst.Y, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20))
                        }
                    } else if (inst.die_frame === 0) {
                        Sounds.en_ep_2.currentTime = 0;
                        _ = Sounds.en_ep_2.play();
                    }
                    inst.die_frame++
                } else {
                    if (inst.Y < -64) {
                        inst.dead = true
                    }
                    inst.Y -= 4
                }
            } else {
                inst.die_frame = 0;
                if (inst.atkBox.isHit(inst.X, inst.Y, player.X, player.Y, player.hitBox)) {
                    if (player.indTime <= 0) {
                        player.die()
                    }
                }
            }
        }
    });
    inst.addLayer("BossBar", function () {
        this.draw = function (inst) {
            ctx.save();
            ctx.translate(inst.X, inst.Y);
            ctx.rotate(-90 * L);
            ctx.strokeStyle = "rgba(171,0,1,0.81)";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            ctx.strokeStyle = "rgb(255,255,255)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 100, Math.PI * 2, Math.PI * 2 * (1 - (inst.components["health"].getValue() / inst.components["health"].getMax())), true);
            ctx.stroke();
            ctx.restore();
            if (inst.die_frame > 0 && inst.die_frame < 60) {
                ctx.drawImage(Images.boss_effect_01, inst.X - inst.die_frame * 8, inst.Y - inst.die_frame * 8, inst.die_frame * 16, inst.die_frame * 16)
            }
            if (inst.die_frame > 120 && inst.die_frame < 180) {
                ctx.drawImage(Images.boss_effect_01, inst.X - (inst.die_frame - 120) * 8, inst.Y - (inst.die_frame - 120) * 8, (inst.die_frame - 120) * 16, (inst.die_frame - 120) * 16)
            }
        }
    });
    return inst
}
