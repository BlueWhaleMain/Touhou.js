import {entities, L, session, transTo, newAudio, resources, GUI_SCREEN} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import {generateRandomSpeed} from "../components/movable.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfOption = newAudio(resources.Sounds.option);
export default function dreamSealSilence(edit) {
    let frame = 0;
    let rand = 0;
    const cardData = {
        // 散灵「梦想封印　寂」 rtl的bug
        name: "「散灵「梦想封印　寂",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 4200,
        bonus: 1000000,
        noCardFrame: 4400,
        noCard: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            if (frame === 0) {
                for (let j = 0; j < 40; j++) {
                    for (let k = 0; k < 4; k++) {
                        let speed = (0.8 + 0.8 * Math.pow(1.09, k * 4));
                        speed = transTo(speed, speed, j * 9 * L + spyAngle);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("bill", "darkgray", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                        speed = 0.4 + 0.05 * k;
                        speed = transTo(speed, speed, j * 9 * L + spyAngle + k * 4 * L);
                        entities.push(Jade("bill", "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
                    }
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play();
                rand = Math.random();
                frame++
            }
            if (20 < frame && frame < 120) {
                if (frame % 2 === 0) {
                    for (let i = 0; i < 4; i++) {
                        let speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                        let spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "red", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                    }
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play();
                }
                if (frame % 20 === 0) {
                    if (rand > 0.5) {
                        card.entity.target.X += 40
                    } else {
                        card.entity.target.X -= 40
                    }
                    if (card.entity.X > GUI_SCREEN.WIDTH + GUI_SCREEN.X) {
                        card.entity.X = GUI_SCREEN.X;
                        card.entity.target.X = GUI_SCREEN.X + 40
                    }
                    if (card.entity.X < GUI_SCREEN.X) {
                        card.entity.X = GUI_SCREEN.WIDTH + GUI_SCREEN.X;
                        card.entity.target.X = GUI_SCREEN.WIDTH + GUI_SCREEN.X - 40
                    }
                    soundOfOption.currentTime = 0;
                    _ = soundOfOption.play()
                }
            }
            frame++;
            if (card.entity.X !== card.entity.target.X || card.entity.Y !== card.entity.target.Y) {
                return
            }
            if (frame > 160) {
                frame = 0
            }
        },
        card: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            if (frame === 0) {
                for (let j = 0; j < 36; j++) {
                    for (let k = 0; k < 4; k++) {
                        let speed = (0.8 + 0.8 * Math.pow(1.09, k * 4));
                        speed = transTo(speed, speed, j * 10 * L + spyAngle);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("bill", "darkgray", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame < 40) {
                for (let i = 0; i < 4; i++) {
                    let speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    let spawnPoint = [speed[0] * 10, speed[1] * 10];
                    entities.push(Jade("bill", "red", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                    speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    spawnPoint = [speed[0] * 10, speed[1] * 10];
                    entities.push(Jade("orb", "red", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 40) {
                soundOfOption.currentTime = 0;
                _ = soundOfOption.play()
            }
            frame++;
            if (frame > 100) {
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
