import PlayerUtil from "../player_util.js";
import {
    ABox,
    RBox,
    clearEntity,
    entities,
    getLayer,
    L,
    Images,
    Sounds,
    Tags,
    transTo,
    boss,
    eventListenerObject
} from "../../util.js";
import rumiaBall from "../rumia_ball.js";
import greenOrb from "../green_orb.js";

let _;

const ctx = getLayer(0);
const ctx1 = getLayer(1);
const rumiaNormal = [];
const rumiaLeft = [];
const rumiaRight = [];
Images.player.rumiaShot.addEventListener("load", function () {
    for (let i = 0; i < 8; i++) {
        rumiaNormal[i] = document.createElement("canvas");
        rumiaNormal[i].width = 32;
        rumiaNormal[i].height = 48;
        let ctx = rumiaNormal[i].getContext("2d");
        ctx.drawImage(Images.player.rumiaShot, i * 32, 0, 32, 48, 0, 0, 32, 48);
        rumiaLeft[i] = document.createElement("canvas");
        rumiaLeft[i].width = 32;
        rumiaLeft[i].height = 48;
        ctx = rumiaLeft[i].getContext("2d");
        ctx.drawImage(Images.player.rumiaShot, i * 32, 48, 32, 48, 0, 0, 32, 48);
        rumiaRight[i] = document.createElement("canvas");
        rumiaRight[i].width = 32;
        rumiaRight[i].height = 48;
        ctx = rumiaRight[i].getContext("2d");
        ctx.drawImage(Images.player.rumiaShot, i * 32, 96, 32, 48, 0, 0, 32, 48);
    }
});

