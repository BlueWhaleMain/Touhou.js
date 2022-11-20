import {entities, GUI_SCREEN, L, session, TAGS, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import {makeMovableRotate, movableAddSpeed} from "../components/movable.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import Butterfly from "../prefabs/enemy/butterfly";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfBombShoot1 = newAudio(resources.Sounds.bombShoot1);
const soundOfChangeTrack = newAudio(resources.Sounds.changeTrack);
const soundOfOption = newAudio(resources.Sounds.option);
export default function cometsOnTheGround(edit) {
    function spawn1(card, color, spyAngle, rotateAngle) {
        const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
        for (let i = 0; i < 200; i += 10) {
            for (let k = 0; k < 6; k++) {
                let speed = 0.8 * Math.pow(1.2, k);
                speed = transTo(0, speed, (i + spyAngle) * L);
                entities.push(Jade("rice", color, card.entity.X, card.entity.Y, speed[0], speed[1],
                    undefined).edit((inst) => {
                    inst.addComponent("open", function () {
                        let timeUp = 0
                        let timeDown = 40 + (k <= 1 ? k : 2) * 10
                        let MX = 0, MY = 0
                        this.tick = function (inst) {
                            const movable = inst.components['movable']
                            if (timeUp === 40) {
                                MX = movable.MX
                                MY = movable.MY
                                movable.MX = 0
                                movable.MY = 0
                            }
                            if (timeDown === 0) {
                                movable.MX = MX
                                movable.MY = MY
                                makeMovableRotate(inst, 0.05 - k / 100, spyRad / L + rotateAngle)
                                soundOfChangeTrack.currentTime = 0;
                                _ = soundOfChangeTrack.play()
                            }
                            if (timeUp > 80 + k * 10) {
                                movableAddSpeed(inst, mx => {
                                    return mx * 0.6
                                }, my => {
                                    return my * 0.6
                                }, movable.MX * 0.6, movable.MY * 0.6, movable.MX, movable.MY);
                                inst.removeComponent("open")
                            }
                            timeUp++
                            timeDown--
                        }
                    })
                }));
            }
        }
        soundOfBombShoot1.currentTime = 0
        _ = soundOfBombShoot1.play()
    }

    function spawn2(card, color1, color2) {
        const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
        for (let i = 0; i <= 60; i += 3) {
            if ([60, 51, 0, 9].indexOf(i) > -1) {
                for (let k = 0; k < 6; k++) {
                    let speed = 0.8 * Math.pow(1.2, k);
                    speed = transTo(0, speed, (i + 90 + 60) * L + spyRad);
                    entities.push(Jade("small", color1, card.entity.X, card.entity.Y,
                        speed[0], speed[1], undefined).edit((inst) => {
                        const movable = inst.components['movable']
                        let MX = movable.MX, MY = movable.MY
                        movableAddSpeed(inst, mx => {
                            return mx - 0.01 * MX
                        }, my => {
                            return my - 0.01 * MY
                        }, MX * 0.4, MY * 0.4, MX, MY);
                        inst.addComponent("open", function () {
                            let timeDown = 60
                            this.tick = function (inst) {
                                if (timeDown === 0) {
                                    movableAddSpeed(inst, mx => {
                                        return mx + 0.01 * MX
                                    }, my => {
                                        return my + 0.01 * MY
                                    }, MX * 1.4, MY * 1.4, MX, MY);
                                    inst.removeComponent("open")
                                    soundOfChangeTrack.currentTime = 0;
                                    _ = soundOfChangeTrack.play()
                                }
                                timeDown--
                            }
                        })
                    }));
                }
            } else if (i > 30 - 12 && i < 30 || i < 30 + 12 && i > 30) {
                for (let k = 0; k < 6; k++) {
                    let speed = 1.2 * Math.pow(1.2, k);
                    speed = transTo(0, speed, (i + 90 + 60) * L + spyRad);
                    entities.push(Jade("small", color2, card.entity.X, card.entity.Y,
                        speed[0], speed[1], undefined).edit((inst) => {
                        const movable = inst.components['movable']
                        let MX = movable.MX, MY = movable.MY
                        movableAddSpeed(inst, mx => {
                            return mx - 0.01 * mx
                        }, my => {
                            return my - 0.01 * my
                        }, MX * 0.4, MY * 0.4, MX, MY);
                        inst.addComponent("open", function () {
                            let timeDown = 60
                            this.tick = function (inst) {
                                if (timeDown === 0) {
                                    movableAddSpeed(inst, mx => {
                                        return mx + 0.01 * mx
                                    }, my => {
                                        return my + 0.01 * my
                                    }, MX * 1.4, MY * 1.4, MX, MY);
                                    inst.removeComponent("open")
                                    soundOfChangeTrack.currentTime = 0;
                                    _ = soundOfChangeTrack.play()
                                }
                                timeDown--
                            }
                        })
                    }));
                }
            }
        }
        soundOfBombShoot1.currentTime = 0
        _ = soundOfBombShoot1.play()
    }

    function spawnButterfly(card, color, spyAngle, angleAdd, rAdd, rMax) {
        let rotationRad, ys, xs, ry, r = 0, frame = 0;
        entities.push(Butterfly(color, card.entity.X, card.entity.Y, 100, (inst) => {
            r = Math.min(r, rMax);
            ry = spyAngle * L;
            xs = r * Math.cos(ry);
            ys = r * Math.sin(ry);
            inst.X = card.entity.X + xs;
            inst.Y = card.entity.Y + ys;
            if (r >= rMax && frame % 8 === 0) {
                rotationRad = Math.atan2(ys, xs);
                entities.push(Jade("rice", color, inst.X, inst.Y, Math.sin(rotationRad) * 2,
                    -Math.cos(rotationRad) * 2));
                entities.push(Jade("rice", color, inst.X, inst.Y,
                    Math.sin(rotationRad + 5 * L) * 2, -Math.cos(rotationRad + 5 * L) * 2));
                entities.push(Jade("rice", color, inst.X, inst.Y, Math.sin(rotationRad),
                    -Math.cos(rotationRad)));
                entities.push(Jade("rice", color, inst.X, inst.Y,
                    Math.sin(rotationRad + 5 * L), -Math.cos(rotationRad + 5 * L)));
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            spyAngle += angleAdd
            r += rAdd
            frame++
        }, 10000).edit(function (inst) {
            inst.toEnvoy(card.entity)
        }));
    }

    function butterflyShoot(card, spyAngle, angleAdd, speed) {
        let r = 0, ry, xs, ys, frame = 0
        entities.push(Butterfly('green', card.entity.X, card.entity.Y, 10, (inst) => {
            ry = spyAngle * L;
            xs = r * Math.cos(ry);
            ys = r * Math.sin(ry);
            inst.X = card.entity.X + xs;
            inst.Y = card.entity.Y + ys;
            if (frame % 8 === 0 && !inst.sizeBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.grazeBox)) {
                const speed = transTo(0, 1, (frame * 4 + spyAngle) * L)
                entities.push(Jade("small", 'green', inst.X, inst.Y, 0, 0).edit((inst) => {
                    inst.addComponent("rand", function () {
                        let timeDown = 180
                        this.tick = function (inst) {
                            if (timeDown === 0) {
                                inst.color = 'blue'
                                inst.init()
                                inst.components['movable'].MX = speed[0]
                                inst.components['movable'].MY = speed[1]
                                inst.removeComponent("open")
                                inst.addComponent("out", function () {
                                    let timeDown = 60
                                    const self = this
                                    self.tick = function (inst) {
                                        if (timeDown === 0) {
                                            inst.tags.add(TAGS.death)
                                        }
                                        timeDown--
                                    }

                                })
                                soundOfChangeTrack.currentTime = 0;
                                _ = soundOfChangeTrack.play()
                            }
                            timeDown--
                        }
                    })
                }));
            }
            spyAngle += angleAdd
            r += speed
            frame++
        }, -1).edit(function (inst) {
            inst.toEnvoy(card.entity)
        }));
    }

    const cardData = {
        // 萤符「地上的彗星」 rtl的bug
        name: "「萤符「地上的彗星",
        delay: 30,
        slowFrame: 0,
        startFrame: 60,
        noCardFrame: 1200,
        time: 2100,
        bonus: 10000000,
        noCard: (function () {
            let frame = 0;
            return function (card) {
                if (frame === 0) {
                    spawn1(card, "gold", -20, 45)
                }
                if (frame === 60) {
                    spawn1(card, "aqua", 200, 180 + 45)
                }
                if (frame === 90) {
                    card.entity.maxMovementSpeed = 3;
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH * 3 / 4
                    card.entity.target.Y = GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 3 + 10
                }
                if (frame === 190) {
                    spawn2(card, 'green', 'aqua')
                }
                if (frame === 250) {
                    card.entity.maxMovementSpeed = 3;
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 4
                    card.entity.target.Y = GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 3
                }
                if (frame === 360) {
                    spawn2(card, 'darkblue', 'blue')
                }
                if (frame === 440) {
                    card.entity.maxMovementSpeed = 3;
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2
                    card.entity.target.Y = GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 3
                }
                if (frame === 520) {
                    for (let i = 0; i < 360; i += 90) {
                        spawnButterfly(card, 'blue', i, -2, 1, 50)
                    }
                    soundOfOption.currentTime = 0;
                    _ = soundOfOption.play()
                }
                if (frame === 590) {
                    for (let i = 0; i < 360; i += 90) {
                        spawnButterfly(card, 'red', i, 3, 2, 100)
                    }
                    soundOfOption.currentTime = 0;
                    _ = soundOfOption.play()
                }
                if (frame > 570 && frame % 30 === 0) {
                    for (let i = 0; i < 360; i += 10) {
                        const speed = transTo(0, 2, i * L);
                        entities.push(Jade("ring", 'blue', card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                }
                frame++
            }
        })(),
        card: (function () {
            let frame = 0, c = 0;
            return function (card) {
                if (frame === 0) {
                    if (c === 0) {
                        for (let i = 0; i < 360; i += 36) {
                            butterflyShoot(card, i, 0.2, 2)
                        }
                    } else if (c === 1) {
                        for (let i = 0; i < 360; i += 36) {
                            butterflyShoot(card, i, -0.2, 2)
                        }
                    } else {
                        for (let i = 0; i < 360; i += 36) {
                            butterflyShoot(card, i, 0, 2)
                        }
                        c = 0
                    }
                    soundOfOption.currentTime = 0;
                    _ = soundOfOption.play()
                }
                if (frame === 120) {
                    for (let i = 0; i < 360; i += 10) {
                        for (let k = 0; k < 4; k++) {
                            let speed = 0.4 + 0.8 * Math.pow(1.4, k);
                            speed = transTo(0, speed, (i + k * 5) * L);
                            entities.push(Jade("orb", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                        }
                    }
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
                    for (let i = 0; i < 90; i += 10) {
                        let speed = transTo(0, 1.5, (i - 45) * L + spyRad);
                        entities.push(Jade("orb", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                frame++;
                if (frame > 260) {
                    frame = 0;
                    c++
                }
            }
        })()
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
