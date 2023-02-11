import {ABox, L, modifyEntity, session, TAGS} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {newImage} from "../resources/images";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../layers/manager";

const texture = newImage(resources.Images.player.kirisameMarisaShot);
const cache = document.createElement("canvas");
cache.width = 32;
cache.height = 32;
const cacheCtx = cache.getContext("2d");
texture.addEventListener("load", function () {
    cacheCtx.drawImage(texture, 0, 80, 32, 32, 0, 0, 32, 32);
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function kirisameMarisaColdSpark(x, y, mx, my) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.tags.add(TAGS.underPlayer);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(1);
    let step = 1;
    const stepMax = 32;
    inst.addComponent("kirisameMarisaColdSpark", function () {
        this.tick = function (inst) {
            if (step < stepMax) {
                step++;
                inst.sizeBox.r = Math.min(4 + step, 16)
            } else {
                inst.tags.add(TAGS.death);
                return;
            }
            let damage = Math.max(2 - step / 16, 0);
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
    inst.addLayer("kirisameMarisaColdSpark", function () {
        this.draw = function (inst) {
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(step / stepMax * 360 * L);
            layerStage.drawImage(cache, -inst.sizeBox.r, -inst.sizeBox.r, inst.sizeBox.r * 2, inst.sizeBox.r * 2);
            layerStage.restore()
        }
    });
    return inst
}
