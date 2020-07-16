import prefabs from "../prefabs.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, RBox, getLayer, clear_screen, Images, Sounds, entities} from "../util.js";
import green_orb from "./green_orb.js";

const big = document.createElement("canvas");
big.width = 32;
big.height = 32;
const big_ctx = big.getContext("2d");
const small = document.createElement("canvas");
small.width = 16;
small.height = 16;
const small_ctx = small.getContext("2d");
Images.power_orb.addEventListener("load", function () {
    big_ctx.drawImage(Images.power_orb, 0, 0);
    small_ctx.drawImage(Images.power_orb, 0, 0, 16, 16);
});

const layer = getLayer(0);
let _;

export default function power_orb(x, y, mx, my, size = "small") {
    const inst = new prefabs();
    inst.X = x;
    inst.Y = y;
    if (size === "big") {
        inst.sizeBox = new RBox(32, 32);
    } else if (size === "small") {
        inst.sizeBox = new RBox(16, 16);
    }
    inst.pickBox = new ABox(40);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].config_movement(inst);
    inst.components["item"].pick = function () {
        Sounds.item.currentTime = 0;
        _ = Sounds.item.play();
        let old = Math.floor(window.player.power / 100);
        if (size === "big") {
            window.player.power += 100;
            window.score += 100
        } else if (size === "small") {
            window.player.power += 5;
            window.score += 10
        }
        if (window.player.power > window.player.power_max) {
            window.player.power = window.player.power_max;
            window.score += Math.floor(51200 * Math.abs(window.player.indTime) / 512)
        } else if (window.player.power === window.player.power_max) {
            // methods.push(new DrawFont(120, function () {
            //     screen_draw.font = "30px sans-serif";
            //     screen_draw.fillStyle = "rgb(133,133,133)";
            //     screen_draw.fillText("Full Power Up!", 250, 300)
            // }));
            clear_screen(function (entity) {
                if (entity.tags.has("Enemy")) {
                    entities.push(green_orb(entity.X, entity.Y, 0, -2, "small"));
                    return true
                }
            })
        }
        if (window.player.power / 100 - old >= 1) {
            Sounds.power_up.currentTime = 0;
            _ = Sounds.power_up.play();
        }
    };
    inst.addLayer("power_orb", function () {
        this.draw = function (inst) {
            if (size === "big") {
                layer.drawImage(big, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
            } else if (size === "small") {
                layer.drawImage(small, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
            }
        }
    });
    return inst
}
