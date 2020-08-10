import {entities, L, session, transTo, newAudio, resources, HEIGHT} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";

let _;
const soundOfChangeTrack = newAudio(resources.Sounds.changeTrack);
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export default function asteroidBelt(edit) {
    let frame = 0;
    const cardData = {
        // 魔空「小行星带」 rtl的bug
        name: "「魔空「小行星带",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 3800,
        bonus: 1000000,
        card: function (card) {
            const spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
            for (let i = 0; i < 50; i++) {
                if (frame === 15 * i) {
                    for (let j = 0; j < 21; j++) {
                        const speed = transTo(0, 2, spyAngle - (5 * frame + 17 * j) * L);
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
            for (let i = 0; i < 20; i++) {
                if (frame === 20 * i + 50) {
                    for (let j = 0; j < 3; j++) {
                        const speed = transTo(0, 0.5, spyAngle - 90 * L);
                        const spawnPoint = [20, (Math.random() * HEIGHT)];
                        entities.push(Jade("star", "gold", spawnPoint[0], spawnPoint[1], speed[0], speed[1], undefined, false).rotate(0.1))
                    }
                    soundOfChangeTrack.currentTime = 0;
                    _ = soundOfChangeTrack.play()
                }
                if (frame === 20 * i + 50) {
                    for (let j = 0; j < 3; j++) {
                        const speed = transTo(0, 0.5, spyAngle + 90 * L);
                        const spawnPoint = [410, (Math.random() * HEIGHT)];
                        entities.push(Jade("star", "green", spawnPoint[0], spawnPoint[1], speed[0], speed[1], undefined, false).rotate(0.1))
                    }
                    soundOfChangeTrack.currentTime = 0;
                    _ = soundOfChangeTrack.play()
                }
            }
            frame++;
            if (frame > 755) {
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
