"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var parts = [];
var workflows = {};
var workflowsArr = [];
var Accept = "A";
var Reject = "R";
var initialWorkflow = "in";
var Min = 0;
var Max = 4000;
var MaxValues = {
    x: { min: Min, max: Max },
    m: { min: Min, max: Max },
    a: { min: Min, max: Max },
    s: { min: Min, max: Max }
};
var parseInput = function () {
    var isRatings = false;
    for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
        var line = inputLines_1[_i];
        if (line === "") {
            isRatings = true;
            continue;
        }
        if (!isRatings) {
            var _a = line.replace("}", "").split("{"), name_1 = _a[0], rest = _a[1];
            var rulesStrings = rest.split(",");
            var rules = [];
            for (var _b = 0, rulesStrings_1 = rulesStrings; _b < rulesStrings_1.length; _b++) {
                var ruleString = rulesStrings_1[_b];
                if (ruleString.includes(":")) {
                    var letter = ruleString[0];
                    var operator = ruleString[1];
                    var _c = ruleString.slice(2).split(":"), value = _c[0], next = _c[1];
                    rules.push({
                        letter: letter,
                        operator: operator,
                        value: Number(value),
                        next: next
                    });
                }
                else {
                    rules.push({
                        letter: null,
                        operator: null,
                        value: null,
                        next: ruleString
                    });
                }
            }
            var newWorkflow = {
                name: name_1,
                rules: rules
            };
            workflows[name_1] = newWorkflow;
            workflowsArr.push(newWorkflow);
        }
        else {
            var ratingsStrings = line.replace("{", "").replace("}", "").split(",");
            var ratings = {};
            for (var _d = 0, ratingsStrings_1 = ratingsStrings; _d < ratingsStrings_1.length; _d++) {
                var val = ratingsStrings_1[_d];
                var _e = val.split("="), name_2 = _e[0], number = _e[1];
                ratings[name_2] = Number(number);
            }
            parts.push(ratings);
        }
    }
};
var process1 = function () {
    var acceptedSum = 0;
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var currentAction = initialWorkflow;
        while (currentAction) {
            if (currentAction === Accept) {
                acceptedSum += Object.values(part).reduce(function (acc, curr) { return acc + curr; }, 0);
                break;
            }
            else if (currentAction === Reject) {
                break;
            }
            var workflow = workflows[currentAction];
            for (var _i = 0, _a = workflow.rules; _i < _a.length; _i++) {
                var rule = _a[_i];
                if (!rule.operator) {
                    currentAction = rule.next;
                    break;
                }
                else {
                    if (rule.operator === ">") {
                        if (part[rule.letter] > rule.value) {
                            currentAction = rule.next;
                            break;
                        }
                    }
                    else {
                        if (part[rule.letter] < rule.value) {
                            currentAction = rule.next;
                            break;
                        }
                    }
                }
            }
        }
    }
    return acceptedSum;
};
// const evaluateRule = (rule: IRule, possibleValues: TValues) => {
//     const newValues = { ...possibleValues };
//
//     if (rule.operator) {
//         if (rule.operator === "<") {
//             newValues[rule.letter].max = Math.min(newValues[rule.letter].max, rule.value);
//         } else {
//             newValues[rule.letter].min = Math.max(newValues[rule.letter].min, rule.value);
//         }
//     }
//
//     if (rule.next === Accept) {
//         return Object.values(possibleValues).reduce((acc, curr) => acc * (curr.max - curr.min), 0);
//     } else if (rule.next === Reject) {
//         return 0;
//     } else {
//         return rule.next;
//     }
// };
var copyObject = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};
var getPossibilities = function (values) {
    return Object.values(values).reduce(function (acc, curr) { return acc * (curr.max - curr.min); }, 1);
};
// vysledek tohodle musi byt kombinace pro workflow
// pro kazdej workflow tak ziskam kombinace a nejak to jeste dam cely dohromady
var evaluateWorkflow = function (workflow, possibleValues) {
    var sum = 0;
    var workflowValues = copyObject(possibleValues);
    for (var _i = 0, _a = workflow.rules; _i < _a.length; _i++) {
        var rule = _a[_i];
        var ruleValues = copyObject(workflowValues);
        if (rule.operator) {
            if (rule.operator === "<") {
                ruleValues[rule.letter].max = Math.min(workflowValues[rule.letter].max, rule.value - 1);
                workflowValues[rule.letter].min = Math.max(workflowValues[rule.letter].min, rule.value - 1);
            }
            else {
                ruleValues[rule.letter].min = Math.max(workflowValues[rule.letter].min, rule.value);
                workflowValues[rule.letter].max = Math.min(workflowValues[rule.letter].max, rule.value);
            }
        }
        if (rule.next === Accept) {
            var rulePossibilities = getPossibilities(ruleValues);
            sum += rulePossibilities;
        }
        else if (rule.next === Reject) {
            continue;
        }
        else {
            var nestedPossibilities = evaluateWorkflow(workflows[rule.next], ruleValues);
            sum += nestedPossibilities;
        }
    }
    return sum;
};
var process2 = function () {
    var possibleSum = 0;
    return possibleSum;
};
parseInput();
var res1 = process1();
console.log("1:", res1);
var res2 = evaluateWorkflow(workflows[initialWorkflow], MaxValues);
console.log("2:", res2);
//# sourceMappingURL=code.js.map