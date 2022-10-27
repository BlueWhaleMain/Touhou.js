import CardUtil from "../card_util.js";
import {
    entities,
    L,
    session,
    arrowTo,
    transTo,
    modifyEntity
} from "../util.js";
import Jade from "../prefabs/jade.js";
import {newImage} from "../resources/images";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";
import {getLayer, LAYER_MAPPING} from "../layers/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const playerBorder = newImage(resources.Images.playerBorder);
const COLOR_MAPPING = {
    0: "red",
    1: "crimson",
    2: "orangered",
    3: "gold",
    4: "khaki",
    5: "green",
    6: "aqua",
    7: "water",
    8: "blue",
    9: "purple",
    10: "hotpink"
};
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function test1(edit) {
    let frame = 0;
    const meta = Math.random();
    const cardData = {
        // 测试「Test 1」 rtl的bug
        name: "「测试「Test 1",
        delay: 60,
        slowFrame: 0,
        startFrame: 100,
        time: 1200,
        bonus: 100000,
        noCardFrame: 2400,
        isTimeSpell: true,
        borderDraw: function (entity, time, total) {
            layerStage.save();
            layerStage.translate(entity.X, entity.Y);
            layerStage.rotate(time / 24);
            const scale = 2 + time / total * 4 + Math.sin(time / 24);
            layerStage.scale(scale, scale);
            layerStage.drawImage(playerBorder, -32, -32);
            layerStage.restore();
        },
        noCard: function (card) {
            if (frame % 30 === 0) {
                for (let i = 0; i <= 360; i += 36) {
                    let speed = transTo(2, 2, (i + frame / 10) * L);
                    entities.push(Jade("bill", "purple", card.entity.X, card.entity.Y, speed[0], speed[1]));
                    speed = arrowTo(card.entity.X, card.entity.Y, session.player.X, session.player.Y, 1);
                    speed = transTo(speed[0], speed[1], (i + frame / 10) * L);
                    entities.push(Jade("bill", "hotpink", card.entity.X, card.entity.Y, speed[0], speed[1]));
                }
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (frame % 360 === 0) {
                if (Math.nextSeed() > 0.5) {
                    if (card.entity.X < 416) {
                        card.entity.target.X += 20
                    }
                } else {
                    if (card.entity.X > 100) {
                        card.entity.target.X -= 20
                    }
                }
                if (Math.nextSeed() > 0.5) {
                    if (card.entity.Y < 140) {
                        card.entity.target.Y += 20
                    }
                } else {
                    if (card.entity.Y > 100) {
                        card.entity.target.Y -= 20
                    }
                }
                if (card.entity.X > 416) {
                    card.entity.target.X -= 0.1
                }
                if (card.entity.X < 100) {
                    card.entity.target.X += 0.1
                }
                if (card.entity.Y > 140) {
                    card.entity.target.Y -= 0.1
                }
                if (card.entity.Y < 100) {
                    card.entity.target.Y += 0.1
                }
            }
            frame++;
        },
        card: function () {
            if (frame % 60 === 0) {
                modifyEntity(function (entity) {
                    if (entity.tags.has("Spy" + meta)) {
                        entity.spy(1, session.player, undefined, function (inst) {
                            inst.color = "red"
                        });
                        entity.tags.delete("Spy" + meta)
                    }
                })
            }
            if (frame % 12 === 0) {
                const color = COLOR_MAPPING[Math.floor(Math.nextSeed() * 10)];
                let speed = transTo(0, 2, 90 * L);
                entities.push(Jade("bill", color, 20, 5, speed[0], speed[1], undefined, false).addTag("Spy" + meta));
                entities.push(Jade("bill", color, 20, 5, 0, 3, undefined, false).addTag("Spy" + meta));
                speed = transTo(0, 2, -90 * L);
                entities.push(Jade("bill", color, 420, 475, speed[0], speed[1], undefined, false).addTag("Spy" + meta));
                entities.push(Jade("bill", color, 420, 475, 0, -3, undefined, false).addTag("Spy" + meta));
            }
            frame++
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
