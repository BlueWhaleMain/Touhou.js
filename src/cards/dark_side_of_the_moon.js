import {entities, GUI_SCREEN, L, transTo, EVENT_MAPPING, session} from "../util.js";
import Jade from "../prefabs/jade.js";
import CardUtil from "../card_util.js";
import {generateRandomSpeed} from "../components/movable.js";
import {HEALTH_DELTA_MAX} from "../prefabs/boss_util.js";
import {ob} from "../observer.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);

export default function darkSideOfTheMoon(edit) {
    function moveTo(card) {
        card.entity.maxMovementSpeed = 1;
        const W = Math.nextSeed() * 100;
        const H = Math.nextSeed() * 20;
        if (Math.nextSeed() > 0.5) {
            if (card.entity.X < GUI_SCREEN.WIDTH - GUI_SCREEN.X - W) {
                card.entity.target.X += W
            }
        } else {
            if (card.entity.X > 2 * GUI_SCREEN.X + W) {
                card.entity.target.X -= W
            }
        }
        if (Math.nextSeed() > 0.5) {
            if (card.entity.Y < 20 - H) {
                card.entity.target.Y += H
            }
        } else {
            if (card.entity.Y > 100 + H) {
                card.entity.target.Y -= H
            }
        }
    }

    let frame = 60, delay = 20, c = 0, spyAngle;
    const cardData = {
        // 暗符「月的阴暗面」 rtl的bug
        name: "「暗符「月的阴暗面",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 5400,
        bonus: 500000,
        card: function (card, time) {
            if (time > 3600) {
                card.entity.healthDeltaMax = 0.1
            } else if (time > 1800) {
                card.entity.healthDeltaMax = 1
            } else {
                card.entity.healthDeltaMax = HEALTH_DELTA_MAX
            }
            if (frame === 60) {
                ob.dispatchEvent(EVENT_MAPPING.clearEntity);
                moveTo(card)
            }
            if (frame > 60 && frame < 200 && frame % delay === 0) {
                let spawnPoint = [Math.nextSeed() * 50, Math.nextSeed() * 50];
                let speed;
                for (let i = 0; i < 3 + c; i++) {
                    speed = generateRandomSpeed(8, 8, -8, undefined, undefined,
                        undefined, 2);
                    entities.push(Jade("point", "red", card.entity.X + spawnPoint[0],
                        card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                    speed = generateRandomSpeed(8, 8, -8, undefined, undefined,
                        undefined, 2);
                    entities.push(Jade("small", "red", card.entity.X + spawnPoint[0],
                        card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false));
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 200) {
                card.entity.target.X = card.entity.X;
                card.entity.target.Y = card.entity.Y;
                spyAngle = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
                for (let i = 0; i <= 360; i += 22.5) {
                    let speed = transTo(2, 2, i * L + spyAngle);
                    entities.push(Jade("orb", "gold", card.entity.X, card.entity.Y, speed[0], speed[1],
                        undefined));
                }
                _ = soundOfBombShoot.play()
            }
            frame++;
            if (frame > 260) {
                frame = 0;
                if (delay > 1) {
                    delay--
                }
                if (c < 10) {
                    c++
                }
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
