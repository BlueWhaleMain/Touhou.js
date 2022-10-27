import BossUtil from "../boss_util.js";
import {ABox} from "../../util.js";
import {newImage} from "../../resources/images";
import {newAudio} from "../../resources/sounds";
import {resources} from "../../resources/manager";
import {getLayer, LAYER_MAPPING} from "../../layers/manager";

const cache = document.createElement("canvas");
cache.width = 128;
cache.height = 128;
const cacheCtx = cache.getContext("2d");
const bossAll = newImage(resources.Images.bossAll);
bossAll.addEventListener("load", function () {
    cacheCtx.drawImage(bossAll, 512, 384, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossHakureiReimu);
const bgm = {
    head: newAudio(resources.Sounds.hakureiReimu.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.hakureiReimu.loop, 100, "BGM")
};
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossHakureiReimu(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.maxMovementSpeed = 1.6;
    inst.texture = texture;
    inst.bgm = bgm.head;
    inst.loop = bgm.loop;
    inst.bgmName = "少女綺想曲 ～ Dream Battle";
    inst.addLayer("HakureiReimu", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - 64, inst.Y - 64)
        }
    });
    return inst
}
