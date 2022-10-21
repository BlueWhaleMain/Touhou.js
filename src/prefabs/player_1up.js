import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, session, entities, newImage, resources, newAudio, LAYER_MAPPING, GUI_SCREEN} from "../util.js";
import {title} from "../dialogue.js";

const cache = document.createElement("canvas");
cache.width = 16;
cache.height = 16;
const overHeadTexture = document.createElement('canvas')
overHeadTexture.width = 12
overHeadTexture.height = 13
const eBullet2 = newImage(resources.Images.eBullet2);
eBullet2.addEventListener("load", function () {
    const cacheCtx = cache.getContext("2d");
    cacheCtx.drawImage(eBullet2, 64, 416, 16, 16, 0, 0, 16, 16);
    const overHeadTextureCtx = overHeadTexture.getContext('2d')
    overHeadTextureCtx.drawImage(eBullet2, 9 * 32 + 2, 13 * 32 + 2, 12, 13, 0, 0, 12, 13)
});
let _;
const soundOfExtend = newAudio(resources.Sounds.extend);
const soundOfItemPickUp = newAudio(resources.Sounds.item);
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
            if (inst.sizeBox.isOverHead(inst.X, inst.Y)) {
                layerStage.drawImage(overHeadTexture, inst.X - inst.sizeBox.r, GUI_SCREEN.Y)
            }
        }
    });
    return inst
}
