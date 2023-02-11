import {
    ABox,
    modifyEntity,
    session,
    TAGS,
    arrowTo,
    entities
} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {newImage} from "../resources/images";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../layers/manager";

const texture = newImage(resources.Images.player.hakureiReimuShot);
const cache = document.createElement("canvas");
cache.width = 16;
cache.height = 12;
const cacheCtx = cache.getContext("2d");
const spyCache = document.createElement("canvas");
spyCache.width = 14;
spyCache.height = 14;
const spyCacheCtx = spyCache.getContext("2d");
texture.addEventListener("load", function () {
    cacheCtx.drawImage(texture, 1, 48, 16, 12, 0, 0, 16, 12);
    spyCacheCtx.drawImage(texture, 1, 63, 14, 14, 0, 0, 14, 14)
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function HakureiReimuBill(x, y, mx, my, spy = false) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.tags.add(TAGS.underPlayer);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    if (spy) {
        inst.sizeBox = new ABox(7);
    } else {
        inst.sizeBox = new ABox(6);
    }
    inst.addComponent("HakureiReimuBill", function () {
        this.tick = function (inst) {
            const length = entities.length;
            let l = undefined, selectedEntity;
            let damage = 1;
            if (spy) {
                damage = damage / 2
            }
            if (spy) {
                for (let i = 0; i < length; i++) {
                    const entity = entities[i];
                    if (entity.tags.has(TAGS.enemy)) {
                        const nl = Math.pow(inst.X - entity.X, 2) + Math.pow(inst.Y - entity.Y, 2);
                        if (l === undefined || l > nl) {
                            selectedEntity = entity;
                            l = nl
                        }
                    }
                }
            }
            const count = modifyEntity(function (entity) {
                if (entity.tags.has(TAGS.enemy) && entity.atkBox) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                        if (entity.components["health"] && !entity.components["health"].indestructible) {
                            entity.components["health"].doDelta(-damage)
                        }
                        inst.tags.add(TAGS.death);
                        return true
                    }
                }
            });
            if (count > 0) {
                return
            }
            for (let i = 0; i < session.stage.boss.length; i++) {
                let b = session.stage.boss[i];
                if (b.atkBox && !b.hide) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                        if (b.components["health"] && !b.components["health"].indestructible) {
                            b.components["health"].doDelta(-damage)
                        }
                        inst.tags.add(TAGS.death);
                        return
                    } else if (spy) {
                        const nl = Math.pow(inst.X - b.X, 2) + Math.pow(inst.Y - b.Y, 2);
                        if (l === undefined || l > nl) {
                            selectedEntity = b;
                            l = nl
                        }
                    }
                }
            }
            if (selectedEntity && spy) {
                const speed = arrowTo(inst.X, inst.Y, selectedEntity.X, selectedEntity.Y, 20);
                inst.components["movable"].MX = speed[0];
                inst.components["movable"].MY = speed[1];
            }
        }
    });
    inst.addLayer("HakureiReimuBill", function () {
        this.draw = function (inst) {
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX));
            if (spy) {
                layerStage.drawImage(spyCache, -inst.sizeBox.r, -inst.sizeBox.r);
            } else {
                layerStage.drawImage(cache, -inst.sizeBox.r, -inst.sizeBox.r);
            }
            layerStage.restore()
        }
    });
    return inst
}
