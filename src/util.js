import DI from "./global.js";

const fs = require("fs");
DI();

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
 * 将速度转向
 * @param mx 速度
 * @param my 速度
 * @param rotationRad 弧度
 * @returns {number[]}
 */
export function transTo(mx, my, rotationRad) {
    return [mx * Math.cos(rotationRad) + my * Math.sin(rotationRad), my * Math.cos(rotationRad) - mx * Math.sin(rotationRad)]
}

export function arrowTo(x, y, x1, y1, speed) {
    const s = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
    return [(x1 - x) / s * speed, (y1 - y) / s * speed]
}

export function RBox(xs, ys, rotation = 0) {
    this.name = "RBox";
    this.xs = xs;
    this.ys = ys;
    // 单位：Rad
    this.rotation = rotation;
    this.isHit = function (x1, y1, x2, y2, hitBox) {
        if (!isNaN(this.rotation)) {
            x2 = x1 + (x2 - x1) * Math.cos(-this.rotation) - (y2 - y1) * Math.sin(-this.rotation);
            y2 = y1 + (x2 - x1) * Math.sin(-this.rotation) + (y2 - y1) * Math.cos(-this.rotation)
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
    this.isOutX = function (x, mx, xMax, xMin) {
        return mx < 0 && x < xMin - this.xs / 2 || mx > 0 && x > xMax + this.xs / 2
    };
    this.isOutedX = function (x, xMax, xMin) {
        return x < -this.xs / 2 - xMin || x > xMax + this.xs / 2
    }
    this.isOutY = function (y, my, yMax, yMin) {
        return my < 0 && y < yMin - this.ys / 2 || my > 0 && y > yMax + this.ys / 2
    };
    this.isOutedY = function (y, yMax, yMin) {
        return y < -this.ys / 2 - yMin || y > yMax + this.ys / 2
    }
    this.isOut = function (x, y, mx, my, xMax, yMax, xMin, yMin) {
        return this.isOutX(x, mx, xMax, xMin) || this.isOutY(y, my, yMax, yMin)
    };
    this.isOuted = function (x, y, xMax, yMax, xMin, yMin) {
        return this.isOutedX(x, xMax, xMin) || this.isOutedY(y, yMax, yMin)
    }
    this.isOutScreen = function (x, y, mx, my) {
        return this.isOut(x, y, mx, my, GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT,
            GUI_SCREEN.X, GUI_SCREEN.Y)
    };
    this.isOutedScreen = function (x, y) {
        return this.isOuted(x, y, GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT,
            GUI_SCREEN.X, GUI_SCREEN.Y)
    }
    this.isOverHead = function (x, y) {
        return (y < -this.ys / 2 - GUI_SCREEN.Y) && !this.isOutedX(x, GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.X)
    }
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
    this.isOutX = function (x, mx, xMax, xMin) {
        return mx < 0 && x < xMin - this.r || mx > 0 && x > xMax + this.r
    };
    this.isOutedX = function (x, xMax, xMin) {
        return x < -this.r - xMin || x > xMax + this.r
    };
    this.isOutY = function (y, my, yMax, yMin) {
        return my < 0 && y < yMin - this.r || my > 0 && y > yMax + this.r
    };
    this.isOutedY = function (y, yMax, yMin) {
        return y < -this.r - yMin || y > yMax + this.r
    };
    this.isOut = function (x, y, mx, my, xMax, yMax, xMin, yMin) {
        return this.isOutX(x, mx, xMax, xMin) || this.isOutY(y, my, yMax, yMin)
    };
    this.isOuted = function (x, y, xMax, yMax, xMin, yMin) {
        return this.isOutedX(x, xMax, xMin) || this.isOutedY(y, yMax, yMin)
    };
    this.isOutScreen = function (x, y, mx, my) {
        return this.isOut(x, y, mx, my, GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT,
            GUI_SCREEN.X, GUI_SCREEN.Y)
    };
    this.isOutedScreen = function (x, y) {
        return this.isOuted(x, y, GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT,
            GUI_SCREEN.X, GUI_SCREEN.Y)
    }
    this.isOverHead = function (x, y) {
        return (y < -this.r - GUI_SCREEN.Y) && !this.isOutedX(x, GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.X)
    }
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

export function randomPos(x = 0, y = 0, width = 0, height = 0, seed = undefined) {
    let X = GUI_SCREEN.X + x + Math.nextSeed(seed) * (GUI_SCREEN.WIDTH + width),
        Y = GUI_SCREEN.Y + y + Math.nextSeed(seed) * (GUI_SCREEN.HEIGHT + height)
    if (seed === undefined) {
        return [X, Y]
    } else {
        return [X, Y, Math.nextSeed(seed)]
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

const _path_ = require('path')

export function saveOrDownload(dataURL, path, name, callback) {
    if (fs.existsSync(path)) {
        const filename = _path_.join(path, name);
        if (!fs.existsSync(filename)) {
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
    } else {
        downloadDataURL(dataURL, name);
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
export const session = {};
export let options = JSON.parse(fs.readFileSync("options.json").toString());
export const pkg = JSON.parse(fs.readFileSync("package.json").toString())
export let profile;
if (!fs.existsSync("save")) {
    fs.mkdirSync("save")
}
if (fs.existsSync("save/profile.json")) {
    profile = JSON.parse(fs.readFileSync("save/profile.json").toString());
    session.highScore = profile.highScore;
} else {
    session.highScore = 0
}
session.score = 0;
session.slow = false;
session.keys = new Set();
session.debugFlag = false;
if (options.Player > 7 || options.Player < 1) {
    throw new Error("ConfigValueError: 'Player' must be an integer from 1~7.")
}
if (options.DeveloperMode === true) {
    session.developerMode = true
}

export function saveConfigToFile() {
    fs.writeFileSync("./options.json", JSON.stringify(options, null, 4))
}

export function resetAndSaveConfig() {
    options = {
        DeveloperMode: false,
        FastStart: true,
        Style: "random",
        PauseOnBlur: false,
        FrameMax: "auto",
        FullScreen: false,
        EntityCountSecMax: 16384,
        Player: 3,
        GrazeMax: 99999,
        ShootSlow: false,
        Idle: 360,
        MaxMutex: 4,
        Volume: {
            BGM: 80,
            SE: 60
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
        ScreenShot: "./screen_shot",
        Replay: "./replay",
        Hint: {
            mode: "off",
            path: "./hint"
        }
    };
    saveConfigToFile()
}

export function loadSaveFromFile() {
    if (!fs.existsSync("save/profile.json")) {
        saveToFile({
            highScore: 0
        })
    }
    profile = JSON.parse(fs.readFileSync("save/profile.json").toString())
}

export function saveToFile(save) {
    fs.writeFileSync("./save/profile.json", JSON.stringify(save))
}

export const L = Math.PI / 180;
export const TAGS = {
    hostile: "Hostile",
    enemy: "Enemy",
    player: "Player",
    death: "Death",
    misc: "Misc",
    title: "Title",
    hit: "Hit",
    envoy: "Envoy",
    monster: "Monster",
    human: "Human",
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
    volumeChange: "VolumeChange",
    shift: "Shift",
    unshift: "UnShift"
};

export const STAGE_VER = 1;

if (!fs.existsSync(options.Replay)) {
    fs.mkdirSync(options.Replay)
}

export function saveReplay(name, stg, rand, eventList) {
    const version = pkg.version
    const EntityCountSecMax = options.EntityCountSecMax
    fs.writeFileSync(options.Replay + "/" + new Date().valueOf() + ".json", JSON.stringify({
        name, stg, rand, eventList, STAGE_VER, version, EntityCountSecMax
    }))
}

export function timeEscape(t = 0., iteration = false, option = {}) {
    option.ms = option.ms || "";
    option.s = option.s || "";
    option.min = option.min || ":";
    option.hour = option.hour || ":";
    option.day = option.day || " ";
    option.current = option.current || "0";
    option.outdate = option.outdate || "-";
    if (t < 1) {
        if (t > 0 && !iteration) {
            return Math.prefix(t * 1000, 3) + (option.ms)
        } else if (t === 0) {
            if (iteration) {
                return ""
            } else {
                return option.current
            }
        } else {
            return option.outdate + timeEscape(-t)
        }
    } else if (t < 60) {
        return Math.prefix(t) + option.s
    } else if (t < 3600) {
        return Math.prefix(t / 60) + option.min + timeEscape(t % 60, true)
    } else if (t < 86400) {
        return Math.prefix(t / 3600) + option.hour + timeEscape(t % 3600, true)
    } else {
        return Math.prefix(t / 86400) + option.day + timeEscape(t % 86400, true)
    }
}

export function consoleTime(t) {
    if (t === undefined) {
        t = getTimeZoneWithTime()
    }
    if (t < 1000) {
        if (t >= 0) {
            return Math.prefix(t, 3)
        } else {
            return "-" + consoleTime(-t)
        }
    } else if (t < 60000) {
        return Math.prefix(t / 1000) + "." + consoleTime(t % 1000)
    } else if (t < 3600000) {
        return Math.prefix(t / 60000) + ":" + consoleTime(t % 60000)
    } else if (t < 86400000) {
        return Math.prefix(t / 3600000) + ":" + consoleTime(t % 3600000)
    } else {
        return consoleTime(t % 86400000)
    }
}

export function getTimeZoneWithTime() {
    return new Date().valueOf() % 86400000 - new Date().getTimezoneOffset() * 60000
}

export const HINT_VER = 1;
export const AUTO_HINT = "hint_auto";

export function saveHint(name, timestamp, hint) {
    const version = pkg.version
    fs.writeFileSync(options.Hint.path + "/" + name + ".json", JSON.stringify({
        HINT_VER, timestamp, hint, version
    }))
}

export function batchExecute(/* [function] */flist) {
    return (...arg) => {
        const results = []
        for (const f of flist) {
            results.push(f(...arg))
        }
        return results
    }
}

export function delayExecute(f, delay) {
    let step = 0
    return (...arg) => {
        if (step > delay) {
            return f(...arg)
        }
        step++
    }
}

export function onceExecute(f) {
    let executed = false
    return (...arg) => {
        if (!executed) {
            executed = true
            return f(...arg)
        }
    }
}

export function intervalExecute(f, interval) {
    let step = 0
    return (...arg) => {
        if (step > interval) {
            step = 0
            return f(...arg)
        }
        step++
    }
}