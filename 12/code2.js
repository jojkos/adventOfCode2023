var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Unknown = "?";
var Broken = "#";
var Valid = ".";
var parseLines = function (lines) {
    var parsedLines = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var _a = line.split(" "), rangesPart = _a[0], numbersPart = _a[1];
        var numbers = numbersPart.split(",").map(function (v) { return Number(v); });
        var currentLength = 0;
        var currentType = null;
        var previousType = null;
        var ranges = [];
        for (var i = 0; i < rangesPart.length + 1; i++) {
            var val = rangesPart[i];
            var addOne = 0;
            if (val !== currentType || i === rangesPart.length) {
                // if (i === rangesPart.length - 1) {
                //     if (currentType === val) {
                //         currentLength += 1;
                //     } else {
                //         currentType = val;
                //     }
                // }
                if (currentLength > 0) {
                    ranges.push([currentType, currentLength]);
                }
                previousType = currentType;
                currentType = val;
                currentLength = addOne;
            }
            currentLength += 1;
        }
        parsedLines.push({
            ranges: ranges,
            numbers: numbers
        });
    }
    return parsedLines;
};
var mergeRanges = function (x1, x2, type, ranges) {
    return __spreadArray(__spreadArray(__spreadArray([], ranges.filter(function (_, i) { return i < x1; }), true), [
        [type, ranges[x1][1] + ranges[x2][1]]
    ], false), ranges.filter(function (_, i) { return i > x2; }), true);
};
var splitRanges = function () {
    // potrebuju to?
};
// takes all ranges and merges Unknown with Broken
// and filters out Valid
var getMergedRanges = function (ranges) {
    var mergedRanges = [];
    var rangesDuplicate = __spreadArray([], ranges, true);
    var currentRange = rangesDuplicate.shift();
    while (currentRange) {
        var lastRange = mergedRanges[mergedRanges.length - 1];
        if (lastRange && lastRange[0] !== Valid && currentRange[0] !== Valid) {
            lastRange[1] = lastRange[1] + currentRange[1];
        }
        else {
            mergedRanges.push([
                currentRange[0] === Valid ? Valid : Broken,
                currentRange[1]
            ]);
        }
        currentRange = rangesDuplicate.shift();
    }
    return mergedRanges;
};
var findFits = function (ranges, size) {
    var preciseFitIndex = ranges.findIndex(function (range) { return range[1] === size; });
    if (preciseFitIndex >= 0) {
        var previousRanges = ranges.filter(function (_, i) { return i < preciseFitIndex; });
        var nextRanges = ranges.filter(function (_, i) { return i > preciseFitIndex; });
        var previousRange = previousRanges[previousRanges.length - 1];
        var nextRange = nextRanges[0];
        if (previousRange[0] === Unknown) {
            if (previousRange[1] === 1) {
                previousRange[0] = Valid;
            }
            else {
                previousRanges = __spreadArray(__spreadArray([], previousRanges.slice(0, -1), true), [[Unknown, previousRange[1] - 1], [Valid, 1]], false);
            }
        }
        if (nextRange[0] === Unknown) {
            if (nextRange[1] === 1) {
                nextRange[0] = Valid;
            }
            else {
                nextRanges = __spreadArray([[Valid, 1], [Unknown, nextRange[1] - 1]], nextRanges.slice(1), true);
            }
        }
        return [[previousRanges, nextRanges]];
    }
    // nejdriv zkusim najit kam se to vejde
    // pak to zacnu mergovat
    // az to je hotovy, tak okolni otaznicky musim zmenit na tecku
    // vratim zbylou levou a pravou stranu
    var retVal = [];
    for (var i = 0; i < ranges.length; i++) {
        // musim najit vsechny fity
        // a k nim adekvatni left,right zbytky
        var range = ranges[i];
        if (range[0] === Unknown && range[1] >= size) {
            for (var j = 0; j < range[1]; j += size) {
                var leftRanges = __spreadArray([], ranges.slice(0, i), true);
            }
        }
    }
    return retVal;
};
var dfs = function (line) {
    if (line.numbers.length === 0 || line.ranges.length === 0) {
        return 0;
    }
    var max = Math.max.apply(Math, line.numbers);
    var maxIndex = line.numbers.findIndex(function (n) { return n === max; });
    var previous = line.numbers.filter(function (_, i) { return i < maxIndex; });
    var next = line.numbers.filter(function (_, i) { return i > maxIndex; });
    var _a = findFits(line.ranges, max), left = _a[0], right = _a[1];
    return dfs({
        numbers: previous,
        ranges: []
    }) + dfs({
        numbers: next,
        ranges: []
    });
};
//# sourceMappingURL=code2.js.map