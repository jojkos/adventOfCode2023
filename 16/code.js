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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var map = inputLines.map(function (line) { return line.split(""); });
var Empty = ".";
var Direction;
(function (Direction) {
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction || (Direction = {}));
var DirMapping = (_a = {},
    _a[Direction.Up] = { x: 0, y: -1 },
    _a[Direction.Down] = { x: 0, y: 1 },
    _a[Direction.Right] = { x: 1, y: 0 },
    _a[Direction.Left] = { x: -1, y: 0 },
    _a);
// for each type of tile,
// for each dir it could be accessed from,
// next direction
var ValToDir = {
    ".": (_b = {},
        _b[Direction.Up] = Direction.Up,
        _b[Direction.Down] = Direction.Down,
        _b[Direction.Right] = Direction.Right,
        _b[Direction.Left] = Direction.Left,
        _b),
    "|": (_c = {},
        _c[Direction.Up] = Direction.Up,
        _c[Direction.Down] = Direction.Down,
        _c[Direction.Right] = [Direction.Down, Direction.Up],
        _c[Direction.Left] = [Direction.Down, Direction.Up],
        _c),
    "-": (_d = {},
        _d[Direction.Up] = [Direction.Left, Direction.Right],
        _d[Direction.Down] = [Direction.Left, Direction.Right],
        _d[Direction.Right] = Direction.Right,
        _d[Direction.Left] = Direction.Left,
        _d),
    "/": (_e = {},
        _e[Direction.Up] = Direction.Right,
        _e[Direction.Down] = Direction.Left,
        _e[Direction.Right] = Direction.Up,
        _e[Direction.Left] = Direction.Down,
        _e),
    "\\": (_f = {},
        _f[Direction.Up] = Direction.Left,
        _f[Direction.Down] = Direction.Right,
        _f[Direction.Right] = Direction.Down,
        _f[Direction.Left] = Direction.Up,
        _f)
};
var getTileFromPos = function (pos) {
    return map[pos.y][pos.x];
};
var posToKey = function (pos) {
    return "".concat(pos.y, ":").concat(pos.x);
};
var posAndDirToKey = function (pos, dir) {
    return "".concat(pos.y, ":").concat(pos.x, "-").concat(dir);
};
var getNextPosAndDir = function (currentPos, currentDir) {
    var currentTile = getTileFromPos(currentPos);
    var nextDir = ValToDir[currentTile][currentDir];
    if (Array.isArray(nextDir)) {
        var res = [];
        for (var i = 0; i < nextDir.length; i++) {
            var dir = nextDir[i];
            var nextPos = {
                x: currentPos.x + DirMapping[dir].x,
                y: currentPos.y + DirMapping[dir].y
            };
            res.push({
                pos: nextPos,
                dir: dir
            });
        }
        return res;
    }
    else {
        var nextPos = {
            x: currentPos.x + DirMapping[nextDir].x,
            y: currentPos.y + DirMapping[nextDir].y
        };
        return {
            pos: nextPos,
            dir: nextDir
        };
    }
};
var isOutside = function (pos) {
    return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
};
var res1 = 0;
var res2 = 0;
console.time();
var starters = [];
for (var i = 0; i < map[0].length; i++) {
    starters.push({
        pos: { y: 0, x: i },
        dir: Direction.Down
    });
    starters.push({
        pos: { y: map.length - 1, x: i },
        dir: Direction.Up
    });
}
for (var i = 0; i < map.length; i++) {
    starters.push({
        pos: { y: i, x: 0 },
        dir: Direction.Right
    });
    starters.push({
        pos: { y: i, x: map[0].length - 1 },
        dir: Direction.Left
    });
}
for (var _i = 0, starters_1 = starters; _i < starters_1.length; _i++) {
    var start = starters_1[_i];
    var energized = {};
    var beamsCycleCache = {};
    var beams = [];
    var maxId = 1;
    var beam = __assign(__assign({}, start), { id: maxId });
    while (beam) {
        // console.log(`${beam.id}:`,beam.pos, beam.dir);
        if (isOutside(beam.pos) || beamsCycleCache[posAndDirToKey(beam.pos, beam.dir)]) {
            // console.log("end:", beam.id);
            beam = beams.shift();
            continue;
        }
        beamsCycleCache[posAndDirToKey(beam.pos, beam.dir)] = true;
        energized[posToKey(beam.pos)] = true;
        var next = getNextPosAndDir(beam.pos, beam.dir);
        if (Array.isArray(next)) {
            var first = next[0], second = next[1];
            beam.pos = first.pos;
            beam.dir = first.dir;
            maxId += 1;
            if (!isOutside(second.pos)) {
                beams.push({
                    id: maxId,
                    pos: second.pos,
                    dir: second.dir
                });
            }
        }
        else {
            beam.pos = next.pos;
            beam.dir = next.dir;
        }
    }
    var energy = Object.keys(energized).length;
    if (energy > res2) {
        res2 = energy;
    }
}
console.timeEnd();
// console.log(`res1:`, Object.keys(energized).length);
console.log(res2);
//# sourceMappingURL=code.js.map