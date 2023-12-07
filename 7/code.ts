import { parseFileIntoLines } from "../utils";

interface IHand {
    cards: string;
    bid: number;
    numberOfSameCards: Record<string, number>;
    numberOfJokers: number;
    res?: any;
}

const Order = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];
const OrderMap = Object.keys(Order).reduce((map, val, index) => {
    map[Order[index]] = Order.length - index;

    return map;
}, {});
const HandLength = 5;

const cardsSort = (card1: string, card2: string): number => {
    return OrderMap[card2] - OrderMap[card1];
};

const parseLine = (line: string): IHand => {
    const [cards, bidString] = line.split(" ");
    const numberOfSameCards: Record<string, number> = {};
    let numberOfJokers = 0;

    const bid = Number(bidString);
    const characters = cards.split("");//.sort(cardsSort);
    const sortedCards = characters.join("");

    for (const c of characters) {
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
        bid,
        numberOfSameCards,
        numberOfJokers
    };
};

const checkIfNSameCards = (hand: IHand, n: number): boolean => {
    const max = HandLength;
    let sum = 0;

    for (const [char, val] of Object.entries(hand.numberOfSameCards)) {
        if (val === n || (char !== "J" && (hand.numberOfJokers + val === n))) {
            hand.res = `${n} kind`;
            return true;
        }

        sum += val;
    }

    return false;
};

const fiveOfKind = (hand: IHand): boolean => {
    return checkIfNSameCards(hand, 5);
};

const fourOfKind = (hand: IHand): boolean => {
    return checkIfNSameCards(hand, 4);
};

const fullHouse = (hand: IHand): boolean => {
    const vals = Object.values(hand.numberOfSameCards);

    if (vals.includes(3) && vals.includes(2)) {
        hand.res = "fullHouse";
        return true;
    }

    const jokers = hand.numberOfJokers;
    const nonJokerVals = [];

    for (const [char, val] of Object.entries(hand.numberOfSameCards)) {
        if (char !== "J") {
            nonJokerVals.push(val);
        }
    }

    if ((nonJokerVals.includes(3) && nonJokerVals.includes(1) && jokers === 1)
        || (nonJokerVals.filter(v => v === 2).length === 2 && jokers === 1)
        || (nonJokerVals.includes(2) && nonJokerVals.includes(1) && jokers === 2)
        || (nonJokerVals.includes(2) && jokers === 3)) {
        hand.res = "fullHouse";
        return true;
    }

    return false;
};

const threeOfKind = (hand: IHand): boolean => {
    return checkIfNSameCards(hand, 3);
};

const twoPairs = (hand: IHand): boolean => {
    if (Object.values(hand.numberOfSameCards).filter(val => val === 2).length === 2) {
        hand.res = "two pairs";
        return true;
    }

    const jokers = hand.numberOfJokers;
    const nonJokerValues = [];

    for (const [char, val] of Object.entries(hand.numberOfSameCards)) {
        if (char !== "J") {
            nonJokerValues.push(val);
        }
    }

    if ((nonJokerValues.includes(2) && nonJokerValues.includes(1) && jokers === 1)
        || (nonJokerValues.includes(2) && jokers === 2)
        || (nonJokerValues.filter(v => v === 1).length >= 2 && jokers === 2)) {
        hand.res = "two pairs";
        return true;
    }


    return false;
};

const onePair = (hand: IHand): boolean => {
    return checkIfNSameCards(hand, 2);
};

const compareHands = (hand1: IHand, hand2: IHand): number => {
    for (let i = 0; i < HandLength; i++) {
        const res1 = OrderMap[hand1.cards[i]];
        const res2 = OrderMap[hand2.cards[i]];

        if (res1 !== res2) {
            return res1 - res2;
        }
    }

    return 0;
};

const checks = [fiveOfKind, fourOfKind, fullHouse, threeOfKind, twoPairs, onePair];

const handsSort = (a: IHand, b: IHand): number => {
    for (const check of checks) {
        const res1 = check(a);
        const res2 = check(b);

        if (res1 !== res2) {
            if (res1) {
                return 1;
            } else {
                return -1;
            }
        }

        if (res1) {
            break
        }
    }

    return compareHands(a, b);
};

const inputLines = parseFileIntoLines("input.txt");

let res = 0;

console.time();

const hands = inputLines.map(line => parseLine(line));

hands.sort(handsSort);

for (let i = 0; i < hands.length; i++) {
    res += (i + 1) * hands[i].bid;
}

console.timeEnd();
console.log(res);