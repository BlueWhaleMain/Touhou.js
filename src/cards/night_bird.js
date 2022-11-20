import CardUtil from "../card_util.js";
import {entities, GUI_SCREEN, L, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfBombShoot1 = newAudio(resources.Sounds.bombShoot1);
const r90 = 90 * L;
const r135 = 135 * L;
export default function nightBird(edit) {
    const cardData = {
        // 夜符「夜雀」 rtl的bug
        name: "「夜符「夜雀",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 2400,
        bonus: 500000,
        noCardFrame: 1380,
        noCard: (function () {
            let frame = 0;
            return function (card) {
                if (frame === 0) {
                    card.entity.maxMovementSpeed = 2;
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 3
                }
                if (frame >= 20 && frame % 10 === 0) {
                    let i = frame / 10 - 2
                    if (i < 5) {
                        const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135;
                        for (let j = 0; j <= i; j++) {
                            for (let k = 0; k < 10; k++) {
                                let speed = 0.4 + 2 * Math.pow(1.09, k);
                                speed = transTo(speed, speed, j * 5 * L + spyRad);
                                entities.push(Jade("small", "red", card.entity.X, card.entity.Y, speed[0], speed[1]))
                            }
                        }
                        soundOfBombShoot1.currentTime = 0
                        _ = soundOfBombShoot1.play()
                    }
                }
                if (frame === 180) {
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2
                    card.entity.target.Y = GUI_SCREEN.Y + 100
                }
                if (frame > 200 && frame < 240 && frame % 10 === 0) {
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135;
                    for (let i = 0; i < 360; i += 10) {
                        for (let k = 0; k < 2; k++) {
                            let speed = 0.8 + 2 * Math.pow(1.09, k * 4);
                            speed = transTo(0, speed, (i + k * 5) * L);
                            entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1]))
                        }
                        const speed = transTo(0, 2, i * L + spyRad);
                        entities.push(Jade("point", "blue", card.entity.X, card.entity.Y, speed[0], speed[1]))
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 280) {
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2
                    card.entity.target.Y = GUI_SCREEN.Y + 200
                }
                if (frame > 300 && frame < 320) {
                    let j = frame;
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r90;
                    for (let k = 0; k < 3; k++) {
                        let speed = 0.8 + Math.pow(1.09, (15 - j) / 16 + k * 4);
                        speed = transTo(speed, speed, (110 - 135 / 16 * j - 3) * L + spyRad);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "green", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame > 400) {
                    frame = 0
                } else {
                    frame++
                }
            }
        })(),
        card: (function () {
            let frame = 0;
            let c = 0;
            return function (card) {
                const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135;
                if (0 < frame && frame < 17) {
                    let j = frame;
                    for (let k = 0; k < 3; k++) {
                        let speed = 0.4 + 0.4 * Math.pow(1.09, (15 - j) / 16 + k * 4);
                        speed = transTo(speed, speed, (110 - 135 / 16 * j - 3) * L + spyRad);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "aqua", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                }
                if (17 < frame && frame < 33) {
                    let j = frame - 16;
                    for (let k = 0; k < 3; k++) {
                        let speed = 0.4 + 0.4 * Math.pow(1.09, (15 - j) / 16 + k * 4);
                        speed = transTo(speed, speed, (-100 + 135 / 16 * j) * L + spyRad);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "blue", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                }
                frame++;
                if (frame > 48 || card.getTime() < 1200 && frame > 33) {
                    frame = 0;
                    c++
                }
                if (c === 4) {
                    c = 0;
                    frame = -180 * card.getTime() / 3000;
                    if (Math.nextSeed() > 0.5) {
                        if (card.entity.X < 300) {
                            card.entity.target.X += 40
                        }
                    } else {
                        if (card.entity.X > 200) {
                            card.entity.target.X -= 40
                        }
                    }
                    if (Math.nextSeed() > 0.5) {
                        if (card.entity.Y < 120) {
                            card.entity.target.Y += 40
                        }
                    } else {
                        if (card.entity.Y > 100) {
                            card.entity.target.Y -= 40
                        }
                    }
                    if (card.entity.X > 200) {
                        card.entity.target.X -= 0.2
                    }
                    if (card.entity.X < 300) {
                        card.entity.target.X += 0.2
                    }
                    if (card.entity.Y > 100) {
                        card.entity.target.Y -= 0.2
                    }
                    if (card.entity.Y < 120) {
                        card.entity.target.Y += 0.2
                    }
                }
            }
        })()
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
