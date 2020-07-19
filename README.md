# Touhou.js
使用Canvas实现的东方二次创作

## 注意
源文件为touhou.js，目前的版本起点较高，但功能尚未完善

asset文件夹内部有许多未授权引用的外部文件，来源将后续在wiki中补充

需要慢速切换场景时，设置 config.json `"FastStart": false`

## 重构说明
1、作为离线直接运行的网页项目，将渲染与弹幕引擎封装，脱离LayUi依赖，全部采用Canvas绘制（WebGL也可）

2、作为可公网访问的Web项目，使用任意前端框架支持，编写Web后端提供数据服务

此次重构选择了方案1

## TODO
继续将touhou.js内的代码迁移重构

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
屏幕逻辑大小永远是1280X960，设置窗体大小可以强制缩放canvas，但不会影响运行

## License

ISC.
