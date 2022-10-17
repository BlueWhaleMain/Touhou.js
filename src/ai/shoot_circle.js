import {entities, L, newAudio, resources, session, transTo} from "../util";
import Jade from "../prefabs/jade";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export default function shootCircle(start, delay, end, sum, append = 1, startAngle = 0, endAngle = 360, max = 1, spy = false, ...arg) {
    let step = 0, count = 0
    return (inst) => {
        if (step > end) {
            return true
        }
        if (step > start && step < end && step % delay === 0 && count < max) {
            let spyAngle = 0;
            if (spy) {
                spyAngle = Math.atan2(inst.X - session.player.X, inst.Y - session.player.Y)
            }
            for (let i = startAngle; i <= endAngle; i += (endAngle - startAngle) / sum) {
                for (let k = 0; k < append; k++) {
                    const jade = Jade(...arg)
                    let speed = 0.4 + Math.pow(1.09, k * 2);
                    speed = transTo(speed, speed, spyAngle - i * L);
                    jade.X = inst.X + speed[0]
                    jade.Y = inst.Y + speed[1]
                    jade.components["movable"].MX = speed[0]
                    jade.components["movable"].MY = speed[1]
                    entities.push(jade);
                }
            }
            soundOfBombShoot.currentTime = 0;
            _ = soundOfBombShoot.play()
            count++
        }
        step++
    }
}