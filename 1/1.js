"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var numberStrings = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
];
var firstNumberRegex = /\d/;
var lastNumberRegex = /\d(?!.*\d)/;
var sum = 0;
var _loop_1 = function (line) {
    var first = null;
    var firstIndex = null;
    var last = null;
    var lastIndex = null;
    var fnUpdateFirst = function (newValue, newIndex) {
        if (newIndex < firstIndex || firstIndex === null) {
            first = newValue;
            firstIndex = newIndex;
        }
    };
    var fnUpdateLast = function (newValue, newIndex) {
        if (newIndex > lastIndex || lastIndex === null) {
            last = newValue;
            lastIndex = newIndex;
        }
    };
    for (var i = 0; i < line.length; i++) {
        var firstNumberMatch = line.match(firstNumberRegex);
        var lastNumberMatch = line.match(lastNumberRegex);
        if (firstNumberMatch) {
            fnUpdateFirst(Number(firstNumberMatch[0]), firstNumberMatch.index);
        }
        if (lastNumberMatch) {
            fnUpdateLast(Number(lastNumberMatch[0]), lastNumberMatch.index);
        }
        for (var j = 0; j < numberStrings.length; j++) {
            var number = j + 1;
            var word = numberStrings[j];
            var firstIndex_1 = line.indexOf(word);
            var lastIndex_1 = line.lastIndexOf(word);
            if (firstIndex_1 >= 0) {
                fnUpdateFirst(number, firstIndex_1);
            }
            if (lastIndex_1 >= 0) {
                fnUpdateLast(number, lastIndex_1);
            }
        }
    }
    if (last === null) {
        last = first;
    }
    sum += Number("".concat(first).concat(last));
};
for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
    var line = inputLines_1[_i];
    _loop_1(line);
}
console.log(sum);
//# sourceMappingURL=1.js.map