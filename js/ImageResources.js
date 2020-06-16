"use strict";

class ImageResources {
    static SidebarFilledPlayer;
    static SidebarStrokePlayer;
    static SidebarFilledBomb;
    static SidebarStrokeBomb;
    static PlayerBill;
    static DashBill;
    static PlayerOrb;
    static BombOrb;
    static BlueOrb;
    static PowerOrb;
    static SmallPowerOrb;

    static get SidebarFilledPlayer() {
        if (ImageResources.SidebarFilledPlayer) {
            return ImageResources.SidebarFilledPlayer
        }
        ImageResources.SidebarFilledPlayer = Util.getImage("img/sidebar/filled_player.png", "24px", "24px");
        return ImageResources.SidebarFilledPlayer
    }

    static get SidebarStrokePlayer() {
        if (ImageResources.SidebarStrokePlayer) {
            return ImageResources.SidebarStrokePlayer
        }
        ImageResources.SidebarStrokePlayer = Util.getImage("img/sidebar/stroke_player.png", "24px", "24px");
        return ImageResources.SidebarStrokePlayer
    }

    static get SidebarFilledBomb() {
        if (ImageResources.SidebarFilledBomb) {
            return ImageResources.SidebarFilledBomb
        }
        ImageResources.SidebarFilledBomb = Util.getImage("img/sidebar/filled_bomb.png", "24px", "24px");
        return ImageResources.SidebarFilledBomb
    }

    static get SidebarStrokeBomb() {
        if (ImageResources.SidebarStrokeBomb) {
            return ImageResources.SidebarStrokeBomb
        }
        ImageResources.SidebarStrokeBomb = Util.getImage("img/sidebar/stroke_bomb.png", "24px", "24px");
        return ImageResources.SidebarStrokeBomb
    }

    static get PlayerBill() {
        if (ImageResources.PlayerBill) {
            return ImageResources.PlayerBill
        }
        ImageResources.PlayerBill = Util.getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAeCAYAAAAhDE4sAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACLSURBVEhL5ZbRCoAgDEW1/qun6Af7o/4rjEHCnU2lNmHQAV82uN7d+WDctzUFC0hIC2lMt54aJnTE+dVBzBw5z0hDN+xMq0c4H01DV0jKQ4IJLelkp6TVfziqbYVo9bqjSbdLjAsbM0AntXpmnKOvMKFyI7glqY44H03DX4TKV4svWaojZo6MPhEhXDeD46fgMmfbAAAAAElFTkSuQmCC");
        return ImageResources.PlayerBill
    }

    static get DashBill() {
        if (ImageResources.DashBill) {
            return ImageResources.DashBill
        }
        ImageResources.DashBill = Util.getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAeCAYAAAAhDE4sAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOMSURBVEhLXdXHTi47EARgM/wccs48H0t25AUIIYFAILFiBTweOefMXH/NMeKekqxJdndVddvTND8/X3d0dKT7+/vU2tqaGo1GamlpSQ8PDwl6e3vT1dVVqus6jY6OppeXl3R3d5fa29tTd3d3Ojk5SV1dXSnNzs7WFxcXeV5df3x8xDg6Oqqfnp7iHeQk9fX1ddz7VpATxHVra6uuhoaG0uDgYGRvbm6OMT4+Hhnh9fU1vb29pb6+vvT19RXffiPHCVYNNI+Pj0POwcFBLPz8/EyZWVAHwc/Pz0MmsOD29jYtLi6GBeZVPKEdMwv+/PkTg+6bm5tgIyjI7pt37+/vibdNTU3p8fExpc3NzTozCK0FZ2dn9fPz89+n/yOz/3v3jRywXl5erivZqqqKqhUMDw9HZqC/IAdPY2NjcU/a5eVlVDliCGAynbl6QR9MgrIQymIe8quzszPek9lQiTJ5f38/svJKgpGRkTQ1NRVe7ezsRHV/F2NtbS3WURDlL9B4IFNbW1sEAKVXEIwlIcd3yP0WbVFx3CBPUEFIUDUTlFpPYSizzlYt305PT+M9jyumWmzoKcMH/YGJe3IwKeZKrAX0HqZhNmo0m1i6FwtZvctbKG1vb0dgjBlb9trAwEC8jwRe8IKRMzMzMVFgHgiAKdaSTE5Opv7+/vAGeCa4gA3ZUQSlX19f/2FVmJJC3sbGRjDxzvYoHY9RxbBo8QztbrFnXpC9tLSUVlZW4pveEUhCi7UNVgpToW6S/iGxSAHy+AGCYOLZHHKA5CCyurpqy8SZc3h4GPc5YFydSXlh3P+L33Pm5ubqqBrIPjExEfey54Ms3in/7/1WfKGCl6QaFX2xV7InGhEEJ4N+wX7vN+/LVRLQU1VpLBAQ9JCRmf/4Us7w4hmfyvnN0waKqMu6t7cXrPL5Etl2d3d/AukzJTffZiVLRTEWqHJ8lCPUR1KxMcEiLH/LKFukMKPIujiPmAUWkIOVa5FHhr7RHoJIouyAjeaNE5KpwGQMMMRGVhnLFtHdTgCJBUWiNHQc/vRjUWgWYISNYmBkp4Mg7uPvkSVLWhUzS+faIn49rpgY5JVfk+wYqaIhiO9pYWEhX7//HLmcce9PkRnWWUo8l2v5s/6LXL06GIHjgGk6Wiv09PRERj9PsvjDP8exeyPHiLXWNU1PT9c2YKkGnxSAFIuKB0wmmW+KQp5g32sf038h6F4eNxR2qgAAAABJRU5ErkJggg");
        return ImageResources.DashBill
    }

