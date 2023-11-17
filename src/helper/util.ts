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
} from "../interface/interface.js";
import { Contract } from "ethers";
import {
  DelphinusBrowserProvider,
  DelphinusWalletProvider,
} from "./provider.js";

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

  private static validateHex(value: string) {
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
        this.validateHex(value);
      }
      // If 0x is not present, check that it is a decimal
      else {
        if (!decimlaRegex.test(value)) {
          throw new Error("Invalid input value: " + input);
        }
      }
    } else if (type == "bytes" || type == "bytes-packed") {
      this.validateHex(value);
    } else {
      throw new Error("Invalid input type: " + type);
    }
  }

  // Inputs are strings that should be of the form 32:i64, 0x1234:bytes or 0x1234:bytes-packed and split by spaces
  static validateInputs(inputs: string): Array<string> {
    if (inputs === "") {
      return [];
    }
    // Split the inputs by spaces
    let inputArray = inputs.split(" ");
    // Iterate over the inputs
    inputArray.forEach((input) => {
      // Split the input by the colon
      this.validateInput(input);
    });
    // Return split inputs as an array
    return inputArray;
  }

  static convertToMd5(value: Uint8Array): string {
    let md5 = new Md5();
    md5.appendByteArray(value);
    let hash = md5.end();
    if (!hash) return "";
    return hash.toString();
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
    return message;
  }

  static createProvingSignMessage(params: ProvingParams): string {
    return JSON.stringify(params);
  }

  static createDeploySignMessage(params: DeployParams): string {
    return JSON.stringify(params);
  }

  static createResetImageMessage(params: ResetImageParams): string {
    return JSON.stringify(params);
  }

  static createModifyImageMessage(params: ModifyImageParams): string {
    return JSON.stringify(params);
  }

  static bytesToBN(data: Uint8Array): BN[] {
    let chunksize = 64;
    let bns = [];
    for (let i = 0; i < data.length; i += 32) {
      const chunk = data.slice(i, i + 32);
      let a = new BN(chunk, "le");
      bns.push(a);
      // do whatever
    }
    return bns;
  }

  static bytesToBigIntArray(data: Uint8Array): BigInt[] {
    const bigints = [];
    const chunkSize = 32; // Define the size of each chunk

    for (let i = 0; i < data.length; i += chunkSize) {
      // Slice the Uint8Array to get a 32-byte chunk
      const chunk = data.slice(i, i + chunkSize);
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
    signer: DelphinusBrowserProvider | DelphinusWalletProvider,
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
}
