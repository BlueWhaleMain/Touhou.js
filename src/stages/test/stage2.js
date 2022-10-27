import StageItem from "../../stage_item";
import {batchExecute, delayExecute, entities, GUI_SCREEN} from "../../util";
import Yousei from "../../prefabs/enemy/yousei";
import shootDot from "../../ai/shoot_dot";
import moveLine from "../../ai/move_line";
import PowerOrb from "../../prefabs/power_orb";
import BlueOrb from "../../prefabs/blue_orb";
import Kedama from "../../prefabs/enemy/kedama";
import moveTo from "../../ai/move_to";
import shootCircle from "../../ai/shoot_circle";
import Player1Clear from "../../prefabs/player_1clear";

export const testStage2 = () => {
    return new StageItem(new Map([[1, function (self, inst) {
        if (inst.getLastFrames() > 6000) {
            self.skipStep(400, 1)
        }
    }], [100, function () {
        for (let i = 0; i < 16; i++) {
            entities.push(Yousei('normal', 'red', -i * 20, 70, 1,
                batchExecute([shootDot(20 + i * 6, 10, 60 + 8 * 20, 3,
                    false, 'point', 'dimgray', 0, 0, 0, 2), moveLine(3, 0)]),
                300, [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Yousei('normal', 'red', -i * 20, 90, 1,
                batchExecute([shootDot(20 + i * 6, 10, 60 + 8 * 20, 3,
                    true, 'point', 'dimgray', 0, 0, 0, 2), moveLine(3, 0)]),
                300, [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Yousei('normal', 'red', -i * 20, 110, 1,
                batchExecute([shootDot(20 + i * 6, 10, 60 + 8 * 20, 3,
                    false, 'point', 'dimgray', 0, 0, 0, 2), moveLine(3, 0)]),
                300, [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Yousei('normal', 'blue',
                GUI_SCREEN.X + GUI_SCREEN.WIDTH + i * 20, 70, 1,
                batchExecute([shootDot(20 + i * 6, 10, 60 + 8 * 20, 3,
                    false, 'point', 'dimgray', 0, 0, 0, 2), moveLine(-3, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Yousei('normal', 'blue',
                GUI_SCREEN.X + GUI_SCREEN.WIDTH + i * 20, 90, 1,
                batchExecute([shootDot(20 + i * 6, 10, 60 + 8 * 20, 3,
                    true, 'point', 'dimgray', 0, 0, 0, 2), moveLine(-3, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Yousei('normal', 'blue',
                GUI_SCREEN.X + GUI_SCREEN.WIDTH + i * 20, 110, 1,
                batchExecute([shootDot(20 + i * 6, 10, 60 + 8 * 20, 3,
                    false, 'point', 'dimgray', 0, 0, 0, 2), moveLine(-3, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [600, function () {
        for (let i = 0; i < 16; i++) {
            entities.push(Kedama('red', -i * 20, 70 + i % 4 * 10, 1,
                batchExecute([shootDot(10 + i * 8, 1, 60 + 8 * 20, 1,
                    2 % i === 0, 'point', 'dimgray', 0, 0, 0, 1), moveLine(4, 0)]),
                300, [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Kedama('red', -i * 20, 100 - i % 4 * 10, 1,
                batchExecute([shootDot(10 + i * 8, 1, 60 + 8 * 20, 1,
                    2 % i === 0, 'point', 'dimgray', 0, 0, 0, 1), moveLine(4, 0)]),
                300, [PowerOrb(0, 0, 0, -1)]))
        }
    }], [800, function () {
        for (let i = 0; i < 16; i++) {
            entities.push(Kedama('blue',
                GUI_SCREEN.X + GUI_SCREEN.WIDTH + i * 20, 70 + i % 4 * 10, 1,
                batchExecute([shootDot(10 + i * 8, 1, 60 + 8 * 20, 1,
                    2 % i === 0, 'point', 'dimgray', 0, 0, 0, 1), moveLine(-4, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 16; i++) {
            entities.push(Kedama('blue',
                GUI_SCREEN.X + GUI_SCREEN.WIDTH + i * 20, 100 - i % 4 * 10, 1,
                batchExecute([shootDot(10 + i * 8, 1, 60 + 8 * 20, 1,
                    2 % i === 0, 'point', 'dimgray', 0, 0, 0, 1), moveLine(-4, 0)]),
                300, [BlueOrb(0, 0, 0, -1)]))
        }
    }], [1000, function () {
        let yousei = Yousei('hatted', 'red', 0, GUI_SCREEN.Y + 100, 10,
            batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 2,
                shootCircle(0, 48, 170, 30, 3, 0,
                    360, 0, 3, true, 'point', 'dimgray', 0, 0, 0, 2)),
                delayExecute(moveLine(2, 0), 300)]),
            500, [PowerOrb(0, 0, 0, -1, 'big'),
                Player1Clear(0, 0)])
        yousei.showMagicRing()
        entities.push(yousei)
        yousei = Yousei('hatted', 'blue',
            GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + 100, 10,
            batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 2,
                shootCircle(0, 48, 170, 30, 3, 0,
                    360, 0, 3, true, 'point', 'dimgray', 0, 0, 0, 2)),
                delayExecute(moveLine(-2, 0), 300)]),
            500, [BlueOrb(0, 0, 0, -1), Player1Clear(0, 0)])
        yousei.showMagicRing()
        entities.push(yousei)
    }], [1300, function () {

    }]]))
}