import * as fs from "fs";
import { isStringNumber, parseFileIntoLines } from "../utils";

interface ISymbol {
    x: number;
    y: number;
    symbol: string;
}

const getAdjacentSymbols = (x: number, y: number, lines: string[], isGear?: boolean): ISymbol[] => {
    const adjacentSymbols: ISymbol[] = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }

            const val = lines[x + i]?.[y + j];

            if (!val) {
                continue;
            }

            if (!isStringNumber(val) && val !== ".") {
                adjacentSymbols.push({
                    x: x + i, y: y + j,
                    symbol: val
                });
            }
        }
    }

    return adjacentSymbols;
};

const inputLines = parseFileIntoLines("input.txt");

let sum = 0;
const possibleGears: Record<string, number[]> = {};
let gearSum = 0;

let currentNumber = "";
let someAdjacentSymbol = false;
let gearSymbols: ISymbol[] = [];


for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];

    for (let j = 0; j < line.length; j++) {
        const val = line[j];
        const isNumber = isStringNumber(val);

        if (isNumber) {
            currentNumber = `${currentNumber}${val}`;

            const symbols = getAdjacentSymbols(i, j, inputLines);

            for (const symbol of symbols) {
                if (symbol.symbol === "*") {
                    if (!gearSymbols.find(s => s.x === symbol.x && s.y === symbol.y)) {
                        gearSymbols.push(symbol);
                    }
                }
            }

            someAdjacentSymbol = someAdjacentSymbol || symbols.length > 0;

        } else {
            if (currentNumber !== "") {
                if (someAdjacentSymbol) {
                    const parsedValue = Number(currentNumber);

                    sum += parsedValue;

                    if (gearSymbols.length > 0) {
                        for (const symbol of gearSymbols) {
                            const key = `${symbol.x}${symbol.y}`;

                            possibleGears[key] = possibleGears[key] || [];

                            possibleGears[key].push(parsedValue);
                        }
                    }
                }
            }

            currentNumber = "";
            someAdjacentSymbol = false;
            gearSymbols = [];
        }
    }
}

console.log(sum);

for (const parts of Object.values(possibleGears)) {
    if (parts.length === 2) {
        gearSum += parts[0] * parts[1];
    }
}

console.log(gearSum);