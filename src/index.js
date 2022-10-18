import {
    audioObserver,
    batchExecute,
    cancelAllSound,
    changeBGM,
    clearScreen,
    continueAllSound,
    delayExecute,
    entities,
    EVENT_MAPPING,
    getLayer,
    getValidTimeFileName,
    GUI_SCREEN,
    HEIGHT,
    killAnotherBGM,
    L,
    LAYER_MAPPING,
    loadingScreenCache,
    loadSaveFromFile,
    newAudio,
    newImage,
    options,
    profile,
    randomPos,
    rendererEntity,
    resetAndSaveConfig,
    resources,
    saveConfigToFile,
    saveOrDownload,
    session,
    STAGE_VER,
    stopAllSound,
    TAGS,
    takeScreenShot,
    tickingEntity,
    timeEscape,
    updateEntity,
    WIDTH
} from "./util.js";
import MenuStar from "./prefabs/menu_star.js";
import SpellPractice from "./stage/spell_practice.js";
import {ob} from "./observer.js"
import Menu, {lightMenuItem, MenuItem} from "./menu.js";
import Rumia from "./prefabs/player/rumia.js";
import bossYukariYakumo from "./prefabs/boss/yukari_yakumo.js";
import test1 from "./cards/test_1.js";
import test2 from "./cards/test_2.js";
import test3 from "./cards/test_3.js";
import boundaryBetweenWaveAndParticle from "./cards/boundary_between_wave_and_particle.js";
import {SimpleDialogue, title} from "./dialogue.js";
import bossKirisameMarisa from "./prefabs/boss/kirisame_marisa.js";
import milkyWay from "./cards/milky_way.js";
import bossRumia from "./prefabs/boss/rumia.js";
import nightBird from "./cards/night_bird.js";
import demarcation from "./cards/demarcation.js";
import voidDeath from "./cards/void_death.js";
import bossPatchouliKnowledge from "./prefabs/boss/patchouli_knowledge.js";
import metalFatigue from "./cards/metal_fatigue.js";
import mercuryPoison from "./cards/mercury_poison.js";
import HakureiReimu from "./prefabs/player/hakurei_reimu.js";
import asteroidBelt from "./cards/asteroid_belt.js";
import masterSpark from "./cards/master_spark.js";
import bossHakureiReimu from "./prefabs/boss/hakurei_reimu.js";
import dreamSealLoose from "./cards/dream_seal_loose.js";
import dreamSealSilence from "./cards/dream_seal_silence.js";
import doubleSpark from "./cards/double_spark.js";
import test from "./cards/test.js";
import moonlightRay from "./cards/moonlight_ray.js";
import darkSideOfTheMoon from "./cards/dark_side_of_the_moon.js";
import rumiaThink from "./cards/rumia_think.js";
import StageItem from "./stage_item";
import Yousei from "./prefabs/enemy/yousei";
import shootDot from "./ai/shoot_dot";
import moveLine from "./ai/move_line";
import PowerOrb from "./prefabs/power_orb";
import BlueOrb from "./prefabs/blue_orb";
import moveTo from "./ai/move_to";
import shootCircle from "./ai/shoot_circle";
import Player1Clear from "./prefabs/player_1clear";
import Kedama from "./prefabs/enemy/kedama";

const gui = require("nw" + ".gui");
//idea划线
const win = gui["Window"].get();
if (options.PauseOnBlur === true) {
    win.on("focus", function () {
        continueAllSound();
        window.paused = false;
        nextFrame(run)
    });
    win.on("blur", function () {
        stopAllSound();
        window.paused = true
    });
}
let _;
const ignoreKeys = new Set(), entityCountSecMax = options.EntityCountSecMax;
const layerStage = getLayer(LAYER_MAPPING.STAGE);
const layerEffect = getLayer(LAYER_MAPPING.EFFECT);
const layerTitle = getLayer(128);
const ASSETS = {
    IMAGE: {
        rumia: newImage(resources.Images.bossRumia),
        hakureiReimu: newImage(resources.Images.player.hakureiReimu),
        bossHakureiReimu: newImage(resources.Images.bossHakureiReimu),
        kirisameMarisa: newImage(resources.Images.bossKirisameMarisa),
        patchouliKnowledge: newImage(resources.Images.bossPatchouliKnowledge),
        yukariYakumo: newImage(resources.Images.bossYukariYakumo)
    },
    SOUND: {
        spiritualDominationWhoDoneIt: {
            head: newAudio(resources.Sounds.spiritualDominationWhoDoneIt.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.spiritualDominationWhoDoneIt.loop, 100, "BGM"),
            name: "妖妖跋扈 ～ Who done it!",
            description: "　妖妖跋扈的里版本。\n" +
                "　曲子几乎没有变化……"
        },
        th10_01: {
            head: newAudio(resources.Sounds.th10_01.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.th10_01.loop, 100, "BGM"),
            name: "被封印的众神",
            description: "　标题画面的主题曲。\n" +
                "　\n" +
                "　一如以往的曲子……呢。\n" +
                "　因为是具有和风的神灵们的曲子，所以做得稍显大气。\n" +
                "　虽然是感觉具有异常奇妙的韵律的曲子，多听听的话便会觉得很合拍。\n" +
                "　尤其是在调试中。"
        },
        easternNight: {
            head: newAudio(resources.Sounds.easternNight.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.easternNight.loop, 100, "BGM"),
            name: "永夜抄 ～ Eastern Night",
            description: "　　标题画面的主题曲。\n" +
                "　　将标题曲给人的印象做成继承前作并与之相同的氛围。\n" +
                "　　不过好像也变得更加幻想般了，不管怎么说就是幻想乡嘛。\n" +
                "　　幻想般的，难道是幻想乡般的缩写吗？\n" +
                "　　不过嘛，作为标题画面的曲子我很喜欢。"
        },
        easternNightPractice: {
            head: newAudio(resources.Sounds.easternNightPractice.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.easternNightPractice.loop, 100, "BGM"),
            name: "東方妖怪小町",
            description: "Last Word的主题曲。\n" +
                "想要表现出一种脱离剧情框架的感觉。\n" +
                "看起来似乎很帅气但并非如此。\n" +
                "看起来似乎很可爱但并非如此。\n" +
                "看起来似乎……不令人害怕。\n" +
                "如果能够让人一直听下去心情也不会变坏就好了呢。"
        },
        rumia: {
            head: newAudio(resources.Sounds.rumia.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.rumia.loop, 100, "BGM"),
            name: "妖魔夜行",
            description: "露米娅的主题曲。\n" +
                "不仅是这首音乐，这次，总体来说音乐变得轻快了。\n" +
                "这音乐是表现夜晚里妖怪的印象，\n" +
                "　　···这样说也可以吧(^^;\n" +
                "节奏上有些像笨蛋的感觉。"
        },
        hakureiReimu: {
            head: newAudio(resources.Sounds.hakureiReimu.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.hakureiReimu.loop, 100, "BGM"),
            name: "少女綺想曲 ～ Dream Battle",
            description: "　　博丽灵梦的主题曲。\n" +
                "　　以怀念为主题，要问为什么是怀念，那是因为这首曲子是以数年前的曲子重制的，\n" +
                "　　而那首音乐就是第四作《东方幻想乡》４面BOSS灵梦的主题曲。\n" +
                "　　因为４面的模式与幻想乡酷似，所以曲子会给一部分人完全的既视感（喂\n" +
                "这次游戏的里主题是“名为幻想的古老记忆”。"
        },
        kirisameMarisa: {
            head: newAudio(resources.Sounds.kirisameMarisa.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.kirisameMarisa.loop, 100, "BGM"),
            name: "恋色マスタースパーク",
            description: "　　雾雨魔理沙的主题曲。\n" +
                "　　都到这一步了也就不用说什么怀念不怀念了。封魔录是第２作呢。就是那么古老的曲子的改编曲。\n" +
                "　　当初一直在想，现在的魔理沙再用这首音乐会不会有违和感，结果一点也没有，被吓了一跳。\n" +
                "　　如此恒定不变的人很少见啊。她的主题曲虽然有５首但这首是不是最像她的呢。"
        },
        patchouliKnowledge: {
            head: newAudio(resources.Sounds.patchouliKnowledge.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.patchouliKnowledge.loop, 100, "BGM"),
            name: "ラクトガール ～ 少女密室",
            description: "帕秋莉·诺蕾姬的主题曲。\n" +
                "啊—，又是平时的病……\n" +
                "是阴暗的曲子。这样的激烈却没有明亮轻快的感觉\n" +
                "虽然再稍微舒服一点的话会好些，觉得听这首曲子会变得心情阴暗\n" +
                "起来（笑）"
        },
        yukariYakumo: {
            head: newAudio(resources.Sounds.yukariYakumo.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.yukariYakumo.loop, 100, "BGM"),
            name: "ネクロファンタジア",
            description: "　八云紫的主题曲。\n" +
                "　本来打算将蓝的曲子重新编排下，不过，变成了不同风格的曲子。\n" +
                "　这首稍微搀杂着不吉的感觉。\n" +
                "　或者说，角色本身就极端不吉。\n" +
                "　即使在现在为止的角色当中，她也算是拥有形迹可疑的样子，无法信任的性格，非常识的弹\n" +
                "　幕。因为是那样的角色的曲子，所以曲子本身也非常形迹可疑(笑)"
        },
        th095_02: {
            head: newAudio(resources.Sounds.th095_02.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.th095_02.loop, 100, "BGM"),
            name: "風の循環　～ Wind Tour",
            description: "　摄影用曲１。\n" +
                "\n" +
                "　这次游戏中的曲子，和往常BOSS战中的那一类不同，\n" +
                "　为了表现出更多的日常感，做成了这种感觉。\n" +
                "　相当沉着的感觉，实际上文也是游刃有余，\n" +
                "　就象是自己正在逗摄影对象玩一般。"
        },
        th095_04: {
            head: newAudio(resources.Sounds.th095_04.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.th095_04.loop, 100, "BGM"),
            name: "東の国の眠らない夜",
            description: "摄影用曲３，用于中盘之后的曲子。\n" +
                "\n" +
                "　BOSS及文一直都乐在其中，要让BOSS保持威势不是件容易的事。\n" +
                "　虽是轻盈明快的曲子，意识到这点后，\n" +
                "　便将BOSS表现成看上去很强的样子。\n" +
                "　尤其是用钢琴。"
        },
        failure: {
            head: newAudio(resources.Sounds.failure.head, 100, "BGM"),
            loop: newAudio(resources.Sounds.failure.loop, 100, "BGM"),
            name: "プレイヤーズスコア",
            description: "　游戏结束的主题曲。\n" +
                "\n" +
                "　因为游戏结束后没有声音感觉很寂寥就加了这一曲。\n" +
                "　哎呀不可思议，竟然觉得更加寂寥了。\n" +
                "\n" +
                "　为啥呢？"
        },
        invalid: newAudio(resources.Sounds.invalid),
        ok: newAudio(resources.Sounds.ok),
        timeout: newAudio(resources.Sounds.timeout),
        timeout1: newAudio(resources.Sounds.timeout1, 100, "TEST")
    }
};
const transRumia = document.createElement("canvas");
transRumia.width = 286;
transRumia.height = 373;
ASSETS.IMAGE.rumia.addEventListener("load", function () {
    const rumiaCtx = transRumia.getContext("2d");
    rumiaCtx.translate(286, 0);
    rumiaCtx.scale(-1, 1);
    rumiaCtx.drawImage(ASSETS.IMAGE.rumia, 0, 0);
});
const musics = [];

