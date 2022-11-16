import {GUI_SCREEN, L, TAGS} from "../util.js";

export function movableAddSpeed(inst, fx, fy, mmx = 1, mmy = 1, max = 1, may = 1) {
    inst.components["movable"].callback.tick = function (inst) {
        const movable = inst.components["movable"];
        movable.MX = Math.max(mmx, Math.min(max, fx(movable.MX)));
        movable.MY = Math.max(mmy, Math.min(may, fx(movable.MY)));
    };
    return inst
}

export function movableArc(inst, target, r, arcAngle = 0, ya = 1, max) {
    const movable = inst.components["movable"];
    const handler = function (inst) {
        arcAngle += ya;
        if (arcAngle >= 360) {
            arcAngle = 0
        }
        inst.X = target.X + r * Math.cos(arcAngle * L);
        inst.Y = target.Y + r * Math.sin(arcAngle * L);
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

export function makeMovableArc(inst, r, arcAngle = 0, m = 1, ma = 0, mMin = 0, mMax) {
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
        const rotationRad = Math.atan2(movable.MY, movable.MX) + arcAngle * L;
        movable.MX += Math.sin(rotationRad) * v;
        movable.MY += -Math.cos(rotationRad) * v
    };
    return inst
}

export function makeMovableRotate(inst, speed, rotateAngle = 45, m = 1) {
    const movable = inst.components["movable"];
    const MX = movable.MX;
    const MY = movable.MY;
    let r = Math.sqrt(MX * MX + MY * MY);
    inst.components["movable"].callback.tick = function (inst) {
        r += speed;
        const rotationRad = Math.atan2(MY, MX) + rotateAngle * L;
        inst.components["movable"].MX = Math.sin(rotationRad) * r * m;
        inst.components["movable"].MY = -Math.cos(rotationRad) * r * m;
    };
    return inst
}

// export function makeMovableRotate(inst, speed, rotateAngle) {
//     const movable = inst.components["movable"];
//     const MX = movable.MX;
//     const MY = movable.MY;
//     const r = Math.sqrt(MX * MX + MY * MY) + speed;
//     if (rotateAngle === undefined) {
//         rotateAngle = 45
//     }
//     const rotationRad = Math.atan2(MY, MX) + rotateAngle * L;
//     inst.components["movable"].callback.tick = function (inst) {
//         inst.components["movable"].MX = Math.sin(rotationRad) * r;
//         inst.components["movable"].MY = -Math.cos(rotationRad) * r
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
        const rotationRad = Math.atan2(rand2, rand1);
        rand1 = Math.sin(rotationRad) * spMax;
        rand2 = -Math.cos(rotationRad) * spMax
    }
    if (spMin && Math.sqrt(rand1 * rand1 + rand2 * rand2) < spMin) {
        const rotationRad = Math.atan2(rand2, rand1);
        rand1 = Math.sin(rotationRad) * spMin;
        rand2 = -Math.cos(rotationRad) * spMin
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
        // 移动和碰撞并无关系，需要拆分
        // 碰撞可能会造成多种结果：造成伤害、改变速度、触发事件
        if (this.reflex.enabled === true && this.reflex.count !== 0) {
            let work = false;
            if (inst.atkBox.isOutX(inst.X, this.MX, this.reflex.xMax, this.reflex.xMin)) {
                this.MX = -this.MX;
                work = true
            }
            if (inst.atkBox.isOutY(inst.Y, this.MY, this.reflex.yMax, this.reflex.yMin)) {
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
