import {
    fertilizerToWaterMap, humidityToLocationMap,
    lightToTemperatureMap,
    seedsLine,
    seedToSoilMap,
    soilToFertilizerMap, temperatureToHumidityMap,
    waterToLightMap
} from "./realInput";

type TMap = Record<number, number>;

interface IRange {
    destination: number;
    source: number;
    range: number;
}

const parseValueLine = (valueLine: string): IRange => {
    // 50 98 2
    const [destinationRangeStart, sourceRangeStart, rangeLength] = valueLine.split(" ").map(v => Number(v));

    return {
        destination: destinationRangeStart, source: sourceRangeStart, range: rangeLength
    };
};

const parseValue = (value: string): IRange[] => {
    const result: IRange[] = [];
    const lines = value.split("\n");

    for (const line of lines) {
        const range = parseValueLine(line);

        result.push(range);
    }

    result.sort((a: IRange, b: IRange) => a.source - b.source);

    for (let i = 0; i < result.length; i++) {
        const val = result[i];
        const nextVal = result[i + 1];

        if (nextVal) {
            if (nextVal.source <= val.source + val.range) {
                val.range -= nextVal.source - (val.source + val.range) + 1;
            }
        }
    }

    return result;
};


const seeds = seedsLine.split(" ").map(v => Number(v));
// const seedToSoil: IRange[] = [];
// const soilToFertilizer: TMap = {};
// const fertilizerToWater: TMap = {};
// const waterToLight: TMap = {};
// const lightToTemperature: TMap = {};
// const temperatureToHumidity: TMap = {};
// const humidityToLocation: TMap = {};

const seedToSoil = parseValue(seedToSoilMap);
const soilToFertilizer = parseValue(soilToFertilizerMap);
const fertilizerToWater = parseValue(fertilizerToWaterMap);
const waterToLight = parseValue(waterToLightMap);
const lightToTemperature = parseValue(lightToTemperatureMap);
const temperatureToHumidity = parseValue(temperatureToHumidityMap);
const humidityToLocation = parseValue(humidityToLocationMap);

const namesOrder = ["seedToSoil", "soilToFertilizer", "fertilizerToWater", "waterToLight", "lightToTemperature", "temperatureToHumidity", "humidityToLocation"];
const order = [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation];

// optimization
const lastValuesMappings: Record<string, IRange> = {};

const isInRange = (range: IRange, index: number): boolean => {
    return range.source <= index && range.source + range.range >= index;
};

const getMapValue = (ranges: IRange[], index: number, name: string): number => {
    const lastRange = lastValuesMappings[name];

    if (lastRange && isInRange(lastRange, index)) {
        const diff = index - lastRange.source;

        return lastRange.destination + diff;
    }

    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];

        if (range.source > index) {
            return index;
        }

        if (isInRange(range, index)) {
            const diff = index - range.source;

            lastValuesMappings[name] = range;

            return range.destination + diff;
        }
    }

    return index;
};

let closest: number = null;

console.time();

// FIRST
// for (const seed of seeds) {
//     let index = seed;
//
//     for (const map of order) {
//         index = getMapValue(map, index)
//     }
//
//     if (closest === null || index < closest) {
//         closest = index;
//     }
// }

// SECOND
for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const range = seeds[i + 1];

    for (let seed = start; seed < start + range; seed++) {
        let index = seed;

        for (let x = 0; x < order.length; x++) {
            index = getMapValue(order[x], index, namesOrder[x]);
        }

        if (closest === null || index < closest) {

            closest = index;
        }
    }
}
console.timeEnd();

console.log(closest);

// 77435348