import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");
const map = inputLines.map(line => line.split(""));
let map2 = inputLines.map(line => line.split(""));

const SmallRock = "O";
const HardRock = "#";
const Empty = ".";

const printMap = (map: string[][]) => {
    for (const line of map) {
        console.log(line.join(""));
    }
    console.log("\n");
};

const shakeUp = (map: string[][]) => {
    const lineLength = map[0].length;

    for (let i = 0; i < lineLength; i++) {
        for (let j = map.length - 1; j >= 2; j--) {
            for (let k = map.length - 1; k >= 1; k--) {
                if (map[k][i] === SmallRock && (map[k - 1]?.[i] === Empty || map[k - 1]?.[i] === SmallRock)) {
                    const current = map[k][i];
                    const prev = map[k - 1][i];
                    map[k][i] = prev;
                    map[k - 1][i] = current;
                }
            }
        }
    }

    return map;
};

const shakeDown = (map) => {
    const lineLength = map[0].length;

    for (let i = 0; i < lineLength; i++) {
        for (let j = 0; j < map.length - 1; j++) {
            for (let k = map.length - 1; k > 0; k--) {
                if (map[k][i] === Empty && map[k - 1][i] === SmallRock) {
                    map[k][i] = SmallRock;
                    map[k - 1][i] = Empty;
                }
            }
        }
    }

    return map;
};


const shakeLeft = (map) => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length - 1; j++) {
            for (let k = 0; k < map[i].length - 1; k++) {
                if (map[i][k] === Empty && map[i][k + 1] === SmallRock) {
                    map[i][k] = SmallRock;
                    map[i][k + 1] = Empty;
                }
            }
        }
    }

    return map;
};

const shakeRight = (map) => {
    for (let i = 0; i < map.length; i++) {
        for (let j = map[i].length - 1; j >= 0; j--) {
            for (let k = map[i].length - 1; k > 0; k--) {
                if (map[i][k] === Empty && map[i][k - 1] === SmallRock) {
                    map[i][k] = SmallRock;
                    map[i][k - 1] = Empty;
                }
            }
        }
    }

    return map;
};


const computeSum = (map: string[][]) => {
    const lineLength = map[0].length;
    let sum = 0;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < lineLength; j++) {
            const val = map[i][j];

            if (val === SmallRock) {
                sum += map.length - i;
            }
        }
    }

    return sum;
};

let res1 = 0;
let res2 = 0;

console.time();

const dirs = [shakeUp, shakeLeft, shakeDown, shakeRight];
const N = 1000000000;

const cache = new Map();

function hashStringArray(array) {
    let hash = 5381; // Starting with a specific value

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            let str = array[i][j];
            for (let k = 0; k < str.length; k++) {
                hash = (hash * 33) ^ str.charCodeAt(k);
            }
        }
    }

    return hash >>> 0; // Ensures the hash is a non-negative integer
}


const duplicateMap = (map: string[][]) => {
    const newMap: string[][] = [];

    for (const line of map) {
        newMap.push([...line]);
    }

    return newMap;
};

let firstHit = false;
let finish = false;

for (let i = 0; i < N; i++) {
    const hash = hashStringArray(map2);
    const key = `${hash}`;

    if (cache.has(key)) {
        const [m, x, s] = cache.get(key);
        map2 = m;

        const range = i - x;
        const target = (N - i) % range + x - 1;

        for (const val of Array.from(cache.values())) {
            if (val[1] === target) {
                res2 = val[2];
                finish = true;
                break;
            }
        }

        console.log(s);

    }

    for (const dir of dirs) {
        map2 = dir(duplicateMap(map2));
    }

    cache.set(key, [duplicateMap(map2), i, computeSum(map2)]);

    if (finish) {
        break;
    }
}

const firstMap = shakeUp(map);
res1 = computeSum(firstMap);



console.timeEnd();

console.log(`res1:`, res1);
console.log(`res2:`, res2);