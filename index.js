import prefabs from "./src/prefabs.js";
import {ABox, hslToRgb, rgbToHsl, transTo, Super, getImage, getAudio, getLayer, arrowTo} from "./src/util.js";
import health from "./src/components/health.js";
import movable from "./src/components/movable.js";

const fs = require("fs");
const gui = require("nw" + ".gui");
//idea划线
const win = gui["Window"].get();
let _;

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

function MenuItem(x = 0, y = 0, context = "", fake = 300) {
    function unselect(ctx) {
        ctx.font = "34px sans-serif";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgb(168,24,33)";
        ctx.shadowColor = "black";
        return ctx
    }

    function selected(ctx) {
        ctx.font = "34px sans-serif";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.shadowColor = "red";
        return ctx
    }

    const inst = new prefabs();
    inst.X = x;
    inst.Y = y;
    let was_fake = undefined;
    inst.context = context;
    inst.select = function (f = selected) {
        inst.init_draw = f;
        was_fake = true;
    };
    inst.leave = function (f = unselect) {
        inst.init_draw = f;
        was_fake = undefined;
    };
    inst.init_draw = unselect;
    const ctx = getLayer(128);
    inst.draw = function () {
        ctx.save();
        inst.init_draw(ctx).fillText(inst.context, inst.X + fake, inst.Y);
        ctx.restore();
        if (was_fake === false) {
            if (fake > -10) {
                fake -= 2;
            }
            if (fake <= -10) {
                was_fake = true;
            }
        }
        if (was_fake === true) {
            if (fake < 10) {
                fake += 2;
            }
            if (fake >= 10) {
                was_fake = undefined;
            }
        }
        if (was_fake === undefined) {
            if (fake > 0) {
                fake -= fake / 5;
            }
            if (fake < 0) {
                fake += fake / 5;
            }
        }
    };
    return inst
}


function Entity() {
    prefabs.call(this);
    this.addComponent("health", health);
    this.addComponent("movable", movable);
    this.addComponent("tick", function tick() {
        this.tick = function (self) {
            if (self.indestructible) {
                self.alive = true;
            }
            if (!self.alive) {
                self.tags.add("death")
            }
        }
    });
    this.alive = true;
    this.indestructible = false
}

(Super)(prefabs, Entity);

const MenuStarCache = {};

function MenuStar(x = 0, y = 0, mx = 0, my = 1, size = 2, color = "white") {
    Entity.call(this);
    this.removeComponent("health");
    if (size < 0) {
        size = -size
    }
    if (size < 1) {
        size++
    }
    let show = false;
    this.X = x;
    this.Y = y;
    this.components["movable"].MX = mx;
    this.components["movable"].MY = my;
    this.size = size;
    this.color = color;
    this.addComponent("MenuStarLoop", function MenuStarLoop() {
        this.tick = function (self) {
            if (self.Y > wsc.height) {
                self.Y = 0
            }
        }
    });
    this.addLayer("Star", function Star() {
        const ctx = getLayer(0);
        this.draw = function (self) {
            if (show) {
                if (Math.random() > 0.999) {
                    show = false
                }
                if (!MenuStarCache[self.size]) {
                    MenuStarCache[self.size] = {};
                    MenuStarCache.len++;
                }
                const cache = MenuStarCache[self.size];
                if (!cache.normalCanvas) {
                    cache.normalCanvas = document.createElement("canvas");
                    cache.normalCanvas.width = 2 * self.size;
                    cache.normalCanvas.height = 2 * self.size;
                    const cache_draw = cache.normalCanvas.getContext("2d");
                    cache_draw.fillStyle = self.color;
                    cache_draw.shadowColor = self.color;
                    cache_draw.shadowBlur = 1;
                    cache_draw.arc(self.size, self.size, self.size - 1, 0, 2 * Math.PI);
                    cache_draw.fill();
                }
                ctx.drawImage(cache.normalCanvas, self.X - self.size, self.Y - self.size)
            } else {
                if (Math.random() > 0.9) {
                    show = true
                }
            }
        }
    })
}

(Super)(Entity, MenuStar);

function saveToFile() {
    save["highScore"] = h_score;
    fs.writeFileSync('./save.json', JSON.stringify(save))
}

function stopAllSound() {
    for (const soundsKey in Sounds) {
        if (!Sounds[soundsKey].paused) {
            Sounds[soundsKey].pause();
            stopSounds.push(Sounds[soundsKey])
        }
    }
}

function continueAllSound() {
    while (stopSounds.length > 0) {
        try {
            Sounds[stopSounds.pop()].play()
        } catch (e) {
        }
    }
}

function cancelAllSound() {
    for (const soundsKey in Sounds) {
        Sounds[soundsKey].pause();
        Sounds[soundsKey].currentTime = 0;
    }
}

function Bullet() {
    Entity.call(this);
    this.addComponent("BulletTick", function BulletTick() {
        this.tick = function (self) {
            if (self.sizeBox.isOutScreen(self.X, self.Y, wsc.width, wsc.height, self.components["movable"].MX, self.components["movable"].MY)) {
                self.tags.add("death")
            }
        };
    });
}

(Super)(Entity, Bullet);

function EnemyBullet() {
    Bullet.call(this);
    this.tags.add(Tags.enemy);
    this.canGraze = true;
    this.hit = function () {
        if (this.atkBox) {
            if (this.atkBox.isHit(this.X, this.Y, player.X, player.Y, player.pickBox)) {
                if (this.canGraze || this.canGraze === undefined) {
                    graze++;
                    score += 500;
                    score += point * 10;
                    this.canGraze = false;
                    player.grazeFlag = true;
                    Sounds.graze.currentTime = 0;
                    _ = Sounds.graze.play();
                }
            } else {
                this.canGraze = true
            }
            if (this.atkBox.isHit(this.X, this.Y, player.X, player.Y, player.hitBox)) {
                player.die();
                if (player.indTime) {
                    score += point * 100;
                    this.alive = false
                }
            }
        }
    };
    this.addComponent("EnemyBulletTick", function () {
        this.tick = function (self) {
            self.hit()
        }
    });
}

