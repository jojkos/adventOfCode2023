import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map = inputLines.map(line => line.split(""));

const Empty = ".";

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

const DirMapping: Record<Direction, IPos> = {
    [Direction.Up]: { x: 0, y: -1 },
    [Direction.Down]: { x: 0, y: 1 },
    [Direction.Right]: { x: 1, y: 0 },
    [Direction.Left]: { x: -1, y: 0 }
};

// for each type of tile,
// for each dir it could be accessed from,
// next direction
const ValToDir = {
    ".": {
        [Direction.Up]: Direction.Up,
        [Direction.Down]: Direction.Down,
        [Direction.Right]: Direction.Right,
        [Direction.Left]: Direction.Left
    },
    "|": {
        [Direction.Up]: Direction.Up,
        [Direction.Down]: Direction.Down,
        [Direction.Right]: [Direction.Down, Direction.Up],
        [Direction.Left]: [Direction.Down, Direction.Up]
    },
    "-": {
        [Direction.Up]: [Direction.Left, Direction.Right],
        [Direction.Down]: [Direction.Left, Direction.Right],
        [Direction.Right]: Direction.Right,
        [Direction.Left]: Direction.Left
    },
    "/": {
        [Direction.Up]: Direction.Right,
        [Direction.Down]: Direction.Left,
        [Direction.Right]: Direction.Up,
        [Direction.Left]: Direction.Down
    },
    "\\": {
        [Direction.Up]: Direction.Left,
        [Direction.Down]: Direction.Right,
        [Direction.Right]: Direction.Down,
        [Direction.Left]: Direction.Up
    }
};

const getTileFromPos = (pos: IPos) => {
    return map[pos.y][pos.x];
};
const posToKey = (pos: IPos) => {
    return `${pos.y}:${pos.x}`;
};
const posAndDirToKey = (pos: IPos, dir: Direction) => {
    return `${pos.y}:${pos.x}-${dir}`;
};
const getNextPosAndDir = (currentPos: IPos, currentDir: Direction) => {
    const currentTile = getTileFromPos(currentPos);
    const nextDir = ValToDir[currentTile][currentDir];


    if (Array.isArray(nextDir)) {
        const res = [];

        for (let i = 0; i < nextDir.length; i++) {
            const dir = nextDir[i];
            const nextPos = {
                x: currentPos.x + DirMapping[dir].x,
                y: currentPos.y + DirMapping[dir].y
            };

            res.push({
                pos: nextPos,
                dir: dir
            });
        }
        return res;
    } else {
        const nextPos = {
            x: currentPos.x + DirMapping[nextDir].x,
            y: currentPos.y + DirMapping[nextDir].y
        };

        return {
            pos: nextPos,
            dir: nextDir
        };
    }

};
const isOutside = (pos: IPos) => {
    return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
};


let res1 = 0;
let res2 = 0;

console.time();

type TBeam = { id: number, pos: IPos, dir: Direction };

const starters: { pos: IPos, dir: Direction }[] = [];

for (let i = 0; i < map[0].length; i++) {
    starters.push({
        pos: { y: 0, x: i },
        dir: Direction.Down
    });
    starters.push({
        pos: { y: map.length - 1, x: i },
        dir: Direction.Up
    });
}

for (let i = 0; i < map.length; i++) {
    starters.push({
        pos: { y: i, x: 0 },
        dir: Direction.Right
    });
    starters.push({
        pos: { y: i, x: map[0].length - 1 },
        dir: Direction.Left
    });
}

for (const start of starters) {
    const energized: Record<string, boolean> = {};
    const beamsCycleCache: Record<string, boolean> = {};

    const beams: TBeam[] = [];
    let maxId = 1;
    let beam: TBeam = { ...start, id: maxId };

    while (beam) {
        // console.log(`${beam.id}:`,beam.pos, beam.dir);

        if (isOutside(beam.pos) || beamsCycleCache[posAndDirToKey(beam.pos, beam.dir)]) {
            // console.log("end:", beam.id);
            beam = beams.shift();
            continue;
        }

        beamsCycleCache[posAndDirToKey(beam.pos, beam.dir)] = true;
        energized[posToKey(beam.pos)] = true;

        const next = getNextPosAndDir(beam.pos, beam.dir);

        if (Array.isArray(next)) {
            const [first, second] = next;

            beam.pos = first.pos;
            beam.dir = first.dir;

            maxId += 1;

            if (!isOutside(second.pos)) {
                beams.push({
                    id: maxId,
                    pos: second.pos,
                    dir: second.dir
                });
            }

        } else {
            beam.pos = next.pos;
            beam.dir = next.dir;
        }
    }

    const energy = Object.keys(energized).length;

    if (energy > res2) {
        res2 = energy;
    }
}

console.timeEnd();

// console.log(`res1:`, Object.keys(energized).length);
console.log(res2);