    static get PlayerOrb() {
        if (ImageResources.PlayerOrb) {
            return ImageResources.PlayerOrb
        }
        ImageResources.PlayerOrb = Util.getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKHSURBVEhLxVY9aFNRGP1Si+APLq51UOhmwbUuoqAEh+JgLSKFoi4VBwXpICKC0rGCg0OHLi2CikIUHAQRHaQGSwW7SKymSV5q0oiRJE0eeeb4nXdv0Jhak/aVHrjv59zvO+fe9+793pNNwUtB52fBqaWLmPbS8PAH3A+YqcZx2IZK5RW6yXkZVGwIShGUmEsNatnQRnwShNOH4FSTQPEB4PQCC13AvJjz134j5r7HYzbPgZe7/DuGjTHMpQa1qGnlDXQE51K9+EkhBjMp3gPYbh/JQcMXH6LGxmtytlsWb5qcuiGhg6ip9nk/IC7Yq50VjoIBCwcbDf6GM6yz1WZvVwQ1qEVNan8U7OMju1afcnJgdYF2kBwymvYJXRc9TNYJGxMYqFl+A+hk7neERJZ39OsqmrO9AaL6XaRzjwg9OvQ+5rPb/GOgqC2rUZdvFKPRcy+lN1nTGSS8WXNWoxf+hTuL4ka9o9JTFCAIcUbiRmV895hIIhycWeIYsFPfvRuTeyEJGV066m4vcKf7RACgVmUG5aZSlB3CcW4wp2/9ZtlLZrNm+nDGUo3InMYUS0dmdO1mubt+9UHmBJ5Zqhlzgq3Zs5jnaBS6MNsDc/yZDCIbE+yy9Mpg7cuNoMQES7UM5uSuwP0iOGCp1aEl40j+Nmrl6dbNKlEgP+aXmwFLtQatgcOsgfk7/zfLj5sCqjmjlmoPOrpbLIp5fcGWasKPCVM4WZy5TSzdPlI9mPCf/Uiz2bcbZhnrgCJqssXSawNHmdyPKQry825pcY76KxOJbrx2BNstvT7QbPEkHlGYZmxEOoy3gZnUQbPcVTzhzNiWLuBdUrABHxeLwiQiuvSj//yd2lyI/AIHLDj9EVkfFwAAAABJRU5ErkJggg");
        return ImageResources.PlayerOrb
    }