(Super)(Bullet, EnemyBullet);

const jade = {};

function drawSticker(type, color) {
    let x = 0, y = 0, w = 16, h = 16, can_hue = true, image = Images.e_bullet_1;
    switch (type) {
        case "laser":
            break;
        case "scale":
            y = 16;
            can_hue = false;
            break;
        case "ring":
            y = 32;
            break;
        case "small":
            y = 48;
            break;
        case "rice":
            y = 64;
            break;
        case "suffering":
            y = 80;
            break;
        case "bill":
            y = 96;
            break;
        case "bullet":
            y = 112;
            break;
        case "bacteria":
            y = 128;
            break;
        case "needle":
            y = 144;
            break;
        case "star":
            y = 160;
            break;
        case "ice":
            y = 176;
            break;
        case "point":
            y = 192;
            w = 8;
            h = 8;
            break;
        case "shiji":
            x = 15 * 8;
            y = 192;
            w = 8;
            h = 8;
            break;
        case "coin":
            y = 208;
            break;
        case "arrow":
            y = 224;
            h = 32;
            break;
        case "orb":
            image = Images.e_bullet_2;
            w = 32;
            h = 32;
            break;
        case "big_star":
            image = Images.e_bullet_2;
            y = 32;
            w = 32;
            h = 32;
            break;
        case "knife":
            image = Images.e_bullet_2;
            y = 64;
            w = 32;
            h = 32;
            break;
        case "heart":
            image = Images.e_bullet_2;
            y = 96;
            w = 32;
            h = 32;
            break;
        case "butterfly":
            image = Images.e_bullet_2;
            y = 128;
            w = 32;
            h = 32;
            break;
        case "oval":
            image = Images.e_bullet_2;
            y = 160;
            w = 32;
            h = 32;
            break;
        case "big":
            image = Images.e_bullet_2;
            y = 192;
            w = 64;
            h = 64;
            break;
        default:
            throw new Error("Type: " + type + " is not supported.")
    }
    if (isNaN(color)) {
        switch (color) {
            case "dimgray":
                if (type === "coin" || type === "scale" || type === "big_star") {
                    throw new Error("dimgray " + type + " is not supported.")
                }
                break;
            case "darkgray":
                if (type === "coin") {
                    throw new Error("darkgray " + type + " is not supported.")
                }
                x += w;
                break;
            case "crimson":
                if (type === "coin" || type === "scale" || type === "big_star") {
                    throw new Error("crimson " + type + " is not supported.")
                }
                x += 2 * w;
                break;
            case "red":
                if (type === "coin") {
                    throw new Error("red " + type + " is not supported.")
                }
                x += 3 * w;
                break;
            case "orangered":
                if (type === "coin") {
                    throw new Error("orangered " + type + " is not supported.")
                }
                x += 4 * w;
                break;
            case "gold":
                if (type === "coin") {
                    x = 0
                }
                x += 5 * w;
                break;
            case "silk":
                if (type === "coin") {
                    x += 2 * w;
                } else {
                    throw new Error("silk " + type + " is not supported.")
                }
                break;
            case "copper":
                if (type === "coin") {
                    x += 3 * w;
                } else {
                    throw new Error("copper " + type + " is not supported.")
                }
                break;
            case "khaki":
                if (type === "coin" || type === "scale" || type === "big_star") {
                    throw new Error("darkorange " + type + " is not supported.")
                }
                x += 6 * w;
                break;
            case "yellowgreen":
                if (type === "coin" || type === "scale" || type === "big_star") {
                    throw new Error("yellowgreen " + type + " is not supported.")
                }
                x += 7 * w;
                break;
            case "green":
                if (type === "coin") {
                    throw new Error("green " + type + " is not supported.")
                }
                x += 8 * w;
                break;
            case "aqua":
                if (type === "coin" || type === "scale" || type === "big_star") {
                    throw new Error("aqua " + type + " is not supported.")
                }
                x += 9 * w;
                break;
            case "water":
                if (type === "coin") {
                    throw new Error("lightseagreen " + type + " is not supported.")
                }
                x += 10 * w;
                break;
            case "blue":
                if (type === "coin") {
                    throw new Error("blue " + type + " is not supported.")
                }
                x += 11 * w;
                break;
            case "darkblue":
                if (type === "coin" || type === "scale" || type === "big_star") {
                    throw new Error("darkblue " + type + " is not supported.")
                }
                x += 12 * w;
                break;
            case "purple":
                if (type === "coin") {
                    throw new Error("purple " + type + " is not supported.")
                }
                x += 13 * w;
                break;
            case "hotpink":
                if (type === "coin") {
                    throw new Error("hotpink " + type + " is not supported.")
                }
                x += 14 * w;
                break;
            default:
                throw new Error(type + " Color: " + color + " is not supported.")
        }
    } else {
        x += w;
    }
    if (x + w > image.width) {
        y += h;
        x -= image.width;
        x += w
    }
    if (!jade[type]) {
        jade[type] = {}
    }
    if (!jade[type][color]) {
        const layer0 = document.createElement("canvas");
        layer0.width = w;
        layer0.height = h;
        const ctx = layer0.getContext("2d");
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
        if (!isNaN(color)) {
            if (!can_hue) {
                throw new Error(type + " Color: " + color + " is not supported.")
            }
            const px = ctx.getImageData(0, 0, w, h);
            for (let i = 0; i < px.data.length; i += 4) {
                if (px.data[i] === 255 && px.data[i + 1] === 255 && px.data[i + 2] === 255) {
                    continue;
                }
                const hsl = rgbToHsl(px.data[i], px.data[i + 1], px.data[i + 2]);
                const rgb = hslToRgb(color, 1, hsl[2]);
                px.data[i] = rgb[0];
                px.data[i + 1] = rgb[1];
                px.data[i + 2] = rgb[2];
            }
            ctx.putImageData(px, 0, 0);
        }
        const graze = layer0.cloneNode(true);
        const c = graze.getContext("2d");
        c.drawImage(layer0, 0, 0);
        c.globalCompositeOperation = "source-atop";
        c.fillStyle = "rgba(249,255,1,0.5)";
        c.fillRect(0, 0, graze.width, graze.height);
        jade[type][color] = {
            layer0: layer0,
            graze: graze
        }
    }
    return jade[type][color]
}

