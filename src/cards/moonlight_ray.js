/*
Moonlight Ray
 */
import CardUtil from "../card_util.js";
import {entities, GUI_SCREEN, L, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import Laser from "../prefabs/laser.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {HEIGHT} from "../layers/manager";

let _;
const r90 = 90 * L;
const soundOfPower1 = newAudio(resources.Sounds.power1);
const soundOfBombShoot1 = newAudio(resources.Sounds.bombShoot1);
export default function moonlightRay(edit) {
    function slowPoint(card, color, a = 0) {
        for (let i = 0; i < 360; i += 90 / 7) {
            const speed = transTo(2, 2, (i + a) * L);
            entities.push(Jade("point", color, card.entity.X, card.entity.Y, speed[0], speed[1], undefined).edit(function (inst) {
                inst.addComponent("slow", function () {
                    let sp = 0;
                    let fr = 0;
                    this.tick = function (inst) {
                        if (fr < 20) {
                            fr++;
                            return
                        }
                        if (fr === 20) {
                            inst.components["movable"].MX = 0;
                            inst.components["movable"].MY = 0
                        }
                        if (fr < 60) {
                            fr++;
                            return;
                        }
                        if (fr === 60) {
                            fr++;
                        }
                        const spe = transTo(sp, sp, (i + a) * L);
                        inst.components["movable"].MX = spe[0];
                        inst.components["movable"].MY = spe[1];
                        if (sp < 2) {
                            sp += 0.02
                        } else {
                            inst.removeComponent("slow")
                        }
                    }
                })
            }));
        }
        soundOfBombShoot1.currentTime = 0
        _ = soundOfBombShoot1.play()
    }

    function move(card) {
        card.entity.maxMovementSpeed = 3;
        if (Math.nextSeed() > 0.5) {
            if (card.entity.X < GUI_SCREEN.WIDTH - GUI_SCREEN.X) {
                card.entity.target.X += 50
            }
        } else {
            if (card.entity.X > 2 * GUI_SCREEN.X) {
                card.entity.target.X -= 50
            }
        }
        if (Math.nextSeed() > 0.5) {
            if (card.entity.Y < 20) {
                card.entity.target.Y += 10
            }
        } else {
            if (card.entity.Y > 100) {
                card.entity.target.Y -= 10
            }
        }
        if (card.entity.X > GUI_SCREEN.WIDTH - GUI_SCREEN.X) {
            card.entity.target.X -= 50
        }
        if (card.entity.X < 2 * GUI_SCREEN.X) {
            card.entity.target.X += 50
        }
        if (card.entity.Y > 100) {
            card.entity.target.Y -= 1
        }
        if (card.entity.Y < 20) {
            card.entity.target.Y += 1
        }
    }

    let frame = 0, c = 0;
    const cardData = {
        // 月符「月亮光」 rtl的bug
        name: "「月符「月亮光",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 2400,
        bonus: 400000,
        noCardFrame: 2400,
        noCard: function (card) {
            if (frame === 0) {
                move(card)
            }
            if (frame === 80) {
                for (let i = 0; i < 360; i += 22.5) {
                    for (let k = 0; k < 7; k++) {
                        let speed = 0.8 + 0.4 * Math.pow(1.1, k * 2);
                        speed = transTo(speed, speed, (i + frame / 10) * L);
                        entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                }
                _ = soundOfPower1.play()
            }
            if (frame === 160) {
                move(card)
            }
            if (c < 1) {
                if (frame === 240) {
                    slowPoint(card, "blue")
                }
                if (frame === 250) {
                    slowPoint(card, "crimson", 3)
                }
                if (frame === 260) {
                    slowPoint(card, "green", 6)
                }
                if (frame === 270) {
                    slowPoint(card, "gold", 9)
                }
                if (frame === 280) {
                    slowPoint(card, "red", 12)
                }
                if (frame === 300) {
                    move(card)
                }
                if (frame === 360) {
                    for (let i = 0; i < 360; i += 22.5) {
                        for (let k = 0; k < 7; k++) {
                            let speed = 0.8 + 0.4 * Math.pow(1.1, k * 2);
                            speed = transTo(0, speed, (i + frame / 10) * L);
                            entities.push(Jade("ring", "green", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                        }
                    }
                    _ = soundOfPower1.play()
                }
                const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r90;
                if (frame === 380) {
                    for (let i = 0; i < 360; i += 22.5) {
                        for (let k = 0; k < 7; k++) {
                            let speed = 0.8 + 0.4 * Math.pow(1.1, k * 2);
                            speed = transTo(0, speed, i * L + spyRad);
                            entities.push(Jade("ring", "gold", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                        }
                    }
                    _ = soundOfPower1.play()
                }
            } else {
                if (frame === 240) {
                    for (let i = 0; i < 360; i += 11.25) {
                        let speed = 1.8;
                        speed = transTo(0, speed, (i + frame / 10) * L);
                        entities.push(Jade("rice", "green", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                }
                if (frame === 250) {
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r90;
                    for (let i = 0; i < 360; i += 11.25) {
                        let speed = 1.8;
                        speed = transTo(0, speed, i * L + spyRad);
                        entities.push(Jade("rice", "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 260) {
                    for (let i = 0; i < 360; i += 11.25) {
                        let speed = 1.4;
                        speed = transTo(0, speed, i * L);
                        entities.push(Jade('point', "gold", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 270) {
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r90;
                    for (let i = 0; i < 360; i += 22.5) {
                        let speed = 1;
                        speed = transTo(0, speed, i * L + spyRad);
                        entities.push(Jade("rice", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 280) {
                    for (let i = 0; i < 360; i += 11.25) {
                        let speed = 1.4;
                        speed = transTo(0, speed, i * L);
                        entities.push(Jade('point', "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 290) {
                    for (let i = 0; i < 360; i += 11.25) {
                        let speed = 1.4;
                        speed = transTo(0, speed, i * L);
                        entities.push(Jade('point', "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 300) {
                    move(card)
                }
                if (frame === 360) {
                    for (let i = 0; i < 360; i += 22.5) {
                        for (let k = 0; k < 7; k++) {
                            let speed = 0.8 + 0.4 * Math.pow(1.1, k * 2);
                            speed = transTo(0, speed, (i + frame / 10) * L);
                            entities.push(Jade("ring", "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                        }
                    }
                    _ = soundOfPower1.play()
                }
                const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r90;
                if (frame === 380) {
                    for (let i = 0; i < 360; i += 22.5) {
                        for (let k = 0; k < 7; k++) {
                            let speed = 0.8 + 0.4 * Math.pow(1.1, k * 2);
                            speed = transTo(0, speed, i * L + spyRad);
                            entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                        }
                    }
                    _ = soundOfPower1.play()
                    c = 0
                    frame = 150
                }
            }
            frame++;
            if (frame > 420) {
                frame = 0
                c++
            }
        },
        card: function (card) {
            if (frame === 0) {
                let a = 90 * L;
                entities.push(Laser("laser", "blue", card.entity.X + 256 * Math.sin(a), card.entity.Y - 256 * Math.cos(a), 0, 0, a, {
                    startTime: 0,
                    delayTime: 80,
                    outTime: 8
                }).edit(function (inst) {
                    let sa = a;
                    inst.addComponent("rotateLaser", function () {
                        this.tick = function (inst) {
                            sa += L;
                            inst.rotate(card.entity, sa)
                        }
                    });
                    inst.sizeBox.xs = 32;
                    inst.sizeBox.ys = HEIGHT + 64;
                    inst.atkBox.xs = 24;
                    inst.atkBox.ys = HEIGHT
                }));
                a = 270 * L;
                entities.push(Laser("laser", "blue", card.entity.X + 256 * Math.sin(a), card.entity.Y - 256 * Math.cos(a), 0, 0, a, {
                    startTime: 0,
                    delayTime: 80,
                    outTime: 8
                }).edit(function (inst) {
                    let sa = a;
                    inst.addComponent("rotateLaser", function () {
                        this.tick = function (inst) {
                            sa -= L;
                            inst.rotate(card.entity, sa)
                        }
                    });
                    inst.sizeBox.xs = 32;
                    inst.sizeBox.ys = HEIGHT + 64;
                    inst.atkBox.xs = 24;
                    inst.atkBox.ys = HEIGHT
                }));
            } else if (frame % 30 === 0) {
                for (let i = 0; i < 360; i += 7.5) {
                    let speed = transTo(2, 2, (i + frame / 10) * L);
                    entities.push(Jade("point", "dimgray", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
                }
            }
            frame++;
            if (frame > 180) {
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