export default function Rumia() {
    const inst = PlayerUtil();
    let normalFrame = 0;
    let moveFrame = 0;
    inst.hitBox = new ABox(2);
    inst.grazeBox = new RBox(32, 48);
    inst.pickBox = new ABox(40);
    inst.sizeBox = new RBox(32, 48);
    inst.pickLine = 3 / 4;
    inst.inScreen();
    inst.addComponent("Rumia", function () {
        this.tick = function () {
            if (textureOpacity > 0) {
                textureLayout -= 2.5;
                textureOpacity += layout;
                if (textureOpacity > 1 && textureLayout < 840) {
                    textureOpacity = 1;
                    layout = -0.01
                }
            }
            if (inst.hideTime > 0) {
                return
            }
            if (moveFrame) {
                if (moveFrame > 0) {
                    moveFrame -= 0.5
                } else {
                    moveFrame += 0.5
                }
                if (moveFrame > 7 || moveFrame < -7) {
                    moveFrame = 0
                }
            } else {
                normalFrame += 0.1;
                if (normalFrame > 7) {
                    normalFrame = 0
                }
            }
        }
    });
    inst.addLayer("Rumia", function () {
        this.draw = function () {
            if (textureOpacity > 0) {
                ctx1.save();
                ctx1.globalAlpha = textureOpacity;
                ctx1.drawImage(Images.bossRumia, 50, textureLayout, 572, 746);
                ctx1.restore()
            }
            if (moveFrame) {
                if (moveFrame > 0) {
                    ctx.drawImage(rumiaRight[Math.floor(moveFrame)], inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
                } else {
                    ctx.drawImage(rumiaLeft[Math.floor(-moveFrame)], inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
                }
            } else {
                ctx.drawImage(rumiaNormal[Math.floor(normalFrame)], inst.X - 16, inst.Y - 24 + inst.hideTime * 0.5)
            }
            if (inst.bombTime) {
                ctx.save();
                ctx.fillStyle = "black";
                ctx.shadowColor = "white";
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(inst.X, inst.Y, inst.bombTime + 1, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.restore()
            }
        }
    });
    eventListenerObject.addEventListener("left", function () {
        if (inst.hideTime > 0) {
            return
        }
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.X -= 2
        } else {
            inst.X -= 4.5
        }
        if (moveFrame > -7) {
            moveFrame--;
        }
        inst.inScreen()
    });
    eventListenerObject.addEventListener("right", function () {
        if (inst.hideTime > 0) {
            return
        }
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.X += 2
        } else {
            inst.X += 4.5
        }
        if (moveFrame < 7) {
            moveFrame++;
        }
        inst.inScreen()
    });
    eventListenerObject.addEventListener("up", function () {
        if (inst.hideTime > 0) {
            return
        }
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.Y -= 2
        } else {
            inst.Y -= 4.5
        }
        inst.inScreen()
    });
    eventListenerObject.addEventListener("down", function () {
        if (inst.hideTime > 0) {
            return
        }
        if (inst.miss) {
            return
        }
        if (window.slow) {
            inst.Y += 2
        } else {
            inst.Y += 4.5
        }
        inst.inScreen()
    });
    eventListenerObject.addEventListener("shoot", function () {
        if (inst.hideTime > 0) {
            return
        }
        if (inst.shootDelay === 0) {
            let th = 45, tx = 15;
            if (window.slow) {
                th = 1;
                tx = 2
            }
            inst.shootCount++;
            if (inst.shootCount > 1) {
                inst.shootCount = 0
            }
            if (inst.power < 99) {
                entities.push(rumiaBall(inst.X, inst.Y, 0, -40));
            }
            if (inst.power >= 100) {
                entities.push(rumiaBall(inst.X + 10, inst.Y, 0, -40));
                entities.push(rumiaBall(inst.X - 10, inst.Y, 0, -40));
            }
            let temp;
            if (inst.power >= 200 && inst.shootCount % 2 === 0 || inst.power >= 300) {
                temp = transTo(0, -40, tx * L);
                entities.push(rumiaBall(inst.X - 15, inst.Y + 5, temp[0], temp[1]));
                temp = transTo(0, -40, -tx * L);
                entities.push(rumiaBall(inst.X + 15, inst.Y + 5, temp[0], temp[1]));
            }
            if (inst.power >= 400) {
                temp = transTo(0, -40, th * L);
                entities.push(rumiaBall(inst.X + 20, inst.Y + 10, temp[0], temp[1]));
                temp = transTo(0, -40, -th * L);
                entities.push(rumiaBall(inst.X - 20, inst.Y + 10, temp[0], temp[1]));
            }
            inst.shootDelay = 6;
            window.score += 100;
            Sounds.shoot.currentTime = 0;
            _ = Sounds.shoot.play()
        }
    });
    inst.bombUsed = false;
    let textureLayout = 400;
    let textureOpacity = 0;
    let layout = 0.02;
    eventListenerObject.addEventListener("bomb", function () {
        if (inst.hideTime > 0 || inst.bombUsed) {
            return
        }
        if (inst.bombCount > 0 && inst.bombTime < 0) {
            inst.bombUsed = true
        }
    });
    inst.shootCount = 0;
    inst.powerMax = 400;
    inst.callback.bomb = function () {
        textureOpacity = 0.6;
        Sounds.cat0.currentTime = 0;
        _ = Sounds.cat0.play();
    };
    inst.callback.normalBomb = function () {
        inst.bombTime = 210
    };
    inst.callback.missBomb = function () {
        inst.bombTime = 400
    };
    inst.callback.bombLay = function () {
        inst.indTime = 250;
        const box = new ABox(inst.bombTime);
        clearEntity(function (entity) {
            if (entity.tags.has(Tags.hostile) && entity.atkBox.isHit(entity.X, entity.Y, inst.X, inst.Y, box)) {
                entities.push(greenOrb(entity.X, entity.Y, 0, -2, "small"));
                return true
            }
        });
        for (let i = 0; i < boss.length; i++) {
            let b = boss[i];
            if (box.isHit(inst.X, inst.Y, b.X, b.Y, b.atkBox)) {
                b.components["health"].doDelta(-Math.floor(inst.bombTime / 100))
            }
        }
    };
    inst.callback.bombOut = function () {
        textureOpacity = 0;
        textureLayout = 400;
        layout = 0.02;
        clearEntity(function (entity) {
            if (entity.tags.has(Tags.hostile)) {
                entities.push(greenOrb(entity.X, entity.Y, 0, -2, "small", true));
                return true
            }
        });
        for (let i = 0; i < boss.length; i++) {
            boss[i].components["health"].doDelta(-100)
        }
        _ = Sounds.slash.play()
    };
    return inst
}
