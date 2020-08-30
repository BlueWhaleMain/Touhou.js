import {
    clearScreen, entities, getLayer, HEIGHT,
    cancelAllSound, WIDTH,
    config, TAGS, session, updateEntity, loadSaveFromFile,
    save, EVENT_MAPPING, takeScreenShot, rendererEntity,
    saveOrDownload, getValidTimeFileName, newAudio,
    resources, resetAndSaveConfig, saveConfigToFile, newImage, audioObserver, GUI_SCREEN, LAYER_MAPPING, tickingEntity
} from "./src/util.js";
import MenuStar from "./src/prefabs/menu_star.js";
import SpellPractice from "./src/stage/spell_practice.js";
import {ob} from "./src/observer.js"
import Menu, {MenuItem, lightMenuItem} from "./src/menu.js";
import Rumia from "./src/prefabs/player/rumia.js";
import bossYukariYakumo from "./src/prefabs/boss/yukari_yakumo.js";
import test1 from "./src/cards/test_1.js";
import test2 from "./src/cards/test_2.js";
import test3 from "./src/cards/test_3.js";
import boundaryBetweenWaveAndParticle from "./src/cards/boundary_between_wave_and_particle.js";
import {SimpleDialogue, title} from "./src/dialogue.js";
import bossKirisameMarisa from "./src/prefabs/boss/kirisame_marisa.js";
import milkyWay from "./src/cards/milky_way.js";
import bossRumia from "./src/prefabs/boss/rumia.js";
import nightBird from "./src/cards/night_bird.js";
import demarcation from "./src/cards/demarcation.js";
import voidDeath from "./src/cards/void_death.js";
import bossPatchouliKnowledge from "./src/prefabs/boss/patchouli_knowledge.js";
import metalFatigue from "./src/cards/metal_fatigue.js";
import mercuryPoison from "./src/cards/mercury_poison.js";
import HakureiReimu from "./src/prefabs/player/hakurei_reimu.js";
import asteroidBelt from "./src/cards/asteroid_belt.js";
import masterSpark from "./src/cards/master_spark.js";
import bossHakureiReimu from "./src/prefabs/boss/hakurei_reimu.js";
import dreamSealLoose from "./src/cards/dream_seal_loose.js";
import dreamSealSilence from "./src/cards/dream_seal_silence.js";
import doubleSpark from "./src/cards/double_spark.js";
import test from "./src/cards/test.js";

const gui = require("nw" + ".gui");
//idea划线
const win = gui["Window"].get();
if (config.PauseOnBlur === true) {
    win.on("blur", function () {
        if (session.stage && session.stage.paused === false) {
            session.stage.pause()
        }
    });
}
let _;
const ignoreKeys = new Set(), entityCountSecMax = config.EntityCountSecMax;
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
        timeout1: newAudio(resources.Sounds.timeout1, 100, "BGM")
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

