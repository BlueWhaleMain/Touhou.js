import {testStage1} from "./stage1";
import bossRumia from "../../prefabs/boss/rumia";
import moonlightRay from "../../cards/moonlight_ray";
import StageItem from "../../stage_item";
import {entities, GUI_SCREEN, session} from "../../util";
import {SimpleDialogue, title} from "../../dialogue";
import {testStage2} from "./stage2";
import nightBird from "../../cards/night_bird";
import demarcation from "../../cards/demarcation";
import {ASSETS} from "../../resources/assets";
import {cancelAllSound} from "../../resources/sounds";
import bossHakureiReimu from "../../prefabs/boss/hakurei_reimu";
import dreamSealLoose from "../../cards/dream_seal_loose";
import dreamSealSilence from "../../cards/dream_seal_silence";
import bossKirisameMarisa from "../../prefabs/boss/kirisame_marisa";
import milkyWay from "../../cards/milky_way";
import asteroidBelt from "../../cards/asteroid_belt";
import masterSpark from "../../cards/master_spark";
import doubleSpark from "../../cards/double_spark";
import bossPatchouliKnowledge from "../../prefabs/boss/patchouli_knowledge";
import metalFatigue from "../../cards/metal_fatigue";
import mercuryPoison from "../../cards/mercury_poison";
import {testStage9} from "./stage9";
import bossYukariYakumo from "../../prefabs/boss/yukari_yakumo";
import test1 from "../../cards/test_1";
import test2 from "../../cards/test_2";
import {testStage10} from "./stage10";
import test3 from "../../cards/test_3";
import boundaryBetweenWaveAndParticle from "../../cards/boundary_between_wave_and_particle";
import test from "../../cards/test";
import voidDeath from "../../cards/void_death";
import rumiaThink from "../../cards/rumia_think";
import {getLayer, LAYER_MAPPING} from "../../layers/manager";
import {testStage6} from "./stage6";
import bossWriggleNightBug from "../../prefabs/boss/wriggle_nightbug";
import cometsOnTheGround from "../../cards/comets_on_the_ground";
import {testStage5} from "./stage5";
import {testStage3} from "./stage3";
import {testStage4} from "./stage4";
import bossCirno from "../../prefabs/boss/cirno";
import icicleFall from "../../cards/icicle_fall";
import bossYakumoRan from "../../prefabs/boss/yakumo_ran";

const layerEffect = getLayer(LAYER_MAPPING.EFFECT);
const transRumia = document.createElement("canvas");
transRumia.width = 286;
transRumia.height = 373;
ASSETS.IMAGE.rumia.addEventListener("load", function () {
    const rumiaCtx = transRumia.getContext("2d");
    rumiaCtx.translate(286, 0);
    rumiaCtx.scale(-1, 1);
    rumiaCtx.drawImage(ASSETS.IMAGE.rumia, 0, 0);
});

