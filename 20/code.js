"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var inputLines = (0, utils_1.parseFileIntoLines)("input.txt");
var PulseType;
(function (PulseType) {
    PulseType["High"] = "High";
    PulseType["Low"] = "Low";
})(PulseType || (PulseType = {}));
var ModuleType;
(function (ModuleType) {
    ModuleType["FlipFlop"] = "%";
    ModuleType["Conjunction"] = "&";
    ModuleType["Broadcaster"] = "broadcaster";
    ModuleType["Button"] = "button";
})(ModuleType || (ModuleType = {}));
var State;
(function (State) {
    State["On"] = "On";
    State["Off"] = "Off";
})(State || (State = {}));
var isFlipFlop = function (module) {
    return module.type === ModuleType.FlipFlop;
};
var isConjunction = function (module) {
    return module.type === ModuleType.Conjunction;
};
var isBroadcaster = function (module) {
    return module.type === ModuleType.Broadcaster;
};
var initModule = function (moduleType, name, destination) {
    if (moduleType === ModuleType.FlipFlop) {
        return {
            type: ModuleType.FlipFlop,
            state: State.Off,
            name: name,
            destination: destination
        };
    }
    else if (moduleType === ModuleType.Conjunction) {
        return {
            type: ModuleType.Conjunction,
            name: name,
            memory: {},
            destination: destination
        };
    }
    else {
        return {
            name: "broadcaster",
            type: ModuleType.Broadcaster,
            destination: destination
        };
    }
};
var parseInputs = function (inputLines) {
    var modules = {};
    for (var _i = 0, inputLines_1 = inputLines; _i < inputLines_1.length; _i++) {
        var line = inputLines_1[_i];
        var _a = line.split("->"), first = _a[0], second = _a[1];
        var moduleName = first.trim();
        var type = void 0;
        if (moduleName !== ModuleType.Broadcaster) {
            type = moduleName[0];
            moduleName = moduleName.slice(1);
        }
        else {
            type = ModuleType.Broadcaster;
        }
        var destination = second.trim().split(",").map(function (v) { return v.trim(); });
        modules[moduleName] = initModule(type, moduleName, destination);
    }
    for (var _b = 0, _c = Object.values(modules); _b < _c.length; _b++) {
        var module_1 = _c[_b];
        for (var _d = 0, _e = module_1.destination; _d < _e.length; _d++) {
            var dest = _e[_d];
            var destModule = modules[dest];
            if (destModule && isConjunction(destModule)) {
                destModule.memory[module_1.name] = PulseType.Low;
            }
        }
    }
    return modules;
};
var printPulse = function (pulse) {
    console.log("".concat(pulse.source, " -").concat(pulse.type, "-> ").concat(pulse.destination));
};
var highPulsesCount = 0;
var lowPulsesCount = 0;
var initPulse = function (module, pulseType) {
    return module.destination.map(function (name) {
        if (pulseType === PulseType.High) {
            highPulsesCount += 1;
        }
        else {
            lowPulsesCount += 1;
        }
        if (name === "rx" && pulseType === PulseType.Low) {
            rxWasLow = true;
        }
        return {
            source: module.name,
            destination: name,
            type: pulseType
        };
    });
};
var firePulse = function (pulse) {
    // printPulse(pulse);
    var module = modules[pulse.destination];
    if (!module) {
        return [];
    }
    if (isFlipFlop(module)) {
        if (pulse.type === PulseType.High) {
            return [];
        }
        else {
            module.state = module.state === State.Off ? State.On : State.Off;
            if (module.state === State.On) {
                return initPulse(module, PulseType.High);
            }
            else {
                return initPulse(module, PulseType.Low);
            }
        }
    }
    else if (isConjunction(module)) {
        module.memory[pulse.source] = pulse.type;
        var allMemoryHigh = Object.values(module.memory).every(function (val) { return val === PulseType.High; });
        return initPulse(module, allMemoryHigh ? PulseType.Low : PulseType.High);
    }
    else if (isBroadcaster(module)) {
        return initPulse(module, pulse.type);
    }
};
var printModule = function (module) {
    if (isFlipFlop(module)) {
        console.log("".concat(module.type).concat(module.name, ":"), "".concat(module.state));
    }
    else if (isConjunction(module)) {
        console.log("".concat(module.type).concat(module.name, ":"), "".concat(Object.entries(module.memory).map(function (_a) {
            var name = _a[0], val = _a[1];
            return "".concat(name, ":").concat(val);
        }).join(", ")));
    }
    else if (isBroadcaster(module)) {
    }
};
var printState = function () {
    for (var _i = 0, _a = Object.values(modules); _i < _a.length; _i++) {
        var module_2 = _a[_i];
        printModule(module_2);
    }
    console.log("");
};
var pressButton = function () {
    var _a;
    var pulsesQueue = initPulse({
        name: "button",
        type: ModuleType.Button,
        destination: ["broadcaster"]
    }, PulseType.Low);
    while (pulsesQueue.length) {
        var pulse = pulsesQueue.shift();
        var newPulses = (_a = firePulse(pulse)) !== null && _a !== void 0 ? _a : [];
        pulsesQueue.push.apply(pulsesQueue, newPulses);
    }
};
var modules = parseInputs(inputLines);
// lvl 1
var n = 100000000000;
modules["rx"] = {
    type: ModuleType.Conjunction,
    name: "rx",
    memory: {
        lv: PulseType.High
    },
    destination: []
};
for (var i = 0; i < n; i++) {
    pressButton();
    if (i % 10000 === 0) {
        console.log(i);
    }
    var test = modules["hh"];
    if (Object.values(test.memory).every(function (puleType) { return puleType === PulseType.Low; })) {
        console.log("final: ", i + 1);
        printModule(test);
        break;
    }
}
console.log("high: ".concat(highPulsesCount));
console.log("low: ".concat(lowPulsesCount));
console.log(highPulsesCount * lowPulsesCount);
console.time();
var buttonPresses = 0;
var rxWasLow = false;
// while (!rxWasLow) {
//     buttonPresses += 1;
//     pressButton();
// }
// console.log(rxWasLow);
console.timeEnd();
// IDEA
// nejak urcit finalni stav
// a pak jit postupne odzadu
// TO JE BLBOST protoze by to porad trvalo stejne dlouho a jeste nevim jak urcit ten stav
//# sourceMappingURL=code.js.map