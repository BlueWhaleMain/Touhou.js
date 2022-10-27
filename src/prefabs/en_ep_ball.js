import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {ABox, TAGS, EVENT_MAPPING} from "../util.js";
import {ob} from "../observer.js"
import {newImage} from "../resources/images";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../screens";

const bossEffect = newImage(resources.Images.bossEffect);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function EnEpBall(x, y, mx, my, size = 30) {
    const inst = new Prefab(x, y);
    inst.sizeBox = new ABox(size);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;

    function remove(e) {
        if (inst.tags.has(TAGS.death)) {
            ob.removeEventListener(e.type, remove);
            return
        }
        inst.tags.add(TAGS.death)
    }

    function load(e) {
        if (inst.tags.has(TAGS.death)) {
            ob.removeEventListener(e.type, load);
            ob.removeEventListener(EVENT_MAPPING.bossInit, remove);
        }
    }

    ob.addEventListener(EVENT_MAPPING.bossInit, remove);
    ob.addEventListener(EVENT_MAPPING.load, load);
    inst.addComponent("EnEpBall", function () {
        this.tick = function (inst) {
            size -= Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2)) / 10;
            if (size < 1) {
                inst.tags.add(TAGS.death)
            }
        }
    });
    inst.addLayer("EnEpBall", function () {
        this.draw = function (inst) {
            if (size < 1) {
                return
            }
            layerStage.drawImage(bossEffect, inst.X - size, inst.Y - size, 2 * size, 2 * size)
        }
    });
    return inst
}
