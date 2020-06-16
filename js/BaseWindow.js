"use strict";

class BaseWindow {
    defaultContent = "<div class='layui-bg-black' style='width:100%;height:100%'>" +
        "<canvas id='screen' tabindex='0' style='position:absolute;width:60%;height:90%;left:5%;top:5%' width='768px' height='864px'>" +//tabindex支持键盘事件
        "<span style='font-size:large;color:red' title='浏览器可能不支持canvas'>加载失败</span>" +
        "</canvas>" +
        "<div id='FPS' style='position:absolute;bottom:0;right:30%;font-size:large'>0FPS/0BCS</div>" +
        "<div id='timeOut' style='position:absolute;top:0;right:30%;font-size:large'>0</div>" +
        "<div id='blood' style='position:absolute;top:5px;left:5%;background-color:white;width:768px;height:4px;display:none'></div>" +
        "<div class='layui-bg-gray' style='position:absolute;right:0;width:30%;height:100%;'>" +
        "<div style='margin-right:5%;margin-top:5px;text-align:center'>" +
        "<span id='difficulty' style='font-size:large;color:#00bc00'>Normal</span>" +
        "</div>" +
        "<div style='position:absolute;left:16px;top:32px;text-align:left'>" +
        "<span style='font-size:large'>Score</span>" +
        "</div>" +
        "<div style='position:absolute;right:16px;top:32px;text-align:right'>" +
        "<span id='score' style='font-size:large'>0</span>" +
        "</div>" +
        "<div style='position:absolute;top:64px;left:16px;'>" +
        "<span style='color:#701673;font-size:large'>Player</span>" +
        "</div>" +
        "<div id='player' style='position:absolute;top:64px;right:16px;'></div>" +
        "<div style='position:absolute;top:100px;left:16px;'>" +
        "<span style='color:#007300;font-size:large'>Bomb</span>" +
        "</div>" +
        "<div id='bomb' style='position:absolute;top:96px;right:16px;'></div>" +
        "<div style='position:absolute;top:138px;left:32px;'>" +
        "<img src='img/power_orb.png' alt='火力'>" +
        "</div>" +
        "<div style='position:absolute;top:140px;left:64px;'>" +
        "<span style='font-size:large;color:#bc5e1a'>火力</span>" +
        "</div>" +
        "<div style='position:absolute;top:146px;right:32px;'>" +
        "<span id='power_high' style='font-size:large;color:#bc5e1a'>0</span>" +
        "<span style='font-size:large;color:#bc5e1a'>.</span>" +
        "<span id='power_low' style='color:#bc5e1a'>00</span>" +
        "<span style='font-size:large;color:#bc5e1a'>/</span>" +
        "<span style='font-size:large;color:#bc5e1a'>4.</span>" +
        "<span style='color:#bc5e1a'>00</span>" +
        "</div>" +
        "<div style='position:absolute;top:168px;left:32px;'>" +
        "<img src='img/blue_orb.png' alt='点数'>" +
        "</div>" +
        "<div style='position:absolute;top:170px;left:64px;'>" +
        "<span style='font-size:large;color:#2c34bc'>最大得点</span>" +
        "</div>" +
        "<div style='position:absolute;top:174px;right:32px;'>" +
        "<span id='point' style='font-size:large;color:#2c34bc'>0</span>" +
        "</div>" +
        "<div style='position:absolute;top:200px;left:64px;'>" +
        "<span style='font-size:large'>擦弹数</span>" +
        "</div>" +
        "<div style='position:absolute;top:204px;right:32px;'>" +
        "<span id='graze' style='font-size:large'>0</span>" +
        "</div>" +
        "</div>" +
        "</div>";
    Screen;
    DrawScreen;
    Score;
    Bomb;
    Point;
    Player;
    PowerHigh;
    PowerLow;
    Pause;
    HasShift;
    Graze;
    FPS;
    FPS_interval;
    TimeOut;
    keys;
    player;
    players;
    ShowMenu;
    audio;
    runAnimationFrame;
    timestamp;
    entities;
    frames;
    stopSounds;
    Setting;
    // Difficulty;
    End;
    initPower;
    drawAnimationFrameTimeOut;
    timeout_tasks;
    playTime;
    GameMap;

