import {
    clearScreen,
    entities,
    getLayer,
    height,
    Images,
    Sounds,
    stopAllSound,
    cancelAllSound,
    continueAllSound,
    width,
    config,
    Tags,
    boss,
    pkg,
    updateEntity,
    rendererEntity
} from "./src/util.js";
import menu_item from "./src/prefabs/menu_item.js";
import menu_star from "./src/prefabs/menu_star.js";
import rumia from "./src/prefabs/player/rumia.js";
import TestStage from "./src/stage/TestStage.js";
import boss_rumia from "./src/prefabs/boss/rumia.js";
import night_bird from "./src/cards/night_bird.js";

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

const customEventLeft = new CustomEvent("left", {
    bubbles: 'true',
    cancelable: 'true'
});
const customEventRight = new CustomEvent("right", {
    bubbles: 'true',
    cancelable: 'true'
});
const customEventUp = new CustomEvent("up", {
    bubbles: 'true',
    cancelable: 'true'
});
const customEventDown = new CustomEvent("down", {
    bubbles: 'true',
    cancelable: 'true'
});
const customEventShoot = new CustomEvent("shoot", {
    bubbles: 'true',
    cancelable: 'true'
});
const customEventBomb = new CustomEvent("bomb", {
    bubbles: 'true',
    cancelable: 'true'
});
const ctx2 = getLayer(2);
let stage, pause = false, end = false, failure = false;

function runSpellPractice() {
    if (stage) {
        if (end) {
            stage.tick();
            stage.draw();
            player.draw();
            ctx2.save();
            ctx2.font = "38px sans-serif";
            ctx2.fillStyle = "rgb(255,255,255)";
            ctx2.fillText("Result", 380, 300);
            ctx2.fillStyle = "rgb(255,228,84)";
            ctx2.font = "25px sans-serif";
            ctx2.fillText(window.score, 400, 340);
            ctx2.restore();
            if (keys.has("z")) {
                end = false;
                loadMainMenu()
            }
            keys.clear();
            rendererGUI(true);
            return
        } else if (boss.length === 0) {
            stage.clear();
            end = true;
            keys.clear();
            return
        }
    } else {
        window.player = rumia(true);
        player.power = 400;
        stage = TestStage();
        boss.push(boss_rumia(440, 300, 8000, {
            60: night_bird(),
            length: 1
        }))
    }
    if (player.tags.has(Tags.death)) {
        // if (Sounds.failure.paused) {
        //     cancelAllSound();
        //     keys.clear();
        //     Sounds.failure.currentTime = 0;
        //     _ = Sounds.failure.play()
        // }
        stage.draw();
        for (let i = 0; i < boss.length; i++) {
            boss[i].draw();
            ctx2.drawImage(Images.enemy_marker, boss[i].X - 36, 942)
        }
        rendererEntity();
        ctx2.save();
        ctx2.fillStyle = "rgba(255,255,255,0.5)";
        ctx2.fillRect(0, 0, width, height);
        ctx2.font = "30px sans-serif";
        ctx2.fillStyle = "rgb(255,255,255)";
        ctx2.fillText("Spell Card Practice Failure...", 220, 200);
        ctx2.restore();
        if (!failure) {
            keys.clear();
            failure = true
        }
        if (keys.has("z")) {
            loadMainMenu();
            failure = false;
            Sounds.ok.currentTime = 0;
            _ = Sounds.ok.play()
        }
        keys.clear();
        rendererGUI(true);
        return
    }
    if (pause) {
        ctx2.drawImage(Images.border_line, 46, (1 - window.player.pickLine) * 940 - 68.6, 786, 157.2);
        ctx2.save();
        ctx2.fillStyle = "rgba(255,0,10,0.4)";
        ctx2.fillRect(0, 0, width, height);
        ctx2.font = "30px sans-serif";
        ctx2.fillStyle = "rgb(255,255,255)";
        ctx2.fillText("游戏暂停", 80, 400);
        ctx2.restore();
        stage.draw(true);
        player.draw();
        for (let i = 0; i < boss.length; i++) {
            boss[i].draw();
            ctx2.drawImage(Images.enemy_marker, boss[i].X - 36, 942)
        }
        rendererEntity();
        stageMenuEntities.forEach(function (g) {
            g.draw(g)
        });
        if (keys.has("ArrowUp".toLowerCase())) {
            stageMenuEntities[selectIndex].leave();
            if (selectIndex > 0) {
                selectIndex--
            } else {
                selectIndex = 2
            }
            stageMenuEntities[selectIndex].select();
            Sounds.select.currentTime = 0;
            _ = Sounds.select.play()
        } else if (keys.has("ArrowDown".toLowerCase())) {
            stageMenuEntities[selectIndex].leave();
            if (selectIndex < 2) {
                selectIndex++
            } else {
                selectIndex = 0
            }
            stageMenuEntities[selectIndex].select();
            Sounds.select.currentTime = 0;
            _ = Sounds.select.play()
        } else if (keys.has("z")) {
            switch (selectIndex) {
                case 0:
                    continueAllSound();
                    pause = false;
                    break;
                case 1:
                    loadMainMenu();
                    Sounds.ok.currentTime = 0;
                    _ = Sounds.ok.play();
                    return;
                case 2:
                    transitions(runSpellPractice);
                    return;
                default:
                    Sounds.invalid.currentTime = 0;
                    _ = Sounds.invalid.play()
            }
        }
        keys.clear();
        updateMenu()
    } else {
        stage.tick();
        stage.draw();
        player.tick();
        player.draw();
        for (let i = 0; i < boss.length; i++) {
            boss[i].tick();
            if (boss[i].dead) {
                boss.splice(i, 1)
            } else {
                boss[i].draw();
                ctx2.drawImage(Images.enemy_marker, boss[i].X - 36, 942)
            }
        }
        const kb = config["KeyBoard"];
        if (keys.has("escape")) {
            loadStageMenu();
            stopAllSound();
            _ = Sounds.pause.play();
            keys.delete("escape");
            pause = true
        }
        if (keys.has(kb["Up"].toLowerCase())) {
            player.div.dispatchEvent(customEventUp)
        }
        if (keys.has(kb["Down"].toLowerCase())) {
            player.div.dispatchEvent(customEventDown)
        }
        if (keys.has(kb["Left"].toLowerCase())) {
            player.div.dispatchEvent(customEventLeft)
        }
        if (keys.has(kb["Right"].toLowerCase())) {
            player.div.dispatchEvent(customEventRight)
        }
        if (keys.has(kb["Shoot"].toLowerCase())) {
            player.div.dispatchEvent(customEventShoot)
        }
        if (keys.has(kb["Bomb"].toLowerCase())) {
            player.div.dispatchEvent(customEventBomb)
        }
        updateEntity()
    }
    rendererGUI(true)
}

