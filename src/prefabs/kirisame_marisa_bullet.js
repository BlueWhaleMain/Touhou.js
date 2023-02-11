import {ABox, modifyEntity, session, TAGS} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {newImage} from "../resources/images";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../layers/manager";

const texture = newImage(resources.Images.player.kirisameMarisaShot);
const greenCache = document.createElement("canvas");
greenCache.width = 28;
greenCache.height = 14;
const greenCacheCtx = greenCache.getContext("2d");
const blueCache = document.createElement("canvas");
blueCache.width = 28;
blueCache.height = 14;
const blueCacheCtx = blueCache.getContext("2d");
texture.addEventListener("load", function () {
    greenCacheCtx.drawImage(texture, 0, 48, 28, 14, 0, 0, 28, 14);
    blueCacheCtx.drawImage(texture, 0, 64, 28, 14, 0, 0, 28, 14)
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function kirisameMarisaBullet(x, y, mx, my, color) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.tags.add(TAGS.underPlayer);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(7);
    inst.addComponent("kirisameMarisaBullet", function () {
        this.tick = function (inst) {
            let damage = 1.5;
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
    inst.addLayer("kirisameMarisaBullet", function () {
        this.draw = function (inst) {
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX));
            if (color === 'green') {
                layerStage.drawImage(greenCache, -inst.sizeBox.r, -inst.sizeBox.r);
            } else if (color === 'blue') {
                layerStage.drawImage(blueCache, -inst.sizeBox.r, -inst.sizeBox.r);
            }
            layerStage.restore()
        }
    });
    return inst
}
