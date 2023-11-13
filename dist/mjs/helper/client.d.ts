import { Contract, Signer, Provider, InterfaceAbi } from "ethers";
import { DelphinusBaseProvider, DelphinusBrowserProvider, DelphinusProvider, DelphinusWalletProvider } from "./provider.js";
export declare class DelphinusContract {
    private readonly contract;
    private readonly jsonInterface;
    /**
     *
     * @param jsonInterface
     * This is the json interface of the contract.
     * @param contractAddress
     * This is the address of the contract.
     * @param signerOrProvider
     * If signer is provided, the contract will be connected to the signer as
     * If provider is provided, the contract will be read only.
     */
    constructor(contractAddress: string, jsonInterface: InterfaceAbi, signerOrProvider?: Signer | Provider);
    getEthersContract(): Contract;
    getJsonInterface(): InterfaceAbi;
    subscribeEvent<T>(eventName: string, cb: (event: T) => unknown): Promise<Contract>;
    getPastEventsFrom(fromBlock: number): Promise<(import("ethers").EventLog | import("ethers").Log)[]>;
    getPastEventsFromTo(fromBlock: number, toBlock: number): Promise<(import("ethers").EventLog | import("ethers").Log)[]>;
    getPastEventsFromSteped(fromBlock: number, toBlock: number, step: number): Promise<{
        events: never[];
        breakpoint: null;
    } | {
        events: (import("ethers").EventLog | import("ethers").Log)[][];
        breakpoint: number;
    }>;
}
export declare function withBrowserProvider<T>(cb: (prov: DelphinusBrowserProvider) => Promise<T>): Promise<T>;
export declare function withReadOnlyProvider<T>(cb: (prov: DelphinusProvider<DelphinusBaseProvider>) => Promise<T>, providerUrl: string): Promise<T>;
export declare function withDelphinusWalletProvider<T>(cb: (prov: DelphinusWalletProvider) => Promise<T>, provider: DelphinusBaseProvider, privateKey: string): Promise<T>;
