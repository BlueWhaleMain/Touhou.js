import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {ABox, getLayer, modifyEntity, TAGS, session, LAYER_MAPPING, newImage, resources} from "../util.js";

const cache = document.createElement("canvas");
cache.width = 48;
cache.height = 16;
const texture = newImage(resources.Images.player.rumiaShot);
texture.addEventListener("load", function () {
    const c = cache.getContext("2d");
    c.drawImage(texture, 224, 144, 48, 16, 0, 0, 48, 16)
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function RumiaBall(x, y, mx, my) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(5);
    inst.addComponent("RumiaBall", function () {
        this.tick = function (inst) {
            const count = modifyEntity(function (entity) {
                if (entity.tags.has(TAGS.enemy) && entity.atkBox) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                        if (entity.components["health"] && !entity.components["health"].indestructible) {
                            entity.components["health"].doDelta(-1)
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
                            b.components["health"].doDelta(-1)
                        }
                        inst.tags.add(TAGS.death);
                        return
                    }
                }
            }
        }
    });
    inst.addLayer("RumiaBall", function () {
        this.draw = function (inst) {
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX));
            layerStage.drawImage(cache, -24, -8);
            layerStage.restore()
        }
    });
    return inst
}
