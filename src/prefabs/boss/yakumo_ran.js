import BossUtil from "../boss_util.js";
import {ABox} from "../../util.js";
import {newImage} from "../../resources/images";
import {resources} from "../../resources/manager";
import {getLayer, LAYER_MAPPING} from "../../layers/manager";
import {ASSETS} from "../../resources/assets";

const cache = document.createElement("canvas");
cache.width = 128;
cache.height = 128;
const cacheCtx = cache.getContext("2d");
const hide = document.createElement("canvas");
hide.width = 128;
hide.height = 128;
const hideCtx = hide.getContext("2d");
const bossAll = newImage(resources.Images.bossAll);
bossAll.addEventListener("load", function () {
    cacheCtx.drawImage(bossAll, 128 * 2, 128 * 6, 128, 128, 0, 0, 128, 128)
    hideCtx.drawImage(bossAll, 128 * 3, 128 * 6, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossYakumoRan);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossYakumoRan(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.texture = texture;
    inst.bgm = ASSETS.SOUND.aMaidensIllusionaryFuneralNecroFantasy.head;
    inst.loop = ASSETS.SOUND.aMaidensIllusionaryFuneralNecroFantasy.loop;
    inst.bgmName = ASSETS.SOUND.aMaidensIllusionaryFuneralNecroFantasy.name;
    inst.addLayer("YakumoRan", function () {
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
