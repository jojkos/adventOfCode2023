import * as fs from "fs";
import { isStringNumber, memoize, parseFileIntoLines } from "../utils";

interface ICard {
    winningNumbers: number[];
    numbers: number[];
}

const prepareNumbers = (numbers: string) => {
    return numbers.trim().split(" ").filter(v => v).map(v => Number(v));
};

const parseCard = (line: string): ICard => {
    const split = line.split(":")[1].split("|");

    return {
        winningNumbers: prepareNumbers(split[0]),
        numbers: prepareNumbers(split[1])
    };
};

const inputLines = parseFileIntoLines("input.txt");
const cards = inputLines.map(line => parseCard(line));

let sum = 0;
let sumScratchcards = 0;

const getMatches = memoize((card: ICard): number => {
    let matches = 0;

    for (const number of card.numbers) {
        if (card.winningNumbers.includes(number)) {
            matches += 1;
        }
    }

    return matches;
});

const processCard = (card: ICard, index: number) => {
    sumScratchcards += 1;

    const matches = getMatches(card);

    if (matches > 0) {
        for (let j = index + 1; j <= index + matches; j++) {
            processCard(cards[j], j);
        }
    }
};

for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const matches = getMatches(card);

    if (matches !== 0) {
        sum += Math.pow(2, matches - 1);
    }
    // PART 2
    processCard(card, i);
}


console.log(sum);
console.log(sumScratchcards);