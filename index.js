import {
    arrowTo,
    clearScreen,
    entities,
    getLayer,
    height,
    Images,
    Sounds,
    transTo,
    stopAllSound,
    cancelAllSound,
    continueAllSound,
    L,
    width,
    config,
    save,
    updateEntity,
    rendererEntity
} from "./src/util.js";
import menu_item from "./src/prefabs/menu_item.js";
import menu_star from "./src/prefabs/menu_star.js";
import jade from "./src/prefabs/jade.js";
import rumia from "./src/prefabs/rumia.js";

const gui = require("nw" + ".gui");
//idea划线
const win = gui["Window"].get();
let _;

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

let step = 0;

function AbstractStage() {
    this.option = {};
    this.stage = {};
    this.musicLoop = 0;
    this.musicIn = 0;
    this.backgroundIn = 0;
    let timestamp = 0;
    this.step_speed = 1;
    this.show_title = function (layer, t) {
    };
    this.title_delay = 300;
    this.canPlay = true;
    this.draw = function () {
        const ctx = getLayer(0);
        ctx.save();
        if (this.background) {
            ctx.drawImage(this.background, 12.8, 9.6 + step)
        }
        if (timestamp < this.title_delay) {
            this.show_title(getLayer(2), timestamp)
        }
        if (player) {
            player.draw()
        }
        ctx.restore();
        if (this.option.draw) {
            this.option.draw()
        }
    };
    this.tick = function () {
        if (this.option.tick) {
            this.option.tick()
        }
        player.tick();
        this.draw();
        step += this.step_speed;
        if (this.backgroundLoop !== undefined && step >= this.backgroundLoop) {
            step = this.backgroundIn
        }
        if (this.music.paused && this.canPlay) {
            _ = this.music.play()
        }
        if (this.musicLoop && this.music.currentTime >= this.musicLoop) {
            this.music.currentTime = this.musicIn;
        }
        if (timestamp in this.stage) {
            this.stage[timestamp]()
        }
        timestamp++
    };
    // this.clear = function () {
    //     saveToFile()
    // };
    this.end = function () {
        this.music.pause();
        this.music.currentTime = 0;
        step = 0;
        window.score = 0
    }
}

