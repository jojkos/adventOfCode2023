import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

const Empty = ".";
const Trench = "#";

interface IInput {
    dir: "U" | "D" | "R" | "L";
    steps: number;
    color: string;
}

interface IPos {
    x: number;
    y: number;
}

enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

const InputDirToDir = (inputDir: "U" | "D" | "R" | "L") => {
    switch (inputDir) {
        case "U":
            return Direction.Up;
        case "D":
            return Direction.Down;
        case "R":
            return Direction.Right;
        case "L":
            return Direction.Left;
    }
};

const DirMapping: Record<Direction, IPos> = {
    [Direction.Up]: { x: 0, y: -1 },
    [Direction.Down]: { x: 0, y: 1 },
    [Direction.Right]: { x: 1, y: 0 },
    [Direction.Left]: { x: -1, y: 0 }
};

// edge has start, direction and size
interface INode extends IPos {
    color: string;
    size: number;
    dir: Direction;
    tile: string;
}

interface IRange {
    start: number;
    size: number;
    startTile: string;
    endTile: string;
}

const posToKey = (pos: IPos) => {
    return `${pos.x}:${pos.y}`;
};

// const isOutside = (pos: IPos) => {
//     return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
// };

const getNewPos = (currentPos: IPos, dir: Direction) => {
    const diff = DirMapping[dir];

    return {
        x: currentPos.x + diff.x,
        y: currentPos.y + diff.y
    };
};

const Dirs = [Direction.Right, Direction.Down, Direction.Left, Direction.Up];

// stack instead of recursion
const flood = (startingPos: IPos, map: INode[][]) => {
    const openPos: IPos[] = [
        startingPos
    ];

    while (openPos.length) {
        const currentPos = openPos.shift();

        for (const dir of Dirs) {
            const newPos = getNewPos(currentPos, dir);

            if (!map[newPos.y]?.[newPos.x]) {
                openPos.push(newPos);

                if (!map[newPos.y]) {
                    map[newPos.y] = [];
                }

                map[newPos.y][newPos.x] = {
                    ...newPos,
                    dir,
                    size: 0,
                    color: null,
                    tile: Trench
                };

                trenchCount += 1;
                innerCount1 += 1;
            }
        }
    }

    return map;
};

const parseInputs = (inputLines: string[]) => {
    const inputs: IInput[] = [];

    for (const line of inputLines) {
        const [dir, steps, color] = line.split(" ");

        inputs.push({
            dir: dir as "U" | "D" | "R" | "L",
            steps: Number(steps),
            color: color.replace("(", "").replace(")", "")
        });
    }

    return inputs;
};

const DirsToTile = {
    [Direction.Down]: {
        [Direction.Down]: "|",
        [Direction.Right]: "L",
        [Direction.Left]: "J"
    },
    [Direction.Up]: {
        [Direction.Up]: "|",
        [Direction.Right]: "F",
        [Direction.Left]: "7"
    },
    [Direction.Right]: {
        [Direction.Left]: "-",
        [Direction.Up]: "J",
        [Direction.Down]: "7"
    },
    [Direction.Left]: {
        [Direction.Right]: "-",
        [Direction.Up]: "L",
        [Direction.Down]: "F"
    }
};


const DirToTile = {
    [Direction.Up]: "|",
    [Direction.Down]: "|",
    [Direction.Left]: "-",
    [Direction.Right]: "-"
};

const createMap = (inputs: IInput[], secondLvl?: boolean) => {
    let currentPos: IPos = {
        x: 0, y: 0
    };
    const map: INode[][] = [
        [{ ...currentPos, color: null, dir: Direction.Right, size: 1, tile: "S" }]
    ];

    for (const input of inputs) {
        let dir: Direction;
        let steps: number;

        if (!secondLvl) {
            steps = input.steps;
            dir = InputDirToDir(input.dir);
        } else {
            const dirIndex = Number(input.color[input.color.length - 1]);

            dir = Dirs[dirIndex];
            steps = parseInt(input.color.slice(1, 6), 16);
            console.log(steps);
        }

        const currentNode = map[currentPos.y][currentPos.x];

        if (currentNode.tile !== "S") {
            // currentNode.tile = "#";
            currentNode.tile = DirsToTile[currentNode.dir][dir];
        } else {
            currentNode.dir = dir;
            currentNode.size = steps;
        }

        for (let i = 0; i < steps; i++) {
            currentPos = getNewPos(currentPos, dir);

            if (!map[currentPos.y]) {
                map[currentPos.y] = [];
            }

            if (currentPos.y === 0 && currentPos.x === 0) {
                // map[0][0].tile = "#";
                map[0][0].tile = DirsToTile[dir][map[0][0].dir];
            } else {
                map[currentPos.y][currentPos.x] = {
                    ...currentPos,
                    color: input.color,
                    dir,
                    size: steps,
                    tile: DirToTile[dir]
                };
            }

            trenchCount += 1;
            edgeCount1 += 1;
            yMin = Math.min(yMin, currentPos.y);
            xMin = Math.min(xMin, currentPos.x);
            yMax = Math.max(yMax, currentPos.y);
            xMax = Math.max(xMax, currentPos.x);
        }
    }

    return map;
};

