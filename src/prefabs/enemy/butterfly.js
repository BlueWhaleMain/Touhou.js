import EnemyUtil from "../enemy_util";
import {ABox, entities, EVENT_MAPPING, L, RBox, session, TAGS} from "../../util";
import {newImage} from "../../resources/images";
import {resources} from "../../resources/manager";
import {getLayer, LAYER_MAPPING} from "../../layers/manager";
import {ob} from "../../observer";

const r90 = 90 * L;
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
export default function Butterfly(/* string */color,/* number */x, /* number */y, /* number */blood, brain,/* number */stayTime, /* [Prefab] */drops = []) {
    const inst = EnemyUtil(x, y, blood, brain, drops)
    let living = [], dead = [];
    {
        let x = 128, y = 128, w = 32, h = 32, image = texture;
        switch (color) {
            case "red":
                break
            case "green":
                y += 32
                break
            case "blue":
                y += 32 * 2
                break
            case "yellow":
                y += 32 * 3
                break
            default:
                throw new Error("Butterfly Color: " + color + " is not supported.")
        }
        if (x + w > image.width) {
            y += h;
            x -= image.width;
            x += w
        }
        if (Sticker[color]) {
            living = Sticker[color].living
            dead = Sticker[color].dead
        } else {
            for (let i = 0; i < 4; i++) {
                const canvas0 = document.createElement("canvas");
                canvas0.width = w;
                canvas0.height = h;
                const ctx = canvas0.getContext("2d");
                ctx.drawImage(image, x + w * i, y, w, h, 0, 0, w, h);
                living.push(canvas0)
            }
            for (let i = 4; i < 12; i++) {
                const canvas0 = document.createElement("canvas");
                canvas0.width = w;
                canvas0.height = h;
                const ctx = canvas0.getContext("2d");
                ctx.drawImage(image, x + w * i, y, w, h, 0, 0, w, h);
                dead.push(canvas0)
            }
            Sticker[color] = {
                living: living,
                dead: dead
            }
        }
    }
    inst.color = color;
    inst.sizeBox = new RBox(32, 32);
    inst.atkBox = new ABox(6);
    inst.rotation = 0
    let envoy = false
    let textureOpacity = 0;
    let layout = 0.02;
    let normalFrame = 0;
    let dying = false
    let deadFrame = 0;
    let leaving = false
    let magicRingVisible = false, magicRingRotation = 0
    inst.addComponent('Butterfly', function () {
        this.tick = function () {
            if (dying) {
                if (deadFrame < 8) {
                    deadFrame += 0.1
                } else {
                    inst.tags.add(TAGS.death)
                }
            } else {
                if (inst.tags.has(TAGS.death)) {
                    inst.tags.delete(TAGS.death)
                    dying = true
                }
            }
            if (stayTime > 0) {
                stayTime--
            } else if (stayTime === 0) {
                inst.leave()
            } else if (inst.sizeBox.isOutedScreen(inst.X, inst.Y)) {
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
            normalFrame += 0.1;
            if (normalFrame > 3) {
                normalFrame = 0
            }
            if (magicRingVisible) {
                magicRingRotation += L;
                if (magicRingRotation > r360) {
                    magicRingRotation -= r360
                }
            }
        }
    })
    inst.addLayer("Butterfly", function () {
        this.draw = function () {
            if (magicRingVisible || (envoy && session.player.tags.has(TAGS.monster))) {
                layerStage.save();
                layerStage.translate(inst.X, inst.Y);
                layerStage.rotate(magicRingRotation);
                layerStage.drawImage(magicRing, -32, -32)
                layerStage.restore()
                if (envoy) {
                    return
                }
            }
            layerStage.save();
            layerStage.translate(inst.X, inst.Y);
            layerStage.rotate(inst.rotation + r90);
            layerStage.globalAlpha = textureOpacity;
            if (dying) {
                layerStage.drawImage(dead[Math.floor(deadFrame)], -16, -16)
            } else {
                layerStage.drawImage(living[Math.floor(normalFrame)], -16, -16)
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
    inst.toEnvoy = function (entity) {
        envoy = true
        inst.callback.healthDelta = (val) => {
            if (session.player.tags.has(TAGS.human)) {
                if (entity && entity.components["health"]) {
                    entity.components["health"].doDelta(val / 2);
                }
                return true
            }
            return false
        }

        inst.addComponent('envoyDie', function () {
            this.tick = function (_) {
                if (entities.indexOf(entity) < 0 && session?.stage?.boss?.indexOf(entity) < 0) {
                    die()
                }
            }
        })

        function die() {
            dying = true
            inst.tags.add(TAGS.death)
        }

        ob.addEventListener(EVENT_MAPPING.cardEnEp, die);

        function load() {
            if (inst.tags.has(TAGS.death)) {
                ob.removeEventListener(EVENT_MAPPING.load, load);
                ob.removeEventListener(EVENT_MAPPING.cardEnEp, die);
            }
        }

        ob.addEventListener(EVENT_MAPPING.load, load);
    }
    inst.edit = function (f) {
        f(inst);
        return inst
    };
    return inst
}