let guiBackground;

const ctx = getLayer(0);
const ctx1 = getLayer(1);

function rendererGUI(practice) {
    if (window.player.graze > config["GrazeMax"]) {
        window.player.graze = config["GrazeMax"]
    }
    if (window.score > h_score) {
        window.h_score = window.score
    }
    ctx1.save();
    if (!guiBackground) {
        guiBackground = document.createElement("canvas");
        guiBackground.width = width;
        guiBackground.height = height;
        const guiBackgroundCtx = guiBackground.getContext("2d");
        guiBackgroundCtx.fillStyle = ctx1.createPattern(Images.background["11o26"], "repeat");
        guiBackgroundCtx.fillRect(0, 0, width, height);
        guiBackgroundCtx.shadowBlur = 10;
        guiBackgroundCtx.globalCompositeOperation = "destination-out";
        guiBackgroundCtx.fillStyle = "black";
        guiBackgroundCtx.shadowColor = "black";
        guiBackgroundCtx.roundRect(50, 20, 780, 922, 10).fill();
    }
    ctx1.drawImage(guiBackground, 0, 0);
    ctx1.font = "34px Comic Sans MS";
    ctx1.fillStyle = "white";
    ctx1.shadowColor = "black";
    ctx1.shadowBlur = 5;
    let s = h_score.toString();
    while (s.length < 10) {
        s = "0" + s
    }
    ctx1.fillText("HiScore    " + s, 858, 120);
    s = window.score.toString();
    while (s.length < 10) {
        s = "0" + s
    }
    ctx1.fillText("Score    " + s, 893, 160);
    ctx1.fillText("Player", 884, 198);
    for (let i = 0; i < window.player.player_count; i++) {
        ctx1.drawImage(Images.sidebar.life, 1024 + i * 32, 172, 32, 32)
    }
    ctx1.fillText("Spell", 890, 236);
    for (let i = 0; i < window.player.bomb_count; i++) {
        ctx1.drawImage(Images.sidebar.bomb, 1024 + i * 32, 206, 32, 32)
    }
    if (practice) {
        ctx1.drawImage(Images.spell_practice, 1024, 172, 240, 64)
    }
    ctx1.fillText("Power", 888, 274);
    s = window.player.power.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx1.fillText("Point    " + window.player.point, 906, 312);
    ctx1.fillText("Graze    " + window.player.graze, 890, 350);
    ctx1.fillText(s[0] + ".", 1024, 274);
    ctx1.fillText("/", 1082, 274);
    ctx1.font = "20px Comic Sans MS";
    ctx1.fillText(s.substr(1, 2), 1052, 274);
    s = window.player.power_max.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx1.font = "34px Comic Sans MS";
    ctx1.fillText(s[0] + ".", 1100, 274);
    ctx1.font = "20px Comic Sans MS";
    ctx1.fillText(s.substr(1, 2), 1128, 274);
    ctx1.restore();
}

