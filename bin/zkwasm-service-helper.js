#! /usr/bin/env node
const taskObj = require('../dist/index.js');
const yargs = require('yargs');

console.log("AAA");
console.log(yargs.argv);

taskObj.sayHello();
taskObj.sayGoodbye();