function Jade(type, color, x, y, mx, my, rotate, spy) {
    EnemyBullet.call(this);
    this.X = x;
    this.Y = y;
    this.DX = 0;
    this.DY = 0;
    this.type = type;
    this.color = color;
    this.sizeBox = new ABox(8);
    this.atkBox = new ABox(4);
    this.components["movable"].MX = mx;
    this.components["movable"].MY = my;
    let symmetric = false;
    const image = drawSticker(type, color);
    switch (type) {
        case "scale":
            break;
        case "ring":
            this.sizeBox = new ABox(8);
            this.atkBox = new ABox(6);
            symmetric = true;
            break;
        case "small":
            this.sizeBox = new ABox(8);
            this.atkBox = new ABox(6);
            symmetric = true;
            break;
        case "rice":
            break;
        case "suffering":
            break;
        case "bill":
            break;
        case "bullet":
            break;
        case "bacteria":
            break;
        case "needle":
            break;
        case "star":
            this.sizeBox = new ABox(8);
            this.atkBox = new ABox(6);
            break;
        case "ice":
            break;
        case "point":
            break;
        case "shiji":
            break;
        case "coin":
            this.sizeBox = new ABox(8);
            this.atkBox = new ABox(6);
            break;
        case "arrow":
            this.Y -= 8;
            this.DY = 8;
            break;
        case "orb":
            this.sizeBox = new ABox(16);
            this.atkBox = new ABox(8);
            symmetric = true;
            break;
        case "big_star":
            this.sizeBox = new ABox(16);
            this.atkBox = new ABox(8);
            break;
        case "knife":
            this.sizeBox = new ABox(16);
            this.atkBox = new ABox(8);
            break;
        case "heart":
            this.sizeBox = new ABox(16);
            this.atkBox = new ABox(10);
            break;
        case "butterfly":
            this.sizeBox = new ABox(16);
            this.atkBox = new ABox(8);
            break;
        case "oval":
            this.sizeBox = new ABox(16);
            this.atkBox = new ABox(7);
            break;
        case "big":
            this.sizeBox = new ABox(32);
            this.atkBox = new ABox(14);
            break;
        default:
            throw new Error("BulletType: " + type + " is not supported.")
    }
    this.addLayer("EBullet", function () {
        const ctx = getLayer(0);
        const r90 = 90 * L;
        this.draw = function (self) {
            if (rotate === undefined && !symmetric) {
                rotate = Math.atan2(self.components["movable"].MY, self.components["movable"].MX) + r90
            }
            let draw;
            if (self.canGraze) {
                draw = image.layer0
            } else {
                draw = image.graze
            }
            if (rotate) {
                ctx.save();
                ctx.translate(self.X + self.DX, self.Y + self.DY);
                ctx.rotate(rotate);
                ctx.drawImage(draw, -self.sizeBox.r, -self.sizeBox.r);
                ctx.restore()
            } else {
                ctx.drawImage(draw, self.X + self.DX - self.sizeBox.r, self.Y + self.DY - self.sizeBox.r);
            }
        }
    });
    const self = this;
    if (spy !== undefined && !isNaN(spy)) {
        setTimeout(function () {
            if (!self.alive || self.tags.has("death")) {
                return
            }
            const speed = arrowTo(self.X, self.Y, player.X, player.Y, 4);
            self.components["movable"].MX = speed[0];
            self.components["movable"].MY = speed[1];
            Sounds.change_track.currentTime = 0;
            _ = Sounds.change_track.play()
        }, spy)
    }
}

(Super)(EnemyBullet, Jade);

function PlayerBullet() {
    Bullet.call(this);
    this.tags.add(Tags.player);
    this.hit = function (enemy) {
        if (this.atkBox && enemy.components["health"]) {
            if (this.atkBox.isHit(this.X, this.Y, enemy.X, enemy.Y, enemy.hitBox)) {
                enemy.components["health"].doDelta(-this.power)
            }
        }
    };
}

(Super)(Bullet, PlayerBullet);

let rumia_orb;

function RumiaOrb(x, y, mx, my) {
    PlayerBullet.call(this);
    this.power = 1;
    this.X = x;
    this.Y = y;
    this.components["movable"].MX = mx;
    this.components["movable"].MY = my;
    this.sizeBox = new ABox(10);
    this.addLayer("RumiaOrb", function RumiaOrb() {
        const ctx = getLayer(0);
        this.draw = function (self) {
            if (!rumia_orb) {
                rumia_orb = document.createElement("canvas");
                rumia_orb.width = 2 * self.sizeBox.r;
                rumia_orb.height = 2 * self.sizeBox.r;
                const c = rumia_orb.getContext("2d");
                c.fillStyle = "black";
                c.shadowColor = "black";
                c.shadowBlur = 2;
                c.beginPath();
                c.arc(self.sizeBox.r, self.sizeBox.r, self.sizeBox.r - 1, 0, 2 * Math.PI);
                c.closePath();
                c.fill();
                c.beginPath();
                c.arc(self.sizeBox.r, self.sizeBox.r, self.sizeBox.r - 3, 0, 2 * Math.PI);
                c.closePath();
                c.fill()
            }
            ctx.drawImage(rumia_orb, self.X - self.sizeBox.r, self.Y - self.sizeBox.r);
        }
    })
}

(Super)(PlayerBullet, RumiaOrb);

