import StageItem from "../../stage_item";
import {batchExecute, delayExecute, entities, GUI_SCREEN} from "../../util";
import Yousei from "../../prefabs/enemy/yousei";
import moveTo from "../../ai/move_to";
import shootCircle from "../../ai/shoot_circle";
import moveLine from "../../ai/move_line";
import BlueOrb from "../../prefabs/blue_orb";
import shootDot from "../../ai/shoot_dot";
import Kedama from "../../prefabs/enemy/kedama";
import {generateRandomSpeed} from "../../components/movable";
import Jade from "../../prefabs/jade";
import {newAudio} from "../../resources/sounds";
import {resources} from "../../resources/manager";
import {spawnMagicRing} from "./util";

let _;
const soundOfBombShoot = newAudio(resources.Sounds.bombShoot);
export const testStage10 = () => {
    return new StageItem(new Map([[60, function () {
        for (let i = 0; i < 4; i++) {
            const x = GUI_SCREEN.X + 42 + i * 64
            const yousei = Yousei('hatted', 'blue', x, -40, 30,
                batchExecute([moveTo(x - 32, GUI_SCREEN.Y + 80, 3,
                    shootCircle(0, 6, 120, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                    delayExecute(moveLine(2, 1), 121)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }
        entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'red', 0, 0, 0, 5), moveLine(2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [120, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'blue', 0, 0, 0, 5), moveLine(-2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [180, function () {
        entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'red', 0, 0, 0, 5), moveLine(2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [240, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'blue', 0, 0, 0, 5), moveLine(-2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [420, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42, 40, 20,
            batchExecute([shootCircle(30, 5, 240, 2, 1, 0,
                30, 0, 60, true, 'ring', 'blue', 0, 0, 0, 5),
                moveLine(-2, 0)]), -1, [BlueOrb(0, 0, 0, -1)]))
    }], [480, function () {
        entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'red', 0, 0, 0, 5), moveLine(2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
        for (let i = 0; i < 4; i++) {
            const x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42 - i * 64
            let yousei = Yousei('hatted', 'green', x, -40, 30,
                batchExecute([moveTo(x + 32, GUI_SCREEN.Y + 80, 3,
                    shootCircle(0, 6, 120, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                    delayExecute(moveLine(-2, 1), 121)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }
    }], [660, function () {
        entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'red', 0, 0, 0, 5), moveLine(2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [780, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'blue', 0, 0, 0, 5), moveLine(-2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [840, function () {
        entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'red', 0, 0, 0, 5), moveLine(2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
        for (let i = 0; i < 4; i++) {
            const x = GUI_SCREEN.X + 42 + i * 64
            const yousei = Yousei('hatted', 'blue', x, -40, 30,
                batchExecute([moveTo(x - 32, GUI_SCREEN.Y + 80, 3,
                    shootCircle(0, 6, 120, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                    delayExecute(moveLine(2, 1), 121)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }
    }], [960, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'blue', 0, 0, 0, 5), moveLine(-2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1020, function () {
        entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 42, 40, 20,
            batchExecute([shootCircle(30, 5, 240, 2, 1, 0,
                30, 0, 60, true,
                'ring', 'red', 0, 0, 0, 5), moveLine(2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
        for (let i = 0; i < 4; i++) {
            const x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42 - i * 64
            let yousei = Yousei('hatted', 'green', x, -40, 30,
                batchExecute([moveTo(x + 32, GUI_SCREEN.Y + 80, 3,
                    shootCircle(0, 6, 120, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                    delayExecute(moveLine(-2, 1), 121)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }
    }], [1080, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42, 40, 20,
            batchExecute([shootDot(30, 5, 240, 60, true,
                'ring', 'blue', 0, 0, 0, 5), moveLine(-2, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1140, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 20 + 10,
            100 - 20, 40,
            batchExecute([shootCircle(3 + 3, 5, 180 + 3, 4,
                1, 0, 60, 0, 60, true,
                'orb', 'red', 0, 0, 0, 5), moveLine(1, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1320, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - 10,
            100 - 20, 40,
            batchExecute([shootCircle(3 + 3, 5, 180 + 3, 4,
                1, 0, 60, 0, 60, true,
                'orb', 'blue', 0, 0, 0, 5), moveLine(-1, 0)]), -1,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1380, function () {
        for (let i = 0; i < 20; i++) {
            const color = i % 2 === 0 ? 'blue' : 'green'
            entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                    3, 36, 396, 0, 60, true,
                    'point', color, 0, 0, 0, 5), moveLine(-5, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [1500, function () {
        for (let i = 0; i < 20; i++) {
            const color = i % 2 === 0 ? 'blue' : 'green'
            entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 1,
                batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                    3, 36, 396, 0, 60, true,
                    'point', color, 0, 0, 0, 5), moveLine(5, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [1800, function () {
        let step = 0, count = 0
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 20 + 10,
            100 - 20, 40,
            (inst) => {
                if (step > 180) {
                    return true
                }
                if (step > 0 && step < 180 && count < 240) {
                    const spawnPoint = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    entities.push(Jade("ring", 'orangered', inst.X, inst.Y, spawnPoint[0], spawnPoint[1]))
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                    count++
                }
                step++
            }, 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1860, function () {
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 20 + 10,
            100 - 20, 40,
            shootCircle(3 + 3, 5, 180 + 3, 4,
                1, 0, 360, 0, 60, true,
                'orb', 'blue', 0, 0, 0, 5), 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1920, function () {
        let step = 0, count = 0
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 20 + 10,
            100 - 20, 40,
            (inst) => {
                if (step > 180) {
                    return true
                }
                if (step > 0 && step < 180 && count < 240) {
                    const spawnPoint = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    entities.push(Jade("ring", 'orangered', inst.X, inst.Y, spawnPoint[0], spawnPoint[1]))
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                    count++
                }
                step++
            }, 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [1980, function () {
        let step = 0, count = 0
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - 20 - 10,
            100 - 20, 40,
            (inst) => {
                if (step > 180) {
                    return true
                }
                if (step > 0 && step < 180 && count < 240) {
                    const spawnPoint = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    entities.push(Jade("ring", 'orangered', inst.X, inst.Y, spawnPoint[0], spawnPoint[1]))
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                    count++
                }
                step++
            }, 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [2100, function () {
        let step = 0, count = 0
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 50,
            100 - 30, 40,
            (inst) => {
                if (step > 180) {
                    return true
                }
                if (step > 0 && step < 180 && count < 240) {
                    const spawnPoint = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    entities.push(Jade("ring", 'orangered', inst.X, inst.Y, spawnPoint[0], spawnPoint[1]))
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                    count++
                }
                step++
            }, 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [2220, function () {
        let step = 0, count = 0
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - 20 - 10,
            100 - 20, 40,
            (inst) => {
                if (step > 180) {
                    return true
                }
                if (step > 0 && step < 180 && count < 240) {
                    const spawnPoint = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    entities.push(Jade("ring", 'orangered', inst.X, inst.Y, spawnPoint[0], spawnPoint[1]))
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                    count++
                }
                step++
            }, 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [2280, function () {
        let step = 0, count = 0
        entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 20 + 10,
            100 - 20, 40,
            (inst) => {
                if (step > 180) {
                    return true
                }
                if (step > 0 && step < 180 && count < 240) {
                    const spawnPoint = generateRandomSpeed(8, 8, -8, undefined, undefined, undefined, 2);
                    entities.push(Jade("ring", 'orangered', inst.X, inst.Y, spawnPoint[0], spawnPoint[1]))
                    soundOfBombShoot.currentTime = 0;
                    _ = soundOfBombShoot.play()
                    count++
                }
                step++
            }, 200,
            [BlueOrb(0, 0, 0, -1)]))
    }], [2700, function () {
        for (let i = 0; i < 20; i++) {
            const color = i % 2 === 0 ? 'blue' : 'green'
            entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 1,
                batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                    3, 36, 396, 0, 60, true,
                    'point', color, 0, 0, 0, 5), moveLine(5, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [2820, function () {
        for (let i = 0; i < 20; i++) {
            const color = i % 2 === 0 ? 'blue' : 'green'
            entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                    3, 36, 396, 0, 60, true,
                    'point', color, 0, 0, 0, 5), moveLine(-5, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [3240, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3300, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 - 64, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 + 64, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3360, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 - 64 - 64, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 + 64, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 + 64 + 64, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3660, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32, 30, 120)
    }], [3680, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 32, GUI_SCREEN.Y + 32 + 32, 30, 120)
    }], [3700, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 64, GUI_SCREEN.Y + 32, 30, 120)
    }], [3720, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 64 + 32, GUI_SCREEN.Y + 32 + 32, 30, 120)
    }], [3740, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 64 * 2, GUI_SCREEN.Y + 32, 30, 120)
    }], [3760, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 64 * 2 + 32, GUI_SCREEN.Y + 32 + 32, 30, 120)
    }], [3880, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + 32, 30, 120)
    }], [3900, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 + 50, GUI_SCREEN.Y + 32 + 50, 30, 120)
    }], [3880, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 + 50 * 2, GUI_SCREEN.Y + 32 + 50 * 2, 30, 120)
    }], [3880, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 + 50 * 3, GUI_SCREEN.Y + 32 + 50 * 3, 30, 120)
    }], [3880, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 + 50 * 4, GUI_SCREEN.Y + 32 + 50 * 4, 30, 120)
    }], [3880, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 + 50 * 5, GUI_SCREEN.Y + 32 + 50 * 5, 30, 120)
    }], [3900, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3920, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3940, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3960, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [3980, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 4, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [4000, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 5, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 5, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50, 30, 120)
    }], [4020, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 6, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 6, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50 * 2, 30, 120)
    }], [4040, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 + 50, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 7, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 7, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50 * 3, 30, 120)
    }], [4060, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50 * 4, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50 * 4, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 8, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 - 50 * 4, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 + 50 * 8, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2 + 50 * 4, 30, 120)
    }], [4180, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
    }], [4300, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [4420, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2, 30, 120)
    }], [4480, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 4, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
    }], [4540, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.HEIGHT - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.HEIGHT - 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.HEIGHT - 32 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.HEIGHT - 32 * 4, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
    }], [4600, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 4, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 3, 30, 120)
    }], [4660, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 4, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 4, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 3, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 4, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 4, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 4, 30, 120)
    }], [4780, function () {
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 2, 30, 120)
    }], [4840, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 * 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + 32 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 2, 30, 120)
    }], [4900, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 2, 30, 120)
    }], [4960, function () {
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 * 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + 32 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 2, 30, 120)
    }], [5020, function () {
        spawnMagicRing(GUI_SCREEN.X + 32 * 2, GUI_SCREEN.Y + 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + 32, GUI_SCREEN.Y + 32 * 2, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32 * 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32, 30, 120)
        spawnMagicRing(GUI_SCREEN.X + GUI_SCREEN.WIDTH - 32, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT - 32 * 2, 30, 120)
    }], [5280, function () {

    }]]))
}