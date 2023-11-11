import { InterfaceAbi, AbstractProvider, WebSocketProvider, JsonRpcProvider, AbstractSigner, Eip1193Provider, BrowserProvider, JsonRpcSigner, Wallet, TransactionRequest } from "ethers";
import { DelphinusContract } from "./client.js";
export declare abstract class DelphinusProvider<T extends AbstractProvider> {
    readonly provider: T;
    constructor(provider: T);
    subscribeEvent<T>(eventName: string, cb: (event: T) => unknown): Promise<T>;
    getContractWithoutSigner(contractAddress: string, abi: InterfaceAbi): DelphinusContract;
}
export declare abstract class DelphinusSigner<T extends AbstractSigner> {
    readonly signer: T;
    constructor(signer: T);
    get provider(): import("ethers").Provider | null;
    subscribeEvent<T>(eventName: string, cb: (event: T) => unknown): Promise<import("ethers").Provider | undefined>;
    getContractWithSigner(contractAddress: string, abi: InterfaceAbi): DelphinusContract;
}
export type DelphinusBaseProvider = WebSocketProvider | JsonRpcProvider;
export declare function GetBaseProvider(providerUrl: string): WebSocketProvider | JsonRpcProvider;
declare global {
    interface Window {
        ethereum?: Eip1193Provider;
    }
}
export declare class DelphinusBrowserProvider extends DelphinusProvider<BrowserProvider> {
    constructor();
    connect(): Promise<string>;
    close(): void;
    onAccountChange<T>(cb: (account: string) => T): Promise<void>;
    getNetworkId(): Promise<bigint>;
    getJsonRpcSigner(): Promise<JsonRpcSigner>;
    getContractWithSigner(contractAddress: string, abi: InterfaceAbi): Promise<DelphinusContract>;
    switchNet(chainHexId: string): Promise<void>;
    sign(message: string): Promise<string>;
}
export declare class DelphinusReadOnlyProvider extends DelphinusProvider<DelphinusBaseProvider> {
    constructor(providerUrl: string);
}
export declare class DelphinusWalletProvider extends DelphinusSigner<Wallet> {
    constructor(privateKey: string, provider: DelphinusBaseProvider);
    get provider(): import("ethers").Provider;
    call(req: TransactionRequest): Promise<string>;
}
