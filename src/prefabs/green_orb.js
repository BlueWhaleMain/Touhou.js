import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, hslToRgb, rgbToHsl, editImage, Images, Sounds} from "../util.js";

const middle = document.createElement("canvas");
middle.width = 12;
middle.height = 12;
const middleCtx = middle.getContext("2d");
const small = document.createElement("canvas");
Images.eBullet2.addEventListener("load", function () {
    middleCtx.drawImage(Images.eBullet2, 112, 416, 12, 12, 0, 0, 12, 12);
    const smallCtx = small.getContext("2d");
    smallCtx.drawImage(middle, 0, 0);
    smallCtx.putImageData(editImage(smallCtx.getImageData(0, 0, 12, 12), function (r, g, b) {
        const hsl = rgbToHsl(r, g, b);
        return hslToRgb(hsl[0], hsl[1], 1);
    }), 0, 0);
});

const layer = getLayer(0);
let _;

export default function greenOrb(x, y, mx, my, size = "middle", spy = false) {
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
        Sounds.item.currentTime = 0;
        _ = Sounds.item.play();
        if (size === "middle") {
            window.score += 100
        } else if (size === "small") {
            window.score += 10
        }
    };
    inst.addLayer("greenOrb", function () {
        this.draw = function (inst) {
            if (size === "middle") {
                layer.drawImage(middle, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
            } else if (size === "small") {
                layer.drawImage(small, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r)
            }
        }
    });
    return inst
}
