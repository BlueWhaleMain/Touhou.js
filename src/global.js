/**
 * 动态注入公共对象
 * @constructor Public dynamic injection
 */
export default function DI() {
    /**
     * 生成下一个种子值，主要实现回放，若随机值影响回放结果务必调用
     * @returns {number}
     */
    Math.nextSeed = function () {
        let seed = Math.seed || new Date().valueOf();
        seed = (seed * 9301 + 49297) % 233280;
        Math.seed = seed;
        return seed / 233280
    };
    /**
     * 用于格式化数字串，方便对齐
     * @param x 数值
     * @param len 最大长度
     * @param ch 填充字符
     * @returns {string}
     */
    Math.prefix = function (x, len = 2, ch = "0") {
        return (Array(len).join(ch) + Math.round(x)).slice(-len)
    };
    /**
     * 用于绘制圆角盒子
     * @param x X坐标
     * @param y Y坐标
     * @param w 宽
     * @param h 高
     * @param r 圆角半径
     * @returns {CanvasRenderingContext2D}
     */
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
