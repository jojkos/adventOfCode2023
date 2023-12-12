import { parseFileIntoLines } from "../utils";
import { memoize } from "lodash";

const inputLines = parseFileIntoLines("input.txt");

const Unknown = "?";
const Broken = "#";
const Valid = ".";

interface ILine {
    values: string;
    numbers: number[];
}


const parseLines2 = (lines: string[]) => {
    const parsedLines: ILine[] = [];

    for (const line of lines) {
        const [rangesPart, numbersPart] = line.split(" ");
        const numbers = numbersPart.split(",").map(v => Number(v));

        parsedLines.push({
            values: rangesPart,
            numbers
        });
    }

    return parsedLines;
};

const replaceCharInString = (str: string, newChar: string, index: number) => {
    return str.substring(0, index) + newChar + str.substring(index + 1);
};

const replaceAll = (val: string, char: string, newChar: string) => {
    return val.split(char).join(newChar);
};

const checkIfFits = (values: string, fit: string) => {
    return values.split(Unknown).join(Broken) === fit;
};

const fixValues = (previous: string, next: string, middle) => {
    let fixedPrevious = previous;
    let fixedNext = next;

    if (previous[previous.length - 1] === Unknown) {
        fixedPrevious = replaceCharInString(previous, Valid, previous.length - 1);
    }

    if (next[0] === Unknown) {
        fixedNext = replaceCharInString(next, Valid, 0);
    }

    return [fixedPrevious, fixedNext, middle];
};

const checkInvalidFit = (values: string, numbersCount: number) => {
    if (numbersCount === 0) {
        return true;
    }

    const rr = replaceAll(values, Unknown, Valid);
    const brokens = replaceAll(rr, Valid, " ").split(" ").filter(v => v).length;

    return brokens <= numbersCount;
};

function findAllIndexes(str, searchStr) {
    let indexes = [];
    let i = -1;
    while ((i = str.indexOf(searchStr, i + 1)) !== -1) {
        indexes.push(i);
    }
    return indexes;
}

const cache = new Map<string, [string, string, string][]>();

const getFits = (values: string, size: number, numbersCount: number) => {
    const key = `${values}-${size}`;

    if (cache.has(key)) {
        return cache.get(key);
    }

    const checkVal = new Array(size).fill(Broken).join("");
    // const preciseFitIndex = findAllIndexes(values, checkVal);

    // if (preciseFitIndex.length > 0) {
    //     const fits = [];
    //
    //     for (const index of preciseFitIndex) {
    //         const previous = values.substring(0, index);
    //         const next = values.substring(index + size, values.length);
    //
    //         return fits.push(fixValues(previous, next, checkVal));
    //     }
    //
    //     return fits;
    // }

    const fits = [];

    for (let i = 0; i < values.length; i += 1) {
        const subStr = values.substring(i, i + size);

        if (checkIfFits(subStr, checkVal) && values[i - 1] !== Broken && values[i + size] !== Broken) {
            const previous = values.substring(0, i);
            const next = values.substring(i + size, values.length);

            const [fixedPrevious, fixedNext, middle] = fixValues(previous, next, checkVal);

            // tohle actually pomaha!! ale porad mam hromadu failu
            if (checkInvalidFit(
                `${previous}${checkVal}${next}`, numbersCount
            )) {
                fits.push([fixedPrevious, fixedNext, middle]);
            }
        }
    }

    cache.set(key, fits);

    return fits;
};

let count = 0;

const cache2 = new Map<string, string[]>();

const dfs = (line: ILine) => {
    const key = `${line.values}-${line.numbers}`;

    if (cache2.has(key)) {
        return cache2.get(key);
    }

    count += 1;

    if (line.numbers.length === 0) {
        return [line.values];
    }

    const max = Math.max(...line.numbers);
    const maxIndex = line.numbers.findIndex(n => n === max);
    const previous = line.numbers.filter((_, i) => i < maxIndex);
    const next = line.numbers.filter((_, i) => i > maxIndex);
    const fits = getFits(line.values, max, line.numbers.length - 1);

    if (line.numbers.length === 1) {
        return fits.map(([left, right, middle]) => `${left}${middle}${right}`);
    }

    let sum = 0;
    const resFits = [];

    for (const [left, right, middle] of fits) {
        const leftRes = dfs({
            values: left,
            numbers: previous
        });

        const rightRes = dfs({
            values: right,
            numbers: next
        });

        if (leftRes.length && rightRes.length) {
            sum += Math.max(leftRes.length, rightRes.length);

            for (const leftFit of leftRes) {
                for (const rightFit of rightRes) {
                    resFits.push(
                        `${leftFit}${middle}${rightFit}`
                    );
                }
            }
        }
    }

    cache2.set(key, resFits);

    return resFits;
};

console.time();

const lines = parseLines2(inputLines);
let res1 = 0;

let x = 0;
let failed = 0;

for (const line of lines) {
    x += 1;

    console.log(x);

    const defString = line.values;
    const defNumbers = [...line.numbers];

    for (let i = 0; i < 4; i++) {
        line.values += `?${defString}`;
        line.numbers.push(...defNumbers);
    }

    const res = dfs(line);

    let valids = 0;
    const numbers = line.numbers.length;

    for (const r of res) {
        const rr = replaceAll(r, Unknown, Valid);
        const brokens = replaceAll(rr, Valid, " ").split(" ").filter(v => v).length;

        if (brokens == numbers) {
            valids += 1;
            // console.log(r);
        } else {
            failed += 1;
            // console.log(r);
            // console.log(rr);
            // console.log("fycj");
        }
    }

    res1 += valids;
}


console.timeEnd();

console.log(`res:`, res1);
console.log("calls:", count);
console.log("fails:", failed);
