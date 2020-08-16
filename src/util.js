import Observer from "./observer.js";

const fs = require("fs");

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

/**
 * HSL颜色值转换为RGB.
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @return  Array RGB色值数值
 * @param h 色相
 * @param s 饱和度
 * @param l 亮度
 */
export function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @return  Array HSL各值数组
 * @param r 红
 * @param g 绿
 * @param b 蓝
 */
export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/**
 * L = Math.PI / 180
 * @param x 速度
 * @param y 速度
 * @param angle 角度（弧度制：angle * L）
 * @returns {number[]}
 */
export function transTo(x, y, angle) {
    return [x * Math.cos(angle) + y * Math.sin(angle), y * Math.cos(angle) - x * Math.sin(angle)]
}

export function arrowTo(x, y, x1, y1, speed) {
    const s = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
    return [(x1 - x) / s * speed, (y1 - y) / s * speed]
}

export function RBox(xs, ys, angle) {
    this.name = "RBox";
    this.xs = xs;
    this.ys = ys;
    this.angle = angle;
    this.isHit = function (x1, y1, x2, y2, hitBox) {
        if (!isNaN(this.angle)) {
            x2 = x1 + (x2 - x1) * Math.cos(-this.angle) - (y2 - y1) * Math.sin(-this.angle);
            y2 = y1 + (x2 - x1) * Math.sin(-this.angle) + (y2 - y1) * Math.cos(-this.angle)
        }
        if (hitBox.name === "ABox") {
            const xx = x2 - x1, yy = y2 - y1, minX = Math.min(xx, this.xs / 2),
                maxX = Math.max(minX, -this.xs / 2),
                minY = Math.min(yy, this.ys / 2), maxY = Math.max(minY, -this.ys / 2);
            return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= hitBox.r * hitBox.r;
        } else if (hitBox.name === "RBox") {
            const maxX = x1 + this.xs >= x2 + hitBox.xs ? x1 + this.xs : x2 + hitBox.xs;
            const maxY = y1 + this.ys >= y2 + hitBox.ys ? y1 + this.ys : y2 + hitBox.ys;
            const minX = x1 <= x2 ? x1 : x2;
            const minY = y1 <= y2 ? y1 : y2;
            return maxX - minX <= this.xs + hitBox.xs && maxY - minY <= this.ys + hitBox.ys;
        }
    };
    this.isOut = function (x, y, xMax, yMax, mx, my) {
        return x + this.xs + this.xs < 0 && mx <= 0 || y + this.ys + this.ys < 0 && my <= 0
            || x > xMax && mx > 0 || y > yMax && my > 0
    };
    this.isOutScreen = function (x, y, mx, my) {
        return x < -4 * this.xs - GUI_SCREEN.X && mx <= 0 || y < -4 * this.ys - GUI_SCREEN.Y && my <= 0
            || x > GUI_SCREEN.X + GUI_SCREEN.WIDTH + this.xs + this.xs + GUI_SCREEN.X && mx > 0 || y > GUI_SCREEN.Y + GUI_SCREEN.HEIGHT + 2 * this.ys + GUI_SCREEN.Y && my > 0
    };
    this.inScreen = function (x, y) {
        if (x - this.xs / 2 < GUI_SCREEN.X) {
            x = this.xs / 2 + GUI_SCREEN.X;
        } else if (x + this.xs / 2 > GUI_SCREEN.X + GUI_SCREEN.WIDTH) {
            x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - this.xs / 2;
        }
        if (y - this.ys / 2 < GUI_SCREEN.Y) {
            y = this.ys / 2 + GUI_SCREEN.Y;
        } else if (y + this.ys / 2 > GUI_SCREEN.Y + GUI_SCREEN.HEIGHT) {
            y = GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - this.ys / 2;
        }
        return [x, y]
    }
}

