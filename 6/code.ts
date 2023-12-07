import { parseFileIntoLines } from "../utils";

const parseValues = (line: string): number[] => {
    return line.split(":")[1].trim().split(" ").filter(v => v).map(v => Number(v));
};

const inputLines = parseFileIntoLines("input.txt");
const times = parseValues(inputLines[0]);
const distances = parseValues(inputLines[1]);

let res1 = 1;

console.time();

for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const record = distances[i];
    let possibilities = 0;

    for (let j = 0; j < time; j++) {
        const speed = j;
        const distance = (time - speed) * speed;

        if (distance > record) {
            possibilities += 1;
        }
    }

    res1 = res1 * possibilities;
}

console.timeEnd();
console.log(res1);