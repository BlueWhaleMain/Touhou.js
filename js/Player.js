"use strict";

class Player extends Entity {
    Count;
    game;
    usedBomb;
    bombFlag;
    Power;
    MissTime;
    Indestructible;

    default = {
        type: "Player",
        alive: true,
        speed: new POS(0, 0),
        POS: new POS(0, 0),
        sizeBox: undefined,
        drawPOS: undefined,
        draw: function (player) {
            let screen_draw = player.screen_draw;
            screen_draw.save();
            screen_draw.translate(player.POS.x, player.POS.y);
            screen_draw.fillStyle = "black";
            screen_draw.shadowColor = "black";
            screen_draw.shadowBlur = 3;
            screen_draw.beginPath();
            screen_draw.arc(0, 0, 12, 0, 2 * Math.PI);
            screen_draw.closePath();
            screen_draw.fill();
            if (player.usedBomb && player.bombFlag > 0) {
                screen_draw.shadowBlur = 10;
                screen_draw.beginPath();
                screen_draw.arc(0, 0, 220 - player.bombFlag, 0, 2 * Math.PI);
                screen_draw.closePath();
                screen_draw.fill();
                player.option.BOX.HIT.r = 220 - player.bombFlag;
                player.option.BOX.GRAZE.r = 220 - player.bombFlag
            } else {
                if (player.option.BOX.HIT.r !== 3) {
                    player.option.BOX.HIT.r = 3
                }
                if (player.option.BOX.GRAZE.r !== 12) {
                    player.option.BOX.GRAZE.r = 12
                }
            }
            screen_draw.restore()
        },
        NAME: "露米娅",
        SPEED: {
            HIGH: 10,
            LOW: 5
        },
        BOX: {
            HIT: new ABox(3),
            GRAZE: new ABox(12)
        },
        PowerMax: 400,
        AlreadyMissTimeMax: 10,
        EN_EP_TIME: 180,
        ShootCount: 0,
        shoot: function (player) {
            let th = 45, tx = 5;
            if (player.game.HasShift) {
                th = 0;
                tx = 0
            }
            player.option.ShootCount++;
            if (player.option.ShootCount > 10) {
                player.option.ShootCount = 0
            }
            if (player.Power < 99) {
                SPAWN.PLAYER.BILL(new POS(player.POS.x, player.POS.y), new POS(0, -40));
            }
            if (player.Power >= 100) {
                SPAWN.PLAYER.BILL(new POS(player.POS.x + 10, player.POS.y), new POS(0, -40));
                SPAWN.PLAYER.BILL(new POS(player.POS.x - 10, player.POS.y), new POS(0, -40));
            }
            if (player.Power >= 200 && player.option.ShootCount % 2 === 0 || player.Power >= 300) {
                SPAWN.PLAYER.BILL(new POS(player.POS.x - 20, player.POS.y), POS.transTo(new POS(0, -40), tx * Util.L), -tx * Util.L);
                SPAWN.PLAYER.BILL(new POS(player.POS.x + 20, player.POS.y), POS.transTo(new POS(0, -40), -tx * Util.L), tx * Util.L);
            }
            if (player.Power >= 400) {
                SPAWN.PLAYER.BILL(new POS(player.POS.x + 20, player.POS.y), POS.transTo(new POS(0, -40), th * Util.L), -th * Util.L);
                SPAWN.PLAYER.BILL(new POS(player.POS.x - 20, player.POS.y), POS.transTo(new POS(0, -40), -th * Util.L), th * Util.L);
            }
        },
        PICK_LINE: 3 / 4
    };

    constructor(game, option) {
        super(option);
        this.game = game;
        this.Power = game.initPower;
        this.MissTime = 0;
    }
}
