import {
    getLayer, saveToFile, save, session,
    config,
    continueAllSound,
    entities, EVENT_MAPPING,
    GUI_SCREEN,
    HEIGHT,
    hslToRgb,
    rendererEntity,
    TAGS, tickingEntity,
    updateEntity, saveReplay,
    WIDTH, newAudio, resources, newImage, LAYER_MAPPING
} from "../util.js";
import StageUtil, {STAGE_EVENT} from "../stage_util.js";
import {ob} from "../observer.js";
import Menu, {MenuItem} from "../menu.js";
import {isStopped} from "../prefabs/boss_util.js";

let step = 0;
let _;
const stageMenuEntities = [];
const cache = document.createElement("canvas");
cache.width = 416;
cache.height = 588;
const cacheDraw = cache.getContext("2d");
const bg0302 = newImage(resources.Images.background["03_02"]);
bg0302.addEventListener("load", function () {
    cacheDraw.fillStyle = cacheDraw.createPattern(bg0302, "repeat");
    cacheDraw.fillRect(0, 0, cache.width, cache.height);
});
const enemyMarker = newImage(resources.Images.enemyMarker);
const borderLine = newImage(resources.Images.borderLine);
const bgm = {
    head: newAudio(resources.Sounds.easternNightPractice.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.easternNightPractice.loop, 100, "BGM")
};
const soundOfInvalid = newAudio(resources.Sounds.invalid);
const soundOfOK = newAudio(resources.Sounds.ok);
const soundOfPause = newAudio(resources.Sounds.pause);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
const layerEffect = getLayer(LAYER_MAPPING.EFFECT);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
const layerShade = getLayer(LAYER_MAPPING.SHADE);
export default function SpellPractice(player, stageMap, stageBGM, restartCallBack, seed, record, dialogue = {}, dialogueCloseTimes = []) {
    const inst = StageUtil();
    const pausedMenu = new Menu([
        MenuItem(50, 275, "解除暂停"),
        MenuItem(50, 295, "返回至主菜单"),
        MenuItem(50, 315, "从头开始")
    ], function (selectedIndex) {
        switch (selectedIndex) {
            case 0:
                continueAllSound();
                inst.paused = false;
                break;
            case 1:
                inst.ending();
                inst.tags.add(TAGS.death);
                soundOfOK.currentTime = 0;
                _ = soundOfOK.play();
                return;
            case 2:
                inst.ending();
                inst.tags.add(TAGS.death);
                inst.restart = true;
                inst.restartCallBack = restartCallBack;
                return;
            default:
                soundOfInvalid.currentTime = 0;
                _ = soundOfInvalid.play()
        }
    }, function () {
        return 2
    });
    let runningFrames = 0;
    let timestamp = 0;
    let shade = 0;
    inst.loaded = false;
    inst.failure = false;
    inst.dialogueScript = [];
    inst.boss = [];
    inst.event.addEventListener(STAGE_EVENT.load, function () {
        if (seed) {
            Math.seed = seed
        } else {
            Math.nextSeed()
        }
        session.record = {};
        session.stg.dialogue = {};
        session.stg.dialogueCloseTimes = [];
        session.recording = !!record;
        session.rand = Math.seed;
        session.score = 0;
        session.player = player();
        session.player.power = 400;
        session.practice = false;
        inst.stageMap = stageMap();
        if (session.currentBGM) {
            _ = session.currentBGM.dom.pause();
            _ = session.currentBGM.loop.pause();
        }
        if (stageBGM) {
            if (stageBGM !== true) {
                session.currentBGM = stageBGM
            }
        } else {
            bgm.head.currentTime = 0;
            bgm.loop.currentTime = 0;
            session.currentBGM = {
                dom: bgm.head,
                loop: bgm.loop,
                name: "東方妖怪小町"
            }
        }
    });
    inst.event.addEventListener(STAGE_EVENT.end, function () {
        layerTitle.save();
        layerTitle.font = "19px sans-serif";
        layerTitle.fillStyle = "rgb(255,255,255)";
        layerTitle.fillText("Result", 190, 150);
        layerTitle.fillStyle = "rgb(255,228,84)";
        layerTitle.font = "12px sans-serif";
        layerTitle.fillText(session.score, 200, 170);
        layerTitle.restore();
        if (inst.failure === false) {
            session.player.tick();
        }
        if (session.demoPlay === true) {
            inst.ending();
            inst.tags.add(TAGS.death)
        } else if (isStopped()) {
            inst.ending();
            return
        }
        updateEntity();
        if (session.keys.has("z")) {
            session.keys.delete("z")
        }
    });
    inst.event.addEventListener(STAGE_EVENT.out, function () {
        if (record === undefined) {
            session.record[runningFrames + 180] = runningFrames + 180;
            saveReplay(session.stg, session.rand, session.record)
        }
    });
    let events = [];
    let shift = session.slow;
    inst.addComponent("SpellPractice", function () {
        this.tick = function (inst) {
            if (inst.end === true) {
                return
            }
            if (session.player.tags.has(TAGS.death)) {
                // if (Sounds.failure.paused) {
                //     cancelAllSound();
                //     Sounds.failure.currentTime = 0;
                //     _ = Sounds.failure.play()
                // }
                inst.end = true;
                layerShade.save();
                layerShade.fillStyle = "rgba(255,255,255," + shade + ")";
                if (shade < 1) {
                    shade += 0.004;
                }
                layerShade.fillRect(0, 0, WIDTH, HEIGHT);
                layerShade.restore();
                layerTitle.save();
                layerTitle.font = "15px sans-serif";
                const rgb = hslToRgb(0, 0, 1 - shade);
                layerTitle.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
                layerTitle.fillText("Spell Card Practice Failure...", 110, 225);
                layerTitle.restore();
                inst.failure = true
            } else {
                if (inst.paused) {
                    pausedMenu.tick();
                    pausedMenu.draw()
                } else {
                    if (session.fake) {
                        session.fake = false;
                        session.fakeRect = [Math.random() * 10 - 5, Math.random() * 10 - 5]
                    } else {
                        session.fakeRect = null
                    }
                    if (session.flash) {
                        session.flash = false;
                        session.flashValue = session.flashValue + 0.02 || 0;
                        if (session.flashValue > 1) {
                            session.flashValue = 0
                        }
                    } else {
                        session.flashValue = null
                    }
                    session.player.tick();
                    for (let i = 0; i < inst.boss.length; i++) {
                        inst.boss[i].tick();
                        if (inst.boss[i].dead) {
                            inst.boss.splice(i, 1)
                        }
                    }
                    tickingEntity();
                    if (session.keys.has("escape")) {
                        session.keys.delete("escape");
                        inst.pause();
                        return
                    }
                    runningFrames++;
                    if (record) {
                        const e = record[runningFrames];
                        if (e === runningFrames) {
                            inst.ending();
                            inst.tags.add(TAGS.death);
                            return
                        }
                        if (inst.dialogueScript.length > 0) {
                            session.dialogue = true;
                            if (dialogueCloseTimes[0] === runningFrames) {
                                dialogueCloseTimes.shift();
                                inst.dialogueScript[0].skip();
                                // 快速执行完对话任务，最大程度避免不确定因素造成的回放错误
                                while (inst.dialogueScript.length > 0) {
                                    if (inst.dialogueScript[0].tick()) {
                                        inst.dialogueScript.shift()
                                    }
                                }
                                session.dialogue = false
                            } else {
                                const d = dialogue[runningFrames];
                                if (d) {
                                    if (d.indexOf("next") !== -1) {
                                        inst.dialogueScript[0].next()
                                    }
                                    if (d.indexOf("skip") !== -1) {
                                        inst.dialogueScript[0].skip()
                                    }
                                }
                                if (inst.dialogueScript[0].tick() && inst.dialogueScript.length > 0) {
                                    inst.dialogueScript.shift()
                                }
                                if (entities.length > 0) {
                                    ob.dispatchEvent(EVENT_MAPPING.clearEntity);
                                }
                            }
                        } else if (session.dialogue === true) {
                            session.dialogue = false
                        }
                        if (e) {
                            for (const event of e) {
                                ob.dispatchEvent(event)
                            }
                        }
                    } else {
                        const kb = config.KeyBoard;
                        if (inst.dialogueScript.length > 0) {
                            session.dialogue = true;
                            const dialogue = [];
                            if (session.keys.has(kb.Bomb.toLowerCase())) {
                                session.keys.delete(kb.Bomb.toLowerCase())
                            }
                            if (session.keys.has("z")) {
                                session.keys.delete("z");
                                dialogue.push("next");
                                inst.dialogueScript[0].next()
                            }
                            if (session.keys.has("control")) {
                                dialogue.push("skip");
                                inst.dialogueScript[0].skip()
                            }
                            if (inst.dialogueScript[0].tick() && inst.dialogueScript.length > 0) {
                                inst.dialogueScript.shift()
                            }
                            if (entities.length > 0) {
                                ob.dispatchEvent(EVENT_MAPPING.clearEntity);
                            }
                            if (dialogue && dialogue.length > 0) {
                                session.stg.dialogue[runningFrames] = JSON.parse(JSON.stringify(dialogue))
                            }
                        } else if (session.dialogue === true) {
                            session.dialogue = false;
                            // 对话退出校验戳，用于强制退出Replay对话
                            session.stg.dialogueCloseTimes.push(runningFrames)
                        }
                        events = [];
                        if (shift !== session.slow) {
                            events.push(session.slow ? EVENT_MAPPING.shift : EVENT_MAPPING.unshift);
                            shift = session.slow
                        }
                        if (session.keys.has(kb.Up.toLowerCase())) {
                            if (session.keys.has(kb.Left.toLowerCase())) {
                                events.push(EVENT_MAPPING.upperLeft);
                                ob.dispatchEvent(EVENT_MAPPING.upperLeft)
                            } else if (session.keys.has(kb.Right.toLowerCase())) {
                                events.push(EVENT_MAPPING.upperRight);
                                ob.dispatchEvent(EVENT_MAPPING.upperRight)
                            } else {
                                events.push(EVENT_MAPPING.up);
                                ob.dispatchEvent(EVENT_MAPPING.up)
                            }
                        }
                        if (session.keys.has(kb.Down.toLowerCase())) {
                            if (session.keys.has(kb.Left.toLowerCase())) {
                                events.push(EVENT_MAPPING.lowerLeft);
                                ob.dispatchEvent(EVENT_MAPPING.lowerLeft)
                            } else if (session.keys.has(kb.Right.toLowerCase())) {
                                events.push(EVENT_MAPPING.lowerRight);
                                ob.dispatchEvent(EVENT_MAPPING.lowerRight)
                            } else {
                                events.push(EVENT_MAPPING.down);
                                ob.dispatchEvent(EVENT_MAPPING.down)
                            }
                        }
                        if (!session.keys.has(kb.Up.toLowerCase()) && !session.keys.has(kb.Down.toLowerCase())) {
                            if (session.keys.has(kb.Left.toLowerCase())) {
                                events.push(EVENT_MAPPING.left);
                                ob.dispatchEvent(EVENT_MAPPING.left)
                            }
                            if (session.keys.has(kb.Right.toLowerCase())) {
                                events.push(EVENT_MAPPING.right);
                                ob.dispatchEvent(EVENT_MAPPING.right)
                            }
                        }
                        if (session.keys.has(kb.Shoot.toLowerCase())) {
                            events.push(EVENT_MAPPING.shoot);
                            ob.dispatchEvent(EVENT_MAPPING.shoot)
                        }
                        if (!session.practice && session.keys.has(kb.Bomb.toLowerCase())) {
                            events.push(EVENT_MAPPING.bomb);
                            ob.dispatchEvent(EVENT_MAPPING.bomb)
                        }
                        if (events && events.length > 0) {
                            session.record[runningFrames] = JSON.parse(JSON.stringify(events))
                        }
                    }
                    if (inst.boss.length === 0) {
                        if (inst.stageMap.length === 0) {
                            if (inst.failure === false) {
                                inst.clear();
                            }
                            inst.end = true;
                        } else {
                            if (isStopped() && session.player.bombTime < 1) {
                                inst.boss.push(inst.stageMap.shift())
                            }
                        }
                    }
                    step++;
                    if (step >= 0) {
                        step = -128
                    }
                    timestamp++
                }
            }
        }
    });
    inst.addLayer("SpellPractice", function () {
        this.draw = function (inst) {
            layerStage.save();
            if (session.fakeRect) {
                layerStage.translate(session.fakeRect[0], session.fakeRect[1])
            }
            if (session.flashValue) {
                layerEffect.save();
                layerEffect.fillStyle = "white";
                layerEffect.globalAlpha = session.flashValue;
                layerEffect.fillRect(0, 0, WIDTH, HEIGHT);
                layerEffect.restore()
            }
            layerStage.drawImage(cache, 12.8, 9.6 + step);
            session.player.draw();
            for (let i = 0; i < inst.boss.length; i++) {
                const boss = inst.boss[i];
                boss.draw();
                layerUI.drawImage(enemyMarker, boss.X - enemyMarker.width / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT);
                if (session.debugFlag === true) {
                    if (boss.atkBox && !boss.hide) {
                        if (boss.atkBox.name === "RBox") {
                            layerUI.save();
                            layerUI.strokeStyle = "red";
                            layerUI.strokeRect(boss.X - boss.atkBox.xs / 2, boss.Y - boss.atkBox.ys / 2, boss.atkBox.xs, boss.atkBox.ys);
                            layerUI.restore()
                        } else if (boss.atkBox.name === "ABox") {
                            layerUI.save();
                            layerUI.strokeStyle = "red";
                            layerUI.beginPath();
                            layerUI.arc(boss.X, boss.Y, boss.atkBox.r, 0, Math.PI * 2);
                            layerUI.closePath();
                            layerUI.stroke();
                            layerUI.restore()
                        }
                    }
                }
            }
            rendererEntity();
            if (inst.dialogueScript.length > 0) {
                inst.dialogueScript[0].draw();
            }
            if (timestamp < 300 || inst.paused) {
                layerTitle.save();
                layerTitle.font = "17px sans-serif";
                layerTitle.shadowColor = "black";
                layerTitle.shadowBlur = 2;
                if (timestamp > 200 && !inst.paused) {
                    layerTitle.fillStyle = "rgba(255,255,255," + (1 / (timestamp - 200)) + ")"
                } else {
                    layerTitle.fillStyle = "white"
                }
                layerTitle.fillText("SpellPractice", 174, 144);
                layerTitle.font = "8px Comic Sans MS";
                layerTitle.direction = "rtl";
                layerTitle.fillText("BGM - " + session.currentBGM.name, GUI_SCREEN.X + GUI_SCREEN.WIDTH, 470);
                layerTitle.restore();
            }
            if (inst.paused) {
                layerUI.drawImage(borderLine, GUI_SCREEN.X, GUI_SCREEN.Y + (1 - session.player.pickLine)
                    * GUI_SCREEN.HEIGHT - borderLine.height / 2, GUI_SCREEN.WIDTH, borderLine.height);
                layerShade.save();
                layerShade.fillStyle = "rgba(255,0,10,0.3)";
                layerShade.fillRect(0, 0, WIDTH, HEIGHT);
                layerShade.restore();
                layerTitle.save();
                layerTitle.font = "15px sans-serif";
                layerTitle.fillStyle = "rgb(255,255,255)";
                layerTitle.fillText("游戏暂停", 40, 200);
                layerTitle.restore();
                const length = stageMenuEntities.length;
                for (let i = 0; i < length; i++) {
                    stageMenuEntities[i].draw(stageMenuEntities[i])
                }
            }
            layerStage.restore()
        }
    });

    function showBGM() {
        timestamp = 0
    }

    ob.addEventListener(EVENT_MAPPING.changeBGM, showBGM);
    inst.clear = function () {
        if (session.developerMode === true || record) {
            return
        }
        save.highScore = session.highScore;
        saveToFile(save)
    };
    inst.ending = function () {
        entities.slice(0);
        ob.removeEventListener(EVENT_MAPPING.changeBGM, showBGM);
        session.demoPlay = false;
    };
    inst.callback.pause = function () {
        pausedMenu.load();
        _ = soundOfPause.play()
    };
    return inst
}