function TestStage() {
    const inst = new AbstractStage();
    inst.music = Sounds.test;
    inst.musicLoop = 145.1;
    inst.musicIn = 0;
    const cache = document.createElement("canvas");
    cache.width = 832;
    cache.height = 1056;
    const cache_draw = cache.getContext("2d");
    const ctx = getLayer(0);
    cache_draw.fillStyle = ctx.createPattern(Images.background["03_02"], "repeat");
    cache_draw.fillRect(0, 0, cache.width, cache.height);
    inst.background = cache;
    inst.backgroundLoop = 0;
    inst.backgroundIn = -128;
    inst.show_title = function (layer, t) {
        layer.save();
        layer.font = "34px sans-serif";
        layer.shadowColor = "black";
        layer.shadowBlur = 2;
        if (t > 200) {
            layer.fillStyle = "rgba(255,255,255," + (1 / (t - 200)) + ")"
        } else {
            layer.fillStyle = "white"
        }
        layer.fillText("TestStage", 358, 288);
        layer.restore();
    };
    const ctx1 = getLayer(1);
    inst.option.draw = function () {
        ctx1.drawImage(Images.spell_name, 570, 28);
        ctx1.save();
        ctx1.font = "16px Comic Sans MS";
        ctx1.fillStyle = "white";
        ctx1.shadowColor = "black";
        ctx1.shadowBlur = 5;
        ctx1.fillText("夜符「Night Bird」", 678, 58);
        ctx1.font = "20px Comic Sans MS";
        ctx1.fillText("99", 806, 38);
        ctx1.restore();
    };
    let frame = 0;
    let c = 0;
    inst.option.tick = function () {
        if (window.player.shoot_delay > 0) {
            window.player.shoot_delay--;
        }
        // 麻将自机狙+固定弹
        // if (frames % 30 === 0) {
        //     for (let i = 0; i <= 360; i += 36) {
        //         let speed = transTo(4, 4, (i + frames / 10) * L);
        //         entities.push(new Jade("bill", 0.8, 300, 300, speed[0], speed[1]));
        //         speed = arrowTo(300, 300, window.player.X, window.player.Y, 4);
        //         speed = transTo(speed[0], speed[1], (i + frames / 10) * L);
        //         entities.push(new Jade("bill", 0.75, 300, 300, speed[0], speed[1]))
        //     }
        //     Sounds.change_track.currentTime = 0;
        //     _ = Sounds.change_track.play();
        // }
        if (0 < frame && frame < 17) {
            let j = frame;
            for (let k = 0; k < 3; k++) {
                let speed = arrowTo(440, 300, window.player.X, window.player.Y, (0.08 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16);
                speed = transTo(speed[0], speed[1], (90 - 90 / 16 * j - 3) * L);
                entities.push(jade("ring", "water", 440, 300, speed[0], speed[1]))
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play()
        }
        if (17 < frame && frame < 33) {
            let j = frame - 16;
            for (let k = 0; k < 3; k++) {
                let speed = arrowTo(440, 300, window.player.X, window.player.Y, (0.08 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 16);
                speed = transTo(speed[0], speed[1], (-90 + 90 / 16 * j) * L);
                entities.push(jade("ring", "purple", 440, 300, speed[0], speed[1]))
            }
            Sounds.bomb_shoot.currentTime = 0;
            _ = Sounds.bomb_shoot.play()
        }
        frame++;
        if (frame > 48) {
            frame = 0;
            c++
        }
        if (c === 4) {
            c = 0;
            frame = -60
        }
        window.score++
    };
    return inst
}

function transitions(f) {
    cancelAllSound();
    if (typeof f === "function") {
        isLoading = true;
        Sounds.loading.play().finally(function () {
            isLoading = false
        });
        img.style.display = "block";
        handler = function () {
            loading(f)
        };
    }
    selectIndex = 0;
    pause = false;
    entities.splice(0, entities.length);
    main_menu.splice(0, main_menu.length);
    keys.splice(0, keys.length);
    if (stage) {
        stage.end();
        stage = null
    }
    read_key_timeout = 60;
}

function loadStageMenu() {
    stage_menu.splice(0, stage_menu.length);
    stage_menu.push(menu_item(100, 550, "解除暂停"));
    stage_menu.push(menu_item(100, 590, "返回至主菜单"));
    stage_menu.push(menu_item(100, 630, "从头开始"));
    stage_menu[0].select();
}

function loadMainMenu() {
    transitions(menu);
    main_menu.push(menu_item(960, 550, "Game Start"));
    main_menu.push(menu_item(960, 590, "Extra Start"));
    main_menu.push(menu_item(960, 630, "Test"));
    main_menu.push(menu_item(960, 670, "Replay"));
    main_menu.push(menu_item(960, 710, "Play Data"));
    main_menu.push(menu_item(960, 750, "Music Room"));
    main_menu.push(menu_item(960, 790, "Option"));
    main_menu.push(menu_item(960, 830, "Quit"));
    main_menu[0].select();
}

let gui_bg_cache;

const ctx = getLayer(0);

function renderer_gui() {
    if (window.player.graze > config["GrazeMax"]) {
        window.player.graze = config["GrazeMax"]
    }
    if (window.score > h_score) {
        h_score = window.score
    }
    ctx.save();
    if (!gui_bg_cache) {
        gui_bg_cache = document.createElement("canvas");
        gui_bg_cache.width = width;
        gui_bg_cache.height = height;
        const cache_draw = gui_bg_cache.getContext("2d");
        cache_draw.fillStyle = ctx.createPattern(Images.background["11o26"], "repeat");
        cache_draw.fillRect(0, 0, width, height);
        cache_draw.shadowBlur = 10;
        cache_draw.globalCompositeOperation = "destination-out";
        cache_draw.fillStyle = "black";
        cache_draw.shadowColor = "black";
        cache_draw.roundRect(50, 20, 780, 922, 10).fill();
    }
    ctx.drawImage(gui_bg_cache, 0, 0);
    ctx.font = "34px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    let s = h_score.toString();
    while (s.length < 9) {
        s = "0" + s
    }
    ctx.fillText("HiScore    " + s, 858, 120);
    s = window.score.toString();
    while (s.length < 9) {
        s = "0" + s
    }
    ctx.fillText("Score    " + s, 893, 160);
    ctx.fillText("Player", 884, 198);
    for (let i = 0; i < window.player.player_count; i++) {
        ctx.drawImage(Images.sidebar.life, 1024 + i * 32, 172, 32, 32)
    }
    ctx.fillText("Bomb", 890, 236);
    for (let i = 0; i < window.player.bomb_count; i++) {
        ctx.drawImage(Images.sidebar.bomb, 1024 + i * 32, 206, 32, 32)
    }
    ctx.fillText("Power", 888, 274);
    s = window.player.power.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx.fillText("Point    " + window.player.point, 906, 312);
    ctx.fillText("Graze    " + window.player.graze, 890, 350);
    ctx.fillText(s[0] + ".", 1024, 274);
    ctx.fillText("/", 1082, 274);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(s.substr(1, 2), 1052, 274);
    s = window.player.power_max.toString();
    while (true) {
        if (s.length < 3) {
            s = "0" + s
        } else {
            break;
        }
    }
    ctx.font = "34px Comic Sans MS";
    ctx.fillText(s[0] + ".", 1100, 274);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(s.substr(1, 2), 1128, 274);
    ctx.restore();
}

let stage, pause = false;

const ctx1 = getLayer(1);
const ev_left = new CustomEvent("left", {
    bubbles: 'true',
    cancelable: 'true'
});
const ev_right = new CustomEvent("right", {
    bubbles: 'true',
    cancelable: 'true'
});
const ev_up = new CustomEvent("up", {
    bubbles: 'true',
    cancelable: 'true'
});
const ev_down = new CustomEvent("down", {
    bubbles: 'true',
    cancelable: 'true'
});
const ev_shoot = new CustomEvent("shoot", {
    bubbles: 'true',
    cancelable: 'true'
});
const ev_bomb = new CustomEvent("bomb", {
    bubbles: 'true',
    cancelable: 'true'
});

function test() {
    if (!stage) {
        window.player = rumia();
        stage = TestStage()
    }
    if (pause) {
        stage.draw();
        rendererEntity();
        stage_menu.forEach(function (g) {
            g.draw(g);
        });
        ctx.drawImage(Images.border_line, 46, (1 - window.player.pickLine) * 940 - 68.6, 786, 157.2);
        ctx1.save();
        ctx1.fillStyle = "rgba(255,0,10,0.5)";
        ctx1.fillRect(0, 0, width, height);
        ctx1.font = "30px sans-serif";
        ctx1.fillStyle = "rgb(255,255,255)";
        ctx1.fillText("游戏暂停", 80, 400);
        ctx1.restore();
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case "ArrowUp":
                    stage_menu[selectIndex].leave();
                    if (selectIndex > 0) {
                        selectIndex--
                    } else {
                        selectIndex = 2
                    }
                    stage_menu[selectIndex].select();
                    read_key_timeout = 6;
                    Sounds.select.currentTime = 0;
                    _ = Sounds.select.play();
                    break;
                case "ArrowDown":
                    stage_menu[selectIndex].leave();
                    if (selectIndex < 2) {
                        selectIndex++
                    } else {
                        selectIndex = 0
                    }
                    stage_menu[selectIndex].select();
                    read_key_timeout = 6;
                    Sounds.select.currentTime = 0;
                    _ = Sounds.select.play();
                    break;
                case "z":
                case "Z":
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
                            transitions(test);
                            return;
                        default:
                            Sounds.invalid.currentTime = 0;
                            _ = Sounds.invalid.play()
                    }
                    break;
                case "Escape":
                    continueAllSound();
                    _ = Sounds.option.play();
                    pause = false
            }
        }
        keys.splice(0, keys.length);
        updateMenu()
    } else {
        stage.tick();
        const kb = config["KeyBoard"];
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i].toLowerCase()) {
                case "escape":
                    loadStageMenu();
                    stopAllSound();
                    read_key_timeout = 360;
                    Sounds.pause.play().then(function () {
                        read_key_timeout = 6
                    });
                    keys.splice(i, 1);
                    pause = true;
                    break;
                case kb["Up"].toLowerCase() :
                    player.div.dispatchEvent(ev_up);
                    break;
                case kb["Down"].toLowerCase() :
                    player.div.dispatchEvent(ev_down);
                    break;
                case kb["Left"].toLowerCase() :
                    player.div.dispatchEvent(ev_left);
                    break;
                case kb["Right"].toLowerCase() :
                    player.div.dispatchEvent(ev_right);
                    break;
                case kb["Shoot"].toLowerCase() :
                    player.div.dispatchEvent(ev_shoot);
                    break;
                case kb["Bomb"].toLowerCase() :
                    player.div.dispatchEvent(ev_bomb);
                    break;
            }
        }
        updateEntity()
    }
    renderer_gui()
}

