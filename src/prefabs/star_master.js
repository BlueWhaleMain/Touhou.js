import Prefab from "../prefab.js";
import bullet from "../components/bullet.js";
import {
    ABox,
    entities,
    EVENT_MAPPING,
    L,
    session,
    TAGS
} from "../util.js";
import health from "../components/health.js";
import GreenOrb from "./green_orb.js";
import {ob} from "../observer.js";
import {newImage} from "../resources/images";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../screens";

const r360 = 360 * L;
const cache = document.createElement("canvas");
cache.width = 32;
cache.height = 32;
const hide = document.createElement("canvas");
hide.width = 64;
hide.height = 64;
const texture = newImage(resources.Images.enemy);
texture.addEventListener("load", function () {
    let c = cache.getContext("2d");
    c.drawImage(texture, 0, 224, 32, 32, 0, 0, 32, 32);
    c.drawImage(texture, 32, 224, 32, 32, 0, 0, 32, 32);
    c = hide.getContext("2d");
    c.drawImage(texture, 0, 128, 64, 64, 0, 0, 64, 64);
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function StarMaster(entity, x, y, rotation = 0, blood = 100) {
    const inst = new Prefab(x, y);
    inst.addComponent("health", health);
    inst.components["health"].init(blood, blood, 0);
    inst.components["health"].callback.doDelta = function (val) {
        if (session.player.tags.has(TAGS.human)) {
            if (entity && entity.components["health"]) {
                entity.components["health"].doDelta(val / 2);
            }
            return true
        }
        return false
    };
    inst.components["health"].callback.dead = function () {
        drop({type: EVENT_MAPPING.shoot})
    };
    if (session.player.tags.has(TAGS.monster)) {
        inst.sizeBox = new ABox(32);
        inst.atkBox = new ABox(0)
    } else if (session.player.tags.has(TAGS.human)) {
        inst.sizeBox = new ABox(16);
        inst.atkBox = new ABox(12)
    }
    inst.rotation = rotation;
    inst.addComponent("bullet", bullet);
    inst.components["bullet"].ignoreTags.add(TAGS.monster);
    inst.tags.add(TAGS.envoy);
    inst.addComponent("StarMaster", function () {
        this.tick = function (inst) {
            if (session.player.tags.has(TAGS.monster)) {
                inst.sizeBox = new ABox(32);
                inst.atkBox = new ABox(0);
                inst.tags.delete(TAGS.enemy)
            } else if (session.player.tags.has(TAGS.human)) {
                inst.sizeBox = new ABox(16);
                inst.atkBox = new ABox(12);
                inst.tags.add(TAGS.enemy)
            }
            if (inst.rotation === undefined) {
                inst.rotation = 0
            }
            inst.rotation += L;
            if (inst.rotation > r360) {
                inst.rotation -= r360
            }
        }
    });
    inst.addLayer("StarMaster", function () {
        this.draw = function () {
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(inst.rotation);
            if (session.player.tags.has(TAGS.human)) {
                layerStage.drawImage(cache, -inst.sizeBox.r, -inst.sizeBox.r)
            }
            if (session.player.tags.has(TAGS.monster)) {
                layerStage.drawImage(hide, -inst.sizeBox.r, -inst.sizeBox.r)
            }
            layerStage.restore()
        }
    });
    inst.edit = function (f) {
        f(inst);
        return inst
    };

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
            ob.removeEventListener(EVENT_MAPPING.cardEnEp, drop);
            ob.removeEventListener(EVENT_MAPPING.miss, clear);
        }
    }

    ob.addEventListener(EVENT_MAPPING.bossInit, drop);
    ob.addEventListener(EVENT_MAPPING.miss, clear);
    ob.addEventListener(EVENT_MAPPING.clearEntity, drop);
    ob.addEventListener(EVENT_MAPPING.cardEnEp, drop);
    ob.addEventListener(EVENT_MAPPING.load, load);
    return inst
}
