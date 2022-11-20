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
    cacheCtx.drawImage(bossAll, 512, 0, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossWriggleNightBug);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossWriggleNightBug(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.texture = texture;
    inst.bgm = ASSETS.SOUND.stirringAnAutumnMoonMoonedInsect.head;
    inst.loop = ASSETS.SOUND.stirringAnAutumnMoonMoonedInsect.loop;
    inst.bgmName = ASSETS.SOUND.stirringAnAutumnMoonMoonedInsect.name;
    inst.addLayer("WriggleNightBug", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - 64, inst.Y - 64)
        }
    });
    return inst
}
