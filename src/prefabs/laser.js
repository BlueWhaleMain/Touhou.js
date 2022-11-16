import {
    entities,
    EVENT_MAPPING,
    L,
    RBox,
    session,
    TAGS
} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import laser from "../components/laser.js";
import GreenOrb from "./green_orb.js";
import {ob} from "../observer.js";
import {drawSticker} from "../resources/sticker";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {getLayer, HEIGHT, LAYER_MAPPING} from "../layers/manager";

let _;
const r90 = 90 * L;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const soundOfLaser = newAudio(resources.Sounds.laser);
const soundOfNep00 = newAudio(resources.Sounds.nep00);
export default function Laser(type, color, x, y, mx, my, rotation, time, canDrop = true) {
    const inst = new Prefab(x, y);
    inst.layTime = 1;
    if (time) {
        inst.startTime = time.startTime;
        inst.delayTime = time.delayTime;
        inst.outTime = time.outTime;
    }
    inst.addComponent("movable", movable);
    inst.addComponent("laser", laser);
    inst.tags.add(TAGS.hostile);
    inst.DX = 0;
    inst.DY = 0;
    inst.sizeBox = new RBox(16, HEIGHT * 2, rotation);
    inst.atkBox = new RBox(8, HEIGHT * 2, rotation);
    inst.type = type;
    inst.color = color;
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.rotation = rotation;
    let xs = 8;
    const startTime = inst.startTime;
    inst.init = function () {
        let type = inst.type;
        let color = inst.color;
        let rotationRad = inst.rotation;
        inst.sizeBox.rotation = rotationRad;
        inst.atkBox.rotation = rotationRad;
        switch (type) {
            case "laser":
                break;
            case "scale":
                break;
            case "rice":
                break;
            case "bullet":
                break;
            case "bacteria":
                break;
            case "needle":
                break;
            case "ice":
                break;
            case "arrow":
                inst.Y -= 8;
                inst.DY = 8;
                break;
            case "knife":
                break;
            case "master_spark":
                inst.sizeBox = new RBox(256, 512, rotationRad);
                xs = 164;
                inst.atkBox = new RBox(xs, 480, rotationRad);
                break;
            default:
                throw new Error("LaserType: " + type + " is not supported.")
        }
        inst.removeLayer("Laser");
        inst.addLayer("Laser", function () {
            this.draw = function (inst) {
                if (rotationRad === undefined) {
                    inst.rotation = Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX) + r90
                }
                if (inst.delayTime <= 0 && inst.outTime <= 0) {
                    return
                }
                if (inst.startTime > 0) {
                    if (type === "master_spark") {
                        const height = inst.sizeBox.ys * (1 - inst.startTime / startTime);
                        layerStage.save();
                        layerStage.translate(inst.X + Math.sin(rotationRad) * (height / 2 - 256), inst.Y - Math.cos(rotationRad) * (height / 2 - 256));
                        layerStage.rotate(inst.rotation);
                        layerStage.drawImage(drawSticker(type, color).layer0, 4, -height / 2, 4, height);
                        layerStage.restore();
                        return
                    }
                    layerStage.save();
                    layerStage.translate(inst.X + inst.DX, inst.Y + inst.DY);
                    layerStage.rotate(inst.rotation);
                    layerStage.strokeStyle = "white";
                    layerStage.beginPath();
                    layerStage.moveTo(0, -HEIGHT);
                    layerStage.lineTo(0, HEIGHT);
                    layerStage.stroke();
                    layerStage.restore();
                    return
                }
                let draw;
                const laser = inst.components["laser"];
                if (laser.hitState === true) {
                    draw = drawSticker(type, color).hit
                } else if (laser.grazeState === true && session.debugFlag === true) {
                    draw = drawSticker(type, color).graze
                } else {
                    draw = drawSticker(type, color).layer0
                }
                let width = Math.min(inst.sizeBox.xs, inst.layTime);
                layerStage.save();
                if (type === "master_spark") {
                    if (inst.delayTime <= 0) {
                        layerStage.globalAlpha = width / inst.sizeBox.xs;
                        session.fake = false
                    } else {
                        if (inst.layTime * 10 <= inst.sizeBox.xs) {
                            width = Math.min(inst.sizeBox.xs, inst.layTime * 10);
                        } else {
                            width = inst.sizeBox.xs
                        }
                        session.fake = true
                    }
                }
                layerStage.translate(inst.X + inst.DX, inst.Y + inst.DY);
                layerStage.rotate(inst.rotation);
                layerStage.drawImage(draw, -width / 2, -inst.sizeBox.ys / 2, width, inst.sizeBox.ys);
                inst.atkBox.xs = xs * width / inst.sizeBox.xs;
                layerStage.restore();
            }
        });
    };
    inst.init();

    function load(e) {
        if (inst.tags.has(TAGS.death)) {
            ob.removeEventListener(e.type, load);
            ob.removeEventListener(EVENT_MAPPING.bossInit, drop);
            ob.removeEventListener(EVENT_MAPPING.clearEntity, drop);
            ob.removeEventListener(EVENT_MAPPING.clearEntity, clear);
            ob.removeEventListener(EVENT_MAPPING.cardEnEp, drop);
            ob.removeEventListener(EVENT_MAPPING.miss, clear)
        }
    }

    function clear() {
        inst.tags.add(TAGS.death)
    }

    function drop(e) {
        if (e.type === EVENT_MAPPING.cardEnEp || e.detail && e.detail.drop === true) {
            for (let i = -inst.sizeBox.ys / 2; i < inst.sizeBox.ys / 2; i += 8) {
                if (e.type === EVENT_MAPPING.bossInit) {
                    entities.push(GreenOrb(inst.X + Math.sin(inst.rotation) * i, inst.Y - Math.cos(inst.rotation) * i, 0, -2, "middle", true));
                } else {
                    entities.push(GreenOrb(inst.X + Math.sin(inst.rotation) * i, inst.Y - Math.cos(inst.rotation) * i, 0, -2, "small", true));
                }
            }
        }
        inst.tags.add(TAGS.death)
    }

    ob.addEventListener(EVENT_MAPPING.bossInit, drop);
    ob.addEventListener(EVENT_MAPPING.miss, clear);
    if (canDrop) {
        ob.addEventListener(EVENT_MAPPING.clearEntity, drop)
    } else {
        ob.addEventListener(EVENT_MAPPING.clearEntity, clear)
    }
    ob.addEventListener(EVENT_MAPPING.cardEnEp, drop);
    ob.addEventListener(EVENT_MAPPING.load, load);
    if (inst.type === "master_spark") {
        inst.addComponent("MasterSparkInit", function () {
            this.tick = function (inst) {
                soundOfLaser.currentTime = 0;
                _ = soundOfLaser.play();
                inst.removeComponent("MasterSparkInit")
            }
        })
    }
    inst.start = function () {
        if (inst.type === "master_spark") {
            soundOfNep00.currentTime = 0;
            _ = soundOfNep00.play()
        } else {
            soundOfLaser.currentTime = 0;
            _ = soundOfLaser.play()
        }
    };
    inst.rotate = function (b, a, l = 256) {
        inst.X = b.X + l * Math.sin(a);
        inst.Y = b.Y - l * Math.cos(a);
        inst.sizeBox.rotation = a;
        inst.atkBox.rotation = a;
        inst.rotation = a;
        return inst
    };
    inst.edit = function (f) {
        f(inst);
        return inst
    };
    return inst
}
