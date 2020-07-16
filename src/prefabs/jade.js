import prefabs from "../prefabs.js";
import movable from "../components/movable.js";
import bullet from "../components/bullet.js";
import {ABox, arrowTo, drawSticker, getLayer, Sounds, L, Tags} from "../util.js";

let _;

export default function jade(type, color, x, y, mx, my, rotate) {
    const inst = new prefabs();
    inst.addComponent("movable", movable);
    inst.addComponent("bullet", bullet);
    inst.tags.add(Tags.hostile);
    inst.X = x;
    inst.Y = y;
    inst.DX = 0;
    inst.DY = 0;
    inst.type = type;
    inst.color = color;
    inst.sizeBox = new ABox(8);
    inst.atkBox = new ABox(4);
    inst.components["movable"].MX = mx;
    inst.components["movable"].MY = my;
    let symmetric = false;
    const image = drawSticker(type, color);
    switch (type) {
        case "scale":
            break;
        case "ring":
            inst.sizeBox = new ABox(8);
            inst.atkBox = new ABox(6);
            symmetric = true;
            break;
        case "small":
            inst.sizeBox = new ABox(8);
            inst.atkBox = new ABox(6);
            symmetric = true;
            break;
        case "rice":
            break;
        case "suffering":
            break;
        case "bill":
            break;
        case "bullet":
            break;
        case "bacteria":
            break;
        case "needle":
            break;
        case "star":
            inst.sizeBox = new ABox(8);
            inst.atkBox = new ABox(6);
            break;
        case "ice":
            break;
        case "point":
            break;
        case "shiji":
            break;
        case "coin":
            inst.sizeBox = new ABox(8);
            inst.atkBox = new ABox(6);
            break;
        case "arrow":
            inst.Y -= 8;
            inst.DY = 8;
            break;
        case "orb":
            inst.sizeBox = new ABox(16);
            inst.atkBox = new ABox(8);
            symmetric = true;
            break;
        case "big_star":
            inst.sizeBox = new ABox(16);
            inst.atkBox = new ABox(8);
            break;
        case "knife":
            inst.sizeBox = new ABox(16);
            inst.atkBox = new ABox(8);
            break;
        case "heart":
            inst.sizeBox = new ABox(16);
            inst.atkBox = new ABox(10);
            break;
        case "butterfly":
            inst.sizeBox = new ABox(16);
            inst.atkBox = new ABox(8);
            break;
        case "oval":
            inst.sizeBox = new ABox(16);
            inst.atkBox = new ABox(7);
            break;
        case "big":
            inst.sizeBox = new ABox(32);
            inst.atkBox = new ABox(14);
            break;
        default:
            throw new Error("JadeType: " + type + " is not supported.")
    }
    inst.addLayer("Jade", function () {
        const ctx = getLayer(0);
        const r90 = 90 * L;
        this.draw = function (inst) {
            if (rotate === undefined && !symmetric) {
                rotate = Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX) + r90
            }
            let draw;
            if (inst.components["bullet"].graze_state) {
                draw = image.graze
            } else {
                draw = image.layer0
            }
            if (rotate) {
                ctx.save();
                ctx.translate(inst.X + inst.DX, inst.Y + inst.DY);
                ctx.rotate(rotate);
                ctx.drawImage(draw, -inst.sizeBox.r, -inst.sizeBox.r);
                ctx.restore()
            } else {
                ctx.drawImage(draw, inst.X + inst.DX - inst.sizeBox.r, inst.Y + inst.DY - inst.sizeBox.r);
            }
        }
    });
    inst.spy = function (delay, target, speed) {
        inst.addComponent("spy_" + delay, function () {
            this.delay = delay;
            this.tick = function (inst) {
                inst.delay--;
                if (inst.delay === 0) {
                    if (!speed) {
                        speed = arrowTo(inst.X, inst.Y, player.X, player.Y, Math.sqrt(Math.pow(inst.components["movable"].MX, 2) + Math.pow(inst.components["movable"].MY, 2)))
                    }
                    inst.components["movable"].MX = speed[0];
                    inst.components["movable"].MY = speed[1];
                    Sounds.change_track.currentTime = 0;
                    _ = Sounds.change_track.play();
                    inst.removeComponent("spy_" + delay)
                }
            }
        });
        return inst
    };
    return inst
}
