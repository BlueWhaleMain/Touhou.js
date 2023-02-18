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
const bossAll = newImage(resources.Images.bossAll);
bossAll.addEventListener("load", function () {
    cacheCtx.drawImage(bossAll, 0, 128 * 4, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossIzayoiSakuya);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossIzayoiSakuya(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.maxMovementSpeed = 2;
    inst.texture = texture;
    inst.bgm = ASSETS.SOUND.lunarClockLunaDial.head;
    inst.loop = ASSETS.SOUND.lunarClockLunaDial.loop;
    inst.bgmName = ASSETS.SOUND.lunarClockLunaDial.name;
    inst.addLayer("IzayoiSakuya", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - 64, inst.Y - 64)
        }
    });
    return inst
}
