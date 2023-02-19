import {arrowTo, batchExecute, entities, L, modifyEntity, session, TAGS, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import MagicRing from "../prefabs/enemy/magic_ring";
import moveLine from "../ai/move_line";
import shootCircle from "../ai/shoot_circle";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfPower0 = newAudio(resources.Sounds.power0);
export default function theWorld(edit) {
    const meta = Math.random();
    function clockHands(card, a) {
        // 0 度 6 点
        // 90 度 3 点
        // 180 度 0 点
        // 270 度 9 点
        for (let c = 2; c < 6; c++) {
            let xs, ys
            xs = Math.sin(a * L) * c * 0.8
            ys = Math.cos(a * L) * c * 0.8
            entities.push(Jade('oval', 'crimson', card.entity.X, card.entity.Y, xs, ys, undefined, false))
        }
    }

    function spread(tp) {
        modifyEntity((entity) => {
            if (entity.tags.has(TAGS.hostile)) {
                if (entity.type === tp && Math.nextSeed() > 0.5) {
                    if (entity.tags.has(meta)) {
                        return
                    }
                    const rotationRad = Math.nextSeed()
                    const speed = transTo(entity.components["movable"].MX, entity.components["movable"].MY, rotationRad)
                    entity.components["movable"].MX = speed[0];
                    entity.components["movable"].MY = speed[1];
                    entity.rotation = rotationRad
                    entity.tags.add(meta)
                    if (entity.type === 'knife') {
                        entity.color = 'green'
                    }
                    return true
                }
            }
        }, 30)
    }

    const cardData = {
        // 幻世「The World」 rtl的bug
        name: "「幻世「The World",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 30 * 60,
        bonus: 3000000,
        noCardFrame: 44 * 60,
        noCard: function () {
            let frame = 0
            return function (card) {
                if (frame === 60) {
                    // 0 度 6 点
                    // 90 度 3 点
                    // 180 度 0 点
                    // 270 度 9 点
                    let xs, ys
                    xs = Math.sin((270 + 9) * L)
                    ys = Math.cos((270 + 9) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 12, 300, 5 - 1, 1, 0, 3,
                            -10, 30, false, 'suffering', 'blue', 0, 0, 1.5, 1.5, undefined,
                            true, 1)]), 300))
                    xs = Math.sin((270 + 9 * 7) * L)
                    ys = Math.cos((270 + 9 * 7) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 12, 300, 5 - 1, 1, 0, 3,
                            10, 30, false, 'suffering', 'red', 0, 0, 1.5, 1.5, undefined,
                            true, 1)]), 300))
                    xs = Math.sin((90 - 9) * L)
                    ys = Math.cos((90 - 9) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 12, 300, 5 - 1, 1, 0, 3,
                            10, 30, false, 'suffering', 'red', 0, 0, 1.5, 1.5, undefined,
                            true, 1)]), 300))
                    xs = Math.sin((90 - 9 * 7) * L)
                    ys = Math.cos((90 - 9 * 7) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 12, 300, 5 - 1, 1, 0, 3,
                            -10, 30, false, 'suffering', 'blue', 0, 0, 1.5, 1.5, undefined,
                            true, 1)]), 300))
                }
                if (frame > 180 && frame < 360 && frame % 15 === 0) {
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
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
                    for (let i = 0; i < 50; i++) {
                        if (frame === 15 * i) {
                            for (let j = 0; j < 9; j++) {
                                const speed = transTo(0, 2, spyRad - (5 * frame + 40 * j) * L);
                                if (frame % 2 === 1) {
                                    entities.push(Jade("knife", "blue", card.entity.X, card.entity.Y, speed[0],
                                        speed[1], undefined, false))
                                } else {
                                    entities.push(Jade("knife", "blue", card.entity.X, card.entity.Y, speed[0],
                                        speed[1], undefined, false))
                                }
                            }
                        }
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
            let frame = 0, stopKnifePoss = []
            return function (card) {
                if (frame === 0) {
                    soundOfPower0.currentTime = 0;
                    _ = soundOfPower0.play();
                }
                if (frame === 90) {
                    for (let a = 0; a < 360; a += 45) {
                        clockHands(card, a)
                    }
                    for (let a = 15; a < 360 + 15; a += 45) {
                        clockHands(card, a)
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 130) {
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
                    stopKnifePoss.length = 0
                    for (let i = 280; i < 110 + 320; i += 14) {
                        const pos = [session.player.X + Math.sin(i * L) * 150, session.player.Y - Math.cos(i * L) * 150]
                        stopKnifePoss.push(pos)
                        const speed0 = arrowTo(pos[0], pos[1], session.player.X - 100, session.player.Y, 2)
                        const speed1 = arrowTo(pos[0], pos[1], session.player.X, session.player.Y, 2)
                        const speed2 = arrowTo(pos[0], pos[1], session.player.X + 100, session.player.Y, 2)
                        entities.push(Jade('knife', 'blue', pos[0], pos[1], speed0[0], speed0[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos[0], pos[1], speed1[0], speed1[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos[0], pos[1], speed2[0], speed2[1], undefined, false))
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 135) {
                    let newPoss = []
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
                    for (let pos of stopKnifePoss) {
                        const pos1 = [pos[0] - Math.sin(spyRad) * 20, pos[1] + Math.cos(spyRad) * 20]
                        newPoss.push(pos1)
                        const speed0 = arrowTo(pos1[0], pos1[1], session.player.X - 100, session.player.Y, 2)
                        const speed1 = arrowTo(pos1[0], pos1[1], session.player.X, session.player.Y, 2)
                        const speed2 = arrowTo(pos1[0], pos1[1], session.player.X + 100, session.player.Y, 2)
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed0[0], speed0[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed1[0], speed1[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed2[0], speed2[1], undefined, false))
                    }
                    stopKnifePoss = newPoss
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 140) {
                    let newPoss = []
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
                    for (let pos of stopKnifePoss) {
                        const pos1 = [pos[0] - Math.sin(spyRad) * 20, pos[1] + Math.cos(spyRad) * 20]
                        newPoss.push(pos1)
                        const speed0 = arrowTo(pos1[0], pos1[1], session.player.X - 100, session.player.Y, 2)
                        const speed1 = arrowTo(pos1[0], pos1[1], session.player.X, session.player.Y, 2)
                        const speed2 = arrowTo(pos1[0], pos1[1], session.player.X + 100, session.player.Y, 2)
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed0[0], speed0[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed1[0], speed1[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed2[0], speed2[1], undefined, false))
                    }
                    stopKnifePoss = newPoss
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 145) {
                    let newPoss = []
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
                    for (let pos of stopKnifePoss) {
                        const pos1 = [pos[0] - Math.sin(spyRad) * 20, pos[1] + Math.cos(spyRad) * 20]
                        newPoss.push(pos1)
                        const speed0 = arrowTo(pos1[0], pos1[1], session.player.X - 100, session.player.Y, 2)
                        const speed1 = arrowTo(pos1[0], pos1[1], session.player.X, session.player.Y, 2)
                        const speed2 = arrowTo(pos1[0], pos1[1], session.player.X + 100, session.player.Y, 2)
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed0[0], speed0[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed1[0], speed1[1], undefined, false))
                        entities.push(Jade('knife', 'blue', pos1[0], pos1[1], speed2[0], speed2[1], undefined, false))
                    }
                    stopKnifePoss = newPoss
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 150) {
                    spread('oval')
                    spread('knife')
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 155) {
                    spread('oval')
                    spread('knife')
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 160) {
                    spread('oval')
                    spread('knife')
                    soundOfPower0.currentTime = 0;
                    _ = soundOfPower0.play();
                }
                if (frame === 250) {
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
