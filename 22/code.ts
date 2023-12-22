import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

interface IPos {
    x: number;
    y: number;
    z: number;
}

interface IBrick {
    name?: string;
    supportedBy: Set<string>;
    supports: Set<string>;
    start: IPos;
    end: IPos;
}

const parseInput = () => {
    const bricks: IBrick[] = [];

    for (const line of inputLines) {
        const [start, end] = line.split("~");

        const [sX, sY, sZ] = start.split(",").map(v => Number(v));
        const [eX, eY, eZ] = end.split(",").map(v => Number(v));

        bricks.push({
            start: {
                x: sX, y: sY, z: sZ
            },
            end: {
                x: eX, y: eY, z: eZ
            },
            supportedBy: new Set(),
            supports: new Set()
        });
    }

    return bricks;
};

const isBetween = (val: number, number1: number, number2: number) => {
    return val >= number1 && val <= number2;
};

const settleBricks = (bricks: IBrick[], brickIndex: number) => {
    const brick = bricks[brickIndex];

    while (brick.start.z > 1 && brick.end.z > 1) {
        let canFall = true;

        for (let b = bricks.length - 1; b >= 0; b--) {
            const lowerBrick = bricks[b];

            if (Math.max(lowerBrick.start.z, lowerBrick.end.z) === Math.min(brick.start.z, brick.end.z) - 1) {
                for (let x = brick.start.x; x <= brick.end.x; x++) {
                    for (let y = brick.start.y; y <= brick.end.y; y++) {
                        if (
                            isBetween(x, lowerBrick.start.x, lowerBrick.end.x)
                            &&
                            isBetween(y, lowerBrick.start.y, lowerBrick.end.y)
                        ) {
                            canFall = false;
                            brick.supportedBy.add(lowerBrick.name);
                            lowerBrick.supports.add(brick.name);
                        }
                    }
                }
            }
        }

        if (!canFall) {
            break;
        } else {
            brick.start.z -= 1;
            brick.end.z -= 1;
        }
    }
};

// const isSupportBrick = (bricks: IBrick[], brickIndex: number) => {
//     const brick = bricks[brickIndex];
//     const brickMaxZ = Math.max(brick.start.z, brick.end.z);
//     const aboveBricks = bricks.filter(b => b.start.z === brickMaxZ || b.end.z === brickMaxZ);
//
//
// }

console.time();

const sortBricks = (b1, b2) => {
    const minZ1 = Math.min(b1.start.z, b1.end.z);
    const minZ2 = Math.min(b2.start.z, b2.end.z);
    return minZ1 - minZ2;
};
const bricks: IBrick[] = parseInput().sort(sortBricks).map((brick, i) => {
    return {
        name: i.toString(), //String.fromCharCode(65 + i),
        ...brick
    };
});

for (let i = 0; i < bricks.length; i++) {
    settleBricks(bricks, i);
}

bricks.sort(sortBricks);

// lvl 1
let canBeDisintegratedCount = 0;

for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    let canBeDisintegrated = true;

    if (brick.supports.size > 0) {
        for (const brickName of Array.from(brick.supports.values())) {
            const supportedBrick = bricks.find(b => b.name === brickName);

            if (supportedBrick.supportedBy.size === 1) {
                canBeDisintegrated = false;
                break;
            }
        }
    }

    if (canBeDisintegrated) {
        canBeDisintegratedCount += 1;
    }
}

console.log(canBeDisintegratedCount);

// lvl 2
let totalCount = 0;

for (let i = 0; i < bricks.length; i++) {
    let count = 0;
    const brick = bricks[i];
    const fallenBricks = new Set<string>();
    const supportedBricksNames = new Set<string>();
    const supportedBricks = bricks.filter(b => Array.from(brick.supports.values()).includes(b.name));

    fallenBricks.add(brick.name);

    while (supportedBricks.length) {
        const currentBrick = supportedBricks.shift();

        let canFall = true;

        for (const name of Array.from(currentBrick.supportedBy.values())) {
            if (!fallenBricks.has(name)) {
                canFall = false;
                break;
            }
        }

        if (canFall) {
            count += 1;
            fallenBricks.add(currentBrick.name);

            for (const bb of bricks.filter(b => Array.from(currentBrick.supports.values()).includes(b.name))) {
                if (!supportedBricksNames.has(bb.name)) {
                    supportedBricks.push(bb);
                    supportedBricksNames.add(bb.name);
                }
            }

        }
    }

    // console.log(`${brick.name}: ${count}`);
    totalCount += count;
}

// 94346 TOO LOW
// 98313 TOO HIGH
// 96356 =

console.log(totalCount);

console.timeEnd();