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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var Empty = ".";
var Trench = "#";
var Direction;
(function (Direction) {
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction || (Direction = {}));
var InputDirToDir = function (inputDir) {
    switch (inputDir) {
        case "U":
            return Direction.Up;
        case "D":
            return Direction.Down;
        case "R":
            return Direction.Right;
        case "L":
            return Direction.Left;
    }
};
var DirMapping = (_a = {},
    _a[Direction.Up] = { x: 0, y: -1 },
    _a[Direction.Down] = { x: 0, y: 1 },
    _a[Direction.Right] = { x: 1, y: 0 },
    _a[Direction.Left] = { x: -1, y: 0 },
    _a);
var posToKey = function (pos) {
    return "".concat(pos.x, ":").concat(pos.y);
};
// const isOutside = (pos: IPos) => {
//     return pos.x < 0 || pos.y < 0 || pos.y >= map.length || pos.x >= map[0].length;
// };
var getNewPos = function (currentPos, dir) {
    var diff = DirMapping[dir];
    return {
        x: currentPos.x + diff.x,
        y: currentPos.y + diff.y
    };
};
var Dirs = [Direction.Right, Direction.Down, Direction.Left, Direction.Up];
// stack instead of recursion
var flood = function (startingPos, map) {
    var _a;
    var openPos = [
        startingPos
    ];
    while (openPos.length) {
        var currentPos = openPos.shift();
        for (var _i = 0, Dirs_1 = Dirs; _i < Dirs_1.length; _i++) {
            var dir = Dirs_1[_i];
            var newPos = getNewPos(currentPos, dir);
            if (!((_a = map[newPos.y]) === null || _a === void 0 ? void 0 : _a[newPos.x])) {
                openPos.push(newPos);
                if (!map[newPos.y]) {
                    map[newPos.y] = [];
                }
                map[newPos.y][newPos.x] = __assign(__assign({}, newPos), { dir: dir, size: 0, color: null, tile: Trench });
                trenchCount += 1;
                innerCount1 += 1;
            }
        }
    }
    return map;
};
var parseInputs = function (inputLines) {
    var inputs = [];
    for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
        var line = inputLines_1[_i];
        var _a = line.split(" "), dir = _a[0], steps = _a[1], color = _a[2];
        inputs.push({
            dir: dir,
            steps: Number(steps),
            color: color.replace("(", "").replace(")", "")
        });
    }
    return inputs;
};
var DirsToTile = (_b = {},
    _b[Direction.Down] = (_c = {},
        _c[Direction.Down] = "|",
        _c[Direction.Right] = "L",
        _c[Direction.Left] = "J",
        _c),
    _b[Direction.Up] = (_d = {},
        _d[Direction.Up] = "|",
        _d[Direction.Right] = "F",
        _d[Direction.Left] = "7",
        _d),
    _b[Direction.Right] = (_e = {},
        _e[Direction.Left] = "-",
        _e[Direction.Up] = "J",
        _e[Direction.Down] = "7",
        _e),
    _b[Direction.Left] = (_f = {},
        _f[Direction.Right] = "-",
        _f[Direction.Up] = "L",
        _f[Direction.Down] = "F",
        _f),
    _b);
var DirToTile = (_g = {},
    _g[Direction.Up] = "|",
    _g[Direction.Down] = "|",
    _g[Direction.Left] = "-",
    _g[Direction.Right] = "-",
    _g);
