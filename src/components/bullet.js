import {TAGS, session, newAudio, resources} from "../util.js";

let _;
const soundOfGraze = newAudio(resources.Sounds.graze);
export default function bullet() {
    this.grazeState = undefined;
    this.hitState = false;
    this.tick = function (inst) {
        if (inst.atkBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.grazeBox)) {
            if (this.grazeState === false) {
                session.player.graze++;
                session.score += 500 + session.player.point * 10;
                this.grazeState = true;
                soundOfGraze.currentTime = 0;
                _ = soundOfGraze.play()
            }
        } else {
            this.grazeState = false
        }
        if (inst.atkBox.isHit(inst.X, inst.Y, session.player.X, session.player.Y, session.player.hitBox)) {
            if (session.player.indTime > 0) {
                session.score += session.player.point * 100;
                inst.tags.add(TAGS.death)
            } else {
                if (this.hitState === false) {
                    session.player.die();
                }
                this.hitState = true
            }
        } else {
            this.hitState = false
        }
    }
}
