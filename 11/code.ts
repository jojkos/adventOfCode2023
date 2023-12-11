import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map = inputLines.map(line => line.split(""));
const Space = ".";
const Galaxy = "#";
const enlargeBy = 999999;
let rowsCount = map.length;
let colCount = map[0].length;

interface IPoint {
    x: number;
    y: number;
}

const getEmptyRows = (): number[] => {
    const emptyRows: number[] = [];

    for (let i = 0; i < rowsCount; i++) {
        const row = map[i];

        if (row.every(val => val === Space)) {
            emptyRows.push(i);
        }
    }

    return emptyRows;
};

const getEmptyColumns = (): number[] => {
    const emptyColumns: number[] = [];


    for (let i = 0; i < colCount; i++) {
        let isAllEmpty = true;

        for (let j = 0; j < rowsCount; j++) {
            if (map[j][i] !== Space) {
                isAllEmpty = false;
                break;
            }
        }

        if (isAllEmpty) {
            emptyColumns.push(i);
        }
    }

    return emptyColumns;
};

const getShortestPath = (p1: IPoint, p2: IPoint): number => {
    return Math.abs((p1.x - p2.x)) + Math.abs((p1.y - p2.y));
};

let res1 = 0;

console.time();

const emptyRows = getEmptyRows();
const emptyColumns = getEmptyColumns();

const galaxyMap = map.map((line, i) => line.map((val, j) => val === Space ? null : {
    x: i,
    originalX: i,
    y: j,
    originalY: j
}).filter(v => v)).filter(line => line.some(v => v));

const galaxies = galaxyMap.flat();

for (const line of galaxyMap) {
    let sum = 0;

    for (const emptyCol of emptyColumns) {
        for (const galaxy of line) {
            if (galaxy.y > emptyCol + sum) {
                galaxy.y += enlargeBy;
            }
        }
        sum += enlargeBy;
    }
}

for (const line of galaxyMap) {
    let sum = 0;

    for (const emptyRow of emptyRows) {
        for (const galaxy of line) {
            if (galaxy.x > emptyRow + sum) {
                galaxy.x += enlargeBy;
            }
        }
        sum += enlargeBy;
    }
}

// console.log(galaxyMap);


for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        const path = getShortestPath(galaxies[i], galaxies[j]);

        res1 += path;
    }
}

console.timeEnd();

console.log(res1);