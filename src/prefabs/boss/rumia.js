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
    cacheCtx.drawImage(bossAll, 0, 0, 128, 128, 0, 0, 128, 128)
});
const texture = newImage(resources.Images.bossRumia);
const bgm = {
    head: newAudio(resources.Sounds.rumia.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.rumia.loop, 100, "BGM")
};
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function bossRumia(x, y, blood, cards, dialogue) {
    const inst = BossUtil(x, y, blood, cards, dialogue);
    inst.atkBox = new ABox(32);
    inst.texture = texture;
    inst.bgm = bgm.head;
    inst.loop = bgm.loop;
    inst.bgmName = "妖魔夜行";
    inst.addLayer("Rumia", function () {
        this.draw = function (inst) {
            layerStage.drawImage(cache, inst.X - 64, inst.Y - 64)
        }
    });
    return inst
}
