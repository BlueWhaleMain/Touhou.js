import StageItem from "../../stage_item";
import {batchExecute, entities, GUI_SCREEN, randomPos, session} from "../../util";
import {changeBGM} from "../../resources/sounds";
import {ASSETS} from "../../resources/assets";
import Yousei from "../../prefabs/enemy/yousei";
import moveTo from "../../ai/move_to";
import shootDot from "../../ai/shoot_dot";
import PowerOrb from "../../prefabs/power_orb";
import moveLine from "../../ai/move_line";

export const testStage1 = () => {
    return new StageItem(new Map([[0, function () {
        session.player.power = 0
        changeBGM(ASSETS.SOUND.aSoulAsScarletAsAgroundCherry)
    }], [600, function () {
        for (let i = 0; i < 8; i++) {
            const pos = randomPos(0, -GUI_SCREEN.Y - 40, 40, -320)
            entities.push(Yousei('normal', 'red', pos[0], pos[1], 1,
                moveTo(GUI_SCREEN.X + 200, GUI_SCREEN.Y + 100, 1,
                    shootDot(60, 1, 70, 1, false, 'point', 'dimgray',
                        0, 0, 0, 2), 60), 300, [PowerOrb(0, 0, 0, -1)]))
        }
    }], [800, function () {
        for (let i = 0; i < 8; i++) {
            const pos = randomPos(0, -GUI_SCREEN.Y - 40, 40, -320)
            entities.push(Yousei('normal', 'red', pos[0], pos[1], 1,
                moveTo(GUI_SCREEN.X + 200, GUI_SCREEN.Y + 100, 1,
                    shootDot(60, 1, 70, 1, false, 'point', 'dimgray',
                        0, 0, 0, 2), 60), 300, [PowerOrb(0, 0, 0, -1)]))
        }
    }], [1000, function () {
        for (let i = 0; i < 8; i++) {
            const pos = randomPos(0, -GUI_SCREEN.Y - 40, 40, -320)
            entities.push(Yousei('normal', 'red', pos[0], pos[1], 1,
                moveTo(GUI_SCREEN.X + 200, GUI_SCREEN.Y + 100, 1,
                    shootDot(60, 1, 70, 1, false, 'point', 'dimgray',
                        0, 0, 0, 2), 60), 300, [PowerOrb(0, 0, 0, -1)]))
        }
    }], [1200, function () {
        for (let i = 0; i < 8; i++) {
            entities.push(Yousei('normal', 'red', GUI_SCREEN.X + 20 + i * 20,
                40 + i % 4 * 10, 1,
                batchExecute([shootDot(60, 1, 70, 1, true,
                    'point', 'dimgray', 0, 0, 0, 2), moveLine(0, 1)]), -1,
                [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 8; i++) {
            entities.push(Yousei('normal', 'red', GUI_SCREEN.X + 220 + i * 20,
                40 + i % 4 * 10, 1,
                batchExecute([shootDot(60, 1, 70, 1, true,
                    'point', 'dimgray', 0, 0, 0, 2), moveLine(0, 1)]), -1,
                [PowerOrb(0, 0, 0, -1)]))
        }
    }], [1400, function () {
        for (let i = 0; i < 8; i++) {
            entities.push(Yousei('normal', 'red', GUI_SCREEN.X + 20 + i * 20,
                40 + i % 4 * 10, 1,
                batchExecute([shootDot(60, 1, 70, 1, true,
                    'point', 'dimgray', 0, 0, 0, 2), moveLine(0, 1)]), -1,
                [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 8; i++) {
            entities.push(Yousei('normal', 'red', GUI_SCREEN.X + 220 + i * 20,
                40 + i % 4 * 10, 1,
                batchExecute([shootDot(60, 1, 70, 1, true,
                    'point', 'dimgray', 0, 0, 0, 2), moveLine(0, 1)]), -1,
                [PowerOrb(0, 0, 0, -1)]))
        }
    }], [1600, function () {
        for (let i = 0; i < 8; i++) {
            entities.push(Yousei('normal', 'red', GUI_SCREEN.X + 20 + i * 20,
                40 + i % 4 * 10, 1,
                batchExecute([shootDot(60, 1, 70, 1, true,
                    'point', 'dimgray', 0, 0, 0, 2), moveLine(0, 1)]), -1,
                [PowerOrb(0, 0, 0, -1)]))
        }
        for (let i = 0; i < 8; i++) {
            entities.push(Yousei('normal', 'red', GUI_SCREEN.X + 220 + i * 20,
                40 + i % 4 * 10, 1,
                batchExecute([shootDot(60, 1, 70, 1, true,
                    'point', 'dimgray', 0, 0, 0, 2), moveLine(0, 1)]), -1,
                [PowerOrb(0, 0, 0, -1)]))
        }
    }], [1980, function () {

    }]]))
}