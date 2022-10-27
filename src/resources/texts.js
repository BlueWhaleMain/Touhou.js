import fs from "fs";

const textMap = new Map()

export function newText(name) {
    if (textMap.has(name)) {
        return textMap.get(name)
    }
    const text = fs.readFileSync('./assets/texts/' + name).toString();
    textMap.set(name, text);
    return text
}