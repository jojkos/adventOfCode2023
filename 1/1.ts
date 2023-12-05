import * as fs from "fs";
import * as path from "path";
import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

const numberStrings = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
];

const firstNumberRegex = /\d/;
const lastNumberRegex = /\d(?!.*\d)/;

let sum = 0;

for (const line of inputLines) {
    let first: number = null;
    let firstIndex: number = null;
    let last: number = null;
    let lastIndex: number = null;

    const fnUpdateFirst = (newValue: number, newIndex: number) => {
        if (newIndex < firstIndex || firstIndex === null) {
            first = newValue;
            firstIndex = newIndex;
        }
    };

    const fnUpdateLast = (newValue: number, newIndex: number) => {
        if (newIndex > lastIndex || lastIndex === null) {
            last = newValue;
            lastIndex = newIndex;
        }
    };

    for (let i = 0; i < line.length; i++) {
        const firstNumberMatch = line.match(firstNumberRegex);
        const lastNumberMatch = line.match(lastNumberRegex);

        if (firstNumberMatch) {
            fnUpdateFirst(Number(firstNumberMatch[0]), firstNumberMatch.index);
        }

        if (lastNumberMatch) {
            fnUpdateLast(Number(lastNumberMatch[0]), lastNumberMatch.index);
        }

        for (let j = 0; j < numberStrings.length; j++) {
            const number = j + 1;
            const word = numberStrings[j];
            const firstIndex = line.indexOf(word);
            const lastIndex = line.lastIndexOf(word);

            if (firstIndex >= 0) {
                fnUpdateFirst(number, firstIndex);
            }

            if (lastIndex >= 0) {
                fnUpdateLast(number, lastIndex);
            }
        }
    }

    if (last === null) {
        last = first;
    }

    sum += Number(`${first}${last}`);
}

console.log(sum);