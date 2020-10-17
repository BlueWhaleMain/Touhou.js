import {TAGS, L, GUI_SCREEN} from "../util.js";

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
    let r = Math.sqrt(MX * MX + MY * MY);
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

export function generateRandomSpeed(m = 2, max = 1, min = -1, abMax, abMin, spMax, spMin) {
    let rand1 = Math.nextSeed() * m - m / 2;
    if (rand1 > max) {
        rand1 = max
    } else if (rand1 < min) {
        rand1 = min
    }
    if (abMax && Math.abs(rand1) > abMax) {
        if (rand1 < 0) {
            rand1 = -abMax
        } else {
            rand1 = abMax
        }
    }
    if (abMin && Math.abs(rand1) < abMin) {
        if (rand1 < 0) {
            rand1 = -abMin
        } else {
            rand1 = abMin
        }
    }
    let rand2 = Math.nextSeed() * m - m / 2;
    if (rand2 > max) {
        rand2 = max
    } else if (rand2 < min) {
        rand2 = min
    }
    if (abMax && Math.abs(rand2) > abMax) {
        if (rand2 < 0) {
            rand2 = -abMax
        } else {
            rand2 = abMax
        }
    }
    if (abMin && Math.abs(rand2) < abMin) {
        if (rand2 < 0) {
            rand2 = -abMin
        } else {
            rand2 = abMin
        }
    }
    if (spMax && Math.sqrt(rand1 * rand1 + rand2 * rand2) > spMax) {
        const angle = Math.atan2(rand2, rand1);
        rand1 = Math.sin(angle) * spMax;
        rand2 = -Math.cos(angle) * spMax
    }
    if (spMin && Math.sqrt(rand1 * rand1 + rand2 * rand2) < spMin) {
        const angle = Math.atan2(rand2, rand1);
        rand1 = Math.sin(angle) * spMin;
        rand2 = -Math.cos(angle) * spMin
    }
    return [rand1, rand2];
}

export default function movable() {
    this.MX = 0;
    this.MY = 0;
    this.flush = true;
    this.grave = 0;
    this.callback = {};
    this.stop = false;
    this.reflex = {
        enabled: false,
        xMax: GUI_SCREEN.X + GUI_SCREEN.WIDTH,
        yMax: 2 * GUI_SCREEN.HEIGHT,
        xMin: GUI_SCREEN.X,
        yMin: GUI_SCREEN.Y,
        count: -1
    };
    this.tick = function (inst) {
        if (this.stop === true) {
            return
        }
        if (this.reflex.enabled === true && this.reflex.count !== 0) {
            let work = false;
            if (inst.atkBox.isOutX(inst.X, inst.Y, this.MX, this.reflex.xMax, this.reflex.xMin)) {
                this.MX = -this.MX;
                work = true
            }
            if (inst.atkBox.isOutY(inst.X, inst.Y, this.MY, this.reflex.yMax, this.reflex.yMin)) {
                this.MY = -this.MY;
                work = true
            }
            if (work === true && this.reflex.count > 0) {
                this.reflex.count--
            }
        }
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