function AbstractPlayer() {
    Entity.call(this);
    this.X = 440;
    this.Y = 730;
    this.option = {};
    this.option.shoot_delay = 3;
    this.shoot_delay = 0;
    this.highSpeed = 10;
    this.lowSpeed = 5;
    this.hitBox = new ABox(3);
    this.grazeBox = new ABox(12);
    this.pickBox = new ABox(60);
    this.pickLine = 3 / 4;
    this.bombTime = -1;
    this.indTime = -10;
    this.miss = false;
    this.inScreen = function () {
        const p = this.grazeBox.inScreen(this.X, this.Y, 0.035 * wsc.width, 0.015 * wsc.height, 0.65 * wsc.width, 0.98 * wsc.height);
        this.X = p[0];
        this.Y = p[1]
    };
    this.left = function () {
        if (slow) {
            this.X -= this.lowSpeed
        } else {
            this.X -= this.highSpeed
        }
        this.inScreen()
    };
    this.right = function () {
        if (slow) {
            this.X += this.lowSpeed
        } else {
            this.X += this.highSpeed
        }
        this.inScreen()
    };
    this.up = function () {
        if (slow) {
            this.Y -= this.lowSpeed
        } else {
            this.Y -= this.highSpeed
        }
        this.inScreen()
    };
    this.down = function () {
        if (slow) {
            this.Y += this.lowSpeed
        } else {
            this.Y += this.highSpeed
        }
        this.inScreen()
    };
    this.die = function () {
        if (!this.indestructible) {
            this.miss = true;
            this.indestructible = true;
            _ = Sounds.miss.play()
        }
    };
    this.shoot = function (self) {
        if (this.shoot_delay === 0) {
            if (this.option.shoot) {
                this.option.shoot(self)
            }
            score += 100;
            score += power * 100;
            Sounds.shoot.currentTime = 0;
            _ = Sounds.shoot.play();
            this.shoot_delay = this.option.shoot_delay
        }
    };
    this.bomb = function (self) {
        if (bomb > 0 && this.bombTime < 0) {
            bomb--;
            self.miss = false;
            if (this.option.bomb) {
                this.option.bomb(self)
            }
        }
    };
    this.addComponent("PlayerTick", function () {
        this.tick = function (self) {
            if (self.miss) {
                if (self.indTime < 0) {
                    self.indTime++;
                    self.indestructible = true
                }
                if (self.indTime === 0) {
                    self.indTime = 300;
                    if (player_count > 0) {
                        player_count--
                    }
                    bomb = 3;
                    power = 0;
                    self.miss = false
                }
            } else {
                if (self.bombTime > 0) {
                    self.indestructible = true;
                    if (self.bombLay) {
                        self.bombLay()
                    }
                    self.bombTime--
                }
                if (self.bombTime < 0) {
                    if (self.indTime > 0) {
                        self.indestructible = true;
                        self.indTime--
                    } else {
                        self.indestructible = false;
                        if (self.indTime > -10) {
                            self.indTime--
                        }
                    }
                }
                if (self.bombTime === 0) {
                    if (self.bombOut) {
                        self.bombOut()
                    }
                    self.bombTime = -1
                }
            }
        }
    });
    this.addLayer("PlayerPoint", function () {
        let ro = 0;
        this.draw = function (self) {
            if (!self.alive) {
                return
            }
            const layer = getLayer(2);
            if (slow) {
                layer.save();
                layer.translate(self.X, self.Y);
                layer.fillStyle = "red";
                layer.shadowColor = "red";
                layer.shadowBlur = 3;
                layer.beginPath();
                layer.arc(0, 0, self.hitBox.r + 1, 0, 2 * Math.PI);
                layer.closePath();
                layer.fill();
                layer.strokeStyle = "rgba(255,255,255,0.05)";
                layer.lineWidth = 1;
                layer.shadowColor = "white";
                layer.shadowBlur = 4;
                layer.beginPath();
                layer.arc(0, 0, self.pickBox.r, 0, 2 * Math.PI);
                layer.stroke();
                layer.beginPath();
                layer.arc(0, 0, self.pickBox.r - 2, 0, 2 * Math.PI);
                layer.stroke();
                layer.save();
                ro += L;
                if (ro > 90 * L) {
                    ro = 0
                }
                layer.rotate(ro);
                layer.globalCompositeOperation = "lighter";
                layer.drawImage(Images.ply_border_01, -32, -32);
                layer.restore();
                layer.fillStyle = "white";
                layer.shadowColor = "white";
                layer.rotate(L * frames * 6);
                layer.fillRect(-self.hitBox.r, -self.hitBox.r, self.hitBox.r * 2, self.hitBox.r * 2);
                layer.restore();
            }
            if (self.miss && self.indTime < 0) {
                ctx.save();
                ctx.globalCompositeOperation = "source-atop";
                ctx.fillStyle = "rgba(255,0,10,0.5)";
                ctx.fillRect(0, 0, wsc.width, wsc.height);
                ctx.restore();
            }
        }
    });
}

(Super)(Entity, AbstractPlayer);

function Rumia() {
    AbstractPlayer.call(this);
    this.addLayer("Rumia", function () {
        this.draw = function (self) {
            const ctx = getLayer(0);
            ctx.save();
            ctx.translate(self.X, self.Y);
            ctx.fillStyle = "black";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, self.bombTime + 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore()
        };
    });
    this.shoot_count = 0;
    this.power_max = 400;
    this.option.shoot = function (self) {
        let th = 45, tx = 15;
        if (slow) {
            th = 1;
            tx = 2
        }
        self.shoot_count++;
        if (self.shoot_count > 10) {
            self.shoot_count = 0
        }
        if (power < 99) {
            entities.push(new RumiaOrb(self.X, self.Y, 0, -40));
        }
        if (power >= 100) {
            entities.push(new RumiaOrb(self.X + 10, self.Y, 0, -40));
            entities.push(new RumiaOrb(self.X - 10, self.Y, 0, -40));
        }
        let temp;
        if (power >= 200 && self.shoot_count % 2 === 0 || power >= 300) {
            temp = transTo(0, -40, tx * L);
            entities.push(new RumiaOrb(self.X - 20, self.Y, temp[0], temp[1]));
            temp = transTo(0, -40, -tx * L);
            entities.push(new RumiaOrb(self.X + 20, self.Y, temp[0], temp[1]));
        }
        if (power >= 400) {
            temp = transTo(0, -40, th * L);
            entities.push(new RumiaOrb(self.X + 20, self.Y, temp[0], temp[1]));
            temp = transTo(0, -40, -th * L);
            entities.push(new RumiaOrb(self.X - 20, self.Y, temp[0], temp[1]));
        }
    };
    this.option.bomb = function (self) {
        _ = Sounds.cat0.play();
        self.bombTime = 300
    };
    this.bombLay = function () {
    };
    this.bombOut = function () {
        clear_screen(function (entity) {
            return entity.tags.has(Tags.enemy)
        });
        _ = Sounds.slash.play()
    }
}

