import CardUtil from "../card_util.js";
import {entities, L, transTo, newAudio, resources} from "../util.js";
import Jade from "../prefabs/jade.js";

let _;
const soundOfBombShoot = newAudio(resources.Sounds["bombShoot"]);
export default function boundaryBetweenWaveAndParticle(edit) {
    let frame = 0;
    let raw = 0;
    const cardData = {
        // 境符「波与粒的境界」 rtl的bug
        name: "「境符「波与粒的境界",
        delay: 60,
        slowFrame: 0,
        startFrame: 120,
        time: 6000,
        bonus: 2000000,
        card: function (card) {
            if (frame % 2 === 0) {
                for (let i = 0; i < 9; i++) {
                    const angle = (40 * i + 5 * Math.pow(raw / 4, 2)) * L;
                    const speed = transTo(2, 2, angle);
                    entities.push(Jade("rice", "hotpink", card.entity.X, card.entity.Y, speed[0], speed[1], -angle - 45 * L, false))
                }
                raw += 0.25;
                soundOfBombShoot.currentTime = 0;
                _ = soundOfBombShoot.play()
            }
            if (raw > 360) {
                raw = 0
            }
            frame++
        }
    };
    if (typeof edit === "function") {
        edit(cardData)
    }
    return new CardUtil(cardData)
}
