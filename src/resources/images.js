import {consoleTime, session} from "../util";
import {loadingScreenCache} from "./manager";

const images = {};

export function newImage(src, width, height) {
    const imageName = "image:" + src + "(" + (width || "auto") + "X" + (height || "auto") + ")";
    loadingScreenCache.push(consoleTime() + " loading " + imageName);
    let img = images[src];
    if (!img) {
        img = new Image();
        img.src = "./assets/images/" + src;
        img.addEventListener("load", function () {
            if (session.loadingCount < session.loadingTotal) {
                session.loadingCount++
            }
            loadingScreenCache.push(consoleTime() + " " + imageName + " load success!")
        });
        session.loadingTotal++;
        images[src] = img
    }
    img = img.cloneNode(true);
    img.style.width = width;
    img.style.height = height;
    return img
}