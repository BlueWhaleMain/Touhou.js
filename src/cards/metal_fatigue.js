import CardUtil from "../card_util.js";
import {entities, L, session, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds["bombShoot"]);

function signalOrb(card, spyAngle) {
    for (let j = 0; j < 8; j++) {
        const speed = transTo(0, 3, spyAngle + 45 * j * L);
        entities.push(Jade("orb", "gold", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
    }
    soundOfBombShoot.currentTime = 0;
    _ = soundOfBombShoot.play()
}

function sliceOrb(card, spyAngle) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const speed = transTo(0, 3, spyAngle + 45 * j * L);
            const spawnPoint = transTo(100, 0, 45 * i * L);
            entities.push(Jade("orb", "gold", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
        }
    }
    soundOfBombShoot.currentTime = 0;
    _ = soundOfBombShoot.play()
}

export default function metalFatigue(edit) {
    let frame = 0;
    let c = 0;
    const cardData = {
        // 金符「金属疲劳」 rtl的bug
        name: "「金符「金属疲劳",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 6000,
        bonus: 1000000,
        card: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            // 第一波角度和后面不一致
            if (frame === 0) {
                signalOrb(card, spyAngle)
            }
            if (frame === 30) {
                sliceOrb(card, spyAngle)
            }
            let staticAngle = 0;
            if (frame === 31) {
                staticAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
            }
            // 后面来上 5 波即可，此时角度是固定的
            for (let k = 0; k < 5; k++) {
                if (frame === 20 * (k + 1)) {
                    signalOrb(card, staticAngle)
                }
                if (frame === 30 + 20 * (k + 1)) {
                    sliceOrb(card, staticAngle)
                }
            }
            frame++;
            if (frame > 132) {
                frame = 0;
                c++
            }
            if (c === 4) {
                c = 0;
                frame = -180 * card.getTime() / 6000;
                if (Math.random() > 0.5) {
                    if (card.entity.X < 316) {
                        card.entity.target.X += 10
                    }
                } else {
                    if (card.entity.X > 150) {
                        card.entity.target.X -= 10
                    }
                }
                if (Math.random() > 0.5) {
                    if (card.entity.Y < 90) {
                        card.entity.target.Y += 10
                    }
                } else {
                    if (card.entity.Y > 100) {
                        card.entity.target.Y -= 10
                    }
                }
                if (card.entity.X > 316) {
                    card.entity.target.X -= 0.2
                }
                if (card.entity.X < 150) {
                    card.entity.target.X += 0.2
                }
                if (card.entity.Y > 90) {
                    card.entity.target.Y -= 0.1
                }
                if (card.entity.Y < 100) {
                    card.entity.target.Y += 0.1
                }
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
