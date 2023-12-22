"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var parseInput = function () {
    var bricks = [];
    for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
        var line = inputLines_1[_i];
        var _a = line.split("~"), start = _a[0], end = _a[1];
        var _b = start.split(",").map(function (v) { return Number(v); }), sX = _b[0], sY = _b[1], sZ = _b[2];
        var _c = end.split(",").map(function (v) { return Number(v); }), eX = _c[0], eY = _c[1], eZ = _c[2];
        bricks.push({
            start: {
                x: sX, y: sY, z: sZ
            },
            end: {
                x: eX, y: eY, z: eZ
            },
            supportedBy: new Set(),
            supports: new Set()
        });
    }
    return bricks;
};
var isBetween = function (val, number1, number2) {
    return val >= number1 && val <= number2;
};
var settleBricks = function (bricks, brickIndex) {
    var brick = bricks[brickIndex];
    while (brick.start.z > 1 && brick.end.z > 1) {
        var canFall = true;
        for (var b = bricks.length - 1; b >= 0; b--) {
            var lowerBrick = bricks[b];
            if (Math.max(lowerBrick.start.z, lowerBrick.end.z) === Math.min(brick.start.z, brick.end.z) - 1) {
                for (var x = brick.start.x; x <= brick.end.x; x++) {
                    for (var y = brick.start.y; y <= brick.end.y; y++) {
                        if (isBetween(x, lowerBrick.start.x, lowerBrick.end.x)
                            &&
                                isBetween(y, lowerBrick.start.y, lowerBrick.end.y)) {
                            canFall = false;
                            brick.supportedBy.add(lowerBrick.name);
                            lowerBrick.supports.add(brick.name);
                        }
                    }
                }
            }
        }
        if (!canFall) {
            break;
        }
        else {
            brick.start.z -= 1;
            brick.end.z -= 1;
        }
    }
};
// const isSupportBrick = (bricks: IBrick[], brickIndex: number) => {
//     const brick = bricks[brickIndex];
//     const brickMaxZ = Math.max(brick.start.z, brick.end.z);
//     const aboveBricks = bricks.filter(b => b.start.z === brickMaxZ || b.end.z === brickMaxZ);
//
//
// }
console.time();
var sortBricks = function (b1, b2) {
    var minZ1 = Math.min(b1.start.z, b1.end.z);
    var minZ2 = Math.min(b2.start.z, b2.end.z);
    return minZ1 - minZ2;
};
var bricks = parseInput().sort(sortBricks).map(function (brick, i) {
    return __assign({ name: i.toString() }, brick);
});
for (var i = 0; i < bricks.length; i++) {
    settleBricks(bricks, i);
}
bricks.sort(sortBricks);
// lvl 1
var canBeDisintegratedCount = 0;
for (var i = 0; i < bricks.length; i++) {
    var brick = bricks[i];
    var canBeDisintegrated = true;
    if (brick.supports.size > 0) {
        var _loop_1 = function (brickName) {
            var supportedBrick = bricks.find(function (b) { return b.name === brickName; });
            if (supportedBrick.supportedBy.size === 1) {
                canBeDisintegrated = false;
                return "break";
            }
        };
        for (var _i = 0, _a = Array.from(brick.supports.values()); _i < _a.length; _i++) {
            var brickName = _a[_i];
            var state_1 = _loop_1(brickName);
            if (state_1 === "break")
                break;
        }
    }
    if (canBeDisintegrated) {
        canBeDisintegratedCount += 1;
    }
}
console.log(canBeDisintegratedCount);
// lvl 2
var totalCount = 0;
var _loop_2 = function (i) {
    var count = 0;
    var brick = bricks[i];
    var fallenBricks = new Set();
    var supportedBricksNames = new Set();
    var supportedBricks = bricks.filter(function (b) { return Array.from(brick.supports.values()).includes(b.name); });
    fallenBricks.add(brick.name);
    var _loop_3 = function () {
        var currentBrick = supportedBricks.shift();
        var canFall = true;
        for (var _b = 0, _c = Array.from(currentBrick.supportedBy.values()); _b < _c.length; _b++) {
            var name_1 = _c[_b];
            if (!fallenBricks.has(name_1)) {
                canFall = false;
                break;
            }
        }
        if (canFall) {
            count += 1;
            fallenBricks.add(currentBrick.name);
            for (var _d = 0, _e = bricks.filter(function (b) { return Array.from(currentBrick.supports.values()).includes(b.name); }); _d < _e.length; _d++) {
                var bb = _e[_d];
                if (!supportedBricksNames.has(bb.name)) {
                    supportedBricks.push(bb);
                    supportedBricksNames.add(bb.name);
                }
            }
        }
    };
    while (supportedBricks.length) {
        _loop_3();
    }
    // console.log(`${brick.name}: ${count}`);
    totalCount += count;
};
for (var i = 0; i < bricks.length; i++) {
    _loop_2(i);
}
// 94346 TOO LOW
// 98313 TOO HIGH
// 96356 =
console.log(totalCount);
console.timeEnd();
//# sourceMappingURL=code.js.map