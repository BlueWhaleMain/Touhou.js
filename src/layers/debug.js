/*
 *调试图层，显示判定区域等
 */
import {debugLayerCache, getLayer, L, LAYER_MAPPING, session} from "../util.js";

const r90 = 90 * L;
const layerUI = getLayer(LAYER_MAPPING.UI);
export default function debug() {
    let draw, cacheCtx;
    this.draw = function (inst) {
        if (session.debugFlag === true && session.developerMode === true) {
            if (inst.atkBox && inst.atkBox.name === "ABox") {
                if (!debugLayerCache.ABox[inst.atkBox.r]) {
                    debugLayerCache.ABox[inst.atkBox.r] = document.createElement("canvas");
                    debugLayerCache.ABox[inst.atkBox.r].width = inst.atkBox.r + inst.atkBox.r + 2;
                    debugLayerCache.ABox[inst.atkBox.r].height = inst.atkBox.r + inst.atkBox.r + 2;
                    cacheCtx = debugLayerCache.ABox[inst.atkBox.r].getContext("2d");
                    cacheCtx.save();
                    cacheCtx.strokeStyle = "red";
                    cacheCtx.beginPath();
                    cacheCtx.arc(inst.atkBox.r + 1, inst.atkBox.r + 1, inst.atkBox.r, 0, Math.PI * 2);
                    cacheCtx.stroke();
                    cacheCtx.restore()
                }
                draw = debugLayerCache.ABox[inst.atkBox.r];
                layerUI.drawImage(draw, inst.X - inst.atkBox.r - 1, inst.Y - inst.atkBox.r - 1);
            }
            if (inst.components["movable"]) {
                if (!debugLayerCache.LINE[20]) {
                    debugLayerCache.LINE[20] = document.createElement("canvas");
                    debugLayerCache.LINE[20].width = 1;
                    debugLayerCache.LINE[20].height = 20;
                    cacheCtx = debugLayerCache.LINE[20].getContext("2d");
                    cacheCtx.save();
                    cacheCtx.strokeStyle = "white";
                    cacheCtx.beginPath();
                    cacheCtx.moveTo(0, 0);
                    cacheCtx.lineTo(0, 20);
                    cacheCtx.stroke();
                    cacheCtx.restore()
                }
                draw = debugLayerCache.LINE[20];
                layerUI.save();
                layerUI.translate(inst.X, inst.Y);
                layerUI.rotate(Math.atan2(inst.components["movable"].MY, inst.components["movable"].MX) + r90);
                layerUI.drawImage(draw, 0, -20);
                layerUI.restore()
            }
        }
    }
}
