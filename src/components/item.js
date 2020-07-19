import {arrowTo, Tags} from "../util.js";

export default function item() {
    this.spy = false;
    this.configMovement = function (inst) {
        inst.components["movable"].flush = false;
        inst.components["movable"].grave = 0.05
    };
    this.pick = function (inst) {
    };
    this.inScreen = function (inst) {
        const p = inst.pickBox.inScreen(inst.X, inst.Y, 0, 0, 840, 960);
        inst.X = p[0];
        inst.Y = p[1]
    };
    this.tick = function (inst) {
        if (inst.Y > 940) {
            inst.tags.add(Tags.death);
            return
        }
        if (window.player.miss) {
            this.spy = false
        } else {
            if (inst.pickBox) {
                if (inst.pickBox.isHit(inst.X, inst.Y, window.player.X, window.player.Y, window.player.pickBox)) {
                    this.spy = true
                }
            }
            if (window.player.Y - 10 < (1 - window.player.pickLine) * 940) {
                this.spy = true
            }
            if (window.player.bombTime > 0) {
                this.spy = true
            }
            if (this.spy) {
                this.inScreen(inst);
                const speed = arrowTo(inst.X, inst.Y, window.player.X, window.player.Y, 25);
                inst.components["movable"].MX = speed[0];
                inst.components["movable"].MY = speed[1]
            } else {
                if (inst.components["movable"].MX !== 0) {
                    inst.components["movable"].MX = 0
                }
                if (inst.components["movable"].MY > 3) {
                    inst.components["movable"].MY = 3
                }
                if (inst.components["movable"].MY < -3) {
                    inst.components["movable"].MY = -3
                }
            }
            if (inst.sizeBox.isHit(inst.X, inst.Y, window.player.X, window.player.Y, window.player.grazeBox)) {
                inst.tags.add(Tags.death);
                this.pick(inst)
            }
        }
    }
}
