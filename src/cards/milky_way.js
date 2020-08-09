import {entities, L, session, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";

let _;
const soundOfChangeTrack = newAudio(resources.Sounds["changeTrack"]);
const soundOfBombShoot = newAudio(resources.Sounds["bombShoot"]);
export default function milkyWay(edit) {
    let frame = 0;
    let c = 0;
    const cardData = {
        // 魔符「小行星带」 rtl的bug
        name: "「魔符「小行星带",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 6000,
        bonus: 1000000,
        card: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            for (let i = 0; i < 50; i++) {
                if (frame === 15 * i) {
                    for (let j = 0; j < 9; j++) {
                        const speed = transTo(0, 2, spyAngle - (5 * frame + 40 * j) * L);
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
            for (let i = 0; i < 10; i++) {
                if (frame === 20 * i + 50) {
                    for (let j = 0; j < 5; j++) {
                        const speed = transTo(0, 0.5, spyAngle - 90 * L);
                        const spawnPoint = [20 - card.entity.X, (Math.random() * 450)];
                        entities.push(Jade("star", "gold", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false).rotate(0.1))
                    }
                    soundOfChangeTrack.currentTime = 0;
                    _ = soundOfChangeTrack.play()
                }
                if (frame === 20 * i + 50) {
                    for (let j = 0; j < 5; j++) {
                        const speed = transTo(0, 0.5, spyAngle + 90 * L);
                        const spawnPoint = [410 - card.entity.X, (Math.random() * 450)];
                        entities.push(Jade("star", "green", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false).rotate(0.1))
                    }
                    soundOfChangeTrack.currentTime = 0;
                    _ = soundOfChangeTrack.play()
                }
            }
            frame++;
            if (frame > 755) {
                frame = 0;
                c++
            }
            if (c === 4) {
                c = 0;
                frame = -120 * card.getTime() / 6000;
                if (Math.random() > 0.5) {
                    if (card.entity.X < 316) {
                        card.entity.target.X += 15
                    }
                } else {
                    if (card.entity.X > 150) {
                        card.entity.target.X -= 15
                    }
                }
                if (Math.random() > 0.5) {
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
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
