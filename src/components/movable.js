import {Tags} from "../util.js";

export default function movable() {
    this.MX = 0;
    this.MY = 0;
    this.flush = true;
    this.grave = 0;
    this.tick = function (inst) {
        inst.X += this.MX;
        inst.Y += this.MY;
        if (this.grave) {
            this.MY += this.grave
        }
        if (this.flush && inst.sizeBox.isOutScreen(inst.X - 20, inst.Y - 10, 820, 940, this.MX, this.MY)) {
            inst.tags.add(Tags.death)
        }
    }
}
