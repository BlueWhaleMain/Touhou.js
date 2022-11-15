import {
    session,
    entities,
    EVENT_MAPPING
} from "./util.js";
import {ob} from "./observer.js"
import {title} from "./dialogue.js";
import BlueOrb from "./prefabs/blue_orb.js";
import PowerOrb from "./prefabs/power_orb.js";
import {generateRandomSpeed} from "./components/movable.js";
import {newImage} from "./resources/images";
import {newAudio} from "./resources/sounds";
import {resources} from "./resources/manager";
import {getLayer, LAYER_MAPPING} from "./layers/manager";

let _;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
const bonusFailure = newImage(resources.Images.bonusFailure);
const getSpellCardBonus = newImage(resources.Images.getSpellCardBonus);
const enemyCircle = newImage(resources.Images.enemyCircle);
const spellName = newImage(resources.Images.spellName);
const soundOfTimeOut = newAudio(resources.Sounds.timeout);
const soundOfTimeOut1 = newAudio(resources.Sounds.timeout1);
const soundOfCardGet = newAudio(resources.Sounds.cardGet);
const soundOfBonus = newAudio(resources.Sounds.bonus);
const soundOfCat0 = newAudio(resources.Sounds.cat0);
export default function CardUtil(option) {
    let slowFrame = option.slowFrame || 0;
    let time = 0;
    let startFrame = option.startFrame || 0;
    let isEnd = false;
    let bonus = option.bonus;
    let noCardFrame = option.noCardFrame || 0;
    let timeStr = "";
    const bonusMax = option.bonus;
    this.option = option;
    this.isTimeSpell = option.isTimeSpell;
    this.isOpen = false;
    this.cancelBonus = function () {
        if (this.isOpen) {
            option.bonus = 0
        }
    };
    this.open = function () {
        if (!this.isOpen) {
            if (option.practice) {
                session.practice = true
            }
            if (this.isTimeSpell) {
                if (this.entity.components["health"]) {
                    this.entity.components["health"].indestructible = true;
                }
                this.entity.hide = true
            }
            if (option.noCard) {
                noCardFrame = 0;
                this.entity.components["health"].init(this.entity.components["health"].getMax(),
                    this.entity.components["health"].getMax() * 8, 1);
                ob.dispatchEvent(EVENT_MAPPING.cardEnEp)
            }
            if (typeof option.open === "function") {
                option.open(this)
            }
            this.entity.target.X = option.X || 220;
            this.entity.target.Y = option.Y || 125;
            this.entity.showTexture = true;
            soundOfCat0.currentTime = 0;
            _ = soundOfCat0.play();
            startFrame = option.startFrame || 0;
            time = option.time;
            this.isOpen = true;
        }
    };
    this.tick = function () {
        if (startFrame > 0) {
            this.entity.checkPOS(startFrame / 12);
            if (this.entity.components["health"]) {
                this.entity.components["health"].indestructible = true
            }
            startFrame--;
            return
        }
        timeStr = Math.min(Math.floor(time / 60), 99);
        if (timeStr.toString().length < 2) {
            timeStr = "0" + timeStr
        }
        if (time !== 0 && time % 60 === 0) {
            // entities.push(Player1Bomb(this.entity.X, this.entity.Y, 0, -2));
            // entities.push(Player1Up(this.entity.X, this.entity.Y, 0, -2));
            if (time <= 180) {
                soundOfTimeOut1.currentTime = 0;
                _ = soundOfTimeOut1.play()
            } else {
                if (time <= 600) {
                    this.entity.defendTime = false;
                    soundOfTimeOut.currentTime = 0;
                    _ = soundOfTimeOut.play()
                } else {
                    this.entity.defendTime = !!option.noCard;
                }
            }
        }
        if (noCardFrame > 0) {
            this.entity.components["health"].indestructible = false;
            session.practice = false;
            noCardFrame--;
            time = noCardFrame;
            if (typeof option.noCard === "function") {
                this.entity.checkPOS();
                option.noCard(this, time)
            }
            if (this.entity.components["health"].getValue() <= this.entity.components["health"].getMax() / 8) {
                this.open()
            }
        } else {
            if (time >= 1) {
                time--;
                this.entity.components["health"].indestructible = this.isTimeSpell && this.isOpen;
                if (this.entity.components["health"].getValue() <= this.entity.components["health"].getMin()) {
                    time = 0;
                    if (typeof option.enEp === "function") {
                        option.enEp(this)
                    }
                } else if (typeof option.card === "function") {
                    this.entity.checkPOS();
                    if (option.delay > 0) {
                        if (this.entity.components["health"]) {
                            this.entity.components["health"].indestructible = true
                        }
                        option.delay--
                    } else {
                        if (this.isTimeSpell) {
                            bonus = option.bonus
                        } else {
                            // if (session.player.Y - GUI_SCREEN.Y >= (1 - session.player.pickLine) * GUI_SCREEN.HEIGHT) {
                            //     bonus -= 100
                            // } else {
                            //     bonus += 1000
                            // }
                            // 符卡分最大值÷（符卡总时间-300f）x0.75
                            if (time < option.time - 300) {
                                bonus -= ~~(bonusMax / (option.time - 300) * 0.75);
                            }
                            if (bonus > bonusMax) {
                                bonus = bonusMax
                            } else if (bonus < 0) {
                                bonus = 0
                            }
                            if (bonus > option.bonus) {
                                bonus = option.bonus
                            }
                        }
                        option.card(this, time)
                    }
                }
            } else {
                if (this.isOpen) {
                    if (this.isTimeSpell) {
                        this.entity.components["health"].init(this.entity.components["health"].getMin(),
                            this.entity.components["health"].getMax(), 1);
                        bonus = option.bonus
                    } else {
                        if (this.entity.components["health"].getValue() > this.entity.components["health"].getMin()) {
                            bonus = 0
                        }
                    }
                    if (!isEnd) {
                        session.score += bonus;
                        soundOfCardGet.currentTime = 0;
                        _ = soundOfCardGet.play();
                        isEnd = true
                    }
                    if (slowFrame > 0) {
                        if (slowFrame % 2 === 0) {
                            session.slowRunning = true;
                        }
                        slowFrame--
                    } else {
                        session.practice = false;
                        this.entity.hide = false;
                        ob.dispatchEvent(EVENT_MAPPING.cardEnEp);
                        if (option.end) {
                            option.end(this)
                        }
                        let spawnPoint;
                        if (bonus > 0) {
                            for (let i = 0; i < 50; i++) {
                                spawnPoint = generateRandomSpeed(100, 50, -50, undefined, undefined, undefined, 20);
                                entities.push(BlueOrb(this.entity.X + spawnPoint[0],
                                    this.entity.Y + spawnPoint[1], 0, -2))
                            }
                            soundOfBonus.currentTime = 0;
                            _ = soundOfBonus.play();
                            // if (typeof option.bonusCallback === "function") {
                            //     option.bonusCallback(this)
                            // }
                            entities.push(title(function () {
                                const self = {};
                                const cache = document.createElement("canvas");
                                cache.width = 240;
                                cache.height = 42;
                                const cacheCtx = cache.getContext("2d");
                                cacheCtx.drawImage(getSpellCardBonus, 0, 0, 240, 32);
                                cacheCtx.font = "10px sans-serif";
                                cacheCtx.fillStyle = "white";
                                cacheCtx.fillText(String(bonus), 100, 37, 240);
                                self.draw = function (self) {
                                    layerTitle.save();
                                    layerTitle.globalAlpha = self.opacity;
                                    layerTitle.drawImage(cache, 110, 140);
                                    layerTitle.restore()
                                };
                                return self
                            }))
                        } else {
                            entities.push(title(function () {
                                const self = {};
                                const cache = document.createElement("canvas");
                                cache.width = 144;
                                cache.height = 32;
                                const cacheCtx = cache.getContext("2d");
                                cacheCtx.drawImage(bonusFailure, 0, 0, 144, 32);
                                self.draw = function (self) {
                                    layerTitle.save();
                                    layerTitle.globalAlpha = self.opacity;
                                    layerTitle.drawImage(cache, 150, 120);
                                    layerTitle.restore()
                                };
                                return self
                            }))
                        }
                        for (let i = 0; i < 5; i++) {
                            spawnPoint = generateRandomSpeed(100, 50, -50, undefined, undefined, undefined, 20);
                            entities.push(PowerOrb(this.entity.X + spawnPoint[0],
                                this.entity.Y + spawnPoint[1], 0, -2))
                        }
                        spawnPoint = generateRandomSpeed(50, 25, -25);
                        entities.push(PowerOrb(this.entity.X + spawnPoint[0],
                            this.entity.Y + spawnPoint[1], 0, -2, "big"));
                        this.entity.components["health"].indestructible = false;
                        return true
                    }
                } else {
                    this.open()
                }
            }
        }
    };
    this.getTime = function () {
        return time
    };
    this.draw = function () {
        if (startFrame <= 0) {
            if (typeof option.borderDraw === "function") {
                option.borderDraw(this.entity, time, option.time)
            } else {
                layerStage.save();
                layerStage.translate(this.entity.X, this.entity.Y);
                layerStage.rotate(time / 24);
                layerStage.scale(time / option.time * 2, time / option.time * 2);
                layerStage.drawImage(enemyCircle, -128, -128);
                layerStage.restore();
            }
            layerTitle.save();
            layerTitle.fillStyle = "white";
            if (time !== 0) {
                if (time <= 180) {
                    layerTitle.fillStyle = "red"
                } else {
                    if (time <= 600) {
                        layerTitle.fillStyle = "orange"
                    }
                }
            }
            layerTitle.font = "10px Comic Sans MS";
            layerTitle.fillText(timeStr, 403, 19);
            layerTitle.restore();
        }
        if (this.isOpen) {
            let layout = startFrame * 8;
            if (layout > 100) {
                layout = 100
            }
            layerTitle.drawImage(spellName, 160, layout * 3);
            layerTitle.save();
            layerTitle.font = "10px Comic Sans MS";
            layerTitle.fillStyle = "white";
            layerTitle.shadowColor = "black";
            layerTitle.shadowBlur = 5;
            layerTitle.direction = "rtl";
            layerTitle.fillText(option.name, 410, 29 + layout * 3);
            layerTitle.font = "8px Comic Sans MS";
            if (bonus > 0) {
                layerTitle.fillText("Bonus " + bonus, 410, 40 + layout * 3);
            } else {
                layerTitle.fillText("Bonus failure", 410, 40 + layout * 3);
            }
            layerTitle.restore();
        }
    };
    this.start = function (inst) {
        if (typeof option.start === "function") {
            option.start()
        }
        this.entity = inst;
        inst.target.X = option.X || 220;
        inst.target.Y = option.Y || 125;
        return this
    };
    this.failure = function () {
        time = 0
    };
}
