"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split(""); });
var Start = "S";
var Ground = ".";
var Pipes = {
    "|": [[1, 0], [-1, 0]],
    "-": [[0, 1], [0, -1]],
    "L": [[0, 1], [-1, 0]],
    "J": [[0, -1], [-1, 1]],
    "7": [[1, 0], [0, -1]],
    "F": [[0, 1], [-1, 0]]
};
var getNext = function (prevCoord, currentCoord) {
    var diff = [currentCoord[0] - prevCoord[0], currentCoord[1] - prevCoord[1]];
    var newPipe = map[currentCoord[0]][currentCoord[1]];
    var nextDiff = [0, 0];
    if (newPipe === "|") {
        if (diff[0] === 1)
            nextDiff = Pipes["|"][0];
        else
            nextDiff = Pipes["|"][1];
    }
    else if (newPipe === "-") {
        if (diff[1] === 1)
            nextDiff = Pipes["-"][0];
        else
            nextDiff = Pipes["-"][1];
    }
    else if (newPipe === "L") {
        if (diff[0] === 1)
            nextDiff = Pipes["L"][0];
        else
            nextDiff = Pipes["L"][1];
    }
    else if (newPipe === "J") {
        if (diff[0] === 1)
            nextDiff = Pipes["J"][0];
        else
            nextDiff = Pipes["J"][1];
    }
    else if (newPipe === "7") {
        if (diff[1] === 1)
            nextDiff = Pipes["7"][0];
        else
            nextDiff = Pipes["7"][1];
    }
    else if (newPipe === "F") {
        if (diff[0] === -1)
            nextDiff = Pipes["F"][0];
        else
            nextDiff = Pipes["F"][0];
    }
    return [currentCoord[0] + nextDiff[0], currentCoord[1] + nextDiff[1]];
};
var findStartCoord = function (map) {
    for (var i = 0; i < map.length; i++) {
        var line = map[i];
        for (var j = 0; j < line.length; j++) {
            var val = line[j];
            if (val === Start) {
                return [i, j];
            }
        }
    }
};
var isSameCoord = function (coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
};
console.time();
// lvl 1
var furthest = 0;
var loopLength = 0;
var start = findStartCoord(map);
var dfs = function (coord, prevCoord, ignoreStart /*, currentDistance: number = 0*/) {
    var pipe = map[coord[0]][coord[1]];
    if (!ignoreStart && isSameCoord(coord, start)) {
        return 1;
    }
    loopLength += 1;
    if (pipe === Ground || !pipe) {
        return 0;
    }
    var newCord = getNext(prevCoord, coord);
    return dfs(newCord, coord /*, currentDistance + 1*/);
};
for (var _i = 0, _a = Object.keys(Pipes); _i < _a.length; _i++) {
    var pipe = _a[_i];
    loopLength = 0;
    map[start[0]][start[1]] = pipe;
    var diff = Pipes[pipe][0];
    var res = dfs(start, [start[0] - diff[0], start[1] - diff[1]], true);
    if (res) {
        console.log(pipe, res);
        break;
    }
}
console.log(loopLength / 2);
console.timeEnd();
// console.log(furthest);
//# sourceMappingURL=code.js.map