(Super)(AbstractPlayer, Rumia);

let step = 0;

function AbstractStage() {
    this.option = {};
    this.stage = {};
    this.music = undefined;
    this.musicLoop = 0;
    this.musicIn = 0;
    this.background = undefined;
    this.backgroundLoop = undefined;
    this.backgroundIn = 0;
    let timestamp = 0;
    this.step_speed = 1;
    this.show_title = function (layer, t) {
    };
    this.title_delay = 300;
    this.canPlay = true;
    this.draw = function () {
        const ctx = getLayer(0);
        ctx.save();
        if (this.background) {
            ctx.drawImage(this.background, 0.01 * wsc.width, 0.01 * wsc.height + step)
        }
        if (timestamp < this.title_delay) {
            this.show_title(getLayer(2), timestamp)
        }
        if (player) {
            player.draw(player)
        }
        ctx.restore();
        if (this.option.draw) {
            this.option.draw()
        }
    };
    this.tick = function () {
        if (this.option.tick) {
            this.option.tick()
        }
        player.tick(player);
        this.draw();
        step += this.step_speed;
        if (this.backgroundLoop !== undefined && step >= this.backgroundLoop) {
            step = this.backgroundIn
        }
        if (this.music.paused && this.canPlay) {
            this.music.play()
        }
        if (this.musicLoop && this.music.currentTime >= this.musicLoop) {
            this.music.currentTime = this.musicIn;
        }
        if (timestamp in this.stage) {
            this.stage[timestamp]()
        }
        timestamp++
    };
    this.clear = function () {
        saveToFile()
    };
    this.end = function () {
        this.music.pause();
        this.music.currentTime = 0;
        step = 0;
        score = 0
    }
}