export function testStage(fn) {
    if (fn.getName() === 'Rumia') {
        return [
            testStage1(),
            bossRumia(-50, 125, 300, [
                moonlightRay()
            ], null),
            new StageItem(new Map([[-1, function () {
            }], [1, function (self) {
                session.keys.delete('z')
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "刚刚，那是什么？！"
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
                    }, () => {
                        self.setStep(-1)
                    })
                )
            }]])),
            testStage2(),
            bossRumia(-50, 125, 900, [
                nightBird(),
                demarcation()
            ], [
                SimpleDialogue([{
                    text: "这是..."
                }], [{
                    image: transRumia
                }]),
                SimpleDialogue([{
                    text: "...", fillStyle: "red", X: 300
                }], [{
                    image: ASSETS.IMAGE.rumia,
                    X: 190
                }], function (inst) {
                    inst.target.X = 220;
                    inst.target.Y = 125
                    entities.push(title(function () {
                        const self = {};
                        self.draw = function (self) {
                            layerEffect.save();
                            layerEffect.globalAlpha = self.opacity;
                            layerEffect.font = "14px sans-serif";
                            layerEffect.fillStyle = "white";
                            layerEffect.shadowColor = "black";
                            layerEffect.shadowBlur = 2;
                            layerEffect.fillText("???", 250, 360);
                            layerEffect.restore()
                        };
                        return self
                    }))
                }),
                SimpleDialogue([{
                    text: "？我", fillStyle: "red", X: 300, direction: "rtl"
                }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                    image: ASSETS.IMAGE.rumia,
                    X: 190
                }], function (inst) {
                    cancelAllSound();
                    inst.playBGM()
                })
            ]),
            new StageItem(new Map([[-1, function () {
            }], [1, function (self) {
                session.keys.delete('z')
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "先去问问灵梦吧"
                    }], [{
                        image: transRumia
                    }], null, () => {
                        self.setStep(-1)
                    })
                )
            }]])),
            testStage3(),
            bossCirno(400, -60, 499, [
                icicleFall()
            ]),
            testStage4(),
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
                    text: "发生什么了？"
                }], [{image: transRumia, X: 5}, {
                    image: ASSETS.IMAGE.bossHakureiReimu,
                    X: 190
                }], function (inst) {
                    cancelAllSound();
                    inst.playBGM()
                })
            ]),
            new StageItem(new Map([[-1, function () {
            }], [1, function (self) {
                session.keys.delete('z')
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "所以说发生什么啦"
                    }], [{
                        image: transRumia
                    }])
                )
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "是真的露米娅啊，白忙活一场", fillStyle: "rgb(255,10,17)", X: 200
                    }], [{
                        image: ASSETS.IMAGE.hakureiReimu,
                        X: 190
                    }])
                )
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "自顾自跑了..."
                    }], [{
                        image: transRumia
                    }], null, () => {
                        self.setStep(-1)
                    })
                )
            }]])),
            testStage5(),
            bossWriggleNightBug(100, -30, 500, [
                cometsOnTheGround()
            ], null),
            testStage6(),
            bossKirisameMarisa(500, 125, 1200, [
                milkyWay(),
                asteroidBelt(),
                masterSpark(),
                doubleSpark()
            ], [
                SimpleDialogue([{
                    text: "额..."
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
                    text: "~抓到你了", fillStyle: "gold", X: 200, direction: "rtl"
                }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                    image: ASSETS.IMAGE.kirisameMarisa,
                    X: 190
                }], function (inst) {
                    cancelAllSound();
                    inst.playBGM()
                })
            ]),
            new StageItem(new Map([[-1, function () {
            }], [1, function (self) {
                session.keys.delete('z')
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "完全不对！", fillStyle: "gold", X: 200
                    }], [{
                        image: ASSETS.IMAGE.kirisameMarisa,
                        X: 190
                    }, {
                        image: transRumia, globalAlpha: 0.4, X: 5
                    }])
                )
                session.stage.dialogueScript.push(SimpleDialogue([{
                    text: "大家今天都好奇怪"
                }], [{
                    image: transRumia
                }], null, () => {
                    self.setStep(-1)
                }))
            }]])),
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
                    text: "捉到了", fillStyle: "purple", X: 250
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
            new StageItem(new Map([[-1, function () {
            }], [1, function (self) {
                session.keys.delete('z')
                session.stage.dialogueScript.push(SimpleDialogue([{
                    text: "是抓错东西了吗？"
                }], [{
                    image: transRumia
                }], null, () => {
                    self.setStep(-1)
                }))
            }]])),
            testStage9(),
            bossYakumoRan(480, -60, 800, [
                test1(),
                test2(),
            ], null),
            testStage10(),
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
                }]),
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
            new StageItem(new Map([[-1, function () {
            }], [1, function (self) {
                session.keys.delete('z')
                session.stage.dialogueScript.push(
                    SimpleDialogue([{
                        text: "原来是真的呢，好可惜...", fillStyle: "purple", X: 200
                    }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                        image: ASSETS.IMAGE.yukariYakumo,
                        X: 190
                    }])
                )
                session.stage.dialogueScript.push(SimpleDialogue([{
                    text: "可恶，被耍得团团转"
                }], [{
                    image: transRumia
                }]))
                session.stage.dialogueScript.push(SimpleDialogue([{
                    text: "等等，难道还有假的？！"
                }], [{
                    image: transRumia
                }], null, () => {
                    self.setStep(-1)
                }))
            }]])),
            bossRumia(-50, 125, 1000, [
                voidDeath(function (cd) {
                    cd.practice = true
                }),
                rumiaThink(function (cd) {
                    cd.practice = true
                })
            ], [
                SimpleDialogue([{
                    text: "现在才想起来么，真是个笨蛋呢~", fillStyle: "skyblue", X: 200
                }], [{
                    image: ASSETS.IMAGE.rumia,
                    X: 190
                }], function (inst) {
                    inst.target.X = 220;
                    inst.target.Y = 125
                    entities.push(title(function () {
                        const self = {};
                        self.draw = function (self) {
                            layerEffect.save();
                            layerEffect.globalAlpha = self.opacity;
                            layerEffect.font = "14px sans-serif";
                            layerEffect.fillStyle = "blue";
                            layerEffect.shadowColor = "black";
                            layerEffect.shadowBlur = 2;
                            layerEffect.fillText("BlueWhaleMain", 250, 360);
                            layerEffect.restore()
                        };
                        return self
                    }))
                }),
                SimpleDialogue([{
                    text: "说别人笨蛋的自己才是笨蛋哦", fillStyle: "red", X: 300, direction: "rtl"
                }], [{image: transRumia, globalAlpha: 0.4, X: 5}, {
                    image: ASSETS.IMAGE.rumia,
                    X: 190
                }], function (inst) {
                    cancelAllSound();
                    inst.playBGM()
                })
            ])
        ];
    } else if (fn.getName() === "HakureiReimu") {
        return [
            testStage9(),
            bossYukariYakumo(480, -60, 1000, [
                test1(),
                test2(),
            ]),
            testStage10(),
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
            testStage1(),
            bossRumia(-50, 125, 900, [
                moonlightRay()
            ]),
            testStage2(),
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
}