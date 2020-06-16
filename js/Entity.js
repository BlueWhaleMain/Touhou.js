"use strict";

class POS {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.reset = function () {
            this.x = x;
            this.y = y;
        }
    }

    reset() {
    }

    static arrowTo(from, to, speed) {
        const s = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        let x_speed = (to.x - from.x) / s * speed, y_speed = (to.y - from.y) / s * speed;
        if (x_speed && y_speed) {
            return new POS(x_speed, y_speed)
        } else {
            return new POS(speed, speed)
        }
    }

    static transTo(from, angle) {
        return new POS(from.x * Math.cos(angle) + from.y * Math.sin(angle), from.y * Math.cos(angle) - from.x * Math.sin(angle))
    }
}

class RBox {
    xs;
    ys;
    TYPE = "R";

    constructor(xs, ys) {
        this.xs = xs;
        this.ys = ys;
    }

    isHit(x, y, pos, hitBox) {
        switch (hitBox.TYPE) {
            case "A":
                const xx = pos.x - x, yy = pos.y - y, minX = Math.min(xx, this.xs / 2),
                    maxX = Math.max(minX, -this.xs / 2),
                    minY = Math.min(yy, this.ys / 2), maxY = Math.max(minY, -this.ys / 2);
                return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= hitBox.r * hitBox.r;
            case "R":
                const width1 = this.xs, height1 = this.ys, width2 = hitBox.xs, height2 = hitBox.ys;
                let flag;
                if (this.xs >= hitBox.xs && hitBox.xs <= this.xs - width1 / 2 - width2 / 2) {
                    flag = false;
                } else if (this.xs <= hitBox.xs && hitBox.xs >= this.xs + width1 / 2 + width2 / 2) {
                    flag = false;
                } else if (this.ys >= hitBox.ys && hitBox.ys <= this.ys - height1 / 2 - height2 / 2) {
                    flag = false;
                } else flag = !(this.ys <= hitBox.ys && hitBox.ys >= this.ys + height1 / 2 + height2 / 2);
                return flag;
        }
    }

    isOut(x, y, x_max, y_max, speed) {
        return x + this.xs * 2 < 0 && speed.x <= 0 || y + this.ys * 2 < 0 && speed.y <= 0
            || x > x_max && speed.x > 0 || y > y_max && speed.y > 0
    }

    isOutScreen(x, y, x_max, y_max, speed) {
        return x + this.xs * 2 < -2 * this.xs - 10 && speed.x <= 0 || y + this.ys * 2 < -2 * this.ys - 10 && speed.y <= 0
            || x > x_max + 2 * this.xs + 10 && speed.x > 0 || y > y_max + 2 * this.ys + 10 && speed.y > 0
    }
}

class ABox {
    r;
    TYPE = "A";

    isHit(x, y, pos, hitBox) {
        if (hitBox.TYPE === "A") {
            return Math.pow(this.r + hitBox.r, 2) > Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2);
        }
    }

    isOut(x, y, x_max, y_max, speed) {
        return x - this.r < 0 && speed.x <= 0 || x + this.r > x_max && speed.x > 0
            || y - this.r < 0 && speed.y <= 0 || y + this.r > y_max && speed.y > 0
    }

    isOutScreen(x, y, x_max, y_max, speed) {
        return x - this.r < -2 * this.r - 10 && speed.x <= 0 || x + this.r > x_max + 2 * this.r + 10 && speed.x > 0
            || y - this.r < -2 * this.r - 10 && speed.y <= 0 || y + this.r > y_max + 2 * this.r + 10 && speed.y > 0
    }

    inScreen(pos, x_max, y_max) {
        if (pos.x - this.r < 0) {
            pos.x = this.r;
        } else if (pos.x + this.r > x_max) {
            pos.x = x_max - this.r;
        }
        if (pos.y - this.r < 0) {
            pos.y = this.r;
        } else if (pos.y + this.r > y_max) {
            pos.y = y_max - this.r;
        }
    }

    constructor(r) {
        this.r = r;
    }
}

class Entity {
    POS;
    speed;
    alive;
    option;
    screen_draw;
    sizeBox;
    drawPOS;

    default = {
        type: undefined,
        alive: false,
        speed: new POS(0, 0),
        POS: new POS(0, 0),
        sizeBox: undefined,
        drawPOS: undefined,
        tick: undefined,
        draw: undefined
    };

    constructor(option = this.default) {
        this.type = option.type;
        this.alive = true;
        this.speed = option.speed;
        this.options = option;
        this.POS = option.POS;
        this.sizeBox = option.sizeBox;
        this.drawPOS = option.drawPOS;
        if (option.done) {
            option.done();
        }
    }

