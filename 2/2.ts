import { parseFileIntoLines } from "../utils";
import * as fs from "fs";

interface ICubeSet {
    red: number;
    green: number;
    blue: number;
}

interface IGame {
    id: number;
    cubeSets: ICubeSet[];
}

function parseGames(input: string): IGame[] {
    const games: IGame[] = [];
    const gameStrings = input.split("Game ").slice(1); // Splitting the input string into individual games

    for (const gameString of gameStrings) {
        const [idStr, cubesStr] = gameString.split(": ", 2);
        const id = parseInt(idStr.trim(), 10);
        const cubeSetsStr = cubesStr.split("; ");

        const cubeSets: ICubeSet[] = cubeSetsStr.map(setStr => {
            const counts: ICubeSet = { red: 0, green: 0, blue: 0 };
            for (const color of ["red", "green", "blue"] as (keyof ICubeSet)[]) {
                const regex = new RegExp(`\\d+ ${color}`);
                const match = setStr.match(regex);
                if (match) {
                    const [countStr] = match[0].split(" ");
                    counts[color] = parseInt(countStr, 10);
                }
            }
            return counts;
        });

        games.push({ id, cubeSets });
    }

    return games;
}

// Example usage
const inputLines = parseFileIntoLines("input.txt");
const inputString = fs.readFileSync("input.txt").toString();

const parsedGames = parseGames(inputString);

const Reds = 12;
const Greens = 13;
const Blues = 14;

let firstAnswer = 0;
let secondAnswer = 0;

for (const game of parsedGames) {
    let possible = true;
    let redMax = 0;
    let greenMax = 0;
    let blueMax = 0;

    for (const cubeSet of game.cubeSets) {
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

    const result = redMax * greenMax * blueMax;

    secondAnswer += result;
}

console.log(firstAnswer);
console.log(secondAnswer);

