/*
 *调试图层，显示判定区域等
 */
import {getLayer, L, LAYER_MAPPING, session} from "../util.js";
import graphics from "../graphics.js";

const r90 = 90 * L;
const layerUI = getLayer(LAYER_MAPPING.UI);
export default function debug() {
    const graph = new graphics()
    this.draw = function (inst) {
        if (session.debugFlag === true) {
            if (inst.atkBox) {
                this.drawBox(inst, inst.atkBox, 'red')
            }
            if (inst.sizeBox) {
                this.drawBox(inst, inst.sizeBox, 'blue')
            }
            if (inst.pickBox) {
                this.drawBox(inst, inst.pickBox, 'aqua')
            }
            if (inst.grazeBox) {
                this.drawBox(inst, inst.grazeBox, 'green')
            }
            if (inst.hitBox) {
                this.drawBox(inst, inst.hitBox, 'orange')
            }
            const movable = inst.components["movable"]
            if (movable) {
                let draw;
                let len = 20
                if (inst.sizeBox) {
                    if (inst.sizeBox.name === "ABox") {
                        len = inst.sizeBox.r / 2 + 10
                    } else if (inst.sizeBox.name === 'RBox') {
                        len = inst.sizeBox.xs / 2 + 10
                    }
                }
                draw = graph.getLine(len, 'white')
                layerUI.save();
                layerUI.translate(inst.X, inst.Y);
                layerUI.rotate(Math.atan2(movable.MY, movable.MX) + r90);
                layerUI.drawImage(draw, 0, -len);
                layerUI.restore()
            }
            const health = inst.components["health"]
            if (health) {
                const current = health.getValue()
                const max = health.getMax()
                layerUI.save()
                layerUI.translate(inst.X, inst.Y)
                layerUI.fillStyle = health.indestructible ? 'gold' : 'red'
                layerUI.fillText(current + '/' + max, 0, 0)
                layerUI.restore()
            }
        }
    }
    this.drawBox = function (inst, box, color) {
        let draw;
        if (box.name === "ABox") {
            draw = graph.getCircle(box.r, color);
            layerUI.drawImage(draw, inst.X - box.r - 1, inst.Y - box.r - 1);
        } else if (box.name === 'RBox') {
            draw = graph.getRectangle(box.xs, box.ys, color);
            layerUI.save();
            layerUI.translate(inst.X + (inst.DX || 0), inst.Y + (inst.DY || 0));
            layerUI.rotate(box.angle);
            layerUI.drawImage(draw, -box.xs / 2, -box.ys / 2)
            layerUI.restore()
        }
    }
}
