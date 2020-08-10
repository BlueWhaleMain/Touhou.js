import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {
    ABox,
    getLayer,
    hslToRgb,
    rgbToHsl,
    editImage,
    session,
    GUI_SCREEN,
    newImage,
    resources, newAudio, LAYER_MAPPING
} from "../util.js";
import {showScore} from "../dialogue.js";

const middle = document.createElement("canvas");
middle.width = 10;
middle.height = 10;
const middleCtx = middle.getContext("2d");
const small = document.createElement("canvas");
const eBullet2 = newImage(resources.Images.eBullet2);
eBullet2.addEventListener("load", function () {
    middleCtx.drawImage(eBullet2, 115, 419, 10, 10, 0, 0, 10, 10);
    const smallCtx = small.getContext("2d");
    smallCtx.drawImage(middle, 0, 0);
    smallCtx.putImageData(editImage(smallCtx.getImageData(0, 0, 10, 10), function (r, g, b) {
        const hsl = rgbToHsl(r, g, b);
        return hslToRgb(hsl[0], hsl[1], 1);
    }), 0, 0);
});
const soundOfItemPickUp = newAudio(resources.Sounds.item);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
let _;

export default function GreenOrb(x, y, mx, my, size = "middle", spy = false) {
    const inst = new Prefab(x, y);
    inst.sizeBox = new ABox(5);
    inst.pickBox = new ABox(12);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].spy = spy;
    inst.components["item"].configMovement(inst);
    inst.components["item"].pick = function () {
        let bonus = 1;
        if (size === "middle") {
            bonus = 10
        }
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
    inst.addLayer("GreenOrb", function () {
        this.draw = function (inst) {
            if (size === "middle") {
                layerStage.drawImage(middle, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
            } else if (size === "small") {
                layerStage.drawImage(small, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
            }
        }
    });
    return inst
}
