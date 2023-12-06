"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var parseValues = function (line) {
    return line.split(":")[1].trim().split(" ").filter(function (v) { return v; }).map(function (v) { return Number(v); });
};
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var times = parseValues(inputLines[0]);
var distances = parseValues(inputLines[1]);
var res1 = 1;
for (var i = 0; i < times.length; i++) {
    var time = times[i];
    var record = distances[i];
    var possibilities = 0;
    for (var j = 0; j < time; j++) {
        var speed = j;
        var distance = (time - speed) * speed;
        if (distance > record) {
            possibilities += 1;
        }
    }
    res1 = res1 * possibilities;
}
console.log(res1);
//# sourceMappingURL=code.js.map