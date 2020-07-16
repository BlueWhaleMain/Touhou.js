import prefabs from "../prefabs.js";
import movable from "../components/movable.js";
import {getLayer, height} from "../util.js";

const MenuStarCache = {};

export default function menu_star(x = 0, y = 0, mx = 0, my = 1, size = 2, color = "white") {
    const self = new prefabs();
    self.addComponent("movable", movable);
    if (size < 0) {
        size = -size
    }
    if (size < 1) {
        size++
    }
    let show = false;
    self.X = x;
    self.Y = y;
    self.components["movable"].MX = mx;
    self.components["movable"].MY = my;
    self.components["movable"].flush = false;
    self.size = size;
    self.color = color;
    self.addComponent("MenuStarLoop", function () {
        this.tick = function (self) {
            if (self.Y > height + self.size) {
                self.Y = 0
            }
        }
    });
    self.addLayer("Star", function () {
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
    });
    return self
}
