"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var parseNode = function (line) {
    var _a = line.split("="), val = _a[0], nodes = _a[1];
    var _b = nodes.replace("(", "").replace(")", "").split(","), l = _b[0], r = _b[1];
    return {
        value: val.trim(),
        left: l.trim(),
        right: r.trim()
    };
};
var nodes = {};
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var directions = inputLines[0].split("");
for (var i = 2; i < inputLines.length; i++) {
    var node_1 = parseNode(inputLines[i]);
    nodes[node_1.value] = node_1;
}
var isEndingNode = function (nodeId) {
    return nodeId.endsWith("Z");
};
var cache = {};
var circleLengths = {};
console.time();
// lvl 2
var currentNodes = Object.keys(nodes).filter(function (node) { return node.endsWith("A"); })
    .map(function (node) { return nodes[node]; });
var circleCount = currentNodes.length;
var res2 = 0;
var dirIndex = 0;
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
    var multiple = arr[0];
    for (var i = 1; i < arr.length; i++) {
        multiple = lcm(multiple, arr[i]);
    }
    return multiple;
}
// Example usage
var numbers = [4, 6, 8];
while (true) {
    res2 += 1;
    var dir = directions[dirIndex] === "L" ? "left" : "right";
    for (var i = 0; i < circleCount; i++) {
        var node_2 = currentNodes[i];
        var newNode = nodes[node_2[dir]];
        currentNodes[i] = newNode;
        var key = "".concat(newNode.value, "-").concat(dirIndex);
        var cacheHit = cache[key];
        if (cacheHit) {
            if (!circleLengths[i]) {
                circleLengths[i] = res2 - cacheHit.currentStep;
            }
        }
        else {
            cache[key] = {
                currentStep: res2
            };
        }
    }
    if (currentNodes.every(function (node) { return isEndingNode(node.value); })) {
        console.log(currentNodes.map(function (node) { return node.value; }));
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
var start = "AAA";
var end = "ZZZ";
var res1 = 0;
var node = nodes[start];
var dirIndex1 = 0;
while (node.value !== end) {
    res1 += 1;
    var dir = directions[dirIndex1] === "L" ? "left" : "right";
    // console.log(node, dir);
    node = nodes[node[dir]];
    dirIndex1 += 1;
    if (dirIndex1 >= directions.length) {
        dirIndex1 = 0;
    }
}
console.timeEnd();
console.log("lvl1: ", res1);
//# sourceMappingURL=code.js.map