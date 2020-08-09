import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, session, newImage, resources, newAudio, LAYER_MAPPING} from "../util.js";

const cache = document.createElement("canvas");
cache.width = 16;
cache.height = 16;
const cacheCtx = cache.getContext("2d");
const eBullet2 = newImage(resources.Images["eBullet2"]);
eBullet2.addEventListener("load", function () {
    cacheCtx.drawImage(eBullet2, 80, 416, 16, 16, 0, 0, 16, 16);
});
const soundOfItemPickUp = newAudio(resources.Sounds["item"]);
const soundOfCardGet = newAudio(resources.Sounds["cardGet"]);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
let _;

export default function Player1Bomb(x, y, mx, my, spy = false) {
    const inst = new Prefab(x, y);
    inst.sizeBox = new ABox(8);
    inst.pickBox = new ABox(16);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].spy = spy;
    inst.components["item"].configMovement(inst);
    inst.components["item"].pick = function () {
        if (session.player.bombCount < 8) {
            session.player.bombCount++;
        }
        soundOfCardGet.currentTime = 0;
        _ = soundOfCardGet.play();
        soundOfItemPickUp.currentTime = 0;
        _ = soundOfItemPickUp.play()
    };
    inst.addLayer("Player1Bomb", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
        }
    });
    return inst
}
