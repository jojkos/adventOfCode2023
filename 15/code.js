"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var strings = inputLines[0].split(",");
var lenses = strings.map(function (string) {
    var label;
    var focalLength;
    var operation;
    if (string.includes("-")) {
        var splitted = string.split("-");
        label = splitted[0];
        focalLength = null;
        operation = "-";
    }
    else {
        var splitted = string.split("=");
        label = splitted[0];
        focalLength = Number(splitted[1]);
        operation = "=";
    }
    return {
        label: label,
        focalLength: focalLength,
        operation: operation
    };
});
var boxes = {};
for (var i = 0; i < 256; i++) {
    boxes[i] = [];
}
var res1 = 0;
var res2 = 0;
var hashString = function (val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var c = val[i];
        sum += c.charCodeAt(0);
        sum = sum * 17;
        sum = sum % 256;
    }
    return sum;
};
console.time();
for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
    var string = strings_1[_i];
    res1 += hashString(string);
}
var _loop_1 = function (lense) {
    var boxIndex = hashString(lense.label);
    if (lense.operation === "-") {
        var existingIndex = boxes[boxIndex].findIndex(function (l) { return l.label === lense.label; });
        if (existingIndex >= 0) {
            boxes[boxIndex].splice(existingIndex, 1);
        }
    }
    else {
        var existingIndex = boxes[boxIndex].findIndex(function (l) { return l.label === lense.label; });
        if (existingIndex >= 0) {
            boxes[boxIndex].splice(existingIndex, 1, lense);
        }
        else {
            boxes[boxIndex].push(lense);
        }
    }
};
for (var _a = 0, lenses_1 = lenses; _a < lenses_1.length; _a++) {
    var lense = lenses_1[_a];
    _loop_1(lense);
}
for (var i = 0; i < 256; i++) {
    for (var j = 0; j < boxes[i].length; j++) {
        var lense = boxes[i][j];
        var lenseSum = (i + 1) * (j + 1) * lense.focalLength;
        res2 += lenseSum;
    }
}
console.log(hashString("qp"));
console.timeEnd();
console.log("res1:", res1);
console.log("res1:", res2);
//# sourceMappingURL=code.js.map