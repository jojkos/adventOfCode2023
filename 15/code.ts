import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const strings = inputLines[0].split(",");


interface ILense {
    label: string;
    focalLength: number;
    operation: "=" | "-";
}

const lenses = strings.map(string => {
    let label: string;
    let focalLength: number;
    let operation: string;

    if (string.includes("-")) {
        const splitted = string.split("-");

        label = splitted[0];
        focalLength = null;
        operation = "-";
    } else {
        const splitted = string.split("=");

        label = splitted[0];
        focalLength = Number(splitted[1]);
        operation = "=";
    }

    return {
        label, focalLength, operation
    } as ILense;
});

const boxes: Record<number, ILense[]> = {};

for (let i = 0; i < 256; i++) {
    boxes[i] = [];
}

let res1 = 0;
let res2 = 0;

const hashString = (val: string) => {
    let sum = 0;

    for (let i = 0; i < val.length; i++) {
        const c = val[i];

        sum += c.charCodeAt(0);
        sum = sum * 17;
        sum = sum % 256;
    }

    return sum;
};

console.time();

for (const string of strings) {
    res1 += hashString(string);
}

for (const lense of lenses) {
    const boxIndex = hashString(lense.label);

    if (lense.operation === "-") {
        const existingIndex = boxes[boxIndex].findIndex(l => l.label === lense.label);

        if (existingIndex >= 0) {
            boxes[boxIndex].splice(existingIndex, 1);
        }
    } else {
        const existingIndex = boxes[boxIndex].findIndex(l => l.label === lense.label);

        if (existingIndex >= 0) {
            boxes[boxIndex].splice(existingIndex, 1, lense);
        } else {
            boxes[boxIndex].push(lense);
        }
    }
}

for (let i = 0; i < 256; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
        const lense = boxes[i][j];
        const lenseSum = (i + 1) * (j + 1) * lense.focalLength;

        res2 += lenseSum;
    }

}

console.log(hashString("qp"));

console.timeEnd();

console.log(`res1:`, res1);
console.log(`res1:`, res2);
