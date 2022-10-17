function readlineSync() {
    return new Promise((resolve, _) => {
        process.stdin.resume();
        process.stdin.on('data', function (data) {
            process.stdin.pause();
            resolve(data.toString().replaceAll(/[\r\n]/g, ''));
        });
    });
}

process.stdout.write('输入回放文件路径：')
const fs = require('fs')
readlineSync().then((data) => {
    console.time('time escaped ')
    const jd = JSON.parse(fs.readFileSync(data.toString()).toString())
    const last = jd.eventList.pop()
    if (last > 2048) {
        jd.eventList = jd.eventList.slice(0, 2048)
        jd.eventList.push(2048)
        jd.stg.totalFrames = 2048
        fs.writeFileSync(data.toString(), JSON.stringify(jd))
        console.log('成功完成')
    } else {
        console.log('无需操作')
    }
    console.timeEnd('time escaped ')
})