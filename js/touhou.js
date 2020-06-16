;
//原文件
let Touhou = function () {
    "use strict";
    const TOUHOU_CONFIG = {
        SETTING: {
            PLAYER_MAX: 8,
            BOMB_MAX: 8,
            POWER_MAX: 400,
            ALREADY_MISS_TIME_MAX: 10,
            GRAZE_MAX: 99999999,
            EN_EP_TIME: 180,
            DIFFICULTY: "DEFAULT"
        },
        RESOURCES: {
            Text: {
                AUDIO: {
                    SHOOT: "SHOOT",
                    BOMB_USE: "BOMB_USE",
                    BOMB_LAY: "BOMB_LAY",
                    BOMB_SHOOT: "BOMB_SHOOT",
                    BOMB_SHOOT_1: "BOMB_SHOOT_1",
                    MISS: "MISS",
                    GRAZE: "GRAZE",
                    ITEM: "ITEM",
                    CHAIN_SHOOT: "CHAIN_SHOOT",
                    CHANGE_TRACK: "CHANGE_TRACK",
                    POWER_UP: "POWER_UP",
                    EXTEND: "EXTEND",
                    CART_GET: "CART_GET",
                    CAT_0: "CAT_0",
                    TIME_OUT: "TIME_OUT",
                    TIME_OUT_1: "TIME_OUT_1",
                    CHANGE: "CHANGE",
                    EN_EP_1: "EN_EP_1",
                    EN_EP_2: "EN_EP_2",
                    DAMAGE: "DAMAGE",
                    DAMAGE_1: "DAMAGE_1",
                    OVER: "プレイヤーズスコア",
                    PLAY: "神さびた古戦場 ～ Suwa Foughten Field",
                    Start: "永夜抄 ～ Eastern Night",
                    PAUSE: "PAUSE",
                    OK: "OK",
                    Cancel: "Cancel",
                    Select: "Select",
                    Bonus: "Bonus",
                },
            },
            AUDIO: {
                SHOOT: new Audio("sound/touhou/shoot.wav"),
                BOMB_USE: new Audio("sound/touhou/slash.wav"),
                BOMB_LAY: new Audio("sound/touhou/bomb_lay.wav"),
                BOMB_SHOOT: new Audio("sound/touhou/bomb_shoot.wav"),
                BOMB_SHOOT_1: new Audio("sound/touhou/bomb_shoot_1.wav"),
                MISS: new Audio("sound/touhou/dead.wav"),
                GRAZE: new Audio("sound/touhou/graze.wav"),
                ITEM: new Audio("sound/touhou/item.wav"),
                CHAIN_SHOOT: new Audio("sound/touhou/chain_shoot.wav"),
                CHANGE_TRACK: new Audio("sound/touhou/change_track.wav"),
                POWER_UP: new Audio("sound/touhou/power_up.wav"),
                EXTEND: new Audio("sound/touhou/extend.wav"),
                CART_GET: new Audio("sound/touhou/card_get.wav"),
                CAT_0: new Audio("sound/touhou/cat_0.wav"),
                TIME_OUT: new Audio("sound/touhou/timeout.wav"),
                TIME_OUT_1: new Audio("sound/touhou/timeout_1.wav"),
                CHANGE: new Audio("sound/touhou/change.wav"),
                EN_EP_1: new Audio("sound/touhou/en_ep_1.wav"),
                EN_EP_2: new Audio("sound/touhou/en_ep_2.wav"),
                DAMAGE: new Audio("sound/touhou/damage.wav"),
                DAMAGE_1: new Audio("sound/touhou/damage_1.wav"),
                OVER: new Audio("sound/touhou/上海アリス幻樂団 - プレイヤーズスコア.flac"),
                PLAY: new Audio("sound/touhou/上海アリス幻樂団 - 神さびた古戦場 ～ Suwa Foughten Field.flac"),
                Start: new Audio("sound/touhou/上海アリス幻樂団 - 永夜抄 ～ Eastern Night.flac"),
                PAUSE: new Audio("sound/touhou/pause.wav"),
                OK: new Audio("sound/touhou/ok.wav"),
                Cancel: new Audio("sound/touhou/cancel.wav"),
                Select: new Audio("sound/touhou/select.wav"),
                Bonus: new Audio("sound/touhou/bonus.wav"),
            },
            IMAGE: {
                BILL: {
                    PLAYER: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAgCAIAAACZ9R/cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAU4SURBVEhLPVXZbiRFEMy6+pzb13jxBTyAtBJI8P+/gEBoBU88eX2M1/acfdRJZM9CudyqrunKjIzIzBKzS5pGKhJhCCJFJIl0IiEo4R97QsgksImRBAWiKESkFFNoKb1JIT4s6XtPZ5HyRHqwInAeTymSUiRgU2HNNmCU7chEMsQQXPdK/h8txN2SfnLiSufVZGKyAp6o78VmQyFQUVBeEja1ZngwjAGj0sS+D2+rJ9v8qZP4dil+8eJ6cV5+/GhOzyglelnRp0+029FsRrM5zRdUlQOwwYY2lBdpvY5///X0tvpdRYltxloWarmUd3fy9kaen8uykkpJk8mylJOxnE7ldCbHY1kUssjlZKKmU11VymSIkE189aA0aQQveYIFKRmR99R31HVke9of6PmZnp5osyZrKcuoLIXCdxhgqe/pywt9fqCHh7TZxCzzk6kty15rK4STwmsTlEogqLfUO4qRI8oygFCnI7oMNHXB7HYSHu7v03YbqsrO501VtXXlqsrXdZhMKM9lCFIZKmuKidrDoWuebQu0QJHIOdpuabWih8+0fo9lERZzN6p7k3VCNCEcvG9jDAZcZgg7YSB2DkLIeCQiy2k+ZwnAAkaWi7wQSgno37b9er17ety/rDwogM/oKDg4jiQCMzeQybYXCzo9papO2kSlghCcY3A2wEwxYrJ1jBQoeqYjAj+gcAaTAIqTE7q4gKEIImJ01kbvoVBW5NV0Oj47q05OFFRgEwCSyHpysJVgYhhai6qi8ZhAW10TYj4mEiPEz1Jpgwn++TxmiOQ8eYeKkRiQlrHgawSPhBmPTV3rspCZAU7X9/3h0O92rmkS0gRbKDUfydsjI5xaRxxgBZakMci/rK5y2EJ0yIUYkGAgBeU1cCcJnDARgUmh4z62h0RVeKaopczLMgeQIldGG7xqVVYV7+icfaHWGckQEZRlhfEytAUGA4usAv/MEoQgkJEhMJZjKgwfDXWPyUNCF+jFR6TkCfvO9ft9t9m4/c43B991rm2bzabdb5ERXD3s57/JEfzvcxi88B7M2f0+NG1ELsWhv1jrbQ8sOMAoYAY0YQI8HgpxQOfgU+CEwQF49m0bUJ0IhKse/BwLcnDDrhWZDGUG4F9BgRLolDARFLz2LvQ2Oo9tYQxmwLbzoetj26NYBTQazjGFWHBEzAHUBjHD9Cm65EMK8JEXKBnrfbc/+M0+bXYJDe3QUGeFi4A/wGMTR/6RMMi5wPaN0aPaTKdmNjOjOtNaQ5rDIa7X6HpoCNQ05Cw6ORc76wPEEU5dQkfxTmqZTerR5eX4+rpaXowWJ4vJeIYc6Zu0eUuvX+jtlSCQbXEKKqJmoQruiGHpnXBOB59TKrQqlMx8yPpu1La1swopPxmjJ6TRiOMfslbNx2KZxLgeqQ8fAJ7e3tAppYb8SePMoRGbtVit5P297HpxcS6ub+j2lgtyu923h0dcMpyYmNBMq1TkcCLQsjMDE8p7aTvRNAI9cb2WXSfqES2XdHXFbQG3zHCYFeE0Qd4CAir97oa+uxNnZwJroEXh41niHkGo8eiJzLHXs5IYnDGYiJ/e3+mdo+AG3za03/NttN3xAq9QCvto/y8v9PhIX175WhiMiI/fyF8tXZlCz2ayKMEsFzL3ha9VxAschiG4AzQgwv1obXp9fbTtbxmJH6/Uz15cJqXxJ7ncuRSZHy5e+GG9oRjswibymj0PpendI4U/cKfe3JgfSJ+DCfQGZZTKlIYeCqKkDAWEdEODjKgjiS7B73h10SPb3XN0n1L/LyoREwcFMuMzAAAAAElFTkSuQmCC"),
                    DASH: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAIAAABGyIsrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI+SURBVDhPfZRHbipREEXpQM6fLAQIBjBBniOxApbFqtgHAgRiAEhgQ5Nz5p/XNfPAV+rn6gq3btVrrDWbzVQqZRiGruuapn0+H4fD4XK5DocDp9PpfL1eeIjebrf1em1mMplGoxGLxciWmBQT5gRQEHq/39vtttVq6RIWwAcwSMIwTZOonACu5/OpXiDY7Xa0gxWv8BEjJETUhMNhnERNHpTs9/vBYEBTmYEk4bOpDZ/PV6lUgsEgXPrj8SDJ7XbD8c9GMpkkXC6XWUY0GsUPPB6PFKuOkJ3P58Vi8W1js9lQFolEaCie5XJ5uVyQJBPqImk+n//YwMBD2LIs8cBFwvV6RYtaCCAsSWLDR5gZcHICnDKVLknckdfrZTjAZN1ut9/vE0Y6YEIS2BWZprzkcjkKID6dTqPRaDweI5eJi8UiJzWMRAc2pHMD/KGa1F6v1263kU4Gs2F0Oh2cfCbsR+kBdIAMrdCzFmIU12q1er0eCAS4yuPxeL/fcZKpJKGYAghCoVChUCAD+nQ6TZi7h4VXvjRkMy0NTB7qOPGyfupFIUa1WoWIPE5eJU19GnRkzZPJJB6Pc6kY7J4yGgLukYvL5/N+v59KxQQHBbPZjHeUcE3slCbwoXO1Wk2nUz4k1ohH3QNNCBNDLvMgDD5AQ+amZyKRgJ7FqKF5qPmyQSUolUpi/MJwOFSbxaKPuP4GKlQH6JEhvx5mwJYPidlQSBKp5GEDtS7+CWSzWSwZBrAfQCW7RwMeNautwrKs/9C0qIlRaax8AAAAAElFTkSuQmCC")
                },
                PLAYER: {
                    SIDEBAR: {
                        STROKE: getImage("img/touhou/player_sidebar.png", "24px", "24px"),
                        FILL: getImage("img/touhou/player_sidebar_on.png", "24px", "24px")
                    },
                    ITEM: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKHSURBVEhLxVY9aFNRGP1Si+APLq51UOhmwbUuoqAEh+JgLSKFoi4VBwXpICKC0rGCg0OHLi2CikIUHAQRHaQGSwW7SKymSV5q0oiRJE0eeeb4nXdv0Jhak/aVHrjv59zvO+fe9+793pNNwUtB52fBqaWLmPbS8PAH3A+YqcZx2IZK5RW6yXkZVGwIShGUmEsNatnQRnwShNOH4FSTQPEB4PQCC13AvJjz134j5r7HYzbPgZe7/DuGjTHMpQa1qGnlDXQE51K9+EkhBjMp3gPYbh/JQcMXH6LGxmtytlsWb5qcuiGhg6ip9nk/IC7Yq50VjoIBCwcbDf6GM6yz1WZvVwQ1qEVNan8U7OMju1afcnJgdYF2kBwymvYJXRc9TNYJGxMYqFl+A+hk7neERJZ39OsqmrO9AaL6XaRzjwg9OvQ+5rPb/GOgqC2rUZdvFKPRcy+lN1nTGSS8WXNWoxf+hTuL4ka9o9JTFCAIcUbiRmV895hIIhycWeIYsFPfvRuTeyEJGV066m4vcKf7RACgVmUG5aZSlB3CcW4wp2/9ZtlLZrNm+nDGUo3InMYUS0dmdO1mubt+9UHmBJ5Zqhlzgq3Zs5jnaBS6MNsDc/yZDCIbE+yy9Mpg7cuNoMQES7UM5uSuwP0iOGCp1aEl40j+Nmrl6dbNKlEgP+aXmwFLtQatgcOsgfk7/zfLj5sCqjmjlmoPOrpbLIp5fcGWasKPCVM4WZy5TSzdPlI9mPCf/Uiz2bcbZhnrgCJqssXSawNHmdyPKQry825pcY76KxOJbrx2BNstvT7QbPEkHlGYZmxEOoy3gZnUQbPcVTzhzNiWLuBdUrABHxeLwiQiuvSj//yd2lyI/AIHLDj9EVkfFwAAAABJRU5ErkJggg")
                },
                BOMB: {
                    SIDEBAR: {
                        STROKE: getImage("img/touhou/bomb_sidebar.png", "24px", "24px"),
                        FILL: getImage("img/touhou/bomb_sidebar_on.png", "24px", "24px")
                    },
                    ITEM: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASSSURBVGhD3ZhPaBVHHMd/M+8lYI3GYwoxnkLxoOgpzYvpE6pJE9qL0ncSPHj1kggerGePhoIeLHgqHkxoT5I0qWKSlyC5tKBCKULB/y2omJAU6ntvp/Pb/e1jd97s7M7mTSH9HLKz83Y3+93fd37zm4H/gvLCsKCmUzgdnVFeOPZ19OgS52IkoYj/gxhGIsKjO5yKUa3l2mquI6O+/E4WE7eWEDBITSc4E6OzFGOstzxXcibIZWT0lirwCWq1HYdi9NnLpdWciDFlLZdWcxWZRDE+jqzmSIx5gnRltbaL0VlsbesDtQJcWc1BZOJRCYWoglxYzYXNzOOFcGG1toqxqb1cWK3NkdFbLKTFatycKGxpt82sXk6kZD1bGP4ZmhvyByPngbYih/1+g/AE9FIz1kYYE81rGbDYby2RkAzs7qRWgBDiBR2f+x0E58zvj0HXInUPYtevjq1OMVfrc52QEFVQu+AgvClq72ykDr40ujopW5Uw3DsN/70bjRLq8MdMiLTctDwYB6XJPirdxS440zcOX/Z8Bvs6uuB9bROu/H4Tqm9/pSvMpNnR87wHH7bqlbXTa34gYmKQ4fnhCc7gKp3GsBGC3DjyDfR99DFc/+M2rEshh7v74enfr+HOn1W6Ip0kQTIRTVZHq7Eh0iIG+fxuebDmNabV7IRkFYRReTW+AJ8unoVHG0+o1w6dEAHiRQcvVO6dWHpAXU20YkJMtssi6uXYPFx8/C3cej5LPdkw2GtmaaRaoXYLBTpqefr9s5m+Mwc2GINR6mrS21mAl7UGnen565938N3Ry3BgVw88XH8C6/VN+iUZk62WR6sX6FRLagWAvixyXsLwUleTtAGKETn48yno7tgDv538ES59co5+0ZNkK1Yv7FfHhw6jzVS2Y7tDe/vhp6FrMhlM+xktSl5bqVjVZvhgDDedxkiLEiYBFPFVzzD1BCTfJyo2QhDrQhPDjWGXomLZRI0MZjOMRhS0G841UdT7QlstjazMUFdmrGwWRbWcTgym5uU3v/hzTLecNHGe+WL1fEuqjkYHP5L8YCU6tWI7YmIFqm7MoCAUgBPnMzlZJmU01WrSXrneK9dNwYqSYWSapCWANKKCMHvqJsU0ci7OzCvK7VL3vFybHTnF2K0o8asnZ61WZBLItTdgLcZm00IVkVUQ1oTHZ4+31IVpWIvxRPrSGEl6cVVgiPqcRqFhFX3EWoxcHhgtkPSyKmnXMCa0k7OJPGMm9sWiL6V7waCmE9qZ3HRvHqtZiUkaL/giOiGSGV4vDuJsTnNHy6xuuBdEsW6VCCwjY7PPFdRWi+OLzWo7qLX0UdIhx6dVira1WaoYLEdMtRX24++ymVp7pY1PlcwVgG7WV8GKOsu6I8S03xBiUw1YRCbZYjYLqChJFXgUm2rAIjL6nU/baCSRFCX8UMsjK7Ht4iQyRUaXxfJGIwl8DlpKjZJNis4kRp315Recwq8VzVTtAMeGFFXC51OXT43VMmXRTGI4Cwq/cCv0/smq9exsg/98+X/CLeMCZ+39f9JqxkzmivL80FUcrwM/DKRYDeBf4UznqLANYywAAAAASUVORK5CYII")
                },
                BLUE_ORB: {
                    ITEM: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAawSURBVEhLXVbpb1zVFf+9dfaxPfF4ie3Y2E5inMUhDVmMAilhCUQVVAgBRVSVKiQ+oFYVSIhvfETiH+BLkRBESito8wGqIiwlVUVAFYuzASZ2iBfi8dgej2efN2/hd+5ziuBq7tz37rn3/M45v3PufRqkdT+UgIsB0zAHDE2Pup4fyLTJlwCBhkAP1wFbI+eg+eo9gAHdtwPocV3TLV9kmuYHbvOmW61dQu3kChefMO3uxFiqs+clKxo/EQR+UiFQO1XoGpu8hvpCEP7xUS0QIXXrpq7rFl8Nig0+IwiCjbWF2VebzuYZA6mhjB1JPR5JpV6IxJM9ph2NG6YdNy07wR7XDStmmGZMN4wYPeUYduOnMUoMm3CGRjT+QB2IJtOxRqUcNNfrH2tW9yNHe3YfeyfVNTAqZgW+B6/lwHMdsQbKKt+H6zTguy31HNqvw7Bs0CBouqHWelwj69xmCfG2NuTnvj1fLuT/oNndjz3Vt//42d7Rfci0xxCxDHgEarU8+AyvgMjoKqAQmBbDtEzQO8ZGozwAxXBcD7VKA+vz0zSmjrW576ZKG6t/NDXTzFiRCIa2p/C7+/uxoysmAUe14aLp+DAMRQM8DyjVWmgS3DJ1xGwDsQhBKHddH+Wai9lbNfzr0yUUSE0guSGNuUNDDcZUQ1tcR2/GQjKqodlsSdyQiGhIxXRk0zb2j7RjYqQNe3YksWt7HH3bbGSSBnraLezsi+PoeDseOdyJXQMp7pW8kORjC3zNBHwGBIjwSQSffV3APz9ZpsU+Q6fDoqWDPUn8/tQwrt4o4r+X8yhVHCUf7kugK+7j5tw8dmQI2J3BoZ2duDqdxMJSSWFIE/1MSaIG5MFpYbVYw8pGHSuFOhZWqvg+V0WOzw6VMp8RpzXb2qLsDHF3HFMXrmC2YGL8rr3QTAOXpq9j72i3Mtjf8kaBsDbgM+gtEue0XGYWSfddzrucdxlzVwoT9x7owp+fHMNLT4/jlWf3YHuHSd6YjWaUyeIjm81gba2I9nRUJQg1i3qC+BRzgaC6VOhRoXgVtYCOpIVMykQiqisD/vf1Ks58NIu3PpzBWx/MoOoEJJ8EN8tq30puFR0dKWyW6spwKlLsmz61KxACqM70jRDgV7uzOHRnVvFnkxvxZKArQX4SDG+YObaloXzqAKbOX8bnF7/CHYOdmJgYxplzF1W4bjd6Ik64rAsC0Bopxig3Hx7P4p59PRjtT6OrI4q1YgOzS0VcvJzDpetrSMYt8hKDHUtg8vgBnP7NJCaPjePb+SIWc5vKE/kJiOSUip8UoEdexJtSpY7L11dxaCyL818sYn65RHmABuMvxXfiYD8cx8XfL36Pf1yYQ7XWRNoaxN7BFHLrZdG45Qm71AkPU4KGXnhb4XKYZVfn8ljIlTA22I7H7xvGE78ewbMP78IzD+3E6EAam9UmflgtK4NcGtfkHtlPK0MAIV7TlCfMLj5wIiDZkkWBlDafF5aLePP9r3CTY5mWVuuO6pWag3yhRu82UShWledCuuyVMcxKT3W+KPJ0Wu5J/G4v8rwWN3rgqUEuYiiVG/jbR9fw7odX8Ndz03hv6ht8Mr2As/++hivXV0LDaL3ilKMmRKiKFydC8pUnskjclA2ymHcO9gxn8PxvJ7BnpFMV35F9vSTbxAOHB/Hyc0fw4NEh3HOgD7sZToNXmwBIV7rIiSKe0yFI0GoKJ1L1IihVHaRjJk4eHkKj6eLjT+dYJybuPzSEBzm3tlFFWzKKg2M9+NPTd+O5R/dhW4rHvYAwApJARNvihS9112ediGc+j4swnyuMe63RxNRnc/jP5zcxPbOMqG3SS09xMrtY4JFTwa18GQM9aSyT/I1yjSdFiudZC40G7xzFiaK6Ba3l01HILYgkK9c2A3SmDHS3GShtFpHPr6IrraM9HmDxVg6FQgEJ28W1mXkUiwXMzC2hXilhMGsjbvPIZ6gNySNaLoYrJM0INDN7+pU7Dh55/dSxIZyY6FT3gsP7QepBmuJPxnBQtR5e7PK9ICPvGuqL2OGpcPbCEr68dIO3YwHrP6y8W98s/UUzu06/PLT/7jdGeCTs7E+qW1AM+DkIGdxCkXkl409kAQVilOtJeAJ8s1hB7lYehcXvVuul0ouOaX2gGdsefax3151vm7bNIHHhloW/bLfTUj4UVOeiMCIUcr2QLjUmhdlq1JcLizdeazX8c6hMrvGCON5rt7VP0qJ+ZkWoiWpC1f9vW/Nq1Hm1WvIhpObUARt4/ERzeHY43OqwBBbdRvUaKifXgdf8HwErSMgP7tXT6gAAAABJRU5ErkJggg")
                },
                POWER_ORB: {
                    ITEM: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAWjSURBVEhLdVZLaFVXFF33vpe8vDw1MUaMaVKo1k9FjYq00HZQRAoFhajtQFEsdFK0KrFOOhAcVoqfzpw4KLVQ6KSDCkILijoomoqlxkEltRK1ifmYaN7/nnu71r73Pj+lG9Y77+zzWXvvs/c510Mi7wOFuUBvnnBAiw9E0nOCH7Jhx+ZSb636RJj0M0Qzf1rZadIY9WEV+Jv4fS0wZoveA7K9wMolwOdz2CURG9ss4gSfsHn202gQcVwd9X2SZIkmdkSayfKHBj6+AXwxC3wnJVYDHfOA/k7g03agq5WWtRD0rqC2GcjnCC7O639TAunUUtfCMXmUoSciRYHgfvlJGvQI+Nk7xoE7wJsfAN++Abwu8wKiTFQIWmUm0kuUCIbCxrmh6WmIIfHA5hSJKWIh8StwcRj42FPYXgV2fAh8/04uh+YFC+Dl8wjDEK5WQ8Y5ZDzSs42CADXqU/Ks7xsgUG9z6nWUi0VcZmBFeA345S/gkyzDk6HrHQVOblm+HN6RI8CKFcyAEJnZWXgEsrSXC/W/5elTRNzQa+aq1lZEc3icTQwgjcL0NHDzJnDuHLITE6SJhUZFPkPkKcayytEb99oSuPZ2uHIZITd3bW3Ud8ItWgRHQ9yGDQg3boRbvx5u2TK4xYufjW3eDLdlCzzuI68FJQzD7mUZR48x90MSBbRQUcKFC8CZMzwomlEowO/pgd/VFVsuDxSiyUmE9+8jkuXybulSYGDA5gRESpKKztBERI7wFIKHD4GRESPyu7uR27MHTZs2MQsCeAoXzyGamkL96lVUTp2Cu32bicywPWJ+dXRY4ohIrSBR8phoIOC5BCQy0Gr1w7lzkVm92sIh7yIZQvF7e5HbuRO5Q4cQzpvH+UG8jka4JGGEVPxxekjWUIMBz8QIBA4KjokQUR9VKpg9fRpTu3djau9eFM+e5SlnYk8ZNpuvdYxXyPgnZyPRYTQ8ChskakVKpUEkmsGx6q1bKF68iNLly6jcuIGwVILHxJHXtpahDZqyCGiAdn/eK5/pbR6pbmxiYlXDo5SIVmb6+lDYvx9tx49jzr598Fh3jklRZ1oH9NhAnaA6S0hs+YtnJJI0hAJ1cj+iTrXUfvgwFvDw2w4eRG7dOg5EKF26hAoTR2cTFEsIOM/xpnsudHEd6Q+3iepsjSRIwqe+kMQ7lZBFWxsextPz5zF29CjGT5xAlSluRtaTJOI8kch4ts88Yjwj80hQ9nBMBLaApAqbrp9HJ0/i3q5duNvfj5EDBzDBhCjdvRsbmBpJOO4mosSjOBlYfiJxIgppjUtBgnSyTFLmFZkA0yzm4tAQqqOjqDMZGvPUKrXZBqpJ7ZeslfjztQfRCJWsUj1oAftO3uiM2FfaNua9DM2nyek6ESREauD/GZNUbTLT0kKgLFIrHUPmZDlRe/Lkxc1TyABdYXxXdUbPFyyJqLGXOBYpHevBsQ7czEwcDm5QZ8qWdfjXrqH84IHp/oPk+nLVClFFIMOSPUlU500YE7HTmtOC9vlw+Va47lfgVq2CW7sWVd7MY9evY/TKFZQXLoRbsyYeW7kyhv7rJhd00+ucmOLy1Izn9nxAI+8j3r28kwe2ZrNfdm7bBm/7Dl6QjxlMDtvLz/jya0BfItrEhEYZ9DWhh5shh8Z44drt/fVp3BscBK9Y8NE7x2tuICU6uNXzvmrn++KxEH2ei50mwxFLcjsoKSieNmeILXND2cxRhlgloL/Rb4MYHR/HIMBffMbn/ScR6YNiy7vANy2+3+ZokcfZlvwviciMn9Bt5qunnSVKHnqpu11lMhtF//wBHOOL9mMfMGH7bQcW85vubdrWI1+otM8sjaVCX1K96s58UptQ2XHwRzw1jqkdmQGG3gIm+QEUGpG+hPjUZfjUWQFL93+iuuMJ2rpUpFOZJF0TvtzRD5YLEuBflxUynIu9F7cAAAAASUVORK5CYII"),
                    SMALL: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAH5SURBVDhPTZO/axRBFMc/s7sXN3pBCJ5FYpNahHhY+QdICqtAegnYCIFAGksLSRNSaUD7dIKdfbDxIK2BoJKLpJHImZgzdzu3uzN+Z+4ifuHtm9md7/u+H7MG4QUkX2HOQTPs5U0mCz4BL581IK91bgTH7+BHJD6Be3fhvT7Ohb1g/GQRIHIiyxQsHcDHDiwFonkDbx/l+VM3PU1RliTeM6xrSn3MjYlWa9+1li9w9Ana2Yqi3TDmzu29vRids7NxYrZAp0HByHM4PWW0usrhxQV/lH72U4p1o5EGjt3cxOzvR/4V0sVFqu4xvH5FpQC1iGpEqF2BFSF42+sxqipmOp1/dn1ri3I4wPb7lCpBZyOSlkijulbjoHAOJYgXube2xu/tbZidxUqpEMmlKVU4KETFyrmoWMhZea8e3trdZWZ9HdSsy5OT2LRKfZWCDzWOiVpEolwkSrm7vMxhu83nhQWKopBZrFTV6TjCRPPz2sTU7UC1yNdqe7/bZXB+HtMP7+xkPFJ06vlYMaQWYKemGDabVBsbXIZ9qzW2+XlsOcKqdmVXXRMlO5D0Q+c0LHiwsxNcxP2J/x8fVKeu3HfVWMZ8n8Ozm2n6GN0QFasnPoxIw02M94n2TkqlxvHrwLmXuqvfIlEw4QZN1hGh9pDN1Tq+FPRDqEz4C4e87TxeNPtIAAAAAElFTkSuQmCC")
                },
                GreenOrb: {
                    ITEM: getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIRSURBVChTHVLNTxNRHJx9v6Vsv2ihFKTFqpWiAQQJiamhhEQvxIsnbxw86827B4+ejJ5M/DeMifGoAeOBVCCpYPgMLWDp7rZd9/PtexbnMpdJZjIzCnqIlPoiPVoYLGY+zszNDo0kstj+U4O5fwGzYXzwPP+FX/OsSy1RqY8xUirRXPJ1tnJ18t6DMlaWVjBeGkcqlkTL0O90jI4tU6hKXfjEMrSs5RKvsvfz5eH5UZaJprEwNouCmodptaGTQe2LdkUKeRCc+VVKzg1+yS7m5yeXp9jClRncjhcxkboJx3SxWz+AMkjwXUfhnN/queg09vj6u7FKAbPZaTyMLUIxgK7ThdAYCqNF5LRRVH9VGetXsoKLn6oaV0F9BOIMjXodaz/WEEQDRPMDmBrpRUvmIOIMLCSoERWq9ARc08aRdYjyjTk8e/IcpKoIVQ7JgO29LUglgHLZpwQYbzjg+xbOd07we2cXARPwmYTtOThvnmF98zs6to3A4wh5CBJR8VSLxNLTEzPQZD+aZhMd18LXzTVw+IAAtmqbaB21dLtlfaIwJuzA5kvxZFILU4Tj5jFcWNg+2QLnPshj2Fjf6Bqn+hvvr/+eMIB97vqa2TLuOokgIlISbq+ltqGjsdvAXm0Pp0ennwMveCkPhPn/GqxIw0T0KHFt4G26MJQmW8K3fHTPunC6dr23wWoYht/koeT/AFc4/xk8aqknAAAAAElFTkSuQmCC")
                }
            }
        },
        ROLES: {
            RUMIA: {
                NAME: "露米娅",
                SPEED: {
                    HIGH: 10,
                    LOW: 5
                },
                BOX: {
                    HIT: new ABox(3),
                    GRAZE: new ABox(12)
                },
                SHOOT_COUNT: 0,
                SHOOT: function () {
                    let th = 45, tx = 5;
                    if (shift) {
                        th = 0;
                        tx = 0
                    }
                    PLAYER.ATTR.SHOOT_COUNT++;
                    if (PLAYER.ATTR.SHOOT_COUNT > 10) {
                        PLAYER.ATTR.SHOOT_COUNT = 0
                    }
                    if (PLAYER.DEFAULT.POWER.VALUE < 99) {
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x, PLAYER.POS.y), new POS(0, -40));
                    }
                    if (PLAYER.DEFAULT.POWER.VALUE >= 100) {
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x + 10, PLAYER.POS.y), new POS(0, -40));
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x - 10, PLAYER.POS.y), new POS(0, -40));
                    }
                    if (PLAYER.DEFAULT.POWER.VALUE >= 200 && PLAYER.ATTR.SHOOT_COUNT % 2 === 0 || PLAYER.DEFAULT.POWER.VALUE >= 300) {
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x - 20, PLAYER.POS.y), transTo(new POS(0, -40), tx * L));
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x + 20, PLAYER.POS.y), transTo(new POS(0, -40), -tx * L));
                    }
                    if (PLAYER.DEFAULT.POWER.VALUE >= 400) {
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x + 20, PLAYER.POS.y), transTo(new POS(0, -40), th * L));
                        SPAWN.PLAYER.BILL(new POS(PLAYER.POS.x - 20, PLAYER.POS.y), transTo(new POS(0, -40), -th * L));
                    }
                },
                DRAW: function (PLAYER) {
                    screen_draw.save();
                    screen_draw.translate(PLAYER.POS.x, PLAYER.POS.y);
                    screen_draw.fillStyle = "black";
                    screen_draw.shadowColor = "black";
                    screen_draw.shadowBlur = 3;
                    screen_draw.beginPath();
                    screen_draw.arc(0, 0, 12, 0, 2 * Math.PI);
                    screen_draw.closePath();
                    screen_draw.fill();
                    if (PLAYER.DEFAULT.BOMB.USED && PLAYER.DEFAULT.BOMB.FLAG > 0) {
                        screen_draw.shadowBlur = 10;
                        screen_draw.beginPath();
                        screen_draw.arc(0, 0, 220 - PLAYER.DEFAULT.BOMB.FLAG, 0, 2 * Math.PI);
                        screen_draw.closePath();
                        screen_draw.fill();
                        PLAYER.ATTR.BOX.HIT.r = 220 - PLAYER.DEFAULT.BOMB.FLAG;
                        PLAYER.ATTR.BOX.GRAZE.r = 220 - PLAYER.DEFAULT.BOMB.FLAG
                    } else {
                        if (PLAYER.ATTR.BOX.HIT.r !== 3) {
                            PLAYER.ATTR.BOX.HIT.r = 3
                        }
                        if (PLAYER.ATTR.BOX.GRAZE.r !== 12) {
                            PLAYER.ATTR.BOX.GRAZE.r = 12
                        }
                    }
                    screen_draw.restore()
                },
                PICK_LINE: 3 / 4
            }
        },
        MAP: {
            TEST: {
                NAME: "测试",
                STAGE: {
                    STAGE1: {
                        60: function () {
                            let blood = 2000, maxBlood = 2000, show = true, frame = 0, defendTime;
                            entities.push(new Entity({
                                drawPOS: new POS(-9, -15),
                                speed: new POS(0, 0),
                                POS: new POS(384, 432),
                                atkBox: new ABox(50),
                                sizeBox: new ABox(80),
                                type: ENTITY_TYPE.BOSS,
                                time: 0,
                                canHit: false,
                                defendTime: true,
                                hit: function (damage) {
                                    if (blood > 0 && damage > 0) {
                                        if (blood > maxBlood / 8 || !defendTime) {
                                            blood -= damage;
                                        } else {
                                            blood -= damage / 10;
                                        }
                                        PLAYER.SCORE += damage * 100;
                                        const r = blood / maxBlood;
                                        if (r < 0.05) {
                                            TOUHOU_CONFIG.RESOURCES.AUDIO.DAMAGE_1.currentTime = 0;
                                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.DAMAGE_1.play()
                                        } else {
                                            if (r < 0.1) {
                                                TOUHOU_CONFIG.RESOURCES.AUDIO.DAMAGE.currentTime = 0;
                                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.DAMAGE.play()
                                            }
                                        }
                                    }
                                },
                                done: function () {
                                    TOUHOU_CONFIG.RESOURCES.AUDIO.PLAY.currentTime = 0;
                                    t = TOUHOU_CONFIG.RESOURCES.AUDIO.PLAY.play();
                                    PLAYER.IS_STAGE = true
                                },
                                draw: function () {
                                    if (show && blood > 0) {
                                        screen_draw.save();
                                        screen_draw.rotate(-90 * L);
                                        screen_draw.strokeStyle = "rgba(171,0,1,0.81)";
                                        screen_draw.lineWidth = 6;
                                        screen_draw.beginPath();
                                        screen_draw.arc(0, 0, 100, 0, Math.PI * 2);
                                        screen_draw.closePath();
                                        screen_draw.stroke();
                                        screen_draw.strokeStyle = "rgb(255,255,255)";
                                        screen_draw.lineWidth = 3;
                                        screen_draw.beginPath();
                                        screen_draw.arc(0, 0, 100, Math.PI * 2, Math.PI * 2 * (1 - (blood / maxBlood)), true);
                                        screen_draw.stroke();
                                        if (defendTime) {
                                            screen_draw.beginPath();
                                            screen_draw.lineWidth = 6;
                                            screen_draw.strokeStyle = "rgba(113,0,255,0.81)";
                                            screen_draw.arc(0, 0, 100, -46 * L, -43 * L);
                                            screen_draw.stroke();
                                        }
                                        screen_draw.restore();
                                    }
                                },
                                tick: function (entity) {
                                    defendTime = entity.options.defendTime;
                                    if (entity.speed.x > 0) {
                                        entity.speed.x -= 0.1
                                    } else if (entity.speed.x < 0) {
                                        entity.speed.x += 0.1
                                    }
                                    if (Math.abs(entity.speed.x) < 0.1) {
                                        entity.speed.x = 0
                                    }
                                    if (entity.speed.y > 0) {
                                        entity.speed.y -= 0.1
                                    } else if (entity.speed.x < 0) {
                                        entity.speed.y += 0.1
                                    }
                                    if (Math.abs(entity.speed.x) < 0.1) {
                                        entity.speed.y = 0
                                    }
                                    entity.options.time++;
                                    if (entity.options.canHit && blood > 0) {
                                        for (let i = 0; i < entities.length; i++) {
                                            if (entities[i].type === ENTITY_TYPE.PLAYER_BULLET && entities[i].sizeBox.isHit(entities[i].POS.x, entities[i].POS.y, entity.POS, entity.sizeBox)) {
                                                entities[i].alive = false;
                                                entity.options.hit(1);
                                            }
                                        }
                                        if (PLAYER.DEFAULT.BOMB.FLAG > 1) {
                                            entity.options.hit(1);
                                        }
                                        if (PLAYER.DEFAULT.BOMB.FLAG === 1) {
                                            if (blood - 600 >= maxBlood / 8) {
                                                entity.options.hit(600);
                                            } else {
                                                entity.options.hit(blood - maxBlood / 8)
                                            }
                                        }
                                        if (entity.options.atkBox.isHit(entity.POS.x, entity.POS.y, PLAYER.POS, PLAYER.ATTR.BOX.HIT)) {
                                            if (PLAYER.ALIVE) {
                                                PLAYER.ALIVE = false;
                                            }
                                        }
                                    }
                                    if (!PLAYER.IS_SPELL) {
                                        let h = 0;
                                        switch (entity.options.time) {
                                            case 80:
                                                methods.push(new SpellCard({
                                                    slow_frame: 0,
                                                    start_frame: 100,
                                                    time: 600,
                                                    isTimeSpell: true,
                                                    bonus: 100000,
                                                    entity: entity,
                                                    dropBlueCount: 24,
                                                    dropPowerCount: 24,
                                                    noCardFrame: 2400,
                                                    noCard: function (card) {
                                                        if (blood > maxBlood / 8) {
                                                            entity.options.canHit = true;
                                                            frame++;
                                                            show = true;
                                                            if (frame % 30 === 0) {
                                                                for (let i = 0; i <= 360; i += 36) {
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(new POS(4, 4), (i + frame / 10) * L), 0.8);
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(arrowTo(entity.POS, PLAYER.POS, 4), (i + frame / 10) * L), 0.75)
                                                                }
                                                                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.currentTime = 0;
                                                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.play();
                                                            }
                                                            if (frame % 60 === 0) {
                                                                for (let j = 0; j < 16; j++) {
                                                                    for (let k = 0; k < 3; k++) {
                                                                        let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 20;
                                                                        SPAWN.SMALL_JADE(entity.POS.copy(), transTo(new POS(speed, speed), 90.0 - 135.0 / 16.0 * j - 3), 0.8)
                                                                    }
                                                                }
                                                            }
                                                            if (frame % 75 === 0) {
                                                                for (let j = 0; j < 16; j++) {
                                                                    for (let k = 0; k < 3; k++) {
                                                                        let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 20;
                                                                        SPAWN.SMALL_JADE(entity.POS.copy(), transTo(new POS(speed, speed), -90.0 + 135.0 / 16.0 * j), 0.5)
                                                                    }
                                                                }
                                                            }
                                                            if (frame % 90 === 0) {
                                                                for (let j = 0; j < 16; j++) {
                                                                    for (let k = 0; k < 3; k++) {
                                                                        let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 20;
                                                                        SPAWN.SMALL_JADE(entity.POS.copy(), transTo(new POS(speed, speed), 90.0 - 135.0 / 16.0 * j - 2), 0.8)
                                                                    }
                                                                }
                                                            }
                                                            if (frame % 105 === 0) {
                                                                for (let j = 0; j < 16; j++) {
                                                                    for (let k = 0; k < 3; k++) {
                                                                        let speed = (0.04 + 0.04 * Math.pow(1.09, 15 - j + k * 5)) * 20;
                                                                        SPAWN.SMALL_JADE(entity.POS.copy(), transTo(new POS(speed, speed), -90.0 + 135.0 / 16.0 * j - 1), 0.5)
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            card.open()
                                                        }
                                                    },
                                                    card: function () {
                                                        entity.options.canHit = false;
                                                        frame++;
                                                        show = false;
                                                        if (frame % 60 === 0) {
                                                            h = Math.random();
                                                            for (let i = 0; i < entities.length; i++) {
                                                                if (entities[i].type === ENTITY_TYPE.HOSTILE_BULLET && entities[i].options.tag === "spy") {
                                                                    entities[i].speed = arrowTo(entities[i].POS, PLAYER.POS, 5);
                                                                    entities[i].options.tag = undefined;
                                                                    entities[i].options.Hue = h
                                                                }
                                                            }
                                                        }
                                                        if (frame % 12 === 0) {
                                                            h = Math.random();
                                                            SPAWN.BILL(new POS(0, 0), transTo(new POS(0, 5), 90 * L), h, "auto", "spy");
                                                            SPAWN.BILL(new POS(0, 0), new POS(0, 5), h, "auto", "spy");
                                                            SPAWN.BILL(new POS(screen.width, screen.height), new POS(0, -5), h, "auto", "spy");
                                                            SPAWN.BILL(new POS(screen.width, screen.height), transTo(new POS(0, 5), -90 * L), h, "auto", "spy");
                                                        }
                                                    },
                                                    end: function () {
                                                        entity.options.canHit = false;
                                                        blood = 2000;
                                                        maxBlood = blood;
                                                        entity.options.time = 700
                                                    }
                                                }));
                                                break;
                                            case 800:
                                                methods.push(new SpellCard({
                                                    slow_frame: 0,
                                                    start_frame: 100,
                                                    time: 4000,
                                                    bonus: 200000,
                                                    entity: entity,
                                                    dropBlueCount: 24,
                                                    dropPowerCount: 24,
                                                    start: function () {
                                                        show = true;
                                                    },
                                                    noCardFrame: 2400,
                                                    noCard: function (card) {
                                                        if (blood > maxBlood / 8) {
                                                            entity.options.canHit = true;
                                                            frame++;
                                                            show = true;
                                                            if (frame % 20 === 0) {
                                                                for (let i = 0; i < entities.length; i++) {
                                                                    if (entities[i].type === ENTITY_TYPE.HOSTILE_BULLET && entities[i].options.tag === "spy") {
                                                                        entities[i].speed = arrowTo(entities[i].POS, PLAYER.POS, 6);
                                                                        entities[i].options.tag = undefined;
                                                                        entities[i].h = h
                                                                    }
                                                                }
                                                                for (let i = 0; i <= 360; i += 30) {
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(new POS(4, 4), (i + frame / 10) * L), 0.8);
                                                                    if (frame % 40 === 0) {
                                                                        SPAWN.BILL(entity.POS.copy(), transTo(arrowTo(entity.POS, PLAYER.POS, 6), (i + frame / 10) * L), 0.75, "auto", "spy")
                                                                    }
                                                                }
                                                                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.currentTime = 0;
                                                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.play();
                                                            }
                                                        } else {
                                                            card.open()
                                                        }
                                                    },
                                                    card: function (card) {
                                                        entity.options.canHit = true;
                                                        if (blood < 1) {
                                                            card.en_ep()
                                                        }
                                                        frame++;
                                                        if (frame % 10 === 0) {
                                                            for (let i = 0; i <= 360; i += 13) {
                                                                SPAWN.POINT(new POS(384, 432), transTo(new POS(4, 4), (i + frame / 10) * L));
                                                            }
                                                        }
                                                    }
                                                    , bonus_callback: function (card) {
                                                        SPAWN.PLAYER_ORB(card.entity.POS.copy(), new POS(0, -10));
                                                    }
                                                    , end: function () {
                                                        entity.options.canHit = false;
                                                        blood = 2000;
                                                        maxBlood = blood;
                                                        entity.options.time = 1500
                                                    }
                                                }));
                                                break;
                                            case 1600:
                                                methods.push(new SpellCard({
                                                    slow_frame: 0,
                                                    start_frame: 100,
                                                    time: 3000,
                                                    bonus: 500000,
                                                    entity: entity,
                                                    dropBlueCount: 24,
                                                    dropPowerCount: 24,
                                                    POS: new POS(384, 434),
                                                    noCardFrame: 3600,
                                                    noCard: function (card) {
                                                        if (blood > maxBlood / 8) {
                                                            entity.options.canHit = true;
                                                            frame++;
                                                            show = true;
                                                            if (frame % 18 === 0) {
                                                                for (let i = 0; i <= 360; i += 24) {
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(new POS(4, 4), (i + frame / 10) * L), 0.8);
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(new POS(4, 4), -(i + frame / 10) * L), 0.8);
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(arrowTo(entity.POS, PLAYER.POS, 4), (i + frame / 10) * L), 0.75);
                                                                    SPAWN.BILL(entity.POS.copy(), transTo(arrowTo(entity.POS, PLAYER.POS, 4), -(i + frame / 10) * L), 0.75);
                                                                }
                                                                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.currentTime = 0;
                                                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.play();
                                                            }
                                                        } else {
                                                            card.open()
                                                        }
                                                    },
                                                    card: function (card) {
                                                        entity.options.canHit = true;
                                                        if (blood < 1) {
                                                            card.en_ep()
                                                        }
                                                        frame++;
                                                        if (frame % 20 === 0) {
                                                            for (let i = 0; i <= 360; i += 13) {
                                                                h = Math.random();
                                                                SPAWN.SMALL_JADE(entity.POS.copy(), transTo(new POS(4, 4), (i + frame / 30) * L), h);
                                                                SPAWN.SMALL_JADE(entity.POS.copy(), transTo(arrowTo(entity.POS, PLAYER.POS, 4), i * L), h)
                                                            }
                                                            TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.currentTime = 0;
                                                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.play();
                                                            TOUHOU_CONFIG.RESOURCES.AUDIO.CHANGE_TRACK.currentTime = 0;
                                                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.CHANGE_TRACK.play();
                                                        }
                                                    }
                                                    , bonus_callback: function (card) {
                                                        SPAWN.PLAYER_ORB(card.entity.POS.copy(), new POS(0, -10));
                                                    }
                                                    , end: function () {
                                                        entity.options.canHit = false;
                                                        blood = 8000;
                                                        maxBlood = 8000;
                                                        entity.options.time = 2700
                                                    }
                                                }));
                                                break;
                                            case 2800:
                                                let raw = 0, raw_speed = 0, _6_6_POS = new POS(6, 6);
                                                methods.push(new SpellCard({
                                                    slow_frame: 60,
                                                    start_frame: 100,
                                                    time: 7200,
                                                    bonus: 1000000,
                                                    entity: entity,
                                                    dropBlueCount: 24,
                                                    dropPowerCount: 24,
                                                    card: function (card) {
                                                        entity.options.canHit = true;
                                                        if (blood < 1) {
                                                            card.en_ep()
                                                        }
                                                        //波与粒的境界
                                                        frame++;
                                                        if (frame % 2 === 0) {
                                                            if (raw >= 90) {
                                                                raw = raw % 90
                                                            }
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L), 0.8, -raw * 4 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 45 * L), 0.8, -raw * 4 * L - 45 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 90 * L), 0.8, -raw * 4 * L - 90 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 135 * L), 0.8, -raw * 4 * L - 135 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 180 * L), 0.8, -raw * 4 * L - 180 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 225 * L), 0.8, -raw * 4 * L - 225 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 270 * L), 0.8, -raw * 4 * L - 270 * L - 45 * L);
                                                            SPAWN.RICE(entity.POS.copy(), transTo(_6_6_POS, raw * 4 * L + 315 * L), 0.8, -raw * 4 * L - 315 * L - 45 * L);
                                                            if (raw === 0) {
                                                                raw_speed += 2;
                                                                if (raw_speed > 360) {
                                                                    raw_speed = 0
                                                                }
                                                            }
                                                            raw += raw_speed;
                                                            TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT_1.currentTime = 0;
                                                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT_1.play();
                                                        }
                                                    }
                                                    , end: function () {
                                                        entity.die()
                                                    }
                                                }));
                                                break;
                                        }
                                    }
                                },
                                die: function () {
                                    TOUHOU_CONFIG.RESOURCES.AUDIO.EN_EP_1.currentTime = 0;
                                    t = TOUHOU_CONFIG.RESOURCES.AUDIO.EN_EP_1.play();
                                    setTimeout(function () {
                                        PLAYER.IS_STAGE = false;
                                        PLAYER.END = true
                                    }, 2000);
                                }
                            }));
                        }
                    },
                    DEFAULT: {
                        BOMB: {
                            COUNT: 3
                        },
                        POWER: {
                            VALUE: 400
                        },
                        PLAYER: 2
                    }
                },
                EXTRA: {}
            }
        }
    };
    let
        form, layer, //依赖项
        screen_draw, t, shift = false, frames = 0, timestamp = 0, mode = 0, comp_lay,
        runAnimationFrame, FPS_interval,//驱动
        score, bomb, power_high, power_low, screen, player, FPS, graze, point, timeOut, shade;//DOM
    let keys = [], entities = [], methods = [], stopSounds = [], PLAYER = {
        IS_SLOW: false,
        IS_PAUSE: false,
        IS_SPELL: false,
        NO_MISS: true, MISS_TIME: 0, IS_STAGE: false,
        TIME: 0,
        SCORE: 0,
        POINT: 0,
        GRAZE: {
            VALUE: 0,
            FLAG: false//判断已擦弹
        },
        ALIVE: true,
        TIME_TO_MISS: {
            VALUE: 10,
            FLAG: false//判断已被弹
        },
        POS: new POS(384, 632),
        INDESTRUCTIBLE: 200,
        ATTR: TOUHOU_CONFIG.ROLES.RUMIA,
        DEFAULT: TOUHOU_CONFIG.MAP.TEST.STAGE.DEFAULT
    }, L = Math.PI / 180;
    const ModeMapping = {
        Start: 0,
        Stage: 1,
        Extra: 2,
        Test: -1,
        Replay: -2,
        Data: -3,
        Option: -4,
        Exit: -65535
    };
    const ModeShow = {
        Start: "",
        Stage: "Game Start",
        Extra: "Extra Start",
        Test: "Test",
        Replay: "Replay",
        Data: "Play Data",
        Option: "Option",
        Exit: "Quit"
    };
    const SwitchMapping = {
        Continue: 0,
        BackMenu: -1,
        Restart: 1,
    };
    const SwitchShow = {
        Continue: "解除暂停",
        BackMenu: "返回至主菜单",
        Restart: "从头开始",
    };
    const ENTITY_TYPE = {
        Menu: 0,
        PLAYER_BULLET: 1,
        HOSTILE_BULLET: 2,
        ITEM: 3,
        BOSS: 4
    }, DRAW_LIST = {
        BULLET: {
            SMALL_JADE: {
                len: 0
            },
            BILL: {
                len: 0
            },
            RICE: {
                len: 0
            },
            POINT: {
                len: 0
            }
        },
        TEXTURE: {
            SPELL_CARD: {
                len: 0
            },
            MenuStar: {
                len: 0
            }
        }
    };
    const METHOD = {
        BULLET: {
            TICK: function (entity) {
                if (entity.sizeBox.isOutScreen(entity.POS.x, entity.POS.y, screen.width, screen.height, entity.speed)) {
                    entity.alive = false
                }
                if (entity.options.atkBox) {
                    if (entity.options.atkBox.isHit(entity.POS.x, entity.POS.y, PLAYER.POS, PLAYER.ATTR.BOX.GRAZE)) {
                        if (entity.canGraze || entity.canGraze === undefined) {
                            if (!PLAYER.DEFAULT.BOMB.USED) {
                                PLAYER.GRAZE.VALUE++
                            }
                            PLAYER.SCORE += 500;
                            PLAYER.SCORE += PLAYER.POINT * 10;
                            if (PLAYER.GRAZE.VALUE > TOUHOU_CONFIG.SETTING.GRAZE_MAX) {
                                PLAYER.GRAZE.VALUE = TOUHOU_CONFIG.SETTING.GRAZE_MAX
                            }
                            entity.canGraze = false;
                            PLAYER.GRAZE.FLAG = true;
                            TOUHOU_CONFIG.RESOURCES.AUDIO.GRAZE.currentTime = 0;
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.GRAZE.play();
                            graze.innerHTML = PLAYER.GRAZE.VALUE
                        }
                    } else {
                        entity.canGraze = true
                    }
                    if (entity.options.atkBox.isHit(entity.POS.x, entity.POS.y, PLAYER.POS, PLAYER.ATTR.BOX.HIT)) {
                        if (PLAYER.ALIVE) {
                            PLAYER.ALIVE = false
                        }
                        if (PLAYER.DEFAULT.BOMB.USED) {
                            PLAYER.SCORE += PLAYER.POINT * 100;
                            entity.alive = false
                        }
                    }
                }
            },
            DRAW: function (entity, image) {
                if (entity.options.t) {
                    if (entity.options.t === "auto") {
                        let value = Math.atan2(entity.speed.y, entity.speed.x) + 67.5;
                        value = value % 360.0;
                        screen_draw.rotate(value)
                    } else {
                        screen_draw.rotate(entity.options.t)
                    }
                }
                if (!DRAW_LIST.BULLET.BILL[entity.options.Hue]) {
                    DRAW_LIST.BULLET.BILL[entity.options.Hue] = {};
                    DRAW_LIST.BULLET.BILL.len++;
                }
                let cache = DRAW_LIST.BULLET.BILL[entity.options.Hue];
                if (entity.canGraze) {
                    if (!cache.normalCanvas) {
                        cache.normalCanvas = document.createElement("canvas");
                        DRAW.BILL(entity, cache.normalCanvas, image);
                    }
                    screen_draw.drawImage(cache.normalCanvas, entity.drawPOS.x, entity.drawPOS.y);
                } else {
                    if (!cache.grazeCanvas) {
                        cache.grazeCanvas = document.createElement("canvas");
                        DRAW.BILL(entity, cache.grazeCanvas, image);
                    }
                    screen_draw.drawImage(cache.grazeCanvas, entity.drawPOS.x, entity.drawPOS.y);
                }
            }
        },
        ITEM: {
            TICK: function (entity, pick) {
                if (entity.sizeBox.isOut(entity.POS.x, entity.POS.y, screen.width, screen.height, entity.speed) && entity.POS.y > screen.height) {
                    entity.die()
                }
                entity.speed.y += 0.04;
                if (PLAYER.ALIVE) {
                    if (entity.options.pickBox) {
                        if (entity.options.pickBox.isHit(entity.POS.x, entity.POS.y, PLAYER.POS.copy(), PLAYER.ATTR.BOX.GRAZE)) {
                            entity.spy = true
                        }
                    }
                    if (PLAYER.POS.y < (1 - PLAYER.ATTR.PICK_LINE) * screen.height) {
                        entity.spy = true
                    }
                    if (PLAYER.DEFAULT.BOMB.USED) {
                        entity.spy = true
                    }
                    if (entity.spy) {
                        entity.speed = arrowTo(entity.POS.copy(), PLAYER.POS.copy(), 30)
                    } else {
                        if (entity.speed.x !== 0) {
                            entity.speed.x = 0
                        }
                        if (entity.speed.y > 3) {
                            entity.speed.y = 3
                        }
                        if (entity.speed.y < -3) {
                            entity.speed.y = -3
                        }
                    }
                    if (entity.sizeBox.isHit(entity.POS.x, entity.POS.y, PLAYER.POS.copy(), PLAYER.ATTR.BOX.GRAZE)) {
                        entity.die();
                        TOUHOU_CONFIG.RESOURCES.AUDIO.ITEM.currentTime = 0;
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.ITEM.play();
                        pick()
                    }
                } else {
                    entity.spy = false
                }
            }
        },
        Menu: {
            TICK: function (entity) {
                if (entity.sizeBox.isOut(entity.POS.x, entity.POS.y, screen.width, screen.height, entity.speed) && entity.POS.y > screen.height) {
                    entity.POS.y = 0
                }
            }
        }
    };
    const DRAW = {
        SMALL_JADE: function (ctx, entity, o, i) {
            ctx.save();
            ctx.fillStyle = o;
            ctx.shadowColor = o;
            ctx.beginPath();
            ctx.arc(entity.sizeBox.r, entity.sizeBox.r, entity.sizeBox.r - 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = i;
            ctx.shadowColor = i;
            ctx.shadowBlur = 2;
            ctx.beginPath();
            ctx.arc(entity.sizeBox.r, entity.sizeBox.r, entity.options.sizeBox.r - 3, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        BILL: function (entity, canvas, image) {
            let ctx = canvas.getContext("2d");
            ctx.width = entity.options.width;
            ctx.height = entity.options.height;
            ctx.drawImage(image, 0, 0);
            let px = ctx.getImageData(0, 0, entity.options.width, entity.options.height);
            for (let i = 0; i < px.data.length; i += 4) {
                if (px.data[i] === 255 && px.data[i + 1] === 255 && px.data[i + 2] === 255) {
                    continue;
                }
                let hsl = rgbToHsl(px.data[i], px.data[i + 1], px.data[i + 2]);
                let rgb = hslToRgb(entity.options.Hue, 1, hsl[2]);
                px.data[i] = rgb[0];
                px.data[i + 1] = rgb[1];
                if (entity.canGraze) {
                    px.data[i + 2] = rgb[2];
                } else {
                    px.data[i + 2] = 0;
                }
            }
            ctx.putImageData(px, 0, 0);
        },
        RICE: function (ctx, entity, o, i) {
            ctx.shadowColor = o;
            ctx.shadowBlur = 1;
            ctx.fillStyle = i;
            let scar_x = entity.sizeBox.r, scar_y = entity.sizeBox.r / 5;
            ctx.save();
            ctx.moveTo(scar_x, scar_y);
            ctx.quadraticCurveTo(scar_y, scar_x, scar_x, entity.sizeBox.r * 2 - scar_y);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.moveTo(scar_x, scar_y);
            ctx.quadraticCurveTo(entity.sizeBox.r * 2 - scar_y, scar_x, scar_x, entity.sizeBox.r * 2 - scar_y);
            ctx.fill();
            ctx.restore();
        },
        POINT: function (ctx, entity, color) {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 1;
            ctx.arc(entity.sizeBox.r, entity.sizeBox.r, entity.sizeBox.r - 1, 0, 2 * Math.PI);
            ctx.fill();
        },
        MenuStar: function (ctx, entity, color) {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 1;
            ctx.arc(entity.sizeBox.r, entity.sizeBox.r, entity.sizeBox.r - 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }, SPAWN = {
        PLAYER: {
            BILL: function (pos, speed, t = "auto") {
                entities.push(new Entity({
                    draw: function (entity) {
                        screen_draw.save();
                        if (t) {
                            if (t === "auto") {
                                let value = Math.atan2(entity.speed.y, entity.speed.x) - 67.5;
                                value = value % 360.0;
                                screen_draw.rotate(value)
                            } else {
                                screen_draw.rotate(t)
                            }
                        }
                        screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.BILL.PLAYER, entity.drawPOS.x, entity.drawPOS.y);
                        screen_draw.restore()
                    },
                    tick: function (entity) {
                        if (entity.sizeBox.isOut(entity.POS.x, entity.POS.y, screen.width, screen.height, entity.speed)) {
                            entity.alive = false;
                        }
                    },
                    drawPOS: new POS(-11, -16),
                    speed: speed,
                    POS: pos,
                    type: ENTITY_TYPE.PLAYER_BULLET,
                    sizeBox: new RBox(22, 32)
                }));
            }
        },
        SMALL_JADE: function (pos, speed, h) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                atkBox: new ABox(6),
                type: ENTITY_TYPE.HOSTILE_BULLET,
                draw: function (entity) {
                    if (!DRAW_LIST.BULLET.SMALL_JADE[h]) {
                        DRAW_LIST.BULLET.SMALL_JADE[h] = {};
                        DRAW_LIST.BULLET.SMALL_JADE.len++;
                    }
                    let cache = DRAW_LIST.BULLET.SMALL_JADE[h];
                    if (entity.canGraze) {
                        if (!cache.normalCanvas) {
                            cache.normalCanvas = document.createElement("canvas");
                            cache.normalCanvas.width = 2 * entity.sizeBox.r;
                            cache.normalCanvas.height = 2 * entity.sizeBox.r;
                            DRAW.SMALL_JADE(cache.normalCanvas.getContext("2d"), entity, `hsl(${h * 360},100%,50%)`, "white")
                        }
                        screen_draw.drawImage(cache.normalCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    } else {
                        if (!cache.grazeCanvas) {
                            cache.grazeCanvas = document.createElement("canvas");
                            cache.grazeCanvas.width = 2 * entity.sizeBox.r;
                            cache.grazeCanvas.height = 2 * entity.sizeBox.r;
                            let o_color = hslToRgb(h, 1, 0.5);
                            DRAW.SMALL_JADE(cache.grazeCanvas.getContext("2d"), entity, `rgb(${o_color[0]},${o_color[1]},0)`, "yellow")
                        }
                        screen_draw.drawImage(cache.grazeCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    }
                },
                die: function () {
                    PLAYER.SCORE += Math.floor(PLAYER.GRAZE.VALUE / 3 * 10 * PLAYER.DEFAULT.BOMB.USED || 20)
                },
                tick: METHOD.BULLET.TICK,
                sizeBox: new ABox(10)
            }));
        },
        RICE: function (pos, speed, h, t) {
            entities.push(new Entity({
                speed: speed,
                POS: pos, t: t,
                atkBox: new ABox(4),
                type: ENTITY_TYPE.HOSTILE_BULLET,
                draw: function (entity) {
                    if (entity.options.t) {
                        screen_draw.rotate(entity.options.t)
                    }
                    if (!DRAW_LIST.BULLET.RICE[h]) {
                        DRAW_LIST.BULLET.RICE[h] = {};
                        DRAW_LIST.BULLET.RICE.len++;
                    }
                    let cache = DRAW_LIST.BULLET.RICE[h];
                    if (entity.canGraze) {
                        if (!cache.normalCanvas) {
                            cache.normalCanvas = document.createElement("canvas");
                            cache.normalCanvas.width = 2 * entity.sizeBox.r;
                            cache.normalCanvas.height = 2 * entity.sizeBox.r;
                            DRAW.RICE(cache.normalCanvas.getContext("2d"), entity, `hsl(${h * 360},100%,50%)`, "white")
                        }
                        screen_draw.drawImage(cache.normalCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    } else {
                        if (!cache.grazeCanvas) {
                            cache.grazeCanvas = document.createElement("canvas");
                            cache.grazeCanvas.width = 2 * entity.sizeBox.r;
                            cache.grazeCanvas.height = 2 * entity.sizeBox.r;
                            let o_color = hslToRgb(h, 1, 0.5);
                            DRAW.RICE(cache.grazeCanvas.getContext("2d"), entity, `rgb(${o_color[0]},${o_color[1]},0)`, "yellow")
                        }
                        screen_draw.drawImage(cache.grazeCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    }
                },
                die: function () {
                    PLAYER.SCORE += Math.floor(PLAYER.GRAZE.VALUE / 3 * 10 * PLAYER.DEFAULT.BOMB.USED || 20)
                },
                tick: METHOD.BULLET.TICK,
                sizeBox: new ABox(10)
            }));
        },
        POINT: function (pos, speed) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                atkBox: new ABox(4),
                type: ENTITY_TYPE.HOSTILE_BULLET,
                draw: function (entity) {
                    if (!DRAW_LIST.BULLET.POINT[0]) {
                        DRAW_LIST.BULLET.POINT[0] = {};
                        DRAW_LIST.BULLET.POINT.len++;
                    }
                    let cache = DRAW_LIST.BULLET.POINT[0];
                    if (entity.canGraze) {
                        if (!cache.normalCanvas) {
                            cache.normalCanvas = document.createElement("canvas");
                            cache.normalCanvas.width = 2 * entity.sizeBox.r;
                            cache.normalCanvas.height = 2 * entity.sizeBox.r;
                            DRAW.POINT(cache.normalCanvas.getContext("2d"), entity, "white")
                        }
                        screen_draw.drawImage(cache.normalCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    } else {
                        if (!cache.grazeCanvas) {
                            cache.grazeCanvas = document.createElement("canvas");
                            cache.grazeCanvas.width = 2 * entity.sizeBox.r;
                            cache.grazeCanvas.height = 2 * entity.sizeBox.r;
                            DRAW.POINT(cache.grazeCanvas.getContext("2d"), entity, "yellow")
                        }
                        screen_draw.drawImage(cache.grazeCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    }
                },
                die: function () {
                    PLAYER.SCORE += Math.floor(PLAYER.GRAZE.VALUE / 3 * 10 * PLAYER.DEFAULT.BOMB.USED || 20)
                },
                tick: METHOD.BULLET.TICK,
                sizeBox: new ABox(5)
            }));
        },
        MenuStar: function (pos, speed, size = 2) {
            if (size < 0) {
                size = -size
            }
            if (size < 1) {
                size++
            }
            let show = false;
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                type: ENTITY_TYPE.Menu,
                draw: function (entity) {
                    if (show) {
                        if (Math.random() > 0.999) {
                            show = false
                        }
                        if (!DRAW_LIST.TEXTURE.MenuStar[entity.sizeBox.r]) {
                            DRAW_LIST.TEXTURE.MenuStar[entity.sizeBox.r] = {};
                            DRAW_LIST.TEXTURE.MenuStar.len++;
                        }
                        let cache = DRAW_LIST.TEXTURE.MenuStar[entity.sizeBox.r];
                        if (!cache.normalCanvas) {
                            cache.normalCanvas = document.createElement("canvas");
                            cache.normalCanvas.width = 2 * entity.sizeBox.r;
                            cache.normalCanvas.height = 2 * entity.sizeBox.r;
                            DRAW.MenuStar(cache.normalCanvas.getContext("2d"), entity, "white")
                        }
                        screen_draw.drawImage(cache.normalCanvas, -entity.sizeBox.r, -entity.sizeBox.r);
                    } else {
                        if (Math.random() > 0.9) {
                            show = true
                        }
                    }
                },
                tick: METHOD.Menu.TICK,
                sizeBox: new ABox(size)
            }));
        },
        BILL: function (pos, speed, h, t = "auto", tag) {
            entities.push(new Entity({
                drawPOS: new POS(-8, -11),
                speed: speed,
                POS: pos,
                tag: tag,
                atkBox: new ABox(6),
                width: 16, height: 22, Hue: h, t: t,
                type: ENTITY_TYPE.HOSTILE_BULLET,
                draw: function (entity) {
                    METHOD.BULLET.DRAW(entity, TOUHOU_CONFIG.RESOURCES.IMAGE.BILL.DASH);
                },
                die: function () {
                    PLAYER.SCORE += Math.floor(PLAYER.GRAZE.VALUE / 3 * 10 * PLAYER.DEFAULT.BOMB.USED || 20)
                },
                tick: METHOD.BULLET.TICK,
                sizeBox: new RBox(16, 22)
            }));
        },
        BLUE_ORB: function (pos, speed) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                pickBox: new ABox(40),
                width: 25, height: 25,
                type: ENTITY_TYPE.ITEM,
                draw: function () {
                    screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.BLUE_ORB.ITEM, 0, 0)
                },
                tick: function (entity) {
                    METHOD.ITEM.TICK(entity, function () {
                        PLAYER.POINT++;
                        if (PLAYER.POS.y < (1 - PLAYER.ATTR.PICK_LINE) * screen.height) {
                            PLAYER.SCORE += 10000;
                        } else {
                            PLAYER.SCORE += Math.floor(100000 * (screen.height - PLAYER.POS.y) / screen.height * PLAYER.ATTR.PICK_LINE);
                        }
                        point.innerHTML = PLAYER.POINT
                    })
                },
                sizeBox: new RBox(25, 25)
            }));
        },
        GreenOrb: function (pos, speed, spy) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                pickBox: new ABox(14),
                width: 12, height: 12, spy: spy,
                type: ENTITY_TYPE.ITEM,
                draw: function () {
                    screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.GreenOrb.ITEM, 0, 0)
                },
                tick: function (entity) {
                    METHOD.ITEM.TICK(entity, function () {
                        if (PLAYER.POS.y < (1 - PLAYER.ATTR.PICK_LINE) * screen.height) {
                            PLAYER.SCORE += 1000;
                        } else {
                            PLAYER.SCORE += Math.floor(10000 * (screen.height - PLAYER.POS.y) / screen.height * PLAYER.ATTR.PICK_LINE);
                        }
                    })
                },
                sizeBox: new ABox(6)
            }));
        },
        POWER_ORB: function (pos, speed, small) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                pickBox: new ABox(40),
                type: ENTITY_TYPE.ITEM,
                draw: function () {
                    if (small) {
                        screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.POWER_ORB.SMALL, 0, 0)
                    } else {
                        screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.POWER_ORB.ITEM, 0, 0)
                    }
                },
                tick: function (entity) {
                    if (PLAYER.DEFAULT.POWER.VALUE >= TOUHOU_CONFIG.SETTING.POWER_MAX) {
                        entity.die();
                        if (small) {
                            SPAWN.GreenOrb(entity.POS.copy(), entity.speed.copy())
                        } else {
                            SPAWN.BLUE_ORB(entity.POS.copy(), entity.speed.copy())
                        }
                    }
                    METHOD.ITEM.TICK(entity, function () {
                        PLAYER.SCORE += 10;
                        let old = Math.floor(PLAYER.DEFAULT.POWER.VALUE / 100);
                        if (small) {
                            PLAYER.DEFAULT.POWER.VALUE += 5
                        } else {
                            PLAYER.DEFAULT.POWER.VALUE += 100
                        }
                        if (PLAYER.DEFAULT.POWER.VALUE > TOUHOU_CONFIG.SETTING.POWER_MAX) {
                            PLAYER.DEFAULT.POWER.VALUE = TOUHOU_CONFIG.SETTING.POWER_MAX;
                            PLAYER.SCORE += Math.floor(51200 * PLAYER.MISS_TIME / 512)
                        } else if (PLAYER.DEFAULT.POWER.VALUE === TOUHOU_CONFIG.SETTING.POWER_MAX) {
                            methods.push(new DrawFont(120, function () {
                                screen_draw.font = "30px sans-serif";
                                screen_draw.fillStyle = "rgb(133,133,133)";
                                screen_draw.fillText("Full Power Up!", 250, 300)
                            }));
                            clear_screen()
                        }
                        if (PLAYER.DEFAULT.POWER.VALUE / 100 - old >= 1) {
                            TOUHOU_CONFIG.RESOURCES.AUDIO.POWER_UP.currentTime = 0;
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.POWER_UP.play();
                        }
                        renderer_power();
                    })
                },
                sizeBox: new RBox(25, 25)
            }));
        }, PLAYER_ORB: function (pos, speed) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                pickBox: new ABox(40),
                width: 13, height: 13,
                type: ENTITY_TYPE.ITEM,
                draw: function () {
                    screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.PLAYER.ITEM, 0, 0)
                },
                tick: function (entity) {
                    METHOD.ITEM.TICK(entity, function () {
                        PLAYER.DEFAULT.PLAYER++;
                        if (PLAYER.DEFAULT.PLAYER > TOUHOU_CONFIG.SETTING.PLAYER_MAX) {
                            PLAYER.DEFAULT.PLAYER = TOUHOU_CONFIG.SETTING.PLAYER_MAX
                        }
                        TOUHOU_CONFIG.RESOURCES.AUDIO.EXTEND.currentTime = 0;
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.EXTEND.play();
                        renderer_player();
                    })
                },
                sizeBox: new RBox(25, 25)
            }));
        }, BOMB: function (pos, speed) {
            entities.push(new Entity({
                speed: speed,
                POS: pos,
                pickBox: new ABox(40),
                width: 13, height: 13,
                type: ENTITY_TYPE.ITEM,
                draw: function () {
                    screen_draw.drawImage(TOUHOU_CONFIG.RESOURCES.IMAGE.BOMB.ITEM, 0, 0)
                },
                tick: function (entity) {
                    METHOD.ITEM.TICK(entity, function () {
                        PLAYER.DEFAULT.BOMB.COUNT++;
                        if (PLAYER.DEFAULT.BOMB.COUNT > TOUHOU_CONFIG.SETTING.BOMB_MAX) {
                            PLAYER.DEFAULT.BOMB.COUNT = TOUHOU_CONFIG.SETTING.BOMB_MAX
                        }
                        TOUHOU_CONFIG.RESOURCES.AUDIO.CART_GET.currentTime = 0;
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.CART_GET.play();
                        renderer_bomb();
                    })
                },
                sizeBox: new RBox(25, 25)
            }));
        }
    };
    layui.use(['form', 'layer'], function () {
        form = layui.form;
        layer = layui.layer;
    });
    this.info = function () {
        console.info("[Touhou.JS]Create by BlueWhale.");
    };

    /**
     * HSL颜色值转换为RGB.
     * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
     * h, s, 和 l 设定在 [0, 1] 之间
     * 返回的 r, g, 和 b 在 [0, 255]之间
     *
     * @return  Array RGB色值数值
     * @param h 色相
     * @param s 饱和度
     * @param l 亮度
     */
    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
     * RGB 颜色值转换为 HSL.
     * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
     * r, g, 和 b 需要在 [0, 255] 范围内
     * 返回的 h, s, 和 l 在 [0, 1] 之间
     *
     * @return  Array HSL各值数组
     * @param r 红
     * @param g 绿
     * @param b 蓝
     */
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    function arrowTo(from, to, speed) {
        const s = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        let x_speed = (to.x - from.x) / s * speed, y_speed = (to.y - from.y) / s * speed;
        return new POS(x_speed, y_speed)
    }

    function stopAllSound() {
        for (let s in TOUHOU_CONFIG.RESOURCES.AUDIO) {
            if (!TOUHOU_CONFIG.RESOURCES.AUDIO[s].paused) {
                TOUHOU_CONFIG.RESOURCES.AUDIO[s].pause();
                stopSounds.push(s)
            }
        }
    }

    function cancelAllSound() {
        for (let s in TOUHOU_CONFIG.RESOURCES.AUDIO) {
            if (!TOUHOU_CONFIG.RESOURCES.AUDIO[s].paused) {
                TOUHOU_CONFIG.RESOURCES.AUDIO[s].pause();
                TOUHOU_CONFIG.RESOURCES.AUDIO[s].currentTime = 0;
            }
        }
    }

    function continueAllSound() {
        while (stopSounds.length > 0) {
            try {
                TOUHOU_CONFIG.RESOURCES.AUDIO[stopSounds.pop()].play()
            } catch (e) {
            }
        }
    }

    function transTo(from, angle) {
        return new POS(from.x * Math.cos(angle) + from.y * Math.sin(angle), from.y * Math.cos(angle) - from.x * Math.sin(angle))
    }

    function getImage(src, width, height) {
        let img = new Image();
        img.src = src;
        img.style.width = width;
        img.style.height = height;
        return img;
    }

    function POS(x, y) {
        this.x = x;
        this.y = y;
        this.reset = function () {
            this.x = x;
            this.y = y;
        };
        this.copy = function () {
            return new POS(this.x, this.y)
        }
    }

    function RBox(xs, ys) {
        this.TYPE = "R";
        this.xs = xs;
        this.ys = ys;
        this.isHit = function (x, y, pos, hitBox) {
            switch (hitBox.TYPE) {
                case "A":
                    const xx = pos.x - x, yy = pos.y - y, minX = Math.min(xx, xs / 2),
                        maxX = Math.max(minX, -xs / 2),
                        minY = Math.min(yy, ys / 2), maxY = Math.max(minY, -ys / 2);
                    return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= hitBox.r * hitBox.r;
                case "R":
                    const width1 = xs, height1 = ys, width2 = hitBox.xs, height2 = hitBox.ys;
                    let flag;
                    if (xs >= hitBox.xs && hitBox.xs <= xs - width1 / 2 - width2 / 2) {
                        flag = false;
                    } else if (xs <= hitBox.xs && hitBox.xs >= xs + width1 / 2 + width2 / 2) {
                        flag = false;
                    } else if (ys >= hitBox.ys && hitBox.ys <= ys - height1 / 2 - height2 / 2) {
                        flag = false;
                    } else flag = !(ys <= hitBox.ys && hitBox.ys >= ys + height1 / 2 + height2 / 2);
                    return flag;
            }
        };
        this.isOut = function (x, y, x_max, y_max, speed) {
            return x + xs * 2 < 0 && speed.x <= 0 || y + ys * 2 < 0 && speed.y <= 0
                || x > x_max && speed.x > 0 || y > y_max && speed.y > 0
        };
        this.isOutScreen = function (x, y, x_max, y_max, speed) {
            return x + xs * 2 < -2 * xs - 10 && speed.x <= 0 || y + ys * 2 < -2 * ys - 10 && speed.y <= 0
                || x > x_max + 2 * xs + 10 && speed.x > 0 || y > y_max + 2 * ys + 10 && speed.y > 0
        };
    }

    function ABox(r) {
        this.TYPE = "A";
        this.r = r;
        this.isHit = function (x, y, pos, hitBox) {
            if (hitBox.TYPE === "A") {
                return Math.pow(r + hitBox.r, 2) >= Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2);
            } else if (hitBox.TYPE === "R") {
                const xx = pos.x - x, yy = pos.y - y, minX = Math.min(xx, hitBox.xs / 2),
                    maxX = Math.max(minX, -hitBox.xs / 2),
                    minY = Math.min(yy, hitBox.ys / 2), maxY = Math.max(minY, -hitBox.ys / 2);
                return (maxX - xx) * (maxX - xx) + (maxY - yy) * (maxY - yy) <= r * r;
            }
        };
        this.isOut = function (x, y, x_max, y_max, speed) {
            return x - this.r < 0 && speed.x <= 0 || x + this.r > x_max && speed.x > 0
                || y - this.r < 0 && speed.y <= 0 || y + this.r > y_max && speed.y > 0
        };
        this.isOutScreen = function (x, y, x_max, y_max, speed) {
            return x - this.r < -2 * this.r - 10 && speed.x <= 0 || x + this.r > x_max + 2 * this.r + 10 && speed.x > 0
                || y - this.r < -2 * this.r - 10 && speed.y <= 0 || y + this.r > y_max + 2 * this.r + 10 && speed.y > 0
        };
        this.inScreen = function (pos, x_max, y_max) {
            if (pos.x - r < 0) {
                pos.x = r;
            } else if (pos.x + r > x_max) {
                pos.x = x_max - r;
            }
            if (pos.y - r < 0) {
                pos.y = r;
            } else if (pos.y + r > y_max) {
                pos.y = y_max - r;
            }
        }
    }

    function DrawFont(time, callback) {
        callback();
        this.isStart = true;
        this.tick = function () {
            screen_draw.save();
            callback();
            screen_draw.restore();
            time--;
            return time < 1;
        }
    }

    function SpellCard(option) {
        let slow_frame = option.slow_frame || 0;
        let time = 0;//Frame
        let start_frame = option.start_frame || 0;
        let isEnd = false;
        let bonus = 0;
        let noCardFrame = option.noCardFrame || 0;
        let dropBlueCount = option.dropBlueCount || 12;
        let dropPowerCount = option.dropPowerCount || 12;
        this.isTimeSpell = option.isTimeSpell;
        this.POS = option.POS;
        if (!this.POS) {
            this.POS = new POS(384, 432)
        }
        this.entity = option.entity;
        PLAYER.IS_SPELL = true;
        this.isStart = false;
        this.isOpen = false;
        this.checkPOS = function () {
            if (this.entity.POS.x > 384) {
                this.entity.POS.x -= 1
            }
            if (this.entity.POS.x < 384) {
                this.entity.POS.x += 1
            }
            if (this.entity.POS.y > 332) {
                this.entity.POS.y -= 1
            }
            if (this.entity.POS.y < 332) {
                this.entity.POS.y += 1
            }
            if (Math.abs(this.entity.POS.x - 384) < 1) {
                this.entity.POS.x = 384
            }
            if (Math.abs(this.entity.POS.y - 332) < 1) {
                this.entity.POS.y = 332
            }
        };
        this.drop = function () {
            SPAWN.BLUE_ORB(new POS(this.entity.POS.x, this.entity.POS.y), new POS(0, -5));
            for (let i = 0; i < dropBlueCount / 4; i++) {
                SPAWN.BLUE_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10));
                SPAWN.BLUE_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10));
                SPAWN.BLUE_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10));
                SPAWN.BLUE_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10));
            }
            for (let i = 0; i < dropPowerCount / 4; i++) {
                SPAWN.POWER_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10), true);
                SPAWN.POWER_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10), true);
                SPAWN.POWER_ORB(new POS(this.entity.POS.x + Math.random() * 80, this.entity.POS.y - Math.random() * 80), new POS(0, -10), true);
                SPAWN.POWER_ORB(new POS(this.entity.POS.x - Math.random() * 80, this.entity.POS.y + Math.random() * 80), new POS(0, -10), true);
            }
            SPAWN.POWER_ORB(new POS(this.entity.POS.x, this.entity.POS.y), new POS(0, -5), false);
        };
        this.open = function () {
            if (!this.isOpen) {
                if (option.noCard) {
                    noCardFrame = 0;
                    clear_screen();
                    this.drop()
                }
                TOUHOU_CONFIG.RESOURCES.AUDIO.CAT_0.currentTime = 0;
                t = TOUHOU_CONFIG.RESOURCES.AUDIO.CAT_0.play();
                start_frame = option.start_frame || 0;
                time = option.time;
                this.entity.options.canHit = false;
                this.isOpen = true;
            }
        };
        this.en_ep = function () {
            clear_screen();
            bonus = Math.floor(option.bonus * time / option.time);
            time = 0
        };
        this.tick = function () {
            if (start_frame > 0) {
                this.checkPOS();
                start_frame--;
                return
            }
            timeOut.innerHTML = Math.min(Math.floor(time / 60), 99);
            if (timeOut.innerHTML.toString().length < 2) {
                timeOut.innerHTML = "0" + timeOut.innerHTML
            }
            if (time !== 0 && time % 60 === 0) {
                if (time <= 180) {
                    timeOut.style.color = "red";
                    TOUHOU_CONFIG.RESOURCES.AUDIO.TIME_OUT_1.currentTime = 0;
                    t = TOUHOU_CONFIG.RESOURCES.AUDIO.TIME_OUT_1.play()
                } else {
                    if (time <= 600) {
                        this.entity.options.defendTime = false;
                        timeOut.style.color = "orange";
                        TOUHOU_CONFIG.RESOURCES.AUDIO.TIME_OUT.currentTime = 0;
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.TIME_OUT.play()
                    } else {
                        this.entity.options.defendTime = !!option.noCard;
                        timeOut.style.color = ""
                    }
                }
            }
            if (noCardFrame > 0) {
                this.entity.options.defendTime = true;
                noCardFrame--;
                time = noCardFrame;
                if (option.noCard) {
                    if (noCardFrame % 360 === 0) {
                        if (Math.random() > 0.5) {
                            if (this.entity.POS.x < screen.width - 200) {
                                this.entity.speed.x += 4
                            }
                        } else {
                            if (this.entity.POS.x > 200) {
                                this.entity.speed.x -= 4
                            }
                        }
                        if (Math.random() > 0.5) {
                            if (this.entity.POS.y < 332) {
                                this.entity.speed.y += 4
                            }
                        } else {
                            if (this.entity.POS.y > 200) {
                                this.entity.speed.y -= 4
                            }
                        }
                        if (this.entity.POS.x > screen.width - 200) {
                            this.entity.speed.x -= 0.2
                        }
                        if (this.entity.POS.x < 200) {
                            this.entity.speed.x += 0.2
                        }
                        if (this.entity.POS.y > 332) {
                            this.entity.speed.y -= 0.2
                        }
                        if (this.entity.POS.y < 200) {
                            this.entity.speed.y += 0.2
                        }
                    }
                    option.noCard(this)
                }
            } else {
                if (time >= 1) {
                    time--;
                    if (!DRAW_LIST.TEXTURE.SPELL_CARD[0]) {
                        DRAW_LIST.TEXTURE.SPELL_CARD[0] = {};
                        DRAW_LIST.TEXTURE.SPELL_CARD.len++;
                    }
                    let cache = DRAW_LIST.TEXTURE.SPELL_CARD[0];
                    if (!cache.normalCanvas) {
                        cache.normalCanvas = document.createElement("canvas");
                        cache.normalCanvas.width = 444;
                        cache.normalCanvas.height = 444;
                        let ctx = cache.normalCanvas.getContext("2d");
                        ctx.translate(222, 222);
                        ctx.strokeStyle = "rgba(255,255,255,0.5)";
                        ctx.lineWidth = 2;
                        ctx.shadowColor = "blue";
                        ctx.shadowBlur = 20;
                        ctx.beginPath();
                        ctx.arc(0, 0, 200, 0, 2 * Math.PI);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(0, 0, 185, 0, 2 * Math.PI);
                        ctx.stroke();
                        for (let i = 0; i < 360; i += 1.5) {
                            ctx.save();
                            ctx.rotate(i * Math.PI / 180);
                            ctx.beginPath();
                            ctx.moveTo(0, -185);
                            ctx.lineTo(0, -200);
                            ctx.stroke();
                            ctx.restore();
                        }
                        ctx.save();
                        for (let i = 0; i < 6; i++) {
                            // 画完三角形后旋转一半角度画另一个三角形
                            if (i === 3) {
                                ctx.rotate(Math.PI * 2 / 6);
                            }
                            ctx.moveTo(0, -185);
                            ctx.lineTo(185 * Math.sin(Math.PI / 3), 185 / 2);
                            ctx.stroke();
                            ctx.rotate(Math.PI * 2 / 3);
                        }
                        ctx.restore();
                    }
                    screen_draw.save();
                    screen_draw.translate(this.entity.POS.x, this.entity.POS.y);
                    screen_draw.rotate(time / 24);
                    screen_draw.scale(time / option.time + 1, time / option.time + 1);
                    screen_draw.drawImage(cache.normalCanvas, -222, -222);
                    screen_draw.restore();
                    this.checkPOS();
                    if (option.card) {
                        option.card(this)
                    }
                } else {
                    if (this.isOpen) {
                        if (this.isTimeSpell) {
                            bonus = option.bonus
                        }
                        if (!isEnd) {
                            PLAYER.SCORE += bonus;
                            TOUHOU_CONFIG.RESOURCES.AUDIO.CART_GET.currentTime = 0;
                            TOUHOU_CONFIG.RESOURCES.AUDIO.CART_GET.volume = 1;
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.CART_GET.play();
                            isEnd = true
                        }
                        if (slow_frame > 0) {
                            PLAYER.IS_SLOW = true;
                            slow_frame--;
                        } else {
                            PLAYER.IS_SLOW = false;
                            timeOut.style.display = "none";
                            if (option.end) {
                                option.end(this)
                            }
                            PLAYER.IS_SPELL = false;
                            screen_draw.save();
                            if (bonus > 0) {
                                TOUHOU_CONFIG.RESOURCES.AUDIO.Bonus.currentTime = 0;
                                t = TOUHOU_CONFIG.RESOURCES.AUDIO.Bonus.play();
                                this.drop();
                                if (option.bonus_callback) {
                                    option.bonus_callback(this)
                                }
                                methods.push(new DrawFont(120, function () {
                                    screen_draw.font = "25px sans-serif";
                                    screen_draw.fillStyle = "rgb(67,160,255)";
                                    screen_draw.fillText("Get SpellCard bonus", 250, 250);
                                    screen_draw.font = "20px sans-serif";
                                    screen_draw.fillText(String(bonus), 350, 300);
                                }));
                            } else {
                                methods.push(new DrawFont(120, function () {
                                    screen_draw.font = "30px sans-serif";
                                    screen_draw.fillStyle = "rgb(98,98,98)";
                                    screen_draw.fillText("Bonus failed", 250, 300);
                                }));
                            }
                            screen_draw.restore();
                            return true
                        }
                    } else {
                        this.open()
                    }
                }
            }
        };
        this.start = function () {
            if (option.start) {
                option.start()
            }
            this.isStart = true;
            timeOut.style.display = "block";
        };
    }

    function Entity(option) {
        this.draw = function () {
            if (option.draw) {
                screen_draw.save();
                screen_draw.translate(this.POS.x, this.POS.y);
                option.draw(this);
                screen_draw.restore();
            }
        };
        this.tick = function () {
            this.POS.x += this.speed.x;
            this.POS.y += this.speed.y;
            if (option.tick) {
                option.tick(this);
            }
            if (!this.alive) {
                return false;
            }
            this.draw();
            return true;
        };
        this.die = function () {
            this.alive = false;
            if (option.die) {
                option.die(this);
            }
        };
        this.type = option.type;
        this.alive = true;
        this.speed = option.speed;
        this.options = option;
        this.POS = option.POS;
        this.sizeBox = option.sizeBox;
        this.drawPOS = option.drawPOS;
        this.spy = option.spy;
        if (option.done) {
            option.done();
        }
    }

    function renderer_power() {
        if (PLAYER.DEFAULT.POWER.VALUE > TOUHOU_CONFIG.SETTING.POWER_MAX) {
            PLAYER.DEFAULT.POWER.VALUE = TOUHOU_CONFIG.SETTING.POWER_MAX;
        }
        let str = String(PLAYER.DEFAULT.POWER.VALUE);
        while (true) {
            if (str.length < 3) {
                str = "0" + str
            } else {
                break;
            }
        }
        power_high.innerHTML = str[0];
        power_low.innerHTML = str.substr(1, 2);
        if (power_low.innerHTML !== "undefined") {
            while (true) {
                if (power_low.innerHTML.length < 2) {
                    power_low.innerHTML += "0";
                } else {
                    break;
                }
            }
        } else {
            power_low.innerHTML = "00";
        }
    }

    function renderer_bomb() {
        bomb.innerHTML = "";
        let count = PLAYER.DEFAULT.BOMB.COUNT;
        for (let i = 0; i < TOUHOU_CONFIG.SETTING.BOMB_MAX; i++) {
            if (count > 0) {
                count--;
                bomb.appendChild(TOUHOU_CONFIG.RESOURCES.IMAGE.BOMB.SIDEBAR.FILL.cloneNode());
            } else {
                bomb.appendChild(TOUHOU_CONFIG.RESOURCES.IMAGE.BOMB.SIDEBAR.STROKE.cloneNode());
            }
        }
    }

    function renderer_player() {
        player.innerHTML = "";
        let count = PLAYER.DEFAULT.PLAYER;
        for (let i = 0; i < TOUHOU_CONFIG.SETTING.PLAYER_MAX; i++) {
            if (count > 0) {
                count--;
                player.appendChild(TOUHOU_CONFIG.RESOURCES.IMAGE.PLAYER.SIDEBAR.FILL.cloneNode());
            } else {
                player.appendChild(TOUHOU_CONFIG.RESOURCES.IMAGE.PLAYER.SIDEBAR.STROKE.cloneNode());
            }
        }
    }

    function clear_screen(blue) {
        let count = 0;
        for (let i = 0; i < entities.length; i++) {
            if (entities[i].type === ENTITY_TYPE.HOSTILE_BULLET) {
                if (blue) {
                    SPAWN.BLUE_ORB(entities[i].POS.copy(), new POS(0, -10))
                } else {
                    SPAWN.GreenOrb(entities[i].POS.copy(), new POS(0, -2), true)
                }
                entities[i].die(1);
                count++
            }
        }
    }

    let current_index = 1, fake = 0, was_fake = undefined, read_key_timeout = 0;
    let can_select = true;
    let menu_is = 0;

    function stage() {
        if (!TOUHOU_CONFIG.RESOURCES.AUDIO.Start.paused) {
            entities = [];
            t = TOUHOU_CONFIG.RESOURCES.AUDIO.Start.pause();
            TOUHOU_CONFIG.RESOURCES.AUDIO.Start.currentTime = 0
        }
        if (PLAYER.IS_PAUSE) {
            let current_name;
            let i = 0;
            for (let t in SwitchMapping) {
                if (i === current_index) {
                    current_name = t
                }
                i++;
            }
            for (let i = 0; i < keys.length; i++) {
                switch (keys[i]) {
                    case 38://上
                        if (TOUHOU_CONFIG.RESOURCES.AUDIO.Select.paused) {
                            if (current_index > 0) {
                                current_index--
                            } else {
                                current_index = 2
                            }
                            can_select = false;
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.Select.play();
                            was_fake = true
                        }
                        break;
                    case 40://下
                        if (TOUHOU_CONFIG.RESOURCES.AUDIO.Select.paused) {
                            if (current_index < 2) {
                                current_index++
                            } else {
                                current_index = 0
                            }
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.Select.play();
                            was_fake = true
                        }
                        break;
                    case 90://Z
                        if (TOUHOU_CONFIG.RESOURCES.AUDIO.OK.paused) {
                            menu_is = SwitchMapping[current_name];
                            if (menu_is === SwitchMapping.BackMenu) {
                                backMenu()
                            } else if (menu_is === SwitchMapping.Continue) {
                                continueAllSound();
                                PLAYER.MENU = false;
                                PLAYER.IS_PAUSE = false
                            } else if (menu_is === SwitchMapping.Restart) {
                                backMenu();
                                mode = ModeMapping.Stage
                            }
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.OK.play();
                        }
                        if (current_index === 1) {
                            entities = [];
                            keys = [];
                            shade.style.display = "none";
                            read_key_timeout = 60
                        }
                }
            }
            screen_draw.clearRect(0, 0, screen.width, screen.height);
            let y = 440;
            for (let i = 0; i < entities.length; i++) {
                if (entities.length > 768) {
                    //实体上限
                    if (entities[i].type === ENTITY_TYPE.HOSTILE_BULLET) {
                        entities.splice(i, 1);
                        continue
                    }
                }
                entities[i].draw()
            }
            if (PLAYER.TIME_TO_MISS.VALUE > 0) {
                PLAYER.ATTR.DRAW(PLAYER)
            }
            screen_draw.save();
            screen_draw.globalCompositeOperation = "source-atop";
            screen_draw.fillStyle = "rgba(255,0,10,0.5)";
            screen_draw.fillRect(0, 0, screen.width, screen.height);
            screen_draw.globalCompositeOperation = "source-over";
            screen_draw.font = "30px sans-serif";
            screen_draw.fillStyle = "rgb(255,255,255)";
            screen_draw.fillText("游戏暂停", 40, 400);
            screen_draw.restore();
            screen_draw.save();
            screen_draw.globalCompositeOperation = "source-over";
            screen_draw.font = "30px sans-serif";
            screen_draw.shadowBlur = 6;
            for (const name in SwitchMapping) {
                screen_draw.fillStyle = "rgb(168,24,33)";
                screen_draw.shadowColor = "black";
                if (name === current_name) {
                    screen_draw.fillStyle = "rgb(255,255,255)";
                    screen_draw.shadowColor = "red";
                }
                y += 48;
                if (name === current_name) {
                    if (was_fake === false) {
                        if (fake > -10) {
                            fake -= 2
                        }
                        if (fake === -10) {
                            was_fake = true
                        }
                    }
                    if (was_fake === true) {
                        if (fake < 10) {
                            fake += 2
                        }
                        if (fake === 10) {
                            was_fake = undefined
                        }
                    }
                    if (was_fake === undefined) {
                        if (fake > 0) {
                            fake -= 2
                        }
                        if (fake < 0) {
                            fake += 2
                        }
                    }
                    screen_draw.fillText(SwitchShow[name], 60 + fake, y)
                } else {
                    screen_draw.fillText(SwitchShow[name], 60, y)
                }
            }
            screen_draw.restore();
        } else {
            if (TOUHOU_CONFIG.RESOURCES.AUDIO.PLAY.currentTime > 290) {
                TOUHOU_CONFIG.RESOURCES.AUDIO.PLAY.currentTime = 156
            }
            PLAYER.TIME++;
            if (TOUHOU_CONFIG.MAP.TEST.STAGE.STAGE1[PLAYER.TIME] && !PLAYER.IS_STAGE) {
                TOUHOU_CONFIG.MAP.TEST.STAGE.STAGE1[PLAYER.TIME]()
            }
            if (!PLAYER.END) {
                screen_draw.clearRect(0, 0, screen.width, screen.height);
                PLAYER.MISS_TIME++;
                if (PLAYER.INDESTRUCTIBLE) {
                    //无敌时间
                    PLAYER.TIME_TO_MISS.FLAG = false;
                    PLAYER.ALIVE = true;
                    PLAYER.TIME_TO_MISS.VALUE = TOUHOU_CONFIG.SETTING.ALREADY_MISS_TIME_MAX;
                    PLAYER.INDESTRUCTIBLE--;
                }
                if (!PLAYER.ALIVE && !PLAYER.TIME_TO_MISS.FLAG) {
                    //被弹且没有miss
                    t = TOUHOU_CONFIG.RESOURCES.AUDIO.MISS.play();
                    PLAYER.TIME_TO_MISS.FLAG = true;
                }
                if (PLAYER.TIME_TO_MISS.FLAG && PLAYER.TIME_TO_MISS.VALUE > 0) {
                    //递减帧
                    PLAYER.TIME_TO_MISS.VALUE--;
                }
                if (!PLAYER.TIME_TO_MISS.VALUE) {//miss
                    PLAYER.DEFAULT.POWER.VALUE = 0;
                    renderer_power();
                    PLAYER.DEFAULT.PLAYER--;
                    PLAYER.ISMISS = true;
                    PLAYER.DEFAULT.BOMB.FLAG = 60;
                    renderer_player();
                    PLAYER.DEFAULT.BOMB.COUNT = 3;
                    renderer_bomb();
                    PLAYER.MISS_TIME = 0;
                    PLAYER.NO_MISS = false;
                    if (PLAYER.DEFAULT.PLAYER < 0) {
                        PLAYER.END = true;
                    } else {
                        PLAYER.INDESTRUCTIBLE = 200;
                    }
                    if (PLAYER.DEFAULT.PLAYER > 0) {
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), new POS(0, -50), false);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), 25 * L), true);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), -25 * L), true);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), 45 * L), true);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), -45 * L), true);
                    } else {
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), 5 * L), false);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), -5 * L), false);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), 15 * L), false);
                        SPAWN.POWER_ORB(new POS(PLAYER.POS.x, PLAYER.POS.y), transTo(new POS(0, -50), -15 * L), false);
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
                if (PLAYER.ISMISS && PLAYER.INDESTRUCTIBLE === 180) {
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
                                PLAYER.INDESTRUCTIBLE = 300;
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
                    screen_draw.save();
                    screen_draw.translate(PLAYER.POS.x, PLAYER.POS.y);
                    screen_draw.fillStyle = "red";
                    screen_draw.shadowColor = "red";
                    screen_draw.shadowBlur = 3;
                    screen_draw.beginPath();
                    screen_draw.arc(0, 0, PLAYER.ATTR.BOX.HIT.r + 1, 0, 2 * Math.PI);
                    screen_draw.closePath();
                    screen_draw.fill();
                    screen_draw.fillStyle = "white";
                    screen_draw.shadowColor = "white";
                    screen_draw.rotate(L * frames * 6);
                    screen_draw.fillRect(-PLAYER.ATTR.BOX.HIT.r, -PLAYER.ATTR.BOX.HIT.r, PLAYER.ATTR.BOX.HIT.r * 2,
                        PLAYER.ATTR.BOX.HIT.r * 2);
                    screen_draw.restore()
                }
            } else {
                if (!PLAYER.END_OUT) {
                    TOUHOU_CONFIG.RESOURCES.AUDIO.PLAY.pause();
                    screen_draw.save();
                    if (!PLAYER.ALIVE) {
                        screen_draw.globalCompositeOperation = "source-atop";
                        screen_draw.fillStyle = "rgba(255,0,10,0.5)";
                        screen_draw.fillRect(0, 0, screen.width, screen.height);
                        screen_draw.globalCompositeOperation = "source-over";
                        screen_draw.font = "30px sans-serif";
                        screen_draw.fillStyle = "rgb(255,255,255)";
                        screen_draw.fillText("满身疮痍", 60, 450);
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.OVER.play();
                    } else {
                        screen_draw.font = "25px sans-serif";
                        screen_draw.fillStyle = "rgb(191,161,31)";
                        screen_draw.fillText("All Clear!", 220, 360);
                        let playerBonus = PLAYER.DEFAULT.PLAYER * 3000000;
                        let bombBonus = PLAYER.DEFAULT.BOMB.COUNT * 1000000;
                        let totalBonus = playerBonus + bombBonus
                            + (1000 + PLAYER.DEFAULT.POWER.VALUE + PLAYER.GRAZE.VALUE * 10) * PLAYER.POINT;
                        PLAYER.SCORE += totalBonus * 7;
                        screen_draw.fillText("Player =" + playerBonus, 220, 400);
                        screen_draw.fillText("Bomb =" + bombBonus, 220, 430);
                        screen_draw.fillStyle = "rgb(184,184,184)";
                        screen_draw.fillText("Total =" + totalBonus, 220, 460);
                    }
                    screen_draw.restore();
                    PLAYER.END_OUT = true
                }
            }
        }
        score.innerHTML = String(PLAYER.SCORE).split(".")[0]
            .replace(/(\d)(?=(\d{3})+$)/g, "$1,");
        frames++;
        if (PLAYER.IS_SLOW) {
            setTimeout(function () {
                runAnimationFrame = requestAnimationFrame(run);
            }, 50);
        } else {
            runAnimationFrame = requestAnimationFrame(run)
        }
    }

    function menu() {
        while (entities.length < 256) {
            SPAWN.MenuStar(new POS(Math.random() * screen.width, Math.random() * screen.height), new POS(0, 0.5), Math.random() * 2);
        }
        if (TOUHOU_CONFIG.RESOURCES.AUDIO.Start.paused) {
            t = TOUHOU_CONFIG.RESOURCES.AUDIO.Start.play()
        }
        if (TOUHOU_CONFIG.RESOURCES.AUDIO.Start.currentTime > 132) {
            TOUHOU_CONFIG.RESOURCES.AUDIO.Start.currentTime = 1
        }
        let current_name;
        let i = 0;
        for (let t in ModeMapping) {
            if (i === current_index) {
                current_name = t
            }
            i++;
        }
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case 38://上
                    if (TOUHOU_CONFIG.RESOURCES.AUDIO.Select.paused) {
                        if (current_index > 1) {
                            current_index--
                        } else {
                            current_index = 7
                        }
                        can_select = false;
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.Select.play();
                        was_fake = true
                    }
                    break;
                case 40://下
                    if (TOUHOU_CONFIG.RESOURCES.AUDIO.Select.paused) {
                        if (current_index < 7) {
                            current_index++
                        } else {
                            current_index = 1
                        }
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.Select.play();
                        was_fake = true
                    }
                    break;
                case 90://Z
                    if (TOUHOU_CONFIG.RESOURCES.AUDIO.OK.paused) {
                        mode = ModeMapping[current_name];
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.OK.play();
                    }
                    if (current_index === 1) {
                        entities = [];
                        keys = [];
                        shade.style.display = "none";
                        read_key_timeout = 60
                    }
                    break;
                case 27://Esc
                case 88://X
                    if (TOUHOU_CONFIG.RESOURCES.AUDIO.Cancel.paused) {
                        t = TOUHOU_CONFIG.RESOURCES.AUDIO.Cancel.play();
                        if (current_index === 7) {
                            mode = ModeMapping.Exit
                        } else {
                            current_index = 7
                        }
                    }
            }
        }
        let y = 450;
        screen_draw.save();
        screen_draw.clearRect(0, 0, screen.width, screen.height);
        screen_draw.fillStyle = "rgb(0,0,0)";
        screen_draw.fillRect(0, 0, screen.width, screen.height);
        screen_draw.restore();
        for (let i = 0; i < entities.length; i++) {
            if (entities.length > 768) {//实体上限
                entities.splice(i, 1);
            }
            if (!entities[i].tick()) {
                entities.splice(i, 1);
            }
        }
        screen_draw.save();
        screen_draw.globalCompositeOperation = "source-over";
        screen_draw.font = "34px sans-serif";
        screen_draw.shadowBlur = 6;
        for (const name in ModeMapping) {
            screen_draw.fillStyle = "rgb(168,24,33)";
            screen_draw.shadowColor = "black";
            if (name === current_name) {
                screen_draw.fillStyle = "rgb(255,255,255)";
                screen_draw.shadowColor = "red";
            }
            y += 38;
            if (name === current_name) {
                if (was_fake === false) {
                    if (fake > -10) {
                        fake -= 2
                    }
                    if (fake === -10) {
                        was_fake = true
                    }
                }
                if (was_fake === true) {
                    if (fake < 10) {
                        fake += 2
                    }
                    if (fake === 10) {
                        was_fake = undefined
                    }
                }
                if (was_fake === undefined) {
                    if (fake > 0) {
                        fake -= 2
                    }
                    if (fake < 0) {
                        fake += 2
                    }
                }
                screen_draw.fillText(ModeShow[name], 560 + fake, y)
            } else {
                screen_draw.fillText(ModeShow[name], 560, y)
            }
        }
        screen_draw.restore();
        frames++;
        runAnimationFrame = requestAnimationFrame(run)
    }

    function run() {
        if (read_key_timeout > 0) {
            read_key_timeout--
        }
        if (mode === ModeMapping.Start) {
            menu()
        } else if (mode === ModeMapping.Exit) {
            layer.close(comp_lay)
        } else if (mode === ModeMapping.Stage) {
            stage();
        } else if (mode === ModeMapping.Option) {
            option();
        } else {
            mode = ModeMapping.Start;
            layer.msg("尚未完成");
            menu()
        }
    }

    function addKey(e) {
        if (read_key_timeout > 0) {
            return
        }
        e = e || window["event"];
        let check = 0;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === e.keyCode) {
                check = 1;
                break;
            }
        }
        if (check === 0) {
            keys.push(e.keyCode);
        }
        if (mode === ModeMapping.Stage) {
            switch (e.keyCode) {
                case 16:
                    //SHIFT
                    shift = true;
                    break;
                case 27:
                    //ESC
                    if (!PLAYER.END) {
                        if (!PLAYER.IS_PAUSE) {
                            stopAllSound();
                            TOUHOU_CONFIG.RESOURCES.AUDIO.PAUSE.currentTime = 0;
                            t = TOUHOU_CONFIG.RESOURCES.AUDIO.PAUSE.play();
                            keys = [];
                            PLAYER.IS_PAUSE = true
                        } else if (PLAYER.IS_PAUSE) {
                            continueAllSound();
                            PLAYER.IS_PAUSE = false
                        }
                    }
                    e.stopPropagation();
                    //阻止退出事件被捕获
                    break;
                //case 65:
                //	PLAYER.DEFAULT.PLAYER++
                //case 83:
                //	PLAYER.DEFAULT.BOMB.COUNT++
                case 90://Z
                    if (PLAYER.END_OUT) {
                        backMenu()
                    }
            }
        }
        if (mode === ModeMapping.Start) {
            if (e.keyCode === 27) {
                e.stopPropagation();
            }
        }
        // console.log(e.keyCode);
    }

    function backMenu() {
        cancelAllSound();
        PLAYER = {
            IS_SLOW: false,
            IS_PAUSE: false,
            IS_SPELL: false,
            NO_MISS: true, MISS_TIME: 0, IS_STAGE: false,
            TIME: 0,
            SCORE: 0,
            POINT: 0,
            GRAZE: {
                VALUE: 0,
                FLAG: false//判断已擦弹
            },
            ALIVE: true,
            TIME_TO_MISS: {
                VALUE: 10,
                FLAG: false//判断已被弹
            },
            POS: new POS(384, 632),
            INDESTRUCTIBLE: 200,
            ATTR: TOUHOU_CONFIG.ROLES.RUMIA,
            DEFAULT: {
                BOMB: {
                    COUNT: 3
                },
                POWER: {
                    VALUE: 400
                },
                PLAYER: 2
            }
        };
        renderer_player();
        renderer_bomb();
        renderer_power();
        point.innerHTML = "0";
        score.innerHTML = "0";
        graze.innerHTML = "0";
        TOUHOU_CONFIG.RESOURCES.AUDIO.OK.currentTime = 0;
        t = TOUHOU_CONFIG.RESOURCES.AUDIO.OK.play();
        keys = [];
        read_key_timeout = 60;
        current_index = 1;
        entities = [];
        methods = [];
        mode = 0;
        shade.style.display = "block";
        timeOut.style.display = "none";
        timeOut.innerHTML = "0"
    }

    function removeKey(e) {
        e = e || window["event"];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === e.keyCode) {
                keys.splice(i, 1);
                break;
            }
        }
        if (e.keyCode === 16) {
            shift = false;
        }
    }

    function option() {
        layer.open({
            title: "Option"
            , type: 1
            , area: ['1280px', '960px']
            , maxmin: true
            , shade: 0
            , content: "<div class='layui-bg-gray' id='sounds' style='width:100%;height:100%'></div>"
            , id: "TouhouOption"
            , success: function () {
                cancelAllSound();
                let sounds = document.getElementById("sounds");
                for (let sound in TOUHOU_CONFIG.RESOURCES.AUDIO) {
                    let sound_src = TOUHOU_CONFIG.RESOURCES.AUDIO[sound].src;
                    sounds.innerHTML += "<audio onmouseover='layer.tips(\"" + TOUHOU_CONFIG.RESOURCES.Text.AUDIO[sound] + "\", this)' src='" + sound_src + "' controls>" + sound + "</audio>";
                }
            }, end: function () {
                cancelAllSound();
                mode = 0;
                screen.focus();
                runAnimationFrame = requestAnimationFrame(run)
            }
        })
    }

    this.show = function () {
        comp_lay = layer.open({
            title: "Touhou"
            , type: 1
            , area: ['1280px', '960px']
            , maxmin: true
            , shade: 0
            , content:
                "<div class='layui-bg-black' style='width:100%;height:100%'>" +
                "<canvas id='screen' tabindex='0' style='position:absolute;width:60%;height:90%;left:5%;top:5%' width='768px' height='864px'>" +
                //tabindex支持键盘事件
                "<span style='font-size:large;color:red' title='浏览器可能不支持canvas'>加载失败</span>" +
                "</canvas>" +
                "<div id='FPS' style='position:absolute;bottom:0;right:30%;font-size:large'>0FPS/0BCS</div>" +
                "<div id='timeOut' style='position:absolute;top:0;right:30%;font-size:large'>0</div>" +
                "<div id='blood' style='position:absolute;top:5px;left:5%;background-color:white;width:768px;height:4px;display:none'></div>" +
                "<div class='layui-bg-gray' style='position:absolute;right:0;width:30%;height:100%;'>" +
                "<div style='margin-right:5%;margin-top:5px;text-align:center'>" +
                "<span id='difficulty' style='font-size:large;color:#1c19bc'>Default</span>" +
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
                "<img src='img/touhou/power_orb.png' alt=''>" +
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
                "<img src='img/touhou/blue_orb.png' alt=''>" +
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
                "<div id='shade' style='position:absolute;top:0;left:70%;background-color:#eee;width:30%;height:60%'></div>" +
                "</div>"
            , id: "Touhou"
            , success: function () {
                screen = document.querySelector("canvas");
                screen_draw = screen.getContext("2d");
                score = document.getElementById("score");
                score.innerHTML = PLAYER.SCORE;
                bomb = document.getElementById("bomb");
                point = document.getElementById("point");
                player = document.getElementById("player");
                power_high = document.getElementById("power_high");
                power_low = document.getElementById("power_low");
                graze = document.getElementById("graze");
                FPS = document.getElementById("FPS");
                timeOut = document.getElementById("timeOut");
                timeOut.style.display = "none";
                shade = document.getElementById("shade");
                renderer_player();
                renderer_bomb();
                renderer_power();
                screen.addEventListener("keydown", addKey);
                screen.addEventListener("keyup", removeKey);
                screen.focus();
                PLAYER.ATTR.BOX.GRAZE.inScreen(PLAYER.POS, screen.width, screen.height);
                TOUHOU_CONFIG.RESOURCES.AUDIO.ITEM.volume = 0.2;
                TOUHOU_CONFIG.RESOURCES.AUDIO.GRAZE.volume = 0.01;
                TOUHOU_CONFIG.RESOURCES.AUDIO.CHANGE_TRACK.volume = 0.5;
                TOUHOU_CONFIG.RESOURCES.AUDIO.CHAIN_SHOOT.volume = 0.1;
                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT.volume = 0.3;
                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_SHOOT_1.volume = 0.3;
                TOUHOU_CONFIG.RESOURCES.AUDIO.EXTEND.volume = 0.3;
                TOUHOU_CONFIG.RESOURCES.AUDIO.CART_GET.volume = 0.3;
                TOUHOU_CONFIG.RESOURCES.AUDIO.BOMB_LAY.volume = 0.5;
                FPS_interval = setInterval(function () {
                    let new_timestamp = new Date().getTime();
                    let fps = Math.floor(frames / ((new_timestamp - timestamp) / 1000)), fps_color = "green",
                        bcs = entities.length, bcs_color = "green";
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
                    FPS.innerHTML =
                        "<span style='color:" + fps_color + "'>" + fps + "FPS</span>" +
                        "/" +
                        "<span style='color:" + bcs_color + "'>" + bcs + "ECS</span>";
                    timestamp = new_timestamp;
                    frames = 0;
                }, 1000);//测试
                runAnimationFrame = requestAnimationFrame(run)//一秒60帧
            }
            , end: function () {
                document.body.removeEventListener("keydown", addKey);
                document.body.removeEventListener("keyup", removeKey);
                cancelAnimationFrame(runAnimationFrame);
                clearInterval(FPS_interval);
                cancelAllSound()
            }
        });
    }
};

(function () {
    new Touhou().info();
})();
