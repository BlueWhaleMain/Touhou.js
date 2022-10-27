import {entities, L, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import Laser from "../prefabs/laser.js";
import StarMaster from "../prefabs/star_master.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfPower0 = newAudio(resources.Sounds.power0);
const soundOfOption = newAudio(resources.Sounds.option);
const colorMapping = [
    "red", "purple", "blue", "green", "water", "gold"
];
const bitColorMapping = {
    1: "red", 2: "gold", 4: "green", 8: "blue", 16: "purple"
};
const angleMapping = {
    1: 0, 2: 1, 4: 2, 8: 3, 16: 4
};
const r90 = 90 * L;
export default function masterSpark(edit) {
    let frame = 0;
    let bombed = false;
    let colorIndex = 0;
    const meta = Math.random();
    let yaw = 360;
    let yp = 1;

    function spawnStarMaster(card, bit) {
        entities.push(StarMaster(card.entity, card.entity.X, card.entity.Y).edit(function (inst) {
            inst.tags.add(meta);
            inst.bit = bit;
            inst.addComponent("masterSpark", function () {
                let angle, ys, xs, ry, r;
                this.tick = function (inst) {
                    r = Math.min((frame - 60) * 2, 120);
                    ry = (yaw + 72 * angleMapping[bit]) * L;
                    xs = r * Math.cos(ry);
                    ys = r * Math.sin(ry);
                    inst.X = card.entity.X + xs;
                    inst.Y = card.entity.Y + ys;
                    angle = Math.atan2(ys, xs);
                    if (frame > 180 && frame % 6 === 0) {
                        entities.push(Jade("star", bitColorMapping[bit], inst.X, inst.Y, Math.sin(angle + r90),
                            -Math.cos(angle + r90)).rotate(0.1));
                        entities.push(Jade("star", bitColorMapping[bit], inst.X, inst.Y,
                            Math.sin(angle + 5 * L + r90), -Math.cos(angle + 5 * L + r90)).rotate(0.1));
                        entities.push(Jade("star", bitColorMapping[bit], inst.X, inst.Y,
                            Math.sin(angle + 25 * L + r90), -Math.cos(angle + 25 * L + r90)).rotate(0.1));
                        entities.push(Jade("star", bitColorMapping[bit], inst.X, inst.Y,
                            Math.sin(angle + 30 * L + r90), -Math.cos(angle + 30 * L + r90)).rotate(0.1));
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
        // 恋符「极限火花」 rtl的bug
        name: "「恋符「极限火花",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 4500,
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
                yaw -= yp;
                yp += 0.1;
                if (yaw < 0) {
                    yaw += 360
                }
                if (yp > 360) {
                    yp -= 360
                }
            }
            frame++
        },
        open: function () {
            frame = 0
        },
        card: function (card) {
            if (frame % 480 === 0) {
                if (Math.nextSeed() > 0.5) {
                    if (card.entity.X < 316) {
                        card.entity.target.X += 15
                    }
                } else {
                    if (card.entity.X > 150) {
                        card.entity.target.X -= 15
                    }
                }
                if (card.entity.X > 316) {
                    card.entity.target.X -= 0.2
                }
                if (card.entity.X < 150) {
                    card.entity.target.X += 0.2
                }
                frame++
            }
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            if (bombed && frame % 40 === 0) {
                const color = colorMapping[colorIndex];
                colorIndex++;
                if (colorIndex > 5) {
                    colorIndex = 0
                }
                for (let j = 0; j < 20; j++) {
                    const speed = transTo(0, 1, spyAngle + (18 * j + frame) * L);
                    if (j % 2 === 0) {
                        entities.push(Jade("bigStar", color, card.entity.X, card.entity.Y, speed[0] * 2, speed[1] * 2, undefined, false).rotate(0.02))
                    } else {
                        entities.push(Jade("bigStar", color, card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false).rotate(-0.02))
                    }
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (card.entity.X !== card.entity.target.X || card.entity.Y !== card.entity.target.Y) {
                session.flash = true;
                return
            }
            if (frame % 420 === 1) {
                soundOfPower0.currentTime = 0;
                _ = soundOfPower0.play()
            }
            if (frame % 480 === 1) {
                bombed = true;
                let a = Math.atan2(session.player.Y - card.entity.Y, session.player.X - card.entity.X) + 90 * L;
                entities.push(Laser("master_spark", undefined, card.entity.X + 256 * Math.sin(a), card.entity.Y - 256 * Math.cos(a), 0, 0, a, {
                    startTime: 60,
                    delayTime: 240,
                    outTime: 60
                }))
            }
            frame++
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
