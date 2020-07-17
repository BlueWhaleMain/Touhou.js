import card_util from "../card_util.js";
import {arrowTo, entities, L, Sounds, transTo} from "../util.js";
import jade from "../prefabs/jade.js";

let _;
export default function night_bird() {
    let frame = 0;
    let c = 0;
    return new card_util({
        name: "夜符「Night Bird」",
        slow_frame: 0,
        start_frame: 100,
        time: 6000,
        bonus: 50000,
        dropBlueCount: 0,
        dropPowerCount: 0,
        card: function (card) {
            if (0 < frame && frame < 17) {
                let j = frame;
                for (let k = 0; k < 3; k++) {
                    let speed = arrowTo(card.entity.X, card.entity.Y, player.X, player.Y, (0.08 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16);
                    speed = transTo(speed[0], speed[1], (90 - 90 / 16 * j - 3) * L);
                    entities.push(jade("ring", "water", card.entity.X, card.entity.Y, speed[0], speed[1]))
                }
                Sounds.bomb_shoot.currentTime = 0;
                _ = Sounds.bomb_shoot.play()
            }
            if (17 < frame && frame < 33) {
                let j = frame - 16;
                for (let k = 0; k < 3; k++) {
                    let speed = arrowTo(card.entity.X, card.entity.Y, player.X, player.Y, (0.08 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16);
                    speed = transTo(speed[0], speed[1], (-90 + 90 / 16 * j) * L);
                    entities.push(jade("ring", "purple", card.entity.X, card.entity.Y, speed[0], speed[1]))
                }
                Sounds.bomb_shoot.currentTime = 0;
                _ = Sounds.bomb_shoot.play()
            }
            frame++;
            if (frame > 48) {
                frame = 0;
                c++
            }
            if (c === 4) {
                c = 0;
                frame = -60;
                if (Math.random() > 0.5) {
                    if (card.entity.X < 832) {
                        card.X += 40
                    }
                } else {
                    if (card.entity.X > 200) {
                        card.X -= 40
                    }
                }
                if (Math.random() > 0.5) {
                    if (card.entity.Y < 332) {
                        card.Y += 40
                    }
                } else {
                    if (card.entity.Y > 200) {
                        card.Y -= 40
                    }
                }
                if (card.entity.X > 832) {
                    card.X -= 0.2
                }
                if (card.entity.X < 200) {
                    card.X += 0.2
                }
                if (card.entity.Y > 332) {
                    card.Y -= 0.2
                }
                if (card.entity.Y < 200) {
                    card.Y += 0.2
                }
            }
        }
    })
}
