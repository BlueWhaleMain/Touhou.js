# Touhou.js
使用Canvas实现的东方二次创作

## 注意
asset文件夹内部有许多未授权引用的外部文件，来源将后续在wiki中补充

需要慢速切换场景时，设置 config.json `"FastStart": false`

## TODO
支持mod拓展

采用[electron.js](https://www.electronjs.org/docs)似乎更好

## 如何使用
release版本可以直接运行EXE，开发环境使用npm启动

## 常见问题
爆帧（帧率长时间超过60）：
修改config.json默认配置`"FrameMax": "auto"`为`"FrameMax": 60`
低配机使用锁帧会略微掉帧
默认自动获取帧会受窗体覆盖限制

屏幕尺寸：
package.json中配置了window的width和height，其中width要比实际大小大两个像素，
height比实际大小大一个像素，这是因为浏览器边框也算窗体大小，而canvas则是内部容器，
屏幕逻辑大小永远是640X480，设置窗体大小可以强制缩放context，但不会影响运行

F2截图会弹出对话框：
将config.json中的配置ScreenShot配置为一个合法路径即可（文件夹或驱动器必须存在）

## License

ISC.
