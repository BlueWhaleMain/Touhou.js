import {L, transTo} from "../util";

export default function moveTo(x, y, speed, done, max = -1) {
    let ended = false
    return (inst) => {
        if (ended === true) {
            return true;
        }
        if (max > 0) {
            max--
        }
        if (max === 0) {
            if (typeof done === 'function') {
                if (done(inst)) {
                    ended = true
                }
            }
            return
        }
        if (Math.sqrt(Math.pow(inst.X - x, 2) + Math.pow(inst.Y - y, 2)) <= speed) {
            inst.X = x
            inst.Y = y
            if (typeof done === 'function') {
                if (done(inst)) {
                    ended = true
                }
            }
            return
        }
        const spyAngle = Math.atan2(inst.X - x, inst.Y - y);
        const speed2 = transTo(speed, 0, spyAngle + 90 * L);
        inst.X += speed2[0]
        inst.Y += speed2[1]
        if (speed2[0] < 0) {
            if (typeof inst.left === "function") {
                inst.left()
            }
        } else if (speed2[0] > 0) {
            if (typeof inst.right === "function") {
                inst.right()
            }
        }
    }
}