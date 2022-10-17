import {entities, L, newAudio, resources, session, transTo} from "../util";
import Jade from "../prefabs/jade";

let _;
const soundOfBombShoot1 = newAudio(resources.Sounds.bombShoot1);
export default function shootDot(start, delay, end, max = 1, spy = false, ...arg) {
    let step = 0, count = 0
    return (inst) => {
        if (step > end) {
            return true
        }
        if (step > start && step < end && step % delay === 0 && count < max) {
            const jade = Jade(...arg)
            jade.X = inst.X
            jade.Y = inst.Y
            if (spy) {
                const spyAngle = Math.atan2(inst.X - session.player.X, inst.Y - session.player.Y);
                const speed = transTo(Math.sqrt(Math.pow(jade.components["movable"].MX, 2)
                    + Math.pow(jade.components["movable"].MY, 2)), 0, spyAngle + 90 * L);
                jade.components["movable"].MX = speed[0]
                jade.components["movable"].MY = speed[1]
            }
            entities.push(jade)
            soundOfBombShoot1.currentTime = 0;
            _ = soundOfBombShoot1.play()
            count++
        }
        step++
    }
}