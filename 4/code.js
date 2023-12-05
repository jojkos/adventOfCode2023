"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var prepareNumbers = function (numbers) {
    return numbers.trim().split(" ").filter(function (v) { return v; }).map(function (v) { return Number(v); });
};
var parseCard = function (line) {
    var split = line.split(":")[1].split("|");
    return {
        winningNumbers: prepareNumbers(split[0]),
        numbers: prepareNumbers(split[1])
    };
};
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var cards = inputLines.map(function (line) { return parseCard(line); });
var sum = 0;
var sumScratchcards = 0;
var getMatches = (0, utils_1.memoize)(function (card) {
    var matches = 0;
    for (var _i = 0, _a = card.numbers; _i < _a.length; _i++) {
        var number = _a[_i];
        if (card.winningNumbers.includes(number)) {
            matches += 1;
        }
    }
    return matches;
});
var processCard = function (card, index) {
    sumScratchcards += 1;
    var matches = getMatches(card);
    if (matches > 0) {
        for (var j = index + 1; j <= index + matches; j++) {
            processCard(cards[j], j);
        }
    }
};
for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var matches = getMatches(card);
    if (matches !== 0) {
        sum += Math.pow(2, matches - 1);
    }
    // PART 2
    processCard(card, i);
}
console.log(sum);
console.log(sumScratchcards);
//# sourceMappingURL=code.js.map