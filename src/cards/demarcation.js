import CardUtil from "../card_util.js";
import {entities, L, transTo, modifyEntity, session, GUI_SCREEN} from "../util.js";
import Jade from "../prefabs/jade.js";
import {makeMovableArc} from "../components/movable.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export default function demarcation(edit) {
    function lightRotate() {
        modifyEntity(function (entity) {
            if (entity.tags.has("LRotate" + meta)) {
                makeMovableArc(entity, 2, 0, 0.5, -0.01);
                entity.tags.delete("LRotate" + meta)
            }
        }, entities.length);
        modifyEntity(function (entity) {
            if (entity.tags.has("RRotate" + meta)) {
                makeMovableArc(entity, 2, 180, 0.5, -0.01);
                entity.tags.delete("RRotate" + meta)
            }
        }, entities.length)
    }

    function rice(card, color) {
        for (let j = 0; j < 64; j++) {
            for (let k = 1; k < 3; k++) {
                const speed = transTo(3, 0, 5.625 * j * L);
                const spawnPoint = transTo(k * 20, 0, 5.625 * j * L);
                if (j % 2 === 0) {
                    entities.push(Jade("rice", color, card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false).addTag("LRotate" + meta))
                } else {
                    entities.push(Jade("rice", color, card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false).addTag("RRotate" + meta))
                }
            }
        }
    }

    function move(card) {
        card.entity.maxMovementSpeed = 5;
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

    function ring(card, j, spyAngle) {
        for (let k = 0; k < 5; k++) {
            let speed = (1 + 4 * Math.pow(1.09, (12 - j) / 12 + k / 2));
            speed = transTo(speed, 0, 6 * j * L + spyAngle);
            entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false).addTag("Spy" + meta))
        }
        soundOfBombShoot.currentTime = 0;
        _ = soundOfBombShoot.play()
    }

    const meta = Math.random();
    let frame = 0;
    let c = 0;
    const cardData = {
        // 暗符「境界线」 rtl的bug
        name: "「暗符「境界线",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 2400,
        bonus: 600000,
        card: function (card) {
            if (frame === 0) {
                rice(card, "blue");
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 12) {
                lightRotate();
                rice(card, "green");
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 24) {
                lightRotate();
                rice(card, "red");
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame === 36) {
                lightRotate()
            }
            if (frame === 60) {
                move(card)
            }
            if (frame > 60 && frame < 73) {
                c++;
                let j = frame - 60;
                ring(card, j, 180 * L)
            }
            if (frame === 73) {
                modifyEntity(function (entity) {
                    if (entity.tags.has("Spy" + meta)) {
                        entity.spy(1, session.player);
                        entity.tags.delete("Spy" + meta)
                    }
                });
                move(card)
            }
            if (frame > 80 && frame < 93) {
                c++;
                let j = frame - 93;
                ring(card, j, 270 * L)
            }
            if (frame === 93) {
                modifyEntity(function (entity) {
                    if (entity.tags.has("Spy" + meta)) {
                        entity.spy(1, session.player);
                        entity.tags.delete("Spy" + meta)
                    }
                });
                move(card)
            }
            if (frame > 100 && frame < 113) {
                c++;
                let j = frame - 86;
                ring(card, j, 180 * L)
            }
            if (frame === 113) {
                modifyEntity(function (entity) {
                    if (entity.tags.has("Spy" + meta)) {
                        entity.spy(1, session.player);
                        entity.tags.delete("Spy" + meta)
                    }
                });
            }
            frame++;
            if (frame > 200) {
                // frame = -100 * card.getTime() / 6000;
                frame = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
