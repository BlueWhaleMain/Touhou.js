import boss_util from "../boss_util.js";
import health from "../../components/health.js";
import {getLayer, Images, RBox, Sounds, Tags} from "../../util.js";

let _;
const cache = document.createElement("canvas");
cache.width = 128;
cache.height = 128;
const cache_ctx = cache.getContext("2d");
Images.boss_all_01.addEventListener("load", function () {
    cache_ctx.drawImage(Images.boss_all_01, 0, 0, 128, 128, 0, 0, 128, 128)
});

const ctx = getLayer(1);
export default function boss_rumia(x, y, blood, cards) {
    const inst = boss_util();
    inst.X = x;
    inst.Y = y;
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
    let step = 0;
    let used = 0;
    inst.atkBox = new RBox(128, 128);
    inst.addComponent("RumiaTick", function () {
        this.tick = function (inst) {
            if (inst.card) {
                if (inst.card.tick()) {
                    inst.card = null;
                    used++
                }
            } else {
                step++;
                if (cards[step]) {
                    inst.card = cards[step].start(inst)
                }
            }
            if (used === cards.length && !inst.tags.has(Tags.death)) {
                inst.tags.add(Tags.death)
            }
        }
    });
    inst.addLayer("RumiaD", function () {
        this.draw = function (inst) {
            ctx.drawImage(cache, inst.X - 64, inst.Y - 64)
        }
    });
    return inst
}
