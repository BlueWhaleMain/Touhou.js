import BossUtil from "../boss_util.js";
import {getLayer, ABox, LAYER_MAPPING, newAudio, resources, newImage} from "../../util.js";

const cache = document.createElement("canvas");
cache.width = 128;
cache.height = 128;
const cacheCtx = cache.getContext("2d");
const bossAll = newImage(resources.Images.bossAll);
bossAll.addEventListener("load", function () {
    cacheCtx.drawImage(bossAll, 256, 896, 128, 128, 0, 0, 128, 128)
});
const hide = document.createElement("canvas");
hide.width = 128;
hide.height = 128;
const hideCtx = hide.getContext("2d");
bossAll.addEventListener("load", function () {
    hideCtx.drawImage(bossAll, 384, 896, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossYukariYakumo);
const bgm = {
    head: newAudio(resources.Sounds.yukariYakumo.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.yukariYakumo.loop, 100, "BGM")
};
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossYukariYakumo(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.texture = texture;
    inst.bgm = bgm.head;
    inst.loop = bgm.loop;
    inst.bgmName = "ネクロファンタジア";
    inst.addLayer("YukariYakumo", function () {
        this.draw = function (inst) {
            if (inst.hide) {
                layerStage.drawImage(hide, inst.X - 64, inst.Y - 64)
            } else {
                layerStage.drawImage(cache, inst.X - 64, inst.Y - 64)
            }
        }
    });
    return inst
}
