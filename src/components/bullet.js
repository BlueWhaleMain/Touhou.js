import {Sounds} from "../util.js";

let _;
export default function bullet() {
    this.graze_state = undefined;
    this.tick = function (inst) {
        if (inst.atkBox.isHit(inst.X, inst.Y, window.player.X, window.player.Y, window.player.grazeBox)) {
            if (this.graze_state === false) {
                window.player.graze++;
                window.score += 500 + window.player.point * 10;
                this.graze_state = true;
                Sounds.graze.currentTime = 0;
                _ = Sounds.graze.play()
            }
        } else {
            this.graze_state = false;
        }
        if (inst.atkBox.isHit(inst.X, inst.Y, window.player.X, window.player.Y, window.player.hitBox)) {
            if (window.player.indTime > 0) {
                window.score += window.player.point * 100;
                inst.tags.add("death")
            } else {
                window.player.die()
            }
        }
    }
}
