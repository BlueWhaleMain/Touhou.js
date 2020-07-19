import Prefab from "../prefab.js";
import {getLayer} from "../util.js";

const ctx = getLayer(128);
export default function menuItem(x = 0, y = 0, context = "", fake = 300) {
    function unselect(ctx) {
        ctx.font = "34px sans-serif";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgb(168,24,33)";
        ctx.shadowColor = "black";
        return ctx
    }

    function selected(ctx) {
        ctx.font = "34px sans-serif";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.shadowColor = "red";
        return ctx
    }

    const inst = new Prefab(x, y);

    let wasFake = undefined;
    inst.context = context;
    inst.select = function (f = selected) {
        inst.initDraw = f;
        wasFake = true;
    };
    inst.leave = function (f = unselect) {
        inst.initDraw = f;
        wasFake = undefined;
    };
    inst.initDraw = unselect;
    inst.draw = function () {
        ctx.save();
        inst.initDraw(ctx).fillText(inst.context, inst.X + fake, inst.Y);
        ctx.restore();
        if (wasFake === false) {
            if (fake > -10) {
                fake -= 2;
            }
            if (fake <= -10) {
                wasFake = true;
            }
        }
        if (wasFake === true) {
            if (fake < 10) {
                fake += 2;
            }
            if (fake >= 10) {
                wasFake = undefined;
            }
        }
        if (wasFake === undefined) {
            if (fake > 0) {
                fake -= fake / 5;
            }
            if (fake < 0) {
                fake += fake / 5;
            }
        }
    };
    return inst
}
