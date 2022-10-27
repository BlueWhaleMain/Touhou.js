import {
    ABox,
    modifyEntity,
    session,
    TAGS
} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {newImage} from "../resources/images";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../layers/manager";

const texture = newImage(resources.Images.player.hakureiReimuShot);
const cache = document.createElement("canvas");
cache.width = 64;
cache.height = 8;
const cacheCtx = cache.getContext("2d");
texture.addEventListener("load", function () {
    cacheCtx.drawImage(texture, 48, 16, 64, 8, 0, 0, 64, 8)
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function SealingNeedle(x, y, mx, my) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(6);
    inst.addComponent("SealingNeedle", function () {
        this.tick = function (inst) {
            const damage = 2;
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
                    }
                }
            }
        }
    });
    inst.addLayer("SealingNeedle", function () {
        this.draw = function (inst) {
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX));
            layerStage.drawImage(cache, -32, -4);
            layerStage.restore()
        }
    });
    return inst
}
