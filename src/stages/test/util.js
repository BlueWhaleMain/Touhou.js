import {entities, L, session, transTo} from "../../util";
import MagicRing from "../../prefabs/enemy/magic_ring";
import Jade from "../../prefabs/jade";
import {makeMovableArc} from "../../components/movable";
import {newAudio} from "../../resources/sounds";
import {resources} from "../../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
const soundOfChangeTrack = newAudio(resources.Sounds.changeTrack);
export const spawnMagicRing = (x, y, start, end) => {
    let step = 0, count = 0
    entities.push(MagicRing(x, y, (inst) => {
        let spyDone = false
        if (step > end) {
            return true
        }
        if (step > start && step < end && count < 1) {
            for (let i = 0; i <= 360; i += 360 / 8) {
                const jade = Jade('point', 'dimgray', inst.X, inst.Y, 0, 0)
                let speed = 1;
                speed = transTo(speed, 0, ((i + 45) % 360) * L);
                jade.X = inst.X + speed[0]
                jade.Y = inst.Y + speed[1]
                jade.components["movable"].MX = speed[0]
                jade.components["movable"].MY = speed[1]
                makeMovableArc(jade, 2, 180, 0.5)
                jade.addComponent("brain", function () {
                    let backTime = 60;
                    let back = false
                    this.tick = function (inst) {
                        if (!back) {
                            backTime--
                            if (backTime <= 0) {
                                if (!spyDone) {
                                    const spyRad = Math.atan2(x - session.player.X, y - session.player.Y);
                                    for (let i = 0; i <= 15; i += 15 / 5) {
                                        for (let k = 0; k < 3; k++) {
                                            const jade = Jade('point', 'dimgray', x, y, 0, 0)
                                            let speed = 2 + Math.pow(1.09, k * 3);
                                            speed = transTo(speed, 0, spyRad + (i + 90 % 360) * L);
                                            jade.X = inst.X + speed[0]
                                            jade.Y = inst.Y + speed[1]
                                            jade.components["movable"].MX = speed[0]
                                            jade.components["movable"].MY = speed[1]
                                            entities.push(jade);
                                        }
                                    }
                                    spyDone = true
                                }
                                const spyRad = Math.atan2(inst.X - session.player.X, inst.Y - session.player.Y);
                                speed = transTo(5, 0, spyRad + 90 * L);
                                inst.components["movable"].MX = speed[0]
                                inst.components["movable"].MY = speed[1]
                                inst.components["movable"].callback.tick = null
                                soundOfChangeTrack.currentTime = 0;
                                _ = soundOfChangeTrack.play()
                                back = true
                            }
                        }
                    }
                })
                entities.push(jade);
            }
            soundOfBombShoot.currentTime = 0;
            _ = soundOfBombShoot.play()
            count++
        }
        step++
    }, end))
}