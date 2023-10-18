import BN from "bn.js";
import { Md5 } from "ts-md5";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams, LogQuery } from "interface/interface";
import { Contract } from "web3-eth-contract";
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'



export class ZkWasmUtil {
    static contract_abi = {
        "contractName": "AggregatorVerifier",
        "abi": [
          {
            "inputs": [
              {
                "internalType": "contract AggregatorVerifierCoreStep[]",
                "name": "_steps",
                "type": "address[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "uint256[]",
                "name": "proof",
                "type": "uint256[]"
              },
              {
                "internalType": "uint256[]",
                "name": "verify_instance",
                "type": "uint256[]"
              },
              {
                "internalType": "uint256[]",
                "name": "aux",
                "type": "uint256[]"
              },
              {
                "internalType": "uint256[][]",
                "name": "target_instance",
                "type": "uint256[][]"
              }
            ],
            "name": "verify",
            "outputs": [],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          }
        ],
      }  

    static hexToBNs(hexString: string): Array<BN> {
        let bytes = new Array(Math.ceil(hexString.length / 16));
        for (var i = 0; i < hexString.length; i += 16) {
            bytes[i] = new BN(hexString.slice(i, Math.min(i + 16, hexString.length)), 16);
        }
        return bytes;
    }
    static parseArg(input: string): Array<BN> | null {
        let inputArray = input.split(":");
        let value = inputArray[0];
        let type = inputArray[1];
        let re1 = new RegExp(/^[0-9A-Fa-f]+$/); // hexdecimal
        let re2 = new RegExp(/^\d+$/); // decimal

        // Check if value is a number
        if (!(re1.test(value.slice(2)) || re2.test(value))) {
            console.log("Error: input value is not an interger number");
            return null;
        }

        // Convert value byte array
        if (type == "i64") {
            let v: BN;
            if (value.slice(0, 2) == "0x") {
                v = new BN(value.slice(2), 16);
            } else {
                v = new BN(value);
            }
            return [v];
        } else if (type == "bytes" || type == "bytes-packed") {
            if (value.slice(0, 2) != "0x") {
                console.log("Error: bytes input need start with 0x");
                return null;
            }
            let bytes = ZkWasmUtil.hexToBNs(value.slice(2));
            return bytes;
        } else {
            console.log("Unsupported input data type: %s", type);
            return null;
        }
    }
    static parseArgs(public_inputs: string[]) : (BN | null)[] {
        return public_inputs.map(input => ZkWasmUtil.parseArg(input.trim())).flat();
    }

    static parseArgs(raw: Array<string>): Array<BN> {
        let parsedInputs = new Array();
        for (var input of raw) {
            input = input.trim();
            if (input !== "") {
                let args = ZkWasmUtil.parseArg(input);
                if (args != null) {
                    parsedInputs.push(args);
                } else {
                    throw Error(`invalid args in ${input}`);
                }
            }
        }
        return parsedInputs.flat();
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
            let a = new BN(chunk, 'le');
            bns.push(a);
            // do whatever
        }
        return bns;
    }
    static composeVerifyContract(web3: Web3, verifier_addr: string, from_addr: string): Contract {
        let verify_contract = new web3.eth.Contract(
            ZkWasmUtil.contract_abi.abi as AbiItem[],
            verifier_addr,
            {
              from: from_addr,
            }
          );
          
          return verify_contract;
    }

    static async verifyProof(verify_contract: Contract, params: VerifyProofParams) {
        let aggregate_proof = ZkWasmUtil.bytesToBN(params.aggregate_proof);
        let batchInstances = ZkWasmUtil.bytesToBN(params.batch_instances);
        let aux = ZkWasmUtil.bytesToBN(params.aux);
        let args = ZkWasmUtil.parseArgs(params.public_inputs).map((x) => x.toString(10));
        console.log("args are:", args);
        if (args.length == 0) {
            args = ["0x0"];
        }

        let result = await verify_contract.methods
            .verify(aggregate_proof, batchInstances, aux, [args])
            .send();
        return result;
    }
}