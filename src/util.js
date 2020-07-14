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

export function getImage(src, width, height) {
    const img = new Image();
    img.src = "./assets/images/" + src;
    img.style.width = width;
    img.style.height = height;
    img.addEventListener("load", function () {
        window.loading_count++;
    });
    window.loading_total++;
    return img;
}

export function getAudio(name) {
    const audio = new Audio("./assets/sounds/" + name);
    audio.addEventListener("canplay", function () {
        window.loading_count++;
    });
    window.loading_total++;
    return audio;
}

window.layers = new Set();
window.screens = {};
window.contexts = {};

function initScreen(screen, layer_id) {
    window.screens[layer_id] = screen;
    window.contexts[layer_id] = screen.getContext("2d");
    window.contexts[layer_id].clearRect(0, 0, screen.width, screen.height);
    window.layers.add(layer_id)
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
        layer.width = 1280;
        layer.height = 960;
        layer.style.position = "absolute";
        layer.style.zIndex = layer_id;
        layer.innerHTML = "<span style='font-size:large;color:red' title='浏览器可能不支持canvas'>图层加载失败</span>";
        document.body.append(layer);
        initScreen(layer, layer_id)
    }
}

export function getLayer(layer_id) {
    if (!window.contexts[layer_id]) {
        newLayer(layer_id)
    }
    return window.contexts[layer_id]
}
