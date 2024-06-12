import BN from "bn.js";
import { Md5 } from "ts-md5";
import { InputContextType, } from "../interface/interface.js";
import { Contract, formatUnits, Wallet } from "ethers";
import ERC20 from "../abi/ERC20.json";
export class ZkWasmUtil {
    static contract_abi = {
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
    static batch_verifier_contract = {
        contract_name: "ProofTracker",
        abi: [
            {
                type: "constructor",
                inputs: [
                    {
                        internalType: "address",
                        name: "verifier_address",
                        type: "address",
                    },
                ],
            },
            {
                type: "function",
                name: "check_verified_proof",
                inputs: [
                    {
                        internalType: "uint256[]",
                        name: "membership_proof_index",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256[]",
                        name: "verify_instance",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256[][]",
                        name: "sibling_instances",
                        type: "uint256[][]",
                    },
                    {
                        internalType: "uint256[][]",
                        name: "target_instances",
                        type: "uint256[][]",
                    },
                ],
                outputs: [],
                stateMutability: "view",
            },
            {
                type: "function",
                name: "register_proofs",
                inputs: [
                    { internalType: "uint256[]", name: "proof", type: "uint256[]" },
                    {
                        internalType: "uint256[]",
                        name: "verify_instance",
                        type: "uint256[]",
                    },
                    { internalType: "uint256[]", name: "aux", type: "uint256[]" },
                    {
                        internalType: "uint256[][]",
                        name: "instances",
                        type: "uint256[][]",
                    },
                ],
                outputs: [],
                stateMutability: "nonpayable",
            },
            {
                type: "function",
                name: "set_verifier",
                inputs: [{ internalType: "address", name: "vaddr", type: "address" }],
                outputs: [],
                stateMutability: "nonpayable",
            },
            {
                type: "event",
                name: "ProofAck",
                inputs: [{ name: "hash", type: "uint256", indexed: false }],
                anonymous: false,
            },
        ],
    };
    static hexToBNs(hexString) {
        let bytes = new Array(Math.ceil(hexString.length / 16));
        for (var i = 0; i < hexString.length; i += 16) {
            bytes[i] = new BN(hexString.slice(i, Math.min(i + 16, hexString.length)), 16);
        }
        return bytes;
    }
    static validateBytesInput(value) {
        this.validateHex(value);
        // Check the length of the hexdecimal is even
        if (value.length % 2 != 0) {
            throw new Error("Odd Hex length provided: " + value);
        }
        return true;
    }
    static validateI64HexInput(value) {
        this.validateHex(value);
        return true;
    }
    static validateHex(value) {
        let re = new RegExp(/^[0-9A-Fa-f]+$/);
        if (value.slice(0, 2) != "0x") {
            throw new Error("Value should start with 0x. Input given: " + value);
        }
        // Check if value is a hexdecimal
        if (!re.test(value.slice(2))) {
            throw new Error("Invalid hex value: " + value);
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
        let md5 = new Md5();
        md5.appendByteArray(value);
        let hash = md5.end();
        if (!hash)
            return "";
        return hash.toString();
    }
    static convertAmount(balance) {
        let amt = new BN(balance, 10, "le").toString();
        return formatUnits(amt, "ether");
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
        message += params.prove_payment_src;
        for (const chainId of params.auto_submit_network_ids) {
            message += chainId;
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
        message += params.proof_submit_mode;
        // Only handle input_context if selected input_context_type.Custom
        if (params.input_context_type === InputContextType.Custom &&
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
        message += params.prove_payment_src;
        for (const chainId of params.auto_submit_network_ids) {
            message += chainId;
        }
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
            let a = new BN(chunk, "le");
            bns.push(a);
            // do whatever
        }
        return bns;
    }
    static bnToHexString(bn) {
        return "0x" + bn.toString("hex");
    }
    static bytesToHexStrings(data, chunksize = 32) {
        let hexStrings = [];
        let bns = this.bytesToBN(data, chunksize);
        for (let i = 0; i < bns.length; i++) {
            hexStrings.push(this.bnToHexString(bns[i]));
        }
        return hexStrings;
    }
    static bnToBytes(bn, chunksize = 32) {
        // Check if the BN is more than expected chunksize bytes
        if (bn.byteLength() > chunksize) {
            throw new Error("BN is too large for the specified chunksize: " + bn.toString(10));
        }
        return new Uint8Array(bn.toArray("le", chunksize));
    }
    static hexStringToBN(hexString) {
        // Should begin with 0x
        this.validateHex(hexString);
        return new BN(hexString.slice(2), 16);
    }
    static hexStringsToBytes(hexStrings, chunksize) {
        let bytes = new Uint8Array(chunksize * hexStrings.length);
        for (let i = 0; i < hexStrings.length; i++) {
            let bn = this.hexStringToBN(hexStrings[i]);
            let byte = this.bnToBytes(bn, chunksize);
            bytes.set(byte, i * chunksize);
        }
        return bytes;
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
    static async verifyProof(verify_contract, params) {
        let aggregate_proof = this.bytesToBigIntArray(params.aggregate_proof);
        let verify_instance = this.bytesToBigIntArray(params.verify_instance);
        let aux = this.bytesToBigIntArray(params.aux);
        let instances = [];
        params.instances.forEach((instance) => {
            instances.push(this.bytesToBigIntArray(instance));
        });
        let result = await verify_contract.verify.send(aggregate_proof, verify_instance, aux, instances);
        return result;
    }
    static composeBatchVerifierContract(signer, verifier_addr) {
        return signer.getContractWithSigner(verifier_addr, this.batch_verifier_contract.abi);
    }
    static async verifyBatchedProof(batch_verifier_contract, params) {
        let membership_proof_index = params.membership_proof_index;
        let verify_instance = this.bytesToBigIntArray(params.verify_instance);
        let sibling_instances = [];
        params.sibling_instances.forEach((instance) => {
            //
            sibling_instances.push(this.bytesToBigIntArray(instance)[0]);
        });
        let target_instances = [];
        params.target_instances.forEach((instance) => {
            target_instances.push(this.bytesToBigIntArray(instance));
        });
        let round_1_shadow_instance = this.bytesToBigIntArray(params.round_1_shadow_instance);
        // Add the round 1 shadow instance to the flattened sibling instances as this is the expected input format
        // for the contract. (12 round 1 target instances + 1 round 1 shadow instance)
        sibling_instances.push(round_1_shadow_instance[0]);
        console.log("Verify Batch Proof Inputs");
        console.log("membership_proof_index: ", membership_proof_index);
        console.log("verify_instance: ", verify_instance);
        console.log("sibling_instances: ", [sibling_instances]);
        console.log("target_instances: ", target_instances);
        let result = await batch_verifier_contract.check_verified_proof.send(membership_proof_index, verify_instance, [sibling_instances], target_instances);
        return result;
    }
    static async signMessage(message, priv_key) {
        let wallet = new Wallet(priv_key, null);
        let signature = await wallet.signMessage(message);
        return signature;
    }
    static ERC20Contract(contractAddress, signer) {
        return new Contract(contractAddress, ERC20, signer);
    }
    static bytesToJSONString(data) {
        const bufferView = new Uint8Array(data);
        return new TextDecoder().decode(bufferView);
    }
    // For nodejs/server environments only
    static async loadContextFileFromPath(filePath) {
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
    }
    // For nodejs/server environments only
    static async loadContexFileAsBytes(filePath) {
        try {
            const fileContents = await this.loadContextFileFromPath(filePath);
            let bytes = new TextEncoder().encode(fileContents);
            this.validateContextBytes(bytes);
            return bytes;
        }
        catch (err) {
            throw err;
        }
    }
    // Load file for browser environments
    static async browserLoadContextFileAsBytes(file) {
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
    }
    // Convert Bytes into a temporary file (Buffer for nodejs), as it will be submitted through multipart to a server, file does not need to be saved
    static async bytesToTempFile(data) {
        this.validateContextBytes(data);
        if (typeof window === "undefined") {
            // Node.js environment
            const { Buffer } = await import("buffer");
            const buffer = Buffer.from(data);
            return buffer;
        }
        else {
            // Browser environment
            throw new Error("File creation in the browser is not supported by this function.");
        }
    }
    static async bytesToFile(data) {
        this.validateContextBytes(data);
        if (typeof window === "undefined") {
            throw new Error("File creation in NodeJS env is not supported by this function.");
        }
        else {
            // Browser environment
            const blob = new Blob([data]);
            return new File([blob], "context.bin");
        }
    }
    static MAX_CONTEXT_SIZE = 4096;
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
