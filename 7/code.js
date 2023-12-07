"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Order = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];
var OrderMap = Object.keys(Order).reduce(function (map, val, index) {
    map[Order[index]] = Order.length - index;
    return map;
}, {});
var HandLength = 5;
var cardsSort = function (card1, card2) {
    return OrderMap[card2] - OrderMap[card1];
};
var parseLine = function (line) {
    var _a = line.split(" "), cards = _a[0], bidString = _a[1];
    var numberOfSameCards = {};
    var numberOfJokers = 0;
    var bid = Number(bidString);
    var characters = cards.split(""); //.sort(cardsSort);
    var sortedCards = characters.join("");
    for (var _i = 0, characters_1 = characters; _i < characters_1.length; _i++) {
        var c = characters_1[_i];
        if (!numberOfSameCards[c]) {
            numberOfSameCards[c] = 0;
        }
        numberOfSameCards[c] += 1;
        if (c === "J") {
            numberOfJokers += 1;
        }
    }
    return {
        cards: sortedCards,
        bid: bid,
        numberOfSameCards: numberOfSameCards,
        numberOfJokers: numberOfJokers
    };
};
var checkIfNSameCards = function (hand, n) {
    var max = HandLength;
    var sum = 0;
    for (var _i = 0, _a = Object.entries(hand.numberOfSameCards); _i < _a.length; _i++) {
        var _b = _a[_i], char = _b[0], val = _b[1];
        if (val === n || (char !== "J" && (hand.numberOfJokers + val === n))) {
            hand.res = "".concat(n, " kind");
            return true;
        }
        sum += val;
    }
    return false;
};
var fiveOfKind = function (hand) {
    return checkIfNSameCards(hand, 5);
};
var fourOfKind = function (hand) {
    return checkIfNSameCards(hand, 4);
};
var fullHouse = function (hand) {
    var vals = Object.values(hand.numberOfSameCards);
    if (vals.includes(3) && vals.includes(2)) {
        hand.res = "fullHouse";
        return true;
    }
    var jokers = hand.numberOfJokers;
    var nonJokerVals = [];
    for (var _i = 0, _a = Object.entries(hand.numberOfSameCards); _i < _a.length; _i++) {
        var _b = _a[_i], char = _b[0], val = _b[1];
        if (char !== "J") {
            nonJokerVals.push(val);
        }
    }
    if ((nonJokerVals.includes(3) && nonJokerVals.includes(1) && jokers === 1)
        || (nonJokerVals.filter(function (v) { return v === 2; }).length === 2 && jokers === 1)
        || (nonJokerVals.includes(2) && nonJokerVals.includes(1) && jokers === 2)
        || (nonJokerVals.includes(2) && jokers === 3)) {
        hand.res = "fullHouse";
        return true;
    }
    return false;
};
var threeOfKind = function (hand) {
    return checkIfNSameCards(hand, 3);
};
var twoPairs = function (hand) {
    if (Object.values(hand.numberOfSameCards).filter(function (val) { return val === 2; }).length === 2) {
        hand.res = "two pairs";
        return true;
    }
    var jokers = hand.numberOfJokers;
    var nonJokerValues = [];
    for (var _i = 0, _a = Object.entries(hand.numberOfSameCards); _i < _a.length; _i++) {
        var _b = _a[_i], char = _b[0], val = _b[1];
        if (char !== "J") {
            nonJokerValues.push(val);
        }
    }
    if ((nonJokerValues.includes(2) && nonJokerValues.includes(1) && jokers === 1)
        || (nonJokerValues.includes(2) && jokers === 2)
        || (nonJokerValues.filter(function (v) { return v === 1; }).length >= 2 && jokers === 2)) {
        hand.res = "two pairs";
        return true;
    }
    return false;
};
var onePair = function (hand) {
    return checkIfNSameCards(hand, 2);
};
var compareHands = function (hand1, hand2) {
    for (var i = 0; i < HandLength; i++) {
        var res1 = OrderMap[hand1.cards[i]];
        var res2 = OrderMap[hand2.cards[i]];
        if (res1 !== res2) {
            return res1 - res2;
        }
    }
    return 0;
};
var checks = [fiveOfKind, fourOfKind, fullHouse, threeOfKind, twoPairs, onePair];
var handsSort = function (a, b) {
    for (var _i = 0, checks_1 = checks; _i < checks_1.length; _i++) {
        var check = checks_1[_i];
        var res1 = check(a);
        var res2 = check(b);
        if (res1 !== res2) {
            if (res1) {
                return 1;
            }
            else {
                return -1;
            }
        }
        if (res1) {
            break;
        }
    }
    return compareHands(a, b);
};
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var res = 0;
console.time();
var hands = inputLines.map(function (line) { return parseLine(line); });
hands.sort(handsSort);
for (var i = 0; i < hands.length; i++) {
    res += (i + 1) * hands[i].bid;
}
console.timeEnd();
console.log(res);
//# sourceMappingURL=code.js.map