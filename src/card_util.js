import {clear_screen, Tags, Sounds, getLayer, Images, entities} from "./util.js";
import green_orb from "./prefabs/green_orb.js";

let _;

export default function card_util(option) {
    let slow_frame = option.slow_frame || 0;
    let time = 0;//Frame
    let start_frame = option.start_frame || 0;
    let isEnd = false;
    let bonus = 0;
    let noCardFrame = option.noCardFrame || 0;
    // let dropBlueCount = option.dropBlueCount || 0;
    // let dropPowerCount = option.dropPowerCount || 0;
    let timeStr = "";
    this.isTimeSpell = option.isTimeSpell;
    this.isStart = false;
    this.isOpen = false;
    this.X = 440;
    this.Y = 300;
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
    this.drop = function () {
        // SPAWN.BLUE_ORB(new POS(this.entity.X, this.entity.Y), new POS(0, -5));
        // for (let i = 0; i < dropBlueCount / 4; i++) {
        //     SPAWN.BLUE_ORB(new POS(this.entity.X + Math.random() * 80, this.entity.Y + Math.random() * 80), new POS(0, -10));
        //     SPAWN.BLUE_ORB(new POS(this.entity.X - Math.random() * 80, this.entity.Y - Math.random() * 80), new POS(0, -10));
        //     SPAWN.BLUE_ORB(new POS(this.entity.X + Math.random() * 80, this.entity.Y - Math.random() * 80), new POS(0, -10));
        //     SPAWN.BLUE_ORB(new POS(this.entity.X - Math.random() * 80, this.entity.Y + Math.random() * 80), new POS(0, -10));
        // }
        // for (let i = 0; i < dropPowerCount / 4; i++) {
        //     SPAWN.POWER_ORB(new POS(this.entity.X + Math.random() * 80, this.entity.Y + Math.random() * 80), new POS(0, -10), true);
        //     SPAWN.POWER_ORB(new POS(this.entity.X - Math.random() * 80, this.entity.Y - Math.random() * 80), new POS(0, -10), true);
        //     SPAWN.POWER_ORB(new POS(this.entity.X + Math.random() * 80, this.entity.Y - Math.random() * 80), new POS(0, -10), true);
        //     SPAWN.POWER_ORB(new POS(this.entity.X - Math.random() * 80, this.entity.Y + Math.random() * 80), new POS(0, -10), true);
        // }
        // SPAWN.POWER_ORB(new POS(this.entity.X, this.entity.Y), new POS(0, -5), false);
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
    this.en_ep = function () {
        Sounds.bonus.currentTime = 0;
        _ = Sounds.bonus.play();
        bonus = Math.floor(option.bonus * time / option.time);
        time = 0
    };
    const ctx = getLayer(2);
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
                this.checkPOS();
                this.entity.components["health"].indestructible = false;
                if (this.entity.components["health"].getValue() <= this.entity.components["health"].getMin()) {
                    this.en_ep()
                }
                if (option.card) {
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
                        // screen_draw.save();
                        // if (bonus > 0) {
                        //     TOUHOU_CONFIG.RESOURCES.AUDIO.Bonus.currentTime = 0;
                        //     t = TOUHOU_CONFIG.RESOURCES.AUDIO.Bonus.play();
                        //     this.drop();
                        //     if (option.bonus_callback) {
                        //         option.bonus_callback(this)
                        //     }
                        //     methods.push(new DrawFont(120, function () {
                        //         screen_draw.font = "25px sans-serif";
                        //         screen_draw.fillStyle = "rgb(67,160,255)";
                        //         screen_draw.fillText("Get SpellCard Bonus!!", 250, 250);
                        //         screen_draw.font = "20px sans-serif";
                        //         screen_draw.fillText(String(bonus), 350, 300);
                        //     }));
                        // } else {
                        //     methods.push(new DrawFont(120, function () {
                        //         screen_draw.font = "30px sans-serif";
                        //         screen_draw.fillStyle = "rgb(98,98,98)";
                        //         screen_draw.fillText("Bonus failed...", 250, 300);
                        //     }));
                        // }
                        // screen_draw.restore();
                        return true
                    }
                } else {
                    this.open()
                }
            }
        }
    };
    this.start = function (inst) {
        if (option.start) {
            option.start()
        }
        this.isStart = true;
        this.entity = inst;
        return this
    }
}
