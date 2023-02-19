import {arrowTo, batchExecute, entities, L, session, TAGS, transTo} from "../util.js";
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
export default function jackTheLudoBile(edit) {
    function knifeWing(card, a) {
        // 0 度 6 点
        // 90 度 3 点
        // 180 度 0 点
        // 270 度 9 点
        for (let c = 2; c < 10; c++) {
            let xs, ys
            xs = Math.sin(a * 4 * L) * c * 0.5
            ys = Math.cos(a * 4 * L) * c * 0.5
            entities.push(Jade("knife", "purple", card.entity.X, card.entity.Y, xs,
                ys, undefined, false))
            xs = Math.sin(-a * 4 * L) * c * 0.5
            ys = Math.cos(-a * 4 * L) * c * 0.5
            entities.push(Jade("knife", "purple", card.entity.X, card.entity.Y, xs,
                ys, undefined, false))
        }
    }

    const cardData = {
        // 幻幽「迷幻的杰克」 rtl的bug
        name: "「幻幽「迷幻的杰克",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 30 * 60,
        bonus: 2000000,
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
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            -10, 30, false, 'rice', 'blue', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((270 + 9 * 3) * L)
                    ys = Math.cos((270 + 9 * 3) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            -10, 30, false, 'rice', 'blue', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((270 + 9 * 5) * L)
                    ys = Math.cos((270 + 9 * 5) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            10, 30, false, 'rice', 'green', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((270 + 9 * 7) * L)
                    ys = Math.cos((270 + 9 * 7) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            10, 30, false, 'rice', 'green', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((90 - 9) * L)
                    ys = Math.cos((90 - 9) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            10, 30, false, 'rice', 'green', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((90 - 9 * 3) * L)
                    ys = Math.cos((90 - 9 * 3) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            10, 30, false, 'rice', 'green', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((90 - 9 * 5) * L)
                    ys = Math.cos((90 - 9 * 5) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            -10, 30, false, 'rice', 'blue', 0, 0, 1.5, 1.5)]), 300))
                    xs = Math.sin((90 - 9 * 7) * L)
                    ys = Math.cos((90 - 9 * 7) * L)
                    entities.push(MagicRing(card.entity.X + xs, card.entity.Y + ys, batchExecute([
                        moveLine(xs / 2, ys / 2),
                        shootCircle(60, 6, 300, 5 - 1, 1, 0, 3,
                            -10, 30, false, 'rice', 'blue', 0, 0, 1.5, 1.5)]), 300))
                }
                if (frame > 180 && frame < 360 && frame % 20 === 0) {
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
                    for (let i = 0; i < 30; i++) {
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
                }
                if (frame === 360) {
                    // 0 度 6 点
                    // 90 度 3 点
                    // 180 度 0 点
                    // 270 度 9 点
                    for (let a = 0; a < 4; a++) {
                        for (let c = 2; c < 10; c++) {
                            let xs, ys
                            xs = Math.sin((a - 2) * 4 * L) * c * 0.5
                            ys = Math.cos((a - 2) * 4 * L) * c * 0.5
                            entities.push(Jade("knife", "purple", card.entity.X, card.entity.Y, xs,
                                ys, undefined, false))
                        }
                    }
                    knifeWing(card, 10)
                    knifeWing(card, 15)
                    knifeWing(card, 20)
                    knifeWing(card, 25)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 365) {
                    knifeWing(card, 4)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 370) {
                    knifeWing(card, 7)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 375) {
                    knifeWing(card, 10)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 380) {
                    knifeWing(card, 13)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 385) {
                    knifeWing(card, 16)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 390) {
                    knifeWing(card, 19)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 395) {
                    knifeWing(card, 21)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 400) {
                    knifeWing(card, 24)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 405) {
                    knifeWing(card, 27)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 410) {
                    knifeWing(card, 30)
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 415) {
                    knifeWing(card, 20)
                    knifeWing(card, 10)
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
                    for (let i = 0; i < 32; i++) {
                        const speed = [(Math.max(Math.nextSeed(), 0.2) - 0.5) * 10, Math.max(Math.nextSeed(), 0.3) * 5]
                        entities.push(Jade('big', 'red', card.entity.X + speed[0],
                            card.entity.Y + speed[1], speed[0], speed[1], 0, false))
                        soundOfBombShoot.currentTime = 0
                        _ = soundOfBombShoot.play()
                    }
                }
                if (frame === 130) {
                    session.stopTheWorld = true
                    card.entity.tags.add(TAGS.theWorld);
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
                if (frame === 155) {
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
                if (frame === 160) {
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
                if (frame === 165) {
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
                if (frame === 170) {
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
                if (frame === 175) {
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
                if (frame === 180) {
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
