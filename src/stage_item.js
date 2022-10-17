export default function StageItem(/* Map<number,function> */stageScriptMap) {
    this.dead = false
    let step = 0, cur = 0
    this.tick = function (inst) {
        if (cur < stageScriptMap.size) {
            if (stageScriptMap.get(step)) {
                stageScriptMap.get(step)(this, inst)
                cur++
            }
            step++
        } else {
            this.dead = true
        }
    }
    this.getStageType = function () {
        return "Stage"
    }
    this.skipStep = function (val, skip) {
        step += val
        cur += skip
    }
}