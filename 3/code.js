"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var getAdjacentSymbols = function (x, y, lines, isGear) {
    var _a;
    var adjacentSymbols = [];
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            var val = (_a = lines[x + i]) === null || _a === void 0 ? void 0 : _a[y + j];
            if (!val) {
                continue;
            }
            if (!(0, utils_1.isStringNumber)(val) && val !== ".") {
                adjacentSymbols.push({
                    x: x + i, y: y + j,
                    symbol: val
                });
            }
        }
    }
    return adjacentSymbols;
};
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var sum = 0;
var possibleGears = {};
var gearSum = 0;
var currentNumber = "";
var someAdjacentSymbol = false;
var gearSymbols = [];
for (var i = 0; i < inputLines.length; i++) {
    var line = inputLines[i];
    for (var j = 0; j < line.length; j++) {
        var val = line[j];
        var isNumber = (0, utils_1.isStringNumber)(val);
        if (isNumber) {
            currentNumber = "".concat(currentNumber).concat(val);
            var symbols = getAdjacentSymbols(i, j, inputLines);
            var _loop_1 = function (symbol) {
                if (symbol.symbol === "*") {
                    if (!gearSymbols.find(function (s) { return s.x === symbol.x && s.y === symbol.y; })) {
                        gearSymbols.push(symbol);
                    }
                }
            };
            for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
                var symbol = symbols_1[_i];
                _loop_1(symbol);
            }
            someAdjacentSymbol = someAdjacentSymbol || symbols.length > 0;
        }
        else {
            if (currentNumber !== "") {
                if (someAdjacentSymbol) {
                    var parsedValue = Number(currentNumber);
                    sum += parsedValue;
                    if (gearSymbols.length > 0) {
                        for (var _a = 0, gearSymbols_1 = gearSymbols; _a < gearSymbols_1.length; _a++) {
                            var symbol = gearSymbols_1[_a];
                            var key = "".concat(symbol.x).concat(symbol.y);
                            possibleGears[key] = possibleGears[key] || [];
                            possibleGears[key].push(parsedValue);
                        }
                    }
                }
            }
            currentNumber = "";
            someAdjacentSymbol = false;
            gearSymbols = [];
        }
    }
}
console.log(sum);
for (var _b = 0, _c = Object.values(possibleGears); _b < _c.length; _b++) {
    var parts = _c[_b];
    if (parts.length === 2) {
        gearSum += parts[0] * parts[1];
    }
}
console.log(gearSum);
//# sourceMappingURL=code.js.map