export function ABox(r) {
    this.name = "ABox";
    this.r = r;
    this.isHit = function (x, y, x1, y1, hitBox) {
        if (hitBox.name === "ABox") {
            return Math.pow(this.r + hitBox.r, 2) >= Math.pow(x - x1, 2) + Math.pow(y - y1, 2);
        } else if (hitBox.name === "RBox") {
            const xx = x1 - x, yy = y1 - y, minX = Math.min(xx, hitBox.xs / 2),
                maxX = Math.max(minX, -hitBox.xs / 2),
                minY = Math.min(yy, hitBox.ys / 2), maxY = Math.max(minY, -hitBox.ys / 2);
            return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= this.r * this.r;
        }
    };
    this.isOut = function (x, y, xMax, yMax, mx, my) {
        return x - this.r < 0 && mx <= 0 || x + this.r > xMax && mx > 0
            || y - this.r < 0 && my <= 0 || y + this.r > yMax && my > 0
    };
    this.isOutScreen = function (x, y, mx, my) {
        return x < -this.r - GUI_SCREEN.X && mx <= 0 || x > GUI_SCREEN.X + GUI_SCREEN.WIDTH + this.r + GUI_SCREEN.X && mx > 0
            || y < -this.r - GUI_SCREEN.Y && my <= 0 || y > GUI_SCREEN.Y + GUI_SCREEN.HEIGHT + this.r + GUI_SCREEN.Y && my > 0
    };
    this.inScreen = function (x, y) {
        if (x - this.r < GUI_SCREEN.X) {
            x = this.r + GUI_SCREEN.X;
        } else if (x + this.r > GUI_SCREEN.X + GUI_SCREEN.WIDTH) {
            x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - this.r;
        }
        if (y - this.r < GUI_SCREEN.Y) {
            y = this.r + GUI_SCREEN.Y;
        } else if (y + this.r > GUI_SCREEN.Y + GUI_SCREEN.HEIGHT) {
            y = GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - this.r;
        }
        return [x, y]
    }
}

export function editImage(px, callback, ignoreColor) {
    if (!ignoreColor) {
        ignoreColor = [255, 255, 255]
    }
    for (let i = 0; i < px.data.length; i += 4) {
        if (px.data[i] === ignoreColor[0] && px.data[i + 1] === ignoreColor[1] && px.data[i + 2] === ignoreColor[2]) {
            continue;
        }
        const rgb = callback(px.data[i], px.data[i + 1], px.data[i + 2]);
        px.data[i] = rgb[0];
        px.data[i + 1] = rgb[1];
        px.data[i + 2] = rgb[2];
    }
    return px
}

// export function Super(parent, child) {
//     const Super = function () {
//     };
//     Super.prototype = parent.prototype;
//     child.prototype = new Super();
//     child.prototype.constructor = child
// }

export function pathEscape(s) {
    if (s[0] === "\\" || s[0] === "/") {
        s.splice(0, 1)
    }
    const sr = s[s.length - 1];
    if (sr !== "/") {
        if (sr === "\\") {
            s[s.length - 1] = "/"
        } else {
            s += "/"
        }
    }
    return s
}

export function joinPath(l, r) {
    return pathEscape(l) + pathEscape(r)
}

export function newImage(src, width, height) {
    const img = new Image();
    img.src = "./assets/images/" + src;
    img.style.width = width;
    img.style.height = height;
    img.addEventListener("load", function () {
        session.loadingCount++
    });
    session.loadingTotal++;
    return img
}

const sounds = [];
export const audioObserver = new Observer();

export function newAudio(name, volume = 100, type = "SE") {
    const audio = new Audio("./assets/sounds/" + name);
    audio.addEventListener("canplay", function () {
        if (session.loadingCount < session.loadingTotal) {
            session.loadingCount++
        }
        audio.volume = volume * config.Volume[type] / 10000
    });

    function onVolumeChange(e) {
        if (e.detail.type === type) {
            audio.volume = volume * config.Volume[type] / 10000
        }
    }

    audioObserver.addEventListener(EVENT_MAPPING.volumeChange, onVolumeChange);
    sounds.push(audio);
    session.loadingTotal++;
    return audio
}

const layers = new Set();
const screens = {};
const contexts = {};

export function clearScreen() {
    for (let layer of layers) {
        getLayer(layer).clearRect(0, 0, WIDTH, HEIGHT);
    }
}

function initScreen(screen, layerId) {
    screens[layerId] = screen;
    contexts[layerId] = screen.getContext("2d");
    contexts[layerId].clearRect(0, 0, WIDTH, HEIGHT);
    contexts[layerId].scale(screen.width / WIDTH, screen.height / HEIGHT);
    contexts[layerId].rect(0, 0, WIDTH, HEIGHT);
    contexts[layerId].clip();
    layers.add(layerId)
}


window.addEventListener("resize", function () {
    for (let layer of layers) {
        resizeScreen(screens[layer]);
        initScreen(screens[layer], layer)
    }
});

