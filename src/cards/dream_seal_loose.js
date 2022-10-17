import {options, entities, GUI_SCREEN, L, newAudio, resources, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import {generateRandomSpeed} from "../components/movable.js";
import YinYangJade from "../prefabs/yin_yang_jade.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfOption = newAudio(resources.Sounds.option);
const volumeOfBombShoot = soundOfBombShoot.volume;
export default function dreamSealLoose(edit) {
    let frame = 0;
    let rand = 0;
    const cardData = {
        // 灵符「梦想封印　散」 rtl的bug
        name: "「灵符「梦想封印　散",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 4200,
        bonus: 1000000,
        noCardFrame: 4400,
        noCard: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            if (frame === 0) {
                for (let j = 0; j < 30; j++) {
                    for (let k = 0; k < 4; k++) {
                        let speed = (0.4 + 0.8 * Math.pow(1.09, k * 4));
                        speed = transTo(speed, speed, j * 12 * L + spyAngle);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("bill", "dimgray", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                        speed = 0.4 + 0.05 * k;
                        speed = transTo(speed, speed, j * 12 * L + spyAngle + k * 4 * L);
                        entities.push(Jade("bill", "red", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
                    }
                }
                soundOfBombShoot.volume = volumeOfBombShoot;
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play();
                rand = Math.nextSeed();
                frame++
            }
            if (20 < frame && frame < 120) {
                if (frame % 2 === 0) {
                    for (let i = 0; i < 2; i++) {
                        let speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                        let spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "red", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                    }
                    soundOfBombShoot.volume = volumeOfBombShoot * Math.random();
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play();
                }
                if (frame % 20 === 0) {
                    if (card.entity.X === card.entity.target.X && card.entity.Y === card.entity.target.Y) {
                        if (rand > 0.5) {
                            card.entity.target.X += 40
                        } else {
                            card.entity.target.X -= 40
                        }
                    }
                    if (card.entity.X === card.entity.target.X && card.entity.Y === card.entity.target.Y) {
                        if (rand > 0.6) {
                            if (card.entity.Y < 100) {
                                card.entity.target.Y += 20
                            }
                        } else {
                            if (card.entity.Y > 80) {
                                card.entity.target.Y -= 20
                            }
                        }
                    }
                    if (card.entity.X > GUI_SCREEN.WIDTH + GUI_SCREEN.X) {
                        card.entity.X = GUI_SCREEN.X;
                        card.entity.target.X = GUI_SCREEN.X + 40
                    }
                    if (card.entity.X < GUI_SCREEN.X) {
                        card.entity.X = GUI_SCREEN.WIDTH + GUI_SCREEN.X;
                        card.entity.target.X = GUI_SCREEN.WIDTH + GUI_SCREEN.X - 40
                    }
                    entities.push(YinYangJade(card.entity, card.entity.X, card.entity.Y, Math.nextSeed() - 0.5, -2));
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
            if (card.entity.X !== card.entity.target.X || card.entity.Y !== card.entity.target.Y) {
                return
            }
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            if (frame === 0) {
                for (let j = 0; j < 30; j++) {
                    for (let k = 0; k < 4; k++) {
                        let speed = (0.4 + 0.8 * Math.pow(1.09, k * 4));
                        speed = transTo(speed, speed, j * 12 * L + spyAngle);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("bill", "dimgray", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                }
                soundOfBombShoot.volume = options.Volume["SE"] / 100;
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame < 40) {
                for (let i = 0; i < 2; i++) {
                    let speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    let spawnPoint = [speed[0] * 10, speed[1] * 10];
                    entities.push(Jade("bill", "red", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                    speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    spawnPoint = [speed[0] * 10, speed[1] * 10];
                    entities.push(Jade("orb", "red", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                    if (frame % 4 === 0) {
                        speed = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                        spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(YinYangJade(card.entity, card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], false));
                    }
                }
                soundOfBombShoot.volume = options.Volume["SE"] / 100 * Math.random();
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play();
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