    constructor() {
        this.playTime = 0;
        this.audio = {
            BombLay: AudioResources.BombLay.cloneNode(),
            BombShoot: AudioResources.BombShoot.cloneNode(),
            BombShoot1: AudioResources.BombShoot1.cloneNode(),
            Bonus: AudioResources.Bonus.cloneNode(),
            CardGet: AudioResources.CardGet.cloneNode(),
            Cat0: AudioResources.Cat0.cloneNode(),
            ChainShoot: AudioResources.ChainShoot.cloneNode(),
            Change: AudioResources.Change.cloneNode(),
            ChangeTrack: AudioResources.ChangeTrack.cloneNode(),
            Damage: AudioResources.Damage.cloneNode(),
            Damage1: AudioResources.Damage1.cloneNode(),
            EnEp1: AudioResources.EnEp1.cloneNode(),
            EnEp2: AudioResources.EnEp2.cloneNode(),
            Extend: AudioResources.Extend.cloneNode(),
            Graze: AudioResources.Graze.cloneNode(),
            Item: AudioResources.Item.cloneNode(),
            Miss: AudioResources.Miss.cloneNode(),
            OK: AudioResources.OK.cloneNode(),
            Over: AudioResources.Over.cloneNode(),
            Pause: AudioResources.Pause.cloneNode(),
            Play: AudioResources.Play.cloneNode(),
            PowerUp: AudioResources.PowerUp.cloneNode(),
            Shoot: AudioResources.Shoot.cloneNode(),
            Slash: AudioResources.Slash.cloneNode(),
            TimeOut: AudioResources.TimeOut.cloneNode(),
            TimeOut1: AudioResources.TimeOut1.cloneNode()
        };
        this.players = [];
        this.entities = [];
        this.stopSounds = [];
        this.timeout_tasks = [];
        this.Setting = {
            PlayerMax: 8,
            BombMax: 8,
            Graze_Max: 99999999
        };
        this.initPower = 0;
    }

    renderer_player() {
        this.Player.innerHTML = "";
        let count = this.player.Count;
        for (let i = 0; i < this.Setting.PlayerMax; i++) {
            if (count > 0) {
                count--;
                this.Player.appendChild(ImageResources.SidebarFilledPlayer.cloneNode());
            } else {
                this.Player.appendChild(ImageResources.SidebarStrokePlayer.cloneNode());
            }
        }
    }

    renderer_bomb() {
        this.Bomb.innerHTML = "";
        let count = this.player.Bomb;
        for (let i = 0; i < this.Setting.BombMax; i++) {
            if (count > 0) {
                count--;
                this.Bomb.appendChild(ImageResources.SidebarFilledBomb.cloneNode());
            } else {
                this.Bomb.appendChild(ImageResources.SidebarStrokeBomb.cloneNode());
            }
        }
    }

    renderer_power() {
        if (this.player.Power > this.player.option.PowerMax) {
            this.player.Power = this.player.option.PowerMax;
        }
        let str = String(this.player.Power);
        while (true) {
            if (str.length < 3) {
                str = "0" + str
            } else {
                break;
            }
        }
        this.PowerHigh.innerHTML = str[0];
        this.PowerLow.innerHTML = str.substr(1, 2);
        if (this.PowerLow.innerHTML !== "undefined") {
            while (true) {
                if (this.PowerLow.innerHTML.length < 2) {
                    this.PowerLow.innerHTML += "0";
                } else {
                    break;
                }
            }
        } else {
            this.PowerLow.innerHTML = "00";
        }
    }

