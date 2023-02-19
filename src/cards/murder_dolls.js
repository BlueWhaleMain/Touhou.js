import {entities, L, modifyEntity, session, TAGS, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfPower0 = newAudio(resources.Sounds.power0);
export default function murderDolls(edit) {
    const meta = Math.random();

    function spread(color) {
        modifyEntity((entity) => {
            if (entity.tags.has(TAGS.hostile)) {
                if (entity.tags.has(meta)) {
                    return
                }
                if (entity.type === 'knife' && entity.color === color && Math.nextSeed() > 0.5) {
                    entity.color = 'green'
                    const rotationRad = Math.nextSeed() * 360 * L
                    const speed = transTo(entity.components["movable"].MX, entity.components["movable"].MY, rotationRad)
                    entity.components["movable"].MX = speed[0];
                    entity.components["movable"].MY = speed[1];
                    entity.rotation = rotationRad
                    entity.tags.add(meta)
                    return true
                }
            }
        }, 60)
    }

    const cardData = {
        // 女仆秘技「杀人玩偶」 rtl的bug
        name: "「女仆秘技「杀人玩偶",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 30 * 60,
        bonus: 4000000,
        noCardFrame: 44 * 60,
        noCard: function () {
            let frame = 0
            return function (card) {
                if (frame > 60 && frame < 100 && frame % 4 === 0) {
                    for (let a = frame; a < 360 + frame; a += 72) {
                        let xs, ys
                        xs = Math.sin(a * L)
                        ys = Math.cos(a * L)
                        entities.push(Jade('knife', 'blue', card.entity.X, card.entity.Y, xs, ys,
                            undefined, true, 1))
                        xs = Math.sin(a * L) * 1.2
                        ys = Math.cos(a * L) * 1.2
                        entities.push(Jade('knife', 'blue', card.entity.X, card.entity.Y, xs, ys,
                            undefined, true, 1))
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 180) {
                    if (Math.nextSeed() > 0.5) {
                        if (card.entity.X < 316) {
                            card.entity.target.X += 25
                        }
                    } else {
                        if (card.entity.X > 150) {
                            card.entity.target.X -= 25
                        }
                    }
                    if (Math.nextSeed() > 0.5) {
                        if (card.entity.Y < 90) {
                            card.entity.target.Y += 15
                        }
                    } else {
                        if (card.entity.Y > 100) {
                            card.entity.target.Y -= 15
                        }
                    }
                    if (card.entity.X > 316) {
                        card.entity.target.X -= 0.2
                    }
                    if (card.entity.X < 150) {
                        card.entity.target.X += 0.2
                    }
                    if (card.entity.Y > 90) {
                        card.entity.target.Y -= 0.2
                    }
                    if (card.entity.Y < 100) {
                        card.entity.target.Y += 0.2
                    }
                }
                if (frame > 200 && frame < 240 && frame % 4 === 0) {
                    for (let a = -frame; a < 360 - frame; a += 72) {
                        let xs, ys
                        xs = Math.sin(a * L)
                        ys = Math.cos(a * L)
                        entities.push(Jade('knife', 'red', card.entity.X, card.entity.Y, xs, ys,
                            undefined, true, 1))
                        xs = Math.sin(a * L) * 1.2
                        ys = Math.cos(a * L) * 1.2
                        entities.push(Jade('knife', 'red', card.entity.X, card.entity.Y, xs, ys,
                            undefined, true, 1))
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                frame++
                if (frame === 600) {
                    frame = 0
                }
            }
        }(),
        card: function () {
            let frame = 0
            return function (card) {
                if (frame === 0) {
                    soundOfPower0.currentTime = 0;
                    _ = soundOfPower0.play();
                }
                if (frame > 0 && frame < 60 && frame % 4 === 0) {
                    for (let a = frame; a < 360 + frame; a += 24) {
                        let xs, ys
                        xs = Math.sin(a * L)
                        ys = Math.cos(a * L)
                        entities.push(Jade('knife', 'blue', card.entity.X, card.entity.Y, xs, ys,
                            undefined, false))
                        xs = Math.sin(a * L) * 1.2
                        ys = Math.cos(a * L) * 1.2
                        entities.push(Jade('knife', 'blue', card.entity.X, card.entity.Y, xs, ys,
                            undefined, false))
                        xs = Math.sin(a * L) * 1.5
                        ys = Math.cos(a * L) * 1.5
                        entities.push(Jade('knife', 'blue', card.entity.X, card.entity.Y, xs, ys,
                            undefined, false))
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame > 60 && frame < 140 && frame % 10 === 0) {
                    for (let a = frame / 10 * 45; a < 15 + frame / 10 * 45; a += 1) {
                        let xs, ys
                        xs = Math.sin(a * L)
                        ys = Math.cos(a * L)
                        entities.push(Jade('knife', 'red', card.entity.X, card.entity.Y, xs, ys,
                            undefined, false))
                        xs = Math.sin(a * L) * 1.2
                        ys = Math.cos(a * L) * 1.2
                        entities.push(Jade('knife', 'red', card.entity.X, card.entity.Y, xs, ys,
                            undefined, false))
                        xs = Math.sin(a * L) * 1.5
                        ys = Math.cos(a * L) * 1.5
                        entities.push(Jade('knife', 'red', card.entity.X, card.entity.Y, xs, ys,
                            undefined, false))
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 150) {
                    session.stopTheWorld = true
                    card.entity.tags.add(TAGS.theWorld);
                    if (Math.nextSeed() > 0.5) {
                        if (card.entity.X < 316) {
                            card.entity.target.X += 15
                        }
                    } else {
                        if (card.entity.X > 150) {
                            card.entity.target.X -= 15
                        }
                    }
                    if (Math.nextSeed() > 0.5) {
                        if (card.entity.Y < 90) {
                            card.entity.target.Y += 25
                        }
                    } else {
                        if (card.entity.Y > 100) {
                            card.entity.target.Y -= 25
                        }
                    }
                    if (card.entity.X > 316) {
                        card.entity.target.X -= 0.2
                    }
                    if (card.entity.X < 150) {
                        card.entity.target.X += 0.2
                    }
                    if (card.entity.Y > 90) {
                        card.entity.target.Y -= 0.2
                    }
                    if (card.entity.Y < 100) {
                        card.entity.target.Y += 0.2
                    }
                    spread('blue')
                    spread('blue')
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 155) {
                    spread('blue')
                    spread('blue')
                }
                if (frame === 160) {
                    spread('blue')
                    spread('blue')
                }
                if (frame === 175) {
                    spread('red')
                }
                if (frame === 180) {
                    spread('red')
                    soundOfPower0.currentTime = 0;
                    _ = soundOfPower0.play();
                }
                if (frame === 270) {
                    session.stopTheWorld = false
                    card.entity.tags.delete(TAGS.theWorld);
                }
                frame++;
                if (frame > 600) {
                    frame = 0;
                }
            }
        }(),
        end: function (card) {
            session.stopTheWorld = false
            if (card.entity.tags.has(TAGS.theWorld)) {
                card.entity.tags.delete(TAGS.theWorld);
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
