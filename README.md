# Touhou.js
使用Canvas实现的东方二次创作

## 注意
源文件为touhou.js，目前的版本起点较高，但功能尚未完善

asset文件夹内部有许多未授权引用的外部文件，来源将后续在wiki中补充

尚未设计独立关卡，可以在Test中查看弹幕演示，也可以修改index.js中的TestStage函数测试不同逻辑

Test默认演示 夜符「Night Bird」（仿）

启动速度过慢时，设置 config.json `"FastStart": true`
这可能导致启动音效不播放

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

## License

ISC.
