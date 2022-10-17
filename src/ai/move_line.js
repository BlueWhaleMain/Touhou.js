export default function moveLine(MX, MY) {
    return (inst) => {
        inst.X += MX
        inst.Y += MY
        if (MX < 0) {
            if (typeof inst.left === "function") {
                inst.left()
            }
        } else if (MX > 0) {
            if (typeof inst.right === "function") {
                inst.right()
            }
        }
    }
}