function TestStage() {
    AbstractStage.call(this);
    this.music = Sounds.test;
    this.musicLoop = 145.1;
    this.musicIn = 0;
    const cache = document.createElement("canvas");
    cache.width = wsc.width * 0.65;
    cache.height = wsc.height * 1.1;
    const cache_draw = cache.getContext("2d");
    const ctx = getLayer(0);
    cache_draw.fillStyle = ctx.createPattern(Images.background["03_02"], "repeat");
    cache_draw.fillRect(0, 0, cache.width, cache.height);
    this.background = cache;
    this.backgroundLoop = 0;
    this.backgroundIn = -wsc.height * 0.131;
    this.show_title = function (layer, t) {
        layer.save();
        layer.font = "34px sans-serif";
        layer.shadowColor = "black";
        layer.shadowBlur = 2;
        if (t > 200) {
            layer.fillStyle = "rgba(255,255,255," + (1 / (t - 200)) + ")"
        } else {
            layer.fillStyle = "white"
        }
        layer.fillText("TestStage", 0.28 * wsc.width, 0.3 * wsc.height);
        layer.restore();
    };
    const ctx1 = getLayer(1);
    this.option.draw = function () {
        ctx1.drawImage(Images.spell_name, 0.445 * wsc.width, 0.03 * wsc.height);
        ctx1.save();
        ctx1.font = "16px Comic Sans MS";
        ctx1.fillStyle = "white";
        ctx1.shadowColor = "black";
        ctx1.shadowBlur = 5;
        ctx1.fillText("夜符「Night Bird」", 0.53 * wsc.width, 0.06 * wsc.height);
        ctx1.font = "20px Comic Sans MS";
        ctx1.fillText("99", 0.63 * wsc.width, 0.04 * wsc.height);
        ctx1.restore();
    };
    this.option.tick = function () {
        if (player.shoot_delay > 0) {
            player.shoot_delay--;
        }
        // 麻将自机狙+固定弹
        // if (frames % 30 === 0) {
        //     for (let i = 0; i <= 360; i += 36) {
        //         let speed = transTo(4, 4, (i + frames / 10) * L);
        //         entities.push(new Jade("bill", 0.8, 300, 300, speed[0], speed[1]));
        //         speed = arrowTo(300, 300, player.X, player.Y, 4);
        //         speed = transTo(speed[0], speed[1], (i + frames / 10) * L);
        //         entities.push(new Jade("bill", 0.75, 300, 300, speed[0], speed[1]))
        //     }
        //     Sounds.change_track.currentTime = 0;
        //     _ = Sounds.change_track.play();
        // }
        if (frames % 60 === 0) {
            for (let j = 0; j < 16; j++) {
                for (let k = 0; k < 3; k++) {
                    let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16;
                    speed = transTo(speed, speed, 90.0 - 135.0 / 16.0 * j - 3);
                    entities.push(new Jade("ring", "purple", 440, 300, speed[0], speed[1]))
                }
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play();
        }
        if (frames % 75 === 0) {
            for (let j = 0; j < 16; j++) {
                for (let k = 0; k < 3; k++) {
                    let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16;
                    speed = transTo(speed, speed, -90.0 + 135.0 / 16.0 * j);
                    entities.push(new Jade("ring", "water", 440, 300, speed[0], speed[1], 0, 1000))
                }
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play();
        }
        if (frames % 90 === 0) {
            for (let j = 0; j < 16; j++) {
                for (let k = 0; k < 3; k++) {
                    let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16;
                    speed = transTo(speed, speed, 90.0 - 135.0 / 16.0 * j - 2);
                    entities.push(new Jade("ring", "purple", 440, 300, speed[0], speed[1]))
                }
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play();
        }
        if (frames % 105 === 0) {
            for (let j = 0; j < 16; j++) {
                for (let k = 0; k < 3; k++) {
                    let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16;
                    speed = transTo(speed, speed, -90.0 + 135.0 / 16.0 * j - 1);
                    entities.push(new Jade("ring", "water", 440, 300, speed[0], speed[1], 0, 1000))
                }
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play();
        }
        score++
    }
}

Super(AbstractStage, TestStage);

function transitions(f) {
    if (typeof f === "function") {
        handler = f;
    }
    selectIndex = 0;
    pause = false;
    cancelAllSound();
    entities.splice(0, entities.length);
    main_menu.splice(0, main_menu.length);
    keys.splice(0, keys.length);
    if (stage) {
        stage.end();
        stage = null
    }
    read_key_timeout = 60;
}

function loadStageMenu() {
    stage_menu.splice(0, stage_menu.length);
    stage_menu.push(MenuItem(100, 550, "解除暂停"));
    stage_menu.push(MenuItem(100, 590, "返回至主菜单"));
    stage_menu.push(MenuItem(100, 630, "从头开始"));
    stage_menu[0].select();
}

function loadMainMenu() {
    transitions(menu);
    main_menu.push(MenuItem(960, 550, "Game Start"));
    main_menu.push(MenuItem(960, 590, "Extra Start"));
    main_menu.push(MenuItem(960, 630, "Test"));
    main_menu.push(MenuItem(960, 670, "Replay"));
    main_menu.push(MenuItem(960, 710, "Play Data"));
    main_menu.push(MenuItem(960, 750, "Music Room"));
    main_menu.push(MenuItem(960, 790, "Option"));
    main_menu.push(MenuItem(960, 830, "Quit"));
    main_menu[0].select();
}

let gui_bg_cache;

const ctx = getLayer(0);

function renderer_gui() {
    if (graze > config["GrazeMax"]) {
        graze = config["GrazeMax"]
    }
    if (score > h_score) {
        h_score = score
    }
    ctx.save();
    if (!gui_bg_cache) {
        gui_bg_cache = document.createElement("canvas");
        gui_bg_cache.width = wsc.width;
        gui_bg_cache.height = wsc.height;
        const cache_draw = gui_bg_cache.getContext("2d");
        cache_draw.fillStyle = ctx.createPattern(Images.background["11o26"], "repeat");
        cache_draw.fillRect(0, 0, wsc.width, wsc.height);
        cache_draw.shadowBlur = 10;
        cache_draw.globalCompositeOperation = "destination-out";
        cache_draw.fillStyle = "black";
        cache_draw.shadowColor = "black";
        cache_draw.roundRect(0.04 * wsc.width, 0.02 * wsc.height, 0.61 * wsc.width, 0.96 * wsc.height, 10).fill();
    }
    ctx.drawImage(gui_bg_cache, 0, 0);
    ctx.font = "34px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    let s = h_score.toString();
    while (s.length < 9) {
        s = "0" + s
    }
    ctx.fillText("HiScore    " + s, 0.67 * wsc.width, 0.126 * wsc.height);
    s = score.toString();
    while (s.length < 9) {
        s = "0" + s
    }
    ctx.fillText("Score    " + s, 0.698 * wsc.width, 0.166 * wsc.height);
    ctx.fillText("Player", 0.691 * wsc.width, 0.206 * wsc.height);
    for (let i = 0; i < player_count; i++) {
        ctx.drawImage(Images.sidebar.life, 0.8 * wsc.width + i * 32, 0.18 * wsc.height, 32, 32)
    }
    ctx.fillText("Bomb", 0.696 * wsc.width, 0.246 * wsc.height);
    for (let i = 0; i < bomb; i++) {
        ctx.drawImage(Images.sidebar.bomb, 0.8 * wsc.width + i * 32, 0.215 * wsc.height, 32, 32)
    }
    ctx.fillText("Power", 0.694 * wsc.width, 0.286 * wsc.height);
    s = power.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx.fillText("Point    " + point, 0.708 * wsc.width, 0.326 * wsc.height);
    ctx.fillText("Graze    " + graze, 0.696 * wsc.width, 0.366 * wsc.height);
    ctx.fillText(s[0] + ".", 0.8 * wsc.width, 0.286 * wsc.height);
    ctx.fillText("/", 0.845 * wsc.width, 0.286 * wsc.height);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(s.substr(1, 2), 0.822 * wsc.width, 0.286 * wsc.height);
    s = player.power_max.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx.font = "34px Comic Sans MS";
    ctx.fillText(s[0] + ".", 0.86 * wsc.width, 0.286 * wsc.height);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(s.substr(1, 2), 0.882 * wsc.width, 0.286 * wsc.height);
    ctx.restore();
}

let stage, pause = false, slow = false;

const ctx1 = getLayer(1);

function test() {
    if (!stage) {
        player = new Rumia();
        stage = new TestStage()
    }
    if (pause) {
        stage.draw();
        rendererEntity();
        stage_menu.forEach(function (g) {
            g.draw(g);
        });
        ctx1.save();
        ctx1.fillStyle = "rgba(255,0,10,0.5)";
        ctx1.fillRect(0, 0, wsc.width, wsc.height);
        ctx1.font = "30px sans-serif";
        ctx1.fillStyle = "rgb(255,255,255)";
        ctx1.fillText("游戏暂停", 80, 400);
        ctx1.restore();
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case "ArrowUp":
                    stage_menu[selectIndex].leave();
                    if (selectIndex > 0) {
                        selectIndex--
                    } else {
                        selectIndex = 2
                    }
                    stage_menu[selectIndex].select();
                    read_key_timeout = 6;
                    Sounds.select.currentTime = 0;
                    _ = Sounds.select.play();
                    break;
                case "ArrowDown":
                    stage_menu[selectIndex].leave();
                    if (selectIndex < 2) {
                        selectIndex++
                    } else {
                        selectIndex = 0
                    }
                    stage_menu[selectIndex].select();
                    read_key_timeout = 6;
                    Sounds.select.currentTime = 0;
                    _ = Sounds.select.play();
                    break;
                case "z":
                case "Z":
                    if (selectIndex === 0) {
                        continueAllSound();
                        pause = false
                    }
                    if (selectIndex === 1) {
                        loadMainMenu();
                        return
                    }
                    if (selectIndex === 2) {
                        transitions(test);
                        return
                    }
                    Sounds.ok.currentTime = 0;
                    _ = Sounds.ok.play();
                    break;
                case "Escape":
                    continueAllSound();
                    _ = Sounds.option.play();
                    pause = false
            }
        }
        keys.splice(0, keys.length);
        updateMenu()
    } else {
        stage.tick();
        const kb = config["KeyBoard"];
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i].toLowerCase()) {
                case "escape":
                    loadStageMenu();
                    stopAllSound();
                    read_key_timeout = 360;
                    Sounds.pause.play().then(function () {
                        read_key_timeout = 6
                    });
                    keys.splice(i, 1);
                    pause = true;
                    break;
                case kb["Up"].toLowerCase() :
                    player.up();
                    break;
                case kb["Down"].toLowerCase() :
                    player.down();
                    break;
                case kb["Left"].toLowerCase() :
                    player.left();
                    break;
                case kb["Right"].toLowerCase() :
                    player.right();
                    break;
                case kb["Shoot"].toLowerCase() :
                    player.shoot(player);
                    break;
                case kb["Bomb"].toLowerCase() :
                    player.bomb(player);
                    break;
            }
        }
        updateEntity()
    }
    renderer_gui()
}

