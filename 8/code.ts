import { parseFileIntoLines } from "../utils";

interface INode {
    value: string;
    left: string;
    right: string;
}

const parseNode = (line: string): INode => {
    const [val, nodes] = line.split("=");

    const [l, r] = nodes.replace("(", "").replace(")", "").split(",");

    return {
        value: val.trim(),
        left: l.trim(),
        right: r.trim()
    };
};


const nodes: Record<string, INode> = {};

const inputLines = parseFileIntoLines("input.txt");
const directions = inputLines[0].split("");

for (let i = 2; i < inputLines.length; i++) {
    const node = parseNode(inputLines[i]);

    nodes[node.value] = node;
}

const isEndingNode = (nodeId: string): boolean => {
    return nodeId.endsWith("Z");
};

const cache: Record<string, {
    currentStep: number;
}> = {};


const circleLengths: Record<number, number> = {};

console.time();

// lvl 2
const currentNodes = Object.keys(nodes).filter(node => node.endsWith("A"))
    .map(node => nodes[node]);

const circleCount = currentNodes.length;


let res2 = 0;
let dirIndex = 0;

// LCM from chatgpt
function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function lcmArray(arr) {
    let multiple = arr[0];
    for (let i = 1; i < arr.length; i++) {
        multiple = lcm(multiple, arr[i]);
    }
    return multiple;
}

// Example usage
const numbers = [4, 6, 8];

while (true) {
    res2 += 1;

    const dir = directions[dirIndex] === "L" ? "left" : "right";

    for (let i = 0; i < circleCount; i++) {
        const node = currentNodes[i];
        const newNode = nodes[node[dir]];

        currentNodes[i] = newNode;

        const key = `${newNode.value}-${dirIndex}`;
        const cacheHit = cache[key];

        if (cacheHit) {
            if (!circleLengths[i]) {
                circleLengths[i] = res2 - cacheHit.currentStep;
            }
        } else {
            cache[key] = {
                currentStep: res2
            };
        }
    }

    if (currentNodes.every(node => isEndingNode(node.value))) {
        console.log(currentNodes.map(node => node.value));
        break;
    }

    if (Object.values(circleLengths).length === circleCount) {
        console.log(Object.values(circleLengths));
        res2 = lcmArray(Object.values(circleLengths));
        break;
    }

    dirIndex += 1;

    dirIndex = dirIndex % directions.length;
}

console.log("lvl2:", res2);

// lvl 1
const start = "AAA";
const end = "ZZZ";

let res1 = 0;
let node = nodes[start];
let dirIndex1 = 0;


while (node.value !== end) {
    res1 += 1;

    const dir = directions[dirIndex1] === "L" ? "left" : "right";

    // console.log(node, dir);

    node = nodes[node[dir]];

    dirIndex1 += 1;

    if (dirIndex1 >= directions.length) {
        dirIndex1 = 0;
    }
}

console.timeEnd();

console.log("lvl1: ", res1);