    addKey(e) {
        e = e || window["event"];
        let check = 0;
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === e.key) {
                check = 1;
                break;
            }
        }
        if (check === 0) {
            this.keys.push(e.key);
        }
        switch (e.key) {
            case "Shift":
                this.HasShift = true;
                break;
            case "Escape":
                if (!this.Pause && !this.End) {
                    this.stopAllSound();
                    this.audio.Pause.currentTime = 0;
                    this.audio.Pause.play();
                    this.Pause = true
                }
                e.stopPropagation();//阻止退出事件被捕获
                break;
            //case "P":
            //	PLAYER.DEFAULT.PLAYER++
            //case "B":
            //	PLAYER.DEFAULT.BOMB.COUNT++
            case "Z" || "z":
                if (this.Pause) {
                    this.continueAllSound();
                    this.audio.OK.currentTime = 0;
                    this.audio.OK.play();
                    this.ShowMenu = false;
                    this.Pause = false
                }
        }
        // console.log(e.key);
    }

    removeKey(e) {
        e = e || window["event"];
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === e.key) {
                this.keys.splice(i, 1);
                break;
            }
        }
        if (e.key === "Shift") {
            this.HasShift = false;
        }
    }

    stage() {
        let player = this.player;
        if (this.Pause) {
            if (!this.ShowMenu) {
                this.DrawScreen.save();
                this.DrawScreen.globalCompositeOperation = "source-atop";
                this.DrawScreen.fillStyle = "rgba(255,0,10,0.5)";
                this.DrawScreen.fillRect(0, 0, screen.width, screen.height);
                this.DrawScreen.globalCompositeOperation = "source-over";
                this.DrawScreen.font = "30px sans-serif";
                this.DrawScreen.fillStyle = "rgb(255,255,255)";
                this.DrawScreen.fillText("游戏暂停", 60, 600);
                this.DrawScreen.restore();
                this.ShowMenu = true
            }
        } else {
            if (AudioResources.Play.currentTime > 290) {
                AudioResources.Play.currentTime = 156
            }
            this.playTime++;
            if (this.GameMap.STAGE.STAGE1[this.playTime]) {
                this.GameMap.STAGE.STAGE1[this.playTime]()
            }
            if (!this.End) {
                this.DrawScreen.clearRect(0, 0, screen.width, screen.height);
                player.MissTime++;
                if (player.Indestructible) {//无敌时间
                    player.TIME_TO_MISS.FLAG = false;
                    player.ALIVE = true;
                    player.TIME_TO_MISS.VALUE = TOUHOU_CONFIG.SETTING.ALREADY_MISS_TIME_MAX;
                    player.Indestructible--;
                }
                if (!player.ALIVE && !player.TIME_TO_MISS.FLAG) {//被弹且没有miss
                    AudioResources.Miss.play().then();
                    player.TIME_TO_MISS.FLAG = true;
                }
                if (player.TIME_TO_MISS.FLAG && player.TIME_TO_MISS.VALUE > 0) {//递减帧
                    player.TIME_TO_MISS.VALUE--;
                }
                if (!player.TIME_TO_MISS.VALUE) {//miss
                    player.DEFAULT.POWER.VALUE = 0;
                    renderer_power();
                    player.DEFAULT.PLAYER--;
                    player.ISMISS = true;
                    player.DEFAULT.BOMB.FLAG = 60;
                    renderer_player();
                    player.DEFAULT.BOMB.COUNT = 3;
                    renderer_bomb();
                    player.MISS_TIME = 0;
                    player.NO_MISS = false;
                    if (player.DEFAULT.PLAYER < 0) {
                        player.END = true;
                    } else {
                        player.Indestructible = 200;
                    }
                    if (player.DEFAULT.PLAYER > 0) {
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), new POS(0, -50), false);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), 25 * L), true);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), -25 * L), true);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), 45 * L), true);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), -45 * L), true);
                    } else {
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), 5 * L), false);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), -5 * L), false);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), 15 * L), false);
                        SPAWN.POWER_ORB(new POS(player.POS.x, player.POS.y), transTo(new POS(0, -50), -15 * L), false);
                    }
                    PLAYER.POS.reset();
                    PLAYER.ATTR.BOX.GRAZE.inScreen(PLAYER.POS, screen.width, screen.height);
                    clear_screen(true)
                }
                if (shift) {
                    PLAYER.ATTR.SPEED.USED = PLAYER.ATTR.SPEED.LOW;
                } else {
                    PLAYER.ATTR.SPEED.USED = PLAYER.ATTR.SPEED.HIGH;
                }
                if (!PLAYER.DEFAULT.POWER.FLAG) {
                    PLAYER.DEFAULT.POWER.FLAG = 0
                } else {
                    PLAYER.DEFAULT.POWER.FLAG--
                }
                if (!PLAYER.DEFAULT.BOMB.FLAG) {
                    PLAYER.DEFAULT.BOMB.FLAG = 0
                } else {
                    PLAYER.DEFAULT.BOMB.FLAG--;
                    if (PLAYER.DEFAULT.BOMB.FLAG === 1 && PLAYER.DEFAULT.BOMB.USED) {
                        clear_screen();
                        PLAYER.DEFAULT.BOMB.USED = false;
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_USE.play();
                    }
                }
                if (PLAYER.ISMISS && PLAYER.Indestructible === 180) {
                    for (let i = 0; i < entities.length; i++) {
                        if (entities[i].type === ENTITY_TYPE.HOSTILE_BULLET) {
                            entities[i].die(0)
                        }
                    }
                    PLAYER.ISMISS = false;
                }
                for (let i = 0; i < keys.length; i++) {
                    let move = false;
                    switch (keys[i]) {
                        case 37://左
                            if (PLAYER.ALIVE) {
                                PLAYER.POS.x -= PLAYER.ATTR.SPEED.USED;
                                move = true;
                            }
                            break;
                        case 38://上
                            if (PLAYER.ALIVE) {
                                PLAYER.POS.y -= PLAYER.ATTR.SPEED.USED;
                                move = true;
                            }
                            break;
                        case 39://右
                            if (PLAYER.ALIVE) {
                                PLAYER.POS.x += PLAYER.ATTR.SPEED.USED;
                                move = true;
                            }
                            break;
                        case 40://下
                            if (PLAYER.ALIVE) {
                                PLAYER.POS.y += PLAYER.ATTR.SPEED.USED;
                                move = true;
                            }
                            break;
                        case 90://Z
                            if (PLAYER.DEFAULT.POWER.FLAG <= 0 && PLAYER.ALIVE) {
                                PLAYER.DEFAULT.POWER.FLAG = 3;
                                TOUHOU_CONFIG.RESOURCES.AUDIO.SHOOT.currentTime = 0;
                                PLAYER.ATTR.SHOOT();
                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.SHOOT.play();
                            }
                            break;
                        case 88://X
                            if (PLAYER.DEFAULT.BOMB.FLAG <= 0 && PLAYER.DEFAULT.BOMB.COUNT > 0
                                && PLAYER.TIME_TO_MISS.VALUE > 0) {
                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_USE.play();
                                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_LAY.currentTime = 0;
                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_LAY.play();
                                PLAYER.DEFAULT.BOMB.COUNT--;
                                PLAYER.DEFAULT.BOMB.FLAG = 220;
                                PLAYER.DEFAULT.BOMB.USED = true;
                                PLAYER.Indestructible = 300;
                                renderer_bomb();
                                if (PLAYER.TIME_TO_MISS.FLAG) {
                                    layer.msg("决死")
                                }
                            }
                    }
                    if (move) {
                        PLAYER.ATTR.BOX.GRAZE.inScreen(PLAYER.POS, screen.width, screen.height);
                    }
                }
                for (let i = 0; i < methods.length; i++) {
                    if (methods[i].isStart) {
                        if (methods[i].tick() === true) {
                            methods.splice(i, 1);
                        }
                    } else {
                        methods[i].start();
                    }
                }
                if (PLAYER.TIME_TO_MISS.VALUE > 0) {
                    PLAYER.ATTR.DRAW(PLAYER)
                }
                for (let i = 0; i < entities.length; i++) {
                    if (entities.length > 768) {//实体上限
                        if (entities[i].type === ENTITY_TYPE.HOSTILE_BULLET) {
                            entities.splice(i, 1);
                            continue
                        }
                    }
                    if (!entities[i].tick()) {
                        entities.splice(i, 1);
                    }
                }
                if (shift && !PLAYER.DEFAULT.BOMB.USED) {
                    this.DrawScreen.save();
                    this.DrawScreen.translate(PLAYER.POS.x, PLAYER.POS.y);
                    this.DrawScreen.fillStyle = "red";
                    this.DrawScreen.shadowColor = "red";
                    this.DrawScreen.shadowBlur = 3;
                    this.DrawScreen.beginPath();
                    this.DrawScreen.arc(0, 0, PLAYER.ATTR.BOX.HIT.r + 1, 0, 2 * Math.PI);
                    this.DrawScreen.closePath();
                    this.DrawScreen.fill();
                    this.DrawScreen.fillStyle = "white";
                    this.DrawScreen.shadowColor = "white";
                    this.DrawScreen.rotate(L * frames * 6);
                    this.DrawScreen.fillRect(-PLAYER.ATTR.BOX.HIT.r, -PLAYER.ATTR.BOX.HIT.r, PLAYER.ATTR.BOX.HIT.r * 2,
                        PLAYER.ATTR.BOX.HIT.r * 2);
                    this.DrawScreen.restore()
                }
            } else {
                if (!PLAYER.END_OUT) {
                    TOUHOU_CONFIG.RESOURCES.AUDIO.PLAY.pause();
                    this.DrawScreen.save();
                    if (!PLAYER.ALIVE) {
                        this.DrawScreen.globalCompositeOperation = "source-atop";
                        this.DrawScreen.fillStyle = "rgba(255,0,10,0.5)";
                        this.DrawScreen.fillRect(0, 0, screen.width, screen.height);
                        this.DrawScreen.globalCompositeOperation = "source-over";
                        this.DrawScreen.font = "30px sans-serif";
                        this.DrawScreen.fillStyle = "rgb(255,255,255)";
                        this.DrawScreen.fillText("满身疮痍", 60, 450);
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.OVER.play();
                    } else {
                        this.DrawScreen.font = "25px sans-serif";
                        this.DrawScreen.fillStyle = "rgb(191,161,31)";
                        this.DrawScreen.fillText("All Clear!", 220, 360);
                        let playerBonus = PLAYER.DEFAULT.PLAYER * 3000000;
                        let bombBonus = PLAYER.DEFAULT.BOMB.COUNT * 1000000;
                        let totalBonus = playerBonus + bombBonus
                            + (1000 + PLAYER.DEFAULT.POWER.VALUE + PLAYER.GRAZE.VALUE * 10) * PLAYER.POINT;
                        PLAYER.SCORE += totalBonus * 7;
                        this.DrawScreen.fillText("Player =" + playerBonus, 220, 400);
                        this.DrawScreen.fillText("Bomb =" + bombBonus, 220, 430);
                        this.DrawScreen.fillStyle = "rgb(184,184,184)";
                        this.DrawScreen.fillText("Total =" + totalBonus, 220, 460);
                    }
                    this.DrawScreen.restore();
                    PLAYER.END_OUT = true
                }
            }
        }
        score.innerHTML = String(PLAYER.SCORE).split(".")[0]
            .replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }

    frame() {

    }

    run() {
        this.frame();
        this.frames++;
        this.start()
    }

    start() {
        if (this.drawAnimationFrameTimeOut) {
            let run = this.run;
            setTimeout(function () {
                requestAnimationFrame(run)
            }, this.drawAnimationFrameTimeOut)
        } else {
            this.runAnimationFrame = requestAnimationFrame(this.run)
        }
    }

    InitializeComponent(player, callback) {
        this.frames = 0;
        this.Screen = document.querySelector("canvas");
        this.DrawScreen = screen.getContext("2d");
        this.Score = document.getElementById("score");
        this.Score.innerHTML = player.Score;
        this.Bomb = document.getElementById("bomb");
        this.Point = document.getElementById("point");
        this.Player = document.getElementById("player");
        this.PowerHigh = document.getElementById("power_high");
        this.PowerLow = document.getElementById("power_low");
        this.Graze = document.getElementById("graze");
        this.FPS = document.getElementById("FPS");
        this.TimeOut = document.getElementById("timeOut");
        this.TimeOut.style.display = "none";
        this.renderer_player(player);
        this.renderer_bomb(player);
        this.renderer_power(player);
        this.Screen.addEventListener("keydown", this.addKey);
        this.Screen.addEventListener("keyup", this.removeKey);
        this.Screen.focus();
        this.player.ATTR.BOX.GRAZE.inScreen(this.player.POS, screen.width, screen.height);
        this.audio.item.volume = 0.1;
        this.audio.Graze.volume = 0.01;
        this.audio.ChangeTrack.volume = 0.5;
        this.audio.ChainShoot.volume = 0.1;
        this.audio.BombShoot.volume = 0.3;
        this.audio.BombShoot1.volume = 0.3;
        this.audio.Extend.volume = 0.3;
        this.audio.CardGet.volume = 0.3;
        this.audio.BombLay.volume = 0.5;
        this.FPS_interval = setInterval(this.interval, 1000);
        this.start();
        if (callback && typeof callback === "function") {
            callback(this);
        }
    }

    interval() {
        let new_timestamp = new Date().getTime();
        let fps = Math.floor(frames / ((new_timestamp - this.timestamp) / 1000)), fps_color = "green",
            bcs = this.entities.length, bcs_color = "green";
        if (fps < 20) {
            fps_color = "red"
        } else if (fps < 40) {
            fps_color = "orange"
        }
        if (bcs > 512) {
            bcs_color = "red"
        } else if (bcs > 256) {
            bcs_color = "orange"
        }
        this.FPS.innerHTML =
            "<span style='color:" + fps_color + "'>" + fps + "FPS</span>" +
            "/" +
            "<span style='color:" + bcs_color + "'>" + bcs + "ECS</span>";
        this.timestamp = new_timestamp;
        this.frames = 0;
    }

    DisposeComponent() {
        document.body.removeEventListener("keydown", this.addKey);
        document.body.removeEventListener("keyup", this.removeKey);
        cancelAnimationFrame(this.runAnimationFrame);
        clearInterval(this.FPS_interval);
        this.stopAllSound()
    }

    stopAllSound() {
        for (let i in this.audio) {
            try {
                if (!this.audio[i + ""].paused) {
                    this.audio[i + ""].pause();
                    this.stopSounds.push(i + "")
                }
            } catch (e) {
                console.warn(e)
            }
        }
    }

    continueAllSound() {
        while (this.stopSounds.length > 0) {
            try {
                this.audio[this.stopSounds.pop()].play()
            } catch (e) {
                console.warn(e)
            }
        }
    }

    show(title = "测试", area = ["1280px", "960px"], success_callback = this.InitializeComponent, end_callback = this.DisposeComponent) {
        layui.layer.open({
            title: title
            , type: 1
            , area: area
            , maxmin: true
            , shade: 0
            , content: this.defaultContent
            , id: Test.Version
            , success: success_callback
            , end: end_callback
        });
    }
}
