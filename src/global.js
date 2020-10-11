/**
 * 动态注入公共对象
 * @constructor Public dynamic injection
 */
export default function DI() {
    Math.random = function () {
        let seed = Math.seed || new Date().valueOf();
        seed = (seed * 9301 + 49297) % 233280;
        Math.seed = seed;
        return seed / 233280
    };
    Math.prefix = function (x, len = 2, ch = "0") {
        return (Array(len).join(ch) + Math.round(x)).slice(-len)
    };
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
}
