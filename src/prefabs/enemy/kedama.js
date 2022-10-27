import EnemyUtil from "../enemy_util";
import {ABox, L, RBox, TAGS} from "../../util";
import {newImage} from "../../resources/images";
import {resources} from "../../resources/manager";
import {getLayer, LAYER_MAPPING} from "../../layers/manager";

const r360 = 360 * L;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const texture = newImage(resources.Images.enemy);
const Sticker = {};
export default function Kedama(/* string */color,/* number */x, /* number */y, /* number */blood, brain,/* number */stayTime, /* [Prefab] */drops = []) {
    const inst = EnemyUtil(x, y, blood, brain, drops)
    let cache;
    inst.init = function () {
        let x = 32 * 2, y = 32 * 4, w = 32, h = 32, image = texture;
        switch (color) {
            case "blue":
                break
            case "red":
                x += 32
                break
            case "green":
                y += 32
                break
            case "yellow":
                x += 32
                y += 32
                break
            default:
                throw new Error("Kedama Color: " + color + " is not supported.")
        }
        if (x + w > image.width) {
            y += h;
            x -= image.width;
            x += w
        }
        if (Sticker[color]) {
            cache = Sticker[color]
        } else {
            cache = document.createElement("canvas");
            cache.width = w;
            cache.height = h;
            const ctx = cache.getContext("2d");
            ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
            Sticker[color] = cache
        }
    }
    inst.color = color;
    inst.sizeBox = new RBox(32, 32);
    inst.atkBox = new ABox(8);
    let textureOpacity = 0;
    let layout = 0.02;
    let rotation = 0;
    let leaving = false
    inst.addComponent('Yousei', function () {
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
            rotation += 16 * L;
            if (rotation > r360) {
                rotation -= r360
            }
        }
    })
    inst.addLayer("Yousei", function () {
        this.draw = function () {
            layerStage.save();
            layerStage.globalAlpha = textureOpacity;
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(rotation);
            layerStage.drawImage(cache, -16, -16)
            layerStage.restore()
        }
    })
    inst.leave = function () {
        layout = -0.02
        leaving = true
    }
    inst.init()
    return inst
}