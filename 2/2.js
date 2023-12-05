"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var fs = require("fs");
function parseGames(input) {
    var games = [];
    var gameStrings = input.split("Game ").slice(1); // Splitting the input string into individual games
    for (var _i = 0, gameStrings_1 = gameStrings; _i < gameStrings_1.length; _i++) {
        var gameString = gameStrings_1[_i];
        var _a = gameString.split(": ", 2), idStr = _a[0], cubesStr = _a[1];
        var id = parseInt(idStr.trim(), 10);
        var cubeSetsStr = cubesStr.split("; ");
        var cubeSets = cubeSetsStr.map(function (setStr) {
            var counts = { red: 0, green: 0, blue: 0 };
            for (var _i = 0, _a = ["red", "green", "blue"]; _i < _a.length; _i++) {
                var color = _a[_i];
                var regex = new RegExp("\\d+ ".concat(color));
                var match = setStr.match(regex);
                if (match) {
                    var countStr = match[0].split(" ")[0];
                    counts[color] = parseInt(countStr, 10);
                }
            }
            return counts;
        });
        games.push({ id: id, cubeSets: cubeSets });
    }
    return games;
}
// Example usage
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var inputString = fs.readFileSync("input.txt").toString();
var parsedGames = parseGames(inputString);
var Reds = 12;
var Greens = 13;
var Blues = 14;
var firstAnswer = 0;
var secondAnswer = 0;
for (var _i = 0, parsedGames_1 = parsedGames; _i < parsedGames_1.length; _i++) {
    var game = parsedGames_1[_i];
    var possible = true;
    var redMax = 0;
    var greenMax = 0;
    var blueMax = 0;
    for (var _a = 0, _b = game.cubeSets; _a < _b.length; _a++) {
        var cubeSet = _b[_a];
        redMax = Math.max(redMax, cubeSet.red);
        greenMax = Math.max(greenMax, cubeSet.green);
        blueMax = Math.max(blueMax, cubeSet.blue);
        if (cubeSet.red > Reds || cubeSet.green > Greens || cubeSet.blue > Blues) {
            possible = false;
        }
    }
    if (possible) {
        firstAnswer += game.id;
    }
    var result = redMax * greenMax * blueMax;
    secondAnswer += result;
}
console.log(firstAnswer);
console.log(secondAnswer);
//# sourceMappingURL=2.js.map