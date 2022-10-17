import Prefab from "../prefab";
import {clearEntity, entities, TAGS} from "../util";
import ClearOrb from "./clear_orb";

export default function Player1Clear(/* number */x, /* number */y) {
    const inst = new Prefab(x, y);
    inst.addComponent('Player1Clear', function () {
        this.tick = function (inst) {
            clearEntity(function (entity) {
                if (entity.tags.has(TAGS.hostile)) {
                    entities.push(ClearOrb(entity.X, entity.Y, 0, -2, true));
                    return true
                }
            }, entities.length)
            inst.tags.add(TAGS.death)
        }
    })
    return inst
}