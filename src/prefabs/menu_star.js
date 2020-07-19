import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {getLayer, height} from "../util.js";

const MenuStarCache = {};

const ctx = getLayer(0);
export default function menuStar(x = 0, y = 0, mx = 0, my = 1, size = 2, color = "white") {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    if (size < 0) {
        size = -size
    }
    if (size < 1) {
        size++
    }
    let show = false;

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
                    const cacheDraw = cache.normalCanvas.getContext("2d");
                    cacheDraw.fillStyle = inst.color;
                    cacheDraw.shadowColor = inst.color;
                    cacheDraw.shadowBlur = 1;
                    cacheDraw.arc(inst.size, inst.size, inst.size - 1, 0, 2 * Math.PI);
                    cacheDraw.fill();
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
