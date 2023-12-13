import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

const parsePatterns = (lines: string[]) => {
    const patterns: string[][] = [];
    let pattern: string[] = [];

    for (const line of lines) {
        if (line === "") {
            patterns.push(pattern);
            pattern = [];
            continue;
        } else {
            pattern.push(line);
        }
    }

    patterns.push(pattern);

    return patterns;
};

const printPattern = (pattern: string[]) => {
    for (const line of pattern) {
        console.log(line);
    }

    console.log("\n");
};

const rotatePattern = (lines: string[]) => {
    const rotatedPattern = [];

    for (let i = 0; i < lines[0].length; i++) {
        rotatedPattern.push([]);
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (let j = 0; j < line.length; j++) {
            const val = lines[i][j];

            rotatedPattern[line.length - j - 1][i] = val;
        }
    }

    return rotatedPattern.map(line => line.join(""));
};


const flipString = (val: string) => {
    let newString = "";

    for (let i = val.length - 1; i >= 0; i--) {
        newString += val[i];
    }

    return newString;
};

const findVerticalMirrors = (pattern: string[]): number[] => {
    const lineLength = pattern[0].length;
    const matching = {};

    for (let i = 0; i < lineLength - 1; i++) {
        matching[i] = null;
    }

    for (let i = 0; i < lineLength - 1; i++) {
        for (const line of pattern) {
            const range = Math.min(i + 1, line.length - i - 1);
            const leftPart = line.substring(i + 1 - range, i + 1);
            const rightPart = line.substring(i + 1, 1 + i + range);

            if (leftPart === flipString(rightPart)) {
                if (matching[i] !== false) {
                    if (matching[i] === null) {
                        matching[i] = i + 1;
                    } else {
                        matching[i] = Math.min(matching[i], i + 1);
                    }
                    // console.log(leftPart, rightPart);
                }
            } else {
                matching[i] = false;
            }
        }
    }

    const vals = [];

    for (const [key, value] of Object.entries(matching)) {
        if (value) {
            vals.push(value);
        }
    }

    if (vals.length === 0) {
        return [];
    }

    return vals;
};

console.time();


const patterns = parsePatterns(inputLines);
const rotatedPatterns = patterns.map(pattern => rotatePattern(pattern));


// solve 1

let res1 = 0;
let res2 = 0;

const isDifferent = (arr1: number[], arr2: number[]) => {
    return arr2.some(val => !arr1.includes(val));
};

const replaceCharInString = (str: string, newChar: string, index: number) => {
    return str.substring(0, index) + newChar + str.substring(index + 1);
};

for (let i = 0; i < patterns.length; i++) {
    const verticalPattern = patterns[i];
    const horizontalPattern = rotatedPatterns[i];

    let verticalMirrors = findVerticalMirrors(verticalPattern);
    let horizontalMirrors = findVerticalMirrors(horizontalPattern);

    for (const val of verticalMirrors) {
        res1 += (val);
    }
    for (const val of horizontalMirrors) {
        res1 += (val) * 100;
    }

    let smudgeFound = false;

    for (let x = 0; x < verticalPattern.length; x++) {
        const line = verticalPattern[0];

        for (let y = 0; y < line.length; y++) {
            const oldChar = verticalPattern[x][y];
            const newChar = oldChar === "#" ? "." : "#";

            verticalPattern[x] = replaceCharInString(verticalPattern[x], newChar, y);
            horizontalPattern[line.length - y - 1] = replaceCharInString(horizontalPattern[line.length - y - 1], newChar, x);

            // printPattern(verticalPattern)
            // printPattern(horizontalPattern)

            const newVerticalMirrors = findVerticalMirrors(verticalPattern);
            const nowHorizontalMirrors = findVerticalMirrors(horizontalPattern);


            if ((isDifferent(verticalMirrors, newVerticalMirrors) || isDifferent(horizontalMirrors, nowHorizontalMirrors))
                && (newVerticalMirrors.length || nowHorizontalMirrors.length)) {
                verticalMirrors = newVerticalMirrors.filter(v => !verticalMirrors.includes(v));
                horizontalMirrors = nowHorizontalMirrors.filter(v => !horizontalMirrors.includes(v));
                smudgeFound = true;
                break;
            }

            verticalPattern[x] = replaceCharInString(verticalPattern[x], oldChar, y);
            horizontalPattern[line.length - y - 1] = replaceCharInString(horizontalPattern[line.length - y - 1], oldChar, x);
        }

        if (smudgeFound) {
            break;
        }
    }

    for (const val of verticalMirrors) {
        res2 += (val);
    }
    for (const val of horizontalMirrors) {
        res2 += (val) * 100;
    }


}


console.timeEnd();

console.log(`res1:`, res1);
console.log(`res2:`, res2);