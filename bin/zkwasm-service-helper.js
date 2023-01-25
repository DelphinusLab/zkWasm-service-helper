#! /usr/bin/env node
const fs = require("fs");
const zkWasmHelper = require("../dist/cjs/index.js");
const formdata = require("form-data");

let formData = new formdata();
let fileSelected = fs.readFileSync("/home/yyu/git/zkWASM-playground/client/arith.wasm");
//let fileSelected  = new File("arith", "/home/yyu/git/zkWASM-playground/client/arith.wasm");

formData.append("image", fileSelected, fileSelected.name);
formData.append("user_address", "0x27990d2B01351dF3403c0A34A2dDdf98205f6d3d");

const resturl = "http://127.0.0.1:8080"
let b = new zkWasmHelper.ZkWasmServiceTaskHelper(resturl, "", "");
b.addNewWasmImage(formData).then((_) => {console.log("use addNewWasmImage success!")});
console.log("use zkwasmservicehelp success!");

var { argv } = require("yargs")
  .scriptName("area")
  .usage("Usage: $0 -w num -h num")
  .example(
    "$0 -w 5 -h 6",
    "Returns the area (30) by multiplying the width with the height."
  )
  .option("w", {
    alias: "width",
    describe: "The width of the area.",
    demandOption: "The width is required.",
    type: "number",
    nargs: 1,
  })
  .option("h", {
    alias: "height",
    describe: "The height of the area.",
    demandOption: "The height is required.",
    type: "number",
    nargs: 1,
  })
  .describe("help", "Show help.") // Override --help usage message.
  .describe("version", "Show version number.") // Override --version usage message.
  .epilog("copyright 2019");

console.log(argv);
