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
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split(""); });
var map2 = inputLines.map(function (line) { return line.split(""); });
var SmallRock = "O";
var HardRock = "#";
var Empty = ".";
var printMap = function (map) {
    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
        var line = map_1[_i];
        console.log(line.join(""));
    }
    console.log("\n");
};
var shakeUp = function (map) {
    var _a, _b;
    var lineLength = map[0].length;
    for (var i = 0; i < lineLength; i++) {
        for (var j = map.length - 1; j >= 2; j--) {
            for (var k = map.length - 1; k >= 1; k--) {
                if (map[k][i] === SmallRock && (((_a = map[k - 1]) === null || _a === void 0 ? void 0 : _a[i]) === Empty || ((_b = map[k - 1]) === null || _b === void 0 ? void 0 : _b[i]) === SmallRock)) {
                    var current = map[k][i];
                    var prev = map[k - 1][i];
                    map[k][i] = prev;
                    map[k - 1][i] = current;
                }
            }
        }
    }
    return map;
};
var shakeDown = function (map) {
    var lineLength = map[0].length;
    for (var i = 0; i < lineLength; i++) {
        for (var j = 0; j < map.length - 1; j++) {
            for (var k = map.length - 1; k > 0; k--) {
                if (map[k][i] === Empty && map[k - 1][i] === SmallRock) {
                    map[k][i] = SmallRock;
                    map[k - 1][i] = Empty;
                }
            }
        }
    }
    return map;
};
var shakeLeft = function (map) {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length - 1; j++) {
            for (var k = 0; k < map[i].length - 1; k++) {
                if (map[i][k] === Empty && map[i][k + 1] === SmallRock) {
                    map[i][k] = SmallRock;
                    map[i][k + 1] = Empty;
                }
            }
        }
    }
    return map;
};
var shakeRight = function (map) {
    for (var i = 0; i < map.length; i++) {
        for (var j = map[i].length - 1; j >= 0; j--) {
            for (var k = map[i].length - 1; k > 0; k--) {
                if (map[i][k] === Empty && map[i][k - 1] === SmallRock) {
                    map[i][k] = SmallRock;
                    map[i][k - 1] = Empty;
                }
            }
        }
    }
    return map;
};
var computeSum = function (map) {
    var lineLength = map[0].length;
    var sum = 0;
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < lineLength; j++) {
            var val = map[i][j];
            if (val === SmallRock) {
                sum += map.length - i;
            }
        }
    }
    return sum;
};
var res1 = 0;
var res2 = 0;
console.time();
var dirs = [shakeUp, shakeLeft, shakeDown, shakeRight];
var N = 1000000000;
var cache = new Map();
function hashStringArray(array) {
    var hash = 5381; // Starting with a specific value
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            var str = array[i][j];
            for (var k = 0; k < str.length; k++) {
                hash = (hash * 33) ^ str.charCodeAt(k);
            }
        }
    }
    return hash >>> 0; // Ensures the hash is a non-negative integer
}
var duplicateMap = function (map) {
    var newMap = [];
    for (var _i = 0, map_2 = map; _i < map_2.length; _i++) {
        var line = map_2[_i];
        newMap.push(__spreadArray([], line, true));
    }
    return newMap;
};
var firstHit = false;
var finish = false;
for (var i = 0; i < N; i++) {
    var hash = hashStringArray(map2);
    var key = "".concat(hash);
    if (cache.has(key)) {
        var _a = cache.get(key), m = _a[0], x = _a[1], s = _a[2];
        map2 = m;
        var range = i - x;
        var target = (N - i) % range + x - 1;
        for (var _i = 0, _b = Array.from(cache.values()); _i < _b.length; _i++) {
            var val = _b[_i];
            if (val[1] === target) {
                res2 = val[2];
                finish = true;
                break;
            }
        }
        console.log(s);
    }
    for (var _c = 0, dirs_1 = dirs; _c < dirs_1.length; _c++) {
        var dir = dirs_1[_c];
        map2 = dir(duplicateMap(map2));
    }
    cache.set(key, [duplicateMap(map2), i, computeSum(map2)]);
    if (finish) {
        break;
    }
}
var firstMap = shakeUp(map);
res1 = computeSum(firstMap);
console.timeEnd();
console.log("res1:", res1);
console.log("res2:", res2);
//# sourceMappingURL=code.js.map