import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams } from "interface/interface";
import { Contract } from "web3-eth-contract";
export declare class ZkWasmUtil {
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
    static verifyProof(verify_contract: Contract, params: VerifyProofParams): Promise<any>;
}
