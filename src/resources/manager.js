import fs from "fs";
import {session} from "../util";

session.loadingCount = 0;
session.loadingTotal = 0;
export const loadingScreenCache = [];
export const resources = JSON.parse(fs.readFileSync("assets/resources.json").toString()) || require("../../assets/resources.json");

export function saveDelay(bgm) {
    resources.Sounds[bgm.key].loopStartDelay = bgm.loopStartDelay;
    resources.Sounds[bgm.key].loopLoopDelay = bgm.loopLoopDelay;
    fs.writeFileSync("assets/resources.json", JSON.stringify(resources, null, 4))
}