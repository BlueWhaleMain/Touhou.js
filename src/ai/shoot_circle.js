import {entities, L, session, transTo} from "../util";
import Jade from "../prefabs/jade";
import {newAudio} from "../resources/sounds";
import {resources} from "../resources/manager";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
/**
 * 圆形射击AI
 * @param start 等待帧
 * @param delay 延迟帧
 * @param end 结束帧
 * @param sum 横向数量+1
 * @param append 纵向数量
 * @param startAngle 开始角度+45
 * @param endAngle 结束角度
 * @param addAngle 负顺正逆
 * @param max 最大发射次数
 * @param spy 是否跟踪（狙）
 * @see Jade
 * @param arg 子弹参数
 * @returns {(function(*): (boolean|undefined))|*} AI
 */
export default function shootCircle(start, delay, end, sum, append = 1, startAngle = 0, endAngle = 359, addAngle = 0, max = 1, spy = false, ...arg) {
    let step = 0, count = 0
    return (inst) => {
        if (step > end) {
            return true
        }
        if (step > start && step < end && step % delay === 0 && count < max) {
            let spyRad = 0;
            if (spy) {
                spyRad = Math.atan2(inst.X - session.player.X, inst.Y - session.player.Y)
            }
            for (let i = startAngle; i <= endAngle; i += (endAngle - startAngle) / sum) {
                for (let k = 0; k < append; k++) {
                    const jade = Jade(...arg)
                    let speed = Math.sqrt(Math.pow(jade.components["movable"].MX, 2)
                        + Math.pow(jade.components["movable"].MY, 2)) + Math.pow(1.09, k * 2);
                    speed = transTo(speed, 0, spyRad + ((i + 45) % 360) * L);
                    jade.X = inst.X + speed[0]
                    jade.Y = inst.Y + speed[1]
                    jade.components["movable"].MX = speed[0]
                    jade.components["movable"].MY = speed[1]
                    entities.push(jade);
                }
            }
            soundOfBombShoot.currentTime = 0;
            _ = soundOfBombShoot.play()
            if (addAngle) {
                startAngle += addAngle
                endAngle += addAngle
                if (startAngle >= 360 && endAngle >= 360) {
                    startAngle -= 360
                    endAngle -= 360
                } else if (startAngle <= -360 && endAngle <= -360) {
                    startAngle += 360
                    endAngle += 360
                }
            }
            count++
        }
        step++
    }
}