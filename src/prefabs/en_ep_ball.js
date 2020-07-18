import prefabs from "../prefabs.js";
import movable from "../components/movable.js";
import {ABox, getLayer, Images, Tags} from "../util.js";

const ctx = getLayer(1);
export default function en_ep_ball(x, y, mx, my , size = 60) {
    const inst = new prefabs();
    inst.X = x;
    inst.Y = y;
    inst.sizeBox = new ABox(size);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("EnEpBall", function () {
        this.tick = function (inst) {
            size -= Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2)) / 10;
            if (size < 1) {
                inst.tags.add(Tags.death)
            }
        }
    });
    inst.addLayer("EnEpBall", function () {
        this.draw = function (inst) {
            if (size < 1) {
                return
            }
            ctx.drawImage(Images.boss_effect_01, inst.X - size, inst.Y - size, 2 * size, 2 * size)
        }
    });
    return inst
}
