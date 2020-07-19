import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {ABox, RBox, getLayer, clearEntity, Images, Sounds, entities, Tags} from "../util.js";
import greenOrb from "./green_orb.js";

const big = document.createElement("canvas");
big.width = 40;
big.height = 40;
const bigCtx = big.getContext("2d");
const middle = document.createElement("canvas");
middle.width = 32;
middle.height = 32;
const middleCtx = middle.getContext("2d");
Images.powerOrb.addEventListener("load", function () {
    bigCtx.drawImage(Images.powerOrb, 0, 0, 40, 40);
    middleCtx.drawImage(Images.powerOrb, 0, 0);
});

const ctx = getLayer(0);
let _;

export default function powerOrb(x, y, mx, my, size = "middle") {
    const inst = new Prefab(x, y);

    if (size === "big") {
        inst.sizeBox = new RBox(40, 40);
    } else if (size === "middle") {
        inst.sizeBox = new RBox(32, 32);
    }
    inst.pickBox = new ABox(40);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].configMovement(inst);
    inst.components["item"].pick = function () {
        Sounds.item.currentTime = 0;
        _ = Sounds.item.play();
        let old = Math.floor(window.player.power / 100);
        if (size === "big") {
            window.player.power += 100;
            window.score += 100
        } else if (size === "middle") {
            window.player.power += 5;
            window.score += 10
        }
        if (window.player.power > window.player.powerMax) {
            window.player.power = window.player.powerMax;
            window.score += Math.floor(51200 * Math.abs(window.player.indTime) / 512)
        } else if (window.player.power === window.player.powerMax) {
            entities.push(new Prefab().init(function (inst) {
                let opacity = 0;
                inst.addComponent("tick", function () {
                    let frame = 0;
                    const self = {};
                    self.tick = function (inst) {
                        if (frame <= 30) {
                            opacity = frame / 30
                        }
                        if (frame >= 120 && frame <= 180) {
                            opacity = (180 - frame) / 60
                        }
                        if (frame > 180) {
                            inst.tags.add(Tags.death)
                        }
                        frame++
                    };
                    return self
                });
                inst.addLayer("draw", function () {
                    this.draw = function () {
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.font = "30px sans-serif";
                        ctx.fillStyle = "rgb(133,133,133)";
                        ctx.fillText("Full Power Up!", 330, 400);
                        ctx.restore()
                    }
                })
            }));
            clearEntity(function (entity) {
                if (entity.tags.has(Tags.hostile)) {
                    entities.push(greenOrb(entity.X, entity.Y, 0, -2, "small", true));
                    return true
                }
            })
        }
        if (window.player.power / 100 - old >= 1) {
            Sounds.powerUp.currentTime = 0;
            _ = Sounds.powerUp.play();
        }
    };
    inst.addLayer("powerOrb", function () {
        this.draw = function (inst) {
            if (size === "big") {
                ctx.drawImage(big, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
            } else if (size === "middle") {
                ctx.drawImage(middle, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
            }
        }
    });
    return inst
}
