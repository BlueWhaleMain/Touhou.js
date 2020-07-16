import prefabs from "../prefabs.js";
import movable from "../components/movable.js";
import {ABox, getLayer, Tags} from "../util.js";

const cache = document.createElement("canvas");
cache.width = 20;
cache.height = 20;
const c = cache.getContext("2d");
c.fillStyle = "black";
c.shadowColor = "white";
c.shadowBlur = 2;
c.beginPath();
c.arc(10, 10, 9, 0, 2 * Math.PI);
c.closePath();
c.fill();
c.beginPath();
c.arc(10, 10, 7, 0, 2 * Math.PI);
c.closePath();
c.fill();
export default function rumia_ball(x, y, mx, my) {
    const inst = new prefabs();
    inst.addComponent("movable", movable);
    inst.tags.add(Tags.player);
    inst.power = 1;
    inst.X = x;
    inst.Y = y;
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(10);
    inst.addLayer("RumiaBall", function () {
        const ctx = getLayer(0);
        this.draw = function (inst) {
            ctx.drawImage(cache, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r);
        }
    });
    return inst
}
