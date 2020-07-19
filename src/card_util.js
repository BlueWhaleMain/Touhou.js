import {clearEntity, Tags, Sounds, getLayer, Images, entities} from "./util.js";
import greenOrb from "./prefabs/green_orb.js";
import Prefab from "./prefab.js";

let _;

const ctx = getLayer(0);
const ctx2 = getLayer(2);
export default function CardUtil(option) {
    let slowFrame = option.slowFrame || 0;
    let time = 0;
    let startFrame = option.startFrame || 0;
    let isEnd = false;
    let bonus = 0;
    let noCardFrame = option.noCardFrame || 0;
    let timeStr = "";
    this.isTimeSpell = option.isTimeSpell;
    this.isStart = false;
    this.isOpen = false;
    this.X = option.X || 440;
    this.Y = option.Y || 250;
    this.checkPOS = function () {
        if (this.entity.X > this.X) {
            this.entity.X -= 1
        }
        if (this.entity.X < this.X) {
            this.entity.X += 1
        }
        if (this.entity.Y > this.Y) {
            this.entity.Y -= 1
        }
        if (this.entity.Y < this.Y) {
            this.entity.Y += 1
        }
        if (Math.abs(this.entity.X - this.X) < 1) {
            this.entity.X = this.X
        }
        if (Math.abs(this.entity.Y - this.Y) < 1) {
            this.entity.Y = this.Y
        }
    };
    this.cancelBonus = function () {
        option.bonus = 0
    };
    this.open = function () {
        if (!this.isOpen) {
            if (option.noCard) {
                noCardFrame = 0;
                clearEntity(function (entity) {
                    if (entity.tags.has(Tags.hostile)) {
                        entities.push(greenOrb(entity.X, entity.Y, 0, -2, "small", true));
                        return true
                    }
                })
            }
            if (typeof option.open === "function") {
                option.open(this)
            }
            this.entity.showTexture = true;
            Sounds.cat0.currentTime = 0;
            _ = Sounds.cat0.play();
            startFrame = option.startFrame || 0;
            time = option.time;
            this.isOpen = true;
        }
    };
    this.tick = function () {
        if (startFrame > 0) {
            this.checkPOS();
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
            if (time <= 180) {
                Sounds.timeout1.currentTime = 0;
                _ = Sounds.timeout1.play()
            } else {
                if (time <= 600) {
                    this.entity.defendTime = false;
                    Sounds.timeout.currentTime = 0;
                    _ = Sounds.timeout.play()
                } else {
                    this.entity.defendTime = !!option.noCard;
                }
            }
        }
        if (noCardFrame > 0) {
            this.entity.defendTime = true;
            noCardFrame--;
            time = noCardFrame;
            if (option.noCard) {
                option.noCard(this)
            }
        } else {
            if (time >= 1) {
                time--;
                this.entity.components["health"].indestructible = false;
                if (this.entity.components["health"].getValue() <= this.entity.components["health"].getMin()) {
                    bonus = Math.floor(option.bonus * time / option.time);
                    time = 0;
                    if (typeof option.en_ep === "function") {
                        option.en_ep(this)
                    }
                } else if (option.card) {
                    this.checkPOS();
                    option.card(this)
                }
            } else {
                if (this.isOpen) {
                    if (this.isTimeSpell) {
                        bonus = option.bonus
                    }
                    if (!isEnd) {
                        window.score += bonus;
                        Sounds.cardGet.currentTime = 0;
                        _ = Sounds.cardGet.play();
                        isEnd = true
                    }
                    if (slowFrame > 0) {
                        slowFrame--
                    } else {
                        clearEntity(function (entity) {
                            if (entity.tags.has(Tags.hostile)) {
                                entities.push(greenOrb(entity.X, entity.Y, 0, -2, "small", true));
                                return true
                            }
                        });
                        if (option.end) {
                            option.end(this)
                        }
                        if (bonus > 0) {
                            Sounds.bonus.currentTime = 0;
                            _ = Sounds.bonus.play();
                            // if (typeof option.bonusCallback === "function") {
                            //     option.bonusCallback(this)
                            // }
                            entities.push(new Prefab().init(function (inst) {
                                const cache = document.createElement("canvas");
                                cache.width = 480;
                                cache.height = 84;
                                const cacheCtx = cache.getContext("2d");
                                cacheCtx.drawImage(Images.getSpellCardBonus, 0, 0);
                                cacheCtx.font = "20px sans-serif";
                                cacheCtx.fillStyle = "white";
                                cacheCtx.fillText(String(bonus), 200, 74, 480);
                                let opacity = 0;
                                inst.addComponent("tick", function () {
                                    let frame = 0;
                                    const self = {};
                                    self.tick = function (inst) {
                                        if (frame <= 60) {
                                            opacity = frame / 60
                                        }
                                        if (frame >= 180 && frame <= 300) {
                                            opacity = (300 - frame) / 120
                                        }
                                        if (frame > 300) {
                                            inst.tags.add(Tags.death)
                                        }
                                        frame++
                                    };
                                    return self
                                });
                                inst.addLayer("draw", function () {
                                    const self = {};
                                    self.draw = function () {
                                        ctx2.save();
                                        ctx2.globalAlpha = opacity;
                                        ctx2.drawImage(cache, 220, 280);
                                        ctx2.restore()
                                    };
                                    return self
                                })
                            }))
                        } else {
                            entities.push(new Prefab().init(function (inst) {
                                const cache = Images.BonusFailure.cloneNode(true);
                                let opacity = 0;
                                inst.addComponent("tick", function () {
                                    let frame = 0;
                                    const self = {};
                                    self.tick = function (inst) {
                                        if (frame <= 60) {
                                            opacity = frame / 60
                                        }
                                        if (frame >= 120 && frame <= 180) {
                                            opacity = (180 - frame) / 60
                                        }
                                        if (frame > 180) {
                                            inst.tags.add(Tags.death)
                                        }
                                        frame++
                                    };
                                    return self
                                });
                                inst.addLayer("draw", function () {
                                    const self = {};
                                    self.draw = function () {
                                        ctx2.save();
                                        ctx2.globalAlpha = opacity;
                                        ctx2.drawImage(cache, 300, 240);
                                        ctx2.restore()
                                    };
                                    return self
                                })
                            }))
                        }
                        return true
                    }
                } else {
                    this.open()
                }
            }
        }
    };
    this.draw = function () {
        if (startFrame <= 0) {
            ctx.save();
            ctx.translate(this.entity.X, this.entity.Y);
            ctx.rotate(time / 24);
            ctx.scale(time / option.time * 4, time / option.time * 4);
            ctx.drawImage(Images.enemyCircle, -128, -128);
            ctx.restore();
            ctx2.save();
            ctx2.fillStyle = "white";
            if (time !== 0 && time % 60 === 0) {
                if (time <= 180) {
                    ctx2.fillStyle = "red"
                } else {
                    if (time <= 600) {
                        ctx2.fillStyle = "orange"
                    }
                }
            }
            ctx2.font = "20px Comic Sans MS";
            ctx2.fillText(timeStr, 806, 38);
            ctx2.restore();
        }
        if (this.isOpen) {
            let layout = startFrame * 8;
            if (layout > 200) {
                layout = 200
            }
            ctx2.drawImage(Images.spellName, 570, 28 + layout * 3);
            ctx2.save();
            ctx2.font = "16px Comic Sans MS";
            ctx2.fillStyle = "white";
            ctx2.shadowColor = "black";
            ctx2.shadowBlur = 5;
            ctx2.fillText(option.name, 678, 58 + layout * 3);
            ctx2.font = "12px Comic Sans MS";
            let temp = Math.floor(option.bonus * time / option.time);
            if (temp > 0) {
                ctx2.fillText("Bonus " + temp, 650, 70 + layout * 3);
            } else {
                ctx2.fillText("Bonus failure", 650, 70 + layout * 3);
            }
            ctx2.restore();
        }
    };
    this.start = function (inst) {
        if (typeof option.start === "function") {
            option.start()
        }
        this.isStart = true;
        this.entity = inst;
        return this
    }
}
