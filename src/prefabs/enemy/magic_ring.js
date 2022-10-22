import EnemyUtil from "../enemy_util";
import {ABox, getLayer, L, LAYER_MAPPING, newImage, resources, TAGS} from "../../util";

const r360 = 360 * L;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const texture = newImage(resources.Images.enemy);
const magicRing = document.createElement("canvas");
magicRing.width = 64;
magicRing.height = 64;
texture.addEventListener("load", function () {
    let c = magicRing.getContext("2d");
    c.drawImage(texture, 0, 128, 64, 64, 0, 0, 64, 64);
});
export default function MagicRing(/* number */x, /* number */y, brain,/* number */stayTime, /* [Prefab] */drops = []) {
    const inst = EnemyUtil(x, y, -1, brain, drops)
    inst.components['health'].indestructible = true
    inst.sizeBox = new ABox(32);
    inst.rotation = 0
    let textureOpacity = 0;
    let layout = 0.02;
    let leaving = false
    inst.addComponent('MagicRing', function () {
        this.tick = function () {
            if (stayTime > 0) {
                stayTime--
            } else if (stayTime === 0) {
                inst.leave()
            } else if (inst.sizeBox.isOutScreen(inst.X, inst.Y, 0, 0)) {
                inst.tags.add(TAGS.death)
            }
            if (layout > 0) {
                if (textureOpacity < 1) {
                    textureOpacity += layout;
                    if (textureOpacity > 1) {
                        textureOpacity = 1
                    }
                }
            } else if (layout < 0) {
                if (textureOpacity > 0) {
                    textureOpacity += layout;
                    if (textureOpacity < 0) {
                        textureOpacity = 0
                    }
                } else if (leaving) {
                    inst.tags.add(TAGS.death)
                }
            }
            inst.rotation += L;
            if (inst.rotation > r360) {
                inst.rotation -= r360
            }
        }
    })
    inst.addLayer("Yousei", function () {
        this.draw = function () {
            layerStage.save();
            layerStage.globalAlpha = textureOpacity;
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(inst.rotation);
            layerStage.drawImage(magicRing, -inst.sizeBox.r, -inst.sizeBox.r)
            layerStage.restore()
        }
    })
    inst.leave = function () {
        layout = -0.02
        leaving = true
    }
    return inst
}