import { parseFileIntoLines } from "../utils";
import * as d3 from 'd3';

const inputLines = parseFileIntoLines("input.txt");

enum PulseType {
    High = "High",
    Low = "Low"
}

enum ModuleType {
    FlipFlop = "%",
    Conjunction = "&",
    Broadcaster = "broadcaster",
    Button = "button"
}

enum State {
    On = "On",
    Off = "Off"
}

interface IModule {
    name: string;
    type: ModuleType;
    destination: string[];
}

interface IFlipFlop extends IModule {
    type: ModuleType.FlipFlop;
    state: State;
}

interface IConjunction extends IModule {
    type: ModuleType.Conjunction;
    memory: Record<string, PulseType>;
}

interface IBroadcaster extends IModule {
    type: ModuleType.Broadcaster;
}

interface IPulse {
    type: PulseType;
    source: string;
    destination: string;
}

const isFlipFlop = (module: IModule): module is IFlipFlop => {
    return module.type === ModuleType.FlipFlop;
};

const isConjunction = (module: IModule): module is IConjunction => {
    return module.type === ModuleType.Conjunction;
};

const isBroadcaster = (module: IModule): module is IBroadcaster => {
    return module.type === ModuleType.Broadcaster;
};

const initModule = (moduleType: ModuleType, name: string, destination: string[]): IModule | IConjunction | IFlipFlop => {
    if (moduleType === ModuleType.FlipFlop) {
        return {
            type: ModuleType.FlipFlop,
            state: State.Off,
            name,
            destination
        };
    } else if (moduleType === ModuleType.Conjunction) {
        return {
            type: ModuleType.Conjunction,
            name,
            memory: {},
            destination
        };
    } else {
        return {
            name: "broadcaster",
            type: ModuleType.Broadcaster,
            destination
        };
    }
};

const parseInputs = (inputLines: string[]) => {
    const modules: Record<string, IModule> = {};

    for (const line of inputLines) {
        const [first, second] = line.split("->");

        let moduleName = first.trim();
        let type: ModuleType;

        if (moduleName !== ModuleType.Broadcaster) {
            type = moduleName[0] as ModuleType;
            moduleName = moduleName.slice(1);
        } else {
            type = ModuleType.Broadcaster;
        }

        const destination = second.trim().split(",").map(v => v.trim());
        modules[moduleName] = initModule(type, moduleName, destination);
    }

    for (const module of Object.values(modules)) {
        for (const dest of module.destination) {
            const destModule = modules[dest];

            if (destModule && isConjunction(destModule)) {
                destModule.memory[module.name] = PulseType.Low;
            }
        }
    }

    return modules;
};

const printPulse = (pulse: IPulse) => {
    console.log(`${pulse.source} -${pulse.type}-> ${pulse.destination}`);
};

let highPulsesCount = 0;
let lowPulsesCount = 0;

const initPulse = (module: IModule, pulseType: PulseType): IPulse[] => {
    return module.destination.map(name => {
        if (pulseType === PulseType.High) {
            highPulsesCount += 1;
        } else {
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

const firePulse = (pulse: IPulse) => {
    printPulse(pulse);

    const module = modules[pulse.destination];

    if (!module) {
        return [];
    }

    if (isFlipFlop(module)) {
        if (pulse.type === PulseType.High) {
            return [];
        } else {
            module.state = module.state === State.Off ? State.On : State.Off;

            if (module.state === State.On) {
                return initPulse(module, PulseType.High);
            } else {
                return initPulse(module, PulseType.Low);
            }
        }
    } else if (isConjunction(module)) {
        module.memory[pulse.source] = pulse.type;

        const allMemoryHigh = Object.values(module.memory).every(val => val === PulseType.High);

        return initPulse(module, allMemoryHigh ? PulseType.Low : PulseType.High);

    } else if (isBroadcaster(module)) {
        return initPulse(module, pulse.type);
    }
};

const printModule = (module: IModule) => {
    if (isFlipFlop(module)) {
        console.log(`${module.type}${module.name}:`, `${module.state}`);
    } else if (isConjunction(module)) {
        console.log(`${module.type}${module.name}:`, `${Object.entries(module.memory).map(([name, val]) => `${name}:${val}`).join(", ")}`);
    } else if (isBroadcaster(module)) {

    }
};

const printState = () => {
    for (const module of Object.values(modules)) {
        printModule(module);
    }
    console.log("");
};

const pressButton = () => {
    const pulsesQueue: IPulse[] = initPulse({
        name: "button",
        type: ModuleType.Button,
        destination: ["broadcaster"]
    }, PulseType.Low);

    while (pulsesQueue.length) {
        const pulse = pulsesQueue.shift();
        const newPulses = firePulse(pulse) ?? [];

        pulsesQueue.push(...newPulses);
    }
};

const modules = parseInputs(inputLines);

// lvl 1
let n = 1;

for (let i = 0; i < n; i++) {
    pressButton();

    if ((modules["st"] as IConjunction).memory["gr"] !== PulseType.High) {
        console.log(i);
        printModule(modules["gr"]);
    }
    printModule(modules["gr"]);
}

console.log(highPulsesCount * lowPulsesCount);

console.time();

let buttonPresses = 0;
let rxWasLow = false;

// while (!rxWasLow) {
//     buttonPresses += 1;
//     pressButton();
// }

console.log(rxWasLow);

console.timeEnd();

// IDEA
// nejak urcit finalni stav
// a pak jit postupne odzadu
// TO JE BLBOST protoze by to porad trvalo stejne dlouho a jeste nevim jak urcit ten stav