function resizeScreen(layer) {
    const trans = window.innerWidth / window.innerHeight;
    if (trans > WXH) {
        layer.height = window.innerHeight;
        layer.width = window.innerWidth / WXH;
        layer.style.left = (window.innerWidth - layer.width) / 2 + "px";
    } else if (trans === WXH) {
        layer.width = window.innerWidth;
        layer.height = window.innerHeight;
        layer.style.removeProperty("top");
        layer.style.removeProperty("left");
    } else {
        layer.width = window.innerWidth;
        layer.height = window.innerHeight / WXH;
        layer.style.top = (window.innerHeight - layer.height) / 2 + "px";
    }
}

function newLayer(layerId) {
    let layer;
    try {
        layer = document.getElementById("screen" + layerId)
    } catch (e) {
    }
    if (!layer) {
        layer = document.createElement("canvas");
        layer.id = "screen" + layerId;
        resizeScreen(layer);
        layer.style.zIndex = layerId;
        layer.innerHTML = "<span style='font-size:large;color:red' title='浏览器可能不支持canvas'>图层加载失败</span>";
        document.body.append(layer);
        initScreen(layer, layerId)
    }
}

export function getLayer(layerId) {
    if (!contexts[layerId]) {
        newLayer(layerId)
    }
    return contexts[layerId]
}

export function takeScreenShot(layerId) {
    let screen;
    if (layerId) {
        screen = screens[layerId]
    } else {
        screen = document.createElement("canvas");
        const base = getLayer(0);
        screen.width = base.canvas.width;
        screen.height = base.canvas.height;
        const ctx = screen.getContext("2d");
        ctx.fillRect(0, 0, screen.width, screen.height);
        const l = [];
        for (let layer of layers) {
            l.push(layer)
        }
        l.sort();
        const length = l.length;
        for (let i = 0; i < length; i++) {
            ctx.drawImage(screens[l[i]], 0, 0)
        }
    }
    if (screen) {
        return screen.toDataURL("png")
    } else {
        throw new Error("Get layer failure")
    }
}

export function downloadDataURL(dataURL, filename) {
    const a = document.createElement("a");
    a.download = filename;
    a.href = dataURL;
    a.click()
}

export function saveBase64(base64, filename, callback) {
    fs.writeFile(filename, new Buffer(base64, "base64"), function (e) {
        if (typeof callback === "function") {
            callback(e)
        } else {
            if (e) {
                console.error(e)
            } else {
                console.log("Write a file to:" + filename)
            }
        }
    })
}

export function getValidTimeFileName() {
    const now = new Date();
    return now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay() + "_" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds()
}

export function saveOrDownload(dataURL, path, name, callback) {
    const filename = joinPath(path, name);
    if (fs.existsSync(path) && !fs.existsSync(filename)) {
        if (typeof callback === "function") {
            saveBase64(dataURL.slice(dataURL.indexOf(",") + 1), filename, callback)
        } else {
            saveBase64(dataURL.slice(dataURL.indexOf(",") + 1), filename, function (e) {
                if (e) {
                    console.error(e);
                    downloadDataURL(dataURL, filename)
                }
            })
        }
    } else {
        downloadDataURL(dataURL, filename);
        if (typeof callback === "function") {
            callback()
        }
    }
}

export function rendererEntity() {
    const length = entities.length;
    for (let i = 0; i < length; i++) {
        try {
            entities[i].draw(entities[i])
        } catch (e) {
            console.error(entities[i]);
            throw e
        }
    }
}

export function tickingEntity() {
    let length = entities.length;
    for (let i = 0; i < length; i++) {
        const entity = entities[i];
        if (!entity.tick(entity)) {
            entities.splice(i, 1)
        }
        length = entities.length
    }
}

export function updateEntity() {
    let length = entities.length;
    for (let i = 0; i < length; i++) {
        const entity = entities[i];
        if (entity.tick(entity)) {
            entity.draw(entity);
        } else {
            entities.splice(i, 1)
        }
        length = entities.length
    }
}

export function clearEntity(callback, max = 1) {
    let count = 0;
    const length = entities.length;
    for (let i = 0; i < length; i++) {
        const entity = entities[i];
        if (callback(entity)) {
            entity.tags.add(TAGS.death);
            count++
        }
        if (count >= max) {
            return count
        }
    }
    return count
}

export function modifyEntity(callback, max = 1) {
    let count = 0;
    const length = entities.length;
    for (let i = 0; i < length; i++) {
        if (callback(entities[i])) {
            count++
        }
        if (count >= max) {
            return count
        }
    }
    return count
}

