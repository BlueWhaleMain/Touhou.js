import CardUtil from "../card_util.js";
import {entities, GUI_SCREEN, L, modifyEntity, session, transTo} from "../util.js";
import Jade from "../prefabs/jade.js";
import {makeMovableArc} from "../components/movable.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import Laser from "../prefabs/laser";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfBombShoot1 = newAudio(resources.Sounds.bombShoot1);
const r90 = 90 * L;
const r135 = 135 * L;
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

    function ring(card, j, spyRad) {
        for (let k = 0; k < 5; k++) {
            let speed = (1 + 4 * Math.pow(1.09, (12 - j) / 12 + k / 2));
            speed = transTo(speed, 0, 6 * j * L + spyRad);
            entities.push(Jade("ring", "blue", card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false).addTag("Spy" + meta))
        }
        soundOfBombShoot.currentTime = 0;
        _ = soundOfBombShoot.play()
    }

    const meta = Math.random();
    const cardData = {
        // 暗符「境界线」 rtl的bug
        name: "「暗符「境界线",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 2400,
        bonus: 600000,
        noCardFrame: 1380,
        noCard: (function () {
            let frame = 0;
            return function (card) {
                if (frame === 0) {
                    card.entity.maxMovementSpeed = 2;
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 3 + 50
                    card.entity.target.Y = GUI_SCREEN.Y + 100
                }
                if (frame === 10) {
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135;
                    for (let i = 0; i < 35; i += 5) {
                        for (let k = 0; k < 8; k++) {
                            let speed = 0.8 + Math.pow(1.09, k);
                            speed = transTo(speed, speed, i * L + spyRad);
                            entities.push(Jade("ring", "green", card.entity.X, card.entity.Y, speed[0], speed[1]))
                        }
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame > 10 && frame < 64 && frame % 8 === 0) {
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y);
                    entities.push(Laser("laser", "blue", card.entity.X + 256 * Math.sin(spyRad), card.entity.Y - 256 * Math.cos(spyRad), 0, 0, spyRad, {
                        startTime: 25,
                        delayTime: 60,
                        outTime: 8
                    }))
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 120) {
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 + 50
                    card.entity.target.Y = GUI_SCREEN.Y + 150
                }
                if (frame > 140 && frame < 160) {
                    let j = frame;
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135 + r90;
                    for (let k = 0; k < 4; k++) {
                        let speed = 0.4 + Math.pow(1.09, (15 - j) / 16 + k * 4);
                        speed = transTo(speed, speed, (110 - 135 / 16 * j - 3) * L + spyRad);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "green", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                    for (let k = 0; k < 4; k++) {
                        let speed = 0.8 + Math.pow(1.09, (15 - j) / 16 + k * 4);
                        speed = transTo(speed, speed, (110 - 135 / 16 * j - 3) * L + spyRad);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "green", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                    for (let k = 0; k < 4; k++) {
                        let speed = 1.2 + Math.pow(1.09, (15 - j) / 16 + k * 4);
                        speed = transTo(speed, speed, (110 - 135 / 16 * j - 3) * L + spyRad);
                        const spawnPoint = [speed[0] * 10, speed[1] * 10];
                        entities.push(Jade("ring", "green", card.entity.X + spawnPoint[0], card.entity.Y + spawnPoint[1], speed[0], speed[1], undefined, false))
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame === 220) {
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH * 2 / 3
                    card.entity.target.Y = GUI_SCREEN.Y + 50
                }
                if (frame > 260 && frame < 350 && frame % 30 === 0) {
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r90;
                    for (let i = 0; i < 96; i += 6) {
                        for (let k = 0; k < 2; k++) {
                            let speed = 0.2 + 2 * Math.pow(1.09, k);
                            speed = transTo(speed, speed, i * L + spyRad);
                            entities.push(Jade("rice", "gold", card.entity.X, card.entity.Y, speed[0], speed[1]))
                        }
                    }
                    soundOfBombShoot.currentTime = 0
                    _ = soundOfBombShoot.play()
                }
                if (frame === 400) {
                    card.entity.target.X = GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2
                    card.entity.target.Y = GUI_SCREEN.Y + 100
                }
                if (frame > 420 && frame < 540 && frame % 40 === 0) {
                    const c = (frame - 400) / 40
                    let type
                    if (c % 2 === 0) {
                        type = 'point'
                    } else {
                        type = 'rice'
                    }
                    const spyRad = Math.atan2(card.entity.X - session.player.X, card.entity.Y - session.player.Y) + r135;
                    for (let i = 0; i < 360; i += 6) {
                        for (let k = 0; k < 2; k++) {
                            let speed = 2 * Math.pow(1.09, k);
                            speed = transTo(speed, speed, i * L + spyRad);
                            entities.push(Jade(type, "green", card.entity.X, card.entity.Y, speed[0], speed[1]))
                        }
                    }
                    soundOfBombShoot1.currentTime = 0
                    _ = soundOfBombShoot1.play()
                }
                if (frame > 600) {
                    frame = 0
                } else {
                    frame++
                }
            }
        })(),
        card: (function () {
            let frame = 0;
            let c = 0;
            return function (card) {
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
        })()
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
