import {
    getLayer, saveToFile, profile, session,
    options,
    continueAllSound,
    entities, EVENT_MAPPING,
    GUI_SCREEN,
    HEIGHT,
    hslToRgb,
    rendererEntity,
    TAGS, tickingEntity,
    updateEntity, saveReplay,
    WIDTH, newAudio, resources, newImage, LAYER_MAPPING, changeBGM, AUTO_HINT, saveHint, cancelAllSound, HINT_VER
} from "../util.js";
import StageUtil, {STAGE_EVENT} from "../stage_util.js";
import {ob} from "../observer.js";
import Menu, {MenuItem} from "../menu.js";
import {isStopped} from "../prefabs/boss_util.js";

const fs = require("fs");
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
    loop: newAudio(resources.Sounds.easternNightPractice.loop, 100, "BGM"),
    name: "東方妖怪小町"
};
const failure = {
    head: newAudio(resources.Sounds.failure.head, 100, "BGM"),
    loop: newAudio(resources.Sounds.failure.loop, 100, "BGM"),
    name: "プレイヤーズスコア",
};
const soundOfInvalid = newAudio(resources.Sounds.invalid);
const soundOfOK = newAudio(resources.Sounds.ok);
const soundOfPause = newAudio(resources.Sounds.pause);
const soundOfHint = newAudio(resources.Sounds.hint);
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerUI = getLayer(LAYER_MAPPING.UI);
const layerEffect = getLayer(LAYER_MAPPING.EFFECT);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
const layerShade = getLayer(LAYER_MAPPING.SHADE);
export default function SpellPractice(menu, selectedIndex, player, stageMap, stageBGM, restartCallBack, replayOption) {
    const rand = replayOption?.rand, eventList = replayOption?.eventList ?? [],
        dialogue = replayOption?.stg?.dialogue ?? [],
        dialogueCloseTimes = replayOption?.stg?.dialogueCloseTimes ?? [];
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
                inst.end = true;
                session.keys.add("z");
                soundOfOK.currentTime = 0;
                _ = soundOfOK.play();
                return;
            case 2:
                inst.end = true;
                session.keys.add("z");
                inst.restart = true;
                inst.restartCallBack = restartCallBack;
                return;
            default:
                soundOfInvalid.currentTime = 0;
                _ = soundOfInvalid.play()
        }
    }, function () {
        return 2
    }, function (self) {
        if (session.keys.has("r")) {
            session.keys.delete("r");
            self.selectedIndex = 2;
            session.keys.add("z")
        }
    });
    let runningFrames = 0;
    let timestamp = 0;
    let shade = 0;
    let hints = [];
    let record;
    inst.loaded = false;
    inst.failure = false;
    inst.dialogueScript = [];
    inst.boss = [];
    inst.event.addEventListener(STAGE_EVENT.load, function () {
        if (options.Hint.mode === "auto" && !replayOption) {
            ob.addEventListener(EVENT_MAPPING.miss, autoSaveHint);
        }
        ob.addEventListener(EVENT_MAPPING.changeBGM, showBGM);
        if (options.Hint.mode === "auto" || options.Hint.mode === "on") {
            const files = fs.readdirSync(options.Hint.path);
            const filesLen = files.length;
            for (let i = 0; i < filesLen; i++) {
                if (/^.+\.json$/.test(files[i].toLowerCase())) {
                    let hint = JSON.parse(fs.readFileSync(options.Hint.path + "/" + files[i]).toString());
                    if (hint.HINT_VER === HINT_VER) {
                        hint = hint.hint;
                        if (menu === hint.menu && selectedIndex === hint.selectedIndex) {
                            hints.push(hint)
                        }
                    }
                }
            }
        }
        if (rand) {
            Math.seed = rand
        } else {
            Math.nextSeed()
        }
        record = {
            rand: Math.seed,
            stg: {
                menu,
                selectedIndex,
                player: player.name,
                DeveloperMode: options.DeveloperMode,
                dialogue: {},
                dialogueCloseTimes: []
            },
            eventList: []
        };
        session.replaying = !!replayOption;
        session.score = 0;
        session.player = player();
        session.player.power = 400;
        session.practice = false;
        inst.stageMap = stageMap();
        if (stageBGM) {
            if (stageBGM !== true) {
                changeBGM(stageBGM)
            }
        } else {
            changeBGM(bgm)
        }
    });
    inst.event.addEventListener(STAGE_EVENT.end, function () {
        session.maxMutex = 1;
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
            inst.end = true;
            session.keys.add("z");
            return
        } else if (isStopped()) {
            entities.slice(0);
            return
        }
        updateEntity();
        if (session.keys.has("z")) {
            session.keys.delete("z")
        }
    });
    inst.event.addEventListener(STAGE_EVENT.out, function () {
        if (replayOption === undefined && confirm("Save replay?")) {
            record.stg.score = session.score;
            record.stg.totalFrames = runningFrames;
            record.stg.totalTs = new Date().valueOf() - ts;
            record.eventList[runningFrames + 1] = runningFrames + 1;
            saveReplay(prompt("ReplayName:"), record.stg, record.rand, record.eventList)
        }
        if (session.demoPlay) {
            session.demoPlay = false
        } else {
            cancelAllSound()
        }
        ob.removeEventListener(EVENT_MAPPING.miss, autoSaveHint);
        ob.removeEventListener(EVENT_MAPPING.changeBGM, showBGM)
    });
    let ts, shift = session.slow;
    inst.addComponent("SpellPractice", function () {
        this.tick = function (inst) {
            if (!ts) {
                ts = new Date().valueOf()
            }
            if (inst.end === true) {
                return
            }
            if (session.player.tags.has(TAGS.death)) {
                changeBGM(failure);
                session.keys.delete("z");
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
                    const length = hints.length;
                    for (let i = 0; i < length; i++) {
                        const hint = hints[i];
                        if (runningFrames >= hint.runningFrames && runningFrames < hint.runningFrames + hint.Delay) {
                            if (soundOfHint.paused) {
                                _ = soundOfHint.play();
                            }
                            break
                        }
                    }
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
                    if (replayOption) {
                        if (session.keys.has("control")) {
                            if (session.maxMutex < options.MaxMutex) {
                                session.maxMutex++
                            }
                        } else {
                            session.maxMutex = 1
                        }
                        const e = eventList[runningFrames];
                        if (e === runningFrames) {
                            inst.end = true;
                            session.keys.add("z");
                            return
                        }
                        if (inst.dialogueScript.length > 0) {
                            const d = dialogue[runningFrames];
                            if (d) {
                                if (d.indexOf("next") >= 0) {
                                    inst.dialogueScript[0].next()
                                }
                                if (d.indexOf("skip") >= 0) {
                                    inst.dialogueScript[0].skip()
                                }
                            }
                            if (inst.dialogueScript[0].tick() && inst.dialogueScript.length > 0) {
                                inst.dialogueScript.shift()
                            }
                            if (entities.length > 0) {
                                ob.dispatchEvent(EVENT_MAPPING.clearEntity);
                            }
                            if (dialogueCloseTimes[0] <= runningFrames) {
                                dialogueCloseTimes.shift();
                                // 快速执行完对话任务，最大程度避免不确定因素造成的回放错误
                                // 回放问题待解决
                                while (inst.dialogueScript.length > 0) {
                                    inst.dialogueScript[0].skip();
                                    if (inst.dialogueScript[0].tick()) {
                                        inst.dialogueScript.shift()
                                    }
                                }
                            }
                        } else if (dialogueCloseTimes[0] <= runningFrames) {
                            // runningFrames = dialogueCloseTimes[0];
                            dialogueCloseTimes.shift()
                        }
                        if (e) {
                            for (const event of e) {
                                ob.dispatchEvent(event)
                            }
                        }
                    } else {
                        const kb = options.KeyBoard;
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
                                record.stg.dialogue[runningFrames] = JSON.parse(JSON.stringify(dialogue))
                            }
                        } else if (session.dialogue === true) {
                            session.dialogue = false;
                            // 对话退出校验戳，用于强制退出Replay对话
                            record.stg.dialogueCloseTimes.push(runningFrames)
                        }
                        const events = [];
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
                            ob.dispatchEvent(EVENT_MAPPING.shoot);
                            if (options.ShootSlow === true && session.slow === false) {
                                session.slow = true;
                                if (events.indexOf(EVENT_MAPPING.shift) >= 0) {
                                    events.push(EVENT_MAPPING.shift)
                                }
                            }
                        } else {
                            if (options.ShootSlow === true && session.slow === true) {
                                session.slow = false;
                                if (events.indexOf(EVENT_MAPPING.unshift) >= 0) {
                                    events.push(EVENT_MAPPING.unshift)
                                }
                            }
                        }
                        if (!session.practice && session.keys.has(kb.Bomb.toLowerCase())) {
                            events.push(EVENT_MAPPING.bomb);
                            ob.dispatchEvent(EVENT_MAPPING.bomb)
                        }
                        if (shift !== session.slow) {
                            events.push(session.slow ? EVENT_MAPPING.shift : EVENT_MAPPING.unshift);
                            shift = session.slow
                        }
                        if (events && events.length > 0) {
                            record.eventList[runningFrames] = JSON.parse(JSON.stringify(events))
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
            layerStage.drawImage(cache, 12.8, 9.6 + step);
            if (session.flashValue) {
                layerEffect.save();
                layerEffect.fillStyle = "white";
                layerEffect.globalAlpha = session.flashValue;
                layerEffect.fillRect(0, 0, WIDTH, HEIGHT);
                layerEffect.restore()
            }
            session.player.draw();
            for (let i = 0; i < inst.boss.length; i++) {
                const boss = inst.boss[i];
                boss.draw();
                layerTitle.drawImage(enemyMarker, inst.paused ? 48 : 0, 0, 48, 16, boss.X - 15, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT, 30, 10);
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
                layerTitle.fillText("BGM - " + session.currentBGM?.name ?? "N/A",
                    GUI_SCREEN.X + GUI_SCREEN.WIDTH, 470);
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
            layerUI.save();
            const length = hints.length;
            for (let i = 0; i < length; i++) {
                const hint = hints[i];
                if (runningFrames >= hint.runningFrames && runningFrames < hint.runningFrames + hint.Delay) {
                    layerUI.fillStyle = hint.fillStyle;
                    layerUI.font = hint.font || "8px sans-serif";
                    const t = layerUI.measureText(hint.Text);
                    layerUI.fillText(hint.Text, hint.X - t.width / 2, hint.Y)
                }
            }
            layerUI.restore();
            // 语境作用域，不要随便移动
            layerStage.restore()
        }
    });

    function showBGM() {
        timestamp = 0
    }

    function autoSaveHint() {
        saveHint(AUTO_HINT, new Date().valueOf(), {
            menu,
            selectedIndex,
            runningFrames,
            __comment: "This file is generated automatically and will be overwritten automatically.\n" +
                "Use a different file name when you need to build your own attack using Hint.",
            Text: "Caution!",
            X: session.player.X,
            Y: session.player.Y,
            Delay: 300,
            fillStyle: "rgb(255,128,128)"
        })
    }

    inst.clear = function () {
        if (session.developerMode === true || replayOption) {
            return
        }
        profile.highScore = session.highScore;
        saveToFile(profile)
    };
    inst.callback.pause = function () {
        if (replayOption) {
            inst.end = true;
            session.keys.add("z")
        } else {
            pausedMenu.load();
            _ = soundOfPause.play()
        }
    };
    return inst
}
