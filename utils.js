"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = exports.isStringNumber = exports.parseFileIntoLines = void 0;
var fs = require("fs");
var parseFileIntoLines = function (filePath) {
    return fs.readFileSync(filePath).toString().split("\r\n");
};
exports.parseFileIntoLines = parseFileIntoLines;
var isStringNumber = function (val) {
    var parsedValue = Number(val);
    return !isNaN(parsedValue);
};
exports.isStringNumber = isStringNumber;
function memoize(func, getDependencies) {
    var wasCalled = false;
    var lastArgs = [];
    var lastDependencies = [];
    var lastValue = null;
    var lastThis = null;
    var reset = false;
    var argsEqual = function (args1, args2) {
        if (args1.length !== args2.length) {
            return false;
        }
        for (var i = 0; i < args1.length; i++) {
            if (args1[i] instanceof Date && args2[i] instanceof Date && args1[i].getTime() !== args2[i].getTime()) {
                return false;
            }
            else if (args1[i] !== args2[i]) {
                return false;
            }
        }
        return true;
    };
    var memoized = function () {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        var newDependencies = getDependencies === null || getDependencies === void 0 ? void 0 : getDependencies.apply(void 0, newArgs);
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
    memoized.reset = function () {
        reset = true;
    };
    return memoized;
}
exports.memoize = memoize;
//# sourceMappingURL=utils.js.map