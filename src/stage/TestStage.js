import {getLayer, saveToFile, Images, Sounds, save} from "../util.js";

let step = 0;
let _;

const cache = document.createElement("canvas");
cache.width = 832;
cache.height = 1056;
const cache_draw = cache.getContext("2d");
Images.background["03_02"].addEventListener("load", function () {
    cache_draw.fillStyle = cache_draw.createPattern(Images.background["03_02"], "repeat");
    cache_draw.fillRect(0, 0, cache.width, cache.height);
});
const ctx = getLayer(0);
const ctx2 = getLayer(2);
export default function TestStage() {
    const inst = {};
    let timestamp = 0;
    inst.tick = function () {
        step++;
        if (step >= 0) {
            step = -128
        }
        if (Sounds.test.paused) {
            _ = Sounds.test.play()
        }
        if (Sounds.test.currentTime >= 145.1) {
            Sounds.test.currentTime = 0
        }
        window.score++;
        timestamp++
    };
    inst.draw = function (force) {
        ctx.save();
        ctx.drawImage(cache, 12.8, 9.6 + step);
        if (timestamp < 300 || force) {
            ctx2.save();
            ctx2.font = "34px sans-serif";
            ctx2.shadowColor = "black";
            ctx2.shadowBlur = 2;
            if (timestamp > 200 && !force) {
                ctx2.fillStyle = "rgba(255,255,255," + (1 / (timestamp - 200)) + ")"
            } else {
                ctx2.fillStyle = "white"
            }
            ctx2.fillText("TestStage", 358, 288);
            ctx2.font = "16px Comic Sans MS";
            ctx2.fillText("BGM - 東方妖怪小町", 678, 940);
            ctx2.restore();
        }
        ctx.restore()
    };
    inst.clear = function () {
        save["highScore"] = h_score;
        saveToFile(save)
    };
    inst.end = function () {
        Sounds.test.pause();
        Sounds.test.currentTime = 0;
        step = 0;
        window.score = 0
    };
    return inst
}
