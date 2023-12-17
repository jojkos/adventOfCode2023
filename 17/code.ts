import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map = inputLines.map(line => line.split("").map(v => Number(v)));

const printMap = (map: any[][]) => {
    for (const line of map) {
        console.log(line.join(""));
    }

    console.log("\n");
};

interface IPos {
    x: number;
    y: number;
}

interface INode extends IPos {
    // total estimate cost
    f: number;
    // cost from start
    g: number;
    // heuristic estimate
    h: number;
    previous?: INode;
    dir: Direction;
    dirCount: number;
}

const isSameNode = (node1: INode, node2: INode) => {
    return node1.x === node2.x && node1.y === node2.y
        && node1.dir === node2.dir
        && node1.dirCount === node2.dirCount
        && node1.g === node2.g;
};

const heuristic = (a: IPos, b: IPos): number => {
    // Manhattan distance
    const xDiff = Math.abs(a.x - b.x);
    const yDiff = Math.abs(a.y - b.y);
    let sum = xDiff + yDiff;

    // if (xDiff < 3) {
    //     return xDiff
    // }
    //
    // if (yDiff < 3) {
    //     return yDiff
    // }

    return 0;
};

const getKey = (node: INode) => {
    return `${node.x},${node.y},${node.dir}${node.dirCount}`;
};


const aStar = (start: IPos, end: IPos): INode[] => {
    const openSet = new Map();
    const closedSet = new Map();
    let startNode: INode = { ...start, f: 0, g: 0, h: heuristic(start, end), dir: null, dirCount: null };
    let endNode: INode = { ...end, f: 0, g: 0, h: 0, dir: null, dirCount: null };
    openSet.set(getKey(startNode), startNode);

    while (openSet.size > 0) {
        let current = Array.from(openSet.values()).reduce((prev, curr) => (prev.f < curr.f ? prev : curr));
        const currentKey = getKey(current);

        if (current.x === endNode.x && current.y === endNode.y) {
            let path: INode[] = [];
            let temp: INode | undefined = current;
            while (temp) {
                path.push(temp);
                temp = temp.previous;
            }

            return path.reverse();
        }

        openSet.delete(currentKey);
        closedSet.set(currentKey, current);

        let dirs: Direction[];


        if (current.dirCount === 3) {
            dirs = Object.values(Direction);
            if ([Direction.Left, Direction.Right].includes(current.dir)) {
                dirs = [Direction.Up, Direction.Down];
            } else {
                dirs = [Direction.Left, Direction.Right];
            }
        } else {
            dirs = Object.values(Direction);
        }


        for (let direction of Object.values(dirs)) {
            let neighborPos: IPos = {
                x: current.x + DirMapping[direction].x,
                y: current.y + DirMapping[direction].y
            };

            if (isOutside(neighborPos)) {
                continue;
            }

            if (current.dirCount === 1) {
                const currDir = current.dir;

                if (currDir === Direction.Left && direction === Direction.Right
                    || currDir === Direction.Right && direction === Direction.Left
                    || currDir === Direction.Up && direction === Direction.Down
                    || currDir === Direction.Down && direction === Direction.Up)
                    continue;
            }

            const distance = map[neighborPos.y][neighborPos.x];

            let neighbor: INode = {
                ...neighborPos,
                f: 0,
                g: current.g + distance,
                h: heuristic(neighborPos, endNode),
                previous: current,
                dir: direction,
                dirCount: current.dir === direction ? current.dirCount + 1 : 1
            };

            neighbor.f = neighbor.g + neighbor.h;
            const neighborKey = getKey(neighbor);

            if (closedSet.has(neighborKey)) {
                const test = closedSet.get(neighborKey);

                if (test.g > neighbor.g) {
                    console.log("TEST1");
                    closedSet.delete(neighborKey);
                } else {
                    continue;
                }
            }


            if (openSet.has(neighborKey)) {
                const test = openSet.get(neighborKey);

                if (test.g > neighbor.g) {
                    openSet.set(neighborKey, neighbor);
                    console.log("TEST2");
                }
            } else {
                openSet.set(neighborKey, neighbor);
            }
        }
    }

    return [];
};

enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

const DirMapping: Record<Direction, IPos> = {
    [Direction.Up]: { x: 0, y: -1 },
    [Direction.Down]: { x: 0, y: 1 },
    [Direction.Right]: { x: 1, y: 0 },
    [Direction.Left]: { x: -1, y: 0 }
};


const dirToTile = (dir: Direction) => {
    switch (dir) {
        case Direction.Up:
            return "^";
        case Direction.Down:
            return "v";
        case Direction.Left:
            return "<";
        case Direction.Right:
            return ">";

    }
};


const isOutside = (pos: IPos): boolean => {
    return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
};

const clearMap = map.map(line => new Array(line.length).fill(" "));
const Start: IPos = { x: 0, y: 0 };
const End: IPos = { x: map[0].length - 1, y: map.length - 1 };

console.time();
const finalPath = aStar(Start, End);

let sum = 0;

for (let i = 0; i < finalPath.length; i++) {
    if (i !== 0) {
        const node = finalPath[i];
        const val = map[node.y][node.x];

        sum += Number(val);

        // console.log(node.dir)
        // console.log(`${node.y},${node.x}`, node.dir, val, sum);
        clearMap[node.y][node.x] = ".";
    }
}

let testDir: Direction;
let testDirCount = null;
let prevDir: Direction;

for (let i = 0; i < finalPath.length; i++) {
    if (i !== 0) {
        const node = finalPath[i];

        // @ts-ignore
        map[node.y][node.x] = ".";

        if (!testDir) {
            testDir = node.dir;
            testDirCount = 1;
            prevDir = node.dir;
        } else {
            if (prevDir === Direction.Up && node.dir === Direction.Down) {
                console.log("WTF");
            }

            if (testDir === node.dir) {
                testDirCount += 1;

                if (testDirCount > 3) {
                    console.log("FAIL");
                }
            } else {
                testDir = node.dir;
                testDirCount = 1;
            }
        }
    }
}


console.timeEnd();

// console.log("Path:", path);
printMap(map);
console.log(sum);
// console.log(finalPath[finalPath.length - 1].g)