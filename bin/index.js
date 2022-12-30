#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");

const load = require("../src/load");

const options = yargs
    .usage("Usage: -n <name>")
    .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
    .argv;

const greeting = `Hello, ${options.name}!`;

load.loadByConfig({
    "target": {
        "import": "modelui-target-csr-mui",
        "version": "main",
    },
    "imports": {
        "modelui-wrap-ace": "git+https://github.com/modellers/modelui-wrap-ace",
        "modelui-wrap-bigcalendar": "git+https://github.com/modellers/modelui-wrap-bigcalendar",
        "modelui-wrap-form": "git+https://github.com/modellers/modelui-wrap-form",
        "modelui-wrap-complextree": "git+https://github.com/modellers/modelui-wrap-complextree",
        "modelui-wrap-alicecarousel": "git+https://github.com/modellers/modelui-wrap-alicecarousel",
        // "modelui-wrap-bpmn": "git+https://github.com/modellers/modelui-wrap-bpmn", //  issue with core-runtime as it is local
    }
})

console.log(greeting);