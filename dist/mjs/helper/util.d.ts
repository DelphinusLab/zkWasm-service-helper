import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams, LogQuery } from "../interface/interface.js";
import { Contract } from "ethers";
import { DelphinusBrowserProvider, DelphinusWalletProvider } from "./provider.js";
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
    static createLogsMesssage(params: LogQuery): string;
    static createAddImageSignMessage(params: AddImageParams): string;
    static createProvingSignMessage(params: ProvingParams): string;
    static createDeploySignMessage(params: DeployParams): string;
    static createResetImageMessage(params: ResetImageParams): string;
    static createModifyImageMessage(params: ModifyImageParams): string;
    static bytesToBN(data: Uint8Array): BN[];
    static bytesToBigIntArray(data: Uint8Array): BigInt[];
    static composeVerifyContract(signer: DelphinusBrowserProvider | DelphinusWalletProvider, verifier_addr: string): import("./client.js").DelphinusContract | Promise<import("./client.js").DelphinusContract>;
    static verifyProof(verify_contract: Contract, params: VerifyProofParams): Promise<import("ethers").ContractTransactionResponse>;
}
