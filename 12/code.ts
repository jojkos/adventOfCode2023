import * as fs from "fs";

const parseFileIntoLines = (filePath: string): string[] => {
    return fs.readFileSync(filePath).toString().split("\r\n");
};

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

const cache2 = new Map<string, any>();

const dfs = (line: ILine) => {
    const key = `${line.values}-${line.numbers.join(",")}`;

    if (cache2.has(key)) {
        return cache2.get(key);
    }

    count += 1;

    if (line.numbers.length === 0) {
        const rres = [line.values];

        cache2.set(key, rres);

        return rres;
    }

    const max = Math.max(...line.numbers);

    const maxIndex = line.numbers.findIndex(n => n === max);
    const previous = line.numbers.filter((_, i) => i < maxIndex);
    const next = line.numbers.filter((_, i) => i > maxIndex);
    const fits = getFits(line.values, max, line.numbers.length - 1);

    if (line.numbers.length === 1) {
        const rres = fits.map(([left, right, middle]) => `${left}${middle}${right}`);

        cache2.set(key, rres);

        return rres;
    }

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

const allPossibleCounts = (values: string) => {
    let count = 0;

    for (const c of replaceAll(values, Unknown, Broken)) {
        if (c === Broken) {
            count += 1;
        }
    }

    return count;
};

const getFits2 = (line: ILine) => {
    const size = line.numbers[0];
    const nextNumber = line.numbers[1];
    const values = line.values;

    const key = `${values}-${size}`;

    // if (cache.has(key)) {
    //     return cache.get(key);
    // }

    const allNumbersSum = line.numbers.reduce((acc, current) => acc + current, 0);
    const enoughSpaceLeft = allPossibleCounts(line.values) >= allNumbersSum;

    if (!enoughSpaceLeft) {
        cache.set(key, []);
        return [];
    }

    if (line.numbers.length === 0) {
        return [[line.values, ""]];
    }

    const checkVal = new Array(size).fill(Broken).join("");
    // const preciseFitIndex = values.indexOf(checkVal);
    let firstMatchIndex: number = null;

    const fits = [];

    for (let i = 0; i < values.length; i += 1) {
        // if (nextNumber && firstMatchIndex && i > firstMatchIndex + nextNumber) {
        //     break;
        // }

        const subStr = values.substring(i, i + size);

        if (checkIfFits(subStr, checkVal)) {
            if (values[i - 1] === Broken || values[i + size] === Broken) {
                // lol tohle je hodne dulezitej check, totalne oreze strom
                if (firstMatchIndex) {
                    break;
                } else {
                    continue;
                }
            }


            if (!firstMatchIndex) {
                firstMatchIndex = i;
            }

            const previous = values.substring(0, i);
            const next = values.substring(i + size, values.length);

            const [fixedPrevious, fixedNext, middle] = fixValues(previous, next, checkVal);

            fits.push([`${fixedPrevious}${middle}`, fixedNext]);
        }
    }

    cache2.set(key, fits);

    return fits;
};

const dfs2 = (initialLine) => {
    const stack = [{ line: initialLine, index: 0, prefix: '' }];
    const results = [];
    const key = `${initialLine.values}-${initialLine.numbers.join(",")}`;

    // if (cache2.has(key)) {
    //     return cache2.get(key);
    // }

    while (stack.length > 0) {
        const { line, index, prefix } = stack.pop();

        const lineKey = `${line.values}-${line.numbers.join(",")}`;

        if (cache2.has(lineKey)) {
            const cachedResults = cache2.get(lineKey).map(res => prefix + res);
            results.push(...cachedResults);
            continue;
        }

        if (line.numbers.length === 0) {
            cache2.set(lineKey, [line.values]);
            results.push(prefix + line.values);
            continue;
        }

        const fits = getFits2(line);

        if (line.numbers.length === 1) {
            const singleFitResults = fits.map(([fitPrefix, _]) => prefix + fitPrefix);
            cache2.set(lineKey, singleFitResults);
            results.push(...singleFitResults);
            continue;
        }

        for (const [fitPrefix, suffix] of fits) {
            stack.push({
                line: { values: suffix, numbers: line.numbers.slice(1) },
                index: index + 1,
                prefix: prefix + fitPrefix
            });
        }
    }

    cache2.set(key, results);
    return results;
};

console.time();

const lines = parseLines2(inputLines);
let res1 = 0;

let x = 0;
let failed = 0;

for (const line of lines) {
    x += 1;

    // console.log(x);

    const defString = line.values;
    const defNumbers = [...line.numbers];

    // for (let i = 0; i < 4; i++) {
    //     line.values += `?${defString}`;
    //     line.numbers.push(...defNumbers);
    // }

    const res = dfs2(line);

    let valids = 0;
    const numbers = line.numbers.length;

    console.log(res.length);

    valids += res.length;

    res1 += valids;
}


console.timeEnd();

console.log(`res:`, res1);
console.log("calls:", count);
console.log("fails:", failed);