const gui = require("nw" + ".gui");
//idea划线
const win = gui["Window"].get();

function loadMainMenu() {
    transitions(runMenu);
    mainMenuEntities.push(menu_item(960, 550, "Game Start"));
    mainMenuEntities.push(menu_item(960, 590, "Extra Start"));
    mainMenuEntities.push(menu_item(960, 630, "Spell Practice"));
    mainMenuEntities.push(menu_item(960, 670, "Replay"));
    mainMenuEntities.push(menu_item(960, 710, "Play Data"));
    mainMenuEntities.push(menu_item(960, 750, "Music Room"));
    mainMenuEntities.push(menu_item(960, 790, "Option"));
    mainMenuEntities.push(menu_item(960, 830, "Quit"));
    mainMenuEntities[0].select();
}

function loadStageMenu() {
    stageMenuEntities.splice(0, stageMenuEntities.length);
    stageMenuEntities.push(menu_item(100, 550, "解除暂停"));
    stageMenuEntities.push(menu_item(100, 590, "返回至主菜单"));
    stageMenuEntities.push(menu_item(100, 630, "从头开始"));
    stageMenuEntities[0].select();
}

function runMenu() {
    while (entities.length < 256) {
        entities.push(menu_star(Math.random() * width, Math.random() * height, 0, 0.5, Math.random() * 2));
    }
    if (Sounds.menu.paused) {
        _ = Sounds.menu.play()
    }
    if (Sounds.menu.currentTime > 132.5) {
        Sounds.menu.currentTime = 1
    }
    if (keys.has("ArrowUp".toLowerCase())) {
        mainMenuEntities[selectIndex].leave();
        if (selectIndex > 0) {
            selectIndex--
        } else {
            selectIndex = 7
        }
        mainMenuEntities[selectIndex].select();
        Sounds.select.currentTime = 0;
        _ = Sounds.select.play();
    } else if (keys.has("ArrowDown".toLowerCase())) {
        mainMenuEntities[selectIndex].leave();
        if (selectIndex < 7) {
            selectIndex++
        } else {
            selectIndex = 0
        }
        mainMenuEntities[selectIndex].select();
        Sounds.select.currentTime = 0;
        _ = Sounds.select.play();
    } else if (keys.has("z")) {
        switch (selectIndex) {
            case 2:
                transitions(runSpellPractice);
                Sounds.ok.currentTime = 0;
                _ = Sounds.ok.play();
                return;
            case 7:
                win.close();
                break;
            default:
                Sounds.invalid.currentTime = 0;
                _ = Sounds.invalid.play()
        }
    } else if (keys.has("x")) {
        mainMenuEntities[selectIndex].leave();
        if (selectIndex === 7) {
            win.close();
        } else {
            selectIndex = 7
        }
        mainMenuEntities[selectIndex].select();
        Sounds.cancel.currentTime = 0;
        _ = Sounds.cancel.play();
    }
    keys.clear();
    updateMenu();
    updateEntity()
}

function updateMenu() {
    mainMenuEntities.forEach(function (g) {
        g.draw(g)
    });
}

let restore = false;

function error(e, fatal = false) {
    console.error(e);
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    clearScreen();
    cancelAllSound();
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "red";
    let y = 20;
    if (fatal) {
        ctx.fillText("哦豁，完蛋：", 4, y);
        ctx.fillText("[!]这是一个致命错误", 4, 950)
    } else {
        ctx.drawImage(Images.error, 740, 400);
        ctx.fillText("啊这，发生了一点错误：", 4, y);
        ctx.fillText("按[Z]返回主菜单", 4, 922);
        ctx.fillText("按[Esc]退出", 4, 950);
        restore = true
    }
    e.stack.split("\n").forEach(function (s) {
        y += 20;
        ctx.fillText(s, 4, y)
    });
    ctx.restore();
    keys.clear();
    Sounds.failure.currentTime = 0;
    _ = Sounds.failure.play()
}

const img = document.createElement("img");
img.src = "./assets/images/loading.gif";
img.style.position = "absolute";
img.style.zIndex = "1";
img.style.top = pkg.window.width / 6 + "px";
img.style.left = pkg.window.height / 3 + "px";
img.style.width = pkg.window.width * 0.375 + "px";
img.style.height = pkg.window.height * 11 / 24 + "px";
document.body.appendChild(img);

