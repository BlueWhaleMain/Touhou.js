import {L} from "../util";

const r90 = 90 * L;
export default function moveLine(/* number */MX,/* number */MY,/* number */rotation = undefined) {
    return (inst) => {
        inst.X += MX
        inst.Y += MY
        if (MX < 0) {
            if (typeof inst.left === "function") {
                inst.left()
            }
        } else if (MX > 0) {
            if (typeof inst.right === "function") {
                inst.right()
            }
        }
        if (!isNaN(inst.rotation)) {
            inst.rotation = rotation || Math.atan2(MY, MX) + r90;
        }
    }
}