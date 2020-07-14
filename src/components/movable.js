export default function movable() {
    this.MX = 0;
    this.MY = 0;
    this.tick = function (inst) {
        inst.X += this.MX;
        inst.Y += this.MY;
    }
}
