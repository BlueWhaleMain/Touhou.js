const fs = require("fs");

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

export function transTo(x, y, angle) {
    return [x * Math.cos(angle) + y * Math.sin(angle), y * Math.cos(angle) - x * Math.sin(angle)]
}

export function arrowTo(x, y, x1, y1, speed) {
    const s = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
    return [(x1 - x) / s * speed, (y1 - y) / s * speed]
}

export function RBox(xs, ys) {
    this.name = "RBox";
    this.xs = xs;
    this.ys = ys;
    this.isHit = function (x1, y1, x2, y2, hitBox) {
        if (hitBox.name === "ABox") {
            const xx = x2 - x1, yy = y2 - y1, minX = Math.min(xx, xs / 2),
                maxX = Math.max(minX, -xs / 2),
                minY = Math.min(yy, ys / 2), maxY = Math.max(minY, -ys / 2);
            return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= hitBox.r * hitBox.r;
        } else if (hitBox.name === "RBox") {
            const width1 = xs, height1 = ys, width2 = hitBox.xs, height2 = hitBox.ys;
            let flag;
            if (xs >= hitBox.xs && hitBox.xs <= xs - width1 / 2 - width2 / 2) {
                flag = false;
            } else if (xs <= hitBox.xs && hitBox.xs >= xs + width1 / 2 + width2 / 2) {
                flag = false;
            } else if (ys >= hitBox.ys && hitBox.ys <= ys - height1 / 2 - height2 / 2) {
                flag = false;
            } else flag = !(ys <= hitBox.ys && hitBox.ys >= ys + height1 / 2 + height2 / 2);
            return flag;
        }
    };
    this.isOut = function (x, y, x_max, y_max, mx, my) {
        return x + xs * 2 < 0 && mx <= 0 || y + ys * 2 < 0 && my <= 0
            || x > x_max && mx > 0 || y > y_max && my > 0
    };
    this.isOutScreen = function (x, y, x_max, y_max, mx, my) {
        return x + xs * 2 < -2 * xs - 10 && mx <= 0 || y + ys * 2 < -2 * ys - 10 && my <= 0
            || x > x_max + 2 * xs + 10 && mx > 0 || y > y_max + 2 * ys + 10 && my > 0
    };
}

export function ABox(r) {
    this.name = "ABox";
    this.r = r;
    this.isHit = function (x, y, x1, y1, hitBox) {
        if (hitBox.name === "ABox") {
            return Math.pow(r + hitBox.r, 2) >= Math.pow(x - x1, 2) + Math.pow(y - y1, 2);
        } else if (hitBox.name === "RBox") {
            const xx = x1 - x, yy = y1 - y, minX = Math.min(xx, hitBox.xs / 2),
                maxX = Math.max(minX, -hitBox.xs / 2),
                minY = Math.min(yy, hitBox.ys / 2), maxY = Math.max(minY, -hitBox.ys / 2);
            return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= r * r;
        }
    };
    this.isOut = function (x, y, x_max, y_max, mx, my) {
        return x - this.r < 0 && mx <= 0 || x + this.r > x_max && mx > 0
            || y - this.r < 0 && my <= 0 || y + this.r > y_max && my > 0
    };
    this.isOutScreen = function (x, y, x_max, y_max, mx, my) {
        return x - this.r < -2 * this.r - 10 && mx <= 0 || x + this.r > x_max + 2 * this.r + 10 && mx > 0
            || y - this.r < -2 * this.r - 10 && my <= 0 || y + this.r > y_max + 2 * this.r + 10 && my > 0
    };
    this.inScreen = function (x, y, x_min, y_min, x_max, y_max) {
        if (x - r < x_min) {
            x = r + x_min;
        } else if (x + r > x_max) {
            x = x_max - r;
        }
        if (y - r < y_min) {
            y = r + y_min;
        } else if (y + r > y_max) {
            y = y_max - r;
        }
        return [x, y]
    }
}

export function editImage(px, callback, ignore_color) {
    if (!ignore_color) {
        ignore_color = [255, 255, 255]
    }
    for (let i = 0; i < px.data.length; i += 4) {
        if (px.data[i] === ignore_color[0] && px.data[i + 1] === ignore_color[1] && px.data[i + 2] === ignore_color[2]) {
            continue;
        }
        const rgb = callback(px.data[i], px.data[i + 1], px.data[i + 2]);
        px.data[i] = rgb[0];
        px.data[i + 1] = rgb[1];
        px.data[i + 2] = rgb[2];
    }
    return px
}

export function Super(parent, child) {
    const Super = function () {
    };
    Super.prototype = parent.prototype;
    child.prototype = new Super();
    child.prototype.constructor = child
}

// export function pathEscape(s) {
//     if (s[0] === "\\" || s[0] === "/") {
//         s.splice(0, 1)
//     }
//     const sr = s[s.length - 1];
//     if (sr !== "/") {
//         if (sr === "\\") {
//             s[s.length - 1] = "/"
//         } else {
//             s += "/"
//         }
//     }
//     return s
// }
//
// export function joinPath(l, r) {
//     return pathEscape(l) + pathEscape(r)
// }

window.loading_count = 0;
window.loading_total = 0;

