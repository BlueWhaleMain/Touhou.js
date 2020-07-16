import prefabs from "../prefabs.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, getLayer, hslToRgb, rgbToHsl, editImage, Images, Sounds} from "../util.js";

const middle = document.createElement("canvas");
middle.width = 12;
middle.height = 12;
const middle_ctx = middle.getContext("2d");
const small = document.createElement("canvas");
Images.e_bullet_2.addEventListener("load", function () {
    middle_ctx.drawImage(Images.e_bullet_2, 112, 416, 12, 12, 0, 0, 12, 12);
    const small_ctx = small.getContext("2d");
    small_ctx.drawImage(middle, 0, 0);
    small_ctx.putImageData(editImage(small_ctx.getImageData(0, 0, 12, 12), function (r, g, b) {
        const hsl = rgbToHsl(r, g, b);
        return hslToRgb(hsl[0], hsl[1], 1);
    }), 0, 0);
});

const layer = getLayer(0);
let _;

export default function green_orb(x, y, mx, my, size = "middle") {
    const inst = new prefabs();
    inst.X = x;
    inst.Y = y;
    inst.sizeBox = new ABox(6);
    inst.pickBox = new ABox(14);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].config_movement(inst);
    inst.components["item"].pick = function () {
        Sounds.item.currentTime = 0;
        _ = Sounds.item.play();
        if (size === "middle") {
            window.score += 100
        } else if (size === "small") {
            window.score += 10
        }
    };
    inst.addLayer("green_orb", function () {
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
