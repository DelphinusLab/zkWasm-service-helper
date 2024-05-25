import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams, ResetImageParams, ModifyImageParams, VerifyProofParams, LogQuery, ContextHexString, VerifyBatchProofParams } from "../interface/interface.js";
import { Contract, Signer } from "ethers";
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
    static batch_verifier_contract: {
        contract_name: string;
        abi: ({
            type: string;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name?: undefined;
            outputs?: undefined;
            stateMutability?: undefined;
            anonymous?: undefined;
        } | {
            type: string;
            name: string;
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            outputs: never[];
            stateMutability: string;
            anonymous?: undefined;
        } | {
            type: string;
            name: string;
            inputs: {
                name: string;
                type: string;
                indexed: boolean;
            }[];
            anonymous: boolean;
            outputs?: undefined;
            stateMutability?: undefined;
        })[];
    };
    static hexToBNs(hexString: string): Array<BN>;
    static validateBytesInput(value: string): boolean;
    static validateI64HexInput(value: string): boolean;
    static validateHex(value: string): boolean;
    static validateInput(input: string): void;
    static validateInputs(inputs: string): Array<string>;
    static isHexString(value: string): boolean;
    static convertToMd5(value: Uint8Array): string;
    static convertAmount(balance: Uint8Array): string;
    static createLogsMesssage(params: LogQuery): string;
    static createAddImageSignMessage(params: AddImageParams): string;
    static createProvingSignMessage(params: ProvingParams): string;
    static createDeploySignMessage(params: DeployParams): string;
    static createResetImageMessage(params: ResetImageParams): string;
    static createModifyImageMessage(params: ModifyImageParams): string;
    static bytesToBN(data: Uint8Array, chunksize?: number): BN[];
    static bnToHexString(bn: BN): string;
    static bytesToHexStrings(data: Uint8Array, chunksize?: number): string[];
    static bnToBytes(bn: BN, chunksize?: number): Uint8Array;
    static hexStringToBN(hexString: string): BN;
    static hexStringsToBytes(hexStrings: string[], chunksize: number): Uint8Array;
    static bytesToBigIntArray(data: Uint8Array, chunksize?: number): BigInt[];
    static composeVerifyContract(signer: DelphinusBrowserConnector | DelphinusWalletConnector, verifier_addr: string): import("web3subscriber/src/client.js").DelphinusContract | Promise<import("web3subscriber/src/client.js").DelphinusContract>;
    static verifyProof(verify_contract: Contract, params: VerifyProofParams): Promise<import("ethers").ContractTransactionResponse>;
    static composeBatchVerifierContract(signer: DelphinusBrowserConnector | DelphinusWalletConnector, verifier_addr: string): import("web3subscriber/src/client.js").DelphinusContract | Promise<import("web3subscriber/src/client.js").DelphinusContract>;
    static verifyBatchedProof(batch_verifier_contract: Contract, params: VerifyBatchProofParams): Promise<import("ethers").ContractTransactionResponse>;
    static signMessage(message: string, priv_key: string): Promise<string>;
    static ERC20Contract(contractAddress: string, signer: Signer): Contract;
    static bytesToJSONString(data: Uint8Array): string;
    static loadContextFileFromPath(filePath: string): Promise<ContextHexString>;
    static loadContexFileAsBytes(filePath: string): Promise<Uint8Array>;
    static browserLoadContextFileAsBytes(file: File): Promise<Uint8Array>;
    static MAX_CONTEXT_SIZE: number;
    static validateContextBytes(data: Uint8Array): boolean;
}
