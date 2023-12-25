import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

interface INode {
    name: string;
    nodes: string[];
}

let nodes: Record<string, INode> = {};

for (const line of inputLines) {
    const [leftNodeString, rightNodesString] = line.split(":");
    const leftNodeName = leftNodeString.trim();
    const rightNodesNames = rightNodesString.trim().split(/\s+/).filter(n => n);
    let currentNode: INode;

    if (leftNodeName === "ljl") {
        debugger
    }

    if (nodes[leftNodeName]) {
        currentNode = nodes[leftNodeName];
    } else {
        currentNode = {
            name: leftNodeName,
            nodes: []
        };

        nodes[leftNodeName] = currentNode;
    }

    for (const rightNodeName of rightNodesNames) {
        if (!currentNode.nodes.includes(rightNodeName)) {
            currentNode.nodes.push(rightNodeName);
        }
    }

    for (const childNode of currentNode.nodes) {
        if (!nodes[childNode]) {
            nodes[childNode] = {
                name: childNode,
                nodes: []
            };
        }

        if (!nodes[childNode].nodes.includes(currentNode.name)) {
            nodes[childNode].nodes.push(currentNode.name);
        }
    }
}


// postup
// (asi) rekurzivne, zkusit najit toho souseda skrz ostatni nody
// pokud ho najde, tak to nneni ono, pokud najde driv znova toho vychoziho, tak to je ono

const findNode = (nodeName: string, originalNodeName: string) => {
    if (originalNodeName === nodeName) {
        return false;
    }

    const node = nodes[nodeName];
};


function countAllNodes(startNodeName: string, nodes: Record<string, INode>): number {
    let visited: Set<string> = new Set();

    function dfs(nodeName: string) {
        // If the node is already visited, return
        if (visited.has(nodeName)) {
            return;
        }

        // Visit the node
        visited.add(nodeName);

        // Get all connected nodes and visit them
        const node = nodes[nodeName];

        if (node) {
            node.nodes.forEach(childName => {
                dfs(childName);
            });
        }
    }

    // Start DFS from the given node
    dfs(startNodeName);

    return visited.size;
}

// Usage
const totalNodes1 = countAllNodes("xjb", nodes); // Replace "startNodeName" with the actual starting node's name
const totalNodes2 = countAllNodes("vgs", nodes); // Replace "startNodeName" with the actual starting node's name

console.log(totalNodes1, totalNodes2, totalNodes1 * totalNodes2);

// 489951 TOO LOW