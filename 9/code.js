"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var printRanges = function (ranges) {
    var result = "";
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        result += new Array(i).fill(" ").join("");
        for (var _i = 0, range_1 = range; _i < range_1.length; _i++) {
            var number = range_1[_i];
            result += number;
            result += "  ";
        }
        result += "\n";
    }
    console.log(result);
};
var res1 = 0;
var res2 = 0;
console.time();
for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
    var line = inputLines_1[_i];
    var ranges = [
        line.split(" ").map(function (v) { return Number(v); })
    ];
    // prepare ranges
    while (true) {
        var allZeroes = true;
        var currentRange = ranges[ranges.length - 1];
        var newRange = [];
        for (var i = 0; i < currentRange.length - 1; i++) {
            var v1 = currentRange[i];
            var v2 = currentRange[i + 1];
            var diff = v2 - v1;
            newRange.push(diff);
            if (diff !== 0) {
                allZeroes = false;
            }
        }
        ranges.push(newRange);
        if (allZeroes) {
            newRange.push(0);
            break;
        }
    }
    // add future
    for (var i = ranges.length - 1; i > 0; i--) {
        var r1 = ranges[i];
        var r2 = ranges[i - 1];
        var newVal = r1[r1.length - 1] + r2[r2.length - 1];
        r2.push(newVal);
        if (i === 1) {
            res1 += newVal;
        }
    }
    // add history
    for (var i = ranges.length - 1; i > 0; i--) {
        var r1 = ranges[i];
        var r2 = ranges[i - 1];
        var newVal = r2[0] - r1[0];
        r2.unshift(newVal);
        if (i === 1) {
            res2 += newVal;
        }
    }
    // printRanges(ranges);
}
console.timeEnd();
console.log(res1);
console.log(res2);
//# sourceMappingURL=code.js.map