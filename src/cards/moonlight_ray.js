/*
Moonlight Ray
 */
import CardUtil from "../card_util.js";
import {entities, L, transTo, HEIGHT, newAudio, resources, GUI_SCREEN} from "../util.js";
import Jade from "../prefabs/jade.js";
import Laser from "../prefabs/laser.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfChangeTrack = newAudio(resources.Sounds.changeTrack);
export default function moonlightRay(edit) {
    function slowPoint(card, color, a = 0) {
        for (let i = 0; i <= 360; i += 90 / 7) {
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
                            soundOfChangeTrack.currentTime = 0;
                            _ = soundOfChangeTrack.play()
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

    let frame = 0;
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
                for (let i = 0; i <= 360; i += 22.5) {
                    for (let k = 0; k < 7; k++) {
                        let speed = 0.8 + 0.2 * Math.pow(1.09, k * 2);
                        speed = transTo(speed, speed, (i + frame / 10) * L);
                        entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                }
                _ = soundOfBombShoot.play()
            }
            if (frame === 160) {
                move(card)
            }
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
                for (let i = 0; i <= 360; i += 22.5) {
                    for (let k = 0; k < 7; k++) {
                        let speed = 0.8 + 0.2 * Math.pow(1.09, k * 2);
                        speed = transTo(speed, speed, (i + frame / 10) * L);
                        entities.push(Jade("ring", "green", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                }
                _ = soundOfBombShoot.play()
            }
            frame++;
            if (frame > 420) {
                frame = 0
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
                for (let i = 0; i <= 360; i += 7.5) {
                    let speed = transTo(2, 2, (i + frame / 10) * L);
                    entities.push(Jade("point", "dimgray", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
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
