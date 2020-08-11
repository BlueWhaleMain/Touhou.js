import {TAGS, L} from "../util.js";

export function movableArc(inst, target, r, yaw = 0, ya = 1, max) {
    const movable = inst.components["movable"];
    const handler = function (inst) {
        yaw += ya;
        if (yaw >= 360) {
            yaw = 0
        }
        inst.X = target.X + r * Math.cos(yaw * L);
        inst.Y = target.Y + r * Math.sin(yaw * L);
    };
    if (max) {
        movable.callback.tick = function () {
            if (max > 0) {
                max--;
                handler(inst)
            } else {
                movable.callback.tick = undefined
            }
        }
    } else {
        movable.tick = handler
    }
}

export function makeMovableArc(inst, r, yaw = 0, m = 1, ma = 0, mMin = 0, mMax) {
    const movable = inst.components["movable"];
    movable.callback.tick = function () {
        let v = m * m * r;
        m += ma;
        if (mMax !== undefined && m > mMax) {
            m = mMax
        }
        if (mMin !== undefined && m < mMin) {
            m = mMin
        }
        const angle = Math.atan2(movable.MY, movable.MX) + yaw * L;
        movable.MX += Math.sin(angle) * v;
        movable.MY += -Math.cos(angle) * v
    };
    return inst
}

export function makeMovableRotate(inst, speed, yaw = 45, m = 1) {
    const movable = inst.components["movable"];
    const MX = movable.MX;
    const MY = movable.MY;
    let r = Math.sqrt(Math.pow(MX, 2) + Math.pow(MY, 2));
    inst.components["movable"].callback.tick = function (inst) {
        r += speed;
        const angle = Math.atan2(MY, MX) + yaw * L;
        inst.components["movable"].MX = Math.sin(angle) * r * m;
        inst.components["movable"].MY = -Math.cos(angle) * r * m;
    };
    return inst
}

// export function makeMovableRotate(inst, speed, yaw) {
//     const movable = inst.components["movable"];
//     const MX = movable.MX;
//     const MY = movable.MY;
//     const r = Math.sqrt(MX * MX + MY * MY) + speed;
//     if (yaw === undefined) {
//         yaw = 45
//     }
//     const angle = Math.atan2(MY, MX) + yaw * L;
//     inst.components["movable"].callback.tick = function (inst) {
//         inst.components["movable"].MX = Math.sin(angle) * r;
//         inst.components["movable"].MY = -Math.cos(angle) * r
//     };
//     return inst
// }

export default function movable() {
    this.MX = 0;
    this.MY = 0;
    this.flush = true;
    this.grave = 0;
    this.callback = {};
    this.tick = function (inst) {
        inst.X += this.MX;
        inst.Y += this.MY;
        if (this.grave) {
            this.MY += this.grave
        }
        if (this.flush && inst.sizeBox.isOutScreen(inst.X, inst.Y, this.MX, this.MY)) {
            inst.tags.add(TAGS.death)
        }
        if (typeof this.callback.tick === "function") {
            this.callback.tick(inst)
        }
    }
}
