import {clear_screen, Tags, Sounds, getLayer, Images, entities} from "./util.js";
import green_orb from "./prefabs/green_orb.js";
import prefabs from "./prefabs.js";

let _;

const ctx = getLayer(2);
export default function card_util(option) {
    let slow_frame = option.slow_frame || 0;
    let time = 0;
    let start_frame = option.start_frame || 0;
    let isEnd = false;
    let bonus = 0;
    let noCardFrame = option.noCardFrame || 0;
    let timeStr = "";
    this.isTimeSpell = option.isTimeSpell;
    this.isStart = false;
    this.isOpen = false;
    this.X = option.X || 440;
    this.Y = option.Y || 300;
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
    this.open = function () {
        if (!this.isOpen) {
            if (option.noCard) {
                noCardFrame = 0;
                clear_screen(function (entity) {
                    if (entity.tags.has(Tags.hostile)) {
                        entities.push(green_orb(entity.X, entity.Y, 0, -2, "small", true));
                        return true
                    }
                });
                this.drop()
            }
            Sounds.cat0.currentTime = 0;
            _ = Sounds.cat0.play();
            start_frame = option.start_frame || 0;
            time = option.time;
            this.isOpen = true;
        }
    };
    this.tick = function () {
        ctx.drawImage(Images.spell_name, 570, 28);
        ctx.save();
        ctx.font = "16px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillText(option.name, 678, 58);
        ctx.restore();
        if (start_frame > 0) {
            this.checkPOS();
            if (this.entity.components["health"]) {
                this.entity.components["health"].indestructible = true
            }
            start_frame--;
            return
        }
        timeStr = Math.min(Math.floor(time / 60), 99);
        if (timeStr.toString().length < 2) {
            timeStr = "0" + timeStr
        }
        ctx.save();
        ctx.fillStyle = "white";
        if (time !== 0 && time % 60 === 0) {
            if (time <= 180) {
                ctx.fillStyle = "red";
                Sounds.timeout1.currentTime = 0;
                _ = Sounds.timeout1.play()
            } else {
                if (time <= 600) {
                    this.entity.defendTime = false;
                    ctx.fillStyle = "orange";
                    Sounds.timeout.currentTime = 0;
                    _ = Sounds.timeout.play()
                } else {
                    this.entity.defendTime = !!option.noCard;
                }
            }
        }
        ctx.font = "20px Comic Sans MS";
        ctx.fillText(timeStr, 806, 38);
        ctx.restore();
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
                        Sounds.card_get.currentTime = 0;
                        _ = Sounds.card_get.play();
                        isEnd = true
                    }
                    if (slow_frame > 0) {
                        slow_frame--
                    } else {
                        clear_screen(function (entity) {
                            if (entity.tags.has(Tags.hostile)) {
                                entities.push(green_orb(entity.X, entity.Y, 0, -2, "small", true));
                                return true
                            }
                        });
                        if (option.end) {
                            option.end(this)
                        }
                        if (bonus > 0) {
                            Sounds.bonus.currentTime = 0;
                            _ = Sounds.bonus.play();
                            if (typeof option.bonus_callback === "function") {
                                option.bonus_callback(this)
                            }
                            entities.push(new prefabs().init(function (inst) {
                                const cache = document.createElement("canvas");
                                cache.width = 480;
                                cache.height = 84;
                                const cache_ctx = cache.getContext("2d");
                                cache_ctx.drawImage(Images.img_bonus_01, 0, 0);
                                cache_ctx.font = "20px sans-serif";
                                cache_ctx.fillStyle = "white";
                                cache_ctx.fillText(String(bonus), 200, 74, 480);
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
                                    this.draw = function () {
                                        ctx.save();
                                        ctx.globalAlpha = opacity;
                                        ctx.drawImage(cache, 220, 280);
                                        ctx.restore()
                                    }
                                })
                            }))
                        } else {
                            entities.push(new prefabs().init(function (inst) {
                                const cache = Images.img_bonus_02.cloneNode(true);
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
                                    this.draw = function () {
                                        ctx.save();
                                        ctx.globalAlpha = opacity;
                                        ctx.drawImage(cache, 300, 240);
                                        ctx.restore()
                                    }
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
    this.start = function (inst) {
        if (typeof option.start === "function") {
            option.start()
        }
        this.isStart = true;
        this.entity = inst;
        return this
    }
}