function addToMusicRoom(bgm) {
    musics.push(bgm)
}

addToMusicRoom(ASSETS.SOUND.spiritualDominationWhoDoneIt);
addToMusicRoom(ASSETS.SOUND.easternNight);
addToMusicRoom(ASSETS.SOUND.th10_01);
addToMusicRoom(ASSETS.SOUND.easternNightPractice);
addToMusicRoom(ASSETS.SOUND.rumia);
addToMusicRoom(ASSETS.SOUND.hakureiReimu);
addToMusicRoom(ASSETS.SOUND.kirisameMarisa);
addToMusicRoom(ASSETS.SOUND.patchouliKnowledge);
addToMusicRoom(ASSETS.SOUND.yukariYakumo);
addToMusicRoom(ASSETS.SOUND.th095_02);
addToMusicRoom(ASSETS.SOUND.th095_04);
addToMusicRoom(ASSETS.SOUND.failure);
const mrm = [];
const ml = musics.length;
for (let i = 0; i < ml; i++) {
    mrm.push(lightMenuItem(140, 125 + 20 * i, musics[i].name))
}
const musicRoomMenu = new Menu(mrm, function (selectedIndex) {
    let selectedBgm;
    if (selectedIndex < musics.length) {
        selectedBgm = musics[selectedIndex]
    } else {
        ASSETS.SOUND.invalid.currentTime = 0;
        _ = ASSETS.SOUND.invalid.play();
        return
    }
    changeBGM(selectedBgm, function (bgm, work) {
        if (work) {
            bgm.leaveTime = selectedBgm.leaveTime;
            bgm.loopTime = selectedBgm.loopTime
        }
    }, true)
}, function () {
    mainMenu.load()
}, function (self) {
    if (session.currentBGM) {
        layerTitle.save();
        layerTitle.shadowBlur = 3;
        layerTitle.fillStyle = "rgb(153,153,153)";
        layerTitle.shadowColor = "black";
        layerTitle.font = "30px Comic Sans MS";
        layerTitle.fillText("Music Room", 240, 40);
        layerTitle.font = "12px Comic Sans MS";
        layerTitle.fillText("正在播放：" + session.currentBGM.name, 400, 80);
        if (session.debugFlag) {
            const head = "(Head)File：" + session.currentBGM.dom.src;
            let len = layerTitle.measureText(head).width;
            layerTitle.fillText(head, Math.max(WIDTH - len - 40, 0), 56);
            let total = session.currentBGM.dom.duration;
            let current = session.currentBGM.dom.currentTime;
            if (session.currentBGM.loop) {
                const loop = "LoopFile：" + session.currentBGM.loop.src;
                len = layerTitle.measureText(loop).width;
                layerTitle.fillText(loop, Math.max(WIDTH - len - 40, 0), 68);
                total += session.currentBGM.loop.duration;
                if (!session.currentBGM.loop.paused) {
                    current = session.currentBGM.dom.duration + session.currentBGM.loop.currentTime
                }
            }
            layerTitle.strokeStyle = "rgb(153,153,153)";
            layerTitle.strokeRect(400, 90, 120, 10);
            layerTitle.fillRect(400, 90, 120 * current / total, 10);
            current = Math.round(current);
            layerTitle.fillText(Math.floor(current / 60) + ":" + Math.prefix(current % 60) + "/" + Math.floor(total / 60) + ":" + Math.prefix(total % 60), 522, 100);
            if (session.currentBGM.loop) {
                layerTitle.fillStyle = "red";
                layerTitle.fillRect(400 + 120 * session.currentBGM.dom.duration / total, 90, 1, 10)
            }
        }
        let y = 0;
        for (let i = 0; i < self.menuList.length; i++) {
            if (!self.canDraw(i)) {
                continue
            }
            layerTitle.fillStyle = "rgb(153,153,153)";
            layerTitle.shadowColor = "black";
            if (self.selectedIndex === i) {
                layerTitle.fillStyle = "white";
                layerTitle.shadowColor = "rgb(153,153,153)";
            }
            y = 125 + i * 20;
            layerTitle.fillText("No." + (i + 1), 60, y - self.sline)
        }
        y += 20;
        if (session.currentBGM.description) {
            layerTitle.fillStyle = "white";
            layerTitle.shadowColor = "rgb(153,153,153)";
            session.currentBGM.description.split("\n").forEach(function (s) {
                y += 12;
                layerTitle.fillText(s, 60, y)
            });
        }
        layerTitle.restore();
    }
    rendererEntity()
}, function (self) {
    handler = function () {
        self.tick();
        self.draw()
    };
});