var createMap = function (inputs, secondLvl) {
    var currentPos = {
        x: 0, y: 0
    };
    var map = [
        [__assign(__assign({}, currentPos), { color: null, dir: Direction.Right, size: 1, tile: "S" })]
    ];
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var input = inputs_1[_i];
        var dir = void 0;
        var steps = void 0;
        if (!secondLvl) {
            steps = input.steps;
            dir = InputDirToDir(input.dir);
        }
        else {
            var dirIndex = Number(input.color[input.color.length - 1]);
            dir = Dirs[dirIndex];
            steps = parseInt(input.color.slice(1, 6), 16);
            console.log(steps);
        }
        var currentNode = map[currentPos.y][currentPos.x];
        if (currentNode.tile !== "S") {
            // currentNode.tile = "#";
            currentNode.tile = DirsToTile[currentNode.dir][dir];
        }
        else {
            currentNode.dir = dir;
            currentNode.size = steps;
        }
        for (var i = 0; i < steps; i++) {
            currentPos = getNewPos(currentPos, dir);
            if (!map[currentPos.y]) {
                map[currentPos.y] = [];
            }
            if (currentPos.y === 0 && currentPos.x === 0) {
                // map[0][0].tile = "#";
                map[0][0].tile = DirsToTile[dir][map[0][0].dir];
            }
            else {
                map[currentPos.y][currentPos.x] = __assign(__assign({}, currentPos), { color: input.color, dir: dir, size: steps, tile: DirToTile[dir] });
            }
            trenchCount += 1;
            edgeCount1 += 1;
            yMin = Math.min(yMin, currentPos.y);
            xMin = Math.min(xMin, currentPos.x);
            yMax = Math.max(yMax, currentPos.y);
            xMax = Math.max(xMax, currentPos.x);
        }
    }
    return map;
};
var countInside = function (map) {
    var insideCount = 0;
    for (var i = yMin; i < map.length; i++) {
        var crossings = 0;
        for (var j = xMin; j < map[0].length; j++) {
            var node = map[i][j];
            if (node) {
                if (!["-", "F", "7"].includes(node.tile)) {
                    crossings += 1;
                }
                if ([Direction.Right, Direction.Left].includes(node.dir)) {
                    j += node.size - 1;
                }
                continue;
            }
            if (crossings % 2 === 1) {
                insideCount += 1;
            }
        }
    }
    return insideCount;
};
var count1Line = function (line) {
    var edgeCount = 0;
    var insideCount = 0;
    for (var i = 0; i < line.length; i++) {
        var node = line[i];
        if (!node) {
            continue;
        }
        if (node.tile === Trench) {
            insideCount += 1;
        }
        else {
            edgeCount += 1;
        }
    }
    return "".concat(edgeCount, ",").concat(insideCount, ",").concat(insideCount + edgeCount);
};
var count2Line = function (line) {
    var edgeCount = 0;
    var insideCount = 0;
    var crossings = 0;
    for (var j = 0; j < line.length; j++) {
        var range = line[j];
        edgeCount += range.size;
        if (crossings % 2 === 1) {
            var prevRange = line[j - 1];
            insideCount += range.start - (prevRange.start + prevRange.size);
        }
        // "-", "F", "7"
        if (range.size === 1) {
            crossings += 1;
        }
        else {
            if (!["-", "F", "7"].includes(range.startTile)) {
                crossings += 1;
            }
            if (!["-", "F", "7"].includes(range.endTile)) {
                crossings += 1;
            }
        }
    }
    return [edgeCount, insideCount];
};
// todo rozdelit na vertikalni a horizontalin
// a kazdy spocitat zvlast
var count2 = function (map) {
    var edgeCount = 0;
    var insideCount = 0;
    for (var i = yMin - 1; i <= yMax + 1; i++) {
        var line = map[i];
        if (!line) {
            continue;
        }
        //
        // let crossings = 0;
        //
        // for (let j = 0; j < line.length; j++) {
        //     const range = line[j];
        //
        //     edgeCount += range.size;
        //
        //     if (crossings % 2 === 1) {
        //         const prevRange = line[j - 1];
        //
        //         insideCount += range.start - (prevRange.start + prevRange.size);
        //     }
        //
        //     crossings += 1;
        var _a = count2Line(line), lineEdgeCount = _a[0], lineInsideCount = _a[1];
        edgeCount += lineEdgeCount;
        insideCount += lineInsideCount;
    }
    console.log(edgeCount, insideCount, edgeCount + insideCount);
};
var printMap = function (map) {
    for (var i = shift; i <= yMax; i++) {
        for (var j = xMin; j <= xMax; j++) {
            var node = map[i][j];
            if (!node) {
                process.stdout.write(Empty);
            }
            else {
                process.stdout.write(node.tile);
            }
        }
        process.stdout.write("\n");
        break;
    }
    process.stdout.write("\n");
};
var yMin = 0;
var yMax = 0;
var xMin = 0;
var xMax = 0;
var shift = -193;
// TODO musim jen spravne ty vertikalni range nedelat tam kde uz je horizontalni
// a jen podle nich nastavit dobrej start/end tilu
var printMapRanges = function (map) {
    for (var i = shift; i <= yMax; i++) {
        var line = map[i];
        var currentX = xMin;
        for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
            var range = line_1[_i];
            if (range.start > currentX) {
                process.stdout.write(Empty.repeat(range.start - currentX));
            }
            if (range.size > 1) {
                process.stdout.write(range.startTile);
                process.stdout.write(Trench.repeat(range.size - 2));
                process.stdout.write(range.endTile);
            }
            else {
                process.stdout.write(Trench);
            }
            currentX = range.start + range.size;
        }
        if (currentX < xMax) {
            process.stdout.write(Empty.repeat(xMax - currentX));
        }
        process.stdout.write("\n");
        break;
    }
    process.stdout.write("\n");
};
var mergeRanges = function (line) {
    var i = 0;
    while (i < line.length - 1) {
        var range = __assign({}, line[i]);
        var nextRange = __assign({}, line[i + 1]);
        if (range.start + range.size >= nextRange.start) {
            if (range.start === nextRange.start) {
                range.size = Math.max(range.size, nextRange.size);
            }
            else {
                range.size = range.size + nextRange.size;
            }
            if (range.size > nextRange.size) {
                // range.startTile = nextRange.endTile;
                range.endTile = nextRange.startTile;
            }
            else {
                range.startTile = nextRange.startTile;
                // range.endTile = range.startTile;
            }
            line.splice(i, 1, range);
            line.splice(i + 1, 1);
        }
        else {
            i++;
        }
    }
};
var addRangeIntoLine = function (line, range) {
    // todo tohle asi je pomaly?
    var firstBiggerIndex = line.findIndex(function (r) { return r.start > range.start; });
    if (firstBiggerIndex >= 0) {
        line.splice(firstBiggerIndex, 0, range);
    }
    else {
        line.push(range);
    }
    mergeRanges(line);
};
var addRanges = function (map, currentPos, dir, size, previousDir, prevRange) {
    var isHorizontal = [Direction.Left, Direction.Right].includes(dir);
    var startTile = DirsToTile[previousDir][dir];
    if (isHorizontal) {
        var start = void 0;
        if (dir === Direction.Right) {
            start = currentPos.x;
        }
        else {
            start = currentPos.x - size;
        }
        var range = {
            start: start,
            size: size,
            startTile: startTile,
            endTile: startTile
        };
        if (!map[currentPos.y]) {
            map[currentPos.y] = [];
        }
        addRangeIntoLine(map[currentPos.y], range);
        xMin = Math.min(xMin, start);
        xMax = Math.max(xMax, range.start + range.size);
    }
    else {
        var start = void 0;
        if (dir === Direction.Down) {
            start = currentPos.y;
        }
        else {
            start = currentPos.y - size;
        }
        var range = {
            start: currentPos.x,
            size: 1,
            startTile: startTile,
            endTile: startTile
        };
        for (var i = start; i < start + size + 1; i++) {
            if (!map[i]) {
                map[i] = [];
            }
            addRangeIntoLine(map[i], range);
        }
        yMin = Math.min(yMin, start);
        yMax = Math.max(yMax, start + size);
    }
};
// TODO range my nestaci na to abych urcil co je uvnitr
// potrebuju znat jejich konkretni tily, abych to mohl secist
// a nebo to zafloodovat, ale to by snad bylo jeste horsi
var createMap2 = function (inputs, secondLvl) {
    var firstPos = {
        x: 0, y: 0
    };
    var currentPos = __assign({}, firstPos);
    var map = [];
    var sum = 0;
    var previousDir = Direction.Up;
    var previousRange = null;
    var edgesCount = 0;
    for (var _i = 0, inputs_2 = inputs; _i < inputs_2.length; _i++) {
        var input = inputs_2[_i];
        var dir = void 0;
        var steps = void 0;
        if (!secondLvl) {
            steps = input.steps;
            dir = InputDirToDir(input.dir);
        }
        else {
            var dirIndex = Number(input.color[input.color.length - 1]);
            dir = Dirs[dirIndex];
            steps = parseInt(input.color.slice(1, 6), 16);
            // console.log(input, steps);
            // console.log(map.length);
        }
        // addRanges(map, currentPos, dir, steps, previousDir, previousRange);
        // console.log(`${currentPos.x}, ${currentPos.y}`);
        var newPos = {
            x: currentPos.x + (steps * DirMapping[dir].x),
            y: currentPos.y + (steps * DirMapping[dir].y)
        };
        edgesCount += steps;
        sum += currentPos.x * newPos.y;
        sum -= currentPos.y * newPos.x;
        currentPos = newPos;
        previousDir = dir;
    }
    sum += currentPos.x * firstPos.y;
    sum -= currentPos.y * firstPos.x;
    // LOL
    var area = (sum / 2);
    var picksTheorem = area - (edgesCount / 2) + 1;
    console.log(edgesCount, picksTheorem, edgesCount + picksTheorem);
    return map;
};
console.time();
var edgeCount1 = 0;
var innerCount1 = 0;
var trenchCount = 0;
var inputs = parseInputs(inputLines);
// const map = createMap(inputs, true);
// printMap(map);
// const floodedMap1 = flood({ x: 1, y: 1 }, map);
// printMap(map);
// console.log(edgeCount1, innerCount1, trenchCount);
var mapRanges = createMap2(inputs, true);
// count2(mapRanges);
// printMapRanges(mapRanges);
// console.log(count1Line(map[-193]));
// console.log(count2Line(mapRanges[-193]));
// for (let i = yMin; i < yMax; i++) {
//     const c1 = count1Line(map[i]);
//     const c2 = count2Line(mapRanges[i]);
//
//     if (c1 !== c2) {
//         console.log("error");
//         console.log(i);
//         console.log(c1);
//         console.log(c2);
//     }
// }
// console.log(yMin, xMin, yMax, xMax);
// const insideCount = countInside(map);
// console.log(trenchCount + insideCount);
// rucne najitej index na flooding hehe, malovani style
// console.log(map[yMin + 1].findIndex(node => node?.color))
// printMap(floodedMap);
console.timeEnd();
// TODO
// nejak bych mel asi aplikovat znalosti ze dne kdy se delaly
// ty range ktery navazaovali do dalsich rangu
// TO JE PRESNE ONO OMFG?
// todo todo
// asi bych zkusil z toho udelat range po radcich
// s tim ze kdyz je to vertikalni, tak to je proste range o sirce jedna
//# sourceMappingURL=code.js.map