function menu() {
    while (entities.length < 256) {
        entities.push(new MenuStar(Math.random() * wsc.width, Math.random() * wsc.height, 0, 0.5, Math.random() * 2));
    }
    if (Sounds.menu.paused) {
        _ = Sounds.menu.play()
    }
    if (Sounds.menu.currentTime > 132.5) {
        Sounds.menu.currentTime = 1
    }
    for (let i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case "ArrowUp":
                main_menu[selectIndex].leave();
                if (selectIndex > 0) {
                    selectIndex--
                } else {
                    selectIndex = 7
                }
                main_menu[selectIndex].select();
                read_key_timeout = 6;
                Sounds.select.currentTime = 0;
                _ = Sounds.select.play();
                break;
            case "ArrowDown":
                main_menu[selectIndex].leave();
                if (selectIndex < 7) {
                    selectIndex++
                } else {
                    selectIndex = 0
                }
                main_menu[selectIndex].select();
                read_key_timeout = 6;
                Sounds.select.currentTime = 0;
                _ = Sounds.select.play();
                break;
            case "z":
            case "Z":
                if (selectIndex === 2) {
                    transitions(test);
                    return;
                }
                if (selectIndex === 7) {
                    win.close();
                }
                Sounds.ok.currentTime = 0;
                _ = Sounds.ok.play();
                break;
            case "Escape":
            case "x":
            case "X":
                main_menu[selectIndex].leave();
                if (selectIndex === 7) {
                    win.close();
                } else {
                    selectIndex = 7
                }
                main_menu[selectIndex].select();
                read_key_timeout = 6;
                Sounds.cancel.currentTime = 0;
                _ = Sounds.cancel.play();
        }
    }
    keys.splice(0, keys.length);
    updateMenu();
    updateEntity()
}

function updateMenu() {
    main_menu.forEach(function (g) {
        g.draw(g)
    });
}

function rendererEntity() {
    entities.forEach(function (entity) {
        entity.draw(entity)
    })
}

function updateEntity() {
    for (let i = 0; i < entities.length; i++) {
        if (entities.length > config["ECSMax"]) {//实体上限
            entities.splice(i, 1)
        } else {
            const entity = entities[i];
            if (!entity.tick(entity)) {
                entities.splice(i, 1)
            }
            entity.draw(entity)
        }
    }
}

function clear_screen(callback) {
    let count = 0;
    entities.forEach(function (entity) {
        if (callback(entity)) {
            entity.tags.add("death");
            count++
        }
    });
    return count
}

let restore = false;

function error(e, fatal = false) {
    console.error(e);
    ctx.save();
    ctx.clearRect(0, 0, wsc.width, wsc.height);
    window.layers.forEach(function (s) {
        getLayer(s).clearRect(0, 0, wsc.width, wsc.height);
    });
    cancelAllSound();
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "red";
    let y = 20;
    if (fatal) {
        ctx.fillText("哦豁，完蛋：", 4, y);
        ctx.fillText("[!]这是一个致命错误", 4, wsc.height * 0.99)
    } else {
        ctx.drawImage(Images.error, wsc.width * 0.55, wsc.height * 0.4);
        ctx.fillText("啊这，发生了一点错误：", 4, y);
        ctx.fillText("按[Z]返回主菜单", 4, wsc.height * 0.96);
        ctx.fillText("按[Esc]退出", 4, wsc.height * 0.99);
        restore = true
    }
    e.stack.split("\n").forEach(function (s) {
        y += 20;
        ctx.fillText(s, 4, y)
    });
    ctx.restore();
    keys.splice(0, keys.length);
    Sounds.failure.currentTime = 0;
    _ = Sounds.failure.play();
    read_key_timeout = 0
}

function run() {
    try {
        if (read_key_timeout > 0) {
            read_key_timeout--
        }
        window.layers.forEach(function (s) {
            getLayer(s).clearRect(0, 0, wsc.width, wsc.height);
        });
        handler();
        frames++;
        requestAnimationFrame(run)
    } catch (e) {
        error(e)
    }
}

let t = 2, tsp = 0.1, isLoading = true;

