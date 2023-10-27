import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams, LogQuery } from "interface/interface";
import { Contract } from "web3-eth-contract";
import Web3 from 'web3';
export declare class ZkWasmUtil {
    static contract_abi: {
        readonly contractName: "AggregatorVerifier";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract AggregatorVerifierCoreStep[]";
                readonly name: "_steps";
                readonly type: "address[]";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint256[]";
                readonly name: "proof";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "verify_instance";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "aux";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "uint256[][]";
                readonly name: "target_instance";
                readonly type: "uint256[][]";
            }];
            readonly name: "verify";
            readonly outputs: readonly [];
            readonly stateMutability: "view";
            readonly type: "function";
            readonly constant: true;
        }];
    };
    static hexToBNs(hexString: string): Array<BN>;
    static parseArg(input: string): Array<BN> | null;
    static parseArgs(raw: Array<string>): Array<BN>;
    static convertToMd5(value: Uint8Array): string;
    static createLogsMesssage(params: LogQuery): string;
    static createAddImageSignMessage(params: AddImageParams): string;
    static createProvingSignMessage(params: ProvingParams): string;
    static createDeploySignMessage(params: DeployParams): string;
    static createResetImageMessage(params: ResetImageParams): string;
    static createModifyImageMessage(params: ModifyImageParams): string;
    static bytesToBN(data: Uint8Array): BN[];
    static composeVerifyContract(web3: Web3, verifier_addr: string, from_addr: string): Contract<readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract AggregatorVerifierCoreStep[]";
            readonly name: "_steps";
            readonly type: "address[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "proof";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "verify_instance";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "aux";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[][]";
            readonly name: "target_instance";
            readonly type: "uint256[][]";
        }];
        readonly name: "verify";
        readonly outputs: readonly [];
        readonly stateMutability: "view";
        readonly type: "function";
        readonly constant: true;
    }]>;
    static verifyProof(verify_contract: any, params: VerifyProofParams): Promise<any>;
}
