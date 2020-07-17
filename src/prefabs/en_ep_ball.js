import prefabs from "../prefabs.js";
import movable from "../components/movable.js";
import {getLayer, Images, Tags} from "../util.js";

const Cache = {};

export default function en_ep_ball(x = 0, y = 0, mx = 0, my = 0, size = 60) {
    const inst = new prefabs();
    inst.addComponent("movable", movable);
    inst.X = x;
    inst.Y = y;
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.components["movable"].flush = false;
    inst.addComponent("EnEpBall", function () {
        this.tick = function (inst) {
            size -= Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2)) / 10;
            if (size < 1) {
                inst.tags.add(Tags.death)
            }
        }
    });
    inst.addLayer("EnEpBall", function () {
        const ctx = getLayer(0);
        this.draw = function (inst) {
            if (size < 1) {
                return
            }
            if (!Cache[size]) {
                Cache[size] = {};
                Cache.len++;
            }
            const cache = Cache[size];
            if (!cache.normalCanvas) {
                cache.normalCanvas = document.createElement("canvas");
                cache.normalCanvas.width = 2 * size;
                cache.normalCanvas.height = 2 * size;
                const cache_draw = cache.normalCanvas.getContext("2d");
                cache_draw.drawImage(Images.boss_effect_01, 0, 0, 2 * size, 2 * size)
            }
            ctx.drawImage(cache.normalCanvas, inst.X - size, inst.Y - size)
        }
    });
    return inst
}