const countInside = (map: INode[][]) => {
    let insideCount = 0;

    for (let i = yMin; i < map.length; i++) {
        let crossings = 0;

        for (let j = xMin; j < map[0].length; j++) {
            const node = map[i][j];

            if (node) {
                if (!["-", "F", "7"].includes(node.tile)) {
                    crossings += 1;
                }

                if ([Direction.Right, Direction.Left].includes(node.dir)) {
                    j += node.size - 1;
                }

                continue;
            }

            if (crossings % 2 === 1) {
                insideCount += 1;
            }
        }
    }

    return insideCount;
};

const count1Line = (line: INode[]) => {
    let edgeCount = 0;
    let insideCount = 0;

    for (let i = 0; i < line.length; i++) {
        const node = line[i];

        if (!node) {
            continue;
        }

        if (node.tile === Trench) {
            insideCount += 1;
        } else {
            edgeCount += 1;
        }
    }

    return `${edgeCount},${insideCount},${insideCount + edgeCount}`;
};

const count2Line = (line: IRange[]) => {
    let edgeCount = 0;
    let insideCount = 0;
    let crossings = 0;

    for (let j = 0; j < line.length; j++) {
        const range = line[j];

        edgeCount += range.size;

        if (crossings % 2 === 1) {
            const prevRange = line[j - 1];

            insideCount += range.start - (prevRange.start + prevRange.size);
        }

        // "-", "F", "7"

        if (range.size === 1) {
            crossings += 1;
        } else {
            if (!["-", "F", "7"].includes(range.startTile)) {
                crossings += 1;
            }
            if (!["-", "F", "7"].includes(range.endTile)) {
                crossings += 1;
            }
        }
    }

    return [edgeCount, insideCount];
};

// todo rozdelit na vertikalni a horizontalin
// a kazdy spocitat zvlast
const count2 = (map: IRange[][]) => {
    let edgeCount = 0;
    let insideCount = 0;

    for (let i = yMin - 1; i <= yMax + 1; i++) {
        const line = map[i];

        if (!line) {
            continue;
        }
        //
        // let crossings = 0;
        //
        // for (let j = 0; j < line.length; j++) {
        //     const range = line[j];
        //
        //     edgeCount += range.size;
        //
        //     if (crossings % 2 === 1) {
        //         const prevRange = line[j - 1];
        //
        //         insideCount += range.start - (prevRange.start + prevRange.size);
        //     }
        //
        //     crossings += 1;

        const [lineEdgeCount, lineInsideCount] = count2Line(line);

        edgeCount += lineEdgeCount;
        insideCount += lineInsideCount;
    }

    console.log(edgeCount, insideCount, edgeCount + insideCount);
};

const printMap = (map: INode[][]) => {
    for (let i = shift; i <= yMax; i++) {
        for (let j = xMin; j <= xMax; j++) {
            const node = map[i][j];

            if (!node) {
                process.stdout.write(Empty);
            } else {
                process.stdout.write(node.tile);
            }
        }
        process.stdout.write("\n");
        break;
    }
    process.stdout.write("\n");
};

let yMin = 0;
let yMax = 0;
let xMin = 0;
let xMax = 0;
let shift = -193;

// TODO musim jen spravne ty vertikalni range nedelat tam kde uz je horizontalni
// a jen podle nich nastavit dobrej start/end tilu

const printMapRanges = (map: IRange[][]) => {
    for (let i = shift; i <= yMax; i++) {
        const line = map[i];
        let currentX = xMin;

        for (const range of line) {
            if (range.start > currentX) {
                process.stdout.write(Empty.repeat(range.start - currentX));
            }

            if (range.size > 1) {
                process.stdout.write(range.startTile);
                process.stdout.write(Trench.repeat(range.size - 2));
                process.stdout.write(range.endTile);
            } else {
                process.stdout.write(Trench);
            }


            currentX = range.start + range.size;
        }

        if (currentX < xMax) {
            process.stdout.write(Empty.repeat(xMax - currentX));
        }

        process.stdout.write("\n");
        break;
    }

    process.stdout.write("\n");
};

const mergeRanges = (line: IRange[]) => {
    let i = 0;

    while (i < line.length - 1) {
        const range = { ...line[i] };
        const nextRange = { ...line[i + 1] };

        if (range.start + range.size >= nextRange.start) {
            if (range.start === nextRange.start) {
                range.size = Math.max(range.size, nextRange.size);
            } else {
                range.size = range.size + nextRange.size;
            }

            if (range.size > nextRange.size) {
                // range.startTile = nextRange.endTile;
                range.endTile = nextRange.startTile;
            } else {
                range.startTile = nextRange.startTile;
                // range.endTile = range.startTile;
            }

            line.splice(i, 1, range);
            line.splice(i + 1, 1);
        } else {
            i++;
        }
    }
};

