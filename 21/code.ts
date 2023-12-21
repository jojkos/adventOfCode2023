import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map = inputLines.map(line => line.split("").map(v => v));

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

    return 0;
};

const getKey = (node: INode) => {
    return `${node.x},${node.y}`;
};

function modulo(a: number, b: number): number {
    return ((a % b) + b) % b;
}

const finalFields = new Map();

const aStar = (start: IPos, maxSteps: number): INode[] => {
    const openSet = new Map();
    let startNode: INode = { ...start, f: 0, g: 0, h: heuristic(start, start), dir: null, dirCount: null };
    openSet.set(getKey(startNode), startNode);

    while (openSet.size > 0) {
        let current = Array.from(openSet.values()).reduce((prev, curr) => (prev.f < curr.f ? prev : curr));
        const currentKey = getKey(current);

        openSet.delete(currentKey);

        if (current.g === maxSteps) {
            let path: INode[] = [];
            let temp: INode | undefined = current;
            while (temp) {
                path.push(temp);
                temp = temp.previous;
            }
            finalFields.set(getKey(current), current);
            continue;
        }

        let dirs: Direction[] = Object.values(Direction);


        for (let direction of Object.values(dirs)) {
            let neighborPos: IPos = {
                x: current.x + DirMapping[direction].x,
                y: current.y + DirMapping[direction].y
            };


            const matchingPos = getMatchingPos(neighborPos);
            const val = map[matchingPos.y][matchingPos.x];

            if (val === "#") {
                continue;
            }

            let neighbor: INode = {
                ...neighborPos,
                f: 0,
                g: current.g + 1,
                h: heuristic(neighborPos, neighborPos),
                previous: current,
                dir: direction,
                dirCount: current.dir === direction ? current.dirCount + 1 : 1
            };

            neighbor.f = neighbor.g + neighbor.h;
            const neighborKey = getKey(neighbor);

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

const getMatchingPos = (pos: IPos) => {
    return {
        x: modulo(pos.x, map[0].length),
        y: modulo(pos.y, map.length)
    };
};

let Start: IPos = null;

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === "S") {
            Start = {
                x: j,
                y: i
            };
        }
    }
}

console.time();
const path1 = aStar(Start, 100);

// zjistit pro kazdej bod v ramci mapky
// kolik kroku muzu udelat do bodu v te jedne mapce
// a pak to jen nejak spravne podelit?

console.log(finalFields.size);

// for (const val of Array.from(finalFields.keys())) {
//     console.log(val)
// }

console.timeEnd();
