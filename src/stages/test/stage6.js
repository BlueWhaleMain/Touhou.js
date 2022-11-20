import StageItem from "../../stage_item";
import {ABox, batchExecute, clearEntity, delayExecute, entities, GUI_SCREEN, L, onceExecute, TAGS} from "../../util";
import {changeBGM, newAudio} from "../../resources/sounds";
import {ASSETS} from "../../resources/assets";
import Yousei from "../../prefabs/enemy/yousei";
import PowerOrb from "../../prefabs/power_orb";
import shootCircle from "../../ai/shoot_circle";
import moveTo from "../../ai/move_to";
import Butterfly from "../../prefabs/enemy/butterfly";
import ClearOrb from "../../prefabs/clear_orb";
import GreenOrb from "../../prefabs/green_orb";
import BlueOrb from "../../prefabs/blue_orb";
import shootRandom from "../../ai/shoot_random";
import {resources} from "../../resources/manager";

function spawnYousei1(color, x, y, dx, dy, drop) {
    entities.push(Yousei('normal', color, x, y, 2,
        moveTo(dx, dy, 2, shootCircle(0, 0, 60, 8, 3, 0,
            360, 16, 10, false, 'rice', color, 0, 0, 0, 2)),
        160, [drop]))
}

function spawnButterfly(entity, color, spyAngle, angleAdd, rAdd, rMax) {
    let ys, xs, ry, r = 0, frame = 0;
    entities.push(Butterfly(color, entity.X, entity.Y, 10, (inst) => {
        r = Math.min(r, rMax);
        ry = spyAngle * L;
        xs = r * Math.cos(ry);
        ys = r * Math.sin(ry);
        inst.X = entity.X + xs;
        inst.Y = entity.Y + ys;
        spyAngle += angleAdd
        r += rAdd
        frame++
    }, entity.getStayTime()).edit(function (inst) {
        inst.toEnvoy(entity)
        inst.addComponent('clearBullet', function () {
            const hitBox = new ABox(5)
            this.tick = function (inst) {
                if (inst.tags.has(TAGS.death)) {
                    clearEntity(function (entity) {
                        if (entity.sizeBox && hitBox.isHit(inst.X, inst.Y, entity.X, entity.Y, entity.sizeBox) && entity.tags.has(TAGS.hostile)) {
                            entities.push(ClearOrb(entity.X, entity.Y, 0, -2, true));
                            return true
                        }
                    }, entities.length)
                }
            }
        })
    }));
}

let _;
const soundOfOption = newAudio(resources.Sounds.option);

function spawnYousei2(color, x, y, drop) {
    entities.push(Yousei('normal', color, x, y, 10,
        batchExecute([shootCircle(0, 60, 360, 5, 3, 0,
            30, 0, 5, true, 'rice', color, 0, 0, 0, 0.5),
            shootCircle(0, 60, 360, 36, 2, 0,
                360, 0, 5, false, 'rice', color, 0, 0, 0, 0.5),
            delayExecute(onceExecute((inst) => {
                spawnButterfly(inst, color, 0, 2, 1, 30)
                spawnButterfly(inst, color, 180, 2, 1, 30)
                soundOfOption.currentTime = 0;
                _ = soundOfOption.play()
            }), 60)]),
        360, [drop]).edit((inst) => {
        inst.showMagicRing()
    }))
}

function spawnYousei3(color, x, y, drop) {
    entities.push(Yousei('normal', color, x, y, 20,
        batchExecute([shootCircle(0, 60, 360, 5, 4, 0,
            30, 0, 5, true, 'rice', color, 0, 0, 0, 0.5),
            shootCircle(0, 60, 360, 36, 3, 0,
                360, 0, 5, false, 'rice', color, 0, 0, 0, 0.5),
            delayExecute(onceExecute((inst) => {
                spawnButterfly(inst, color, 0, 2, 1, 30)
                spawnButterfly(inst, color, 180, 2, 1, 30)
                soundOfOption.currentTime = 0;
                _ = soundOfOption.play()
            }), 60)]),
        360, [drop]).edit((inst) => {
        inst.showMagicRing()
    }))
}

function spawnYousei4(color, x, y, drop) {
    entities.push(Yousei('normal', color, x, y, 30,
        batchExecute([shootRandom(60, 2, 90, 3, 1, 100, 0,
            359, 0, 20, true, 'small', color, 0, 0, 0, 1),
            shootCircle(0, 60, 360, 36, 3, 0,
                360, 0, 1, false, 'rice', color, 0, 0, 0, 1),
            delayExecute(onceExecute((inst) => {
                spawnButterfly(inst, color, 0, 2, 1, 40)
                spawnButterfly(inst, color, 90, 2, 1, 40)
                spawnButterfly(inst, color, 180, 2, 1, 40)
                spawnButterfly(inst, color, 270, 2, 1, 40)
                soundOfOption.currentTime = 0;
                _ = soundOfOption.play()
            }), 60)]),
        360, [drop]).edit((inst) => {
        inst.showMagicRing()
    }))
}

export const testStage6 = () => {
    return new StageItem(new Map([[0, function () {
        changeBGM(ASSETS.SOUND.illusionaryNightGhostlyEyes)
    }], [160, function () {
        spawnYousei4('red', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, BlueOrb(0, 0, 0, -1))
    }], [240, function () {
        spawnYousei4('blue', GUI_SCREEN.X + 50, GUI_SCREEN.Y + 40, BlueOrb(0, 0, 0, -1))
    }], [360, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [380, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [380, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [400, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [420, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [440, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [460, function () {
        spawnYousei2('red', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, GreenOrb(0, 0, 0, -1))
    }], [540, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [560, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [580, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [600, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [620, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [640, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [650, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [680, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [710, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
        spawnYousei2('red', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, GreenOrb(0, 0, 0, -1))
    }], [740, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [770, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [800, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1190, function () {
        spawnYousei2('red', GUI_SCREEN.X + 50, GUI_SCREEN.Y + 40, PowerOrb(0, 0, 0, -1, 'big'))
    }], [1390, function () {
        spawnYousei2('red', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, PowerOrb(0, 0, 0, -1, 'big'))
    }], [1440, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1460, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1480, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1500, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1520, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1540, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1560, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1580, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1600, function () {
        spawnYousei3('red', GUI_SCREEN.X + 50, GUI_SCREEN.Y + 40, PowerOrb(0, 0, 0, -1, 'big'))
        spawnYousei3('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, PowerOrb(0, 0, 0, -1, 'big'))
    }], [1900, function () {
        spawnYousei3('blue', GUI_SCREEN.X + 50, GUI_SCREEN.Y + 40, PowerOrb(0, 0, 0, -1, 'big'))
        spawnYousei3('red', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, PowerOrb(0, 0, 0, -1, 'big'))
    }], [1940, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1960, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [1980, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2000, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2020, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 40, 0, GUI_SCREEN.X + 50, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2040, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 40, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2060, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2080, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2100, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2120, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 150, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2140, function () {
        spawnYousei1('blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 250, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2160, function () {
        spawnYousei1('blue', GUI_SCREEN.X + 50, 0, GUI_SCREEN.X + 100, GUI_SCREEN.Y + 60, PowerOrb(0, 0, 0, -1))
    }], [2180, function () {
        spawnYousei4('blue', GUI_SCREEN.X + 50, GUI_SCREEN.Y + 40, BlueOrb(0, 0, 0, -1))
        spawnYousei4('red', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 50, GUI_SCREEN.Y + 40, BlueOrb(0, 0, 0, -1))
    }], [2280, function () {

    }]]))
}