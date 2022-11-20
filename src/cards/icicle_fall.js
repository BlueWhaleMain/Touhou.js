/*
Icicle Fall
 */
import CardUtil from "../card_util.js";
import {entities, GUI_SCREEN, L, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {generateRandomSpeed} from "../components/movable";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export default function icicleFall(edit) {
    function slowNeedle(card, rotationAngle = 0) {
        const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + rotationAngle * L
        for (let k = 1; k < 5; k++) {
            for (let i = 0; i < k * 2 - 1; i++) {
                let speed = 0.8 + 0.4 * Math.pow(1.09, (5 - k) * 2);
                // (2k-1-(k-1))-(2k-1-i)
                // i-k+1
                speed = transTo(speed, speed, spyRad + (i - k + 1) * 1.2 * L + (90 + 45) * L);
                entities.push(Jade("needle", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
            }
        }
        soundOfBombShoot.currentTime = 0
        _ = soundOfBombShoot.play()
    }

    function iceShoot(card, frame) {
        for (let i = 0; i <= 360; i += 22.5) {
            let speed = 1;
            speed = transTo(speed, speed, (i + frame / 10) * L);
            entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined));
        }
        for (let i = 0; i < 16; i++) {
            const speed = generateRandomSpeed(6, 3, -3, undefined, undefined,
                undefined, 2);
            entities.push(Jade("point", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
        }
        slowNeedle(card)
    }

    function iceFall(speed, card) {
        entities.push(Jade("needle", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined).edit((inst) => {
            inst.addComponent("out", function () {
                let timeDown = 60
                this.tick = function (inst) {
                    if (timeDown < 1) {
                        const movable = inst.components['movable']
                        let speed;
                        if (inst.X < GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2) {
                            speed = transTo(movable.MX, movable.MY, 90 * L);
                        } else {
                            speed = transTo(movable.MX, movable.MY, -90 * L);
                        }
                        movable.MX = speed[0]
                        movable.MY = speed[1]
                        inst.removeComponent("out")
                    }
                    timeDown--
                }
            })
        }));
    }

    function move(card) {
        card.entity.maxMovementSpeed = 3;
        if (Math.nextSeed() > 0.5) {
            if (card.entity.X < GUI_SCREEN.WIDTH - GUI_SCREEN.X) {
                card.entity.target.X += 50
            }
        } else {
            if (card.entity.X > 2 * GUI_SCREEN.X) {
                card.entity.target.X -= 50
            }
        }
        if (Math.nextSeed() > 0.5) {
            if (card.entity.Y < 20) {
                card.entity.target.Y += 10
            }
        } else {
            if (card.entity.Y > 100) {
                card.entity.target.Y -= 10
            }
        }
        if (card.entity.X > GUI_SCREEN.WIDTH - GUI_SCREEN.X) {
            card.entity.target.X -= 50
        }
        if (card.entity.X < 2 * GUI_SCREEN.X) {
            card.entity.target.X += 50
        }
        if (card.entity.Y > 100) {
            card.entity.target.Y -= 1
        }
        if (card.entity.Y < 20) {
            card.entity.target.Y += 1
        }
    }

    let frame = 0, rotationAngle = 0;
    const cardData = {
        // 冰符「Icicle Fall」 rtl的bug
        name: "「冰符「Icicle Fall",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 2400,
        bonus: 600000,
        noCardFrame: 2400,
        noCard: function (card) {
            if (frame === 0) {
                move(card)
            }
            if (frame === 60) {
                iceShoot(card, frame)
            }
            if (frame === 120) {
                iceShoot(card, frame)
            }
            if (frame === 180) {
                iceShoot(card, frame)
            }
            if (frame === 260) {
                move(card)
            }
            if (frame === 320) {
                slowNeedle(card, -15)
                slowNeedle(card)
                slowNeedle(card, 15)
            }
            if (frame === 350) {
                slowNeedle(card, -8)
                slowNeedle(card, 8)
            }
            if (frame === 380) {
                slowNeedle(card, -15)
                slowNeedle(card)
                slowNeedle(card, 15)
            }
            frame++;
            if (frame > 500) {
                frame = 0
            }
        },
        card: function (card) {
            if (frame === 0) {
                for (let k = 0; k < 3; k++) {
                    let speed = Math.pow(1.2, k * 2);
                    iceFall(transTo(speed, speed, (45 + 25 - rotationAngle) * L), card)
                    iceFall(transTo(speed, speed, (-45 - 90 - 25 + rotationAngle) * L), card)
                }
                const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y)
                for (let i = 0; i < 60; i += 12) {
                    let speed = 2;
                    // my  i+90+angleMax+angleMax/max/2
                    speed = transTo(0, speed, (i + 90 + 60 + 12 / 2) * L + spyRad);
                    entities.push(Jade("small", "gold", card.entity.X, card.entity.Y, speed[0], speed[1]));
                }
                soundOfBombShoot.currentTime = 0
                _ = soundOfBombShoot.play()
                rotationAngle += 5
                if (rotationAngle > 60) {
                    rotationAngle = 0
                }
            }
            frame++;
            if (frame > 25) {
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
