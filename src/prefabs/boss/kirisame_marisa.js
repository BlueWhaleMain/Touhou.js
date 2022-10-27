import BossUtil from "../boss_util.js";
import {ABox} from "../../util.js";
import {newImage} from "../../resources/images";
import {newAudio} from "../../resources/sounds";
import {resources} from "../../resources/manager";
import {getLayer, LAYER_MAPPING} from "../../screens";

const cache = document.createElement("canvas");
cache.width = 128;
cache.height = 128;
const cacheCtx = cache.getContext("2d");
const bossAll = newImage(resources.Images.bossAll);
bossAll.addEventListener("load", function () {
    cacheCtx.drawImage(bossAll, 0, 896, 128, 128, 0, 0, 128, 128)
});
const hide = document.createElement("canvas");
hide.width = 128;
hide.height = 128;
const hideCtx = hide.getContext("2d");
bossAll.addEventListener("load", function () {
    hideCtx.drawImage(bossAll, 128, 896, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossKirisameMarisa);
const bgm = {
    head: newAudio(resources.Sounds.kirisameMarisa.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.kirisameMarisa.loop, 100, "BGM")
};
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossKirisameMarisa(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.maxMovementSpeed = 1.6;
    inst.texture = texture;
    inst.bgm = bgm.head;
    inst.loop = bgm.loop;
    inst.bgmName = "恋色マスタースパーク";
    inst.addLayer("KirisameMarisa", function () {
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
