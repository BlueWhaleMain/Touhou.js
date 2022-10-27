export const layers = new Set();
export const screens = {};
const contexts = {};

export function clearScreen() {
    for (let layer of layers) {
        getLayer(layer).clearRect(0, 0, WIDTH, HEIGHT);
    }
}

export function initScreen(screen, layerId) {
    screens[layerId] = screen;
    contexts[layerId] = screen.getContext("2d");
    contexts[layerId].clearRect(0, 0, WIDTH, HEIGHT);
    contexts[layerId].scale(screen.width / WIDTH, screen.height / HEIGHT);
    contexts[layerId].rect(0, 0, WIDTH, HEIGHT);
    contexts[layerId].clip();
    layers.add(layerId)
}

export function resizeScreen(layer) {
    const trans = window.innerWidth / window.innerHeight;
    if (trans > WXH) {
        layer.height = window.innerHeight;
        layer.width = window.innerHeight * WXH;
        layer.style.left = (window.innerWidth - layer.width) / 2 + "px";
        layer.style.removeProperty("top");
    } else if (trans === WXH) {
        layer.width = window.innerWidth;
        layer.height = window.innerHeight;
        layer.style.removeProperty("top");
        layer.style.removeProperty("left");
    } else {
        layer.width = window.innerWidth;
        layer.height = window.innerWidth / WXH;
        layer.style.top = (window.innerHeight - layer.height) / 2 + "px";
        layer.style.removeProperty("left");
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

export const WIDTH = 640;
export const HEIGHT = 480;
export const WXH = WIDTH / HEIGHT;
// 背景-玩家-boss-弹幕(entity)/特效-符卡宣言-判定点-UI/效果/字幕-菜单/遮罩/错误-调试信息
// ----------场景----------------------UI-------------
// /：图层 -：绘制次序
export const LAYER_MAPPING = {
    STAGE: 0,
    UI: 1,
    EFFECT: 2,
    TITLE: 3,
    SHADE: 4,
    DEBUG: 5
};
window.addEventListener("resize", function () {
    for (let layer of layers) {
        resizeScreen(screens[layer]);
        initScreen(screens[layer], layer)
    }
});