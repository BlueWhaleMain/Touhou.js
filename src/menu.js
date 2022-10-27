import {session} from "./util.js";
import {newAudio} from "./resources/sounds";
import {resources} from "./resources/manager";
import {getLayer, HEIGHT, LAYER_MAPPING} from "./screens";

let _;
const soundOfSelect = newAudio(resources.Sounds.select);
const soundOfCancel = newAudio(resources.Sounds.cancel);
export default function Menu(menuList, emitHandler, cancelHandler, drawingHandler, callback) {
    this.menuList = menuList;
    this.selectedIndex = 0;
    this.sline = 0;
    this.aline = HEIGHT - 40;
    this.moveTimeout = 10;
    this.currentMoveTimeout = 0;
    this.lastKey = null
    this.load = function () {
        this.menuList[this.selectedIndex].select();
        if (typeof callback === "function") {
            callback(this)
        }
    };
    this.tick = function () {
        if (session.keys.has(this.lastKey)) {
            if (this.currentMoveTimeout > 0) {
                this.currentMoveTimeout--
            }
        } else {
            this.currentMoveTimeout = 0
            this.lastKey = null
        }
        if (session.keys.has("ArrowUp".toLowerCase())) {
            if (this.currentMoveTimeout > 0) {
                return
            }
            this.menuList[this.selectedIndex].leave();
            if (this.selectedIndex > 0) {
                this.selectedIndex--
            } else {
                this.selectedIndex = this.menuList.length - 1
            }
            this.menuList[this.selectedIndex].select();
            soundOfSelect.currentTime = 0;
            _ = soundOfSelect.play();
            if (this.lastKey === "ArrowUp".toLowerCase()) {
                this.currentMoveTimeout = this.moveTimeout
            } else {
                this.currentMoveTimeout = Math.min(this.moveTimeout * 3, 60)
            }
            this.lastKey = "ArrowUp".toLowerCase()
        } else if (session.keys.has("ArrowDown".toLowerCase())) {
            if (this.currentMoveTimeout > 0) {
                return
            }
            this.menuList[this.selectedIndex].leave();
            if (this.selectedIndex < this.menuList.length - 1) {
                this.selectedIndex++
            } else {
                this.selectedIndex = 0
            }
            this.menuList[this.selectedIndex].select();
            soundOfSelect.currentTime = 0;
            _ = soundOfSelect.play();
            if (this.lastKey === "ArrowDown".toLowerCase()) {
                this.currentMoveTimeout = this.moveTimeout
            } else {
                this.currentMoveTimeout = Math.min(this.moveTimeout * 3, 60)
            }
            this.lastKey = "ArrowDown".toLowerCase()
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
        let arrow = null;
        for (let i = 0; i < length; i++) {
            if (this.canDraw(i)) {
                this.menuList[i].draw(this)
                if (arrow === false) {
                    this.menuList[i - 1].drawUp(this)
                }
                arrow = true
            } else {
                if (arrow === true) {
                    this.menuList[i].drawDown(this)
                    arrow = null
                } else if (arrow === null) {
                    arrow = false
                }
            }
        }
        if (typeof drawingHandler === "function") {
            drawingHandler(this)
        }
    }
    this.canDraw = function (i) {
        const inst = this.menuList[i]
        const drawY = inst.Y - (inst.selected ? (inst.Y > this.aline ? inst.Y - this.aline : 0) : this.sline)
        return drawY >= this.menuList[0].Y && drawY <= this.aline;
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
    inst.drawUp = function (menu) {
    }
    inst.drawDown = function (menu) {
    }
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
                const lane = inst.Y - menu.aline
                if (menu.sline < lane) {
                    menu.sline = lane
                }
            } else {
                if (inst.Y - menu.sline < menu.menuList[0].Y) {
                    menu.sline -= (menu.menuList[0].Y - (inst.Y - menu.sline))
                }
            }
        }
        layerTitle.save();
        inst.initDraw(layerTitle).fillText(inst.context, inst.X, inst.Y - menu.sline);
        layerTitle.restore();
        if (typeof drawingHandler === "function") {
            drawingHandler(inst, menu)
        }
    };
    inst.drawUp = function (menu) {
        layerTitle.save();
        inst.initDraw(layerTitle).fillText("▲", inst.X, inst.Y - menu.sline);
        layerTitle.restore();
    }
    inst.drawDown = function (menu) {
        layerTitle.save();
        inst.initDraw(layerTitle).fillText("▼", inst.X, inst.Y - menu.sline);
        layerTitle.restore();
    }
    return inst
}
