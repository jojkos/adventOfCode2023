import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

type TPoint = [number, number];
const map: string[][] = inputLines.map(line => line.split(""));
const Start = "S";
const Ground = ".";

const getStartPoint = (): TPoint => {
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === Start) {
                return [i, j];
            }
        }
    }
};

const Pipes: Record<string, TPoint[][]> = {
    "|": [[[-1, 0], [-1, 0]], [[1, 0], [1, 0]]],
    "-": [[[0, 1], [0, 1]], [[0, -1], [0, -1]]],
    "L": [[[1, 0], [0, 1]], [[0, -1], [-1, 0]]],
    "J": [[[1, 0], [0, -1]], [[0, 1], [-1, 0]]],
    "7": [[[0, 1], [1, 0]], [[-1, 0], [0, -1]]],
    "F": [[[-1, 0], [0, 1]], [[0, -1], [1, 0]]]
};

const isSamePoint = (p1: TPoint, p2: TPoint): boolean => {
    return p1[0] === p2[0] && p1[1] === p2[1];
};

const iterativeDFS = (startPoint: TPoint, entryDiff: TPoint, shape: Record<string, boolean>): number => {
    let stack: { point: TPoint; entryDiff: TPoint }[] = [{ point: startPoint, entryDiff: entryDiff }];
    let count = 0;

    while (stack.length > 0) {
        const { point, entryDiff } = stack.pop();
        const pipe = map[point[0]][point[1]];

        if (!pipe || pipe === Ground) {
            return 0;
        }

        shape[`${point[0]}-${point[1]}`] = true;

        if (minX == undefined || point[1] < minX) {
            minX = point[1];
        }
        if (maxX == undefined || point[1] > maxX) {
            maxX = point[1];
        }
        if (minY == undefined || point[0] < minY) {
            minY = point[0];
        }
        if (maxY == undefined || point[0] > maxY) {
            maxY = point[0];
        }

        const access = Pipes[pipe].find(access => isSamePoint(access[0], entryDiff));

        if (!access) {
            return 0;
        }

        const nextPoint: TPoint = [point[0] + access[1][0], point[1] + access[1][1]];
        const nextPipe = map[nextPoint[0]][nextPoint[1]];

        if (nextPipe !== Ground && !isSamePoint(nextPoint, startPoint)) {
            stack.push({ point: nextPoint, entryDiff: access[1] });
            count++;
        }

        if (isSamePoint(nextPoint, startPoint)) {
            const a = Pipes[nextPipe].find(a => isSamePoint(a[0], access[1]));

            if (!a) {
                return 0;
            }
        }
    }

    return count;
};

console.time();
const startPoint = getStartPoint();

let result;
let minX, minY, maxX, maxY;

for (const pipe of Object.keys(Pipes)) {
    const shape: Record<string, boolean> = {};

    map[startPoint[0]][startPoint[1]] = pipe;
    minX = minY = maxX = maxY = null;
    result = iterativeDFS(startPoint, Pipes[pipe][0][0], shape);

    if (result) {
        result += 1;
        console.log(pipe, result, result / 2);

        let numberOfEnclosed = 0;

        for (let i = minY; i < maxY; i++) {
            let crossings = 0;

            for (let j = minX; j < maxX; j++) {
                if (shape[`${i}-${j}`]) {
                    const pipe = map[i][j];

                    if (!["-", "F", "7"].includes(pipe)) {
                        crossings += 1;
                    }

                    continue;
                }

                if (crossings % 2 === 1) {
                    numberOfEnclosed += 1;
                }
            }
        }

        console.log(numberOfEnclosed);
        break;
    }
}

console.timeEnd();
