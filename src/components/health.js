import {Tags} from "../util.js";

export default function health() {
    let value = 1, max = 1, min = 0;
    this.indestructible = false;
    this.callback = {};
    this.tick = function (inst) {
        if (this.indestructible) {
            inst.tags.delete(Tags.death);
            return
        }
        if (value < 1) {
            inst.tags.add(Tags.death)
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
        value += val;
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }
        if (this.callback.doDelta) {
            this.callback.doDelta(value, max)
        }
    };
    this.die = function () {
        value = 0
    }
}
