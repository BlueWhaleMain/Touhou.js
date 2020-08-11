import CardUtil from "../card_util.js";
import {entities, L, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
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
        card: function (card) {
            for (let i = 0; i < 9; i++) {
                const angle = (40 * i + 5 * Math.pow(raw / 4, 2)) * L;
                const speed = transTo(3, 3, angle);
                entities.push(Jade("rice", "hotpink", card.entity.X, card.entity.Y, speed[0], speed[1], -angle - 45 * L, false))
            }
            raw += 0.2;
            soundOfBombShoot.currentTime = 0;
            _ = soundOfBombShoot.play();
            if (raw > 360) {
                raw = 0
            }
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
