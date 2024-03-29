import {entities, L, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import StarMaster from "../prefabs/star_master.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {HEIGHT} from "../layers/manager";

let _;
const soundOfOption = newAudio(resources.Sounds.option);
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const colorMapping = {
    1: "red", 2: "gold", 4: "green", 8: "blue", 16: "purple"
};
const angleMapping = {
    1: 0, 2: 1, 4: 2, 8: 3, 16: 4
};
const r90 = 90 * L;
export default function asteroidBelt(edit) {
    let frame = 0;
    const meta = Math.random();
    let rotationAngle = 360;

    function spawnStarMaster(card, bit) {
        entities.push(StarMaster(card.entity, card.entity.X, card.entity.Y).edit(function (inst) {
            inst.tags.add(meta);
            inst.bit = bit;
            inst.addComponent("milkyWay", function () {
                let rotationRad, ys, xs, ry, r;
                this.tick = function (inst) {
                    r = Math.min((frame - 60) * 2, 120);
                    ry = (rotationAngle + 72 * angleMapping[bit]) * L;
                    xs = r * Math.cos(ry);
                    ys = r * Math.sin(ry);
                    inst.X = card.entity.X + xs;
                    inst.Y = card.entity.Y + ys;
                    rotationRad = Math.atan2(ys, xs);
                    if (frame > 180 && frame % 5 === 0) {
                        entities.push(Jade("star", colorMapping[bit], inst.X, inst.Y, Math.sin(rotationRad + r90),
                            -Math.cos(rotationRad + r90)).rotate(0.1));
                        entities.push(Jade("star", colorMapping[bit], inst.X, inst.Y,
                            Math.sin(rotationRad + 5 * L + r90), -Math.cos(rotationRad + 5 * L + r90)).rotate(0.1));
                        entities.push(Jade("star", colorMapping[bit], inst.X, inst.Y,
                            Math.sin(rotationRad + 25 * L + r90), -Math.cos(rotationRad + 25 * L + r90)).rotate(0.1));
                        entities.push(Jade("star", colorMapping[bit], inst.X, inst.Y,
                            Math.sin(rotationRad + 30 * L + r90), -Math.cos(rotationRad + 30 * L + r90)).rotate(0.1));
                        soundOfBombShoot.currentTime = 0;
                        _ = soundOfBombShoot.play()
                    }
                }
            })
        }));
        soundOfOption.currentTime = 0;
        _ = soundOfOption.play()
    }

    const cardData = {
        // 魔空「小行星带」 rtl的bug
        name: "「魔空「小行星带",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 3800,
        bonus: 1000000,
        noCardFrame: 2400,
        noCard: function (card) {
            if (frame === 60) {
                spawnStarMaster(card, 1);
                spawnStarMaster(card, 2);
                spawnStarMaster(card, 4);
                spawnStarMaster(card, 8);
                spawnStarMaster(card, 16);
            }
            if (frame > 60) {
                if (frame % 30 === 0) {
                    let envoys = 0;
                    const len = entities.length;
                    for (let i = 0; i < len; i++) {
                        if (entities[i].tags.has(meta)) {
                            envoys += entities[i].bit
                        }
                    }
                    //1 2 4 8 16 五个使魔
                    if ((envoys & 1) !== 1) {
                        spawnStarMaster(card, 1)
                    } else if ((envoys & 2) !== 2) {
                        spawnStarMaster(card, 2)
                    } else if ((envoys & 4) !== 4) {
                        spawnStarMaster(card, 4)
                    } else if ((envoys & 8) !== 8) {
                        spawnStarMaster(card, 8)
                    } else if ((envoys & 16) !== 16) {
                        spawnStarMaster(card, 16)
                    }
                }
                rotationAngle -= 3;
                if (rotationAngle < 0) {
                    rotationAngle += 360
                }
            }
            frame++
        },
        card: function (card) {
            const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            for (let i = 0; i < 50; i++) {
                if (frame === 15 * i) {
                    for (let j = 0; j < 21; j++) {
                        const speed = transTo(0, 2, spyRad - (5 * frame + 17 * j) * L);
                        if (frame % 2 === 1) {
                            entities.push(Jade("bigStar", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false))
                        } else {
                            entities.push(Jade("bigStar", "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false))
                        }
                    }
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                }
            }
            // 一段时间后的斜向弹幕
            for (let i = 0; i < 20; i++) {
                if (frame === 20 * i + 50) {
                    for (let j = 0; j < 3; j++) {
                        const speed = transTo(0, 0.5, spyRad - 90 * L);
                        const spawnPoint = [20, (Math.nextSeed() * HEIGHT)];
                        entities.push(Jade("star", "gold", spawnPoint[0], spawnPoint[1], speed[0], speed[1], undefined, false).rotate(0.1))
                    }
                }
                if (frame === 20 * i + 50) {
                    for (let j = 0; j < 3; j++) {
                        const speed = transTo(0, 0.5, spyRad + 90 * L);
                        const spawnPoint = [410, (Math.nextSeed() * HEIGHT)];
                        entities.push(Jade("star", "green", spawnPoint[0], spawnPoint[1], speed[0], speed[1], undefined, false).rotate(0.1))
                    }
                }
            }
            frame++;
            if (frame > 755) {
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
