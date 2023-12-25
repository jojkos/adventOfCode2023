"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var nodes = {};
for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
    var line = inputLines_1[_i];
    var _a = line.split(":"), leftNodeString = _a[0], rightNodesString = _a[1];
    var leftNodeName = leftNodeString.trim();
    var rightNodesNames = rightNodesString.trim().split(/\s+/).filter(function (n) { return n; });
    var currentNode = void 0;
    if (leftNodeName === "ljl") {
        debugger;
    }
    if (nodes[leftNodeName]) {
        currentNode = nodes[leftNodeName];
    }
    else {
        currentNode = {
            name: leftNodeName,
            nodes: []
        };
        nodes[leftNodeName] = currentNode;
    }
    for (var _b = 0, rightNodesNames_1 = rightNodesNames; _b < rightNodesNames_1.length; _b++) {
        var rightNodeName = rightNodesNames_1[_b];
        if (!currentNode.nodes.includes(rightNodeName)) {
            currentNode.nodes.push(rightNodeName);
        }
    }
    for (var _c = 0, _d = currentNode.nodes; _c < _d.length; _c++) {
        var childNode = _d[_c];
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
var findNode = function (nodeName, originalNodeName) {
    if (originalNodeName === nodeName) {
        return false;
    }
    var node = nodes[nodeName];
};
function countAllNodes(startNodeName, nodes) {
    var visited = new Set();
    function dfs(nodeName) {
        // If the node is already visited, return
        if (visited.has(nodeName)) {
            return;
        }
        // Visit the node
        visited.add(nodeName);
        // Get all connected nodes and visit them
        var node = nodes[nodeName];
        if (node) {
            node.nodes.forEach(function (childName) {
                dfs(childName);
            });
        }
    }
    // Start DFS from the given node
    dfs(startNodeName);
    return visited.size;
}
// Usage
var totalNodes1 = countAllNodes("xjb", nodes); // Replace "startNodeName" with the actual starting node's name
var totalNodes2 = countAllNodes("vgs", nodes); // Replace "startNodeName" with the actual starting node's name
console.log(totalNodes1, totalNodes2, totalNodes1 * totalNodes2);
// 489951 TOO LOW
//# sourceMappingURL=code.js.map