    static get BombOrb() {
        if (ImageResources.BombOrb) {
            return ImageResources.BombOrb
        }
        ImageResources.BombOrb = Util.getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASSSURBVGhD3ZhPaBVHHMd/M+8lYI3GYwoxnkLxoOgpzYvpE6pJE9qL0ncSPHj1kggerGePhoIeLHgqHkxoT5I0qWKSlyC5tKBCKULB/y2omJAU6ntvp/Pb/e1jd97s7M7mTSH9HLKz83Y3+93fd37zm4H/gvLCsKCmUzgdnVFeOPZ19OgS52IkoYj/gxhGIsKjO5yKUa3l2mquI6O+/E4WE7eWEDBITSc4E6OzFGOstzxXcibIZWT0lirwCWq1HYdi9NnLpdWciDFlLZdWcxWZRDE+jqzmSIx5gnRltbaL0VlsbesDtQJcWc1BZOJRCYWoglxYzYXNzOOFcGG1toqxqb1cWK3NkdFbLKTFatycKGxpt82sXk6kZD1bGP4ZmhvyByPngbYih/1+g/AE9FIz1kYYE81rGbDYby2RkAzs7qRWgBDiBR2f+x0E58zvj0HXInUPYtevjq1OMVfrc52QEFVQu+AgvClq72ykDr40ujopW5Uw3DsN/70bjRLq8MdMiLTctDwYB6XJPirdxS440zcOX/Z8Bvs6uuB9bROu/H4Tqm9/pSvMpNnR87wHH7bqlbXTa34gYmKQ4fnhCc7gKp3GsBGC3DjyDfR99DFc/+M2rEshh7v74enfr+HOn1W6Ip0kQTIRTVZHq7Eh0iIG+fxuebDmNabV7IRkFYRReTW+AJ8unoVHG0+o1w6dEAHiRQcvVO6dWHpAXU20YkJMtssi6uXYPFx8/C3cej5LPdkw2GtmaaRaoXYLBTpqefr9s5m+Mwc2GINR6mrS21mAl7UGnen565938N3Ry3BgVw88XH8C6/VN+iUZk62WR6sX6FRLagWAvixyXsLwUleTtAGKETn48yno7tgDv538ES59co5+0ZNkK1Yv7FfHhw6jzVS2Y7tDe/vhp6FrMhlM+xktSl5bqVjVZvhgDDedxkiLEiYBFPFVzzD1BCTfJyo2QhDrQhPDjWGXomLZRI0MZjOMRhS0G841UdT7QlstjazMUFdmrGwWRbWcTgym5uU3v/hzTLecNHGe+WL1fEuqjkYHP5L8YCU6tWI7YmIFqm7MoCAUgBPnMzlZJmU01WrSXrneK9dNwYqSYWSapCWANKKCMHvqJsU0ci7OzCvK7VL3vFybHTnF2K0o8asnZ61WZBLItTdgLcZm00IVkVUQ1oTHZ4+31IVpWIvxRPrSGEl6cVVgiPqcRqFhFX3EWoxcHhgtkPSyKmnXMCa0k7OJPGMm9sWiL6V7waCmE9qZ3HRvHqtZiUkaL/giOiGSGV4vDuJsTnNHy6xuuBdEsW6VCCwjY7PPFdRWi+OLzWo7qLX0UdIhx6dVira1WaoYLEdMtRX24++ymVp7pY1PlcwVgG7WV8GKOsu6I8S03xBiUw1YRCbZYjYLqChJFXgUm2rAIjL6nU/baCSRFCX8UMsjK7Ht4iQyRUaXxfJGIwl8DlpKjZJNis4kRp315Recwq8VzVTtAMeGFFXC51OXT43VMmXRTGI4Cwq/cCv0/smq9exsg/98+X/CLeMCZ+39f9JqxkzmivL80FUcrwM/DKRYDeBf4UznqLANYywAAAAASUVORK5CYII");
        return ImageResources.BombOrb
    }

    static get BlueOrb() {
        if (ImageResources.BlueOrb) {
            return ImageResources.BlueOrb
        }
        ImageResources.BlueOrb = Util.getImage("data:image/png;base64,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");
        return ImageResources.BlueOrb
    }

    static get PowerOrb() {
        if (ImageResources.PowerOrb) {
            return ImageResources.PowerOrb
        }
        ImageResources.PowerOrb = Util.getImage("data:image/png;base64,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");
        return ImageResources.PowerOrb
    }

    static get SmallPowerOrb() {
        if (ImageResources.SmallPowerOrb) {
            return ImageResources.SmallPowerOrb
        }
        ImageResources.SmallPowerOrb = Util.getImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAH5SURBVDhPTZO/axRBFMc/s7sXN3pBCJ5FYpNahHhY+QdICqtAegnYCIFAGksLSRNSaUD7dIKdfbDxIK2BoJKLpJHImZgzdzu3uzN+Z+4ifuHtm9md7/u+H7MG4QUkX2HOQTPs5U0mCz4BL581IK91bgTH7+BHJD6Be3fhvT7Ohb1g/GQRIHIiyxQsHcDHDiwFonkDbx/l+VM3PU1RliTeM6xrSn3MjYlWa9+1li9w9Ana2Yqi3TDmzu29vRids7NxYrZAp0HByHM4PWW0usrhxQV/lH72U4p1o5EGjt3cxOzvR/4V0sVFqu4xvH5FpQC1iGpEqF2BFSF42+sxqipmOp1/dn1ri3I4wPb7lCpBZyOSlkijulbjoHAOJYgXube2xu/tbZidxUqpEMmlKVU4KETFyrmoWMhZea8e3trdZWZ9HdSsy5OT2LRKfZWCDzWOiVpEolwkSrm7vMxhu83nhQWKopBZrFTV6TjCRPPz2sTU7UC1yNdqe7/bZXB+HtMP7+xkPFJ06vlYMaQWYKemGDabVBsbXIZ9qzW2+XlsOcKqdmVXXRMlO5D0Q+c0LHiwsxNcxP2J/x8fVKeu3HfVWMZ8n8Ozm2n6GN0QFasnPoxIw02M94n2TkqlxvHrwLmXuqvfIlEw4QZN1hGh9pDN1Tq+FPRDqEz4C4e87TxeNPtIAAAAAElFTkSuQmCC");
        return ImageResources.SmallPowerOrb
    }
}
