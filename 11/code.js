"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split(""); });
var Space = ".";
var Galaxy = "#";
var enlargeBy = 999999;
var rowsCount = map.length;
var colCount = map[0].length;
var getEmptyRows = function () {
    var emptyRows = [];
    for (var i = 0; i < rowsCount; i++) {
        var row = map[i];
        if (row.every(function (val) { return val === Space; })) {
            emptyRows.push(i);
        }
    }
    return emptyRows;
};
var getEmptyColumns = function () {
    var emptyColumns = [];
    for (var i = 0; i < colCount; i++) {
        var isAllEmpty = true;
        for (var j = 0; j < rowsCount; j++) {
            if (map[j][i] !== Space) {
                isAllEmpty = false;
                break;
            }
        }
        if (isAllEmpty) {
            emptyColumns.push(i);
        }
    }
    return emptyColumns;
};
var getShortestPath = function (p1, p2) {
    return Math.abs((p1.x - p2.x)) + Math.abs((p1.y - p2.y));
};
var res1 = 0;
console.time();
var emptyRows = getEmptyRows();
var emptyColumns = getEmptyColumns();
var galaxyMap = map.map(function (line, i) { return line.map(function (val, j) { return val === Space ? null : {
    x: i,
    originalX: i,
    y: j,
    originalY: j
}; }).filter(function (v) { return v; }); }).filter(function (line) { return line.some(function (v) { return v; }); });
var galaxies = galaxyMap.flat();
for (var _i = 0, galaxyMap_1 = galaxyMap; _i < galaxyMap_1.length; _i++) {
    var line = galaxyMap_1[_i];
    var sum = 0;
    for (var _a = 0, emptyColumns_1 = emptyColumns; _a < emptyColumns_1.length; _a++) {
        var emptyCol = emptyColumns_1[_a];
        for (var _b = 0, line_1 = line; _b < line_1.length; _b++) {
            var galaxy = line_1[_b];
            if (galaxy.y > emptyCol + sum) {
                galaxy.y += enlargeBy;
            }
        }
        sum += enlargeBy;
    }
}
for (var _c = 0, galaxyMap_2 = galaxyMap; _c < galaxyMap_2.length; _c++) {
    var line = galaxyMap_2[_c];
    var sum = 0;
    for (var _d = 0, emptyRows_1 = emptyRows; _d < emptyRows_1.length; _d++) {
        var emptyRow = emptyRows_1[_d];
        for (var _e = 0, line_2 = line; _e < line_2.length; _e++) {
            var galaxy = line_2[_e];
            if (galaxy.x > emptyRow + sum) {
                galaxy.x += enlargeBy;
            }
        }
        sum += enlargeBy;
    }
}
// console.log(galaxyMap);
for (var i = 0; i < galaxies.length; i++) {
    for (var j = i + 1; j < galaxies.length; j++) {
        var path = getShortestPath(galaxies[i], galaxies[j]);
        res1 += path;
    }
}
console.timeEnd();
console.log(res1);
//# sourceMappingURL=code.js.map