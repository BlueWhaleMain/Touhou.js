import Prefab from "../prefab.js";
import item from "../components/item.js";
import movable from "../components/movable.js";
import {
    ABox,
    entities,
    EVENT_MAPPING,
    GUI_SCREEN,
    RBox,
    session
} from "../util.js";
import {title} from "../dialogue.js";
import {ob} from "../observer.js";
import {newImage} from "../resources/images";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../screens";

const big = document.createElement("canvas");
big.width = 16;
big.height = 16;
const middle = document.createElement("canvas");
middle.width = 12;
middle.height = 12;
const texture = newImage(resources.Images.powerOrb);
texture.addEventListener("load", function () {
    const bigCtx = big.getContext("2d");
    bigCtx.drawImage(texture, 15, 1, 16, 16, 0, 0, 16, 16);
    const middleCtx = middle.getContext("2d");
    middleCtx.drawImage(texture, 1, 3, 12, 12, 0, 0, 12, 12);
});
const bigOverHeadTexture = document.createElement("canvas")
bigOverHeadTexture.width = 12;
bigOverHeadTexture.height = 13;
const middleOverHeadTexture = document.createElement('canvas')
middleOverHeadTexture.width = 10
middleOverHeadTexture.height = 10
const eBullet2 = newImage(resources.Images.eBullet2);
eBullet2.addEventListener('load', function () {
    const bigOverHeadTextureCtx = bigOverHeadTexture.getContext("2d")
    bigOverHeadTextureCtx.drawImage(eBullet2, 7 * 32 + 16 + 2, 13 * 32 + 2, 12, 13, 0, 0, 12, 13)
    const middleOverHeadTextureCtx = middleOverHeadTexture.getContext('2d')
    middleOverHeadTextureCtx.drawImage(eBullet2, 6 * 32 + 3, 13 * 32 + 2, 10, 10, 0, 0, 10, 10)
})
const soundOfItemPickUp = newAudio(resources.Sounds.item);
const soundOfPowerUp = newAudio(resources.Sounds.powerUp);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
let _;

export default function PowerOrb(x, y, mx, my, size = "middle") {
    const inst = new Prefab(x, y);
    if (size === "big") {
        inst.sizeBox = new RBox(16, 16);
    } else if (size === "middle") {
        inst.sizeBox = new RBox(12, 12);
    }
    inst.pickBox = new ABox(8);
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
            ob.dispatchEvent(EVENT_MAPPING.clearEntity, {drop: true})
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
                if (inst.sizeBox.isOverHead(inst.X, inst.Y)) {
                    layerStage.drawImage(bigOverHeadTexture, inst.X - inst.sizeBox.xs / 2, GUI_SCREEN.Y)
                }
            } else if (size === "middle") {
                layerStage.drawImage(middle, inst.X - inst.sizeBox.xs / 2, inst.Y - inst.sizeBox.ys / 2)
                if (inst.sizeBox.isOverHead(inst.X, inst.Y)) {
                    layerStage.drawImage(middleOverHeadTexture, inst.X - inst.sizeBox.xs / 2, GUI_SCREEN.Y)
                }
            }
        }
    });
    return inst
}
