import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

const printRanges = (ranges: number[][]) => {
    let result = "";

    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];

        result += new Array(i).fill(" ").join("");

        for (const number of range) {
            result += number;
            result += "  ";
        }

        result += "\n";
    }

    console.log(result);
};


let res1 = 0;
let res2 = 0;


console.time();

for (const line of inputLines) {
    const ranges: number[][] = [
        line.split(" ").map(v => Number(v))
    ];

    // prepare ranges
    while (true) {
        let allZeroes = true;

        const currentRange = ranges[ranges.length - 1];
        const newRange: number[] = [];

        for (let i = 0; i < currentRange.length - 1; i++) {
            const v1 = currentRange[i];
            const v2 = currentRange [i + 1];
            const diff = v2 - v1;

            newRange.push(diff);

            if (diff !== 0) {
                allZeroes = false;
            }
        }

        ranges.push(newRange);

        if (allZeroes) {
            newRange.push(0);
            break;
        }
    }

    // add future
    for (let i = ranges.length - 1; i > 0; i--) {
        const r1 = ranges[i];
        const r2 = ranges[i - 1];
        const newVal = r1[r1.length - 1] + r2[r2.length - 1];

        r2.push(newVal);

        if (i === 1) {
            res1 += newVal;
        }
    }

    // add history
    for (let i = ranges.length - 1; i > 0; i--) {
        const r1 = ranges[i];
        const r2 = ranges[i - 1];
        const newVal = r2[0] - r1[0];

        r2.unshift(newVal);

        if (i === 1) {
            res2 += newVal;
        }
    }

    // printRanges(ranges);
}


console.timeEnd();
console.log(res1);
console.log(res2);