function menu() {
    while (entities.length < 256) {
        entities.push(menu_star(Math.random() * width, Math.random() * height, 0, 0.5, Math.random() * 2));
    }
    if (Sounds.menu.paused) {
        _ = Sounds.menu.play()
    }
    if (Sounds.menu.currentTime > 132.5) {
        Sounds.menu.currentTime = 1
    }
    for (let i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case "ArrowUp":
                main_menu[selectIndex].leave();
                if (selectIndex > 0) {
                    selectIndex--
                } else {
                    selectIndex = 7
                }
                main_menu[selectIndex].select();
                read_key_timeout = 6;
                Sounds.select.currentTime = 0;
                _ = Sounds.select.play();
                break;
            case "ArrowDown":
                main_menu[selectIndex].leave();
                if (selectIndex < 7) {
                    selectIndex++
                } else {
                    selectIndex = 0
                }
                main_menu[selectIndex].select();
                read_key_timeout = 6;
                Sounds.select.currentTime = 0;
                _ = Sounds.select.play();
                break;
            case "z":
            case "Z":
                switch (selectIndex) {
                    case 2:
                        transitions(test);
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
                break;
            case "Escape":
            case "x":
            case "X":
                main_menu[selectIndex].leave();
                if (selectIndex === 7) {
                    win.close();
                } else {
                    selectIndex = 7
                }
                main_menu[selectIndex].select();
                read_key_timeout = 6;
                Sounds.cancel.currentTime = 0;
                _ = Sounds.cancel.play();
        }
    }
    keys.splice(0, keys.length);
    updateMenu();
    updateEntity()
}

