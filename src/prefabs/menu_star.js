import prefabs from "../prefabs.js";
import movable from "../components/movable.js";
import {getLayer, height} from "../util.js";

const MenuStarCache = {};

export default function menu_star(x = 0, y = 0, mx = 0, my = 1, size = 2, color = "white") {
    const inst = new prefabs();
    inst.addComponent("movable", movable);
    if (size < 0) {
        size = -size
    }
    if (size < 1) {
        size++
    }
    let show = false;
    inst.X = x;
    inst.Y = y;
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.components["movable"].flush = false;
    inst.size = size;
    inst.color = color;
    inst.addComponent("MenuStarLoop", function () {
        this.tick = function (inst) {
            if (inst.Y > height + inst.size) {
                inst.Y = 0
            }
        }
    });
    inst.addLayer("Star", function () {
        const ctx = getLayer(0);
        this.draw = function (inst) {
            if (show) {
                if (Math.random() > 0.999) {
                    show = false
                }
                if (!MenuStarCache[inst.size]) {
                    MenuStarCache[inst.size] = {};
                    MenuStarCache.len++;
                }
                const cache = MenuStarCache[inst.size];
                if (!cache.normalCanvas) {
                    cache.normalCanvas = document.createElement("canvas");
                    cache.normalCanvas.width = 2 * inst.size;
                    cache.normalCanvas.height = 2 * inst.size;
                    const cache_draw = cache.normalCanvas.getContext("2d");
                    cache_draw.fillStyle = inst.color;
                    cache_draw.shadowColor = inst.color;
                    cache_draw.shadowBlur = 1;
                    cache_draw.arc(inst.size, inst.size, inst.size - 1, 0, 2 * Math.PI);
                    cache_draw.fill();
                }
                ctx.drawImage(cache.normalCanvas, inst.X - inst.size, inst.Y - inst.size)
            } else {
                if (Math.random() > 0.9) {
                    show = true
                }
            }
        }
    });
    return inst
}
