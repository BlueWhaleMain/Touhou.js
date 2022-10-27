import CardUtil from "../card_util.js";
import {ABox, entities, L, session, TAGS} from "../util.js";
import Jade from "../prefabs/jade.js";
import {generateRandomSpeed, makeMovableArc, movableArc} from "../components/movable.js";
import health from "../components/health.js";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {HEIGHT, WIDTH} from "../screens";

let _;
const COLOR_MAPPING = {
    scale: ["dimgray", "red", "orangered", "gold", "green", "water", "purple", "hotpink"],
    coin: ["gold", "silk", "copper"],
    bigStar: ["dimgray", "red", "orangered", "gold", "green", "water", "blue", "purple", "hotpink"],
    all: ["darkgray", "dimgray", "crimson", "red", "orangered", "gold", "khaki", "yellowgreen", "green", "aqua",
        "water", "blue", "darkblue", "purple", "hotpink"]
};
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfChangeTrack = newAudio(resources.Sounds.changeTrack);
export default function rumiaThink(edit) {
    let frame = 0;
    let c = 0;
    let directionFlag = 1;

    const cardData = {
        // RUMIA「THINK」 rtl的bug
        name: "「RUMIA「THINK",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 3800,
        bonus: 1000000,
        noCardFrame: 2400,
        enEp: function () {
            frame = 0
        },
        noCard: function (card) {
            const r = 120;
            if (frame % 30 === 0 && frame < 300) {
                directionFlag = -directionFlag
                for (let i = 0; i < 360; i += 15) {
                    const xc = Math.cos(i * L)
                    const ys = Math.sin(i * L)
                    const box = new ABox(r)
                    const entity = Jade("small", COLOR_MAPPING.all[i / 15 % COLOR_MAPPING.all.length],
                        card.entity.X, card.entity.Y, xc * 2, ys * 2, undefined, false);
                    entity.addComponent("brain", function () {
                        let backTime = 300;
                        let back = false
                        this.tick = function (inst) {
                            if (!back) {
                                if (!box.isHit(card.entity.X, card.entity.Y, inst.X, inst.Y, inst.atkBox)) {
                                    inst.components["movable"].MX = 0
                                    inst.components["movable"].MY = 0
                                    backTime--
                                }
                                if (backTime <= 0) {
                                    inst.components["movable"].MX = -xc * Math.nextSeed() * 4
                                    inst.components["movable"].MY = -ys * Math.nextSeed() * 4
                                    soundOfChangeTrack.currentTime = 0;
                                    _ = soundOfChangeTrack.play()
                                    back = true
                                }
                            }
                        }
                    })
                    sliceBullet(entity)
                    movableArc(entity, card.entity, r * Math.nextSeed(), i, directionFlag, 100);
                    entities.push(entity);
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                }
            }
            frame++
            if (frame > 600) {
                frame = 0
            }
        },
        card: function () {
            frame++;
            if (frame % 50 === 0 && frame < 300) {
                for (let d = 0; d < 8; d++) {
                    let x = Math.nextSeed() * WIDTH
                    let y = Math.nextSeed() * HEIGHT * 0.6
                    for (let i = 0; i < 360; i += 30) {
                        const xc = Math.cos(i * L)
                        const ys = Math.sin(i * L)
                        const entity = Jade("small", COLOR_MAPPING.all[i / 15 % COLOR_MAPPING.all.length],
                            x, y, xc, ys, undefined, false);
                        if (!entity.sizeBox.isHit(entity.X, entity.Y, session.player.X, session.player.Y, session.player.grazeBox)) {
                            makeMovableArc(entity, 10, 180, 0.1);
                            entity.addComponent("brain", function () {
                                let backTime = 100 * Math.nextSeed();
                                let back = false
                                this.tick = function (inst) {
                                    if (!back) {
                                        backTime--
                                        if (backTime <= 0) {
                                            inst.components["movable"].callback.tick = undefined
                                            back = true
                                        }
                                    }
                                }
                            })
                            sliceBullet(entity)
                            entities.push(entity);
                        }
                    }
                    soundOfChangeTrack.currentTime = 0;
                    _ = soundOfChangeTrack.play()
                }
            }
            if (frame > 600) {
                frame = 0;
                c++
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}

function sliceBullet(entity) {
    entity.addComponent("health", health);
    entity.components["health"].init(3, 3, 0);
    entity.components["health"].callback.dead = function () {
        for (let i = 0; i < 3; i++) {
            const speed = generateRandomSpeed();
            soundOfChangeTrack.currentTime = 0;
            _ = soundOfChangeTrack.play()
            const jade = Jade("point", entity.color, entity.X, entity.Y, speed[0], speed[1],
                undefined, false)
            jade.addComponent("drop", function () {
                this.tick = function (inst) {
                    inst.components["movable"].MY += 0.01
                }
            })
            entities.push(jade);
        }
    };
    entity.tags.add(TAGS.enemy)
}