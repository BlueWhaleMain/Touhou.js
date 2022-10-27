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
    cacheCtx.drawImage(bossAll, 0, 384, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossPatchouliKnowledge);
const bgm = {
    head: newAudio(resources.Sounds.patchouliKnowledge.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.patchouliKnowledge.loop, 100, "BGM")
};
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossPatchouliKnowledge(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.maxMovementSpeed = 0.8;
    inst.texture = texture;
    inst.bgm = bgm.head;
    inst.loop = bgm.loop;
    inst.bgmName = "ラクトガール ～ 少女密室";
    inst.addLayer("PatchouliKnowledge", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - 64, inst.Y - 64)
        }
    });
    return inst
}
