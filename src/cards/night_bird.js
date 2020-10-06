import CardUtil from "../card_util.js";
import {entities, L, session, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const r135 = 135 * L;
export default function nightBird(edit) {
    let frame = 0;
    let c = 0;
    const cardData = {
        // 夜符「夜雀」 rtl的bug
        name: "「夜符「夜雀",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 2400,
        bonus: 500000,
        card: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135;
            if (0 < frame && frame < 17) {
                let j = frame;
                for (let k = 0; k < 3; k++) {
                    let speed = 0.4 + 0.4 * Math.pow(1.09, (15 - j) / 16 + k * 4);
                    speed = transTo(speed, speed, (110 - 135 / 16 * j - 3) * L + spyAngle);
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
                    speed = transTo(speed, speed, (-100 + 135 / 16 * j) * L + spyAngle);
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
                frame = -180 * card.getTime() / 4000;
                if (Math.random() > 0.5) {
                    if (card.entity.X < 300) {
                        card.entity.target.X += 40
                    }
                } else {
                    if (card.entity.X > 200) {
                        card.entity.target.X -= 40
                    }
                }
                if (Math.random() > 0.5) {
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
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
