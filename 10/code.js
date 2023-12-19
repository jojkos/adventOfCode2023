"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split(""); });
var Start = "S";
var Ground = ".";
var getStartPoint = function () {
    for (var i = 0; i < map.length; i++) {
        var row = map[i];
        for (var j = 0; j < row.length; j++) {
            if (row[j] === Start) {
                return [i, j];
            }
        }
    }
};
var Pipes = {
    "|": [[[-1, 0], [-1, 0]], [[1, 0], [1, 0]]],
    "-": [[[0, 1], [0, 1]], [[0, -1], [0, -1]]],
    "L": [[[1, 0], [0, 1]], [[0, -1], [-1, 0]]],
    "J": [[[1, 0], [0, -1]], [[0, 1], [-1, 0]]],
    "7": [[[0, 1], [1, 0]], [[-1, 0], [0, -1]]],
    "F": [[[-1, 0], [0, 1]], [[0, -1], [1, 0]]]
};
var isSamePoint = function (p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
};
var iterativeDFS = function (startPoint, entryDiff, shape) {
    var stack = [{ point: startPoint, entryDiff: entryDiff }];
    var count = 0;
    var _loop_1 = function () {
        var _a = stack.pop(), point = _a.point, entryDiff_1 = _a.entryDiff;
        var pipe = map[point[0]][point[1]];
        if (!pipe || pipe === Ground) {
            return { value: 0 };
        }
        shape["".concat(point[0], "-").concat(point[1])] = true;
        if (minX == undefined || point[1] < minX) {
            minX = point[1];
        }
        if (maxX == undefined || point[1] > maxX) {
            maxX = point[1];
        }
        if (minY == undefined || point[0] < minY) {
            minY = point[0];
        }
        if (maxY == undefined || point[0] > maxY) {
            maxY = point[0];
        }
        var access = Pipes[pipe].find(function (access) { return isSamePoint(access[0], entryDiff_1); });
        if (!access) {
            return { value: 0 };
        }
        var nextPoint = [point[0] + access[1][0], point[1] + access[1][1]];
        var nextPipe = map[nextPoint[0]][nextPoint[1]];
        if (nextPipe !== Ground && !isSamePoint(nextPoint, startPoint)) {
            stack.push({ point: nextPoint, entryDiff: access[1] });
            count++;
        }
        if (isSamePoint(nextPoint, startPoint)) {
            var a = Pipes[nextPipe].find(function (a) { return isSamePoint(a[0], access[1]); });
            if (!a) {
                return { value: 0 };
            }
        }
    };
    while (stack.length > 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return count;
};
console.time();
var startPoint = getStartPoint();
var result;
var minX, minY, maxX, maxY;
for (var _i = 0, _a = Object.keys(Pipes); _i < _a.length; _i++) {
    var pipe = _a[_i];
    var shape = {};
    map[startPoint[0]][startPoint[1]] = pipe;
    minX = minY = maxX = maxY = null;
    result = iterativeDFS(startPoint, Pipes[pipe][0][0], shape);
    if (result) {
        result += 1;
        console.log(pipe, result, result / 2);
        var numberOfEnclosed = 0;
        for (var i = minY; i < maxY; i++) {
            var crossings = 0;
            for (var j = minX; j < maxX; j++) {
                if (shape["".concat(i, "-").concat(j)]) {
                    var pipe_1 = map[i][j];
                    if (!["-", "F", "7"].includes(pipe_1)) {
                        crossings += 1;
                    }
                    continue;
                }
                if (crossings % 2 === 1) {
                    numberOfEnclosed += 1;
                }
            }
        }
        console.log(numberOfEnclosed);
        break;
    }
}
console.timeEnd();
//# sourceMappingURL=code.js.map