import StageItem from "../../stage_item";
import {batchExecute, entities, GUI_SCREEN, randomPos} from "../../util";
import Yousei from "../../prefabs/enemy/yousei";
import PowerOrb from "../../prefabs/power_orb";
import moveLine from "../../ai/move_line";
import shootCircle from "../../ai/shoot_circle";
import Kedama from "../../prefabs/enemy/kedama";
import BlueOrb from "../../prefabs/blue_orb";
import Butterfly from "../../prefabs/enemy/butterfly";
import {generateRandomSpeed} from "../../components/movable";
import Jade from "../../prefabs/jade";

let seed = 1145141919810

function randomYousei(color) {
    const pos = randomPos(0, 0, 40, -320, seed)
    seed = pos[2]
    entities.push(Yousei('normal', color, pos[0], pos[1], 2,
        shootCircle(0, 10, 60, 8, 3, 0,
            360, 16, 10, false, 'ice', 'aqua', 0, 0, 0, 2),
        60, [PowerOrb(0, 0, 0, -1)]))
}

function randomButterfly(color) {
    const drops = []
    for (let i = 0; i < 16; i++) {
        const speed = generateRandomSpeed(6, 6, -6, undefined, undefined,
            undefined, 2);
        drops.push(Jade("point", color, 0, 0, speed[0], speed[1], undefined, false));
    }
    const pos = randomPos(0, 0, 0, 0, seed)
    let randomMX = Math.nextSeed(pos[2]) * 2 - 1
    if (randomMX > 0 && pos[0] > GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2 || randomMX < 0 && pos[0] < GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2) {
        randomMX = -randomMX
    }
    seed = Math.abs(randomMX)
    entities.push(Butterfly(color, pos[0], GUI_SCREEN.Y, 3, moveLine(randomMX, 2), -1, drops))
}

export const testStage4 = () => {
    return new StageItem(new Map([[0, function () {
    }], [0, function () {
        for (let i = 0; i < 9; i++) {
            randomButterfly('blue')
        }
    }], [30, function () {
        for (let i = 0; i < 9; i++) {
            randomButterfly('blue')
        }
    }], [60, function () {
        for (let i = 0; i < 9; i++) {
            randomButterfly('blue')
        }
    }], [90, function () {
        randomYousei('blue')
    }], [100, function () {
        randomYousei('blue')
    }], [110, function () {
        randomYousei('blue')
    }], [120, function () {
        randomYousei('blue')
    }], [130, function () {
        randomYousei('blue')
    }], [140, function () {
        randomYousei('blue')
    }], [150, function () {
        randomYousei('blue')
    }], [160, function () {
        randomYousei('blue')
    }], [550, function () {
        entities.push(Yousei('normal', 'red', GUI_SCREEN.X, GUI_SCREEN.Y + 16, 10,
            batchExecute([shootCircle(10, 10, 300, 9, 3, 0,
                360, 1, 10, true, 'ice', 'aqua', 0, 0, 0, 2), moveLine(1.5, 0.5)]),
            -1, [PowerOrb(0, 0, 0, -1)]))
        entities.push(Yousei('normal', 'red', GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + 16, 10,
            batchExecute([shootCircle(10, 10, 300, 9, 3, 0,
                360, 1, 10, true, 'ice', 'aqua', 0, 0, 0, 2), moveLine(-1.5, 0.5)]),
            -1, [PowerOrb(0, 0, 0, -1)]))
    }], [750, function () {
        entities.push(Yousei('normal', 'red', GUI_SCREEN.X, GUI_SCREEN.Y + 16, 10,
            batchExecute([shootCircle(10, 10, 300, 9, 3, 0,
                360, 1, 10, true, 'ice', 'aqua', 0, 0, 0, 2), moveLine(2, 1)]),
            -1, [PowerOrb(0, 0, 0, -1)]))
        entities.push(Yousei('normal', 'red', GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + 16, 10,
            batchExecute([shootCircle(10, 10, 300, 9, 3, 0,
                360, 1, 10, true, 'ice', 'aqua', 0, 0, 0, 2), moveLine(-2, 1)]),
            -1, [PowerOrb(0, 0, 0, -1)]))
    }], [860, function () {
        for (let i = 0; i < 20; i++) {
            const color = i % 2 === 0 ? 'blue' : 'green'
            entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                    2, 0, 360, 0, 10, true,
                    'rice', color, 0, 0, 0, 4), moveLine(-4, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [1060, function () {
        for (let i = 0; i < 20; i++) {
            const color = i % 2 === 0 ? 'yellow' : 'red'
            entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 2,
                batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                    2, 0, 360, 0, 10, true,
                    'rice', 'red', 0, 0, 0, 4), moveLine(4, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [1260, function () {
        for (let i = 0; i < 6; i++) {
            randomButterfly('red')
            randomYousei('red')
        }
    }], [1560, function () {
        for (let i = 0; i < 9; i++) {
            randomButterfly('red')
            randomYousei('red')
        }
    }], [1860, function () {
        for (let i = 0; i < 9; i++) {
            randomButterfly('red')
            randomYousei('red')
        }
    }], [2060, function () {
        for (let i = 0; i < 9; i++) {
            randomButterfly('red')
            randomYousei('red')
        }
    }], [2380, function () {

    }]]))
}