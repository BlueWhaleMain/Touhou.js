import Prefab from "./prefab.js";
import {
    continueAllSound,
    getLayer,
    GUI_SCREEN,
    HEIGHT,
    LAYER_MAPPING,
    newImage,
    options,
    RBox,
    resources,
    session,
    stopAllSound,
    TAGS,
    WIDTH
} from "./util.js";
import Observer from "./observer.js";
import Debug from "./layers/debug";

export const STAGE_EVENT = {
    load: "Load",
    pause: "Pause",
    end: "End",
    out: "Out"
};
const layerUI = getLayer(LAYER_MAPPING.UI);
const layerTitle = getLayer(LAYER_MAPPING.TITLE);
const layerDebug = getLayer(LAYER_MAPPING.DEBUG)
const guiBackground = document.createElement("canvas");
let t = 2, tsp = 0.1;
guiBackground.width = WIDTH;
guiBackground.height = HEIGHT;
const bg11o26 = newImage(resources.Images.background["11o26"]);
bg11o26.addEventListener("load", function () {
    const guiBackgroundCtx = guiBackground.getContext("2d");
    guiBackgroundCtx.fillStyle = layerUI.createPattern(bg11o26, "repeat");
    guiBackgroundCtx.fillRect(0, 0, WIDTH, HEIGHT);
    guiBackgroundCtx.shadowBlur = 10;
    guiBackgroundCtx.globalCompositeOperation = "destination-out";
    guiBackgroundCtx.fillStyle = "black";
    guiBackgroundCtx.shadowColor = "black";
    guiBackgroundCtx.roundRect(GUI_SCREEN.X, GUI_SCREEN.Y, GUI_SCREEN.WIDTH, GUI_SCREEN.HEIGHT, 5).fill()
});
const sidebarBomb = newImage(resources.Images.sidebar.bomb);
const sidebarLife = newImage(resources.Images.sidebar.life);
const spellPractice = newImage(resources.Images.spellPractice);
export default function StageUtil() {
    const inst = new Prefab(GUI_SCREEN.X + GUI_SCREEN.WIDTH / 2, GUI_SCREEN.Y + GUI_SCREEN.HEIGHT / 2);
    inst.event = new Observer();
    inst.callback = {};
    inst.paused = false;
    inst.end = false;
    inst.addComponent("StageUtil", function () {
        this.tick = function (inst) {
            if (inst.loaded === false) {
                inst.loaded = true;
                inst.event.dispatchEvent(STAGE_EVENT.load, {origin: "Util"})
            }
            if (inst.paused === true && session.demoPlay === true) {
                continueAllSound();
                inst.paused = false
            }
            if (inst.paused === true && inst.end === false) {
                inst.event.dispatchEvent(STAGE_EVENT.pause, {origin: "Util"});
                return
            }
            if (session.player.graze > options.GrazeMax) {
                session.player.graze = options.GrazeMax
            }
            if (session.score > session.highScore && !session.developerMode) {
                session.highScore = session.score
            }
            if (inst.end === true) {
                inst.event.dispatchEvent(STAGE_EVENT.end, {origin: "Util"});
                if (session.keys.has("z")) {
                    session.keys.delete("z");
                    inst.event.dispatchEvent(STAGE_EVENT.out, {origin: "Util"});
                    inst.event.clearEventListener();
                    inst.tags.add(TAGS.death)
                }
            }
        }
    });
    const debug = new Debug(inst)
    const guiBox = new RBox(GUI_SCREEN.WIDTH, GUI_SCREEN.HEIGHT)
    inst.addLayer("StageUtil", function () {
        this.draw = function () {
            layerTitle.save();
            layerTitle.drawImage(guiBackground, 0, 0);
            layerTitle.font = "17px Comic Sans MS";
            layerTitle.fillStyle = "white";
            layerTitle.shadowColor = "black";
            layerTitle.shadowBlur = 5;
            let s = session.highScore.toString();
            while (s.length < 10) {
                s = "0" + s
            }
            layerTitle.fillText("HiScore    " + s, 430, 60);
            s = session.score.toString();
            while (s.length < 10) {
                s = "0" + s
            }
            layerTitle.fillText("Score    " + s, 448, 80);
            layerTitle.fillText("Player", 444, 99);
            for (let i = 0; i < session.player.playerCount; i++) {
                layerTitle.drawImage(sidebarLife, 512 + i * 16, 86, 16, 16)
            }
            layerTitle.fillText("Spell", 450, 118);
            for (let i = 0; i < session.player.bombCount; i++) {
                layerTitle.drawImage(sidebarBomb, 512 + i * 16, 103, 16, 16)
            }
            if (session.practice) {
                layerTitle.drawImage(spellPractice, 512, 86, 120, 32)
            }
            layerTitle.fillText("Power", 444, 137);
            s = session.player.power.toString();
            while (true) {
                if (s.length < 3) {
                    s = "0" + s
                } else {
                    break
                }
            }
            layerTitle.fillText("Point    " + session.player.point, 453, 156);
            layerTitle.fillText("Graze    " + session.player.graze, 445, 175);
            layerTitle.fillText(s[0] + ".", 512, 137);
            layerTitle.fillText("/", 541, 137);
            layerTitle.font = "10px Comic Sans MS";
            layerTitle.fillText(s.substr(1, 2), 526, 137);
            s = session.player.powerMax.toString();
            while (true) {
                if (s.length < 3) {
                    s = "0" + s
                } else {
                    break
                }
            }
            layerTitle.font = "17px Comic Sans MS";
            layerTitle.fillText(s[0] + ".", 550, 137);
            layerTitle.font = "10px Comic Sans MS";
            layerTitle.fillText(s.substr(1, 2), 564, 137);
            if (session.demoPlay) {
                layerTitle.font = "20px sans-serif";
                if (t) {
                    layerTitle.fillStyle = "rgba(255,255,255," + (1 / t) + ")"
                } else {
                    layerTitle.fillStyle = "white"
                }
                layerTitle.fillText("Demo Play", 275, 255)
            }
            layerTitle.restore();
            if (session.developerMode) {
                layerDebug.save();
                layerDebug.font = "15px sans-serif";
                if (t) {
                    layerDebug.fillStyle = "rgba(255,255,255," + (1 / t) + ")"
                } else {
                    layerDebug.fillStyle = "white"
                }
                layerDebug.fillText("Developer Mode", 475, 365);
                layerDebug.restore();
                if (session.debugFlag) {
                    layerDebug.save();
                    layerDebug.font = "10px Comic Sans MS";
                    layerDebug.fillStyle = "white";
                    layerDebug.fillText("Player", GUI_SCREEN.X, GUI_SCREEN.Y + 10);
                    layerDebug.fillText("X " + session.player.X, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 20);
                    layerDebug.fillText("Y " + session.player.Y, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 30);
                    layerDebug.fillText("HitCount " + session.player.hitCount, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 40);
                    layerDebug.fillText("ShootDelay " + session.player.shootDelay, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 50);
                    layerDebug.fillText("BombUsed " + session.player.bombUsed, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 60);
                    layerDebug.fillText("BombTime " + session.player.bombTime, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 70);
                    layerDebug.fillText("IndTime " + session.player.indTime, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 80);
                    layerDebug.fillText("Miss " + session.player.miss, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 90);
                    layerDebug.fillText("HideTime " + session.player.hideTime, GUI_SCREEN.X + 10, GUI_SCREEN.Y + 100);
                    if (typeof inst.getRunningFrames === 'function') {
                        layerDebug.fillText("RunningFrames " + inst.getRunningFrames(), GUI_SCREEN.X + 10,
                            GUI_SCREEN.Y + 110)
                    }
                    if (typeof inst.getCurrentFrames === 'function') {
                        layerDebug.fillText("CurrentFrames " + inst.getCurrentFrames(), GUI_SCREEN.X + 10,
                            GUI_SCREEN.Y + 120)
                    }
                    layerDebug.restore()
                }
                debug.drawBox(inst, guiBox, 'gold')
            }
            t += tsp;
            if (t > 2) {
                tsp = -0.05
            } else {
                if (t < 0.5) {
                    tsp = 0.05
                }
            }
        }
    });
    inst.pause = function () {
        stopAllSound();
        inst.paused = true;
        if (typeof inst.callback.pause === "function") {
            inst.callback.pause()
        }
    };
    return inst
}
