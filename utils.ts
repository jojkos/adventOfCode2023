import * as fs from "fs";

const parseFileIntoLines = (filePath: string): string[] => {
    return fs.readFileSync(filePath).toString().split("\r\n");
};

const isStringNumber = (val: string): boolean => {
    const parsedValue = Number(val);

    return !isNaN(parsedValue);
};

export interface IMemoized<P extends any[], R> {
    (...params: [...P]): R;

    reset: () => void;
}



function memoize<P extends any[], R>(func: (...params: [...P]) => R, getDependencies?: (...params: [...P]) => any []): IMemoized<P, R> {
    let wasCalled = false;
    let lastArgs: any[] = [];
    let lastDependencies: any[] = [];
    let lastValue: any = null;
    let lastThis: any = null;
    let reset = false;

    const argsEqual = (args1: any, args2: any) => {
        if (args1.length !== args2.length) {
            return false;
        }

        for (let i = 0; i < args1.length; i++) {
            if (args1[i] instanceof Date && args2[i] instanceof Date && args1[i].getTime() !== args2[i].getTime()) {
                return false;
            } else if (args1[i] !== args2[i]) {
                return false;
            }
        }

        return true;
    };

    const memoized: IMemoized<P, R> = function(this: any, ...newArgs: [...P]): R {
        const newDependencies: any[] = getDependencies?.(...newArgs);

        if (!reset && wasCalled && lastThis === this && argsEqual(lastArgs, newArgs) && (!getDependencies || argsEqual(lastDependencies, newDependencies))) {
            return lastValue;
        }


        wasCalled = true;
        reset = false;
        lastArgs = newArgs;
        lastDependencies = newDependencies;
        lastValue = func.apply(this, newArgs);
        lastThis = this;
        return lastValue;
    };

    /** Call to force new value */
    memoized.reset = () => {
        reset = true;
    };

    return memoized;
}


export { parseFileIntoLines, isStringNumber, memoize };