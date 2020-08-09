import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, session, entities, newImage, resources, newAudio, LAYER_MAPPING} from "../util.js";
import {title} from "../dialogue.js";

const cache = document.createElement("canvas");
cache.width = 16;
cache.height = 16;
const cacheCtx = cache.getContext("2d");
const eBullet2 = newImage(resources.Images["eBullet2"]);
eBullet2.addEventListener("load", function () {
    cacheCtx.drawImage(eBullet2, 64, 416, 16, 16, 0, 0, 16, 16);
});
let _;
const soundOfExtend = newAudio(resources.Sounds["extend"]);
const soundOfItemPickUp = newAudio(resources.Sounds["item"]);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
export default function Player1Up(x, y, mx, my, spy = false) {
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
        if (session.player.playerCount < 8) {
            session.player.playerCount++;
            entities.push(title(function () {
                const self = {};
                self.draw = function (self) {
                    layerTitle.save();
                    layerTitle.globalAlpha = self.opacity;
                    layerTitle.font = "15px sans-serif";
                    layerTitle.fillStyle = "rgb(61,226,255)";
                    layerTitle.fillText("Extend!", 165, 200);
                    layerTitle.restore()
                };
                return self
            }))
        }
        soundOfExtend.currentTime = 0;
        _ = soundOfExtend.play();
        soundOfItemPickUp.currentTime = 0;
        _ = soundOfItemPickUp.play()
    };
    inst.addLayer("Player1Up", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
        }
    });
    return inst
}
