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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split("").map(function (v) { return Number(v); }); });
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
    // if (xDiff < 3) {
    //     return xDiff
    // }
    //
    // if (yDiff < 3) {
    //     return yDiff
    // }
    return 0;
};
var getKey = function (node) {
    return "".concat(node.x, ",").concat(node.y, ",").concat(node.dir).concat(node.dirCount);
};
var aStar = function (start, end, minLength, maxLength) {
    if (minLength === void 0) { minLength = 1; }
    if (maxLength === void 0) { maxLength = 3; }
    var openSet = new Map();
    var closedSet = new Map();
    var startNode = __assign(__assign({}, start), { f: 0, g: 0, h: heuristic(start, end), dir: null, dirCount: null });
    var endNode = __assign(__assign({}, end), { f: 0, g: 0, h: 0, dir: null, dirCount: null });
    openSet.set(getKey(startNode), startNode);
    while (openSet.size > 0) {
        var current = Array.from(openSet.values()).reduce(function (prev, curr) { return (prev.f < curr.f ? prev : curr); });
        var currentKey = getKey(current);
        if (current.x === endNode.x && current.y === endNode.y) {
            if (current.dirCount >= minLength) {
                var path = [];
                var temp = current;
                while (temp) {
                    path.push(temp);
                    temp = temp.previous;
                }
                return path.reverse();
            }
        }
        openSet.delete(currentKey);
        closedSet.set(currentKey, current);
        var dirs = void 0;
        if (current.dirCount === maxLength) {
            if ([Direction.Left, Direction.Right].includes(current.dir)) {
                dirs = [Direction.Up, Direction.Down];
            }
            else {
                dirs = [Direction.Left, Direction.Right];
            }
        }
        else if (current.dirCount && current.dirCount < minLength) {
            dirs = [current.dir];
        }
        else {
            dirs = Object.values(Direction);
        }
        for (var _i = 0, _a = Object.values(dirs); _i < _a.length; _i++) {
            var direction = _a[_i];
            var neighborPos = {
                x: current.x + DirMapping[direction].x,
                y: current.y + DirMapping[direction].y
            };
            if (isOutside(neighborPos)) {
                continue;
            }
            var currDir = current.dir;
            if (currDir === Direction.Left && direction === Direction.Right
                || currDir === Direction.Right && direction === Direction.Left
                || currDir === Direction.Up && direction === Direction.Down
                || currDir === Direction.Down && direction === Direction.Up)
                continue;
            var distance = map[neighborPos.y][neighborPos.x];
            var neighbor = __assign(__assign({}, neighborPos), { f: 0, g: current.g + distance, h: heuristic(neighborPos, endNode), previous: current, dir: direction, dirCount: current.dir === direction ? current.dirCount + 1 : 1 });
            neighbor.f = neighbor.g + neighbor.h;
            var neighborKey = getKey(neighbor);
            if (closedSet.has(neighborKey)) {
                var test = closedSet.get(neighborKey);
                if (test.g > neighbor.g) {
                    console.log("TEST1");
                    closedSet.delete(neighborKey);
                }
                else {
                    continue;
                }
            }
            if (openSet.has(neighborKey)) {
                var test = openSet.get(neighborKey);
                if (test.g > neighbor.g) {
                    openSet.set(neighborKey, neighbor);
                    console.log("TEST2");
                }
            }
            else {
                openSet.set(neighborKey, neighbor);
            }
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
};
var isOutside = function (pos) {
    return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
};
var clearMap = map.map(function (line) { return new Array(line.length).fill(" "); });
var Start = { x: 0, y: 0 };
var End = { x: map[0].length - 1, y: map.length - 1 };
console.time();
// const path1 = aStar(Start, End);
var path2 = aStar(Start, End, 4, 10);
for (var i = 0; i < path2.length; i++) {
    if (i !== 0) {
        var node = path2[i];
        // const val = map[node.y][node.x];
        // console.log(node.x, node.y, node.dir, node.dirCount)
        clearMap[node.y][node.x] = ".";
    }
}
for (var i = 0; i < path2.length; i++) {
    if (i !== 0) {
        var node = path2[i];
        // @ts-ignore
        map[node.y][node.x] = ".";
    }
}
console.timeEnd();
// console.log("Path:", path);
// printMap(map);
// console.log(path1[path1.length - 1].g);
console.log(path2[path2.length - 1].g);
//# sourceMappingURL=code.js.map