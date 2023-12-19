"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var parseFileIntoLines = function (filePath) {
    return fs.readFileSync(filePath).toString().split("\r\n");
};
var inputLines = parseFileIntoLines("input.txt");
var Unknown = "?";
var Broken = "#";
var Valid = ".";
var parseLines2 = function (lines) {
    var parsedLines = [];
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        var _a = line.split(" "), rangesPart = _a[0], numbersPart = _a[1];
        var numbers = numbersPart.split(",").map(function (v) { return Number(v); });
        parsedLines.push({
            values: rangesPart,
            numbers: numbers
        });
    }
    return parsedLines;
};
var replaceCharInString = function (str, newChar, index) {
    return str.substring(0, index) + newChar + str.substring(index + 1);
};
var replaceAll = function (val, char, newChar) {
    return val.split(char).join(newChar);
};
var checkIfFits = function (values, fit) {
    return values.split(Unknown).join(Broken) === fit;
};
var fixValues = function (previous, next, middle) {
    var fixedPrevious = previous;
    var fixedNext = next;
    if (previous[previous.length - 1] === Unknown) {
        fixedPrevious = replaceCharInString(previous, Valid, previous.length - 1);
    }
    if (next[0] === Unknown) {
        fixedNext = replaceCharInString(next, Valid, 0);
    }
    return [fixedPrevious, fixedNext, middle];
};
var checkInvalidFit = function (values, numbersCount) {
    if (numbersCount === 0) {
        return true;
    }
    var rr = replaceAll(values, Unknown, Valid);
    var brokens = replaceAll(rr, Valid, " ").split(" ").filter(function (v) { return v; }).length;
    return brokens <= numbersCount;
};
function findAllIndexes(str, searchStr) {
    var indexes = [];
    var i = -1;
    while ((i = str.indexOf(searchStr, i + 1)) !== -1) {
        indexes.push(i);
    }
    return indexes;
}
var cache = new Map();
var getFits = function (values, size, numbersCount) {
    var key = "".concat(values, "-").concat(size);
    if (cache.has(key)) {
        return cache.get(key);
    }
    var checkVal = new Array(size).fill(Broken).join("");
    // const preciseFitIndex = findAllIndexes(values, checkVal);
    // if (preciseFitIndex.length > 0) {
    //     const fits = [];
    //
    //     for (const index of preciseFitIndex) {
    //         const previous = values.substring(0, index);
    //         const next = values.substring(index + size, values.length);
    //
    //         return fits.push(fixValues(previous, next, checkVal));
    //     }
    //
    //     return fits;
    // }
    var fits = [];
    for (var i = 0; i < values.length; i += 1) {
        var subStr = values.substring(i, i + size);
        if (checkIfFits(subStr, checkVal) && values[i - 1] !== Broken && values[i + size] !== Broken) {
            var previous = values.substring(0, i);
            var next = values.substring(i + size, values.length);
            var _a = fixValues(previous, next, checkVal), fixedPrevious = _a[0], fixedNext = _a[1], middle = _a[2];
            // tohle actually pomaha!! ale porad mam hromadu failu
            if (checkInvalidFit("".concat(previous).concat(checkVal).concat(next), numbersCount)) {
                fits.push([fixedPrevious, fixedNext, middle]);
            }
        }
    }
    cache.set(key, fits);
    return fits;
};
var count = 0;
var cache2 = new Map();
var dfs = function (line) {
    var key = "".concat(line.values, "-").concat(line.numbers.join(","));
    if (cache2.has(key)) {
        return cache2.get(key);
    }
    count += 1;
    if (line.numbers.length === 0) {
        var rres = [line.values];
        cache2.set(key, rres);
        return rres;
    }
    var max = Math.max.apply(Math, line.numbers);
    var maxIndex = line.numbers.findIndex(function (n) { return n === max; });
    var previous = line.numbers.filter(function (_, i) { return i < maxIndex; });
    var next = line.numbers.filter(function (_, i) { return i > maxIndex; });
    var fits = getFits(line.values, max, line.numbers.length - 1);
    if (line.numbers.length === 1) {
        var rres = fits.map(function (_a) {
            var left = _a[0], right = _a[1], middle = _a[2];
            return "".concat(left).concat(middle).concat(right);
        });
        cache2.set(key, rres);
        return rres;
    }
    var resFits = [];
    for (var _i = 0, fits_1 = fits; _i < fits_1.length; _i++) {
        var _a = fits_1[_i], left = _a[0], right = _a[1], middle = _a[2];
        var leftRes = dfs({
            values: left,
            numbers: previous
        });
        var rightRes = dfs({
            values: right,
            numbers: next
        });
        if (leftRes.length && rightRes.length) {
            for (var _b = 0, leftRes_1 = leftRes; _b < leftRes_1.length; _b++) {
                var leftFit = leftRes_1[_b];
                for (var _c = 0, rightRes_1 = rightRes; _c < rightRes_1.length; _c++) {
                    var rightFit = rightRes_1[_c];
                    resFits.push("".concat(leftFit).concat(middle).concat(rightFit));
                }
            }
        }
    }
    cache2.set(key, resFits);
    return resFits;
};
var allPossibleCounts = function (values) {
    var count = 0;
    for (var _i = 0, _a = replaceAll(values, Unknown, Broken); _i < _a.length; _i++) {
        var c = _a[_i];
        if (c === Broken) {
            count += 1;
        }
    }
    return count;
};
var getFits2 = function (line) {
    var size = line.numbers[0];
    var nextNumber = line.numbers[1];
    var values = line.values;
    var key = "".concat(values, "-").concat(size);
    // if (cache.has(key)) {
    //     return cache.get(key);
    // }
    var allNumbersSum = line.numbers.reduce(function (acc, current) { return acc + current; }, 0);
    var enoughSpaceLeft = allPossibleCounts(line.values) >= allNumbersSum;
    if (!enoughSpaceLeft) {
        cache.set(key, []);
        return [];
    }
    if (line.numbers.length === 0) {
        return [[line.values, ""]];
    }
    var checkVal = new Array(size).fill(Broken).join("");
    // const preciseFitIndex = values.indexOf(checkVal);
    var firstMatchIndex = null;
    var fits = [];
    for (var i = 0; i < values.length; i += 1) {
        // if (nextNumber && firstMatchIndex && i > firstMatchIndex + nextNumber) {
        //     break;
        // }
        var subStr = values.substring(i, i + size);
        if (checkIfFits(subStr, checkVal)) {
            if (values[i - 1] === Broken || values[i + size] === Broken) {
                // lol tohle je hodne dulezitej check, totalne oreze strom
                if (firstMatchIndex) {
                    break;
                }
                else {
                    continue;
                }
            }
            if (!firstMatchIndex) {
                firstMatchIndex = i;
            }
            var previous = values.substring(0, i);
            var next = values.substring(i + size, values.length);
            var _a = fixValues(previous, next, checkVal), fixedPrevious = _a[0], fixedNext = _a[1], middle = _a[2];
            fits.push(["".concat(fixedPrevious).concat(middle), fixedNext]);
        }
    }
    cache2.set(key, fits);
    return fits;
};
var dfs2 = function (initialLine) {
    var stack = [{ line: initialLine, index: 0, prefix: '' }];
    var results = [];
    var key = "".concat(initialLine.values, "-").concat(initialLine.numbers.join(","));
    var _loop_1 = function () {
        var _a = stack.pop(), line = _a.line, index = _a.index, prefix = _a.prefix;
        var lineKey = "".concat(line.values, "-").concat(line.numbers.join(","));
        if (cache2.has(lineKey)) {
            var cachedResults = cache2.get(lineKey).map(function (res) { return prefix + res; });
            results.push.apply(results, cachedResults);
            return "continue";
        }
        if (line.numbers.length === 0) {
            cache2.set(lineKey, [line.values]);
            results.push(prefix + line.values);
            return "continue";
        }
        var fits = getFits2(line);
        if (line.numbers.length === 1) {
            var singleFitResults = fits.map(function (_a) {
                var fitPrefix = _a[0], _ = _a[1];
                return prefix + fitPrefix;
            });
            cache2.set(lineKey, singleFitResults);
            results.push.apply(results, singleFitResults);
            return "continue";
        }
        for (var _i = 0, fits_2 = fits; _i < fits_2.length; _i++) {
            var _b = fits_2[_i], fitPrefix = _b[0], suffix = _b[1];
            stack.push({
                line: { values: suffix, numbers: line.numbers.slice(1) },
                index: index + 1,
                prefix: prefix + fitPrefix
            });
        }
    };
    // if (cache2.has(key)) {
    //     return cache2.get(key);
    // }
    while (stack.length > 0) {
        _loop_1();
    }
    cache2.set(key, results);
    return results;
};
console.time();
var lines = parseLines2(inputLines);
var res1 = 0;
var x = 0;
var failed = 0;
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    x += 1;
    // console.log(x);
    var defString = line.values;
    var defNumbers = __spreadArray([], line.numbers, true);
    // for (let i = 0; i < 4; i++) {
    //     line.values += `?${defString}`;
    //     line.numbers.push(...defNumbers);
    // }
    var res = dfs2(line);
    var valids = 0;
    var numbers = line.numbers.length;
    console.log(res.length);
    valids += res.length;
    res1 += valids;
}
console.timeEnd();
console.log("res:", res1);
console.log("calls:", count);
console.log("fails:", failed);
//# sourceMappingURL=code.js.map