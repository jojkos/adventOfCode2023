import { parseFileIntoLines } from "../utils";

const inputLines = parseFileIntoLines("input.txt");

interface IRule {
    operator: "<" | ">";
    letter: string;
    value: number;
    next: string;
}

interface IWorkflow {
    name: string;
    rules: IRule[];
}

const parts: Record<string, number>[] = [];
const workflows: Record<string, IWorkflow> = {};
const workflowsArr: IWorkflow[] = [];
const Accept = "A";
const Reject = "R";
const initialWorkflow = "in";
const Min = 0;
const Max = 4000;
type TValues = Record<"x" | "m" | "a" | "s", { min: number, max: number }>;
const MaxValues: TValues = {
    x: { min: Min, max: Max },
    m: { min: Min, max: Max },
    a: { min: Min, max: Max },
    s: { min: Min, max: Max }
};

const parseInput = () => {
    let isRatings = false;

    for (const line of inputLines) {
        if (line === "") {
            isRatings = true;
            continue;
        }

        if (!isRatings) {
            const [name, rest] = line.replace("}", "").split("{");
            const rulesStrings = rest.split(",");
            const rules: IRule[] = [];

            for (const ruleString of rulesStrings) {
                if (ruleString.includes(":")) {
                    const letter = ruleString[0];
                    const operator = ruleString[1];
                    const [value, next] = ruleString.slice(2).split(":");

                    rules.push({
                        letter,
                        operator: operator as "<" | ">",
                        value: Number(value),
                        next
                    });
                } else {
                    rules.push({
                        letter: null,
                        operator: null,
                        value: null,
                        next: ruleString
                    });
                }
            }

            const newWorkflow: IWorkflow = {
                name,
                rules
            };

            workflows[name] = newWorkflow;
            workflowsArr.push(newWorkflow);
        } else {
            const ratingsStrings = line.replace("{", "").replace("}", "").split(",");
            const ratings: Record<string, number> = {};

            for (const val of ratingsStrings) {
                const [name, number] = val.split("=");

                ratings[name] = Number(number);
            }

            parts.push(ratings);
        }
    }
};

const process1 = () => {
    let acceptedSum = 0;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let currentAction = initialWorkflow;

        while (currentAction) {
            if (currentAction === Accept) {
                acceptedSum += Object.values(part).reduce((acc, curr) => acc + curr, 0);
                break;
            } else if (currentAction === Reject) {
                break;
            }

            const workflow = workflows[currentAction];

            for (const rule of workflow.rules) {
                if (!rule.operator) {
                    currentAction = rule.next;
                    break;
                } else {
                    if (rule.operator === ">") {
                        if (part[rule.letter] > rule.value) {
                            currentAction = rule.next;
                            break;
                        }
                    } else {
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

const copyObject = (obj: Record<any, any>) => {
    return JSON.parse(JSON.stringify(obj));
};

const getPossibilities = (values: TValues) => {
    return Object.values(values).reduce((acc, curr) => acc * (curr.max - curr.min), 1);
};

// vysledek tohodle musi byt kombinace pro workflow
// pro kazdej workflow tak ziskam kombinace a nejak to jeste dam cely dohromady
const evaluateWorkflow = (workflow: IWorkflow, possibleValues: TValues) => {
    let sum = 0;
    const workflowValues = copyObject(possibleValues);

    for (const rule of workflow.rules) {
        const ruleValues = copyObject(workflowValues);

        if (rule.operator) {
            if (rule.operator === "<") {
                ruleValues[rule.letter].max = Math.min(workflowValues[rule.letter].max, rule.value - 1);
                workflowValues[rule.letter].min = Math.max(workflowValues[rule.letter].min, rule.value - 1);
            } else {
                ruleValues[rule.letter].min = Math.max(workflowValues[rule.letter].min, rule.value);
                workflowValues[rule.letter].max = Math.min(workflowValues[rule.letter].max, rule.value);
            }
        }

        if (rule.next === Accept) {
            const rulePossibilities = getPossibilities(ruleValues);

            sum += rulePossibilities;
        } else if (rule.next === Reject) {
            continue;
        } else {
            const nestedPossibilities = evaluateWorkflow(workflows[rule.next], ruleValues);

            sum += nestedPossibilities;
        }
    }

    return sum;
};

const process2 = () => {
    let possibleSum = 0;


    return possibleSum;
};


parseInput();

const res1 = process1();

console.log("1:", res1);

const res2 = evaluateWorkflow(workflows[initialWorkflow], MaxValues);

console.log("2:", res2);
