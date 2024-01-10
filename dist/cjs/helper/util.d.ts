import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams, LogQuery, ContextHexString } from "../interface/interface.js";
import { Contract } from "ethers";
import { DelphinusWalletConnector, DelphinusBrowserConnector } from "web3subscriber/src/provider.js";
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
    static validateHex(value: string): boolean;
    static validateInput(input: string): void;
    static validateInputs(inputs: string): Array<string>;
    static convertToMd5(value: Uint8Array): string;
    static convertAmount(balance: Uint8Array): string;
    static createLogsMesssage(params: LogQuery): string;
    static createAddImageSignMessage(params: AddImageParams): string;
    static createProvingSignMessage(params: ProvingParams): string;
    static createDeploySignMessage(params: DeployParams): string;
    static createResetImageMessage(params: ResetImageParams): string;
    static createModifyImageMessage(params: ModifyImageParams): string;
    static bytesToBN(data: Uint8Array, chunksize?: number): BN[];
    static bytesToBigIntArray(data: Uint8Array, chunksize?: number): BigInt[];
    static composeVerifyContract(signer: DelphinusBrowserConnector | DelphinusWalletConnector, verifier_addr: string): import("web3subscriber/src/client.js").DelphinusContract | Promise<import("web3subscriber/src/client.js").DelphinusContract>;
    static verifyProof(verify_contract: Contract, params: VerifyProofParams): Promise<import("ethers").ContractTransactionResponse>;
    static signMessage(message: string, priv_key: string): Promise<string>;
    private loadFileFromPath;
    loadFileAsBytes(filePath: string): Promise<Uint8Array>;
    uploadFileAsBytes(file: File): Promise<Uint8Array>;
    static validateContextBytes(data: Uint8Array): boolean;
    static stringifyContextBytes(data: Uint8Array): ContextHexString;
}
