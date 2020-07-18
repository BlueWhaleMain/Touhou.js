import prefabs from "../prefabs.js";
import {getLayer} from "../util.js";

const ctx = getLayer(128);
export default function menu_item(x = 0, y = 0, context = "", fake = 300) {
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

    const inst = new prefabs();
    inst.X = x;
    inst.Y = y;
    let was_fake = undefined;
    inst.context = context;
    inst.select = function (f = selected) {
        inst.init_draw = f;
        was_fake = true;
    };
    inst.leave = function (f = unselect) {
        inst.init_draw = f;
        was_fake = undefined;
    };
    inst.init_draw = unselect;
    inst.draw = function () {
        ctx.save();
        inst.init_draw(ctx).fillText(inst.context, inst.X + fake, inst.Y);
        ctx.restore();
        if (was_fake === false) {
            if (fake > -10) {
                fake -= 2;
            }
            if (fake <= -10) {
                was_fake = true;
            }
        }
        if (was_fake === true) {
            if (fake < 10) {
                fake += 2;
            }
            if (fake >= 10) {
                was_fake = undefined;
            }
        }
        if (was_fake === undefined) {
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
