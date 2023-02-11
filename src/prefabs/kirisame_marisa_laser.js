import {clearEntity, entities, L, modifyEntity, RBox, session, TAGS} from "../util.js";
import Prefab from "../prefab.js";
import {drawSticker} from "../resources/sticker";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {getLayer, HEIGHT, LAYER_MAPPING} from "../layers/manager";
import {newImage} from "../resources/images";
import GreenOrb from "./green_orb";

let _;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const soundOfNep00 = newAudio(resources.Sounds.nep00);
const texture = newImage(resources.Images.player.kirisameMarisaShot);
const normalCache = document.createElement("canvas");
normalCache.width = 14;
normalCache.height = HEIGHT - 32;
const normalCacheCtx = normalCache.getContext('2d');
texture.addEventListener("load", function () {
    let laserNM = false
    for (let i = 0; i < HEIGHT * 2; i += 128) {
        if (laserNM) {
            normalCacheCtx.drawImage(texture, 64, 0, 14, 128, 0, i, 14, 128)
        } else {
            normalCacheCtx.drawImage(texture, 48, 0, 14, 128, 0, i, 14, 128);
        }
        laserNM = !laserNM
    }
});
export default function kirisameMarisaLaser(x, y) {
    const inst = new Prefab(x, y);
    inst.tags.add(TAGS.player);
    inst.init = function () {
        const type = inst.type;
        let drawCache;
        switch (type) {
            case "normal":
                inst.sizeBox = new RBox(14, HEIGHT - 32);
                break;
            case "master_spark":
                drawCache = drawSticker(type).layer0
                inst.sizeBox = new RBox(256, 512, inst.rotation);
                break;
        }
        inst.removeComponent('kirisameMarisaLaser');
        let playerX = session.player.X
        let playerY = session.player.Y
        let normalStep = 0;
        inst.addComponent("kirisameMarisaLaser", function () {
            let playerRotate = 0;
            this.tick = function (inst) {
                const relativeX = session.player.X - playerX
                inst.X += relativeX
                inst.Y += session.player.Y - playerY
                playerX = session.player.X
                playerY = session.player.Y
                let damage;
                if (type === 'master_spark') {
                    if (inst.startTime > 0) {
                        inst.startTime--;
                        return
                    }
                    if (inst.startTime === 0) {
                        inst.startTime--;
                        inst.start()
                    }
                    if (inst.delayTime > 0 || inst.delayTime === undefined) {
                        if (inst.layTime < inst.sizeBox.xs) {
                            inst.layTime++;
                        }
                        if (inst.delayTime !== undefined) {
                            inst.delayTime--;
                        }
                    } else {
                        if (inst.outTime > 0) {
                            inst.outTime--;
                            if (inst.layTime > 1) {
                                inst.layTime--
                            }
                        } else {
                            inst.tags.add(TAGS.death)
                        }
                    }
                    if (inst.rotatable) {
                        damage = 10;
                        if (relativeX > 0) {
                            if (playerRotate < 0) {
                                playerRotate += 0.2
                            }
                            if (playerRotate < 30) {
                                playerRotate += 0.2
                            }
                            inst.rotate(session.player, playerRotate * L)
                        } else if (relativeX < 0) {
                            if (playerRotate > 0) {
                                playerRotate -= 0.2
                            }
                            if (playerRotate > -30) {
                                playerRotate -= 0.2
                            }
                            inst.rotate(session.player, playerRotate * L)
                        } else {
                            if (playerRotate > 0) {
                                playerRotate--
                            } else if (playerRotate < 0) {
                                playerRotate++
                            }
                            if (Math.abs(playerRotate) < 1) {
                                playerRotate = 0
                            }
                            inst.rotate(session.player, playerRotate * L)
                        }
                    } else {
                        damage = 4;
                    }
                    clearEntity(function (entity) {
                        if (entity.tags.has(TAGS.hostile) && entity.atkBox.isHit(entity.X, entity.Y, inst.X, inst.Y, inst.sizeBox)) {
                            entities.push(GreenOrb(entity.X, entity.Y, 0, -2, "small"));
                            return true
                        }
                    }, entities.length);
                    modifyEntity(function (entity) {
                        if (entity.tags.has(TAGS.enemy) && entity.atkBox) {
                            if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                                if (entity.components["health"] && !entity.components["health"].indestructible) {
                                    entity.components["health"].doDelta(-damage)
                                }
                            }
                        }
                    });
                    for (let i = 0; i < session.stage.boss.length; i++) {
                        let b = session.stage.boss[i];
                        if (inst.sizeBox.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                            b.components["health"].doDelta(-damage / 5)
                        }
                    }
                } else if (type === 'normal') {
                    if (!inst.canUse()) {
                        return;
                    }
                    normalStep += 16
                    if (normalStep >= 256) {
                        normalStep = 0
                    }
                    damage = 0.1;
                    const count = modifyEntity(function (entity) {
                        if (entity.tags.has(TAGS.enemy) && entity.atkBox) {
                            if (inst.sizeBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.atkBox)) {
                                if (entity.components["health"] && !entity.components["health"].indestructible) {
                                    entity.components["health"].doDelta(-damage)
                                }
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
                                    b.components["health"].doDelta(-damage)
                                }
                                return
                            }
                        }
                    }
                }
            }
        });
        inst.removeLayer("kirisameMarisaLaser");
        inst.addLayer("kirisameMarisaLaser", function () {
            const startTime = inst.startTime;
            this.draw = function (inst) {
                if (type === "master_spark") {
                    if (inst.delayTime <= 0 && inst.outTime <= 0) {
                        return
                    }
                    if (inst.startTime > 0) {
                        const height = inst.sizeBox.ys * (1 - inst.startTime / startTime);
                        layerStage.save();
                        layerStage.translate(inst.X + Math.sin(inst.rotation) * (height / 2 - 256), inst.Y - Math.cos(inst.rotation) * (height / 2 - 256));
                        layerStage.rotate(inst.rotation);
                        layerStage.drawImage(drawCache, 4, -height / 2, 4, height);
                        layerStage.restore();
                        return
                    }
                }
                if (type === "master_spark") {
                    layerStage.save();
                    layerStage.translate(inst.X, inst.Y);
                    layerStage.rotate(inst.rotation);
                    let width = Math.min(inst.sizeBox.xs, inst.layTime);
                    if (inst.delayTime <= 0) {
                        layerStage.globalAlpha = width / inst.sizeBox.xs;
                        session.fake = false
                    } else {
                        if (inst.layTime * 10 <= inst.sizeBox.xs) {
                            width = Math.min(inst.sizeBox.xs, inst.layTime * 10);
                        } else {
                            width = inst.sizeBox.xs
                        }
                        session.fake = true
                    }
                    layerStage.drawImage(drawCache, -width / 2, -inst.sizeBox.ys / 2, width, inst.sizeBox.ys);
                    layerStage.restore();
                } else if (type === 'normal') {
                    if (inst.canUse()) {
                        let laserNM = false
                        normalCacheCtx.clearRect(0, 0, normalCache.width, normalCache.height)
                        for (let i = -normalStep; i < HEIGHT * 2; i += 128) {
                            if (laserNM) {
                                normalCacheCtx.drawImage(texture, 64, 0, 14, 128, 0, i, 14, 128)
                            } else {
                                normalCacheCtx.drawImage(texture, 48, 0, 14, 128, 0, i, 14, 128);
                            }
                            laserNM = !laserNM
                        }
                        layerStage.drawImage(normalCache, inst.X - 7, inst.Y - 256 + 32);
                    }
                }
            }
        });
    };

    inst.normal = function (powerMin, powerMax) {
        inst.type = 'normal';
        inst.tags.add(TAGS.underPlayer);
        inst.canUse = function () {
            if (session.slow) {
                return
            }
            let power = session.player.power
            return session.player.shootDelay > 0 && power >= powerMin && power <= powerMax
        }
        inst.init();
        return inst
    }
    inst.masterSpark = function (time, rotatable = false) {
        inst.type = 'master_spark';
        inst.rotation = 0;
        inst.layTime = 1;
        if (time) {
            inst.startTime = time.startTime;
            inst.delayTime = time.delayTime;
            inst.outTime = time.outTime;
        }
        inst.rotatable = rotatable
        inst.rotate = function (b, a, l = 256) {
            inst.X = b.X + l * Math.sin(a);
            inst.Y = b.Y - l * Math.cos(a);
            inst.sizeBox.rotation = a;
            inst.rotation = a;
            return inst
        };
        inst.start = function () {
            soundOfNep00.currentTime = 0;
            _ = soundOfNep00.play()
        };
        inst.init();
        return inst
    }
    return inst
}
