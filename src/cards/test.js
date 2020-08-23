/**
 * 这张符卡用来做参考很不错
 */
import CardUtil from "../card_util.js";
import {entities, newAudio, resources, getLayer, LAYER_MAPPING, newImage} from "../util.js";
import Jade from "../prefabs/jade.js";
import {generateRandomSpeed} from "../components/movable.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const playerBorder = newImage(resources.Images.playerBorder);
const COLOR_MAPPING = {
    scale: ["dimgray", "red", "orangered", "gold", "green", "water", "purple", "hotpink"],
    coin: ["gold", "silk", "copper"],
    bigStar: ["dimgray", "red", "orangered", "gold", "green", "water", "blue", "purple", "hotpink"],
    all: ["darkgray", "dimgray", "crimson", "red", "orangered", "gold", "khaki", "yellowgreen", "green", "aqua",
        "water", "blue", "darkblue", "purple", "hotpink"]
};
const BULLET_MAPPING = ["scale", "ring", "small", "rice", "suffering", "bill", "bacteria", "needle", "star", "ice",
    "point", "shiji", "coin", "arrow", "orb", "bigStar", "knife", "heart", "butterfly", "oval", "big"];
const layerStage = getLayer(LAYER_MAPPING.STAGE);

function spawnBullet(card, type) {
    let mapping = COLOR_MAPPING[type];
    if (mapping === undefined) {
        mapping = COLOR_MAPPING.all
    }
    for (let i = 0; i < mapping.length; i++) {
        let speed = generateRandomSpeed(8, 8, -8, undefined, undefined, 6, 2);
        entities.push(Jade(type, mapping[i], card.entity.X, card.entity.Y, speed[0], speed[1], undefined, false));
    }
    soundOfBombShoot.currentTime = 0;
    _ = soundOfBombShoot.play()
}

export default function test(edit) {
    let frame = 0;
    let c = 0;
    const cardData = {
        name: "「纯粹的弹幕测试」",
        delay: 60,
        slowFrame: 120,
        startFrame: 100,
        time: 132 * BULLET_MAPPING.length,
        bonus: 13200 * BULLET_MAPPING.length,
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
        card: function (card) {
            if (frame % 10 === 0) {
                spawnBullet(card, BULLET_MAPPING[c])
            }
            frame++;
            if (frame > 120 || frame > 10 && card.getTime() < 11 * BULLET_MAPPING.length) {
                frame = 0;
                c++
            }
            if (c >= BULLET_MAPPING.length) {
                c = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
