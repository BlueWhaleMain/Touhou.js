import BossUtil from "../boss_util.js";
import health from "../../components/health.js";
import {getLayer, Images, RBox, Sounds} from "../../util.js";

let _;
const cache = document.createElement("canvas");
cache.width = 128;
cache.height = 128;
const cacheCtx = cache.getContext("2d");
Images.bossAll.addEventListener("load", function () {
    cacheCtx.drawImage(Images.bossAll, 0, 0, 128, 128, 0, 0, 128, 128)
});

const ctx1 = getLayer(1);
export default function bossRumia(x, y, blood, cards) {
    const inst = BossUtil(x, y, cards);
    inst.addComponent("health", health);
    inst.components["health"].init(blood, blood, 1);
    inst.components["health"].callback.doDelta = function (value, max) {
        if (value / max < 0.05) {
            Sounds.damage1.currentTime = 0;
            _ = Sounds.damage1.play()
        } else if (value / max < 0.1) {
            Sounds.damage.currentTime = 0;
            _ = Sounds.damage.play()
        }
    };
    inst.atkBox = new RBox(128, 128);
    let textureLayout = -100;
    let textureOpacity = 0.6;
    let layout = 0.02;
    inst.addComponent("Rumia", function () {
        this.tick = function (inst) {
            if (inst.showTexture) {
                textureLayout += 2.5;
                textureOpacity += layout;
                if (textureOpacity > 1 && textureLayout > 120) {
                    textureOpacity = 1;
                    layout = -0.01
                } else if (textureOpacity <= 0) {
                    textureOpacity = 0.6;
                    textureLayout = -100;
                    layout = 0.02;
                    inst.showTexture = null
                }
            }
        }
    });
    inst.addLayer("Rumia", function () {
        this.draw = function (inst) {
            ctx1.drawImage(cache, inst.X - 64, inst.Y - 64);
            if (inst.showTexture) {
                ctx1.save();
                ctx1.globalAlpha = textureOpacity;
                ctx1.drawImage(Images.bossRumia, 250, textureLayout, 572, 746);
                ctx1.restore()
            }
        }
    });
    return inst
}
