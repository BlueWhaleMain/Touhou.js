import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, GUI_SCREEN, LAYER_MAPPING, newAudio, newImage, RBox, resources, session} from "../util.js";
import {showScore} from "../dialogue.js";

const cache = document.createElement("canvas");
cache.width = 16;
cache.height = 16;
const eBullet2 = newImage(resources.Images.eBullet2);
eBullet2.addEventListener("load", function () {
    const middleCtx = cache.getContext("2d");
    middleCtx.drawImage(eBullet2, 96, 432, 16, 16, 0, 0, 16, 16);
});
const soundOfItemPickUp = newAudio(resources.Sounds.item);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
let _;
export default function ClearOrb(x, y, mx, my, spy = false) {
    const inst = new Prefab(x, y);
    inst.sizeBox = new RBox(16, 16);
    inst.pickBox = new ABox(16);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].spy = spy;
    inst.components["item"].configMovement(inst);
    inst.components["item"].pick = function () {
        let bonus = 20;
        let score, color = "white";
        if (session.player.Y < (1 - session.player.pickLine) * GUI_SCREEN.HEIGHT + GUI_SCREEN.Y) {
            score = 10000 * bonus;
            color = "gold"
        } else {
            score = Math.floor(10000 * (GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - session.player.Y) / GUI_SCREEN.HEIGHT * session.player.pickLine) * bonus
        }
        session.score += score;
        showScore(inst.X, inst.Y, score, color);
        soundOfItemPickUp.currentTime = 0;
        _ = soundOfItemPickUp.play();
    };
    inst.addLayer("ClearOrb", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - inst.sizeBox.xs, inst.Y - inst.sizeBox.ys)
        }
    });
    return inst
}
