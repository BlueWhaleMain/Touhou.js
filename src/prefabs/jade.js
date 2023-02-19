import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import bullet from "../components/bullet.js";
import {ABox, arrowTo, entities, EVENT_MAPPING, L, session, TAGS} from "../util.js";
import GreenOrb from "./green_orb.js";
import {ob} from "../observer.js"
import {drawSticker} from "../resources/sticker";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../layers/manager";

let _;
const soundOfChangeTrack = newAudio(resources.Sounds.changeTrack);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const r90 = 90 * L;
const r360 = 360 * L;
export default function Jade(type, color, x, y, mx, my, rotation, canDrop = true, reflex = 0) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.addComponent("bullet", bullet);
    inst.tags.add(TAGS.hostile);
    inst.DX = 0;
    inst.DY = 0;
    inst.sizeBox = new ABox(8);
    inst.atkBox = new ABox(4);
    inst.type = type;
    inst.color = color;
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    if (reflex > 0) {
        inst.components["movable"].reflex.enabled = true
        inst.components["movable"].reflex.count = reflex
    }
    inst.rotation = rotation;
    inst.init = function () {
        let symmetric = false;
        switch (type) {
            case "scale":
                break;
            case "ring":
                inst.atkBox = new ABox(6);
                symmetric = true;
                break;
            case "small":
                inst.atkBox = new ABox(6);
                symmetric = true;
                break;
            case "rice":
                break;
            case "suffering":
                break;
            case "bill":
                break;
            case "bullet":
                break;
            case "bacteria":
                break;
            case "needle":
                break;
            case "star":
                inst.atkBox = new ABox(6);
                break;
            case "ice":
                break;
            case "point":
                inst.sizeBox = new ABox(4);
                break;
            case "shiji":
                inst.sizeBox = new ABox(4);
                break;
            case "coin":
                inst.atkBox = new ABox(6);
                break;
            case "arrow":
                inst.Y -= 8;
                inst.DY = 8;
                break;
            case "orb":
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(8);
                symmetric = true;
                break;
            case "bigStar":
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(8);
                break;
            case "knife":
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(8);
                break;
            case "heart":
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(10);
                break;
            case "butterfly":
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(8);
                break;
            case "oval":
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(7);
                break;
            case "big":
                inst.sizeBox = new ABox(32);
                inst.atkBox = new ABox(14);
                break;
            default:
                throw new Error("JadeType: " + type + " is not supported.")
        }
        inst.removeLayer("Jade");
        inst.addLayer("Jade", function () {
            this.draw = function (inst) {
                const image = drawSticker(inst.type, inst.color);
                if (rotation === undefined && !symmetric) {
                    inst.rotation = Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX) + r90
                }
                let draw;
                const bullet = inst.components["bullet"];
                if (session.debugFlag === true && bullet.grazeState === true) {
                    draw = image.graze
                } else {
                    draw = image.layer0
                }
                if (bullet.hitState === true) {
                    draw = image.hit
                }
                if (inst.rotation) {
                    layerStage.save();
                    layerStage.translate(inst.X + inst.DX, inst.Y + inst.DY);
                    layerStage.rotate(inst.rotation);
                    layerStage.drawImage(draw, -inst.sizeBox.r, -inst.sizeBox.r);
                    layerStage.restore()
                } else {
                    layerStage.drawImage(draw, inst.X + inst.DX - inst.sizeBox.r, inst.Y + inst.DY - inst.sizeBox.r);
                }
            }
        });
    };
    inst.init();

    function clear() {
        inst.tags.add(TAGS.death)
    }

    function drop(e) {
        if (e.type === EVENT_MAPPING.cardEnEp || e.detail && e.detail.drop === true) {
            if (e.type === EVENT_MAPPING.bossInit) {
                entities.push(GreenOrb(inst.X, inst.Y, 0, -2, "middle", true));
            } else {
                entities.push(GreenOrb(inst.X, inst.Y, 0, -2, "small", true));
            }
        }
        inst.tags.add(TAGS.death)
    }

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

    ob.addEventListener(EVENT_MAPPING.bossInit, drop);
    ob.addEventListener(EVENT_MAPPING.miss, clear);
    if (canDrop) {
        ob.addEventListener(EVENT_MAPPING.clearEntity, drop)
    } else {
        ob.addEventListener(EVENT_MAPPING.clearEntity, clear)
    }
    ob.addEventListener(EVENT_MAPPING.cardEnEp, drop);
    ob.addEventListener(EVENT_MAPPING.load, load);
    inst.spy = function (delay, target, speed, callback) {
        inst.addComponent("spy" + delay, function () {
            this.delay = delay;
            this.tick = function (inst) {
                this.delay--;
                if (this.delay === 0) {
                    if (!speed) {
                        speed = arrowTo(inst.X, inst.Y, target.X, target.Y, Math.sqrt(Math.pow(inst.components["movable"].MX, 2) + Math.pow(inst.components["movable"].MY, 2)))
                    }
                    inst.components["movable"].MX = speed[0];
                    inst.components["movable"].MY = speed[1];
                    soundOfChangeTrack.currentTime = 0;
                    _ = soundOfChangeTrack.play();
                    if (typeof callback === "function") {
                        callback(inst)
                    }
                    inst.removeComponent("spy" + delay);
                    inst.init()
                }
            }
        });
        return inst
    };
    inst.rotate = function (deg) {
        rotation = 0;
        inst.addComponent("rotate", function () {
            this.tick = function (inst) {
                if (inst.rotation === undefined) {
                    inst.rotation = 0
                }
                inst.rotation += Math.sqrt(Math.pow(inst.components["movable"].MX, 2) + Math.pow(inst.components["movable"].MY, 2)) * deg;
                if (inst.rotation > r360) {
                    inst.rotation -= r360
                }
            }
        });
        return inst
    };
    inst.edit = function (f) {
        f(inst);
        return inst
    };
    return inst
}
