import Prefab from "../prefab.js";
import health from "../components/health.js";
import {
    getLayer,
    TAGS,
    session,
    L,
    entities,
    EVENT_MAPPING, newImage, resources, newAudio, LAYER_MAPPING
} from "../util.js";
import EnEpBall from "./en_ep_ball.js";
import GreenOrb from "./green_orb.js";
import {ob} from "../observer.js"

let _;
const bossEffect = newImage(resources.Images["bossEffect"]);
const soundOfDamage = newAudio(resources.Sounds["damage"]);
const soundOfDamage1 = newAudio(resources.Sounds["damage1"]);
const soundOfEnEp1 = newAudio(resources.Sounds["en_ep_1"]);
const soundOfEnEp2 = newAudio(resources.Sounds["en_ep_2"]);
const soundOfBombShoot = newAudio(resources.Sounds["bombShoot"]);
const layerUI = getLayer(LAYER_MAPPING.UI);
export default function BossUtil(x, y, blood, cards, dialogue) {
    const inst = new Prefab(x, y);
    inst.dieFrame = 0;
    inst.dead = false;
    inst.loaded = false;
    inst.callback = {};
    let healthDeltaMax = 80;
    inst.target = {
        X: x, Y: y
    };
    inst.checkPOS = function (d = inst.maxMovementSpeed || 1) {
        if (inst.X > inst.target.X) {
            let speed = (inst.X - inst.target.X) / 5;
            if (speed > d) {
                speed = d
            }
            inst.X -= speed
        }
        if (inst.X < inst.target.X) {
            let speed = (inst.target.X - inst.X) / 5;
            if (speed > d) {
                speed = d
            }
            inst.X += speed
        }
        if (inst.Y > inst.target.Y) {
            let speed = (inst.Y - inst.target.Y) / 5;
            if (speed > d) {
                speed = d
            }
            inst.Y -= speed
        }
        if (inst.Y < inst.target.Y) {
            let speed = (inst.target.Y - inst.Y) / 5;
            if (speed > d) {
                speed = d
            }
            inst.Y += speed
        }
        if (Math.abs(inst.X - inst.target.X) < 1) {
            inst.X = inst.target.X
        }
        if (Math.abs(inst.Y - inst.target.Y) < 1) {
            inst.Y = inst.target.Y
        }
    };
    inst.addComponent("health", health);
    inst.components["health"].indestructible = true;
    inst.components["health"].init(blood, blood, 1);
    inst.components["health"].callback.doDelta = function (val, value) {
        healthDeltaMax -= val;
        if (healthDeltaMax < 0 || inst.tags.has(TAGS.death)) {
            return false
        }
        if (value / blood < 0.05) {
            soundOfDamage1.currentTime = 0;
            _ = soundOfDamage1.play()
        } else if (value / blood < 0.1) {
            soundOfDamage.currentTime = 0;
            _ = soundOfDamage.play()
        }
    };
    let step = 0;
    let used = 0;

    function cancelBonus() {
        if (inst.card) {
            inst.card.cancelBonus();
            if (session.practice) {
                inst.card.failure()
            }
        }
    }

    function reflex() {
        cancelBonus();
        inst.components["health"].doDelta(-100)
    }

    function hurt(e) {
        if (e.detail && e.detail.isPlayer) {
            inst.components["health"].doDelta(-100)
        }
    }

    function load(e) {
        if (inst.tags.has(TAGS.death)) {
            ob.removeEventListener(e.type, load);
            ob.removeEventListener(EVENT_MAPPING.bomb, cancelBonus);
            ob.removeEventListener(EVENT_MAPPING.miss, reflex);
            ob.removeEventListener(EVENT_MAPPING.clearEntity, hurt);
        }
    }

    ob.addEventListener(EVENT_MAPPING.bomb, cancelBonus);
    ob.addEventListener(EVENT_MAPPING.miss, reflex);
    ob.addEventListener(EVENT_MAPPING.clearEntity, hurt);
    ob.addEventListener(EVENT_MAPPING.load, load);
    let textureLayout = -50;
    let textureOpacity = 0.6;
    let layout = 0.02;
    inst.addComponent("BossTick", function () {
        this.tick = function (inst) {
            if (session.stage.dialogueScript.length > 0) {
                inst.checkPOS(10);
                return
            }
            if (inst.loaded === false) {
                inst.loaded = true;
                if (dialogue) {
                    while (dialogue.length > 0) {
                        const d = dialogue.shift();
                        d.entity = inst;
                        session.stage.dialogueScript.push(d)
                    }
                }
                if (typeof inst.callback.load === "function") {
                    inst.callback.load()
                }
                ob.dispatchEvent(EVENT_MAPPING.bossInit);
                return
            }
            if (inst.card) {
                if (inst.card.tick()) {
                    inst.card = null;
                    used++
                }
            } else {
                if (cards[step]) {
                    inst.components["health"].init(blood, blood, 1);
                    inst.card = cards[step].start(inst)
                }
                step++
            }
            if (inst.tags.has(TAGS.death)) {
                if (inst.components["health"].getValue() <= inst.components["health"].getMin()) {
                    if (inst.dieFrame > 0) {
                        if (inst.dieFrame > 60) {
                            if (inst.dieFrame % 6 === 0) {
                                soundOfBombShoot.currentTime = 0;
                                _ = soundOfBombShoot.play()
                            }
                            if (inst.dieFrame > 180) {
                                soundOfEnEp1.currentTime = 0;
                                _ = soundOfEnEp1.play();
                                inst.dead = true;
                                entities.push(GreenOrb(inst.X, inst.Y, 0, -2))
                            }
                            entities.push(EnEpBall(inst.X, inst.Y, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10))
                        }
                    } else if (inst.dieFrame === 0) {
                        soundOfEnEp2.currentTime = 0;
                        _ = soundOfEnEp2.play();
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
                healthDeltaMax = 80;
                if (inst.showTexture) {
                    textureLayout += 1.5;
                    textureOpacity += layout;
                    if (textureOpacity > 1 && textureLayout > 120) {
                        textureOpacity = 1;
                        layout = -0.01
                    } else if (textureOpacity <= 0) {
                        textureOpacity = 0.6;
                        textureLayout = -50;
                        layout = 0.02;
                        inst.showTexture = null
                    }
                }
                if (inst.atkBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.hitBox) && !inst.hide) {
                    if (session.player.indTime <= 0) {
                        session.player.die()
                    }
                }
                if (used >= cards.length) {
                    inst.tags.add(TAGS.death)
                }
            }
        }
    });
    inst.addLayer("BossBar", function () {
        this.draw = function (inst) {
            layerUI.save();
            layerUI.translate(inst.X, inst.Y);
            layerUI.rotate(-90 * L);
            layerUI.strokeStyle = "rgba(171,0,1,0.81)";
            layerUI.lineWidth = 6;
            layerUI.beginPath();
            layerUI.arc(0, 0, 60, 0, Math.PI * 2);
            layerUI.closePath();
            layerUI.stroke();
            layerUI.strokeStyle = "rgb(255,255,255)";
            layerUI.lineWidth = 3;
            layerUI.beginPath();
            layerUI.arc(0, 0, 60, Math.PI * 2, Math.PI * 2 * (1 - (inst.components["health"].getValue() / inst.components["health"].getMax())), true);
            layerUI.stroke();
            if (inst.card && inst.card.option.noCardFrame > 0) {
                layerUI.beginPath();
                layerUI.lineWidth = 5;
                layerUI.strokeStyle = "rgba(113,0,255,0.81)";
                layerUI.arc(0, 0, 60, -46 * L, -43 * L);
                layerUI.stroke();
            }
            layerUI.restore();
            if (inst.dieFrame > 0 && inst.dieFrame < 60) {
                layerUI.drawImage(bossEffect, inst.X - inst.dieFrame * 8, inst.Y - inst.dieFrame * 8, inst.dieFrame * 16, inst.dieFrame * 16)
            }
            if (inst.dieFrame > 120 && inst.dieFrame < 180) {
                layerUI.drawImage(bossEffect, inst.X - (inst.dieFrame - 120) * 8, inst.Y - (inst.dieFrame - 120) * 8, (inst.dieFrame - 120) * 16, (inst.dieFrame - 120) * 16)
            }
            if (inst.card) {
                inst.card.draw()
            }
            if (inst.showTexture) {
                layerUI.save();
                layerUI.globalAlpha = textureOpacity;
                layerUI.drawImage(inst.texture, 125, textureLayout, 286, 373);
                layerUI.restore()
            }
        }
    });
    inst.playBGM = function () {
        if (session.currentBGM) {
            session.currentBGM.dom.pause();
            if (session.currentBGM.loop) {
                session.currentBGM.loop.pause()
            }
        }
        inst.bgm.currentTime = 0;
        session.currentBGM = {
            dom: inst.bgm,
            loop: inst.loop,
            leaveTime: inst.leaveTime,
            loopTime: inst.loopTime,
            name: inst.bgmName
        };
        ob.dispatchEvent(EVENT_MAPPING.changeBGM)
    };
    return inst
}

export function isStopped() {
    return soundOfEnEp1.paused && soundOfEnEp2.paused
}