const addRangeIntoLine = (line: IRange[], range: IRange) => {
    // todo tohle asi je pomaly?
    const firstBiggerIndex = line.findIndex(r => r.start > range.start);

    if (firstBiggerIndex >= 0) {
        line.splice(firstBiggerIndex, 0, range);
    } else {
        line.push(range);
    }

    mergeRanges(line);
};

const addRanges = (map: IRange[][], currentPos: IPos, dir: Direction, size: number, previousDir: Direction, prevRange: IRange) => {
    const isHorizontal = [Direction.Left, Direction.Right].includes(dir);
    const startTile = DirsToTile[previousDir][dir];

    if (isHorizontal) {
        let start: number;

        if (dir === Direction.Right) {
            start = currentPos.x;
        } else {
            start = currentPos.x - size;
        }

        const range: IRange = {
            start,
            size,
            startTile: startTile,
            endTile: startTile
        };

        if (!map[currentPos.y]) {
            map[currentPos.y] = [];
        }

        addRangeIntoLine(map[currentPos.y], range);

        xMin = Math.min(xMin, start);
        xMax = Math.max(xMax, range.start + range.size);
    } else {
        let start: number;

        if (dir === Direction.Down) {
            start = currentPos.y;
        } else {
            start = currentPos.y - size;
        }

        const range: IRange = {
            start: currentPos.x,
            size: 1,
            startTile: startTile,
            endTile: startTile
        };

        for (let i = start; i < start + size + 1; i++) {
            if (!map[i]) {
                map[i] = [];
            }
            addRangeIntoLine(map[i], range);
        }

        yMin = Math.min(yMin, start);
        yMax = Math.max(yMax, start + size);
    }
};

// TODO range my nestaci na to abych urcil co je uvnitr
// potrebuju znat jejich konkretni tily, abych to mohl secist
// a nebo to zafloodovat, ale to by snad bylo jeste horsi
const createMap2 = (inputs: IInput[], secondLvl?: boolean) => {
    const firstPos: IPos = {
        x: 0, y: 0
    };
    let currentPos: IPos = { ...firstPos };
    const map: IRange[][] = [];
    let sum = 0;
    let previousDir: Direction = Direction.Up;
    let previousRange: IRange = null;
    let edgesCount = 0;

    for (const input of inputs) {
        let dir: Direction;
        let steps: number;

        if (!secondLvl) {
            steps = input.steps;
            dir = InputDirToDir(input.dir);
        } else {
            const dirIndex = Number(input.color[input.color.length - 1]);

            dir = Dirs[dirIndex];
            steps = parseInt(input.color.slice(1, 6), 16);
            // console.log(input, steps);
            // console.log(map.length);
        }

        // addRanges(map, currentPos, dir, steps, previousDir, previousRange);

        // console.log(`${currentPos.x}, ${currentPos.y}`);

        const newPos = {
            x: currentPos.x + (steps * DirMapping[dir].x),
            y: currentPos.y + (steps * DirMapping[dir].y)
        };

        edgesCount += steps;
        sum += currentPos.x * newPos.y;
        sum -= currentPos.y * newPos.x;

        currentPos = newPos;
        previousDir = dir;
    }

    sum += currentPos.x * firstPos.y;
    sum -= currentPos.y * firstPos.x;

    // LOL
    const area = (sum / 2);
    const picksTheorem = area - (edgesCount / 2) + 1;
    console.log(edgesCount, picksTheorem, edgesCount + picksTheorem);

    return map;
};

console.time();

let edgeCount1 = 0;
let innerCount1 = 0;
let trenchCount = 0;


const inputs = parseInputs(inputLines);

// const map = createMap(inputs, true);
// printMap(map);
// const floodedMap1 = flood({ x: 1, y: 1 }, map);
// printMap(map);
// console.log(edgeCount1, innerCount1, trenchCount);

const mapRanges = createMap2(inputs, true);
// count2(mapRanges);
// printMapRanges(mapRanges);

// console.log(count1Line(map[-193]));
// console.log(count2Line(mapRanges[-193]));

// for (let i = yMin; i < yMax; i++) {
//     const c1 = count1Line(map[i]);
//     const c2 = count2Line(mapRanges[i]);
//
//     if (c1 !== c2) {
//         console.log("error");
//         console.log(i);
//         console.log(c1);
//         console.log(c2);
//     }
// }


// console.log(yMin, xMin, yMax, xMax);


// const insideCount = countInside(map);

// console.log(trenchCount + insideCount);

// rucne najitej index na flooding hehe, malovani style
// console.log(map[yMin + 1].findIndex(node => node?.color))

// printMap(floodedMap);

console.timeEnd();


// TODO
// nejak bych mel asi aplikovat znalosti ze dne kdy se delaly
// ty range ktery navazaovali do dalsich rangu
// TO JE PRESNE ONO OMFG?

// todo todo
// asi bych zkusil z toho udelat range po radcich
// s tim ze kdyz je to vertikalni, tak to je proste range o sirce jedna