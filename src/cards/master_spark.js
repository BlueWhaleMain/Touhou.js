import {entities, L, session, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import Laser from "../prefabs/laser.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfPower0 = newAudio(resources.Sounds.power0);
export default function masterSpark(edit) {
    let frame = 0;
    let bombed = false;
    const cardData = {
        // 恋符「极限火花」 rtl的bug
        name: "「恋符「极限火花",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 4500,
        bonus: 1000000,
        card: function (card) {
            if (frame % 480 === 0) {
                if (Math.random() > 0.5) {
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
            if (bombed && (frame % 60 === 0 || (frame - 1) % 60 === 0)) {
                for (let j = 0; j < 10; j++) {
                    const speed = transTo(0, 2, spyAngle - (frame % 3 + 36) * j * L);
                    if (frame % 2 === 1) {
                        entities.push(Jade("bigStar", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false).rotate(0.02))
                    } else {
                        entities.push(Jade("bigStar", "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false).rotate(-0.02))
                    }
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (card.entity.X !== card.entity.target.X || card.entity.Y !== card.entity.target.Y) {
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