function updateMenu() {
    main_menu.forEach(function (g) {
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
    keys.splice(0, keys.length);
    Sounds.failure.currentTime = 0;
    _ = Sounds.failure.play();
    read_key_timeout = 0
}

function run() {
    try {
        if (read_key_timeout > 0) {
            read_key_timeout--
        }
        clearScreen();
        handler();
        frames++;
        nextFrame(run)
    } catch (e) {
        error(e)
    }
}

let t = 2, tsp = 0.1, isLoading = true;

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
        if (!isLoading && (Sounds.loading.paused || config["FastStart"])) {
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

window.score = 0;
let selectIndex = 0;
const requireECS = 768;
const status = document.createElement("div");
status.style.position = "absolute";
status.style.bottom = "0";
status.style.right = "0";
status.style.fontSize = "large";
status.style.zIndex = "65535";
document.body.append(status);
const keys = [], main_menu = [], stage_menu = [];
let timestamp = 0, frames = 0, read_key_timeout = 0, h_score = save["highScore"];
let handler;
const img = document.createElement("img");
img.src = "./assets/images/loading.gif";
img.style.position = "absolute";
img.style.zIndex = "1";
img.style.top = "200px";
img.style.left = "300px";
document.body.appendChild(img);
window.slow = false;

try {
    const ECSMax = config["ECSMax"];
    if (ECSMax && ECSMax >= requireECS) {
        setInterval(function () {
            const new_timestamp = new Date().getTime();
            let fps = Math.floor(frames / ((new_timestamp - timestamp) / 1000)), fps_color = "green",
                bcs = entities.length, bcs_color = "green";
            if (fps < 20) {
                fps_color = "red"
            } else if (fps < 40) {
                fps_color = "orange"
            }
            if (bcs > config["ECSMax"] * 3 / 4) {
                bcs_color = "red"
            } else if (bcs > config["ECSMax"] / 2) {
                bcs_color = "orange"
            }
            status.innerHTML =
                "<span style='color:" + fps_color + "'>" + fps + "FPS</span>" +
                "<span style='color:white'>/</span>" +
                "<span style='color:" + bcs_color + "'>" + bcs + "ECS</span>";
            timestamp = new_timestamp;
            if (config["FrameMax"] !== frames) {
                n = 1000 * frames / config["FrameMax"]
            }
            frames = 0;
        }, 1000);
        document.addEventListener("keydown", function (e) {
            if (read_key_timeout > 0) {
                return
            }
            e = e || window["event"];
            let check = 0;
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === e.key) {
                    check = 1;
                    break;
                }
            }
            if (check === 0) {
                keys.push(e.key);
            }
            if (e.key === config["KeyBoard"]["Slow"]) {
                window.slow = true
            }
            if (restore) {
                if (e.key.toLowerCase() === "z") {
                    restore = false;
                    loadMainMenu();
                    Sounds.ok.currentTime = 0;
                    _ = Sounds.ok.play();
                    nextFrame(run)
                } else {
                    if (e.key === "Escape") {
                        win.close()
                    }
                }
            }
        });
        document.addEventListener("keyup", function (e) {
            e = e || window["event"];
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === e.key || keys[i] === e.key.toLowerCase()) {
                    keys.splice(i, 1);
                    break;
                }
            }
            if (e.key === config["KeyBoard"]["Slow"]) {
                window.slow = false
            }
        });
        loadMainMenu();
        nextFrame(run)
    } else {
        error(new Error("配置达不到最低要求：ECSMax = " + ECSMax + "，至少需要" + requireECS), true)
    }
} catch (e) {
    console.log(e);
    if (confirm(e.message)) {
        win.close();
    }
}
