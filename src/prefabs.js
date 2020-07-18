import {Tags} from "./util.js";

export default function prefabs(x, y) {
    this.X = 0 || x;
    this.Y = 0 || y;
    this.tags = new Set();
    this.components_shadow = new Set();
    this.components = {};
    const self = this;
    this.tick = function () {
        this.components_shadow.forEach(function (component) {
            self.components[component].tick(self)
        });
        return !this.tags.has(Tags.death)
    };
    this.renderers = {};
    this.renderers_shadow = new Set();
    this.draw = function () {
        this.renderers_shadow.forEach(function (renderer) {
            self.renderers[renderer].draw(self)
        })
    }
}
prefabs.prototype.addComponent = function (component_name, fn) {
    if (this.components_shadow.has(component_name)) {
        throw new Error("Component: " + component_name + " is already exist!")
    }
    this.components[component_name] = new fn();
    this.components_shadow.add(component_name);
    console.assert(this.components[component_name], "Could not load component " + component_name)
};
prefabs.prototype.removeComponent = function (component_name) {
    if (!this.components_shadow.has(component_name)) {
        return
    }
    this.components[component_name] = null;
    this.components_shadow.delete(component_name);
};
prefabs.prototype.addLayer = function (layer_name, fn) {
    this.tags.add("drawable");
    if (this.renderers_shadow.has(layer_name)) {
        throw new Error("Layer: " + layer_name + " is already exist!")
    }
    this.renderers[layer_name] = new fn();
    this.renderers_shadow.add(layer_name);
    console.assert(this.renderers[layer_name], "Could not load renderer " + layer_name)
};
prefabs.prototype.init = function (f) {
    f(this);
    return this
};
