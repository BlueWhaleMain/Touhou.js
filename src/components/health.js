import {TAGS} from "../util.js";

export default function health() {
    let value = 1, max = 1, min = 0;
    this.indestructible = false;
    this.callback = {};
    this.tick = function (inst) {
        if (this.indestructible) {
            inst.tags.delete(TAGS.death);
            return
        }
        if (value < 1) {
            inst.tags.add(TAGS.death)
        }
    };
    this.init = function (v, m = 1, n = 0) {
        value = v;
        max = m;
        min = n
    };
    this.getValue = function () {
        return value
    };
    this.getMax = function () {
        return max
    };
    this.getMin = function () {
        return min
    };
    this.doDelta = function (val) {
        if (this.indestructible) {
            return
        }
        if (typeof this.callback.doDelta === "function") {
            if (this.callback.doDelta(val, value) === false) {
                return
            }
        }
        value += val;
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }
        if (value < 1) {
            if (typeof this.callback.dead === "function") {
                this.callback.dead(this)
            }
        }
    };
    this.die = function () {
        value = 0
    }
}
