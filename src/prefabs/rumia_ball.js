import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {ABox, getLayer, modifyEntity, TAGS, session, LAYER_MAPPING, newImage, resources} from "../util.js";

const cache = document.createElement("canvas");
cache.width = 48;
cache.height = 16;
const texture = newImage(resources.Images.player.rumiaShot);
const hit1 = [];
const hit2 = [];
texture.addEventListener("load", function () {
    const c = cache.getContext("2d");
    c.drawImage(texture, 224, 144, 48, 16, 0, 0, 48, 16);
    for (let i = 0; i < 4; i++) {
        hit1[i] = document.createElement("canvas");
        hit1[i].width = 16;
        hit1[i].height = 16;
        let ctx = hit1[i].getContext("2d");
        ctx.drawImage(texture, i * 16, 144, 16, 16, 0, 0, 16, 16);
        hit2[i] = document.createElement("canvas");
        hit2[i].width = 16;
        hit2[i].height = 16;
        ctx = hit2[i].getContext("2d");
        ctx.drawImage(texture, i * 16, 160, 16, 16, 0, 0, 16, 16);
    }
});
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function RumiaBall(x, y, mx, my) {
    const inst = new Prefab(x, y);
    let hf = 0;
    let hfr = 0;
    const ht = Math.random();
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(5);
    inst.addComponent("RumiaBall", function () {
        this.tick = function (inst) {
            if (inst.tags.has(TAGS.hit)) {
                if (hf === 0) {
                    inst.components["movable"].stop = true
                }
                if (hf > 3) {
                    inst.tags.add(TAGS.death)
                }
                hfr++;
                if (hfr % 2 === 0) {
                    hf++;
                }
                return
            }
            const count = modifyEntity(function (entity) {
                if (entity.tags.has(TAGS.enemy) && entity.atkBox) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                        if (entity.components["health"] && !entity.components["health"].indestructible) {
                            entity.components["health"].doDelta(-1)
                        }
                        inst.tags.add(TAGS.hit);
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
                        inst.tags.add(TAGS.hit);
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
            if (inst.tags.has(TAGS.hit) && hf < 4) {
                if (ht > 0.5) {
                    layerStage.drawImage(hit1[hf], -8, -8)
                } else {
                    layerStage.drawImage(hit2[hf], -8, -8)
                }
            } else {
                layerStage.drawImage(cache, -24, -8);
            }
            layerStage.restore()
        }
    });
    return inst
}
