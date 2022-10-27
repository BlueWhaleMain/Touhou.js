import {
    ABox,
    modifyEntity,
    session,
    TAGS,
    arrowTo,
    entities, clearEntity
} from "../util.js";
import Prefab from "../prefab.js";
import movable from "../components/movable.js";
import GreenOrb from "./green_orb.js";
import {drawSticker} from "../resources/sticker";
import {newImage} from "../resources/images";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../screens";

let _;
const texture = newImage(resources.Images.eBullet3);
const bigLightBall = {};
texture.addEventListener("load", function () {
    let canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    let ctx = canvas.getContext("2d");
    let x = 0, y = 0, w = 256, h = 256;
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.darkgray = canvas;
    x += w;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.red = canvas;
    x += w;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.hotpink = canvas;
    x += w;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.blue = canvas;
    y += h;
    x = 0;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.water = canvas;
    x += w;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.green = canvas;
    x += w;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.gold = canvas;
    x += w;
    canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    bigLightBall.orangered = canvas;
});
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function HakureiReimuLightBall(x, y, mx, my, color, startTime, big = false) {
    const inst = new Prefab(x, y);
    inst.addComponent("movable", movable);
    inst.tags.add(TAGS.player);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    inst.components["movable"].flush = false;
    const r = Math.sqrt(Math.pow(inst.X - session.player.X, 2) + Math.pow(inst.Y - session.player.Y, 2));
    if (big) {
        inst.sizeBox = new ABox(128);
    } else {
        inst.sizeBox = new ABox(16);
    }

    function boom(damage, box) {
        if (!box) {
            box = new ABox(inst.sizeBox.r)
        }
        clearEntity(function (entity) {
            if (entity.tags.has(TAGS.hostile) && entity.atkBox.isHit(entity.X, entity.Y, inst.X, inst.Y, box)) {
                entities.push(GreenOrb(entity.X, entity.Y, 0, -2, "small"));
                return true
            }
        }, entities.length);
        for (let i = 0; i < session.stage.boss.length; i++) {
            let b = session.stage.boss[i];
            if (box.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                b.components["health"].doDelta(-damage / 5)
            }
        }
    }

    inst.addComponent("HakureiReimuLightBall", function () {
        this.tick = function (inst) {
            if (startTime > 0) {
                startTime--;
            }
            const length = entities.length;
            let damage = 20;
            if (big) {
                damage = 50
            }
            let l = undefined, selectedEntity;
            if (!startTime) {
                for (let i = 0; i < length; i++) {
                    const entity = entities[i];
                    if (entity.tags.has(TAGS.enemy)) {
                        const nl = Math.pow(inst.X - entity.X, 2) + Math.pow(inst.Y - entity.Y, 2);
                        if (l === undefined || l > nl) {
                            selectedEntity = entity;
                            l = nl
                        }
                    }
                }
            }
            const count = modifyEntity(function (entity) {
                if (entity.tags.has(TAGS.enemy) && entity.atkBox) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                        if (entity.components["health"] && !entity.components["health"].indestructible) {
                            entity.components["health"].doDelta(-damage)
                        }
                        inst.tags.add(TAGS.death);
                        return true
                    }
                }
            });
            if (count > 0) {
                boom(damage);
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play();
                return
            }
            for (let i = 0; i < session.stage.boss.length; i++) {
                let b = session.stage.boss[i];
                if (b.atkBox && !b.hide) {
                    if (inst.sizeBox.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                        if (b.components["health"] && !b.components["health"].indestructible) {
                            b.components["health"].doDelta(-damage)
                        }
                        boom(damage);
                        soundOfBombShoot.currentTime = 0;
                        _ = soundOfBombShoot.play();
                        inst.tags.add(TAGS.death);
                        return
                    } else if (!startTime) {
                        const nl = Math.pow(inst.X - b.X, 2) + Math.pow(inst.Y - b.Y, 2);
                        if (l === undefined || l > nl) {
                            selectedEntity = b;
                            l = nl
                        }
                    }
                }
            }
            if (selectedEntity) {
                const speed = arrowTo(inst.X, inst.Y, selectedEntity.X, selectedEntity.Y, Math.sqrt(Math.pow(inst.components["movable"].MX, 2) + Math.pow(inst.components["movable"].MY, 2)));
                inst.components["movable"].MX = speed[0];
                inst.components["movable"].MY = speed[1]
            } else if (Math.sqrt(Math.pow(inst.X - session.player.X, 2) + Math.pow(inst.Y - session.player.Y, 2)) > r) {
                const speed = arrowTo(inst.X, inst.Y, session.player.X, session.player.Y, Math.sqrt(Math.pow(inst.components["movable"].MX, 2) + Math.pow(inst.components["movable"].MY, 2)));
                inst.X += speed[0];
                inst.Y += speed[1]
            }
            if (session.player.bombTime < 0) {
                boom(damage * 5, new ABox(inst.sizeBox.r * 2));
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play();
                inst.tags.add(TAGS.death)
            } else {
                boom(damage)
            }
        }
    });
    let sticker;
    if (big) {
        sticker = bigLightBall[color]
    } else {
        sticker = drawSticker("small_light_ball", color).layer0
    }
    if (!sticker) {
        throw new Error("Big: " + big + " Color: " + color + " is not supported.")
    }
    inst.addLayer("HakureiReimuLightBall", function () {
        this.draw = function (inst) {
            if (big) {
                layerStage.drawImage(sticker, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r);
            } else {
                layerStage.drawImage(sticker, inst.X - inst.sizeBox.r, inst.Y - inst.sizeBox.r);
            }
        }
    });
    return inst
}
