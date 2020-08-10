import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {
    ABox,
    RBox,
    getLayer,
    clearEntity,
    session,
    entities,
    TAGS,
    newImage,
    resources, newAudio, LAYER_MAPPING
} from "../util.js";
import GreenOrb from "./green_orb.js";
import {title} from "../dialogue.js";

const big = document.createElement("canvas");
big.width = 20;
big.height = 20;
const bigCtx = big.getContext("2d");
const middle = document.createElement("canvas");
middle.width = 16;
middle.height = 16;
const middleCtx = middle.getContext("2d");
const texture = newImage(resources.Images.powerOrb);
texture.addEventListener("load", function () {
    bigCtx.drawImage(texture, 0, 0, 20, 20);
    middleCtx.drawImage(texture, 0, 0, 16, 16);
});
const soundOfItemPickUp = newAudio(resources.Sounds.item);
const soundOfPowerUp = newAudio(resources.Sounds.powerUp);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
let _;

export default function PowerOrb(x, y, mx, my, size = "middle") {
    const inst = new Prefab(x, y);
    if (size === "big") {
        inst.sizeBox = new RBox(20, 20);
    } else if (size === "middle") {
        inst.sizeBox = new RBox(16, 16);
    }
    inst.pickBox = new ABox(10);
    inst.addComponent("movable", movable);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.addComponent("item", item);
    inst.components["item"].configMovement(inst);
    inst.components["item"].pick = function () {
        let old = Math.floor(session.player.power / 100);
        if (size === "big") {
            session.player.power += 100;
            session.score += 100
        } else if (size === "middle") {
            session.player.power += 5;
            session.score += 10
        }
        if (session.player.power > session.player.powerMax) {
            session.player.power = session.player.powerMax;
            session.score += Math.floor(51200 * Math.abs(session.player.indTime) / 512)
        } else if (session.player.power === session.player.powerMax) {
            entities.push(title(function () {
                const self = {};
                self.draw = function (self) {
                    layerTitle.save();
                    layerTitle.globalAlpha = self.opacity;
                    layerTitle.font = "15px sans-serif";
                    layerTitle.fillStyle = "rgb(133,133,133)";
                    layerTitle.fillText("Full Power Up!", 165, 200);
                    layerTitle.restore()
                };
                return self
            }));
            clearEntity(function (entity) {
                if (entity.tags.has(TAGS.hostile)) {
                    entities.push(GreenOrb(entity.X, entity.Y, 0, -2, "small", true));
                }
            }, entities.length)
        }
        if (session.player.power / 100 - old >= 1) {
            soundOfPowerUp.currentTime = 0;
            _ = soundOfPowerUp.play();
        }
        soundOfItemPickUp.currentTime = 0;
        _ = soundOfItemPickUp.play()
    };
    inst.addLayer("PowerOrb", function () {
        this.draw = function (inst) {
            if (size === "big") {
                layerStage.drawImage(big, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
            } else if (size === "middle") {
                layerStage.drawImage(middle, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
            }
        }
    });
    return inst
}
