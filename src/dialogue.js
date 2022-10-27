import {TAGS, entities} from "./util.js";
import Prefab from "./prefab.js";
import {newAudio} from "./resources/sounds";
import {resources} from "./resources/manager";
import {getLayer, LAYER_MAPPING} from "./layers/manager";

let _;
const layerUI = getLayer(LAYER_MAPPING.UI);
const simpleDialogFrame = document.createElement("canvas");
simpleDialogFrame.width = 350;
simpleDialogFrame.height = 50;
const simpleDialogCtx = simpleDialogFrame.getContext("2d");
const gradient = simpleDialogCtx.createLinearGradient(0, 0, 350, 50);
gradient.addColorStop(0, "black");
gradient.addColorStop(1, "rgba(255,255,255,0)");
simpleDialogCtx.fillStyle = gradient;
simpleDialogCtx.globalAlpha = 0.5;
simpleDialogCtx.fillRect(0, 0, 350, 50);
const soundOfShoot = newAudio(resources.Sounds.shoot);

export function SimpleDialogue(textObjs, imageObjs, doSth, callback) {
    let o = 1, oa = 0, loaded = false, timestamp = 0;
    const inst = {};
    inst.maxDelayTime = 300;
    inst.tick = function () {
        if (timestamp >= 0) {
            timestamp++
        }
        if (timestamp > inst.maxDelayTime) {
            timestamp = -1;
            inst.next()
        }
        if (loaded === false) {
            loaded = true;
            if (typeof doSth === "function") {
                doSth(inst.entity)
            }
        }
        if (oa) {
            o += oa
        }
        if (o <= 0) {
            if (typeof callback === "function") {
                callback(inst.entity)
            }
            return true
        }
    };
    inst.draw = function () {
        layerUI.save();
        layerUI.globalAlpha = o;
        let length = imageObjs.length;
        for (let i = 0; i < length; i++) {
            const imageObj = imageObjs[i];
            layerUI.save();
            layerUI.globalAlpha = imageObj.globalAlpha || o;
            layerUI.drawImage(imageObj.image, imageObj.X || -40, imageObj.Y || 200);
            layerUI.restore()
        }
        layerUI.drawImage(simpleDialogFrame, 40, 380);
        length = textObjs.length;
        for (let i = 0; i < length; i++) {
            const textObj = textObjs[i];
            layerUI.save();
            layerUI.direction = textObj.direction || "ltr";
            layerUI.font = textObj.font || "14px sans-serif";
            layerUI.fillStyle = textObj.fillStyle || "white";
            layerUI.shadowColor = textObj.shadowColor || "black";
            layerUI.shadowBlur = textObj.shadowBlur || 2;
            layerUI.fillText(textObj.text, textObj.X || 50, textObj.Y || 400, 350);
            layerUI.restore();
        }
        layerUI.restore()
    };
    inst.skip = function () {
        oa = -0.1
    };
    inst.next = function () {
        soundOfShoot.currentTime = 0;
        _ = soundOfShoot.play();
        oa = -0.05
    };
    return inst
}

export function title(layerStage, timeIn = 30, timeDelay = 90, timeout = 60) {
    const inst = new Prefab();
    inst.tags.add(TAGS.title);
    inst.opacity = 0;
    timeDelay = timeDelay + timeIn;
    timeout = timeout + timeDelay;
    inst.addComponent("tick", function () {
        let frame = 0;
        this.tick = function (inst) {
            if (frame <= timeIn) {
                inst.opacity = frame / timeIn
            }
            if (frame >= timeDelay && frame <= timeout) {
                inst.opacity = (timeout - frame) / 60
            }
            if (frame > timeout) {
                inst.tags.add(TAGS.death)
            }
            frame++
        }
    });
    if (typeof layerStage === "function") {
        inst.addLayer("draw", layerStage)
    }
    inst.move = function (x, y, mx, my) {
        inst.X = x;
        inst.Y = y;
        inst.addComponent("move", function () {
            this.tick = function (inst) {
                inst.X += mx;
                inst.Y += my
            }
        });
        return inst
    };
    return inst
}

export function scoreNumberParse(score) {
    const str = score.toString();
    let result = "";
    const length = str.length;
    for (let i = 0; i < length; i++) {
        switch (str[i]) {
            case "0":
                result += "〇";
                break;
            case "1":
                result += "一";
                break;
            case "2":
                result += "二";
                break;
            case "3":
                result += "三";
                break;
            case "4":
                result += "四";
                break;
            case "5":
                result += "五";
                break;
            case "6":
                result += "六";
                break;
            case "7":
                result += "七";
                break;
            case "8":
                result += "八";
                break;
            case "9":
                result += "九";
                break;
            default:
                result += "?"
        }
    }
    return result
}

export function showScore(x, y, score, color = "white") {
    entities.push(title(function () {
        const self = {};
        self.draw = function (self) {
            layerUI.save();
            layerUI.globalAlpha = self.opacity;
            layerUI.font = "8px sans-serif";
            layerUI.fillStyle = color;
            layerUI.fillText(scoreNumberParse(score), self.X, self.Y);
            layerUI.restore()
        };
        return self
    }, 10, 30, 10).move(x, y, 0, -0.5));
}
