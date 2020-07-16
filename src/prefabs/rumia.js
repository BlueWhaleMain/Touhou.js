import player_util from "./player_util.js";
import {ABox, clear_screen, entities, getLayer, L, Images, Sounds, Tags, transTo} from "../util.js";
import rumia_ball from "./rumia_ball.js";
import green_orb from "./green_orb.js";

let _;

const rumia_normal = [];
const rumia_left = [];
const rumia_right = [];
Images.player.rumia_shot.addEventListener("load", function () {
    for (let i = 0; i < 8; i++) {
        rumia_normal[i] = document.createElement("canvas");
        rumia_normal[i].width = 32;
        rumia_normal[i].height = 48;
        let ctx = rumia_normal[i].getContext("2d");
        ctx.drawImage(Images.player.rumia_shot, i * 32, 0, 32, 48, 0, 0, 32, 48);
        rumia_left[i] = document.createElement("canvas");
        rumia_left[i].width = 32;
        rumia_left[i].height = 48;
        ctx = rumia_left[i].getContext("2d");
        ctx.drawImage(Images.player.rumia_shot, i * 32, 48, 32, 48, 0, 0, 32, 48);
        rumia_right[i] = document.createElement("canvas");
        rumia_right[i].width = 32;
        rumia_right[i].height = 48;
        ctx = rumia_right[i].getContext("2d");
        ctx.drawImage(Images.player.rumia_shot, i * 32, 96, 32, 48, 0, 0, 32, 48);
    }
});

export default function rumia() {
    const inst = player_util();
    let normal_frame = 0;
    let move_frame = 0;
    inst.addLayer("Rumia", function () {
        const ctx = getLayer(0);
        this.draw = function () {
            if (move_frame) {
                if (move_frame > 0) {
                    ctx.drawImage(rumia_right[Math.floor(move_frame)], inst.X - 16, inst.Y - 24);
                    move_frame -= 0.5
                } else {
                    ctx.drawImage(rumia_left[Math.floor(-move_frame)], inst.X - 16, inst.Y - 24);
                    move_frame += 0.5
                }
                if (move_frame > 7 || move_frame < -7) {
                    move_frame = 0
                }
            } else {
                ctx.drawImage(rumia_normal[Math.floor(normal_frame)], inst.X - 16, inst.Y - 24);
                normal_frame += 0.1;
                if (normal_frame > 7) {
                    normal_frame = 0
                }
            }
            ctx.save();
            ctx.fillStyle = "black";
            ctx.shadowColor = "white";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(inst.X, inst.Y, inst.bombTime + 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore()
        };
    });
    inst.div.addEventListener("left", function () {
        if (move_frame > -7) {
            move_frame--;
        }
    });
    inst.div.addEventListener("right", function () {
        if (move_frame < 7) {
            move_frame++;
        }
    });
    inst.shoot_count = 0;
    inst.power_max = 400;
    inst.shoot = function () {
        let th = 45, tx = 15;
        if (window.slow) {
            th = 1;
            tx = 2
        }
        inst.shoot_count++;
        if (inst.shoot_count > 10) {
            inst.shoot_count = 0
        }
        if (inst.power < 99) {
            entities.push(rumia_ball(inst.X, inst.Y, 0, -40));
        }
        if (inst.power >= 100) {
            entities.push(rumia_ball(inst.X + 10, inst.Y, 0, -40));
            entities.push(rumia_ball(inst.X - 10, inst.Y, 0, -40));
        }
        let temp;
        if (inst.power >= 200 && inst.shoot_count % 2 === 0 || inst.power >= 300) {
            temp = transTo(0, -40, tx * L);
            entities.push(rumia_ball(inst.X - 20, inst.Y, temp[0], temp[1]));
            temp = transTo(0, -40, -tx * L);
            entities.push(rumia_ball(inst.X + 20, inst.Y, temp[0], temp[1]));
        }
        if (inst.power >= 400) {
            temp = transTo(0, -40, th * L);
            entities.push(rumia_ball(inst.X + 20, inst.Y, temp[0], temp[1]));
            temp = transTo(0, -40, -th * L);
            entities.push(rumia_ball(inst.X - 20, inst.Y, temp[0], temp[1]));
        }
    };
    inst.bomb = function () {
        _ = Sounds.cat0.play();
        if (inst.miss) {
            inst.bombTime = 500
        } else {
            inst.bombTime = 300
        }
    };
    inst.bombLay = function () {
        const box = new ABox(inst.bombTime);
        clear_screen(function (entity) {
            if (entity.tags.has(Tags.hostile) && entity.atkBox.isHit(entity.X, entity.Y, inst.X, inst.Y, box)) {
                entities.push(green_orb(entity.X, entity.Y, 0, -2, "small"));
                return true
            }
        });
    };
    inst.bombOut = function () {
        clear_screen(function (entity) {
            if (entity.tags.has(Tags.hostile)) {
                entities.push(green_orb(entity.X, entity.Y, 0, -2, "small", true));
                return true
            }
        });
        _ = Sounds.slash.play()
    };
    return inst
}
