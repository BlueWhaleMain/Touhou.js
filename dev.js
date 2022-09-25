const fs = require('fs')
const path = require('path');
if (fs.existsSync('dist')) {
    delDirectory('dist')
}
fs.mkdirSync('dist')
const pkg = JSON.parse(fs.readFileSync('package.json').toString())
const nw_pkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: "index.html",
    window: {
        icon: "assets/index.png",
        toolbar: false,
        frame: true,
        width: 1280,
        height: 960
    },
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
    build: {
        nwVersion: "0.68.1",
        win: {
            copyright: pkg.author
        }
    }
}
fs.writeFileSync('dist/package.json', JSON.stringify(nw_pkg))

copyDirectory('assets', 'dist/assets')
copyDirectory('builtin', 'dist')
const options = JSON.parse(fs.readFileSync('dist/options.json').toString())
options.$schema = "assets/options.config.json"
fs.writeFileSync('dist/options.json', JSON.stringify(options, null, 4))

function delDirectory(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
        files = fs.readdirSync(dir);
        files.forEach((file, _) => {
            const curPath = path.join(dir, file);
            const stat = fs.statSync(curPath);
            if (stat.isDirectory()) {
                delDirectory(curPath);
            } else if (stat.isFile()) {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

function copyDirectory(src, dest) {
    const files = fs.readdirSync(src);
    files.forEach((item, _) => {
        const itemPath = path.join(src, item);
        const itemStat = fs.statSync(itemPath);
        const savedPath = path.join(dest, itemPath.replace(src, ''));
        const savedDir = savedPath.substring(0, savedPath.lastIndexOf('\\'));
        if (itemStat.isFile()) {
            // 如果目录不存在则进行创建
            if (!fs.existsSync(savedDir)) {
                fs.mkdirSync(savedDir, {recursive: true});
            }
            // 写入到新目录下
            fs.writeFileSync(savedPath, fs.readFileSync(itemPath));
        } else if (itemStat.isDirectory()) {
            copyDirectory(itemPath, path.join(savedDir, item));
        }
    });
}
