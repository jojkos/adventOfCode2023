"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split("").map(function (v) { return v; }); });
var Path = ".";
var Forest = "#";
var printMap = function (map) {
    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
        var line = map_1[_i];
        console.log(line.join(""));
    }
    console.log("\n");
};
var isSameNode = function (node1, node2) {
    return node1.x === node2.x && node1.y === node2.y
        && node1.dir === node2.dir
        && node1.dirCount === node2.dirCount
        && node1.g === node2.g;
};
var heuristic = function (a, b) {
    // Manhattan distance
    var xDiff = Math.abs(a.x - b.x);
    var yDiff = Math.abs(a.y - b.y);
    var sum = xDiff + yDiff;
    return 0;
};
var getKey = function (node) {
    return "".concat(node.x, ",").concat(node.y);
};
// const finalPaths: INode[][] = [];
var maxlength = 0;
var aStar = function (start, end) {
    var openSet = [];
    var startNode = __assign(__assign({}, start), { f: 0, g: 0, h: heuristic(start, end), dir: null, dirCount: null, path: new Set() });
    var endNode = __assign(__assign({}, end), { f: 0, g: 0, h: 0, dir: null, dirCount: null, path: new Set() });
    openSet.push(startNode);
    while (openSet.length > 0) {
        var current = openSet.pop(); //Array.from(openSet.values()).reduce((prev, curr) => (prev.f < curr.f ? prev : curr));
        if (current.x === endNode.x && current.y === endNode.y) {
            var path = [];
            var temp = current;
            while (temp) {
                path.push(temp);
                temp = temp.previous;
            }
            var tmp = path.length - 1;
            if (tmp > maxlength) {
                maxlength = tmp;
            }
            console.log(tmp, maxlength);
            // finalPaths.push(path.reverse());
        }
        var dirs = Object.values(Direction);
        for (var _i = 0, _a = Object.values(dirs); _i < _a.length; _i++) {
            var direction = _a[_i];
            var neighborPos = {
                x: current.x + DirMapping[direction].x,
                y: current.y + DirMapping[direction].y
            };
            if (isOutside(neighborPos)) {
                continue;
            }
            var tile = map[neighborPos.y][neighborPos.x];
            if (tile === Forest) {
                continue;
            }
            var neighbor = __assign(__assign({}, neighborPos), { f: 0, g: current.g + 1, h: heuristic(neighborPos, endNode), previous: current, dir: direction, dirCount: current.dir === direction ? current.dirCount + 1 : 1, path: new Set(current.path) });
            neighbor.f = neighbor.g + neighbor.h;
            var neighborKey = getKey(neighbor);
            if (current.path.has(neighborKey)) {
                continue;
            }
            neighbor.path.add(neighborKey);
            openSet.push(neighbor);
        }
    }
    return [];
};
var Direction;
(function (Direction) {
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction || (Direction = {}));
var DirMapping = (_a = {},
    _a[Direction.Up] = { x: 0, y: -1 },
    _a[Direction.Down] = { x: 0, y: 1 },
    _a[Direction.Right] = { x: 1, y: 0 },
    _a[Direction.Left] = { x: -1, y: 0 },
    _a);
var dirToTile = function (dir) {
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
var tileToDir = function (tile) {
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
var isOutside = function (pos) {
    return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
};
var Start = { x: map[0].findIndex(function (val) { return val === Path; }), y: 0 };
var End = { x: map[map.length - 1].findIndex(function (val) { return val === Path; }), y: map.length - 1 };
console.time();
var path1 = aStar(Start, End);
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
console.log(maxlength);
console.timeEnd();
// console.time();
var i = 0;
function longestPath(grid, start, end) {
    var longest = [];
    var stack = [{ x: start.x, y: start.y, path: [start], visited: new Set(["".concat(start.x, ",").concat(start.y)]) }];
    while (stack.length > 0) {
        var node = stack.pop();
        var x = node.x;
        var y = node.y;
        var path = node.path;
        var visited = node.visited;
        i++;
        if (i % 1000 === 0) {
            console.log(stack.length, longest.length);
        }
        // Check if reached end and update longest path
        if (x === end.x && y === end.y && path.length > longest.length) {
            longest = path;
            continue; // Continue searching for a longer path
        }
        // Directions: up, right, down, left
        var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        // console.log(path.length)
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var _a = directions_1[_i], dx = _a[0], dy = _a[1];
            var nx = x + dx;
            var ny = y + dy;
            // Check boundaries and if the next cell is a path and not visited
            if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length &&
                grid[ny][nx] !== Forest && !visited.has("".concat(nx, ",").concat(ny))) {
                var newPath = __spreadArray(__spreadArray([], path, true), [{ x: nx, y: ny }], false);
                var newVisited = new Set(visited);
                newVisited.add("".concat(nx, ",").concat(ny));
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
//# sourceMappingURL=code.js.map