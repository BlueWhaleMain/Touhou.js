import Observer from "../observer";
import {consoleTime, EVENT_MAPPING, options, session} from "../util";
import {loadingScreenCache} from "./manager";

const bgm = new Set();
const bgmIndex = {};
const sounds = [];
export const audioObserver = new Observer();
export const VOLUME_MAX = 100;
export const AUDIO_TYPE = {
    BGM: "BGM",
    SE: "SE"
}
const stopSounds = [];

export function stopAllSound() {
    for (let i = 0, length = sounds.length; i < length; i++) {
        if (!sounds[i].paused) {
            sounds[i].pause();
            stopSounds.push(sounds[i])
        }
    }
}

export function continueAllSound() {
    while (stopSounds.length > 0) {
        try {
            stopSounds.pop().play()
        } catch (e) {
        }
    }
}

export function cancelAllSound() {
    stopSounds.slice(0);
    for (let i = 0, length = sounds.length; i < length; i++) {
        if (!sounds[i].paused) {
            sounds[i].pause()
        }
        sounds[i].currentTime = 0
    }
}

export function killAnotherBGM() {
    for (const key in bgmIndex) {
        if (sounds[bgmIndex[key]] !== session?.currentBGM?.dom && sounds[bgmIndex[key]] !== session?.currentBGM?.loop) {
            sounds[bgmIndex[key]].pause();
            sounds[bgmIndex[key]].currentTime = 0
        }
    }
}

let _;

export function changeBGM(bgm, callback, force = false) {
    if (session.demoPlay === true) {
        return
    }
    let work = false;
    if (session.currentBGM) {
        if (bgm) {
            if (session.currentBGM.dom?.src !== bgm.head?.src || force) {
                work = true;
                _ = session.currentBGM.dom.pause()
            }
            if (session.currentBGM.loop?.src !== bgm.loop?.src || force) {
                work = true;
                _ = session.currentBGM.loop.pause()
            }
            session.currentBGM.dom = bgm.head;
            session.currentBGM.loop = bgm.loop;
            session.currentBGM.name = bgm.name;
            session.currentBGM.description = bgm.description
            session.currentBGM.loopStartDelay = bgm.loopStartDelay
            session.currentBGM.loopLoopDelay = bgm.loopLoopDelay
            session.currentBGM.key = bgm.key
        } else {
            if (session.currentBGM.dom) {
                _ = session.currentBGM.dom.pause()
            }
            if (session.currentBGM.loop) {
                _ = session.currentBGM.loop.pause()
            }
        }
    } else {
        work = true
    }
    if (work) {
        session.currentBGM = {
            dom: bgm.head,
            loop: bgm.loop,
            name: bgm.name,
            description: bgm.description,
            loopStartDelay: bgm.loopStartDelay,
            loopLoopDelay: bgm.loopLoopDelay,
            key: bgm.key
        }
    }
    if (typeof callback === "function") {
        callback(session.currentBGM, work)
    }
}

export function newAudio(name, volume = VOLUME_MAX, type = AUDIO_TYPE.SE) {
    if (type === AUDIO_TYPE.BGM) {
        if (bgm.has(name)) {
            return sounds[bgmIndex[name]]
        } else {
            bgmIndex[name] = sounds.length;
            bgm.add(name)
        }
    }
    const audioName = "audio:" + name + "(" + volume + "," + type + ")";
    loadingScreenCache.push(consoleTime() + " loading " + audioName);
    const audio = new Audio("./assets/sounds/" + name);
    audio.addEventListener("canplay", function canplay() {
        if (session.loadingCount < session.loadingTotal) {
            session.loadingCount++
        }
        audio.volume = volume * options.Volume[type] / 10000;
        loadingScreenCache.push(consoleTime() + " " + audioName + " load success!");
        audio.removeEventListener("canplay", canplay)
    });

    function onVolumeChange(e) {
        if (e.detail.type === type) {
            audio.volume = volume * options.Volume[type] / 10000
        }
    }

    audioObserver.addEventListener(EVENT_MAPPING.volumeChange, onVolumeChange);
    sounds.push(audio);
    session.loadingTotal++;
    return audio
}