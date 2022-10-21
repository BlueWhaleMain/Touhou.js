import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, GUI_SCREEN, LAYER_MAPPING, newAudio, newImage, resources, session} from "../util.js";
import {showScore} from "../dialogue.js";

const cache = document.createElement("canvas");
cache.width = 12;
cache.height = 12;
const middleOverHeadTexture = document.createElement('canvas')
middleOverHeadTexture.width = 10
middleOverHeadTexture.height = 10
const eBullet2 = newImage(resources.Images.eBullet2);
eBullet2.addEventListener("load", function () {
    const cacheCtx = cache.getContext("2d");
    cacheCtx.drawImage(eBullet2, 98, 418, 12, 12, 0, 0, 12, 12);
    const middleOverHeadTextureCtx = middleOverHeadTexture.getContext('2d')
    middleOverHeadTextureCtx.drawImage(eBullet2, 6 * 32 + 16 + 3, 13 * 32 + 2, 10, 10, 0, 0, 10, 10)
});
const soundOfItemPickUp = newAudio(resources.Sounds.item);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
let _;

export default function BlueOrb(x, y, mx, my, spy = false) {
    const inst = new Prefab(x, y);
    inst.sizeBox = new ABox(6);
    inst.pickBox = new ABox(14);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].spy = spy;
    inst.components["item"].configMovement(inst);
    inst.components["item"].pick = function () {
        session.player.point++;
        let score, color = "white";
        if (session.player.Y < (1 - session.player.pickLine) * GUI_SCREEN.HEIGHT + GUI_SCREEN.Y) {
            score = 100000;
            color = "gold"
        } else {
            score = Math.floor(100000 * (GUI_SCREEN.HEIGHT + GUI_SCREEN.Y - session.player.Y) / GUI_SCREEN.HEIGHT * session.player.pickLine)
        }
        session.score += score;
        showScore(inst.X, inst.Y, score, color);
        soundOfItemPickUp.currentTime = 0;
        _ = soundOfItemPickUp.play()
    };
    inst.addLayer("BlueOrb", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
            if (inst.sizeBox.isOverHead(inst.X, inst.Y)) {
                layerStage.drawImage(middleOverHeadTexture, inst.X - inst.sizeBox.r, GUI_SCREEN.Y)
            }
        }
    });
    return inst
}