export const GUI_SCREEN = {
    X: 25,
    Y: 10,
    WIDTH: 390,
    HEIGHT: 460
};
export const entities = [];
export const debugLayerCache = {
    RBox: {},
    ABox: {},
    LINE: {}
};
export const session = {};
export let config = require("config.json");
export const resources = require("resources.json");
export let save;
if (fs.existsSync("save.json")) {
    save = require("save.json");
    session.highScore = save.highScore;
} else {
    session.highScore = 0
}
session.loadingCount = 0;
session.loadingTotal = 0;
session.score = 0;
session.slow = false;
session.keys = new Set();
session.debugFlag = false;
if (config.Player > 7 || config.Player < 1) {
    throw new Error("ConfigValueError: 'Player' must be an integer from 1~7.")
}
if (config.DeveloperMode === true) {
    session.developerMode = true
}

export function saveConfigToFile() {
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4))
}

export function resetAndSaveConfig() {
    config = {
        DeveloperMode: false,
        FastStart: false,
        FrameMax: "auto",
        FullScreen: false,
        EntityCountSecMax: 1024,
        Player: 3,
        GrazeMax: 99999,
        Volume: {
            BGM: 1,
            SE: 0.8
        },
        KeyBoard: {
            Up: "ArrowUp",
            Down: "ArrowDown",
            Left: "ArrowLeft",
            Right: "ArrowRight",
            Shoot: "Z",
            Bomb: "X",
            Slow: "Shift"
        },
        ScreenShot: "F:/Sync"
    };
    saveConfigToFile()
}

export function loadSaveFromFile() {
    save = require("save.json")
}

export function saveToFile(save) {
    fs.writeFileSync("./save.json", JSON.stringify(save))
}

export const WIDTH = 640;
export const HEIGHT = 480;
export const WXH = WIDTH / HEIGHT;
export const L = Math.PI / 180;
export const TAGS = {
    hostile: "Hostile",
    enemy: "Enemy",
    player: "Player",
    death: "Death",
    misc: "Misc",
    title: "Title"
};
export const EVENT_MAPPING = {
    load: "Load",
    left: "Left",
    right: "Right",
    up: "Up",
    down: "Down",
    upperLeft: "UpperLeft",
    lowerLeft: "LowerLeft",
    upperRight: "UpperRight",
    lowerRight: "LowerRight",
    shoot: "Shoot",
    bomb: "Bomb",
    clearEntity: "ClearEntity",
    cardEnEp: "CardEnEp",
    bossInit: "BossInit",
    miss: "Miss",
    changeBGM: "ChangeBGM",
    volumeChange: "VolumeChange"
};
// 背景-玩家-boss-弹幕(entity)/特效-符卡宣言-判定点-UI/效果/字幕-菜单-调试信息-错误/遮罩
// ----------场景----------------------UI-------------
// /：图层 -：绘制次序
export const LAYER_MAPPING = {
    STAGE: 0,
    UI: 1,
    EFFECT: 2,
    TITLE: 3,
    SHADE: 4
};
// 0图层可能重构为webgl
const Sticker = {};
const eBullet = newImage(resources.Images.eBullet);
const eBullet2 = newImage(resources.Images.eBullet2);
const eBullet6 = newImage(resources.Images.eBullet6);

