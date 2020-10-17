import CardUtil from "../card_util.js";
import {entities, L, transTo, session, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";
import {makeMovableRotate} from "../components/movable.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export default function mercuryPoison(edit) {
    let frame = 0;
    let c = 0;
    const cardData = {
        // 金&水符「水银之毒」 rtl的bug
        name: "「金&水符「水银之毒",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 3800,
        bonus: 1000000,
        card: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + (frame / 20) * L;
            for (let k = 0; k < 5; k++) {
                if (frame === 20 * k) {
                    for (let j = 0; j < 29; j++) {
                        let speed = transTo(0, 0.5, spyAngle + 12.4 * j * L);
                        let spawnPoint = [speed[0] * 20, speed[1] * 20];
                        entities.push(makeMovableRotate(Jade("small", "gold", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false), 0.05));
                        speed = transTo(0, 0.7, spyAngle + (12.4 * j + 6.2) * L);
                        spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(makeMovableRotate(Jade("small", "gold", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false), 0.05))
                    }
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                }
                if (frame === 20 * k + 2) {
                    for (let j = 0; j < 29; j++) {
                        let speed = transTo(0, 0.5, spyAngle + 12.4 * j * L);
                        let spawnPoint = [speed[0] * 20, speed[1] * 20];
                        entities.push(makeMovableRotate(Jade("small", "aqua", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false), 0.05, -45, -1));
                        speed = transTo(0, 0.7, spyAngle + (12.4 * j + 6.2) * L);
                        spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(makeMovableRotate(Jade("small", "aqua", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false), 0.05, -45, -1));
                    }
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                }
            }
            // for (let k = 0; k < 5; k++) {
            //     if (frame === 20 * k) {
            //         for (let j = 0; j < 29; j++) {
            //             let speed = transTo(2, 0, spyAngle + 12.4 * j * L);
            //             let spawnPoint = [speed[0] * 20, speed[1] * 20];
            //             entities.push(makeMovableArc(Jade("small", "gold", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1]), 0.1, 0, 1, -0.01));
            //             speed = transTo(2.01, 0, spyAngle + (12.4 * j + 6.2) * L);
            //             spawnPoint = [speed[0] * 10, speed[1] * 10];
            //             entities.push(makeMovableArc(Jade("small", "gold", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1]), 0.1, 0, 1, -0.01))
            //         }
            //         soundOfBombShoot.currentTime = 0;
            //         _ = soundOfBombShoot.play()
            //     }
            //     if (frame === 20 * k + 2) {
            //         for (let j = 0; j < 29; j++) {
            //             let speed = transTo(2.01, 0, spyAngle + 12.4 * j * L);
            //             let spawnPoint = [speed[0] * 20, speed[1] * 20];
            //             entities.push(makeMovableArc(Jade("small", "aqua", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1]), 0.1, 180, 1, -0.01));
            //             speed = transTo(2, 0, spyAngle + (12.4 * j + 6.2) * L);
            //             spawnPoint = [speed[0] * 10, speed[1] * 10];
            //             entities.push(makeMovableArc(Jade("small", "aqua", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1]), 0.1, 180, 1, -0.01));
            //         }
            //         soundOfBombShoot.currentTime = 0;
            //         _ = soundOfBombShoot.play()
            //     }
            // }
            frame++;
            if (frame > 106) {
                frame = 0;
                c++
            }
            if (c === 4) {
                c = 0;
                frame = -180 * card.getTime() / 6000;
                if (Math.nextSeed() > 0.5) {
                    if (card.entity.X < 316) {
                        card.entity.target.X += 20
                    }
                } else {
                    if (card.entity.X > 150) {
                        card.entity.target.X -= 20
                    }
                }
                if (Math.nextSeed() > 0.5) {
                    if (card.entity.Y < 90) {
                        card.entity.target.Y += 20
                    }
                } else {
                    if (card.entity.Y > 100) {
                        card.entity.target.Y -= 20
                    }
                }
                if (card.entity.X > 316) {
                    card.entity.target.X -= 0.1
                }
                if (card.entity.X < 150) {
                    card.entity.target.X += 0.1
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
