import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams } from "interface/interface";
import { Contract } from "web3-eth-contract";
import Web3 from 'web3';
export declare class ZkWasmUtil {
    static contract_abi: {
        contractName: string;
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
            constant?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: never[];
            stateMutability: string;
            type: string;
            constant: boolean;
        })[];
    };
    static hexToBNs(hexString: string): Array<BN>;
    static parseArg(input: string): Array<BN> | null;
    static parseArgs(raw: Array<string>): Array<BN>;
    static convertToMd5(value: Uint8Array): string;
    static createAddImageSignMessage(params: AddImageParams): string;
    static createProvingSignMessage(params: ProvingParams): string;
    static createDeploySignMessage(params: DeployParams): string;
    static createResetImageMessage(params: ResetImageParams): string;
    static createModifyImageMessage(params: ModifyImageParams): string;
    static bytesToBN(data: Uint8Array): BN[];
    static composeVerifyContract(web3: Web3, verifier_addr: string, from_addr: string): Contract;
    static verifyProof(verify_contract: Contract, params: VerifyProofParams): Promise<any>;
}
