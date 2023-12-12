type TRange = [string, number];


interface ILine {
    ranges: TRange[];
    numbers: number[];
}

const Unknown = "?";
const Broken = "#";
const Valid = ".";

const parseLines = (lines: string[]): ILine[] => {
    const parsedLines: ILine[] = [];

    for (const line of lines) {
        const [rangesPart, numbersPart] = line.split(" ");

        const numbers = numbersPart.split(",").map(v => Number(v));

        let currentLength = 0;
        let currentType = null;
        let previousType = null;
        const ranges: TRange[] = [];

        for (let i = 0; i < rangesPart.length + 1; i++) {
            const val = rangesPart[i];
            let addOne = 0;

            if (val !== currentType || i === rangesPart.length) {
                // if (i === rangesPart.length - 1) {
                //     if (currentType === val) {
                //         currentLength += 1;
                //     } else {
                //         currentType = val;
                //     }
                // }

                if (currentLength > 0) {
                    ranges.push([currentType, currentLength]);
                }

                previousType = currentType;
                currentType = val;
                currentLength = addOne;
            }

            currentLength += 1;
        }

        parsedLines.push({
            ranges: ranges,
            numbers: numbers
        });
    }

    return parsedLines;
};

const mergeRanges = (x1: number, x2: number, type: string, ranges: TRange[]): TRange[] => {
    return [
        ...ranges.filter((_, i) => i < x1)
        , [type, ranges[x1][1] + ranges[x2][1]],
        ...ranges.filter((_, i) => i > x2)
    ];
};

const splitRanges = () => {
    // potrebuju to?
};

// takes all ranges and merges Unknown with Broken
// and filters out Valid
const getMergedRanges = (ranges: TRange[]): TRange[] => {
    let mergedRanges: TRange[] = [];
    const rangesDuplicate = [...ranges];
    let currentRange = rangesDuplicate.shift();

    while (currentRange) {
        const lastRange = mergedRanges[mergedRanges.length - 1];

        if (lastRange && lastRange[0] !== Valid && currentRange[0] !== Valid) {
            lastRange[1] = lastRange[1] + currentRange[1];
        } else {
            mergedRanges.push([
                currentRange[0] === Valid ? Valid : Broken,
                currentRange[1]
            ]);
        }

        currentRange = rangesDuplicate.shift();
    }

    return mergedRanges;
};


const findFits = (ranges: TRange[], size: number) => {
    const preciseFitIndex = ranges.findIndex(range => range[1] === size);

    if (preciseFitIndex >= 0) {
        let previousRanges = ranges.filter((_, i) => i < preciseFitIndex);
        let nextRanges = ranges.filter((_, i) => i > preciseFitIndex);

        const previousRange = previousRanges[previousRanges.length - 1];
        const nextRange = nextRanges[0];

        if (previousRange[0] === Unknown) {
            if (previousRange[1] === 1) {
                previousRange[0] = Valid;
            } else {
                previousRanges = [...previousRanges.slice(0, -1), [Unknown, previousRange[1] - 1], [Valid, 1]];
            }
        }

        if (nextRange[0] === Unknown) {
            if (nextRange[1] === 1) {
                nextRange[0] = Valid;
            } else {
                nextRanges = [[Valid, 1], [Unknown, nextRange[1] - 1], ...nextRanges.slice(1)];
            }
        }

        return [[previousRanges, nextRanges]];
    }


    // nejdriv zkusim najit kam se to vejde
    // pak to zacnu mergovat
    // az to je hotovy, tak okolni otaznicky musim zmenit na tecku
    // vratim zbylou levou a pravou stranu


    const retVal = [];

    for (let i = 0; i < ranges.length; i++) {
        // musim najit vsechny fity
        // a k nim adekvatni left,right zbytky
        const range = ranges[i];

        if (range[0] === Unknown && range[1] >= size) {
            for (let j = 0; j < range[1]; j += size) {
                const leftRanges = [...ranges.slice(0, i)]
            }
        }
    }

    return retVal;
};

const dfs = (line: ILine): number => {
    if (line.numbers.length === 0 || line.ranges.length === 0) {
        return 0;
    }

    const max = Math.max(...line.numbers);
    const maxIndex = line.numbers.findIndex(n => n === max);
    const previous = line.numbers.filter((_, i) => i < maxIndex);
    const next = line.numbers.filter((_, i) => i > maxIndex);

    const [left, right] = findFits(line.ranges, max);


    return dfs({
        numbers: previous,
        ranges: []
    }) + dfs({
        numbers: next,
        ranges: []
    });
};