function practiceStartFactory(selectedIndex, replayOption) {
    let stageMap = [];
    let bgm = false;
    if (selectedIndex === 0) {
        stageMap = function () {
            const stage1 = new StageItem(new Map([
                [0, function () {
                    changeBGM(ASSETS.SOUND.spiritualDominationWhoDoneIt)
                    session.player.power = 0
                    // self.skipStep(1200, 8)
                    // self.skipStep(1600, 16)
                }], [660, function () {
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
                }], [840, function () {
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
                }], [900, function () {
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
                }], [930, function () {
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
                }], [1000, function () {
                    for (let i = 0; i < 20; i++) {
                        const color = i % 2 === 0 ? 'blue' : 'green'
                        entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                            batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                                3, 0, 360, 0, 60, true,
                                'point', color, 0, 0, 0, 5), moveLine(-5, 0)]),
                            300, [BlueOrb(0, 0, 0, -1)]))
                    }
                }], [1060, function () {
                    for (let i = 0; i < 20; i++) {
                        const color = i % 2 === 0 ? 'blue' : 'green'
                        entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 1,
                            batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                                3, 0, 360, 0, 60, true,
                                'point', color, 0, 0, 0, 5), moveLine(5, 0)]),
                            300, [BlueOrb(0, 0, 0, -1)]))
                    }
                }], [1120, function () {
                    for (let i = 0; i < 20; i++) {
                        const color = i % 2 === 0 ? 'blue' : 'green'
                        entities.push(Kedama(color, GUI_SCREEN.WIDTH + i * 20, 100, 1,
                            batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                                3, 0, 360, 0, 60, true,
                                'point', color, 0, 0, 0, 5), moveLine(-5, 0)]),
                            300, [BlueOrb(0, 0, 0, -1)]))
                    }
                }], [1140, function () {
                    for (let i = 0; i < 20; i++) {
                        const color = i % 2 === 0 ? 'blue' : 'green'
                        entities.push(Kedama(color, GUI_SCREEN.X - i * 20, 100, 1,
                            batchExecute([shootCircle(3 + i * 3, 10, 120 + i * 3, 5,
                                3, 0, 360, 0, 60, true,
                                'point', color, 0, 0, 0, 5), moveLine(5, 0)]),
                            300, [BlueOrb(0, 0, 0, -1)]))
                    }
                }], [1240, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 40 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 30, 120 + i * 3, 5,
                                5, 0, 180, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1270, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 60 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 40, 120 + i * 3, 5,
                                5, 0, 90, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1300, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 50 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 50, 120 + i * 3, 5,
                                5, 0, 45, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1370, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 40 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 30, 120 + i * 3, 5,
                                5, 0, 180, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1400, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 60 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 40, 120 + i * 3, 5,
                                5, 0, 90, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1430, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 50 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 50, 120 + i * 3, 5,
                                5, 0, 45, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1500, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 60 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 40, 120 + i * 3, 5,
                                5, 0, 90, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1530, function () {
                    for (let i = 0; i < 6; i++) {
                        const x = GUI_SCREEN.X + 50 + i * (GUI_SCREEN.WIDTH / 7)
                        entities.push(Yousei('hatted', 'blue', x, -40, 3,
                            batchExecute([shootCircle(3 + i * 3, 50, 120 + i * 3, 5,
                                5, 0, 45, 0, 4, true,
                                'ring', 'blue', 0, 0, 0, 4), moveTo(x, 50, 2, delayExecute(
                                moveLine(-2, 1), 120), 120)]), -1,
                            [PowerOrb(0, 0, 0, -1)]))
                    }
                }], [1650, function () {
                    let yousei = Yousei('hatted', 'blue', GUI_SCREEN.X + 100, -40, 30,
                        batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 3,
                            shootCircle(0, 6, 370, 6, 3, 0,
                                360, -6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                            delayExecute(moveLine(0, 2), 400)]),
                        520, [PowerOrb(0, 0, 0, -1, 'big')])
                    yousei.showMagicRing()
                    entities.push(yousei)
                    yousei = Yousei('hatted', 'blue', GUI_SCREEN.X + 250, -40, 30,
                        batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 3,
                            shootCircle(0, 6, 370, 6, 3, 0,
                                360, 6, 120, false, 'rice', 'blue', 0, 0, 0, 2)),
                            delayExecute(moveLine(0, 2), 400)]),
                        520, [BlueOrb(0, 0, 0, -1)])
                    yousei.showMagicRing()
                    entities.push(yousei)
                }], [2200, function () {

                }]
            ]))
            const stage2 =
                new StageItem(new Map([[1, function (self, inst) {
                    if (inst.getLastFrames() > 6000) {
                        self.skipStep(400, 1)
                    }
                }], [1, function () {
                    for (let i = 0; i < 8; i++) {
                        const pos = randomPos(0, -GUI_SCREEN.Y - 40, 40, -320)
                        entities.push(Yousei('normal', 'red', pos[0], pos[1], 1,
                            moveTo(GUI_SCREEN.X + 200, GUI_SCREEN.Y + 100, 1,
                                shootDot(60, 1, 70, 1, false, 'point', 'dimgray',
                                    0, 0, 0, 2), 60), 300, [PowerOrb(0, 0, 0, -1)]))
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
                }], [300, function () {
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
                }], [900, function () {
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
                }], [1200, function () {
                    let yousei = Yousei('hatted', 'red', 0, GUI_SCREEN.Y + 100, 10,
                        batchExecute([moveTo(GUI_SCREEN.X + 100, GUI_SCREEN.Y + 100, 2,
                            shootCircle(0, 48, 170, 30, 3, 0,
                                360, 3, true, 'point', 'dimgray', 0, 0, 0, 2)),
                            delayExecute(moveLine(2, 0), 300)]),
                        500, [PowerOrb(0, 0, 0, -1, 'big'),
                            Player1Clear(0, 0)])
                    yousei.showMagicRing()
                    entities.push(yousei)
                    yousei = Yousei('hatted', 'blue',
                        GUI_SCREEN.X + GUI_SCREEN.WIDTH, GUI_SCREEN.Y + 100, 10,
                        batchExecute([moveTo(GUI_SCREEN.X + 250, GUI_SCREEN.Y + 100, 2,
                            shootCircle(0, 48, 170, 30, 3, 0,
                                360, 3, true, 'point', 'dimgray', 0, 0, 0, 2)),
                            delayExecute(moveLine(-2, 0), 300)]),
                        500, [BlueOrb(0, 0, 0, -1), Player1Clear(0, 0)])
                    yousei.showMagicRing()
                    entities.push(yousei)
                }], [1500, function () {

                }]]))
            if (session.selectedPlayer === Rumia) {
                return [
                    stage1,
                    bossYukariYakumo(480, -60, 1000, [
                        test1(),
                        test2(),
                    ]), stage2,
                    bossYukariYakumo(480, -60, 1000, [
                        test3(),
                        boundaryBetweenWaveAndParticle(function (cd) {
                            cd.practice = true
                        }),
                        test()
                    ], [
                        SimpleDialogue([{
                            text: "#_#"
                        }], [{
                            image: transRumia
                        }], function () {
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(255,212,53)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.fillText("宵暗的妖怪 露米娅", 50, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "www", fillStyle: "purple", X: 300
                        }], [{
                            image: ASSETS.IMAGE.yukariYakumo,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(168,13,255)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.fillText("妖怪的贤者 八云·紫", 250, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "？？？"
                        }], [{image: transRumia}, {
                            image: ASSETS.IMAGE.yukariYakumo,
                            X: 200, globalAlpha: 0.4
                        }]),
                        SimpleDialogue([{
                            text: "嗯？", fillStyle: "purple", X: 300
                        }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                            image: ASSETS.IMAGE.yukariYakumo,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossKirisameMarisa(500, 125, 1200, [
                        milkyWay(),
                        asteroidBelt(),
                        masterSpark(),
                        doubleSpark()
                    ], [
                        SimpleDialogue([{
                            text: "额"
                        }], [{
                            image: transRumia
                        }]),
                        SimpleDialogue([{
                            text: "哈~", fillStyle: "gold", X: 200
                        }], [{
                            image: ASSETS.IMAGE.kirisameMarisa,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(255,251,37)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.fillText("普通的魔法使 雾雨·魔理沙", 250, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "啊 是魔理沙"
                        }], [{image: transRumia}, {
                            image: ASSETS.IMAGE.kirisameMarisa,
                            X: 200, globalAlpha: 0.4
                        }]),
                        SimpleDialogue([{
                            text: "~DA☆ZE", fillStyle: "gold", X: 200, direction: "rtl"
                        }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                            image: ASSETS.IMAGE.kirisameMarisa,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossRumia(-50, 125, 900, [
                        moonlightRay(),
                        nightBird(),
                        demarcation(),
                        voidDeath(function (cd) {
                            cd.practice = true
                        })
                    ], [
                        SimpleDialogue([{
                            text: "~"
                        }], [{
                            image: transRumia
                        }]),
                        SimpleDialogue([{
                            text: "？！", fillStyle: "red", X: 300
                        }], [{
                            image: ASSETS.IMAGE.rumia,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125
                        }),
                        SimpleDialogue([{
                            text: "因为是测试模式来着 所以没关系"
                        }], [{image: transRumia}, {
                            image: ASSETS.IMAGE.rumia,
                            X: 200, globalAlpha: 0.4
                        }]),
                        SimpleDialogue([{
                            text: "？是 这样吗", fillStyle: "red", X: 300, direction: "rtl"
                        }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                            image: ASSETS.IMAGE.rumia,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossPatchouliKnowledge(220, -60, 1000, [
                        metalFatigue(),
                        mercuryPoison()
                    ], [
                        SimpleDialogue([{
                            text: "..."
                        }], [{
                            image: transRumia
                        }]),
                        SimpleDialogue([{
                            text: "！", fillStyle: "purple", X: 250
                        }], [{
                            image: ASSETS.IMAGE.patchouliKnowledge,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(239,14,255)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.direction = "rtl";
                                    layerEffect.fillText("知识与避世的少女 帕秋莉·诺蕾姬", GUI_SCREEN.WIDTH - GUI_SCREEN.X, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "==", fillStyle: "purple", X: 250
                        }, {
                            text: "?"
                        }], [{image: transRumia}, {
                            image: ASSETS.IMAGE.patchouliKnowledge,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossHakureiReimu(480, -60, 1000, [
                        dreamSealLoose(),
                        dreamSealSilence()
                    ], [
                        SimpleDialogue([{
                            text: "..."
                        }], [{
                            image: transRumia, X: 5
                        }]),
                        SimpleDialogue([{
                            text: "！", fillStyle: "rgb(255,10,17)", X: 250
                        }], [{
                            image: ASSETS.IMAGE.bossHakureiReimu,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(255,10,17)";
                                    layerEffect.shadowColor = "white";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.direction = "rtl";
                                    layerEffect.fillText("乐园的巫女 博丽灵梦", GUI_SCREEN.WIDTH - GUI_SCREEN.X, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "胡闹就到此为止了！", fillStyle: "rgb(255,10,17)", X: 250
                        }, {
                            text: "是—这样吗—"
                        }], [{image: transRumia, X: 5}, {
                            image: ASSETS.IMAGE.bossHakureiReimu,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ])
                ];
            } else if (session.selectedPlayer === HakureiReimu) {
                return [stage1,
                    bossYukariYakumo(480, -60, 1000, [
                        test1(),
                        test2(),
                    ]), stage2,
                    bossYukariYakumo(480, -60, 1000, [
                        test3(),
                        boundaryBetweenWaveAndParticle(function (cd) {
                            cd.practice = true
                        }),
                        test()
                    ], [
                        SimpleDialogue([{
                            text: "又是你？", fillStyle: "rgb(255,10,17)"
                        }], [{
                            image: ASSETS.IMAGE.hakureiReimu, X: 5
                        }], function () {
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(255,10,17)";
                                    layerEffect.shadowColor = "white";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.fillText("乐园的巫女 博丽灵梦", 50, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "让人连个安稳觉都睡不了", fillStyle: "purple"
                        }], [{
                            image: ASSETS.IMAGE.yukariYakumo,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(168,13,255)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.fillText("妖怪的贤者 八云·紫", 250, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "怎么？", fillStyle: "rgb(255,10,17)"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, X: 5}, {
                            image: ASSETS.IMAGE.yukariYakumo,
                            X: 200, globalAlpha: 0.4
                        }]),
                        SimpleDialogue([{
                            text: "……", fillStyle: "purple", X: 300
                        }], [{image: ASSETS.IMAGE.hakureiReimu, globalAlpha: 0.4, X: 0}, {
                            image: ASSETS.IMAGE.yukariYakumo,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossKirisameMarisa(500, 125, 1200, [
                        milkyWay(),
                        asteroidBelt(),
                        masterSpark(),
                        doubleSpark()
                    ], [
                        SimpleDialogue([{
                            text: "?", fillStyle: "rgb(255,10,17)"
                        }], [{
                            image: ASSETS.IMAGE.hakureiReimu, X: 5
                        }]),
                        SimpleDialogue([{
                            text: "很少见吧", fillStyle: "gold", X: 200
                        }], [{
                            image: ASSETS.IMAGE.kirisameMarisa,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(255,251,37)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.fillText("普通的魔法使 雾雨·魔理沙", 250, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "啊 是魔理沙", fillStyle: "rgb(255,10,17)"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, X: 5}, {
                            image: ASSETS.IMAGE.kirisameMarisa,
                            X: 200, globalAlpha: 0.4
                        }]),
                        SimpleDialogue([{
                            text: "。不过，要干的事是一样的", fillStyle: "gold", X: 200, direction: "rtl"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, globalAlpha: 0.4, X: 0}, {
                            image: ASSETS.IMAGE.kirisameMarisa,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossRumia(-50, 125, 900, [
                        moonlightRay(),
                        nightBird(),
                        demarcation(),
                        voidDeath(function (cd) {
                            cd.practice = true
                        })
                    ], [
                        SimpleDialogue([{
                            text: "还会出现妖怪，真是受不了啊", fillStyle: "rgb(255,10,17)"
                        }], [{
                            image: ASSETS.IMAGE.hakureiReimu, X: 5
                        }]),
                        SimpleDialogue([{
                            text: "？在我眼前的就是吃了也没关系的人类",
                            fillStyle: "red",
                            X: GUI_SCREEN.WIDTH - GUI_SCREEN.X,
                            direction: "rtl"
                        }], [{
                            image: ASSETS.IMAGE.rumia,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125
                        }),
                        SimpleDialogue([{
                            text: "良药苦口\n" +
                                "这句话你有听过吗？", fillStyle: "rgb(255,10,17)"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, X: 5}, {
                            image: ASSETS.IMAGE.rumia,
                            X: 200, globalAlpha: 0.4
                        }]),
                        SimpleDialogue([{
                            text: "—是—这样吗", fillStyle: "red", X: 300, direction: "rtl"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, globalAlpha: 0.4, X: 0}, {
                            image: ASSETS.IMAGE.rumia,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossPatchouliKnowledge(220, -60, 1000, [
                        metalFatigue(),
                        mercuryPoison()
                    ], [
                        SimpleDialogue([{
                            text: "...", fillStyle: "rgb(255,10,17)"
                        }], [{
                            image: ASSETS.IMAGE.hakureiReimu, X: 5
                        }]),
                        SimpleDialogue([{
                            text: "！", fillStyle: "purple", X: 250
                        }], [{
                            image: ASSETS.IMAGE.patchouliKnowledge,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125;
                            entities.push(title(function () {
                                const self = {};
                                self.draw = function (self) {
                                    layerEffect.save();
                                    layerEffect.globalAlpha = self.opacity;
                                    layerEffect.font = "14px sans-serif";
                                    layerEffect.fillStyle = "rgb(239,14,255)";
                                    layerEffect.shadowColor = "black";
                                    layerEffect.shadowBlur = 2;
                                    layerEffect.direction = "rtl";
                                    layerEffect.fillText("知识与避世的少女 帕秋莉·诺蕾姬", GUI_SCREEN.WIDTH - GUI_SCREEN.X, 360);
                                    layerEffect.restore()
                                };
                                return self
                            }))
                        }),
                        SimpleDialogue([{
                            text: "那边的红白！", fillStyle: "purple", X: 250
                        }, {
                            text: "红白？", fillStyle: "rgb(255,10,17)"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, X: 5}, {
                            image: ASSETS.IMAGE.patchouliKnowledge,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ]),
                    bossHakureiReimu(480, -60, 1000, [
                        dreamSealLoose(),
                        dreamSealSilence()
                    ], [
                        SimpleDialogue([{
                            text: "谁？", fillStyle: "rgb(255,10,17)"
                        }], [{
                            image: ASSETS.IMAGE.hakureiReimu, X: 5
                        }]),
                        SimpleDialogue([{
                            text: "！", fillStyle: "rgb(255,10,17)", X: 250
                        }], [{
                            image: ASSETS.IMAGE.bossHakureiReimu,
                            X: 190
                        }], function (inst) {
                            inst.target.X = 220;
                            inst.target.Y = 125
                        }),
                        SimpleDialogue([{
                            text: "...", fillStyle: "rgb(255,10,17)", X: 250
                        }, {
                            text: "原来是我的符札啊", fillStyle: "rgb(255,10,17)"
                        }], [{image: ASSETS.IMAGE.hakureiReimu, X: 5}, {
                            image: ASSETS.IMAGE.bossHakureiReimu,
                            X: 190
                        }], function (inst) {
                            cancelAllSound();
                            inst.playBGM()
                        })
                    ])
                ]
            }
        };
    } else {
        ASSETS.SOUND.invalid.currentTime = 0;
        _ = ASSETS.SOUND.invalid.play();
        return
    }
    session.stage = SpellPractice("practiceStart", selectedIndex, session.selectedPlayer, stageMap, bgm, function () {
        practiceStartFactory(selectedIndex)
    }, replayOption)
}

const practiceStartMenu = new Menu([
    lightMenuItem(300, 215, "TestStage"),
], function (selectedIndex) {
    practiceStartFactory(selectedIndex);
    transitions(runSpellPractice);
}, function () {
    mainMenu.load()
}, function () {
    if (session.keys.has("ArrowLeft".toLowerCase())) {
        session.keys.delete("ArrowLeft".toLowerCase());
        if (session.selectedPlayer === Rumia) {
            session.selectedPlayer = HakureiReimu
        } else {
            session.selectedPlayer = Rumia
        }
        ASSETS.SOUND.ok.currentTime = 0;
        _ = ASSETS.SOUND.ok.play()
    }
    if (session.keys.has("ArrowRight".toLowerCase())) {
        session.keys.delete("ArrowRight".toLowerCase());
        if (session.selectedPlayer === Rumia) {
            session.selectedPlayer = HakureiReimu
        } else {
            session.selectedPlayer = Rumia
        }
        ASSETS.SOUND.ok.currentTime = 0;
        _ = ASSETS.SOUND.ok.play()
    }
    layerStage.save();
    layerStage.globalAlpha = 0.5;
    if (session.selectedPlayer === Rumia) {
        layerStage.drawImage(ASSETS.IMAGE.rumia, 10, 10, ASSETS.IMAGE.rumia.width * 2, ASSETS.IMAGE.rumia.height * 2);
    }
    if (session.selectedPlayer === HakureiReimu) {
        layerStage.drawImage(ASSETS.IMAGE.hakureiReimu, 10, 10, ASSETS.IMAGE.hakureiReimu.width * 2, ASSETS.IMAGE.hakureiReimu.height * 2);
    }
    layerStage.restore();
    rendererEntity()
}, function (self) {
    session.selectedPlayer = Rumia;
    handler = function () {
        self.tick();
        self.draw()
    };
});

function getPlayer(player) {
    if (player === "HakureiReimu") {
        return HakureiReimu
    } else if (player === "Rumia") {
        return Rumia
    } else {
        throw new Error("PlayerType:" + player + " is not exists!")
    }
}

function doReplay(replay, force) {
    if (replay.stg?.DeveloperMode === options.DeveloperMode && replay.STAGE_VER === STAGE_VER || force) {
        session.selectedPlayer = getPlayer(replay.stg?.player);
        if (replay.stg?.menu === "practiceStart") {
            practiceStartFactory(replay.stg?.selectedIndex, replay);
            transitions(runSpellPractice);
        } else if (replay.stg?.menu === "spellPractice") {
            spellPracticeFactory(replay.stg?.selectedIndex, replay);
            transitions(runSpellPractice);
        } else {
            throw new Error("Menu:" + replay.stg?.menu + " is not exists!")
        }
    } else {
        ASSETS.SOUND.invalid.currentTime = 0;
        _ = ASSETS.SOUND.invalid.play()
    }
}

function getStageStr(menu, selectedIndex) {
    if (menu === "practiceStart") {
        return "TestStage"
    } else if (menu === "spellPractice") {
        return sps[selectedIndex].name
    } else {
        return "Unknown"
    }
}

let replayList = [
    lightMenuItem(140, 100, "什么都没有")
];
let rpl = [];
const fs = require("fs");
const replayMenu = new Menu(replayList, function (selectedIndex) {
    if (selectedIndex < rpl.length) {
        doReplay(rpl[selectedIndex]);
        return
    }
    if (rpl.length === 0) {
        mainMenu.load();
        return
    }
    ASSETS.SOUND.invalid.currentTime = 0;
    _ = ASSETS.SOUND.invalid.play()
}, function () {
    mainMenu.load()
}, function (self) {
    layerTitle.save();
    layerTitle.shadowBlur = 3;
    layerTitle.fillStyle = "rgb(153,153,153)";
    layerTitle.shadowColor = "black";
    layerTitle.font = "30px Comic Sans MS";
    layerTitle.fillText("Replay", 240, 40);
    layerTitle.fillStyle = "white";
    layerTitle.font = "16px Comic Sans MS";
    if (rpl.length > 0) {
        const replay = rpl[self.selectedIndex];
        layerTitle.fillText("Detail:" + getStageStr(replay.stg.menu, replay.stg.selectedIndex), 40, 420);
        layerTitle.fillText("Player:" + replay.stg.player, 40, 436);
        if (replay.stg.DeveloperMode !== options.DeveloperMode) {
            layerTitle.fillStyle = "red"
        }
        layerTitle.fillText("Mode:" + (replay.stg.DeveloperMode ? "Developer" : "Player"), 40, 452);
        layerTitle.fillText("Total:" + (replay.stg.totalFrames ? replay.stg.totalFrames + " (Frames)" : "N/A")
            + " " + (replay.stg.totalTs ? timeEscape(replay.stg.totalTs / 1000) + " (Time)" : "N/A")
            , 200, 452);
        layerTitle.fillText("LagRate:" + (replay.stg.totalFrames && replay.stg.totalTs
            ? ((1 - replay.stg.totalFrames * 50 / 3 / replay.stg.totalTs) * 100).toFixed(4) + "%" : "N/A")
            , 40, 468);
        layerTitle.fillText("Score:" + (replay.stg.score ? replay.stg.score : "N/A"), 200, 468)
    }
    layerTitle.restore();
    rendererEntity()
}, function (self) {
    self.aline = 400;
    rpl.slice(0);
    replayList = [];
    const files = fs.readdirSync(options.Replay);
    const len = files.length;
    for (let i = 0; i < len; i++) {
        if (files[i].toLowerCase().endsWith(".json")) {
            try {
                const replay = JSON.parse(fs.readFileSync(options.Replay + "/" + files[i]).toString());
                rpl.push(replay);
                replayList.push(lightMenuItem(40, 80 + 20 * i, "No." + (i + 1) + " "
                    + (replay.name || files[i]).substr(0, 18) + " "
                    + (replay.STAGE_VER === STAGE_VER ? "" : "NotSupport!")))
            } catch (e) {
                console.warn(e)
            }
        }
    }
    if (replayList.length === 0) {
        replayList.push(lightMenuItem(140, 100, "什么都没有"))
    }
    self.selectedIndex = 0;
    replayList[0].select();
    self.menuList = replayList;
    handler = function () {
        self.tick();
        self.draw()
    }
});
const sps = [];

function addSpellCard(name, f, bgm) {
    sps.push({
        name, f, bgm
    })
}

function spellPracticeFactory(selectedIndex, replayOption) {
    const player = session.selectedPlayer;
    let stageMap = [];
    let bgm = false;
    if (selectedIndex < sps.length) {
        const sp = sps[selectedIndex];
        stageMap = sp.f;
        bgm = sp.bgm
    } else {
        ASSETS.SOUND.invalid.currentTime = 0;
        _ = ASSETS.SOUND.invalid.play();
        return
    }
    session.stage = SpellPractice("spellPractice", selectedIndex, player, stageMap, bgm, function () {
        spellPracticeFactory(selectedIndex)
    }, replayOption)
}

addSpellCard("Test1", function () {
    const boss = bossYukariYakumo(480, -60, 1000, [test1(function (card) {
        card.practice = true
    })]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("Test2", function () {
    const boss = bossYukariYakumo(480, -60, 1000, [test2(function (card) {
        card.practice = true
    })]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("Test3", function () {
    const boss = bossYukariYakumo(480, -60, 1000, [test3(function (card) {
        card.practice = true
    })]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("境符「波与粒的境界」", function () {
    const boss = bossYukariYakumo(480, -60, 1000, [
        boundaryBetweenWaveAndParticle(function (cd) {
            cd.practice = true
        })]);
    changeBGM(ASSETS.SOUND.th095_04);
    return [boss]
}, true);
addSpellCard("「纯粹的弹幕测试」", function () {
    const boss = bossYukariYakumo(480, -60, 1000, [test(function (card) {
        card.practice = true
    })]);
    return [boss]
}, false);
addSpellCard("魔符「银河」", function () {
    const boss = bossKirisameMarisa(500, 125, 1200, [
        milkyWay(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("魔空「小行星带」", function () {
    const boss = bossKirisameMarisa(500, 125, 1200, [
        asteroidBelt(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("恋符「极限火花」", function () {
    const boss = bossKirisameMarisa(500, 125, 1200, [
        masterSpark(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("恋心「二重火花」", function () {
    const boss = bossKirisameMarisa(500, 125, 1200, [
        doubleSpark(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("月符「月亮光」", function () {
    const boss = bossRumia(-50, 125, 900, [
        moonlightRay(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("夜符「夜雀」", function () {
    const boss = bossRumia(-50, 125, 900, [
        nightBird(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("暗符「境界线」", function () {
    const boss = bossRumia(-50, 125, 900, [
        demarcation(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("深渊「空亡」", function () {
    const boss = bossRumia(-50, 125, 900, [
        voidDeath(function (cd) {
            cd.practice = true
        })
    ]);
    return [boss]
}, false);
addSpellCard("暗符「月的阴暗面」", function () {
    const boss = bossRumia(-50, 125, 1000, [
        darkSideOfTheMoon(function (cd) {
            cd.practice = true
        })
    ]);
    changeBGM(ASSETS.SOUND.th095_02);
    return [boss]
}, true);
addSpellCard("金符「金属疲劳」", function () {
    const boss = bossPatchouliKnowledge(220, -60, 1000, [
        metalFatigue(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("金&水符「水银之毒」", function () {
    const boss = bossPatchouliKnowledge(220, -60, 1000, [
        mercuryPoison(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("灵符「梦想封印　散」", function () {
    const boss = bossHakureiReimu(480, -60, 1000, [
        dreamSealLoose(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("散灵「梦想封印　寂」", function () {
    const boss = bossHakureiReimu(480, -60, 1000, [
        dreamSealSilence(function (cd) {
            cd.practice = true
        })
    ]);
    boss.playBGM();
    return [boss]
}, true);
addSpellCard("RUMIA「THINK」", function () {
    const boss = bossRumia(-50, 125, 1000, [
        rumiaThink(function (cd) {
            cd.practice = true
        })
    ]);
    return [boss]
}, false);
const spm = [];
const spl = sps.length;
for (let i = 0; i < spl; i++) {
    spm.push(lightMenuItem(280, 195 + 20 * i, sps[i].name))
}
const spellPracticeMenu = new Menu(spm, function (selectedIndex) {
    spellPracticeFactory(selectedIndex);
    transitions(runSpellPractice);
}, function () {
    mainMenu.load()
}, function (self) {
    if (session.keys.has("ArrowLeft".toLowerCase())) {
        session.keys.delete("ArrowLeft".toLowerCase());
        if (session.selectedPlayer === Rumia) {
            session.selectedPlayer = HakureiReimu
        } else {
            session.selectedPlayer = Rumia
        }
        ASSETS.SOUND.ok.currentTime = 0;
        _ = ASSETS.SOUND.ok.play()
    }
    if (session.keys.has("ArrowRight".toLowerCase())) {
        session.keys.delete("ArrowRight".toLowerCase());
        if (session.selectedPlayer === Rumia) {
            session.selectedPlayer = HakureiReimu
        } else {
            session.selectedPlayer = Rumia
        }
        ASSETS.SOUND.ok.currentTime = 0;
        _ = ASSETS.SOUND.ok.play()
    }
    layerStage.save();
    layerStage.globalAlpha = 0.5;
    if (session.selectedPlayer === Rumia) {
        layerStage.drawImage(ASSETS.IMAGE.rumia, 10, 10, ASSETS.IMAGE.rumia.width * 2, ASSETS.IMAGE.rumia.height * 2);
    }
    if (session.selectedPlayer === HakureiReimu) {
        layerStage.drawImage(ASSETS.IMAGE.hakureiReimu, 10, 10, ASSETS.IMAGE.hakureiReimu.width * 2, ASSETS.IMAGE.hakureiReimu.height * 2);
    }
    layerStage.restore();
    layerTitle.save();
    layerTitle.font = "12px Comic Sans MS";
    layerTitle.shadowBlur = 3;
    for (let i = 0; i < self.menuList.length; i++) {
        if (!self.canDraw(i)) {
            continue
        }
        layerTitle.fillStyle = "rgb(153,153,153)";
        layerTitle.shadowColor = "black";
        if (self.selectedIndex === i) {
            layerTitle.fillStyle = "white";
            layerTitle.shadowColor = "rgb(153,153,153)";
        }
        layerTitle.fillText("No." + (i + 1), 200, 195 + i * 20 - self.sline)
    }
    layerTitle.restore();
    rendererEntity()
}, function (self) {
    session.selectedPlayer = Rumia;
    handler = function () {
        self.tick();
        self.draw()
    }
});
const keyBoardOptionMenu = new Menu([
    MenuItem(380, 275, "Up"),
    MenuItem(380, 295, "Down"),
    MenuItem(380, 315, "Left"),
    MenuItem(380, 335, "Right"),
    MenuItem(380, 355, "Shoot"),
    MenuItem(380, 375, "Bomb"),
    MenuItem(380, 395, "Slow")
], undefined, function () {
    optionMenu.load()
}, function () {
    layerTitle.save();
    layerTitle.font = "17px Comic Sans MS";
    layerTitle.shadowBlur = 3;
    layerTitle.fillStyle = "rgb(168,24,33)";
    layerTitle.shadowColor = "black";
    layerTitle.fillText(options.KeyBoard.Up, 500, 275);
    layerTitle.fillText(options.KeyBoard.Down, 500, 295);
    layerTitle.fillText(options.KeyBoard.Left, 500, 315);
    layerTitle.fillText(options.KeyBoard.Right, 500, 335);
    layerTitle.fillText(options.KeyBoard.Shoot, 500, 355);
    layerTitle.fillText(options.KeyBoard.Bomb, 500, 375);
    layerTitle.fillText(options.KeyBoard.Slow, 500, 395);
    layerTitle.restore();
    rendererEntity()
}, function (self) {
    handler = function () {
        self.tick();
        self.draw()
    }
});
const optionMenu = new Menu([
    MenuItem(380, 275, "Player"),
    MenuItem(380, 295, "BGM Volume", 150),
    MenuItem(380, 315, "S.E.Volume", 150),
    MenuItem(380, 335, "KeyBoard Options"),
    MenuItem(380, 355, "Reset"),
    MenuItem(380, 375, "Save"),
    MenuItem(380, 395, "Quit")
], function (selectedIndex) {
    switch (selectedIndex) {
        case 3:
            keyBoardOptionMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 4:
            if (confirm("确定要重置设置吗？")) {
                resetAndSaveConfig()
            }
            mainMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 5:
            saveConfigToFile();
            mainMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 6:
            mainMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        default:
            ASSETS.SOUND.invalid.currentTime = 0;
            _ = ASSETS.SOUND.invalid.play()
    }
}, function (selectedIndex) {
    if (selectedIndex === 6) {
        mainMenu.load();
    } else {
        return 6
    }
}, function (self) {
    if (session.debugFlag) {
        layerEffect.save();
        layerEffect.font = "10px Comic Sans MS";
        layerEffect.fillStyle = "white";
        layerEffect.fillText("NodeWebkit Version " + process.versions["node-webkit"], 0, 10);
        layerEffect.fillText("Chromium Version " + process.versions["chromium"], 0, 20);
        layerEffect.restore()
    }
    layerTitle.save();
    layerTitle.font = "17px Comic Sans MS";
    layerTitle.shadowBlur = 3;
    for (let i = 1; i < 8; i++) {
        layerTitle.fillStyle = "rgb(168,24,33)";
        layerTitle.shadowColor = "black";
        if (options.Player === i) {
            layerTitle.fillStyle = "rgb(255,255,255)";
            layerTitle.shadowColor = "red";
        }
        layerTitle.fillText(i + "", 420 + 20 * i, 275)
    }
    if (self.selectedIndex === 1) {
        layerTitle.fillStyle = "rgb(255,255,255)";
        layerTitle.shadowColor = "red";
    } else {
        layerTitle.fillStyle = "rgb(168,24,33)";
        layerTitle.shadowColor = "black";
    }
    layerTitle.fillText(options.Volume.BGM + "%", 500, 295);
    if (self.selectedIndex === 2) {
        layerTitle.fillStyle = "rgb(255,255,255)";
        layerTitle.shadowColor = "red";
    } else {
        layerTitle.fillStyle = "rgb(168,24,33)";
        layerTitle.shadowColor = "black";
    }
    layerTitle.fillText(options.Volume.SE + "%", 500, 315);
    layerTitle.restore();
    switch (self.selectedIndex) {
        case 0:
            if (session.keys.has("ArrowLeft".toLowerCase())) {
                session.keys.delete("ArrowLeft".toLowerCase());
                if (options.Player > 1) {
                    options.Player--;
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            } else if (session.keys.has("ArrowRight".toLowerCase())) {
                session.keys.delete("ArrowRight".toLowerCase());
                if (options.Player < 7) {
                    options.Player++;
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            }
            break;
        case 1:
            if (session.keys.has("ArrowLeft".toLowerCase())) {
                session.keys.delete("ArrowLeft".toLowerCase());
                if (options.Volume.BGM >= 5) {
                    options.Volume.BGM -= 5;
                    audioObserver.dispatchEvent(EVENT_MAPPING.volumeChange, {type: "BGM"});
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            } else if (session.keys.has("ArrowRight".toLowerCase())) {
                session.keys.delete("ArrowRight".toLowerCase());
                if (options.Volume.BGM <= 95) {
                    options.Volume.BGM += 5;
                    audioObserver.dispatchEvent(EVENT_MAPPING.volumeChange, {type: "BGM"});
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            }
            break;
        case 2:
            if (session.keys.has("ArrowLeft".toLowerCase())) {
                session.keys.delete("ArrowLeft".toLowerCase());
                if (options.Volume.SE >= 5) {
                    options.Volume.SE -= 5;
                    audioObserver.dispatchEvent(EVENT_MAPPING.volumeChange, {type: "SE"});
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            } else if (session.keys.has("ArrowRight".toLowerCase())) {
                session.keys.delete("ArrowRight".toLowerCase());
                if (options.Volume.SE <= 95) {
                    options.Volume.SE += 5;
                    audioObserver.dispatchEvent(EVENT_MAPPING.volumeChange, {type: "SE"});
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            }
    }
    rendererEntity()
}, function (self) {
    handler = function () {
        self.tick();
        self.draw()
    };
});
let style;
const mainMenu = new Menu([
    MenuItem(480, 275, "Game Start"),
    MenuItem(480, 295, "Extra Start"),
    MenuItem(480, 315, "Spell Practice"),
    MenuItem(480, 335, "Practice Start"),
    MenuItem(480, 355, "Replay"),
    MenuItem(480, 375, "Play Data"),
    MenuItem(480, 395, "Music Room"),
    MenuItem(480, 415, "Option"),
    MenuItem(480, 435, "Quit")
], function (selectedIndex) {
    switch (selectedIndex) {
        case 2:
            spellPracticeMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 3:
            practiceStartMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 4:
            replayMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 6:
            musicRoomMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 7:
            optionMenu.load();
            ASSETS.SOUND.ok.currentTime = 0;
            _ = ASSETS.SOUND.ok.play();
            break;
        case 8:
            win.close();
            break;
        default:
            ASSETS.SOUND.invalid.currentTime = 0;
            _ = ASSETS.SOUND.invalid.play()
    }
}, function (selectedIndex) {
    if (selectedIndex === 8) {
        win.close();
        return 0
    } else {
        return 8
    }
}, function (self) {
    const layers = session.title?.layers;
    if (layers) {
        for (let layer of layers) {
            layerStage.save();
            layerStage.drawImage(layer.img, layer.current.X, layer.current.Y, layer.width ?? WIDTH, layer.height ?? HEIGHT);
            if (layer.speed) {
                layer.current.X += layer.speed.x;
                layer.current.Y += layer.speed.y;
                if (layer.current.Y >= 0) {
                    layer.current.Y -= layer.loop
                }
            }
            layerStage.restore()
        }
    }
    switch (self.selectedIndex) {
        case 2:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("符卡练习", WIDTH / 2, HEIGHT - 10);
            layerStage.restore();
            break;
        case 3:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("关卡练习", WIDTH / 2, HEIGHT - 10);
            layerStage.restore();
            break;
        case 4:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("回放录像", WIDTH / 2, HEIGHT - 10);
            layerStage.restore();
            break;
        case 6:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("欣赏音乐", WIDTH / 2, HEIGHT - 10);
            layerStage.restore();
            break;
        case 7:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("各种设置", WIDTH / 2, HEIGHT - 10);
            layerStage.restore();
            break;
        case 8:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("退出游戏", WIDTH / 2, HEIGHT - 10);
            layerStage.restore();
            break;
        default:
            layerStage.save();
            layerStage.fillStyle = "white";
            layerStage.shadowColor = "black";
            layerStage.shadowBlur = 2;
            layerStage.font = "10px Comic Sans MS";
            layerStage.fillText("开发中", WIDTH / 2, HEIGHT - 10);
            layerStage.restore()
    }
    session.Idle++;
    if (session.Idle > options.Idle) {
        session.Idle = 0;
        const files = fs.readdirSync("./assets/demos/");
        const table = [];
        const filesLen = files.length;
        for (let i = 0; i < filesLen; i++) {
            if (/^\d+\.json$/.test(files[i].toLowerCase())) {
                table.push(files[i].toLowerCase())
            }
        }
        const demo = "./assets/demos/" + table[~~(Math.random() * table.length)];
        if (fs.existsSync(demo)) {
            session.demoPlay = true;
            doReplay(JSON.parse(fs.readFileSync(demo).toString()), true)
        }
    }
    updateEntity()
}, function (self) {
    if (options.Style === "auto") {
        const keys = [];
        for (const key in resources.Style) {
            if (resources.Style.hasOwnProperty(key)) {
                keys.push(key)
            }
        }
        style = resources.Style[keys[~~(Math.random() * keys.length)]];
        session.loading = newImage(style.loading);
        session.loadingBg = newImage(style.loadingBg);
        session.title.bgm.head = newAudio(style.title.bgm.head);
        session.title.bgm.loop = newAudio(style.title.bgm.loop);
    }
    transitions(function () {
        self.tick();
        self.draw()
    }, function () {
        const length = self.menuList.length;
        for (let i = 0; i < length; i++) {
            self.menuList[i].fake = 150;
        }
        if (style?.title?.effect === "StarSky") {
            while (entities.length < 256) {
                entities.push(MenuStar(Math.random() * WIDTH, Math.random() * HEIGHT, 0, 0.5, Math.random() * 2))
            }
        }
        changeBGM(session.title.bgm)
    })
});

session.Idle = 0;

function runSpellPractice() {
    if (session.stage.tick(session.stage)) {
        session.stage.draw(session.stage)
    } else if (session.stage.restart) {
        transitions(runSpellPractice, session.stage.restartCallBack)
    } else {
        mainMenu.load();
        session.stage = null
    }
}

let restore = false;
const imageOfError = newImage(resources.Images.error);

function error(e, fatal = false) {
    console.error(e);
    layerStage.clearRect(0, 0, WIDTH, HEIGHT);
    clearScreen();
    cancelAllSound();
    layerStage.save();
    layerStage.font = "10px sans-serif";
    layerStage.fillStyle = "red";
    let y = 10;
    if (fatal) {
        layerStage.fillText("哦豁，完蛋：", 2, y);
        layerStage.fillText("[!]这是一个致命错误", 2, 475)
    } else {
        layerStage.drawImage(imageOfError, WIDTH - imageOfError.width, HEIGHT - imageOfError.height);
        layerStage.fillText("啊这，发生了一点错误：", 2, y);
        layerStage.fillText("按[Z]返回主菜单", 2, 461);
        layerStage.fillText("按[Esc]退出", 2, 475);
        restore = true
    }
    e.stack.split("\n").forEach(function (s) {
        y += 10;
        layerStage.fillText(s, 2, y)
    });
    layerStage.restore();
}

const loadingBgm = newAudio(resources.Sounds.loading, 100, "BGM");

function transitions(f, callback) {
    ob.clearEventListener();
    ob.addEventListener(EVENT_MAPPING.shift, function () {
        session.slow = true
    });
    ob.addEventListener(EVENT_MAPPING.unshift, function () {
        session.slow = false
    });
    for (let i = 0; i < entities.length; i++) {
        entities[i].tags.add(TAGS.death)
    }
    tickingEntity();
    entities.length = 0;
    loadSaveFromFile();
    session.highScore = profile.highScore;
    if (typeof callback === "function") {
        callback()
    }
    loadingScreenCache.slice(0);
    if (typeof f === "function") {
        handler = function () {
            loading(f)
        };
        _ = loadingBgm.play();
    }
}

let handler, frames = 0;

function run() {
    try {
        if (window.paused) {
            return
        }
        clearScreen();
        if (session.keys.has("f3")) {
            session.debugFlag = !session.debugFlag;
            session.keys.delete("f3")
        }
        if (session.keys.has("f5")) {
            location.reload();
            session.keys.delete("f5")
        }
        if (session.debugFlag) {
            layerTitle.save();
            layerTitle.font = "10px Comic Sans MS";
            layerTitle.fillStyle = "white";
            layerTitle.fillText("调试屏幕已开启", 0, HEIGHT - 1);
            layerTitle.restore()
        }
        if (session.keys.has("f11")) {
            // idea 挨打
            session.keys.delete("f11");
            win["toggleFullscreen"]()
        }
        if (win["isFullscreen"]) {
            document.body.style.cursor = "none"
        } else if (document.body.style) {
            document.body.style = null
        }
        handler();
        if (entities.length > entityCountSecMax) {
            entities.length = entityCountSecMax
        }
        if (!session.stage || session.stage.paused === false && session.stage.end === false) {
            const currentBGM = session.currentBGM;
            if (currentBGM) {
                if (currentBGM.dom.paused || currentBGM.dom.currentTime + 0.12 > currentBGM.dom.duration) {
                    if (currentBGM.loop && currentBGM.paused > 1) {
                        if (currentBGM.loop.paused || currentBGM.loop.currentTime + 0.1 > currentBGM.loop.duration) {
                            currentBGM.loop.currentTime = 0;
                            _ = currentBGM.loop.play()
                        }
                    } else {
                        _ = currentBGM.dom.play();
                        currentBGM.paused = currentBGM.paused + 1 || 2;
                    }
                } else {
                    if (currentBGM.dom.currentTime > currentBGM.leaveTime) {
                        currentBGM.dom.currentTime = currentBGM.loopTime
                    }
                    if (!currentBGM.loop.paused) {
                        _ = currentBGM.loop.pause();
                        currentBGM.loop.currentTime = 0
                    }
                }
            }
        }
        killAnotherBGM();
        frames++;
        nextFrame(run)
    } catch (e) {
        error(e)
    }
}

let t = 2, tsp = 0.1;
let deg = 0;

function loading(f) {
    try {
        clearScreen();
        try {
            layerStage.drawImage(session.loadingBg, 0, 0)
        } catch (e) {
        }
        if (options.DeveloperMode === true) {
            layerTitle.save();
            layerTitle.fillStyle = "white";
            layerTitle.font = "16px sans-serif";
            layerTitle.shadowColor = "black";
            layerTitle.shadowBlur = 1;
            const len = Math.min(loadingScreenCache.length, Math.ceil(HEIGHT / 18));
            while (len < loadingScreenCache.length) {
                loadingScreenCache.shift()
            }
            for (let i = len - 1; i >= 0; i--) {
                layerTitle.fillText(loadingScreenCache[i], 0, i * 18)
            }
            layerTitle.restore();
        }
        layerStage.save();
        layerStage.globalAlpha = 1 / t;
        t += tsp;
        if (t > 4) {
            tsp = -0.1
        } else if (t < 2) {
            tsp = 0.1
        }
        layerStage.drawImage(session.loading, 0, 0, 128, 64, 480, 400, 128, 64);
        layerStage.translate(580, 433);
        layerStage.rotate(deg);
        layerStage.drawImage(session.loading, 0, 64, 64, 64, -32, -32, 64, 64);
        deg += 6 * L;
        layerStage.restore();
        layerStage.save();
        layerStage.font = "10px Comic Sans MS";
        layerStage.shadowColor = "black";
        layerStage.shadowBlur = 2;
        layerStage.fillStyle = "white";
        layerStage.fillText((session.loadingCount / session.loadingTotal * 100).toFixed() + "%", 0, 479);
        layerStage.restore();
        if (session.loadingCount === session.loadingTotal && loadingBgm.currentTime > 0 && (loadingBgm.paused || options.FastStart) || session?.currentBGM?.dom?.currentTime > 0) {
            if (!loadingBgm.paused) {
                loadingBgm.pause();
                loadingBgm.currentTime = 0;
            }
            handler = f
        }
    } catch (e) {
        error(e);
        handler = function () {
        }
    }
}

let n = 1000;
let mutex = 0;
let dc = 0;
session.maxMutex = 1;

if (typeof options.FrameMax === "number") {
    setInterval(function () {
        if (dc < mutex) {
            dc += mutex
        }
    }, Math.round(n / options.FrameMax))
}

function nextFrame(f) {
    if (session.slowRunning === true) {
        session.slowRunning = false;
        setTimeout(function () {
            nextFrame(f)
        }, 50);
        return
    }
    while (mutex < session.maxMutex) {
        mutex++;
        // 配置文件为整数时idea划线==
        if (options.FrameMax === "auto") {
            requestAnimationFrame(function () {
                mutex--;
                f();
            })
        } else if (typeof options.FrameMax !== "number") {
            throw Error("FrameMax muse be an integer or 'auto'.")
        } else {
            function lock(f) {
                if (dc > 0) {
                    dc--
                    mutex--;
                    f();
                } else {
                    requestAnimationFrame(function () {
                        lock(f)
                    })
                }
            }

            requestAnimationFrame(function () {
                lock(f)
            })
        }
        ob.dispatchEvent(EVENT_MAPPING.load)
    }
    if (session.keys.has("f2")) {
        saveOrDownload(takeScreenShot(), options.ScreenShot, "Touhou.JS_ScreenShot_" + getValidTimeFileName() + ".png");
        session.keys.delete("f2")
    }
}

function main() {
    try {
        if (document.getElementById('status')) {
            return;
        }
        const icon = document.createElement('link')
        icon.rel = 'shortcut icon'
        icon.href = 'assets/index.png'
        document.head.appendChild(icon)
        const stylesheet = document.createElement('link')
        icon.rel = 'stylesheet'
        icon.href = 'assets/index.css'
        document.head.appendChild(stylesheet)
        const requireECS = 768;
        const status = document.createElement("div");
        status.id = 'status';
        status.style.position = "absolute";
        status.style.bottom = "0";
        status.style.right = "0";
        status.style.fontFamily = "Comic Sans MS";
        status.style.fontSize = "large";
        status.style.zIndex = "65535";
        document.body.append(status);
        if (options.Style === "random" || options.Style === "auto") {
            const keys = [];
            for (const key in resources.Style) {
                if (resources.Style.hasOwnProperty(key)) {
                    keys.push(key)
                }
            }
            style = resources.Style[keys[~~(Math.random() * keys.length)]]
        } else {
            style = resources.Style[options.Style]
        }
        session.loading = newImage(style.loading);
        session.loadingBg = newImage(style.loadingBg);
        session.title = {bgm: {}, layers: []};
        for (const layer of style.title?.layers ?? []) {
            const obj = layer;
            obj.img = newImage(layer.img);
            if (typeof obj["patten"] === "string") {
                const bg = document.createElement("canvas");
                bg.width = WIDTH;
                bg.height = HEIGHT * 2;
                obj.img.addEventListener("load", function () {
                    const bgCtx = bg.getContext("2d");
                    bgCtx.fillStyle = layerStage.createPattern(obj.img, obj["patten"]);
                    bgCtx.fillRect(0, 0, WIDTH, HEIGHT * 2);
                    obj.img = bg
                })
            }
            obj.current = layer.current ?? {
                X: 0, Y: 0
            };
            session.title.layers.push(obj)
        }
        session.title.bgm = ASSETS.SOUND[style.title.bgm]
        let timestamp = 0;
        if (entityCountSecMax && entityCountSecMax >= requireECS && entityCountSecMax <= 4294967295) {
            setInterval(function () {
                const time = new Date().getTime();
                let fps = Math.floor(frames / ((time - timestamp) / 1000)), fpsColor = "white",
                    bcs = entities.length, bcsColor = "white";
                if (fps < 20) {
                    fpsColor = "orange"
                } else if (fps < 40) {
                    fpsColor = "blue"
                }
                if (bcs > entityCountSecMax * 3 / 4) {
                    bcsColor = "orange"
                } else if (bcs > entityCountSecMax / 2) {
                    bcsColor = "blue"
                }
                status.innerHTML =
                    "<span style='color:" + fpsColor + "'>" + fps + "FPS</span>" +
                    "<span style='color:black'>|</span>" +
                    "<span style='color:" + bcsColor + "'>" + bcs + "ECS</span>";
                timestamp = time;
                if (options.FrameMax !== frames) {
                    n = 1000 * frames / options.FrameMax
                }
                frames = 0;
            }, 1000);
            document.addEventListener("keydown", function (e) {
                e = e || window["event"];
                session.Idle = 0;
                if (session.demoPlay) {
                    if (session.stage) {
                        session.stage.end = true
                    } else {
                        session.demoPlay = false
                    }
                }
                const key = e.key.toLowerCase();
                if (ignoreKeys.has(key)) {
                    return
                } else {
                    ignoreKeys.add(key)
                }
                if (key === options.KeyBoard.Slow.toLowerCase() && !session.replaying) {
                    ob.dispatchEvent(EVENT_MAPPING.shift)
                }
                if (restore) {
                    if (key === "z") {
                        restore = false;
                        mainMenu.load();
                        ASSETS.SOUND.ok.currentTime = 0;
                        _ = ASSETS.SOUND.ok.play();
                        nextFrame(run)
                    } else if (key === "escape") {
                        win.close()
                    }
                    return
                }
                session.keys.add(key)
            });
            document.addEventListener("keyup", function (e) {
                e = e || window["event"];
                session.Idle = 0;
                const key = e.key.toLowerCase();
                if (ignoreKeys.has(key)) {
                    ignoreKeys.delete(key)
                }
                session.keys.delete(key);
                if (key === options.KeyBoard.Slow.toLowerCase() && !session.replaying) {
                    ob.dispatchEvent(EVENT_MAPPING.unshift)
                }
            });
            mainMenu.load();
            // 仅用于启动
            if (options.FullScreen === true) {
                win["enterFullscreen"]()
            }
            nextFrame(run)
        } else {
            error(new Error("ConfigValueError: 'EntityCountSecMax' must be an integer from " + requireECS + "~4294967295."), true)
        }
    } catch (e) {
        console.error(e);
        if (confirm(e.message)) {
            win.close();
        }
    }
}

main();