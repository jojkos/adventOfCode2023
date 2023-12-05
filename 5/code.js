"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var realInput_1 = require("./realInput");
var parseValueLine = function (valueLine) {
    // 50 98 2
    var _a = valueLine.split(" ").map(function (v) { return Number(v); }), destinationRangeStart = _a[0], sourceRangeStart = _a[1], rangeLength = _a[2];
    return {
        destination: destinationRangeStart, source: sourceRangeStart, range: rangeLength
    };
};
var parseValue = function (value) {
    var result = [];
    var lines = value.split("\n");
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var range = parseValueLine(line);
        result.push(range);
    }
    result.sort(function (a, b) { return a.source - b.source; });
    for (var i = 0; i < result.length; i++) {
        var val = result[i];
        var nextVal = result[i + 1];
        if (nextVal) {
            if (nextVal.source <= val.source + val.range) {
                val.range -= nextVal.source - (val.source + val.range) + 1;
            }
        }
    }
    return result;
};
var seeds = realInput_1.seedsLine.split(" ").map(function (v) { return Number(v); });
// const seedToSoil: IRange[] = [];
// const soilToFertilizer: TMap = {};
// const fertilizerToWater: TMap = {};
// const waterToLight: TMap = {};
// const lightToTemperature: TMap = {};
// const temperatureToHumidity: TMap = {};
// const humidityToLocation: TMap = {};
var seedToSoil = parseValue(realInput_1.seedToSoilMap);
var soilToFertilizer = parseValue(realInput_1.soilToFertilizerMap);
var fertilizerToWater = parseValue(realInput_1.fertilizerToWaterMap);
var waterToLight = parseValue(realInput_1.waterToLightMap);
var lightToTemperature = parseValue(realInput_1.lightToTemperatureMap);
var temperatureToHumidity = parseValue(realInput_1.temperatureToHumidityMap);
var humidityToLocation = parseValue(realInput_1.humidityToLocationMap);
var namesOrder = ["seedToSoil", "soilToFertilizer", "fertilizerToWater", "waterToLight", "lightToTemperature", "temperatureToHumidity", "humidityToLocation"];
var order = [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation];
// optimization
var lastValuesMappings = {};
var isInRange = function (range, index) {
    return range.source <= index && range.source + range.range >= index;
};
var getMapValue = function (ranges, index, name) {
    var lastRange = lastValuesMappings[name];
    if (lastRange && isInRange(lastRange, index)) {
        var diff = index - lastRange.source;
        return lastRange.destination + diff;
    }
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.source > index) {
            return index;
        }
        if (isInRange(range, index)) {
            var diff = index - range.source;
            lastValuesMappings[name] = range;
            return range.destination + diff;
        }
    }
    return index;
};
var closest = null;
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
for (var i = 0; i < seeds.length; i += 2) {
    var start = seeds[i];
    var range = seeds[i + 1];
    for (var seed = start; seed < start + range; seed++) {
        var index = seed;
        for (var x = 0; x < order.length; x++) {
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
//# sourceMappingURL=code.js.map