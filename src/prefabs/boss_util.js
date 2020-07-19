import Prefab from "../prefab.js";
import health from "../components/health.js";
import {getLayer, Tags, Images, Sounds, L, entities, eventListenerObject} from "../util.js";
import en_epBall from "./en_ep_ball.js";

let _;

const ctx = getLayer(1);
export default function BossUtil(x, y, cards) {
    const inst = new Prefab(x, y);
    inst.dieFrame = 0;
    inst.dead = false;
    let step = 0;
    let used = 0;
    eventListenerObject.addEventListener("bomb", function () {
        if (inst.card) {
            inst.card.cancelBonus()
        }
    });
    inst.addComponent("BossTick", function () {
        this.tick = function (inst) {
            if (inst.card) {
                if (inst.card.tick()) {
                    inst.card = null;
                    used++
                }
            } else {
                step++;
                if (cards[step]) {
                    inst.card = cards[step].start(inst)
                }
            }
            if (inst.tags.has(Tags.death)) {
                if (inst.components["health"].getValue() <= inst.components["health"].getMin()) {
                    if (inst.dieFrame > 0) {
                        if (inst.dieFrame > 60) {
                            if (inst.dieFrame % 6 === 0) {
                                Sounds.bombShoot.currentTime = 0;
                                _ = Sounds.bombShoot.play()
                            }
                            if (inst.dieFrame > 180) {
                                Sounds.en_ep_1.currentTime = 0;
                                _ = Sounds.en_ep_1.play();
                                inst.dead = true
                            }
                            entities.push(en_epBall(inst.X, inst.Y, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20))
                        }
                    } else if (inst.dieFrame === 0) {
                        Sounds.en_ep_2.currentTime = 0;
                        _ = Sounds.en_ep_2.play();
                    }
                    inst.dieFrame++
                } else {
                    if (inst.Y < -64) {
                        inst.dead = true
                    }
                    inst.Y -= 4
                }
            } else {
                inst.dieFrame = 0;
                if (inst.atkBox.isHit(inst.X, inst.Y, player.X, player.Y, player.hitBox)) {
                    if (player.indTime <= 0) {
                        player.die()
                    }
                }
                if (used === cards.length) {
                    inst.tags.add(Tags.death)
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
            if (inst.dieFrame > 0 && inst.dieFrame < 60) {
                ctx.drawImage(Images.bossEffect, inst.X - inst.dieFrame * 8, inst.Y - inst.dieFrame * 8, inst.dieFrame * 16, inst.dieFrame * 16)
            }
            if (inst.dieFrame > 120 && inst.dieFrame < 180) {
                ctx.drawImage(Images.bossEffect, inst.X - (inst.dieFrame - 120) * 8, inst.Y - (inst.dieFrame - 120) * 8, (inst.dieFrame - 120) * 16, (inst.dieFrame - 120) * 16)
            }
            if (inst.card) {
                inst.card.draw()
            }
        }
    });
    return inst
}
