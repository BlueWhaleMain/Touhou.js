import EnemyUtil from "../enemy_util";
import {ABox, getLayer, L, LAYER_MAPPING, newImage, RBox, resources, TAGS} from "../../util";

const r360 = 360 * L;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const texture = newImage(resources.Images.enemy);
const Sticker = {};
const magicRing = document.createElement("canvas");
magicRing.width = 64;
magicRing.height = 64;
texture.addEventListener("load", function () {
    let c = magicRing.getContext("2d");
    c.drawImage(texture, 0, 128, 64, 64, 0, 0, 64, 64);
});
export default function Yousei(/* string */type,/* string */color,/* number */x, /* number */y, /* number */blood, brain,/* number */stayTime, /* [Prefab] */drops = []) {
    const inst = EnemyUtil(x, y, blood, brain, drops)
    let youseiLeft = [], youseiRight = [], youseiNormal = []
    inst.init = function () {
        let x = 0, y = 0, w = 32, h = 32, image = texture;
        switch (type) {
            case "normal":
                break
            case "hatted":
                x = 32 * 8
                break
            case "rabbit_ears":
                y = 32 * 8
                break
            case "hatted2":
                x = 32 * 8
                y = 32 * 8
                break
            default:
                throw new Error("Type: " + type + " is not supported.")
        }
        switch (color) {
            case "blue":
                break
            case "red":
                y += 32
                break
            case "green":
                y += 32 * 2
                break
            case "yellow":
                y += 32 * 3
                break
            default:
                throw new Error(type + " Color: " + color + " is not supported.")
        }
        if (x + w > image.width) {
            y += h;
            x -= image.width;
            x += w
        }
        if (!Sticker[type]) {
            Sticker[type] = {}
        }
        if (Sticker[type][color]) {
            youseiNormal = Sticker[type][color].youseiNormal
            youseiLeft = Sticker[type][color].youseiLeft
            youseiRight = Sticker[type][color].youseiRight
        } else {
            for (let i = 0; i < 4; i++) {
                const canvas0 = document.createElement("canvas");
                canvas0.width = w;
                canvas0.height = h;
                const ctx = canvas0.getContext("2d");
                ctx.drawImage(image, x + w * i, y, w, h, 0, 0, w, h);
                youseiNormal.push(canvas0)
            }
            for (let i = 4; i < 8; i++) {
                const canvas0 = document.createElement("canvas");
                canvas0.width = w;
                canvas0.height = h;
                const ctx = canvas0.getContext("2d");
                ctx.drawImage(image, x + w * i, y, w, h, 0, 0, w, h);
                youseiLeft.push(canvas0)
                const canvas1 = document.createElement("canvas");
                canvas1.width = w;
                canvas1.height = h;
                const ctx1 = canvas1.getContext("2d");
                ctx1.translate(w, 0);
                ctx1.scale(-1, 1);
                ctx1.drawImage(canvas0, 0, 0);
                youseiRight.push(canvas1)
            }
            Sticker[type][color] = {
                youseiNormal: youseiNormal,
                youseiLeft: youseiLeft,
                youseiRight: youseiRight
            }
        }
    }
    inst.type = type;
    inst.color = color;
    inst.sizeBox = new RBox(32, 32);
    inst.atkBox = new ABox(8);
    let textureOpacity = 0;
    let layout = 0.02;
    let normalFrame = 0;
    let moveFrame = 0;
    let leaving = false
    let magicRingVisible = false, magicRingRotation = 0
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
            if (moveFrame) {
                if (moveFrame > 0) {
                    moveFrame -= 0.5
                } else {
                    moveFrame += 0.5
                }
                if (moveFrame > 3 || moveFrame < -3) {
                    moveFrame = 0
                }
            } else {
                normalFrame += 0.1;
                if (normalFrame > 3) {
                    normalFrame = 0
                }
            }
            if (magicRingVisible) {
                magicRingRotation += L;
                if (magicRingRotation > r360) {
                    magicRingRotation -= r360
                }
            }
        }
    })
    inst.addLayer("Yousei", function () {
        this.draw = function () {
            if (magicRingVisible) {
                layerStage.save();
                layerStage.translate(inst.X, inst.Y);
                layerStage.rotate(magicRingRotation);
                layerStage.drawImage(magicRing, -32, -32)
                layerStage.restore()
            }
            layerStage.save();
            layerStage.globalAlpha = textureOpacity;
            if (moveFrame) {
                if (moveFrame > 0) {
                    layerStage.drawImage(youseiRight[Math.floor(moveFrame)], inst.X - 16, inst.Y - 16)
                } else {
                    layerStage.drawImage(youseiLeft[Math.floor(-moveFrame)], inst.X - 16, inst.Y - 16)
                }
            } else {
                layerStage.drawImage(youseiNormal[Math.floor(normalFrame)], inst.X - 16, inst.Y - 16)
            }
            layerStage.restore()
        }
    })
    inst.leave = function () {
        layout = -0.02
        leaving = true
    }
    inst.showMagicRing = function () {
        magicRingVisible = true
    }
    inst.left = function () {
        if (moveFrame > -3) {
            moveFrame--
        }
    }
    inst.right = function () {
        if (moveFrame < 3) {
            moveFrame++
        }
    }
    inst.init()
    return inst
}