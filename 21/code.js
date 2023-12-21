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
var map = inputLines.map(function (line) { return line.split("").map(function (v) { return v; }); });
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
function modulo(a, b) {
    return ((a % b) + b) % b;
}
var finalFields = new Map();
var aStar = function (start, maxSteps) {
    var openSet = new Map();
    var startNode = __assign(__assign({}, start), { f: 0, g: 0, h: heuristic(start, start), dir: null, dirCount: null });
    openSet.set(getKey(startNode), startNode);
    while (openSet.size > 0) {
        var current = Array.from(openSet.values()).reduce(function (prev, curr) { return (prev.f < curr.f ? prev : curr); });
        var currentKey = getKey(current);
        openSet.delete(currentKey);
        if (current.g === maxSteps) {
            var path = [];
            var temp = current;
            while (temp) {
                path.push(temp);
                temp = temp.previous;
            }
            finalFields.set(getKey(current), current);
            continue;
        }
        var dirs = Object.values(Direction);
        for (var _i = 0, _a = Object.values(dirs); _i < _a.length; _i++) {
            var direction = _a[_i];
            var neighborPos = {
                x: current.x + DirMapping[direction].x,
                y: current.y + DirMapping[direction].y
            };
            var matchingPos = getMatchingPos(neighborPos);
            var val = map[matchingPos.y][matchingPos.x];
            if (val === "#") {
                continue;
            }
            var neighbor = __assign(__assign({}, neighborPos), { f: 0, g: current.g + 1, h: heuristic(neighborPos, neighborPos), previous: current, dir: direction, dirCount: current.dir === direction ? current.dirCount + 1 : 1 });
            neighbor.f = neighbor.g + neighbor.h;
            var neighborKey = getKey(neighbor);
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
var getMatchingPos = function (pos) {
    return {
        x: modulo(pos.x, map[0].length),
        y: modulo(pos.y, map.length)
    };
};
var Start = null;
for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
        if (map[i][j] === "S") {
            Start = {
                x: j,
                y: i
            };
        }
    }
}
console.time();
var path1 = aStar(Start, 100);
// zjistit pro kazdej bod v ramci mapky
// kolik kroku muzu udelat do bodu v te jedne mapce
// a pak to jen nejak spravne podelit?
console.log(finalFields.size);
// for (const val of Array.from(finalFields.keys())) {
//     console.log(val)
// }
console.timeEnd();
//# sourceMappingURL=code.js.map