const musicRoomMenu = new Menu([
    lightMenuItem(140, 125, ASSETS.SOUND.easternNight.name),
    lightMenuItem(140, 145, ASSETS.SOUND.easternNightPractice.name),
    lightMenuItem(140, 165, ASSETS.SOUND.rumia.name),
    lightMenuItem(140, 185, ASSETS.SOUND.hakureiReimu.name),
    lightMenuItem(140, 205, ASSETS.SOUND.kirisameMarisa.name),
    lightMenuItem(140, 225, ASSETS.SOUND.patchouliKnowledge.name),
    lightMenuItem(140, 245, ASSETS.SOUND.yukariYakumo.name),
    lightMenuItem(140, 265, ASSETS.SOUND.th095_04.name),
    lightMenuItem(140, 285, ASSETS.SOUND.failure.name),
], function (selectedIndex) {
    let selectedBgm;
    switch (selectedIndex) {
        case 0:
            selectedBgm = ASSETS.SOUND.easternNight;
            break;
        case 1:
            selectedBgm = ASSETS.SOUND.easternNightPractice;
            break;
        case 2:
            selectedBgm = ASSETS.SOUND.rumia;
            break;
        case 3:
            selectedBgm = ASSETS.SOUND.hakureiReimu;
            break;
        case 4:
            selectedBgm = ASSETS.SOUND.kirisameMarisa;
            break;
        case 5:
            selectedBgm = ASSETS.SOUND.patchouliKnowledge;
            break;
        case 6:
            selectedBgm = ASSETS.SOUND.yukariYakumo;
            break;
        case 7:
            selectedBgm = ASSETS.SOUND.th095_04;
            break;
        case 8:
            selectedBgm = ASSETS.SOUND.failure;
            break;
        default:
            ASSETS.SOUND.invalid.currentTime = 0;
            _ = ASSETS.SOUND.invalid.play();
            return
    }
    if (session.currentBGM) {
        session.currentBGM.dom.pause();
        if (session.currentBGM.loop) {
            session.currentBGM.loop.pause()
        }
    }
    selectedBgm.head.currentTime = 0;
    session.currentBGM = {
        dom: selectedBgm.head,
        loop: selectedBgm.loop,
        leaveTime: selectedBgm.leaveTime,
        loopTime: selectedBgm.loopTime,
        name: selectedBgm.name,
        description: selectedBgm.description
    }
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
            layerTitle.fillText(Math.floor(current / 60) + ":" + Math.round(current % 60) + "/" + Math.floor(total / 60) + ":" + Math.round(total % 60), 522, 100);
            if (session.currentBGM.loop) {
                layerTitle.fillStyle = "red";
                layerTitle.fillRect(400 + 120 * session.currentBGM.dom.duration / total, 90, 1, 10)
            }
        }
        let y = 0;
        for (let i = 0; i < self.menuList.length; i++) {
            layerTitle.fillStyle = "rgb(153,153,153)";
            layerTitle.shadowColor = "black";
            if (self.selectedIndex === i) {
                layerTitle.fillStyle = "white";
                layerTitle.shadowColor = "rgb(153,153,153)";
            }
            y = 125 + i * 20;
            layerTitle.fillText("No." + (i + 1), 60, y)
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

function practiceStartFactory(selectedIndex) {
    let stageMap = [];
    let bgm = false;
    if (selectedIndex === 0) {
        stageMap = function () {
            if (session.selectedPlayer === Rumia) {
                return [
                    bossYukariYakumo(480, -60, 1000, [
                        test1(),
                        test2(),
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
                ]
            } else if (session.selectedPlayer === HakureiReimu) {
                return [
                    bossYukariYakumo(480, -60, 1000, [
                        test1(),
                        test2(),
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
    session.stage = SpellPractice(session.selectedPlayer, stageMap, bgm, function () {
        practiceStartFactory(selectedIndex)
    });
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

function spellPracticeFactory(selectedIndex) {
    const player = session.selectedPlayer;
    let stageMap = [];
    let boss;
    let bgm = false;
    switch (selectedIndex) {
        case 0:
            stageMap = function () {
                boss = bossYukariYakumo(480, -60, 1000, [test1(function (card) {
                    card.noCardFrame = null;
                    card.practice = true
                })]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 1:
            stageMap = function () {
                boss = bossYukariYakumo(480, -60, 1000, [test2(function (card) {
                    card.noCardFrame = null;
                    card.practice = true
                })]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 2:
            stageMap = function () {
                boss = bossYukariYakumo(480, -60, 1000, [test3(function (card) {
                    card.noCardFrame = null;
                    card.practice = true
                })]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 3:
            stageMap = function () {
                boss = bossYukariYakumo(480, -60, 1000, [
                    boundaryBetweenWaveAndParticle(function (cd) {
                        cd.practice = true
                    })]);
                if (session.currentBGM) {
                    _ = session.currentBGM.dom.pause();
                    if (session.currentBGM.loop) {
                        _ = session.currentBGM.loop.pause();
                    }
                }
                ASSETS.SOUND.th095_04.head.currentTime = 0;
                ASSETS.SOUND.th095_04.loop.currentTime = 0;
                session.currentBGM = {
                    dom: ASSETS.SOUND.th095_04.head,
                    loop: ASSETS.SOUND.th095_04.loop,
                    name: ASSETS.SOUND.th095_04.name
                };
                return [boss]
            };
            bgm = true;
            break;
        case 4:
            stageMap = function () {
                boss = bossKirisameMarisa(500, 125, 1200, [
                    milkyWay(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 5:
            stageMap = function () {
                boss = bossKirisameMarisa(500, 125, 1200, [
                    asteroidBelt(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 6:
            stageMap = function () {
                boss = bossKirisameMarisa(500, 125, 1200, [
                    masterSpark(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 7:
            stageMap = function () {
                boss = bossKirisameMarisa(500, 125, 1200, [
                    doubleSpark(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 8:
            stageMap = function () {
                boss = bossRumia(-50, 125, 900, [
                    nightBird(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 9:
            stageMap = function () {
                boss = bossRumia(-50, 125, 900, [
                    demarcation(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 10:
            stageMap = function () {
                boss = bossRumia(-50, 125, 900, [
                    voidDeath(function (cd) {
                        cd.practice = true
                    })
                ]);
                return [boss]
            };
            break;
        case 11:
            stageMap = function () {
                boss = bossPatchouliKnowledge(220, -60, 1000, [
                    metalFatigue(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 12:
            stageMap = function () {
                boss = bossPatchouliKnowledge(220, -60, 1000, [
                    mercuryPoison(function (cd) {
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 13:
            stageMap = function () {
                boss = bossHakureiReimu(480, -60, 1000, [
                    dreamSealLoose(function (cd) {
                        cd.noCardFrame = null;
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        case 14:
            stageMap = function () {
                boss = bossHakureiReimu(480, -60, 1000, [
                    dreamSealSilence(function (cd) {
                        cd.noCardFrame = null;
                        cd.practice = true
                    })
                ]);
                boss.playBGM();
                return [boss]
            };
            bgm = true;
            break;
        default:
            ASSETS.SOUND.invalid.currentTime = 0;
            _ = ASSETS.SOUND.invalid.play();
            return
    }
    session.stage = SpellPractice(player, stageMap, bgm, function () {
        spellPracticeFactory(selectedIndex)
    });
}

const spellPracticeMenu = new Menu([
    lightMenuItem(280, 195, "Test1"),
    lightMenuItem(280, 215, "Test2"),
    lightMenuItem(280, 235, "Test3"),
    lightMenuItem(280, 255, "境符「波与粒的境界」"),
    lightMenuItem(280, 275, "魔符「银河」"),
    lightMenuItem(280, 295, "魔空「小行星带」"),
    lightMenuItem(280, 315, "恋符「极限火花」"),
    lightMenuItem(280, 335, "恋心「二重火花」"),
    lightMenuItem(280, 355, "夜符「夜雀」"),
    lightMenuItem(280, 375, "暗符「境界线」"),
    lightMenuItem(280, 395, "深渊「空亡」"),
    lightMenuItem(280, 415, "金符「金属疲劳」"),
    lightMenuItem(280, 435, "金&水符「水银之毒」"),
    lightMenuItem(280, 455, "灵符「梦想封印　散」"),
    lightMenuItem(280, 475, "散灵「梦想封印　寂」"),
], function (selectedIndex) {
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
        layerTitle.fillStyle = "rgb(153,153,153)";
        layerTitle.shadowColor = "black";
        if (self.selectedIndex === i) {
            layerTitle.fillStyle = "white";
            layerTitle.shadowColor = "rgb(153,153,153)";
        }
        layerTitle.fillText("No." + (i + 1), 200, 195 + i * 20)
    }
    layerTitle.restore();
    rendererEntity()
}, function (self) {
    session.selectedPlayer = Rumia;
    handler = function () {
        self.tick();
        self.draw()
    };
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
    layerTitle.fillText(config.KeyBoard.Up, 500, 275);
    layerTitle.fillText(config.KeyBoard.Down, 500, 295);
    layerTitle.fillText(config.KeyBoard.Left, 500, 315);
    layerTitle.fillText(config.KeyBoard.Right, 500, 335);
    layerTitle.fillText(config.KeyBoard.Shoot, 500, 355);
    layerTitle.fillText(config.KeyBoard.Bomb, 500, 375);
    layerTitle.fillText(config.KeyBoard.Slow, 500, 395);
    layerTitle.restore();
    rendererEntity()
}, function (self) {
    handler = function () {
        self.tick();
        self.draw()
    };
});
const optionMenu = new Menu([
    MenuItem(380, 275, "Player"),
    MenuItem(380, 295, "BGM Volume", 150, function (inst) {
        if (inst.selected) {
            if (ASSETS.SOUND.timeout1.paused) {
                ASSETS.SOUND.timeout1.currentTime = 0;
                _ = ASSETS.SOUND.timeout1.play()
            }
        }
    }),
    MenuItem(380, 315, "S.E.Volume", 150, function (inst) {
        if (inst.selected) {
            if (ASSETS.SOUND.timeout.paused) {
                ASSETS.SOUND.timeout.currentTime = 0;
                _ = ASSETS.SOUND.timeout.play()
            }
        }
    }),
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
        if (config.Player === i) {
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
    layerTitle.fillText(config.Volume.BGM + "%", 500, 295);
    if (self.selectedIndex === 2) {
        layerTitle.fillStyle = "rgb(255,255,255)";
        layerTitle.shadowColor = "red";
    } else {
        layerTitle.fillStyle = "rgb(168,24,33)";
        layerTitle.shadowColor = "black";
    }
    layerTitle.fillText(config.Volume.SE + "%", 500, 315);
    layerTitle.restore();
    switch (self.selectedIndex) {
        case 0:
            if (session.keys.has("ArrowLeft".toLowerCase())) {
                session.keys.delete("ArrowLeft".toLowerCase());
                if (config.Player > 1) {
                    config.Player--;
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            } else if (session.keys.has("ArrowRight".toLowerCase())) {
                session.keys.delete("ArrowRight".toLowerCase());
                if (config.Player < 7) {
                    config.Player++;
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
                if (config.Volume.BGM >= 5) {
                    config.Volume.BGM -= 5;
                    audioObserver.dispatchEvent(EVENT_MAPPING.volumeChange, {type: "BGM"});
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            } else if (session.keys.has("ArrowRight".toLowerCase())) {
                session.keys.delete("ArrowRight".toLowerCase());
                if (config.Volume.BGM <= 95) {
                    config.Volume.BGM += 5;
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
                if (config.Volume.SE >= 5) {
                    config.Volume.SE -= 5;
                    audioObserver.dispatchEvent(EVENT_MAPPING.volumeChange, {type: "SE"});
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play()
                } else {
                    ASSETS.SOUND.invalid.currentTime = 0;
                    _ = ASSETS.SOUND.invalid.play();
                }
            } else if (session.keys.has("ArrowRight".toLowerCase())) {
                session.keys.delete("ArrowRight".toLowerCase());
                if (config.Volume.SE <= 95) {
                    config.Volume.SE += 5;
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
    updateEntity()
}, function (self) {
    transitions(function () {
        self.tick();
        self.draw()
    }, function () {
        const length = self.menuList.length;
        for (let i = 0; i < length; i++) {
            self.menuList[i].fake = 150;
        }
        while (entities.length < 256) {
            entities.push(MenuStar(Math.random() * WIDTH, Math.random() * HEIGHT, 0, 0.5, Math.random() * 2));
        }
        if (session.currentBGM) {
            _ = session.currentBGM.dom.pause();
            if (session.currentBGM.loop) {
                _ = session.currentBGM.loop.pause();
            }
        }
        ASSETS.SOUND.easternNight.head.currentTime = 0;
        ASSETS.SOUND.easternNight.loop.currentTime = 0;
        session.currentBGM = {
            dom: ASSETS.SOUND.easternNight.head,
            loop: ASSETS.SOUND.easternNight.loop,
            name: ASSETS.SOUND.easternNight.name,
            description: ASSETS.SOUND.easternNight.description
        }
    });
});

function runSpellPractice() {
    if (session.stage.tick(session.stage)) {
        session.stage.draw(session.stage)
    } else {
        if (session.stage.restart) {
            transitions(runSpellPractice, session.stage.restartCallBack)
        } else {
            mainMenu.load();
            session.stage = null
        }
    }
}

let restore = false;
const imageOfError = newImage(resources.Images.error);
const soundOfError = newAudio(resources.Sounds.failure.all, config.Volume.BGM, "BGM");

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
    // 10 37
    soundOfError.currentTime = 0;
    _ = soundOfError.play()
}

const img = document.createElement("img");
img.src = "./assets/images/loading.gif";
img.style.position = "absolute";
img.style.zIndex = "1";
img.style.top = window.innerWidth / 6 + "px";
img.style.left = window.innerHeight / 3 + "px";
img.style.width = window.innerWidth * 0.375 + "px";
img.style.height = window.innerHeight * 11 / 24 + "px";
document.body.appendChild(img);
const loadingBgm = newAudio(resources.Sounds.loading, 100, "BGM");

function transitions(f, callback) {
    ob.clearEventListener();
    for (let i = 0; i < entities.length; i++) {
        entities[i].tags.add(TAGS.death)
    }
    tickingEntity();
    entities.length = 0;
    loadSaveFromFile();
    session.highScore = save.highScore;
    if (typeof callback === "function") {
        callback()
    }
    cancelAllSound();
    if (typeof f === "function") {
        img.style.display = "block";
        handler = function () {
            loading(f)
        };
        session.canceldBGM = session.currentBGM;
        session.currentBGM = null;
        _ = loadingBgm.play();
    }
}

let handler, frames = 0;

function run() {
    try {
        if (session.slowRunning === true) {
            session.slowRunning = false
        } else {
            clearScreen();
            if (session.keys.has("f3")) {
                session.debugFlag = !session.debugFlag;
                session.keys.delete("f3")
            }
            if (session.debugFlag) {
                layerEffect.save();
                layerEffect.font = "10px Comic Sans MS";
                layerEffect.fillStyle = "white";
                layerEffect.fillText("调试屏幕已开启", 0, HEIGHT - 1);
                layerEffect.restore()
            }
            if (session.keys.has("f11")) {
                // idea 挨打
                win["toggleFullscreen"]();
                session.keys.delete("f11")
            }
            handler();
            if (entities.length > entityCountSecMax) {
                entities.length = entityCountSecMax
            }
            if (!session.stage || !session.stage.paused) {
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
                    } else if (currentBGM.dom.currentTime > currentBGM.leaveTime) {
                        currentBGM.dom.currentTime = currentBGM.loopTime
                    }
                }
            }
        }
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
        layerStage.save();
        layerStage.font = "17px sans-serif";
        layerStage.shadowColor = "black";
        layerStage.shadowBlur = 2;
        if (t) {
            layerStage.fillStyle = "rgba(255,255,255," + (1 / t) + ")"
        } else {
            layerStage.fillStyle = "white"
        }
        t += tsp;
        if (t > 4) {
            tsp = -0.1
        } else {
            if (t < 2) {
                tsp = 0.1
            }
        }
        layerStage.fillText("少女祈祷中...", 525, 465);
        layerStage.font = "10px Comic Sans MS";
        layerStage.shadowColor = "black";
        layerStage.shadowBlur = 2;
        layerStage.fillStyle = "white";
        layerStage.fillText((session.loadingCount / session.loadingTotal * 100).toFixed() + "%", 0, 479);
        layerStage.restore();
        if (session.loadingCount === session.loadingTotal && loadingBgm.currentTime > 0 && (loadingBgm.paused || config.FastStart)) {
            if (!loadingBgm.paused) {
                loadingBgm.pause();
                loadingBgm.currentTime = 0;
            }
            img.style.display = "none";
            session.currentBGM = session.canceldBGM;
            session.canceldBGM = null;
            handler = f
        }
    } catch (e) {
        error(e)
    }
}

let n = 1000;

function nextFrame(f) {
    // 配置文件为整数时idea划线==
    if (config.FrameMax === "auto") {
        requestAnimationFrame(f)
    } else if (typeof config.FrameMax !== "number") {
        throw Error("FrameMax muse be an integer or 'auto'.")
    } else {
        setTimeout(f, n / config.FrameMax)
    }
    if (session.keys.has("f2")) {
        saveOrDownload(takeScreenShot(), config["ScreenShot"], "Touhou.JS_ScreenShot_" + getValidTimeFileName() + ".png");
        session.keys.delete("f2")
    }
    ob.dispatchEvent(EVENT_MAPPING.load);
}

try {
    const requireECS = 768;
    const status = document.createElement("div");
    status.style.position = "absolute";
    status.style.bottom = "0";
    status.style.right = "0";
    status.style.fontFamily = "Comic Sans MS";
    status.style.fontSize = "large";
    status.style.zIndex = "65535";
    document.body.append(status);
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
            if (config.FrameMax !== frames) {
                n = 1000 * frames / config.FrameMax
            }
            frames = 0;
        }, 1000);
        document.addEventListener("keydown", function (e) {
            e = e || session["event"];
            const key = e.key.toLowerCase();
            if (ignoreKeys.has(key)) {
                return
            } else {
                ignoreKeys.add(key)
            }
            if (key === config.KeyBoard.Slow.toLowerCase()) {
                session.slow = true
            }
            if (restore) {
                if (key === "z") {
                    restore = false;
                    mainMenu.load();
                    ASSETS.SOUND.ok.currentTime = 0;
                    _ = ASSETS.SOUND.ok.play();
                    nextFrame(run)
                } else {
                    if (key === "escape") {
                        win.close()
                    }
                }
                return
            }
            session.keys.add(key)
        });
        document.addEventListener("keyup", function (e) {
            e = e || session["event"];
            const key = e.key.toLowerCase();
            if (ignoreKeys.has(key)) {
                ignoreKeys.delete(key)
            }
            session.keys.delete(key);
            if (key === config.KeyBoard.Slow.toLowerCase()) {
                session.slow = false
            }
        });
        mainMenu.load();
        // 仅用于启动
        if (config.FullScreen === true) {
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
