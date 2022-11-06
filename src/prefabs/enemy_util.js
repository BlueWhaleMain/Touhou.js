import Prefab from "../prefab";
import health from "../components/health";
import {entities, EVENT_MAPPING, session, TAGS} from "../util";
import {ob} from "../observer";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfDamage = newAudio(resources.Sounds.damage);
const soundOfEnEp0 = newAudio(resources.Sounds.en_ep_0);
export default function EnemyUtil(/* number */x, /* number */y, /* number */blood, brain, /* [Prefab] */drops = []) {
    const inst = new Prefab(x, y);
    inst.callback = {}
    inst.tags.add(TAGS.enemy)
    inst.addComponent("health", health);
    inst.components["health"].init(blood, blood, 0);

    inst.components["health"].callback.doDelta = function (val, value) {
        session.score -= Math.floor(val);
        soundOfDamage.currentTime = 0;
        _ = soundOfDamage.play()
        if (typeof inst.callback.healthDelta === 'function') {
            return inst.callback.healthDelta(val, value)
        }
    };

    function clear() {
        inst.components["health"].die()
    }

    function reflex() {
        if (inst.sizeBox.isOutedScreen(inst.X, inst.Y)) {
            return
        }
        inst.components["health"].doDelta(-100)
    }

    function hurt(e) {
        if (e.detail && e.detail.isPlayer === true) {
            if (inst.sizeBox.isOutedScreen(inst.X, inst.Y)) {
                return
            }
            inst.components["health"].doDelta(-100)
        }
    }

    function load(e) {
        if (inst.tags.has(TAGS.death)) {
            ob.removeEventListener(e.type, load);
            ob.removeEventListener(EVENT_MAPPING.miss, reflex);
            ob.removeEventListener(EVENT_MAPPING.clearEntity, hurt);
            ob.removeEventListener(EVENT_MAPPING.bossInit, clear);
        }
    }

    ob.addEventListener(EVENT_MAPPING.miss, reflex);
    ob.addEventListener(EVENT_MAPPING.clearEntity, hurt);
    ob.addEventListener(EVENT_MAPPING.bossInit, clear);
    ob.addEventListener(EVENT_MAPPING.load, load);
    inst.addComponent("EnemyTick", function () {
        this.tick = function (inst) {
            if (inst.tags.has(TAGS.death)) {
                soundOfEnEp0.currentTime = 0;
                _ = soundOfEnEp0.play();
                for (const drop of drops) {
                    drop.X = inst.X
                    drop.Y = inst.Y
                    entities.push(drop)
                }
            } else {
                brain(inst)
            }
        }
    })
    return inst
}