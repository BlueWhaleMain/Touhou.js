// 0图层可能重构为webgl
import {editImage, hslToRgb, rgbToHsl} from "../util";
import {newImage} from "./images";
import {resources} from "./manager";

const Sticker = {};
const eBullet = newImage(resources.Images.eBullet);
const eBullet2 = newImage(resources.Images.eBullet2);
const eBullet6 = newImage(resources.Images.eBullet6);

export function drawSticker(type, color) {
    let x = 0, y = 0, w = 16, h = 16, canHue = true, image = eBullet;
    switch (type) {
        case "laser":
            break;
        case "scale":
            y = 16;
            canHue = false;
            break;
        case "ring":
            y = 32;
            break;
        case "small":
            y = 48;
            break;
        case "rice":
            y = 64;
            break;
        case "suffering":
            y = 80;
            break;
        case "bill":
            y = 96;
            break;
        case "bullet":
            y = 112;
            break;
        case "bacteria":
            y = 128;
            break;
        case "needle":
            y = 144;
            break;
        case "star":
            y = 160;
            break;
        case "ice":
            y = 176;
            break;
        case "point":
            y = 192;
            w = 8;
            h = 8;
            break;
        case "shiji":
            x = 15 * 8;
            y = 192;
            w = 8;
            h = 8;
            break;
        case "coin":
            y = 208;
            break;
        case "arrow":
            y = 224;
            h = 32;
            break;
        case "orb":
            image = eBullet2;
            w = 32;
            h = 32;
            break;
        case "bigStar":
            image = eBullet2;
            y = 32;
            w = 32;
            h = 32;
            break;
        case "knife":
            image = eBullet2;
            y = 64;
            w = 32;
            h = 32;
            break;
        case "heart":
            image = eBullet2;
            y = 96;
            w = 32;
            h = 32;
            break;
        case "butterfly":
            image = eBullet2;
            y = 128;
            w = 32;
            h = 32;
            break;
        case "oval":
            image = eBullet2;
            y = 160;
            w = 32;
            h = 32;
            break;
        case "big":
            image = eBullet2;
            y = 192;
            w = 64;
            h = 64;
            break;
        case "small_light_ball":
            image = eBullet2;
            y = 480;
            w = 32;
            h = 32;
            break;
        case "master_spark":
            image = eBullet6;
            w = 256;
            h = 512;
            if (color) {
                throw new Error("Type: master_spark is not support color.")
            }
            break;
        default:
            throw new Error("Type: " + type + " is not supported.")
    }
    if (isNaN(color)) {
        switch (color) {
            case "darkgray":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("darkgray " + type + " is not supported.")
                }
                break;
            case "dimgray":
                if (type === "coin") {
                    throw new Error("dimgray " + type + " is not supported.")
                }
                if (type !== "small_light_ball") {
                    x += w;
                }
                break;
            case "crimson":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("crimson " + type + " is not supported.")
                }
                x += 2 * w;
                break;
            case "red":
                if (type === "coin") {
                    throw new Error("red " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += w;
                } else {
                    x += 3 * w;
                }
                break;
            case "orangered":
                if (type === "coin") {
                    throw new Error("orangered " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 7 * w
                } else {
                    x += 4 * w;
                }
                break;
            case "gold":
                if (type === "coin") {
                    x = 0
                } else if (type === "small_light_ball") {
                    x += 6 * w
                } else {
                    x += 5 * w;
                }
                break;
            case "silk":
                if (type === "coin") {
                    x += w;
                } else {
                    throw new Error("silk " + type + " is not supported.")
                }
                break;
            case "copper":
                if (type === "coin") {
                    x += 2 * w;
                } else {
                    throw new Error("copper " + type + " is not supported.")
                }
                break;
            case "khaki":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("darkorange " + type + " is not supported.")
                }
                x += 6 * w;
                break;
            case "yellowgreen":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("yellowgreen " + type + " is not supported.")
                }
                x += 7 * w;
                break;
            case "green":
                if (type === "coin") {
                    throw new Error("green " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 5 * w
                } else {
                    x += 8 * w;
                }
                break;
            case "aqua":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("aqua " + type + " is not supported.")
                }
                x += 9 * w;
                break;
            case "water":
                if (type === "coin") {
                    throw new Error("lightseagreen " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 4 * w
                } else {
                    x += 10 * w;
                }
                break;
            case "blue":
                if (type === "coin") {
                    throw new Error("blue " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 3 * w
                } else {
                    x += 11 * w;
                }
                break;
            case "darkblue":
                if (type === "coin" || type === "scale" || type === "bigStar" || type === "small_light_ball") {
                    throw new Error("darkblue " + type + " is not supported.")
                }
                x += 12 * w;
                break;
            case "purple":
                if (type === "coin") {
                    throw new Error("purple " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 2 * w
                } else {
                    x += 13 * w;
                }
                break;
            case "hotpink":
                if (type === "coin") {
                    throw new Error("hotpink " + type + " is not supported.")
                }
                if (type === "small_light_ball") {
                    x += 8 * w
                } else {
                    x += 14 * w;
                }
                break;
            default:
                if (type !== "master_spark") {
                    throw new Error(type + " Color: " + color + " is not supported.")
                }
        }
    } else {
        x += w;
    }
    if (x + w > image.width) {
        y += h;
        x -= image.width;
        x += w
    }
    if (!Sticker[type]) {
        Sticker[type] = {}
    }
    if (!Sticker[type][color]) {
        const canvas0 = document.createElement("canvas");
        canvas0.width = w;
        canvas0.height = h;
        const ctx = canvas0.getContext("2d");
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
        if (!isNaN(color)) {
            if (!canHue) {
                throw new Error(type + " Color: " + color + " is not supported.")
            }
            ctx.putImageData(editImage(ctx.getImageData(0, 0, w, h), function (r, g, b) {
                const hsl = rgbToHsl(r, g, b);
                return hslToRgb(color, 1, hsl[2]);
            }), 0, 0);
        }
        const graze = canvas0.cloneNode(true);
        const grazeCtx = graze.getContext("2d");
        grazeCtx.drawImage(canvas0, 0, 0);
        grazeCtx.globalCompositeOperation = "source-atop";
        grazeCtx.fillStyle = "rgba(249,255,1,0.5)";
        grazeCtx.fillRect(0, 0, graze.width, graze.height);
        const hit = canvas0.cloneNode(true);
        const hitCtx = hit.getContext("2d");
        hitCtx.drawImage(canvas0, 0, 0);
        hitCtx.globalCompositeOperation = "source-atop";
        hitCtx.fillStyle = "rgba(255,0,15,0.5)";
        hitCtx.fillRect(0, 0, hit.width, hit.height);
        Sticker[type][color] = {
            layer0: canvas0,
            graze: graze,
            hit: hit
        }
    }
    return Sticker[type][color]
}