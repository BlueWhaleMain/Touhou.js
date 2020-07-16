import prefabs from "./src/prefabs.js";
import {
    ABox,
    arrowTo,
    clear_screen,
    clearScreen,
    entities,
    getLayer,
    height,
    Images,
    Sounds,
    Super,
    transTo,
    stopAllSound,
    cancelAllSound,
    continueAllSound,
    drawSticker,
    width
} from "./src/util.js";
import health from "./src/components/health.js";
import movable from "./src/components/movable.js";
import green_orb from "./src/prefabs/green_orb.js";
import power_orb from "./src/prefabs/power_orb.js";
import menu_item from "./src/prefabs/menu_item.js";
import menu_star from "./src/prefabs/menu_star.js";

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

function saveToFile() {
    save["highScore"] = h_score;
    fs.writeFileSync('./save.json', JSON.stringify(save))
}

function EnemyBullet() {
    prefabs.call(this);
    this.addComponent("movable", movable);
    this.tags.add(Tags.enemy);
    this.canGraze = true;
    this.hit = function () {
        if (this.atkBox) {
            if (this.atkBox.isHit(this.X, this.Y, player.X, player.Y, player.pickBox)) {
                if (this.canGraze || this.canGraze === undefined) {
                    player.graze++;
                    window.score += 500;
                    window.score += player.point * 10;
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
                    window.score += player.point * 100;
                    this.tags.add("death")
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

(Super)(prefabs, EnemyBullet);

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
            if (self.tags.has("death")) {
                return
            }
            const speed = arrowTo(self.X, self.Y, player.X, player.Y, Math.sqrt(Math.pow(self.components["movable"].MX, 2) + Math.pow(self.components["movable"].MY, 2)));
            self.components["movable"].MX = speed[0];
            self.components["movable"].MY = speed[1];
            Sounds.change_track.currentTime = 0;
            _ = Sounds.change_track.play()
        }, spy)
    }
}

(Super)(EnemyBullet, Jade);

function PlayerBullet() {
    prefabs.call(this);
    this.addComponent("movable", movable);
    this.tags.add(Tags.player);
    this.hit = function (enemy) {
        if (this.atkBox && enemy.components["health"]) {
            if (this.atkBox.isHit(this.X, this.Y, enemy.X, enemy.Y, enemy.hitBox)) {
                enemy.components["health"].doDelta(-this.power)
            }
        }
    };
}

(Super)(prefabs, PlayerBullet);

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
    prefabs.call(this);
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
    this.player_count = config["Player"];
    this.bomb_count = 3;
    this.power = 0;
    this.point = 0;
    this.graze = 0;
    this.inScreen = function () {
        const p = this.grazeBox.inScreen(this.X, this.Y, 46, 14, 832, 940);
        this.X = p[0];
        this.Y = p[1]
    };
    this.left = function () {
        if (this.miss) {
            return
        }
        if (slow) {
            this.X -= this.lowSpeed
        } else {
            this.X -= this.highSpeed
        }
        this.inScreen()
    };
    this.right = function () {
        if (this.miss) {
            return
        }
        if (slow) {
            this.X += this.lowSpeed
        } else {
            this.X += this.highSpeed
        }
        this.inScreen()
    };
    this.up = function () {
        if (this.miss) {
            return
        }
        if (slow) {
            this.Y -= this.lowSpeed
        } else {
            this.Y -= this.highSpeed
        }
        this.inScreen()
    };
    this.down = function () {
        if (this.miss) {
            return
        }
        if (slow) {
            this.Y += this.lowSpeed
        } else {
            this.Y += this.highSpeed
        }
        this.inScreen()
    };
    this.die = function () {
        if (this.miss) {
            return
        }
        if (this.indTime < 0) {
            this.miss = true;
            _ = Sounds.miss.play()
        }
    };
    this.shoot = function (self) {
        if (this.shoot_delay === 0) {
            if (this.option.shoot) {
                this.option.shoot(self)
            }
            window.score += 100;
            window.score += self.power * 100;
            Sounds.shoot.currentTime = 0;
            _ = Sounds.shoot.play();
            this.shoot_delay = this.option.shoot_delay
        }
    };
    this.bomb = function (self) {
        if (self.bomb_count > 0 && this.bombTime < 0) {
            self.bomb_count--;
            if (this.option.bomb) {
                this.option.bomb(self)
            }
            self.miss = false;
        }
    };
    this.addComponent("PlayerTick", function () {
        this.tick = function (self) {
            if (self.miss) {
                if (self.indTime < 0) {
                    self.indTime++
                }
                if (self.indTime === 0) {
                    self.indTime = 300;
                    if (self.player_count > 0) {
                        self.player_count--
                    }
                    self.bomb_count = 3;
                    self.power = 0;
                    if (self.player_count > 0) {
                        entities.push(power_orb(self.X, self.Y, 0, Math.min(28 - self.Y * self.pickLine, 0), "big"));
                        entities.push(power_orb(self.X, self.Y, -26, Math.min(20 - self.Y * self.pickLine, 0), "big"));
                        entities.push(power_orb(self.X, self.Y, 26, Math.min(20 - self.Y * self.pickLine, 0), "big"));
                        entities.push(power_orb(self.X, self.Y, -44, Math.min(18 - self.Y * self.pickLine, 0)));
                        entities.push(power_orb(self.X, self.Y, 44, Math.min(18 - self.Y * self.pickLine, 0)));
                        entities.push(power_orb(self.X, self.Y, -56, -self.Y * self.pickLine));
                        entities.push(power_orb(self.X, self.Y, 56, -self.Y * self.pickLine));
                    } else {
                        entities.push(power_orb(self.X, self.Y, -22, Math.min(4 - self.Y * self.pickLine, 0), "big"));
                        entities.push(power_orb(self.X, self.Y, 22, Math.min(4 - self.Y * self.pickLine, 0), "big"));
                        entities.push(power_orb(self.X, self.Y, -30, -self.Y * self.pickLine, "big"));
                        entities.push(power_orb(self.X, self.Y, 30, -self.Y * self.pickLine, "big"));
                    }
                    self.X = 440;
                    self.Y = 730;
                    clear_screen(function (entity) {
                        return entity.tags.has(Tags.enemy)
                    });
                    self.miss = false
                }
            } else {
                if (self.bombTime > 0) {
                    self.indTime = 10;
                    if (self.bombLay) {
                        self.bombLay()
                    }
                    self.bombTime--
                }
                if (self.bombTime < 0) {
                    if (self.indTime > 0) {
                        self.indTime--
                    } else {
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
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        }
    });
}

(Super)(prefabs, AbstractPlayer);

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
        if (self.power < 99) {
            entities.push(new RumiaOrb(self.X, self.Y, 0, -40));
        }
        if (self.power >= 100) {
            entities.push(new RumiaOrb(self.X + 10, self.Y, 0, -40));
            entities.push(new RumiaOrb(self.X - 10, self.Y, 0, -40));
        }
        let temp;
        if (self.power >= 200 && self.shoot_count % 2 === 0 || self.power >= 300) {
            temp = transTo(0, -40, tx * L);
            entities.push(new RumiaOrb(self.X - 20, self.Y, temp[0], temp[1]));
            temp = transTo(0, -40, -tx * L);
            entities.push(new RumiaOrb(self.X + 20, self.Y, temp[0], temp[1]));
        }
        if (self.power >= 400) {
            temp = transTo(0, -40, th * L);
            entities.push(new RumiaOrb(self.X + 20, self.Y, temp[0], temp[1]));
            temp = transTo(0, -40, -th * L);
            entities.push(new RumiaOrb(self.X - 20, self.Y, temp[0], temp[1]));
        }
    };
    this.option.bomb = function (self) {
        _ = Sounds.cat0.play();
        if (self.miss) {
            self.bombTime = 500
        } else {
            self.bombTime = 300
        }
    };
    this.bombLay = function () {
        const box = new ABox(this.bombTime);
        clear_screen(function (entity) {
            if (entity.tags.has(Tags.enemy) && entity.atkBox.isHit(entity.X, entity.Y, player.X, player.Y, box)) {
                entities.push(green_orb(entity.X, entity.Y, 0, -2, "small"));
                return true
            }
        });
    };
    this.bombOut = function () {
        clear_screen(function (entity) {
            if (entity.tags.has(Tags.enemy)) {
                entities.push(green_orb(entity.X, entity.Y, 0, -2, "small"));
                return true
            }
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
            ctx.drawImage(this.background, 12.8, 9.6 + step)
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
        window.score = 0
    }
}

function TestStage() {
    AbstractStage.call(this);
    this.music = Sounds.test;
    this.musicLoop = 145.1;
    this.musicIn = 0;
    const cache = document.createElement("canvas");
    cache.width = 832;
    cache.height = 1056;
    const cache_draw = cache.getContext("2d");
    const ctx = getLayer(0);
    cache_draw.fillStyle = ctx.createPattern(Images.background["03_02"], "repeat");
    cache_draw.fillRect(0, 0, cache.width, cache.height);
    this.background = cache;
    this.backgroundLoop = 0;
    this.backgroundIn = -128;
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
        layer.fillText("TestStage", 358, 288);
        layer.restore();
    };
    const ctx1 = getLayer(1);
    this.option.draw = function () {
        ctx1.drawImage(Images.spell_name, 570, 28);
        ctx1.save();
        ctx1.font = "16px Comic Sans MS";
        ctx1.fillStyle = "white";
        ctx1.shadowColor = "black";
        ctx1.shadowBlur = 5;
        ctx1.fillText("夜符「Night Bird」", 678, 58);
        ctx1.font = "20px Comic Sans MS";
        ctx1.fillText("99", 806, 38);
        ctx1.restore();
    };
    let frame = 0;
    let c = 0;
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
        if (0 < frame && frame < 17) {
            let j = frame;
            for (let k = 0; k < 3; k++) {
                let speed = arrowTo(440, 300, player.X, player.Y, (0.08 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16);
                speed = transTo(speed[0], speed[1], (90 - 90 / 16 * j - 3) * L);
                entities.push(new Jade("ring", "water", 440, 300, speed[0], speed[1]))
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play()
        }
        if (17 < frame && frame < 33) {
            let j = frame - 16;
            for (let k = 0; k < 3; k++) {
                let speed = arrowTo(440, 300, player.X, player.Y, (0.08 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16);
                speed = transTo(speed[0], speed[1], (-90 + 90 / 16 * j) * L);
                entities.push(new Jade("ring", "purple", 440, 300, speed[0], speed[1]))
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play()
        }
        frame++;
        if (frame > 48) {
            frame = 0;
            c++
        }
        if (c === 4) {
            c = 0;
            frame = -60
        }
        window.score++
    }
}

Super(AbstractStage, TestStage);

function transitions(f) {
    cancelAllSound();
    if (typeof f === "function") {
        isLoading = true;
        Sounds.loading.play().finally(function () {
            isLoading = false
        });
        img.style.display = "block";
        handler = function () {
            loading(f)
        };
    }
    selectIndex = 0;
    pause = false;
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
    stage_menu.push(menu_item(100, 550, "解除暂停"));
    stage_menu.push(menu_item(100, 590, "返回至主菜单"));
    stage_menu.push(menu_item(100, 630, "从头开始"));
    stage_menu[0].select();
}

function loadMainMenu() {
    transitions(menu);
    main_menu.push(menu_item(960, 550, "Game Start"));
    main_menu.push(menu_item(960, 590, "Extra Start"));
    main_menu.push(menu_item(960, 630, "Test"));
    main_menu.push(menu_item(960, 670, "Replay"));
    main_menu.push(menu_item(960, 710, "Play Data"));
    main_menu.push(menu_item(960, 750, "Music Room"));
    main_menu.push(menu_item(960, 790, "Option"));
    main_menu.push(menu_item(960, 830, "Quit"));
    main_menu[0].select();
}

let gui_bg_cache;

const ctx = getLayer(0);

function renderer_gui() {
    if (player.graze > config["GrazeMax"]) {
        player.graze = config["GrazeMax"]
    }
    if (window.score > h_score) {
        h_score = window.score
    }
    ctx.save();
    if (!gui_bg_cache) {
        gui_bg_cache = document.createElement("canvas");
        gui_bg_cache.width = width;
        gui_bg_cache.height = height;
        const cache_draw = gui_bg_cache.getContext("2d");
        cache_draw.fillStyle = ctx.createPattern(Images.background["11o26"], "repeat");
        cache_draw.fillRect(0, 0, width, height);
        cache_draw.shadowBlur = 10;
        cache_draw.globalCompositeOperation = "destination-out";
        cache_draw.fillStyle = "black";
        cache_draw.shadowColor = "black";
        cache_draw.roundRect(50, 20, 780, 922, 10).fill();
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
    ctx.fillText("HiScore    " + s, 858, 120);
    s = window.score.toString();
    while (s.length < 9) {
        s = "0" + s
    }
    ctx.fillText("Score    " + s, 893, 160);
    ctx.fillText("Player", 884, 198);
    for (let i = 0; i < player.player_count; i++) {
        ctx.drawImage(Images.sidebar.life, 1024 + i * 32, 172, 32, 32)
    }
    ctx.fillText("Bomb", 890, 236);
    for (let i = 0; i < player.bomb_count; i++) {
        ctx.drawImage(Images.sidebar.bomb, 1024 + i * 32, 206, 32, 32)
    }
    ctx.fillText("Power", 888, 274);
    s = player.power.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx.fillText("Point    " + player.point, 906, 312);
    ctx.fillText("Graze    " + player.graze, 890, 350);
    ctx.fillText(s[0] + ".", 1024, 274);
    ctx.fillText("/", 1082, 274);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(s.substr(1, 2), 1052, 274);
    s = player.power_max.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx.font = "34px Comic Sans MS";
    ctx.fillText(s[0] + ".", 1100, 274);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(s.substr(1, 2), 1128, 274);
    ctx.restore();
}

let stage, pause = false, slow = false;

const ctx1 = getLayer(1);

function test() {
    if (!stage) {
        player = new Rumia();
        window.player = player;
        stage = new TestStage()
    }
    if (pause) {
        stage.draw();
        rendererEntity();
        stage_menu.forEach(function (g) {
            g.draw(g);
        });
        ctx.drawImage(Images.border_line, 46, (1 - player.pickLine) * 940 - 68.6, 786, 157.2);
        ctx1.save();
        ctx1.fillStyle = "rgba(255,0,10,0.5)";
        ctx1.fillRect(0, 0, width, height);
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
                    switch (selectIndex) {
                        case 0:
                            continueAllSound();
                            pause = false;
                            break;
                        case 1:
                            loadMainMenu();
                            Sounds.ok.currentTime = 0;
                            _ = Sounds.ok.play();
                            return;
                        case 2:
                            transitions(test);
                            return;
                        default:
                            Sounds.invalid.currentTime = 0;
                            _ = Sounds.invalid.play()
                    }
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
        entities.push(menu_star(Math.random() * width, Math.random() * height, 0, 0.5, Math.random() * 2));
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
                switch (selectIndex) {
                    case 2:
                        transitions(test);
                        Sounds.ok.currentTime = 0;
                        _ = Sounds.ok.play();
                        return;
                    case 7:
                        win.close();
                        break;
                    default:
                        Sounds.invalid.currentTime = 0;
                        _ = Sounds.invalid.play()
                }
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

let restore = false;

function error(e, fatal = false) {
    console.error(e);
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    clearScreen();
    cancelAllSound();
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "red";
    let y = 20;
    if (fatal) {
        ctx.fillText("哦豁，完蛋：", 4, y);
        ctx.fillText("[!]这是一个致命错误", 4, 950)
    } else {
        ctx.drawImage(Images.error, 740, 400);
        ctx.fillText("啊这，发生了一点错误：", 4, y);
        ctx.fillText("按[Z]返回主菜单", 4, 922);
        ctx.fillText("按[Esc]退出", 4, 950);
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
        clearScreen();
        handler();
        frames++;
        nextFrame(run)
    } catch (e) {
        error(e)
    }
}

let t = 2, tsp = 0.1, isLoading = true;

function loading(f) {
    try {
        clearScreen();
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
        ctx.fillText("少女祈祷中...", 1050, 930);
        ctx.font = "20px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        ctx.fillStyle = "white";
        ctx.fillText((window.loading_count / window.loading_total * 100).toFixed() + "%", 0, 958);
        ctx.restore();
        if (!isLoading && (Sounds.loading.paused || config["FastStart"])) {
            if (!Sounds.loading.paused) {
                Sounds.loading.pause();
                Sounds.loading.currentTime = 0;
            }
            img.style.display = "none";
            handler = f
        }
    } catch (e) {
        error(e)
    }
}

let n = 1000;

function nextFrame(f) {
    if (isNaN(config["FrameMax"])) {
        requestAnimationFrame(f)
    } else {
        setTimeout(f, n / config["FrameMax"])
    }
}

window.score = 0;
let selectIndex = 0;
const requireECS = 768;
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const save = JSON.parse(fs.readFileSync("./save.json", "utf8"));
const status = document.createElement("div");
status.style.position = "absolute";
status.style.bottom = "0";
status.style.right = "0";
status.style.fontSize = "large";
status.style.zIndex = "65535";
document.body.append(status);
const L = Math.PI / 180;
const keys = [], main_menu = [], stage_menu = [];
let timestamp = 0, frames = 0, read_key_timeout = 0, h_score = save["highScore"];
let handler;
const Tags = {
    enemy: "Enemy",
    player: "Player"
};
let player;
const img = document.createElement("img");
img.src = "./assets/images/loading.gif";
img.style.position = "absolute";
img.style.zIndex = "1";
img.style.top = "200px";
img.style.left = "300px";
document.body.appendChild(img);

try {
    const ECSMax = config["ECSMax"];
    if (ECSMax && ECSMax >= requireECS) {
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
            if (config["FrameMax"] !== frames) {
                n = 1000 * frames / config["FrameMax"]
            }
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
                    nextFrame(run)
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
        nextFrame(run)
    } else {
        error(new Error("配置达不到最低要求：ECSMax = " + ECSMax + "，至少需要" + requireECS), true)
    }
} catch (e) {
    console.log(e);
    if (confirm(e.message)) {
        win.close();
    }
}
