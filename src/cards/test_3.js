import CardUtil from "../card_util.js";
import {entities, L, session, arrowTo, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";

let _;
const soundOfChangeTrack = newAudio(resources.Sounds["changeTrack"]);
const soundOfBombShoot = newAudio(resources.Sounds["bombShoot"]);
const COLOR_MAPPING = {
    0: "red",
    1: "crimson",
    2: "orangered",
    3: "gold",
    4: "khaki",
    5: "green",
    6: "aqua",
    7: "water",
    8: "blue",
    9: "purple",
    10: "hotpink"
};
export default function test3(edit) {
    let frame = 0;
    const cardData = {
        // 测试「Test 3」 rtl的bug
        name: "「测试「Test 3",
        delay: 60,
        slowFrame: 0,
        startFrame: 100,
        time: 3000,
        bonus: 500000,
        noCardFrame: 3600,
        noCard: function (card) {
            if (frame % 18 === 0) {
                for (let i = 0; i <= 360; i += 24) {
                    let speed = transTo(2, 2, (i + frame / 10) * L);
                    entities.push(Jade("bill", "purple", card.entity.X, card.entity.Y, speed[0], speed[1]));
                    speed = transTo(2, 2, -(i + frame / 10) * L);
                    entities.push(Jade("bill", "purple", card.entity.X, card.entity.Y, speed[0], speed[1]));
                    speed = arrowTo(card.entity.X, card.entity.Y, session.player.X, session.player.Y, 2);
                    let speed1 = transTo(speed[0], speed[1], (i + frame / 10) * L);
                    entities.push(Jade("bill", "hotpink", card.entity.X, card.entity.Y, speed1[0], speed1[1]));
                    speed = transTo(speed[0], speed[1], -(i + frame / 10) * L);
                    entities.push(Jade("bill", "hotpink", card.entity.X, card.entity.Y, speed[0], speed[1]));
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame % 360 === 0) {
                if (Math.random() > 0.5) {
                    if (card.entity.X < 416) {
                        card.entity.target.X += 20
                    }
                } else {
                    if (card.entity.X > 100) {
                        card.entity.target.X -= 20
                    }
                }
                if (Math.random() > 0.5) {
                    if (card.entity.Y < 140) {
                        card.entity.target.Y += 20
                    }
                } else {
                    if (card.entity.Y > 100) {
                        card.entity.target.Y -= 20
                    }
                }
                if (card.entity.X > 416) {
                    card.entity.target.X -= 0.1
                }
                if (card.entity.X < 100) {
                    card.entity.target.X += 0.1
                }
                if (card.entity.Y > 140) {
                    card.entity.target.Y -= 0.1
                }
                if (card.entity.Y < 100) {
                    card.entity.target.Y += 0.1
                }
            }
            frame++;
        },
        card: function (card) {
            if (frame % 20 === 0) {
                const color = COLOR_MAPPING[Math.floor(Math.random() * 10)];
                for (let i = 0; i <= 360; i += 13) {
                    let speed = transTo(2, 2, (i + frame / 30) * L);
                    entities.push(Jade("small", color, 220, 125, speed[0], speed[1], undefined, false));
                    speed = arrowTo(card.entity.X, card.entity.Y, session.player.X, session.player.Y, 2);
                    speed = transTo(speed[0], speed[1], i * L);
                    entities.push(Jade("small", color, 220, 125, speed[0], speed[1], undefined, false))
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play();
                soundOfChangeTrack.currentTime = 0;
                _ = soundOfChangeTrack.play()
            }
            frame++
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
