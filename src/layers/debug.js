/*
 *调试图层，显示判定区域等
 */
import {intervalExecute, L, session} from "../util.js";
import Graphics from "../graphics.js";
import {getLayer, LAYER_MAPPING} from "../screens";

const r90 = 90 * L;
const layerDebug = getLayer(LAYER_MAPPING.DEBUG);
export default function Debug() {
    const graph = new Graphics()
    let outedScreenVisible = true
    const switchOutedScreenVisible = intervalExecute(() => {
        outedScreenVisible = !outedScreenVisible
    }, 10)
    this.draw = function (inst) {
        if (session.debugFlag === true) {
            switchOutedScreenVisible()
            if (inst.atkBox) {
                if (outedScreenVisible || !inst.atkBox.isOutedScreen(inst.X, inst.Y)) {
                    this.drawBox(inst, inst.atkBox, 'red')
                }
            }
            if (inst.sizeBox) {
                if (outedScreenVisible || !inst.sizeBox.isOutedScreen(inst.X, inst.Y)) {
                    this.drawBox(inst, inst.sizeBox, 'blue')
                }
            }
            if (inst.pickBox) {
                if (outedScreenVisible || !inst.pickBox.isOutedScreen(inst.X, inst.Y)) {
                    this.drawBox(inst, inst.pickBox, 'aqua')
                }
            }
            if (inst.grazeBox) {
                if (outedScreenVisible || !inst.grazeBox.isOutedScreen(inst.X, inst.Y)) {
                    this.drawBox(inst, inst.grazeBox, 'green')
                }
            }
            if (inst.hitBox) {
                if (outedScreenVisible || !inst.hitBox.isOutedScreen(inst.X, inst.Y)) {
                    this.drawBox(inst, inst.hitBox, 'orange')
                }
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
                layerDebug.save();
                layerDebug.translate(inst.X, inst.Y);
                layerDebug.rotate(Math.atan2(movable.MY, movable.MX) + r90);
                layerDebug.drawImage(draw, 0, -len);
                layerDebug.restore()
            }
            const health = inst.components["health"]
            if (health) {
                const current = health.getValue()
                const max = health.getMax()
                layerDebug.save()
                layerDebug.translate(inst.X, inst.Y)
                layerDebug.fillStyle = health.indestructible ? 'gold' : 'red'
                layerDebug.fillText(current + '/' + max, 0, 0)
                layerDebug.restore()
            }
        }
    }
    this.drawBox = function (inst, box, color) {
        let draw;
        if (box.name === "ABox") {
            draw = graph.getCircle(box.r, color);
            layerDebug.drawImage(draw, inst.X - box.r - 1, inst.Y - box.r - 1);
        } else if (box.name === 'RBox') {
            draw = graph.getRectangle(box.xs, box.ys, color);
            layerDebug.save();
            layerDebug.translate(inst.X + (inst.DX || 0), inst.Y + (inst.DY || 0));
            layerDebug.rotate(box.angle);
            layerDebug.drawImage(draw, -box.xs / 2, -box.ys / 2)
            layerDebug.restore()
        }
    }
}