    run() {
        this.POS.x += this.speed.x;
        this.POS.y += this.speed.y;
        if (this.option.tick) {
            this.option.tick(this);
        }
        if (!this.alive) {
            return false;
        }
        if (this.option.draw) {
            this.screen_draw.save();
            this.screen_draw.translate(this.POS.x, this.POS.y);
            this.option.draw(this);
            this.screen_draw.restore();
        }
        return true;
    }

    die() {
        this.alive = false;
        if (this.option.die) {
            this.option.die(this);
        }
    }
}

function SpellCard(option) {
    let slow_frame = option.slow_frame || 0;
    let time = 0;//Frame
    let start_frame = option.start_frame || 0;
    let isEnd = false;
    let bonus = 0;
    let noCardFrame = option.noCardFrame || 0;
    let dropBlueCount = option.dropBlueCount || 12;
    let dropPowerCount = option.dropPowerCount || 12;
    this.isTimeSpell = option.isTimeSpell;
    this.POS = option.POS;
    if (!this.POS) {
        this.POS = new POS(384, 432)
    }
    this.entity = option.entity;
    PLAYER.IS_SPELL = true;
    this.isStart = false;
    this.isOpen = false;
    this.checkPOS = function () {
        if (this.entity.POS.x > 384) {
            this.entity.POS.x -= 1
        }
        if (this.entity.POS.x < 384) {
            this.entity.POS.x += 1
        }
        if (this.entity.POS.y > 332) {
            this.entity.POS.y -= 1
        }
        if (this.entity.POS.y < 332) {
            this.entity.POS.y += 1
        }
        if (Math.abs(this.entity.POS.x - 384) < 1) {
            this.entity.POS.x = 384
        }
        if (Math.abs(this.entity.POS.y - 332) < 1) {
            this.entity.POS.y = 332
        }
    };
    this.drop = function () {
        SPAWN.BLUE_ORB(new POS(this.entity.POS.x, this.entity.POS.y), new POS(0, -5));
        for (let i = 0; i < dropBlueCount / 4; i++) {
            SPAWN.BLUE_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10));
            SPAWN.BLUE_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10));
            SPAWN.BLUE_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10));
            SPAWN.BLUE_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10));
        }
        for (let i = 0; i < dropPowerCount / 4; i++) {
            SPAWN.POWER_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10), true);
            SPAWN.POWER_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10), true);
            SPAWN.POWER_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10), true);
            SPAWN.POWER_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10), true);
        }
        SPAWN.POWER_ORB(new POS(this.entity.POS.x, this.entity.POS.y), new POS(0, -5), false);
    };
    this.open = function () {
        if (!this.isOpen) {
            if (option.noCard) {
                noCardFrame = 0;
                clear_screen();
                this.drop()
            }
            AudioResources.Cat0.cloneNode().play().then();
            start_frame = option.start_frame || 0;
            time = option.time;
            this.entity.options.canHit = false;
            this.isOpen = true;
        }
    };
    this.en_ep = function () {
        clear_screen();
        bonus = Math.floor(option.bonus * time / option.time);
        time = 0
    };
    this.tick = function () {
        if (start_frame > 0) {
            this.checkPOS();
            start_frame--;
            return
        }
        timeOut.innerHTML = Math.min(Math.floor(time / 60), 99);
        if (timeOut.innerHTML.toString().length < 2) {
            timeOut.innerHTML = "0" + timeOut.innerHTML
        }
        if (time !== 0 && time % 60 === 0) {
            if (time <= 180) {
                timeOut.style.color = "red";
                AudioResources.TimeOut1.cloneNode().play().then()
            } else {
                if (time <= 600) {
                    this.entity.options.defendTime = false;
                    timeOut.style.color = "orange";
                    AudioResources.TimeOut.cloneNode().play().then()
                } else {
                    this.entity.options.defendTime = !!option.noCard;
                    timeOut.style.color = ""
                }
            }
        }
        if (noCardFrame > 0) {
            this.entity.options.defendTime = true;
            noCardFrame--;
            time = noCardFrame;
            if (option.noCard) {
                if (noCardFrame % 360 === 0) {
                    if (Math.random() > 0.5) {
                        if (this.entity.POS.x < screen.width - 200) {
                            this.entity.speed.x += 4
                        }
                    } else {
                        if (this.entity.POS.x > 200) {
                            this.entity.speed.x -= 4
                        }
                    }
                    if (Math.random() > 0.5) {
                        if (this.entity.POS.y < 332) {
                            this.entity.speed.y += 4
                        }
                    } else {
                        if (this.entity.POS.y > 200) {
                            this.entity.speed.y -= 4
                        }
                    }
                    if (this.entity.POS.x > screen.width - 200) {
                        this.entity.speed.x -= 0.2
                    }
                    if (this.entity.POS.x < 200) {
                        this.entity.speed.x += 0.2
                    }
                    if (this.entity.POS.y > 332) {
                        this.entity.speed.y -= 0.2
                    }
                    if (this.entity.POS.y < 200) {
                        this.entity.speed.y += 0.2
                    }
                }
                option.noCard(this)
            }
        } else {
            if (time >= 1) {
                time--;
                if (!DRAW_LIST.TEXTURE.SPELL_CARD[0]) {
                    DRAW_LIST.TEXTURE.SPELL_CARD[0] = {};
                    DRAW_LIST.TEXTURE.SPELL_CARD.len++;
                }
                let cache = DRAW_LIST.TEXTURE.SPELL_CARD[0];
                if (!cache.normalCanvas) {
                    cache.normalCanvas = document.createElement("canvas");
                    cache.normalCanvas.width = 444;
                    cache.normalCanvas.height = 444;
                    let ctx = cache.normalCanvas.getContext("2d");
                    ctx.translate(222, 222);
                    ctx.strokeStyle = "rgba(255,255,255,0.5)";
                    ctx.lineWidth = 2;
                    ctx.shadowColor = "blue";
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.arc(0, 0, 200, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(0, 0, 185, 0, 2 * Math.PI);
                    ctx.stroke();
                    for (let i = 0; i < 360; i += 1.5) {
                        ctx.save();
                        ctx.rotate(i * Math.PI / 180);
                        ctx.beginPath();
                        ctx.moveTo(0, -185);
                        ctx.lineTo(0, -200);
                        ctx.stroke();
                        ctx.restore();
                    }
                    ctx.save();
                    for (let i = 0; i < 6; i++) {
                        // 画完三角形后旋转一半角度画另一个三角形
                        if (i === 3) {
                            ctx.rotate(Math.PI * 2 / 6);
                        }
                        ctx.moveTo(0, -185);
                        ctx.lineTo(185 * Math.sin(Math.PI / 3), 185 / 2);
                        ctx.stroke();
                        ctx.rotate(Math.PI * 2 / 3);
                    }
                    ctx.restore();
                }
                screen_draw.save();
                screen_draw.translate(this.entity.POS.x, this.entity.POS.y);
                screen_draw.rotate(time / 24);
                screen_draw.scale(time / option.time + 1, time / option.time + 1);
                screen_draw.drawImage(cache.normalCanvas, -222, -222);
                screen_draw.restore();
                this.checkPOS();
                if (option.card) {
                    option.card(this)
                }
            } else {
                if (this.isOpen) {
                    if (this.isTimeSpell) {
                        bonus = option.bonus
                    }
                    if (!isEnd) {
                        PLAYER.SCORE += bonus;
                        let card_get = AudioResources.CardGet.cloneNode();
                        card_get.volume = 1;
                        card_get.play().then();
                        isEnd = true
                    }
                    if (slow_frame > 0) {
                        PLAYER.IS_SLOW = true;
                        slow_frame--;
                    } else {
                        PLAYER.IS_SLOW = false;
                        timeOut.style.display = "none";
                        if (option.end) {
                            option.end(this)
                        }
                        PLAYER.IS_SPELL = false;
                        screen_draw.save();
                        if (bonus > 0) {
                            TOUHOU_CONFIG.RESOURCES.AUDIO.Bonus.currentTime = 0;
                            AudioResources.Bonus.cloneNode().play().then();
                            this.drop();
                            if (option.bonus_callback) {
                                option.bonus_callback(this)
                            }
                            methods.push(new DrawFont(120, function () {
                                screen_draw.font = "25px sans-serif";
                                screen_draw.fillStyle = "rgb(67,160,255)";
                                screen_draw.fillText("Get SpellCard bonus", 250, 250);
                                screen_draw.font = "20px sans-serif";
                                screen_draw.fillText(String(bonus), 350, 300);
                            }));
                        } else {
                            methods.push(new DrawFont(120, function () {
                                screen_draw.font = "30px sans-serif";
                                screen_draw.fillStyle = "rgb(98,98,98)";
                                screen_draw.fillText("Bonus failed", 250, 300);
                            }));
                        }
                        screen_draw.restore();
                        return true
                    }
                } else {
                    this.open()
                }
            }
        }
    };
    this.start = function () {
        if (option.start) {
            option.start()
        }
        this.isStart = true;
        timeOut.style.display = "block";
    };
}
