import {session, TAGS} from "./util.js";
import debug from "./layers/debug";

export default function Prefab(x, y) {
    this.X = 0 || x;
    this.Y = 0 || y;
    this.tags = new Set();
    this.componentsShadow = new Set();
    this.components = {};
    this.tick = function () {
        for (let componentsShadow of this.componentsShadow) {
            this.components[componentsShadow].tick(this)
        }
        return !this.tags.has(TAGS.death)
    };
    this.renderers = {};
    this.renderersShadow = new Set();
    this.draw = function () {
        for (let renderersShadow of this.renderersShadow) {
            this.renderers[renderersShadow].draw(this)
        }
    };
    if (session.developerMode === true) {
        this.removeLayer('debug')
        this.addLayer('debug', debug)
    }
}
Prefab.prototype.addComponent = function (componentName, fn) {
    if (this.componentsShadow.has(componentName)) {
        throw new Error("Component: " + componentName + " is already exist!")
    }
    this.components[componentName] = new fn(this);
    this.componentsShadow.add(componentName);
    console.assert(this.components[componentName], "Could not load component " + componentName)
};
Prefab.prototype.removeComponent = function (componentName) {
    if (!this.componentsShadow.has(componentName)) {
        return
    }
    this.components[componentName] = null;
    this.componentsShadow.delete(componentName);
};
Prefab.prototype.addLayer = function (layerName, fn) {
    this.tags.add("drawable");
    if (this.renderersShadow.has(layerName)) {
        throw new Error("Layer: " + layerName + " is already exist!")
    }
    this.renderers[layerName] = new fn(this);
    this.renderersShadow.add(layerName);
    console.assert(this.renderers[layerName], "Could not load renderer " + layerName)
};
Prefab.prototype.removeLayer = function (layerName) {
    if (!this.renderersShadow.has(layerName)) {
        return
    }
    this.renderers[layerName] = null;
    this.renderersShadow.delete(layerName);
};
Prefab.prototype.init = function (f) {
    f(this);
    return this
};
Prefab.prototype.addTag = function (tagName) {
    this.tags.add(tagName);
    return this
};
