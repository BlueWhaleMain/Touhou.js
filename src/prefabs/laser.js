import {
    drawSticker,
    entities, EVENT_MAPPING,
    getLayer,
    HEIGHT,
    L,
    LAYER_MAPPING,
    RBox,
    TAGS,
    session
} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import laser from "../components/laser.js";
import GreenOrb from "./green_orb.js";
import {ob} from "../observer.js";

const r90 = 90 * L;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
export default function Laser(type, color, x, y, mx, my, angle, time, canDrop = true) {
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
    inst.sizeBox = new RBox(16, HEIGHT * 2, angle);
    inst.atkBox = new RBox(8, HEIGHT * 2, angle);
    inst.type = type;
    inst.color = color;
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.angle = angle;
    inst.init = function () {
        let type = inst.type;
        let color = inst.color;
        let angle = inst.angle;
        inst.sizeBox.angle = angle;
        inst.atkBox.angle = angle;
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
                inst.sizeBox = new RBox(32, HEIGHT * 2);
                inst.atkBox = new RBox(16, HEIGHT * 2);
                break;
            default:
                throw new Error("LaserType: " + type + " is not supported.")
        }
        inst.removeLayer("Laser");
        inst.addLayer("Laser", function () {
            this.draw = function (inst) {
                if (angle === undefined) {
                    inst.angle = Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX) + r90
                }
                if (inst.delayTime <= 0 && inst.outTime <= 0) {
                    return
                }
                if (inst.startTime > 0) {
                    layerStage.save();
                    layerStage.translate(inst.X + inst.DX, inst.Y + inst.DY);
                    layerStage.rotate(inst.angle);
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
                } else {
                    draw = drawSticker(type, color).layer0
                }
                let width = Math.min(inst.sizeBox.xs, inst.layTime);
                layerStage.save();
                layerStage.translate(inst.X + inst.DX, inst.Y + inst.DY);
                layerStage.rotate(inst.angle);
                layerStage.drawImage(draw, -width / 2, -inst.sizeBox.ys / 2, width, inst.sizeBox.ys);
                layerStage.restore();
                if (session.debugFlag === true) {
                    layerUI.save();
                    layerUI.strokeStyle = "red";
                    layerUI.translate(inst.X + inst.DX, inst.Y + inst.DY);
                    layerUI.rotate(inst.angle);
                    layerUI.strokeRect(-inst.atkBox.xs / 2, -inst.atkBox.ys / 2, inst.atkBox.xs, inst.atkBox.ys);
                    layerUI.restore()
                }
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
            ob.removeEventListener(EVENT_MAPPING.miss, clear);
        }
    }

    function clear() {
        inst.tags.add(TAGS.death)
    }

    function drop(e) {
        for (let i = -inst.sizeBox.ys / 2; i < inst.sizeBox.ys / 2; i += 8) {
            if (e.type === EVENT_MAPPING.bossInit) {
                entities.push(GreenOrb(inst.X + Math.sin(inst.angle) * i, inst.Y - Math.cos(inst.angle) * i, 0, -2, "middle", true));
            } else {
                entities.push(GreenOrb(inst.X + Math.sin(inst.angle) * i, inst.Y - Math.cos(inst.angle) * i, 0, -2, "small", true));
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
    return inst
}
