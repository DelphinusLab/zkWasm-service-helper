"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZkWasmUtil = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const ts_md5_1 = require("ts-md5");
const interface_js_1 = require("../interface/interface.js");
const ethers_1 = require("ethers");
class ZkWasmUtil {
    static hexToBNs(hexString) {
        let bytes = new Array(Math.ceil(hexString.length / 16));
        for (var i = 0; i < hexString.length; i += 16) {
            bytes[i] = new bn_js_1.default(hexString.slice(i, Math.min(i + 16, hexString.length)), 16);
        }
        return bytes;
    }
    static validateI64HexInput(value) {
        let re = new RegExp(/^[0-9A-Fa-f]+$/);
        // Check if value is a hexdecimal
        if (!re.test(value.slice(2))) {
            throw new Error("Invalid hex value: " + value);
        }
        return true;
    }
    static validateBytesInput(value) {
        let re = new RegExp(/^[0-9A-Fa-f]+$/);
        if (value.slice(0, 2) != "0x") {
            throw new Error("Value should start with 0x. Input given: " + value);
        }
        // Check if value is a hexdecimal
        if (!re.test(value.slice(2))) {
            throw new Error("Invalid hex value: " + value);
        }
        // Check the length of the hexdecimal is even
        if (value.length % 2 != 0) {
            throw new Error("Odd Hex length provided: " + value);
        }
        return true;
    }
    static validateInput(input) {
        let inputSplit = input.split(":");
        // Check that there are two parts
        if (inputSplit.length != 2) {
            throw new Error("Invalid input: " + input);
        }
        let value = inputSplit[0];
        let type = inputSplit[1];
        let decimlaRegex = new RegExp(/^\d+$/); // decimal
        if (type == "i64") {
            // If 0x is present, check that it is a hexdecimal
            if (value.slice(0, 2) == "0x") {
                this.validateI64HexInput(value);
            }
            // If 0x is not present, check that it is a decimal
            else {
                if (!decimlaRegex.test(value)) {
                    throw new Error("Invalid input value: " + input);
                }
            }
        }
        else if (type == "bytes" || type == "bytes-packed") {
            this.validateBytesInput(value);
        }
        else {
            throw new Error("Invalid input type: " + type);
        }
    }
    // Inputs are strings that should be of the form 32:i64, 0x1234:bytes or 0x1234:bytes-packed and split by spaces
    static validateInputs(inputs) {
        let trimmed = inputs.trim();
        if (trimmed === "") {
            return [];
        }
        // Split the inputs by whitespaces
        let inputArray = trimmed.split(/\s+/);
        // Iterate over the inputs
        inputArray.forEach((input) => {
            // Split the input by the colon
            this.validateInput(input);
        });
        // Return split inputs as an array
        return inputArray;
    }
    static isHexString(value) {
        let re = new RegExp(/^[0-9A-Fa-f]+$/);
        // Check if value is a hexdecimal
        if (!re.test(value)) {
            return false;
        }
        return true;
    }
    static convertToMd5(value) {
        let md5 = new ts_md5_1.Md5();
        md5.appendByteArray(value);
        let hash = md5.end();
        if (!hash)
            return "";
        return hash.toString();
    }
    static convertAmount(balance) {
        let amt = new bn_js_1.default(balance, 10, "le").toString();
        return (0, ethers_1.formatUnits)(amt, "ether");
    }
    static createLogsMesssage(params) {
        return JSON.stringify(params);
    }
    //this is form data
    static createAddImageSignMessage(params) {
        //sign all the fields except the image itself and signature
        let message = "";
        message += params.name;
        message += params.image_md5;
        message += params.user_address;
        message += params.description_url;
        message += params.avator_url;
        message += params.circuit_size;
        // Additional params afterwards
        if (params.initial_context) {
            message += params.initial_context_md5;
        }
        return message;
    }
    static createProvingSignMessage(params) {
        // No need to sign the file itself, just the md5
        let message = "";
        message += params.user_address;
        message += params.md5;
        // for array elements, append one by one
        for (const input of params.public_inputs) {
            message += input;
        }
        for (const input of params.private_inputs) {
            message += input;
        }
        // Only handle input_context if selected input_context_type.Custom
        if (params.input_context_type === interface_js_1.InputContextType.Custom &&
            params.input_context) {
            message += params.input_context_md5;
        }
        if (params.input_context_type) {
            message += params.input_context_type;
        }
        return message;
    }
    static createDeploySignMessage(params) {
        return JSON.stringify(params);
    }
    static createResetImageMessage(params) {
        let message = "";
        message += params.md5;
        message += params.circuit_size;
        message += params.user_address;
        if (params.reset_context) {
            message += params.reset_context_md5;
        }
        return message;
    }
    static createModifyImageMessage(params) {
        return JSON.stringify(params);
    }
    static bytesToBN(data, chunksize = 32) {
        let bns = [];
        for (let i = 0; i < data.length; i += chunksize) {
            const chunk = data.slice(i, i + chunksize);
            let a = new bn_js_1.default(chunk, "le");
            bns.push(a);
            // do whatever
        }
        return bns;
    }
    static bytesToBigIntArray(data, chunksize = 32) {
        const bigints = [];
        for (let i = 0; i < data.length; i += chunksize) {
            // Slice the Uint8Array to get a 32-byte chunk
            const chunk = data.slice(i, i + chunksize);
            // Reverse the chunk for little-endian interpretation
            const reversedChunk = chunk.reverse();
            // Convert the reversed 32-byte chunk to a hex string
            const hexString = Array.from(reversedChunk)
                .map((byte) => byte.toString(16).padStart(2, "0"))
                .join("");
            // Convert the hex string to a BigInt and add to the array of BigInts
            bigints.push(BigInt("0x" + hexString));
        }
        return bigints;
    }
    // Requires some signer
    static composeVerifyContract(signer, verifier_addr) {
        return signer.getContractWithSigner(verifier_addr, this.contract_abi.abi);
    }
    static verifyProof(verify_contract, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let aggregate_proof = this.bytesToBigIntArray(params.aggregate_proof);
            let batchInstances = this.bytesToBigIntArray(params.batch_instances);
            let aux = this.bytesToBigIntArray(params.aux);
            let instances = this.bytesToBigIntArray(params.instances);
            // let args = ZkWasmUtil.parseArgs(params.instances).map((x) =>
            //   x.toString(10)
            // );
            // console.log("args are:", args);
            // if (args.length == 0) {
            //   args = ["0x0"];
            // }
            // // convert to BigInt array
            // let bigIntArgs = args.map((x) => BigInt(x));
            let result = yield verify_contract.verify.send(aggregate_proof, batchInstances, aux, [instances]);
            return result;
        });
    }
    static signMessage(message, priv_key) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet = new ethers_1.Wallet(priv_key, null);
            let signature = yield wallet.signMessage(message);
            return signature;
        });
    }
    // For nodejs/server environments only
    static loadContextFileFromPath(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined") {
                // We are in Node.js
                const fs = require("fs");
                //const fs = await import("fs").then((module) => module.promises);
                return fs.readFile(filePath, "utf8");
            }
            else {
                // Browser environment
                throw new Error("File loading in the browser is not supported by this function.");
            }
        });
    }
    // For nodejs/server environments only
    static loadContexFileAsBytes(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileContents = yield this.loadContextFileFromPath(filePath);
                let bytes = new TextEncoder().encode(fileContents);
                this.validateContextBytes(bytes);
                return bytes;
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Load file for browser environments
    static browserLoadContextFileAsBytes(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined") {
                // We are in Node.js
                throw new Error("File loading in Node.js is not supported by this function.");
            }
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function () {
                    if (reader.result) {
                        try {
                            ZkWasmUtil.validateContextBytes(new Uint8Array(reader.result));
                            resolve(new Uint8Array(reader.result));
                        }
                        catch (err) {
                            reject(err);
                        }
                    }
                };
                reader.onerror = function (error) {
                    reject(error);
                };
                reader.readAsArrayBuffer(file);
            });
        });
    }
    // Validate bytes are a multiple of 8 bytes (64 bits) and length less than 4KB
    static validateContextBytes(data) {
        if (data.length > this.MAX_CONTEXT_SIZE) {
            throw new Error("File size must be less than 4KB");
        }
        if (data.length % 8 != 0) {
            throw new Error("File size must be a multiple of 8 bytes (64 bits)");
        }
        return true;
    }
}
exports.ZkWasmUtil = ZkWasmUtil;
ZkWasmUtil.contract_abi = {
    contractName: "AggregatorVerifier",
    abi: [
        {
            inputs: [
                {
                    internalType: "contract AggregatorVerifierCoreStep[]",
                    name: "_steps",
                    type: "address[]",
                },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            inputs: [
                {
                    internalType: "uint256[]",
                    name: "proof",
                    type: "uint256[]",
                },
                {
                    internalType: "uint256[]",
                    name: "verify_instance",
                    type: "uint256[]",
                },
                {
                    internalType: "uint256[]",
                    name: "aux",
                    type: "uint256[]",
                },
                {
                    internalType: "uint256[][]",
                    name: "target_instance",
                    type: "uint256[][]",
                },
            ],
            name: "verify",
            outputs: [],
            stateMutability: "view",
            type: "function",
            constant: true,
        },
    ],
};
ZkWasmUtil.MAX_CONTEXT_SIZE = 4096;