function transitions(f) {
    cancelAllSound();
    if (typeof f === "function") {
        img.style.display = "block";
        handler = function () {
            loading(f)
        };
        _ = Sounds.loading.play();
    }
    selectIndex = 0;
    pause = false;
    entities.splice(0, entities.length);
    boss.splice(0, boss.length);
    mainMenuEntities.splice(0, mainMenuEntities.length);
    keys.clear();
    if (stage) {
        stage.end();
        stage = null
    }
}

let handler, frames = 0;

function run() {
    try {
        clearScreen();
        handler();
        frames++;
        nextFrame(run)
    } catch (e) {
        error(e)
    }
}

let t = 2, tsp = 0.1;

function loading(f) {
    try {
        clearScreen();
        ctx.save();
        ctx.font = "34px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        if (t) {
            ctx.fillStyle = "rgba(255,255,255," + (1 / t) + ")"
        } else {
            ctx.fillStyle = "white"
        }
        t += tsp;
        if (t > 4) {
            tsp = -0.1
        } else {
            if (t < 2) {
                tsp = 0.1
            }
        }
        ctx.fillText("少女祈祷中...", 1050, 930);
        ctx.font = "20px sans-serif";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        ctx.fillStyle = "white";
        ctx.fillText((window.loading_count / window.loading_total * 100).toFixed() + "%", 0, 958);
        ctx.restore();
        if (window.loading_count === window.loading_total && (Sounds.loading.paused || config["FastStart"])) {
            if (!Sounds.loading.paused) {
                Sounds.loading.pause();
                Sounds.loading.currentTime = 0;
            }
            img.style.display = "none";
            handler = f
        }
    } catch (e) {
        error(e)
    }
}

let n = 1000;

function nextFrame(f) {
    if (isNaN(config["FrameMax"])) {
        requestAnimationFrame(f)
    } else {
        setTimeout(f, n / config["FrameMax"])
    }
}

let selectIndex = 0;
const keys = new Set(), mainMenuEntities = [], stageMenuEntities = [], ignoreKeys = new Set();
let _;

try {
    const requireECS = 768;
    const status = document.createElement("div");
    status.style.position = "absolute";
    status.style.bottom = "0";
    status.style.right = "0";
    status.style.fontSize = "large";
    status.style.zIndex = "65535";
    document.body.append(status);
    const entityCountSecMax = config["EntityCountSecMax"];
    let timestamp = 0;
    if (entityCountSecMax && entityCountSecMax >= requireECS) {
        setInterval(function () {
            const time = new Date().getTime();
            let fps = Math.floor(frames / ((time - timestamp) / 1000)), fpsColor = "green",
                bcs = entities.length, bcsColor = "green";
            if (fps < 20) {
                fpsColor = "red"
            } else if (fps < 40) {
                fpsColor = "orange"
            }
            if (bcs > entityCountSecMax * 3 / 4) {
                bcsColor = "red"
            } else if (bcs > entityCountSecMax / 2) {
                bcsColor = "orange"
            }
            status.innerHTML =
                "<span style='color:" + fpsColor + "'>" + fps + "FPS</span>" +
                "<span style='color:white'>/</span>" +
                "<span style='color:" + bcsColor + "'>" + bcs + "ECS</span>";
            timestamp = time;
            if (config["FrameMax"] !== frames) {
                n = 1000 * frames / config["FrameMax"]
            }
            frames = 0;
        }, 1000);
        document.addEventListener("keydown", function (e) {
            e = e || window["event"];
            const key = e.key.toLowerCase();
            if (ignoreKeys.has(key)) {
                return
            } else {
                ignoreKeys.add(key)
            }
            keys.add(key);
            if (key === config["KeyBoard"]["Slow"].toLowerCase()) {
                window.slow = true
            }
            if (restore) {
                if (key === "z") {
                    restore = false;
                    loadMainMenu();
                    Sounds.ok.currentTime = 0;
                    _ = Sounds.ok.play();
                    nextFrame(run)
                } else {
                    if (key === "escape") {
                        win.close()
                    }
                }
            }
        });
        document.addEventListener("keyup", function (e) {
            e = e || window["event"];
            const key = e.key.toLowerCase();
            if (ignoreKeys.has(key)) {
                ignoreKeys.delete(key)
            }
            keys.delete(key);
            if (key === config["KeyBoard"]["Slow"].toLowerCase()) {
                window.slow = false
            }
        });
        loadMainMenu();
        nextFrame(run)
    } else {
        error(new Error("配置达不到最低要求：ECSMax(EntityCountSecMax) = " + entityCountSecMax + "，至少需要" + requireECS), true)
    }
} catch (e) {
    console.log(e);
    if (confirm(e.message)) {
        win.close();
    }
}
