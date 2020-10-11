import {session, getLayer, newAudio, resources, LAYER_MAPPING, HEIGHT} from "./util.js";

let _;
const soundOfSelect = newAudio(resources.Sounds.select);
const soundOfCancel = newAudio(resources.Sounds.cancel);
export default function Menu(menuList, emitHandler, cancelHandler, drawingHandler, callback) {
    this.menuList = menuList;
    this.selectedIndex = 0;
    this.sline = 0;
    this.aline = HEIGHT - 40;
    this.load = function () {
        this.menuList[this.selectedIndex].select();
        if (typeof callback === "function") {
            callback(this)
        }
    };
    this.tick = function () {
        if (session.keys.has("ArrowUp".toLowerCase())) {
            this.menuList[this.selectedIndex].leave();
            if (this.selectedIndex > 0) {
                this.selectedIndex--
            } else {
                this.selectedIndex = this.menuList.length - 1
            }
            this.menuList[this.selectedIndex].select();
            soundOfSelect.currentTime = 0;
            _ = soundOfSelect.play();
            session.keys.delete("ArrowUp".toLowerCase())
        } else if (session.keys.has("ArrowDown".toLowerCase())) {
            this.menuList[this.selectedIndex].leave();
            if (this.selectedIndex < this.menuList.length - 1) {
                this.selectedIndex++
            } else {
                this.selectedIndex = 0
            }
            this.menuList[this.selectedIndex].select();
            soundOfSelect.currentTime = 0;
            _ = soundOfSelect.play();
            session.keys.delete("ArrowDown".toLowerCase())
        } else if (session.keys.has("z")) {
            session.keys.delete("z");
            if (typeof emitHandler === "function") {
                emitHandler(this.selectedIndex)
            }
        } else if (session.keys.has("x")) {
            session.keys.delete("x");
            this.menuList[this.selectedIndex].leave();
            if (typeof cancelHandler === "function") {
                const selectedIndex = cancelHandler(this.selectedIndex);
                if (!isNaN(selectedIndex)) {
                    this.selectedIndex = selectedIndex;
                    this.menuList[selectedIndex].select();
                }
            }
            soundOfCancel.currentTime = 0;
            _ = soundOfCancel.play()
        }
    };
    this.draw = function () {
        const length = this.menuList.length;
        for (let i = 0; i < length; i++) {
            this.menuList[i].draw(this)
        }
        if (typeof drawingHandler === "function") {
            drawingHandler(this)
        }
    }
}
const layerTitle = getLayer(LAYER_MAPPING.TITLE);

export function MenuItem(x = 0, y = 0, context = "", fake = 150, drawingHandler) {
    function unselect(ctx) {
        ctx.font = "17px Comic Sans MS";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgb(168,24,33)";
        ctx.shadowColor = "black";
        return ctx
    }

    function selected(ctx) {
        ctx.font = "17px Comic Sans MS";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "white";
        ctx.shadowColor = "red";
        return ctx
    }

    const inst = {
        X: x,
        Y: y
    };
    inst.fake = fake;
    let wasFake = undefined;
    inst.context = context;
    inst.selected = false;
    inst.select = function (f = selected) {
        inst.initDraw = f;
        wasFake = true;
        inst.selected = true
    };
    inst.leave = function (f = unselect) {
        inst.initDraw = f;
        wasFake = undefined;
        inst.selected = false
    };
    inst.initDraw = unselect;
    inst.draw = function (menu) {
        layerTitle.save();
        inst.initDraw(layerTitle).fillText(inst.context, inst.X + inst.fake, inst.Y - menu.sline);
        layerTitle.restore();
        if (wasFake === false) {
            if (inst.fake > -10) {
                inst.fake -= 2;
            }
            if (inst.fake <= -10) {
                wasFake = true;
            }
        }
        if (wasFake === true) {
            if (inst.fake < 10) {
                inst.fake += 2;
            }
            if (inst.fake >= 10) {
                wasFake = undefined;
            }
        }
        if (wasFake === undefined) {
            if (inst.fake > 0) {
                inst.fake -= inst.fake / 5;
            }
            if (inst.fake < 0) {
                inst.fake += inst.fake / 5;
            }
        }
        if (typeof drawingHandler === "function") {
            drawingHandler(inst, menu)
        }
    };
    return inst
}

export function lightMenuItem(x, y, context, drawingHandler) {
    function unselect(ctx) {
        ctx.font = "17px Comic Sans MS";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "rgb(153,153,153)";
        ctx.shadowColor = "black";
        return ctx
    }

    function selected(ctx) {
        ctx.font = "17px Comic Sans MS";
        ctx.shadowBlur = 3;
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgb(153,153,153)";
        return ctx
    }

    const inst = {
        X: x,
        Y: y
    };
    inst.context = context;
    inst.selected = false;
    inst.select = function (f = selected) {
        inst.initDraw = f;
        inst.selected = true
    };
    inst.leave = function (f = unselect) {
        inst.initDraw = f;
        inst.selected = false
    };
    inst.initDraw = unselect;
    inst.draw = function (menu) {
        if (inst.selected) {
            if (inst.Y > menu.aline) {
                menu.sline = inst.Y - menu.aline
            } else {
                menu.sline = 0
            }
        }
        layerTitle.save();
        inst.initDraw(layerTitle).fillText(inst.context, inst.X, inst.Y - menu.sline);
        layerTitle.restore();
        if (typeof drawingHandler === "function") {
            drawingHandler(inst, menu)
        }
    };
    return inst
}
