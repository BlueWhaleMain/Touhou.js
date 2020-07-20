import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import {ABox, getLayer, modifyEntity, Tags, boss, L} from "../util.js";

const r90 = 90 * L;
const cache = document.createElement("canvas");
cache.width = 20;
cache.height = 60;
const c = cache.getContext("2d");
c.fillStyle = "black";
c.shadowColor = "white";
c.shadowBlur = 2;
c.beginPath();
c.arc(10, 10, 9, 0, 2 * Math.PI);
c.closePath();
c.fill();
c.beginPath();
c.arc(10, 10, 7, 0, 2 * Math.PI);
c.closePath();
c.fill();
c.beginPath();
c.shadowColor = "black";
c.globalAlpha = 0.8;
c.arc(10, 30, 9, 0, 2 * Math.PI);
c.closePath();
c.fill();
c.beginPath();
c.arc(10, 30, 7, 0, 2 * Math.PI);
c.closePath();
c.fill();
c.globalAlpha = 0.5;
c.arc(10, 50, 9, 0, 2 * Math.PI);
c.closePath();
c.fill();
c.beginPath();
c.arc(10, 50, 7, 0, 2 * Math.PI);
c.closePath();
c.fill();
const ctx = getLayer(0);
export default function rumiaBall(x, y, mx, my) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(Tags.player);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.sizeBox = new ABox(10);
    inst.addComponent("RumiaBall", function () {
        this.tick = function (inst) {
            const count = modifyEntity(function (entity) {
                if (entity.tags.has(Tags.enemy) && entity.atkBox) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                        if (entity.components["health"] && !entity.components["health"].indestructible) {
                            entity.components["health"].doDelta(-1)
                        }
                        inst.tags.add(Tags.death);
                        return true
                    }
                }
            });
            if (count > 0) {
                return
            }
            for (let i = 0; i < boss.length; i++) {
                let b = boss[i];
                if (b.atkBox) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                        if (b.components["health"] && !b.components["health"].indestructible) {
                            b.components["health"].doDelta(-1)
                        }
                        inst.tags.add(Tags.death);
                        return
                    }
                }
            }
        }
    });
    inst.addLayer("RumiaBall", function () {
        this.draw = function (inst) {
            ctx.save();
            ctx.translate(inst.X, inst.Y);
            ctx.rotate(Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX) + r90);
            ctx.drawImage(cache, -inst.sizeBox.r, -inst.sizeBox.r);
            ctx.restore()
        }
    });
    return inst
}