export function drawSticker(type, color) {
    let x = 0, y = 0, w = 16, h = 16, canHue = true, image = eBullet;
    switch (type) {
        case "laser":
            break;
        case "scale":
            y = 16;
            canHue = false;
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
            image = eBullet2;
            w = 32;
            h = 32;
            break;
        case "bigStar":
            image = eBullet2;
            y = 32;
            w = 32;
            h = 32;
            break;
        case "knife":
            image = eBullet2;
            y = 64;
            w = 32;
            h = 32;
            break;
        case "heart":
            image = eBullet2;
            y = 96;
            w = 32;
            h = 32;
            break;
        case "butterfly":
            image = eBullet2;
            y = 128;
            w = 32;
            h = 32;
            break;
        case "oval":
            image = eBullet2;
            y = 160;
            w = 32;
            h = 32;
            break;
        case "big":
            image = eBullet2;
            y = 192;
            w = 64;
            h = 64;
            break;
        case "small_light_ball":
            image = eBullet2;
            y = 480;
            w = 32;
            h = 32;
            break;
        case "master_spark":
            image = eBullet6;
            w = 256;
            h = 512;
            if (color) {
                throw new Error("Type: master_spark is not support color.")
            }
            break;
        default:
            throw new Error("Type: " + type + " is not supported.")
    }
    if (isNaN(color)) {
        switch (color) {
            case "dimgray":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("dimgray " + type + " is not supported.")
                }
                break;
            case "darkgray":
                if (type === "coin") {
                    throw new Error("darkgray " + type + " is not supported.")
                }
                if (type !== "small_light_ball") {
                    x += w;
                }
                break;
            case "crimson":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("crimson " + type + " is not supported.")
                }
                x += 2 * w;
                break;
            case "red":
                if (type === "coin") {
                    throw new Error("red " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += w;
                } else {
                    x += 3 * w;
                }
                break;
            case "orangered":
                if (type === "coin") {
                    throw new Error("orangered " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 7 * w
                } else {
                    x += 4 * w;
                }
                break;
            case "gold":
                if (type === "coin") {
                    x = 0
                }
                if (type === "small_light_ball") {
                    x += 6 * w
                } else {
                    x += 5 * w;
                }
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
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("darkorange " + type + " is not supported.")
                }
                x += 6 * w;
                break;
            case "yellowgreen":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("yellowgreen " + type + " is not supported.")
                }
                x += 7 * w;
                break;
            case "green":
                if (type === "coin") {
                    throw new Error("green " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 5 * w
                } else {
                    x += 8 * w;
                }
                break;
            case "aqua":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("aqua " + type + " is not supported.")
                }
                x += 9 * w;
                break;
            case "water":
                if (type === "coin") {
                    throw new Error("lightseagreen " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 4 * w
                } else {
                    x += 10 * w;
                }
                break;
            case "blue":
                if (type === "coin") {
                    throw new Error("blue " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 3 * w
                } else {
                    x += 11 * w;
                }
                break;
            case "darkblue":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("darkblue " + type + " is not supported.")
                }
                x += 12 * w;
                break;
            case "purple":
                if (type === "coin") {
                    throw new Error("purple " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 2 * w
                } else {
                    x += 13 * w;
                }
                break;
            case "hotpink":
                if (type === "coin") {
                    throw new Error("hotpink " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 8 * w
                } else {
                    x += 14 * w;
                }
                break;
            default:
                if (type !== "master_spark") {
                    throw new Error(type + " Color: " + color + " is not supported.")
                }
        }
    } else {
        x += w;
    }
    if (x + w > image.width) {
        y += h;
        x -= image.width;
        x += w
    }
    if (!Sticker[type]) {
        Sticker[type] = {}
    }
    if (!Sticker[type][color]) {
        const canvas0 = document.createElement("canvas");
        canvas0.width = w;
        canvas0.height = h;
        const ctx = canvas0.getContext("2d");
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
        if (!isNaN(color)) {
            if (!canHue) {
                throw new Error(type + " Color: " + color + " is not supported.")
            }
            ctx.putImageData(editImage(ctx.getImageData(0, 0, w, h), function (r, g, b) {
                const hsl = rgbToHsl(r, g, b);
                return hslToRgb(color, 1, hsl[2]);
            }), 0, 0);
        }
        const graze = canvas0.cloneNode(true);
        const grazeCtx = graze.getContext("2d");
        grazeCtx.drawImage(canvas0, 0, 0);
        grazeCtx.globalCompositeOperation = "source-atop";
        grazeCtx.fillStyle = "rgba(249,255,1,0.5)";
        grazeCtx.fillRect(0, 0, graze.width, graze.height);
        const hit = canvas0.cloneNode(true);
        const hitCtx = hit.getContext("2d");
        hitCtx.drawImage(canvas0, 0, 0);
        hitCtx.globalCompositeOperation = "source-atop";
        hitCtx.fillStyle = "rgba(255,0,15,0.5)";
        hitCtx.fillRect(0, 0, hit.width, hit.height);
        Sticker[type][color] = {
            layer0: canvas0,
            graze: graze,
            hit: hit
        }
    }
    return Sticker[type][color]
}

const stopSounds = [];

export function stopAllSound() {
    for (let i = 0, length = sounds.length; i < length; i++) {
        if (!sounds[i].paused) {
            sounds[i].pause();
            stopSounds.push(sounds[i])
        }
    }
}

export function continueAllSound() {
    while (stopSounds.length > 0) {
        try {
            stopSounds.pop().play()
        } catch (e) {
        }
    }
}

export function cancelAllSound() {
    for (let i = 0, length = sounds.length; i < length; i++) {
        sounds[i].pause();
        sounds[i].currentTime = 0
    }
}
