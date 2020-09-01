import CardUtil from "../card_util.js";
import {entities, L, transTo, newAudio, resources, newImage, getLayer, LAYER_MAPPING} from "../util.js";
import Jade from "../prefabs/jade.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const playerBorder = newImage(resources.Images.playerBorder);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
export default function boundaryBetweenWaveAndParticle(edit) {
    let raw = 0;
    const cardData = {
        // 境符「波与粒的境界」 rtl的bug
        name: "「境符「波与粒的境界",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 12000,
        bonus: 2000000,
        Y: 220,
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
            for (let i = 0; i < 5; i++) {
                const angle = (72 * i + Math.pow(raw, 2)) * L;
                const speed = transTo(3, 3, angle);
                entities.push(Jade("rice", "hotpink", card.entity.X, card.entity.Y, speed[0], speed[1], -angle - 45 * L, false))
            }
            raw += 0.15;
            soundOfBombShoot.currentTime = 0;
            _ = soundOfBombShoot.play()
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
