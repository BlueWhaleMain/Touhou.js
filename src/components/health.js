export default function health() {
    let value = 1, max = 1, min = 0;
    this.tick = function (inst) {
        if (value < 1) {
            inst.tags.add("death")
        }
    };
    this.init = function (v, m = 1, n = 0) {
        value = v;
        max = m;
        min = n
    };
    this.doDelta = function (val) {
        value += val;
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }
    };
    this.die = function () {
        value = 0
    }
}
