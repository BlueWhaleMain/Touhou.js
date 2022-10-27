import StageItem from "../../stage_item";
import {changeBGM} from "../../resources/sounds";
import {ASSETS} from "../../resources/assets";
import {batchExecute, delayExecute, entities, GUI_SCREEN} from "../../util";
import Yousei from "../../prefabs/enemy/yousei";
import shootDot from "../../ai/shoot_dot";
import moveLine from "../../ai/move_line";
import PowerOrb from "../../prefabs/power_orb";
import BlueOrb from "../../prefabs/blue_orb";
import Kedama from "../../prefabs/enemy/kedama";
import shootCircle from "../../ai/shoot_circle";
import moveTo from "../../ai/move_to";

export const testStage9 = () => {
    return new StageItem(new Map([
        [0, function () {
            changeBGM(ASSETS.SOUND.spiritualDominationWhoDoneIt)
            // self.skipStep(1200, 8)
            // self.skipStep(1600, 16)
        }], [630, function () {
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 20 + i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'red', 0, 0, 0, 5), moveLine(1, 0)]), -1,
                    [PowerOrb(0, 0, 0, -1)]))
            }
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'blue', 0, 0, 0, 5), moveLine(-1, 0)]), -1,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [750, function () {
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 20 + i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'red', 0, 0, 0, 5), moveLine(1, 0)]), -1,
                    [PowerOrb(0, 0, 0, -1)]))
            }
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'blue', 0, 0, 0, 5), moveLine(-1, 0)]), -1,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [870, function () {
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 20 + i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'red', 0, 0, 0, 5), moveLine(1, 0)]), -1,
                    [PowerOrb(0, 0, 0, -1)]))
            }
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'blue', 0, 0, 0, 5), moveLine(-1, 0)]), -1,
                    [BlueOrb(0, 0, 0, -1)]))
            }
        }], [970, function () {
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'red', GUI_SCREEN.X + 20 + i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'red', 0, 0, 0, 5), moveLine(1, 0)]), -1,
                    [PowerOrb(0, 0, 0, -1, i % 2 === 0 ? "middle" : "big")]))
            }
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - i * 10,
                    100 - i * 20, 1,
                    batchExecute([shootDot(30, 5, 240, 60, true,
                        'ring', 'blue', 0, 0, 0, 5), moveLine(-1, 0)]), -1,
                    [BlueOrb(0, 0, 0, -1)]))
            }
        }], [1150, function () {
            for (let i = 0; i < 20; i++) {
                const color = i % 2 === 0 ? 'blue' : 'green'
                entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                    batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                        3, 36, 396, 0, 60, true,
                        'point', color, 0, 0, 0, 5), moveLine(-5, 0)]),
                    300, [BlueOrb(0, 0, 0, -1)]))
            }
        }], [1300, function () {
            for (let i = 0; i < 20; i++) {
                const color = i % 2 === 0 ? 'blue' : 'green'
                entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 1,
                    batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                        3, 36, 396, 0, 60, true,
                        'point', color, 0, 0, 0, 5), moveLine(5, 0)]),
                    300, [BlueOrb(0, 0, 0, -1)]))
            }
        }], [1480, function () {
            for (let i = 0; i < 20; i++) {
                const color = i % 2 === 0 ? 'blue' : 'green'
                entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                    batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                        3, 36, 396, 0, 60, true,
                        'point', color, 0, 0, 0, 5), moveLine(-5, 0)]),
                    300, [BlueOrb(0, 0, 0, -1)]))
            }
        }], [1600, function () {
            for (let i = 0; i < 20; i++) {
                const color = i % 2 === 0 ? 'blue' : 'green'
                entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 1,
                    batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                        3, 36, 396, 0, 60, true,
                        'point', color, 0, 0, 0, 5), moveLine(5, 0)]),
                    300, [BlueOrb(0, 0, 0, -1)]))
            }
        }], [1800, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 40 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 30, 120 + i * 3, 5,
                        5, 0, 180, 0, 4, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [1830, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 60 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 40, 120 + i * 3, 5,
                        5, 0, 90, 0, 4, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [1860, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 50 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 50, 120 + i * 3, 5,
                        5, 0, 45, 0, 5, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [2160, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 40 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 30, 120 + i * 3, 5,
                        5, 0, 180, 0, 4, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [2220, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 60 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 40, 120 + i * 3, 5,
                        5, 0, 90, 0, 4, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [2250, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 50 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 50, 120 + i * 3, 5,
                        5, 0, 45, 0, 5, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [2280, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 60 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 40, 120 + i * 3, 5,
                        5, 0, 90, 0, 4, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [2340, function () {
            for (let i = 0; i < 6; i++) {
                const x = GUI_SCREEN.X + 50 + i * (GUI_SCREEN.WIDTH / 7)
                entities.push(Yousei('hatted', 'blue', x, -40, 3,
                    batchExecute([shootCircle(3 + i * 3, 50, 120 + i * 3, 5,
                        5, 0, 45, 0, 5, true,
                        'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                        moveLine(-2, 1), 120), 120)]), 300,
                    [PowerOrb(0, 0, 0, -1)]))
            }
        }], [2460, function () {
            let yousei = Yousei('hatted', 'blue', GUI_SCREEN.X + 100, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [PowerOrb(0, 0, 0, -1, 'big')])
            yousei.showMagicRing()
            entities.push(yousei)
            yousei = Yousei('hatted', 'blue', GUI_SCREEN.X + 250, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, 6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [2580, function () {
            const yousei = Yousei('hatted', 'red', GUI_SCREEN.X + 100, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'red', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [2880, function () {
            const yousei = Yousei('hatted', 'green', GUI_SCREEN.X + 250, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, 6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [3000, function () {
            const yousei = Yousei('hatted', 'blue', GUI_SCREEN.X + 100, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [PowerOrb(0, 0, 0, -1, 'big')])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [3060, function () {
            const yousei = Yousei('hatted', 'green', GUI_SCREEN.X + 250, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, 6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [3120, function () {
            const yousei = Yousei('hatted', 'blue', GUI_SCREEN.X + 100, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [PowerOrb(0, 0, 0, -1, 'big')])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [3180, function () {
            const yousei = Yousei('hatted', 'green', GUI_SCREEN.X + 250, -40, 30,
                batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 3,
                    shootCircle(0, 6, 370, 6, 2, 0,
                        360, 6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                    delayExecute(moveLine(0, 2), 400)]),
                520, [BlueOrb(0, 0, 0, -1)])
            yousei.showMagicRing()
            entities.push(yousei)
        }], [3300, function () {
            for (let i = 0; i < 4; i++) {
                const x = GUI_SCREEN.X + 42 + i * 64
                const yousei = Yousei('hatted', 'blue', x, -40, 30,
                    batchExecute([moveTo(x - 32, GUI_SCREEN.Y + 80, 3,
                        shootCircle(0, 6, 120, 6, 3, 0,
                            360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                        delayExecute(moveLine(2, 1), 121)]),
                    520, [BlueOrb(0, 0, 0, -1)])
                yousei.showMagicRing()
                entities.push(yousei)
            }
        }], [3340, function () {
            for (let i = 0; i < 4; i++) {
                const x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42 - i * 64
                let yousei = Yousei('hatted', 'green', x, -40, 30,
                    batchExecute([moveTo(x + 32, GUI_SCREEN.Y + 80, 3,
                        shootCircle(0, 6, 120, 6, 3, 0,
                            360, -6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                        delayExecute(moveLine(-2, 1), 121)]),
                    520, [BlueOrb(0, 0, 0, -1)])
                yousei.showMagicRing()
                entities.push(yousei)
            }
        }], [3400, function () {
            for (let i = 0; i < 4; i++) {
                const x = GUI_SCREEN.X + 42 + i * 64
                const yousei = Yousei('hatted', 'blue', x, -40, 30,
                    batchExecute([moveTo(x - 32, GUI_SCREEN.Y + 80, 3,
                        shootCircle(0, 6, 120, 6, 3, 0,
                            360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                        delayExecute(moveLine(2, 1), 121)]),
                    520, [BlueOrb(0, 0, 0, -1)])
                yousei.showMagicRing()
                entities.push(yousei)
            }
        }], [3460, function () {
            for (let i = 0; i < 4; i++) {
                const x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42 - i * 64
                let yousei = Yousei('hatted', 'green', x, -40, 30,
                    batchExecute([moveTo(x + 32, GUI_SCREEN.Y + 80, 3,
                        shootCircle(0, 6, 120, 6, 3, 0,
                            360, -6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                        delayExecute(moveLine(-2, 1), 121)]),
                    520, [BlueOrb(0, 0, 0, -1)])
                yousei.showMagicRing()
                entities.push(yousei)
            }
        }], [3480, function () {
            for (let i = 0; i < 4; i++) {
                const x = GUI_SCREEN.X + GUI_SCREEN.WIDTH - 42 - i * 64
                let yousei = Yousei('hatted', 'green', x, -40, 30,
                    batchExecute([moveTo(x + 32, GUI_SCREEN.Y + 80, 3,
                        shootCircle(0, 6, 120, 6, 3, 0,
                            360, -6, 120, false, 'rice', 'green', 0, 0, 0, 2)),
                        delayExecute(moveLine(-2, 1), 121)]),
                    520, [BlueOrb(0, 0, 0, -1)])
                yousei.showMagicRing()
                entities.push(yousei)
            }
        }], [3780, function () {
            for (let i = 0; i < 4; i++) {
                entities.push(Yousei('hatted', 'blue', GUI_SCREEN.X + 20 + i * 10,
                    100 - i * 20, 40,
                    batchExecute([shootCircle(3 + i * 3, 5, 180 + i * 3, 3,
                        1, 0, 60, 0, 60, true,
                        'orb', 'red', 0, 0, 0, 5), moveLine(1, 0)]), -1,
                    [BlueOrb(0, 0, 0, -1)]))
            }
            for (let i = 0; i < 3; i++) {
                entities.push(Yousei('hatted', 'blue', GUI_SCREEN.WIDTH - i * 10,
                    100 - i * 20, 40,
                    batchExecute([shootCircle(3 + i * 3, 5, 180 + i * 3, 3,
                        1, 0, 60, 0, 60, true,
                        'orb', 'blue', 0, 0, 0, 5), moveLine(-1, 0)]), -1,
                    [BlueOrb(0, 0, 0, -1)]))
            }
        }], [3900, function () {

        }]
    ]))
}