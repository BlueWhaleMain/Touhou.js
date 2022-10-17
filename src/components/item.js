import {arrowTo, TAGS, session, GUI_SCREEN} from "../util.js";
export default function item() {
    this.spy = false;
    // 物品与移动也并无关系，需分解出重力组件
    this.configMovement = function (inst) {
        inst.components["movable"].flush = false;
        inst.components["movable"].grave = 0.03
    };
    this.pick = function (inst) {
    };
    this.inScreen = function (inst) {
        const p = inst.pickBox.inScreen(inst.X, inst.Y);
        inst.X = p[0];
        inst.Y = p[1]
    };
    this.tick = function (inst) {
        if (inst.Y > GUI_SCREEN.Y + GUI_SCREEN.HEIGHT) {
            inst.tags.add(TAGS.death);
            return
        }
        if (session.player.hideTime > 0 || session.player.tags.has(TAGS.death)) {
            this.spy = false
        } else {
            if (inst.pickBox) {
                if (inst.pickBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.pickBox)) {
                    this.spy = true
                }
            }
            if (session.player.Y < (1 - session.player.pickLine) * GUI_SCREEN.HEIGHT + GUI_SCREEN.Y) {
                this.spy = true
            }
            if (session.player.bombTime > 0) {
                this.spy = true
            }
            if (inst.sizeBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.grazeBox)) {
                inst.tags.add(TAGS.death);
                this.pick(inst)
            }
            // 同样，“被玩家吸引”的属性也需要分离组件
            if (this.spy) {
                this.inScreen(inst);
                const speed = arrowTo(inst.X, inst.Y, session.player.X, session.player.Y, 8);
                inst.components["movable"].MX = speed[0];
                inst.components["movable"].MY = speed[1];
                return
            }
        }
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
}
