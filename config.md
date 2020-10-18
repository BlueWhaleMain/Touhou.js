# config.json
该文件是游戏的配置文件，详情如下：
```text
    "DeveloperMode": 开发者模式
    "FastStart": 快速启动（跳过加载界面）
    "PauseOnBlur": 窗体失去焦点时自动暂停
    "FrameMax": 帧数（每秒）
    "FullScreen": 全屏
    "EntityCountSecMax": 实体上限
    "Player": 初始残机数量
    "GrazeMax": 擦弹最大值
    "ShootSlow": 射击时自动低速
    "Idle": 闲置时（帧）自动播放demo
    "MaxMutex": 最大快进倍数（用于Replay）
    "Volume": 音量
        "BGM": 音乐
        "SE": 音效
    "KeyBoard": 键盘
        "Up": 上
        "Down": 下
        "Left": 左
        "Right": 右
        "Shoot": 射击
        "Bomb": 符卡
        "Slow": 低速模式
    "ScreenShot": 截图目录
    "Replay": 回放目录
    "Hint": 提示设置
        "mode": 模式：on|off|auto
        "path": 提示目录
```
## 默认
```json
{
    "DeveloperMode": false,
    "FastStart": true,
    "PauseOnBlur": true,
    "FrameMax": "auto",
    "FullScreen": false,
    "EntityCountSecMax": 1024,
    "Player": 3,
    "GrazeMax": 99999,
    "ShootSlow": false,
    "Idle": 360,
    "MaxMutex": 4,
    "Volume": {
        "BGM": 80,
        "SE": 60
    },
    "KeyBoard": {
        "Up": "ArrowUp",
        "Down": "ArrowDown",
        "Left": "ArrowLeft",
        "Right": "ArrowRight",
        "Shoot": "Z",
        "Bomb": "X",
        "Slow": "Shift"
    },
    "ScreenShot": "./screen_shot",
    "Replay": "./replay",
    "Hint": {
        "mode": "off",
        "path": "./hint"
    }
}
```
