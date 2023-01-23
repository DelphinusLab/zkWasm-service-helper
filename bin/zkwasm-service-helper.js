#! /usr/bin/env node
const taskObj = require('../dist/index.js');

console.log("AAA");

const args = process.argv.slice(2, process.argv.length);
console.log(args);
taskObj.sayHello();
taskObj.sayGoodbye();

