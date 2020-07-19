import {Tags} from "./util.js";

export default function Prefab(x, y) {
    this.X = 0 || x;
    this.Y = 0 || y;
    this.tags = new Set();
    this.componentsShadow = new Set();
    this.components = {};
    const self = this;
    this.tick = function () {
        this.componentsShadow.forEach(function (component) {
            self.components[component].tick(self)
        });
        return !this.tags.has(Tags.death)
    };
    this.renderers = {};
    this.renderersShadow = new Set();
    this.draw = function () {
        this.renderersShadow.forEach(function (renderer) {
            self.renderers[renderer].draw(self)
        })
    }
}
Prefab.prototype.addComponent = function (component_name, fn) {
    if (this.componentsShadow.has(component_name)) {
        throw new Error("Component: " + component_name + " is already exist!")
    }
    this.components[component_name] = new fn();
    this.componentsShadow.add(component_name);
    console.assert(this.components[component_name], "Could not load component " + component_name)
};
Prefab.prototype.removeComponent = function (component_name) {
    if (!this.componentsShadow.has(component_name)) {
        return
    }
    this.components[component_name] = null;
    this.componentsShadow.delete(component_name);
};
Prefab.prototype.addLayer = function (layer_name, fn) {
    this.tags.add("drawable");
    if (this.renderersShadow.has(layer_name)) {
        throw new Error("Layer: " + layer_name + " is already exist!")
    }
    this.renderers[layer_name] = new fn();
    this.renderersShadow.add(layer_name);
    console.assert(this.renderers[layer_name], "Could not load renderer " + layer_name)
};
Prefab.prototype.init = function (f) {
    f(this);
    return this
};
