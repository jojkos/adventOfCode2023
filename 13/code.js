"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var parsePatterns = function (lines) {
    var patterns = [];
    var pattern = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line === "") {
            patterns.push(pattern);
            pattern = [];
            continue;
        }
        else {
            pattern.push(line);
        }
    }
    patterns.push(pattern);
    return patterns;
};
var printPattern = function (pattern) {
    for (var _i = 0, pattern_1 = pattern; _i < pattern_1.length; _i++) {
        var line = pattern_1[_i];
        console.log(line);
    }
    console.log("\n");
};
var rotatePattern = function (lines) {
    var rotatedPattern = [];
    for (var i = 0; i < lines[0].length; i++) {
        rotatedPattern.push([]);
    }
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        for (var j = 0; j < line.length; j++) {
            var val = lines[i][j];
            rotatedPattern[line.length - j - 1][i] = val;
        }
    }
    return rotatedPattern.map(function (line) { return line.join(""); });
};
var flipString = function (val) {
    var newString = "";
    for (var i = val.length - 1; i >= 0; i--) {
        newString += val[i];
    }
    return newString;
};
var findVerticalMirrors = function (pattern) {
    var lineLength = pattern[0].length;
    var matching = {};
    for (var i = 0; i < lineLength - 1; i++) {
        matching[i] = null;
    }
    for (var i = 0; i < lineLength - 1; i++) {
        for (var _i = 0, pattern_2 = pattern; _i < pattern_2.length; _i++) {
            var line = pattern_2[_i];
            var range = Math.min(i + 1, line.length - i - 1);
            var leftPart = line.substring(i + 1 - range, i + 1);
            var rightPart = line.substring(i + 1, 1 + i + range);
            if (leftPart === flipString(rightPart)) {
                if (matching[i] !== false) {
                    if (matching[i] === null) {
                        matching[i] = i + 1;
                    }
                    else {
                        matching[i] = Math.min(matching[i], i + 1);
                    }
                    // console.log(leftPart, rightPart);
                }
            }
            else {
                matching[i] = false;
            }
        }
    }
    var vals = [];
    for (var _a = 0, _b = Object.entries(matching); _a < _b.length; _a++) {
        var _c = _b[_a], key = _c[0], value = _c[1];
        if (value) {
            vals.push(value);
        }
    }
    if (vals.length === 0) {
        return [];
    }
    return vals;
};
console.time();
var patterns = parsePatterns(inputLines);
var rotatedPatterns = patterns.map(function (pattern) { return rotatePattern(pattern); });
// solve 1
var res1 = 0;
var res2 = 0;
var isDifferent = function (arr1, arr2) {
    return arr2.some(function (val) { return !arr1.includes(val); });
};
var replaceCharInString = function (str, newChar, index) {
    return str.substring(0, index) + newChar + str.substring(index + 1);
};
var _loop_1 = function (i) {
    var verticalPattern = patterns[i];
    var horizontalPattern = rotatedPatterns[i];
    var verticalMirrors = findVerticalMirrors(verticalPattern);
    var horizontalMirrors = findVerticalMirrors(horizontalPattern);
    for (var _i = 0, verticalMirrors_1 = verticalMirrors; _i < verticalMirrors_1.length; _i++) {
        var val = verticalMirrors_1[_i];
        res1 += (val);
    }
    for (var _a = 0, horizontalMirrors_1 = horizontalMirrors; _a < horizontalMirrors_1.length; _a++) {
        var val = horizontalMirrors_1[_a];
        res1 += (val) * 100;
    }
    var smudgeFound = false;
    for (var x = 0; x < verticalPattern.length; x++) {
        var line = verticalPattern[0];
        for (var y = 0; y < line.length; y++) {
            var oldChar = verticalPattern[x][y];
            var newChar = oldChar === "#" ? "." : "#";
            verticalPattern[x] = replaceCharInString(verticalPattern[x], newChar, y);
            horizontalPattern[line.length - y - 1] = replaceCharInString(horizontalPattern[line.length - y - 1], newChar, x);
            // printPattern(verticalPattern)
            // printPattern(horizontalPattern)
            var newVerticalMirrors = findVerticalMirrors(verticalPattern);
            var nowHorizontalMirrors = findVerticalMirrors(horizontalPattern);
            if ((isDifferent(verticalMirrors, newVerticalMirrors) || isDifferent(horizontalMirrors, nowHorizontalMirrors))
                && (newVerticalMirrors.length || nowHorizontalMirrors.length)) {
                verticalMirrors = newVerticalMirrors.filter(function (v) { return !verticalMirrors.includes(v); });
                horizontalMirrors = nowHorizontalMirrors.filter(function (v) { return !horizontalMirrors.includes(v); });
                smudgeFound = true;
                break;
            }
            verticalPattern[x] = replaceCharInString(verticalPattern[x], oldChar, y);
            horizontalPattern[line.length - y - 1] = replaceCharInString(horizontalPattern[line.length - y - 1], oldChar, x);
        }
        if (smudgeFound) {
            break;
        }
    }
    for (var _b = 0, verticalMirrors_2 = verticalMirrors; _b < verticalMirrors_2.length; _b++) {
        var val = verticalMirrors_2[_b];
        res2 += (val);
    }
    for (var _c = 0, horizontalMirrors_2 = horizontalMirrors; _c < horizontalMirrors_2.length; _c++) {
        var val = horizontalMirrors_2[_c];
        res2 += (val) * 100;
    }
};
for (var i = 0; i < patterns.length; i++) {
    _loop_1(i);
}
console.timeEnd();
console.log("res1:", res1);
console.log("res2:", res2);
//# sourceMappingURL=code.js.map