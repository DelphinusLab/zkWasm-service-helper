import BN from "bn.js";
import { Md5 } from "ts-md5";
import {
  AddImageParams,
  ProvingParams,
  DeployParams,
  ResetImageParams,
  ModifyImageParams,
  VerifyProofParams,
  LogQuery,
  ContextHexString,
  InputContextType,
} from "../interface/interface.js";
import { Contract, formatUnits, Wallet } from "ethers";
import {
  DelphinusWalletConnector,
  DelphinusBrowserConnector,
} from "web3subscriber/src/provider.js";
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

  static hexToBNs(hexString: string): Array<BN> {
    let bytes = new Array(Math.ceil(hexString.length / 16));
    for (var i = 0; i < hexString.length; i += 16) {
      bytes[i] = new BN(
        hexString.slice(i, Math.min(i + 16, hexString.length)),
        16
      );
    }
    return bytes;
  }

  static validateBytesInput(value: string) {
    this.validateHex(value);
    // Check the length of the hexdecimal is even
    if (value.length % 2 != 0) {
      throw new Error("Odd Hex length provided: " + value);
    }
    return true;
  }

  static validateI64HexInput(value: string) {
    this.validateHex(value);
    return true;
  }

  static validateHex(value: string) {
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

  static validateInput(input: string) {
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
    } else if (type == "bytes" || type == "bytes-packed") {
      this.validateBytesInput(value);
    } else {
      throw new Error("Invalid input type: " + type);
    }
  }

  // Inputs are strings that should be of the form 32:i64, 0x1234:bytes or 0x1234:bytes-packed and split by spaces
  static validateInputs(inputs: string): Array<string> {
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

  static isHexString(value: string) {
    let re = new RegExp(/^[0-9A-Fa-f]+$/);
    // Check if value is a hexdecimal
    if (!re.test(value)) {
      return false;
    }
    return true;
  }

  static convertToMd5(value: Uint8Array): string {
    let md5 = new Md5();
    md5.appendByteArray(value);
    let hash = md5.end();
    if (!hash) return "";
    return hash.toString();
  }

  static convertAmount(balance: Uint8Array): string {
    let amt = new BN(balance, 10, "le").toString();
    return formatUnits(amt, "ether");
  }

  static createLogsMesssage(params: LogQuery): string {
    return JSON.stringify(params);
  }

  //this is form data
  static createAddImageSignMessage(params: AddImageParams): string {
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

  static createProvingSignMessage(params: ProvingParams): string {
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
    if (
      params.input_context_type === InputContextType.Custom &&
      params.input_context
    ) {
      message += params.input_context_md5;
    }
    if (params.input_context_type) {
      message += params.input_context_type;
    }

    return message;
  }

  static createDeploySignMessage(params: DeployParams): string {
    return JSON.stringify(params);
  }

  static createResetImageMessage(params: ResetImageParams): string {
    let message = "";
    message += params.md5;
    message += params.circuit_size;
    message += params.user_address;
    if (params.reset_context) {
      message += params.reset_context_md5;
    }
    return message;
  }

  static createModifyImageMessage(params: ModifyImageParams): string {
    return JSON.stringify(params);
  }

  static bytesToBN(data: Uint8Array, chunksize: number = 32): BN[] {
    let bns = [];
    for (let i = 0; i < data.length; i += chunksize) {
      const chunk = data.slice(i, i + chunksize);
      let a = new BN(chunk, "le");
      bns.push(a);
      // do whatever
    }
    return bns;
  }

  static bnToHexString(bn: BN): string {
    return "0x" + bn.toString("hex");
  }

  static bytesToHexStrings(data: Uint8Array, chunksize: number = 32): string[] {
    let hexStrings = [];
    let bns = this.bytesToBN(data, chunksize);
    for (let i = 0; i < bns.length; i++) {
      hexStrings.push(this.bnToHexString(bns[i]));
    }
    return hexStrings;
  }

  static bnToBytes(bn: BN, chunksize: number = 32): Uint8Array {
    // Check if the BN is more than expected chunksize bytes
    if (bn.byteLength() > chunksize) {
      throw new Error(
        "BN is too large for the specified chunksize: " + bn.toString(10)
      );
    }

    return new Uint8Array(bn.toArray("le", chunksize));
  }

  static hexStringToBN(hexString: string): BN {
    // Should begin with 0x
    this.validateHex(hexString);

    return new BN(hexString.slice(2), 16);
  }

  static hexStringsToBytes(
    hexStrings: string[],
    chunksize: number
  ): Uint8Array {
    let bytes = new Uint8Array(chunksize * hexStrings.length);
    for (let i = 0; i < hexStrings.length; i++) {
      let bn = this.hexStringToBN(hexStrings[i]);
      let byte = this.bnToBytes(bn, chunksize);
      bytes.set(byte, i * chunksize);
    }
    return bytes;
  }

  static bytesToBigIntArray(
    data: Uint8Array,
    chunksize: number = 32
  ): BigInt[] {
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
  static composeVerifyContract(
    signer: DelphinusBrowserConnector | DelphinusWalletConnector,
    verifier_addr: string
  ) {
    return signer.getContractWithSigner(verifier_addr, this.contract_abi.abi);
  }

  static async verifyProof(
    verify_contract: Contract,
    params: VerifyProofParams
  ) {
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

    let result = await verify_contract.verify.send(
      aggregate_proof,
      batchInstances,
      aux,
      [instances]
    );
    return result;
  }

  static async signMessage(message: string, priv_key: string) {
    let wallet = new Wallet(priv_key, null);
    let signature = await wallet.signMessage(message);
    return signature;
  }

  static bytesToJSONString(data: Uint8Array): string {
    const bufferView = new Uint8Array(data);
    return new TextDecoder().decode(bufferView);
  }

  static ERC20Contract(contractAddress: string) {
    return new Contract(contractAddress, ERC20);
  }

  // For nodejs/server environments only
  static async loadContextFileFromPath(
    filePath: string
  ): Promise<ContextHexString> {
    if (typeof window === "undefined") {
      // We are in Node.js
      const fs = require("fs");
      //const fs = await import("fs").then((module) => module.promises);
      return fs.readFile(filePath, "utf8");
    } else {
      // Browser environment
      throw new Error(
        "File loading in the browser is not supported by this function."
      );
    }
  }

  // For nodejs/server environments only
  static async loadContexFileAsBytes(filePath: string): Promise<Uint8Array> {
    try {
      const fileContents = await this.loadContextFileFromPath(filePath);
      let bytes = new TextEncoder().encode(fileContents);
      this.validateContextBytes(bytes);
      return bytes;
    } catch (err) {
      throw err;
    }
  }

  // Load file for browser environments
  static async browserLoadContextFileAsBytes(file: File): Promise<Uint8Array> {
    if (typeof window === "undefined") {
      // We are in Node.js
      throw new Error(
        "File loading in Node.js is not supported by this function."
      );
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        if (reader.result) {
          try {
            ZkWasmUtil.validateContextBytes(
              new Uint8Array(reader.result as ArrayBuffer)
            );
            resolve(new Uint8Array(reader.result as ArrayBuffer));
          } catch (err) {
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

  static MAX_CONTEXT_SIZE = 4096;

  // Validate bytes are a multiple of 8 bytes (64 bits) and length less than 4KB
  static validateContextBytes(data: Uint8Array): boolean {
    if (data.length > this.MAX_CONTEXT_SIZE) {
      throw new Error("File size must be less than 4KB");
    }
    if (data.length % 8 != 0) {
      throw new Error("File size must be a multiple of 8 bytes (64 bits)");
    }
    return true;
  }
}