export function newImage(src, width, height) {
    const img = new Image();
    img.src = "./assets/images/" + src;
    img.style.width = width;
    img.style.height = height;
    img.addEventListener("load", function () {
        window.loading_count++
    });
    window.loading_total++;
    return img
}

export function newAudio(name) {
    const audio = new Audio("./assets/sounds/" + name);
    audio.addEventListener("canplay", function () {
        if (window.loading_count < window.loading_total) {
            window.loading_count++
        }
    });
    window.loading_total++;
    return audio
}

const layers = new Set();
const screens = {};
const contexts = {};

export function clearScreen() {
    layers.forEach(function (s) {
        getLayer(s).clearRect(0, 0, width, height);
    });
}

function initScreen(screen, layer_id) {
    screens[layer_id] = screen;
    contexts[layer_id] = screen.getContext("2d");
    contexts[layer_id].clearRect(0, 0, screen.width, screen.height);
    layers.add(layer_id)
}

function newLayer(layer_id) {
    let layer = undefined;
    try {
        layer = document.getElementById("screen_" + layer_id)
    } catch (e) {
    }
    if (!layer) {
        layer = document.createElement("canvas");
        layer.id = "screen_" + layer_id;
        layer.width = width;
        layer.height = height;
        layer.style.position = "absolute";
        layer.style.zIndex = layer_id;
        layer.style.width = pkg.window.width - 2 + "px";
        layer.style.height = pkg.window.height - 1 + "px";
        layer.innerHTML = "<span style='font-size:large;color:red' title='浏览器可能不支持canvas'>图层加载失败</span>";
        document.body.append(layer);
        initScreen(layer, layer_id)
    }
}

export function getLayer(layer_id) {
    if (!contexts[layer_id]) {
        newLayer(layer_id)
    }
    return contexts[layer_id]
}

export function clear_screen(callback) {
    let count = 0;
    entities.forEach(function (entity) {
        if (callback(entity)) {
            entity.tags.add("death");
            count++
        }
    });
    return count
}

export const entities = [];
export const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
export const width = 1280;
export const height = 960;
const resources = JSON.parse(fs.readFileSync("./resources.json", "utf8"));
export const Images = {
    background: {
        "11o26": newImage(resources["Images"]["background"]["11o26"]),
        "03_02": newImage(resources["Images"]["background"]["03_02"])
    },
    sidebar: {
        "bomb": newImage(resources["Images"]["sidebar"]["bomb"]),
        "life": newImage(resources["Images"]["sidebar"]["life"])
    },
    error: newImage(resources["Images"]["error"]),
    border_line: newImage(resources["Images"]["border_line"]),
    ply_border_01: newImage(resources["Images"]["ply_border_01"]),
    spell_name: newImage(resources["Images"]["spell_name"]),
    e_bullet_1: newImage(resources["Images"]["e_bullet_1"]),
    e_bullet_2: newImage(resources["Images"]["e_bullet_2"]),
    power_orb: newImage(resources["Images"]["power_orb"])
};

const jade = {};

export function drawSticker(type, color) {
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
            ctx.putImageData(editImage(ctx.getImageData(0, 0, w, h), function (r, g, b) {
                const hsl = rgbToHsl(r, g, b);
                return hslToRgb(color, 1, hsl[2]);
            }), 0, 0);
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

export const Sounds = {
    loading: newAudio(resources["Sounds"]["loading"]),
    menu: newAudio(resources["Sounds"]["menu"]),
    test: newAudio(resources["Sounds"]["test"]),
    select: newAudio(resources["Sounds"]["select"]),
    invalid: newAudio(resources["Sounds"]["invalid"]),
    ok: newAudio(resources["Sounds"]["ok"]),
    cancel: newAudio(resources["Sounds"]["cancel"]),
    pause: newAudio(resources["Sounds"]["pause"]),
    option: newAudio(resources["Sounds"]["option"]),
    miss: newAudio(resources["Sounds"]["miss"]),
    shoot: newAudio(resources["Sounds"]["shoot"]),
    power_up: newAudio(resources["Sounds"]["power_up"]),
    item: newAudio(resources["Sounds"]["item"]),
    change_track: newAudio(resources["Sounds"]["change_track"]),
    graze: newAudio(resources["Sounds"]["graze"]),
    failure: newAudio(resources["Sounds"]["failure"]),
    gun: newAudio(resources["Sounds"]["gun"]),
    cat0: newAudio(resources["Sounds"]["cat0"]),
    slash: newAudio(resources["Sounds"]["slash"]),
    bomb_shoot: newAudio(resources["Sounds"]["bomb_shoot"])
};

const stopSounds = [];

export function stopAllSound() {
    for (const soundsKey in Sounds) {
        if (!Sounds[soundsKey].paused) {
            Sounds[soundsKey].pause();
            stopSounds.push(Sounds[soundsKey])
        }
    }
}

export function continueAllSound() {
    while (stopSounds.length > 0) {
        try {
            Sounds[stopSounds.pop()].play()
        } catch (e) {
        }
    }
}

export function cancelAllSound() {
    for (const soundsKey in Sounds) {
        Sounds[soundsKey].pause();
        Sounds[soundsKey].currentTime = 0;
    }
}
