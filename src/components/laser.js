import {TAGS, session, newAudio, resources} from "../util.js";

let _;
const soundOfGraze = newAudio(resources.Sounds["graze"]);
const soundOfLaser = newAudio(resources.Sounds["laser"]);
export default function laser() {
    this.grazeState = undefined;
    this.tick = function (inst) {
        if (inst.startTime > 0) {
            inst.startTime--;
            return
        }
        if (inst.startTime === 0) {
            inst.startTime--;
            soundOfLaser.currentTime = 0;
            _ = soundOfLaser.play();
        }
        if (inst.delayTime > 0 || inst.delayTime === undefined) {
            if (inst.layTime < inst.sizeBox.xs) {
                inst.layTime++;
            }
            if (inst.delayTime !== undefined) {
                inst.delayTime--;
            }
            if (inst.atkBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.grazeBox)) {
                session.player.graze++;
                session.score += 500 + session.player.point * 10;
                soundOfGraze.currentTime = 0;
                _ = soundOfGraze.play()
            }
            if (inst.atkBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.hitBox)) {
                if (session.player.indTime > 0) {
                    session.score += session.player.point * 100;
                    inst.tags.add(TAGS.death)
                } else {
                    this.hitState = true;
                    session.player.die()
                }
            } else {
                this.hitState = false
            }
        } else {
            if (inst.outTime > 0) {
                inst.outTime--;
                if (inst.layTime > 1) {
                    inst.layTime--
                }
            } else {
                inst.tags.add(TAGS.death)
            }
        }
    }
}
