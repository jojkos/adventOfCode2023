import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map = inputLines.map(line => line.split("").map(v => v));

const Path = ".";
const Forest = "#";

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
    path: Set<string>;
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

// const finalPaths: INode[][] = [];

let maxlength = 0;

const aStar = (start: IPos, end: IPos): INode[] => {
    const openSet = [];
    let startNode: INode = {
        ...start,
        f: 0,
        g: 0,
        h: heuristic(start, end),
        dir: null,
        dirCount: null,
        path: new Set()
    };
    let endNode: INode = { ...end, f: 0, g: 0, h: 0, dir: null, dirCount: null, path: new Set() };
    openSet.push(startNode);

    while (openSet.length > 0) {
        let current = openSet.pop();//Array.from(openSet.values()).reduce((prev, curr) => (prev.f < curr.f ? prev : curr));

        if (current.x === endNode.x && current.y === endNode.y) {
            let path: INode[] = [];
            let temp: INode | undefined = current;

            while (temp) {
                path.push(temp);
                temp = temp.previous;
            }

            const tmp = path.length - 1;

            if (tmp > maxlength) {
                maxlength = tmp;
            }

            console.log(tmp, maxlength);

            // finalPaths.push(path.reverse());
        }


        let dirs: Direction[] = Object.values(Direction);

        for (let direction of Object.values(dirs)) {
            let neighborPos: IPos = {
                x: current.x + DirMapping[direction].x,
                y: current.y + DirMapping[direction].y
            };

            if (isOutside(neighborPos)) {
                continue;
            }

            const tile = map[neighborPos.y][neighborPos.x];

            if (tile === Forest) {
                continue;
            }

            let neighbor: INode = {
                ...neighborPos,
                f: 0,
                g: current.g + 1,
                h: heuristic(neighborPos, endNode),
                previous: current,
                dir: direction,
                dirCount: current.dir === direction ? current.dirCount + 1 : 1,
                path: new Set(current.path)
            };

            neighbor.f = neighbor.g + neighbor.h;

            const neighborKey = getKey(neighbor);

            if (current.path.has(neighborKey)) {
                continue;
            }

            neighbor.path.add(neighborKey);
            openSet.push(neighbor);
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

    return null;
};

const tileToDir = (tile: string): Direction => {
    switch (tile) {
        case "^":
            return Direction.Up;
        case "v":
            return Direction.Down;
        case "<":
            return Direction.Left;
        case ">":
            return Direction.Right;

    }

    return null;
};


const isOutside = (pos: IPos): boolean => {
    return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
};

const Start: IPos = { x: map[0].findIndex(val => val === Path), y: 0 };
const End: IPos = { x: map[map.length - 1].findIndex(val => val === Path), y: map.length - 1 };

console.time();

const path1: INode[] = aStar(Start, End);

// printMap(map);

// for (const path of finalPaths.slice(-1)) {
//     const tmpMap = JSON.parse(JSON.stringify(map));
//
//     for (const pos of path) {
//         tmpMap[pos.y][pos.x] = "0";
//     }
//
//     printMap(tmpMap);
// }


// 2294 NOT RIGHT ANSWER

// console.log(path1.length - 1);
console.log(maxlength)


console.timeEnd();

// console.time();

let i = 0;

function longestPath(grid, start, end) {
    let longest = [];
    let stack = [{ x: start.x, y: start.y, path: [start], visited: new Set([`${start.x},${start.y}`]) }];

    while (stack.length > 0) {
        let node = stack.pop();
        let x = node.x;
        let y = node.y;
        let path = node.path;
        let visited = node.visited;

        i++;

        if (i % 1000 === 0) {
            console.log(stack.length, longest.length)
        }

        // Check if reached end and update longest path
        if (x === end.x && y === end.y && path.length > longest.length) {
            longest = path;
            continue; // Continue searching for a longer path
        }

        // Directions: up, right, down, left
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        // console.log(path.length)

        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;

            // Check boundaries and if the next cell is a path and not visited
            if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length &&
                grid[ny][nx] !== Forest && !visited.has(`${nx},${ny}`)) {

                let newPath = [...path, { x: nx, y: ny }];
                let newVisited = new Set(visited);
                newVisited.add(`${nx},${ny}`);

                stack.push({
                    x: nx,
                    y: ny,
                    path: newPath,
                    visited: newVisited
                });
            }
        }
    }

    return longest;
}

// let longest = longestPath(map, Start, End);
// // console.log("Longest Path", longest);
// console.log("Longest Path Length:", longest.length);
//
// console.timeEnd()