function loading() {
    try {
        window.layers.forEach(function (s) {
            getLayer(s).clearRect(0, 0, wsc.width, wsc.height);
        });
        ctx.save();
        ctx.font = "34px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        if (t) {
            ctx.fillStyle = "rgba(255,255,255," + (1 / t) + ")"
        } else {
            ctx.fillStyle = "white"
        }
        t += tsp;
        if (t > 4) {
            tsp = -0.1
        } else {
            if (t < 2) {
                tsp = 0.1
            }
        }
        ctx.fillText("少女祈祷中...", 0.78 * wsc.width, 0.95 * wsc.height);
        ctx.font = "20px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        ctx.fillStyle = "white";
        ctx.fillText((window.loading_count / window.loading_total * 100).toFixed() + "%", 4, 0.99 * wsc.height);
        ctx.restore();
        if (isLoading || !Sounds.loading.paused && !config["FastStart"]) {
            requestAnimationFrame(loading)
        } else {
            img.style.display = "none";
            setInterval(function () {
                const new_timestamp = new Date().getTime();
                let fps = Math.floor(frames / ((new_timestamp - timestamp) / 1000)), fps_color = "green",
                    bcs = entities.length, bcs_color = "green";
                if (fps < 20) {
                    fps_color = "red"
                } else if (fps < 40) {
                    fps_color = "orange"
                }
                if (bcs > config["ECSMax"] * 3 / 4) {
                    bcs_color = "red"
                } else if (bcs > config["ECSMax"] / 2) {
                    bcs_color = "orange"
                }
                status.innerHTML =
                    "<span style='color:" + fps_color + "'>" + fps + "FPS</span>" +
                    "<span style='color:white'>/</span>" +
                    "<span style='color:" + bcs_color + "'>" + bcs + "ECS</span>";
                timestamp = new_timestamp;
                frames = 0;
            }, 1000);
            document.addEventListener("keydown", function (e) {
                if (read_key_timeout > 0) {
                    return
                }
                e = e || window["event"];
                let check = 0;
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] === e.key) {
                        check = 1;
                        break;
                    }
                }
                if (check === 0) {
                    keys.push(e.key);
                }
                if (e.key === config["KeyBoard"]["Slow"]) {
                    slow = true
                }
                if (restore) {
                    if (e.key.toLowerCase() === "z") {
                        restore = false;
                        loadMainMenu();
                        Sounds.ok.currentTime = 0;
                        _ = Sounds.ok.play();
                        requestAnimationFrame(run)
                    } else {
                        if (e.key === "Escape") {
                            win.close()
                        }
                    }
                }
            });
            document.addEventListener("keyup", function (e) {
                e = e || window["event"];
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] === e.key) {
                        keys.splice(i, 1);
                        break;
                    }
                }
                if (e.key === config["KeyBoard"]["Slow"]) {
                    slow = false
                }
            });
            loadMainMenu();
            requestAnimationFrame(run)
        }
    } catch (e) {
        error(e)
    }
}

let selectIndex = 0, score = 0;
const requireECS = 768;
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const wsc = pkg.window;
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const resources = JSON.parse(fs.readFileSync("./resources.json", "utf8"));
const save = JSON.parse(fs.readFileSync("./save.json", "utf8"));
const status = document.createElement("div");
status.style.position = "absolute";
status.style.bottom = "0";
status.style.right = "0";
status.style.fontSize = "large";
status.style.zIndex = "65535";
document.body.append(status);
const L = Math.PI / 180;
const entities = [], keys = [], main_menu = [], stage_menu = [];
let timestamp = 0, frames = 0, read_key_timeout = 0, h_score = save["highScore"],
    player_count = config["Player"], bomb = 3, power = 0, point = 0, graze = 0;
let handler, player;
const Tags = {
    enemy: "Enemy",
    player: "Player"
};
const Images = {
    background: {
        "11o26": getImage(resources["Images"]["background"]["11o26"]),
        "03_02": getImage(resources["Images"]["background"]["03_02"])
    },
    sidebar: {
        "bomb": getImage(resources["Images"]["sidebar"]["bomb"]),
        "life": getImage(resources["Images"]["sidebar"]["life"])
    },
    error: getImage(resources["Images"]["error"]),
    ply_border_01: getImage(resources["Images"]["ply_border_01"]),
    spell_name: getImage(resources["Images"]["spell_name"]),
    e_bullet_1: getImage(resources["Images"]["e_bullet_1"]),
    e_bullet_2: getImage(resources["Images"]["e_bullet_2"])
};
const Sounds = {
    loading: getAudio(resources["Sounds"]["loading"]),
    menu: getAudio(resources["Sounds"]["menu"]),
    test: getAudio(resources["Sounds"]["test"]),
    select: getAudio(resources["Sounds"]["select"]),
    ok: getAudio(resources["Sounds"]["ok"]),
    cancel: getAudio(resources["Sounds"]["cancel"]),
    pause: getAudio(resources["Sounds"]["pause"]),
    option: getAudio(resources["Sounds"]["option"]),
    miss: getAudio(resources["Sounds"]["miss"]),
    shoot: getAudio(resources["Sounds"]["shoot"]),
    change_track: getAudio(resources["Sounds"]["change_track"]),
    graze: getAudio(resources["Sounds"]["graze"]),
    failure: getAudio(resources["Sounds"]["failure"]),
    gun: getAudio(resources["Sounds"]["gun"]),
    cat0: getAudio(resources["Sounds"]["cat0"]),
    slash: getAudio(resources["Sounds"]["slash"]),
    bomb_shoot: getAudio(resources["Sounds"]["bomb_shoot"])
};
const stopSounds = [];
const img = document.createElement("img");
img.src = "./assets/images/loading.gif";
img.style.position = "absolute";
img.style.zIndex = "1";
img.style.top = "100px";
img.style.left = "100px";
document.body.appendChild(img);

try {
    const ECSMax = config["ECSMax"];
    if (ECSMax && ECSMax >= requireECS) {
        _ = Sounds.loading.play();
        requestAnimationFrame(loading);
        window.addEventListener("load", function () {
            isLoading = false;
        })
    } else {
        error(new Error("配置达不到最低要求：ECSMax = " + ECSMax + "，至少需要" + requireECS), true)
    }
} catch (e) {
    console.log(e);
    if (confirm(e.message)) {
        win.close();
    }
}
