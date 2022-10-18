import Prefab from "../prefab";
import health from "../components/health";
import {entities, EVENT_MAPPING, newAudio, resources, TAGS} from "../util";
import {ob} from "../observer";

let _;
const soundOfDamage = newAudio(resources.Sounds.damage);
const soundOfDamage1 = newAudio(resources.Sounds.damage1);
const soundOfEnEp0 = newAudio(resources.Sounds.en_ep_0);
export default function EnemyUtil(/* number */x, /* number */y, /* number */blood, brain, /* [Prefab] */drops = []) {
    const inst = new Prefab(x, y);
    inst.tags.add(TAGS.enemy)
    inst.addComponent("health", health);
    inst.components["health"].init(blood, blood, 0);

    inst.components["health"].callback.doDelta = function (val, value) {
        if (value / blood < 0.05) {
            soundOfDamage1.currentTime = 0;
            _ = soundOfDamage1.play()
        } else if (value / blood < 0.1) {
            soundOfDamage.currentTime = 0;
            _ = soundOfDamage.play()
        }
    };

    function clear() {
        inst.components["health"].die()
    }

    function reflex() {
        if (inst.sizeBox.isOutScreen(inst.X, inst.Y, 0, 0)) {
            return
        }
        inst.components["health"].doDelta(-100)
    }

    function hurt(e) {
        if (e.detail && e.detail.isPlayer === true) {
            if (inst.sizeBox.isOutScreen(inst.X, inst.Y, 0, 0)) {
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