import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map: string[][] = inputLines.map(line => line.split(""));

type TCoord = [number, number];

const Start = "S";
const Ground = ".";

const Pipes: Record<string, TCoord[]> = {
    "|": [[1, 0], [-1, 0]],
    "-": [[0, 1], [0, -1]],
    "L": [[0, 1], [-1, 0]],
    "J": [[0, -1], [-1, 1]],
    "7": [[1, 0], [0, -1]],
    "F": [[0, 1], [-1, 0]]
};

const getNext = (prevCoord: TCoord, currentCoord: TCoord): TCoord => {
    const diff = [currentCoord[0] - prevCoord[0], currentCoord[1] - prevCoord[1]];
    const newPipe = map[currentCoord[0]][currentCoord[1]];
    let nextDiff: TCoord = [0, 0];

    if (newPipe === "|") {
        if (diff[0] === 1) nextDiff = Pipes["|"][0]
        else nextDiff = Pipes["|"][1]
    } else if (newPipe === "-") {
        if (diff[1] === 1) nextDiff = Pipes["-"][0]
        else nextDiff = Pipes["-"][1]
    } else if (newPipe === "L") {
        if (diff[0] === 1) nextDiff = Pipes["L"][0]
        else nextDiff = Pipes["L"][1]
    } else if (newPipe === "J") {
        if (diff[0] === 1) nextDiff = Pipes["J"][0]
        else nextDiff = Pipes["J"][1]
    } else if (newPipe === "7") {
        if (diff[1] === 1) nextDiff = Pipes["7"][0]
        else nextDiff = Pipes["7"][1]
    } else if (newPipe === "F") {
        if (diff[0] === -1) nextDiff = Pipes["F"][0]
        else nextDiff = Pipes["F"][0]
    }

    return [currentCoord[0] + nextDiff[0], currentCoord[1] + nextDiff[1]] as TCoord;
}

const findStartCoord = (map: string[][]): TCoord => {
    for (let i = 0; i < map.length; i++) {
        const line = map[i];

        for (let j = 0; j < line.length; j++) {
            const val = line[j];

            if (val === Start) {
                return [i, j];
            }
        }
    }
};

const isSameCoord = (coord1: TCoord, coord2: TCoord): boolean => {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
};

console.time();



// lvl 1

let furthest = 0;
let loopLength = 0;

const start = findStartCoord(map);


const dfs = (coord: TCoord, prevCoord: TCoord, ignoreStart?: boolean/*, currentDistance: number = 0*/) => {
    const pipe = map[coord[0]][coord[1]];

    if (!ignoreStart && isSameCoord(coord, start)) {
        return 1;
    }


    loopLength += 1;

    if (pipe === Ground || !pipe) {
        return 0;
    }

    const newCord = getNext(prevCoord, coord);
    
    return dfs(newCord, coord/*, currentDistance + 1*/);
};


for (const pipe of Object.keys(Pipes)) {
    loopLength = 0;
    map[start[0]][start[1]] = pipe;
    const diff = Pipes[pipe][0];


    const res = dfs(start, [start[0] - diff[0], start[1] - diff[1]], true);

    if (res) {
        console.log(pipe, res);
        break;
    }
}


console.log(loopLength / 2);


console.timeEnd();
// console.log(furthest);