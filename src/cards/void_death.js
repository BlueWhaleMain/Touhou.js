import CardUtil from "../card_util.js";
import {entities, L, session, transTo, modifyEntity} from "../util.js";
import Jade from "../prefabs/jade.js";
import {makeMovableArc} from "../components/movable.js";
import Laser from "../prefabs/laser.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export default function voidDeath(edit) {
    function lightRotate() {
        modifyEntity(function (entity) {
            if (entity.tags.has("LRotate" + meta)) {
                makeMovableArc(entity, 2, 0, 0.6, -0.01);
                entity.tags.delete("LRotate" + meta)
            }
        }, entities.length);
        modifyEntity(function (entity) {
            if (entity.tags.has("RRotate" + meta)) {
                makeMovableArc(entity, 2, 180, 0.6, -0.01);
                entity.tags.delete("RRotate" + meta)
            }
        }, entities.length)
    }

    function heavyRotate() {
        modifyEntity(function (entity) {
            if (entity.tags.has("LRotate" + meta)) {
                makeMovableArc(entity, 1, 0, 0.5, -0.01);
                entity.tags.delete("LRotate" + meta)
            }
        }, entities.length);
        modifyEntity(function (entity) {
            if (entity.tags.has("RRotate" + meta)) {
                makeMovableArc(entity, 1, 180, 0.5, -0.01);
                entity.tags.delete("RRotate" + meta)
            }
        }, entities.length)
    }

    function rice(color) {
        for (let j = 0; j < 64; j++) {
            for (let k = 1; k < 3; k++) {
                const speed = transTo(2, 0, 5.625 * j * L);
                const spawnPoint = transTo(k * 30, 0, 5.625 * j * L);
                if (j % 2 === 0) {
                    entities.push(Jade("rice", color, session.player.X + spawnPoint[0], session.player.Y + spawnPoint[1], speed[0], speed[1], undefined, false).addTag("LRotate" + meta))
                } else {
                    entities.push(Jade("rice", color, session.player.X + spawnPoint[0], session.player.Y + spawnPoint[1], speed[0], speed[1], undefined, false).addTag("RRotate" + meta))
                }
            }
        }
    }

    function ring(card) {
        for (let j = 0; j < 64; j++) {
            for (let k = 1; k < 3; k++) {
                const speed = transTo(3, 0, 5.625 * j * L);
                const spawnPoint = transTo(k * 20, 0, 5.625 * j * L);
                if (j % 2 === 0) {
                    entities.push(Jade("ring", "darkgray", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false).addTag("LRotate" + meta))
                } else {
                    entities.push(Jade("ring", "darkgray", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false).addTag("RRotate" + meta))
                }
            }
        }
        soundOfBombShoot.currentTime = 0;
        _ = soundOfBombShoot.play()
    }

    const meta = Math.random();
    let frame = 0;
    const cardData = {
        // 深渊「空亡」 rtl的bug
        name: "「深渊「空亡",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 10000,
        bonus: 1000000,
        card: function (card) {
            if (frame === 0) {
                rice("blue");
                let a = Math.atan2(session.player.Y - card.entity.Y, session.player.X - card.entity.X + 50) - 90 * L;
                entities.push(Laser("laser", "darkgray", card.entity.X - 50, card.entity.Y, 0, 0, a, {
                    startTime: 60,
                    delayTime: 120,
                    outTime: 16
                }));
                a = Math.atan2(session.player.Y - card.entity.Y, session.player.X - card.entity.X - 50) - 90 * L;
                entities.push(Laser("laser", "darkgray", card.entity.X + 50, card.entity.Y, 0, 0, a, {
                    startTime: 60,
                    delayTime: 120,
                    outTime: 16
                }));
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 12) {
                lightRotate();
                rice("green");
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 24) {
                lightRotate();
                rice("red");
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 36) {
                lightRotate()
            }
            if (frame === 60) {
                ring(card)
            }
            if (frame === 73) {
                heavyRotate()
            }
            if (frame === 80) {
                ring(card)
            }
            if (frame === 93) {
                heavyRotate()
            }
            if (frame === 100) {
                ring(card)
            }
            if (frame === 113) {
                heavyRotate()
            }
            frame++;
            if (frame > 200) {
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
