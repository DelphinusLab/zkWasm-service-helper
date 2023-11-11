import { Contract } from "ethers";
import { DelphinusBrowserProvider, DelphinusReadOnlyProvider, DelphinusWalletProvider, } from "./provider.js";
export class DelphinusContract {
    contract;
    jsonInterface;
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
    constructor(contractAddress, jsonInterface, signerOrProvider) {
        this.jsonInterface = jsonInterface;
        this.contract = new Contract(contractAddress, jsonInterface, signerOrProvider);
    }
    getEthersContract() {
        return this.contract;
    }
    getJsonInterface() {
        return this.jsonInterface;
    }
    // Subscribe to events emitted by the contract
    subscribeEvent(eventName, cb) {
        return this.contract.on(eventName, cb);
    }
    async getPastEventsFrom(fromBlock) {
        return await this.contract.queryFilter("*", fromBlock);
    }
    async getPastEventsFromTo(fromBlock, toBlock) {
        return await this.contract.queryFilter("*", fromBlock, toBlock);
    }
    async getPastEventsFromSteped(fromBlock, toBlock, step) {
        let pastEvents = [];
        let start = fromBlock;
        let end = 0;
        if (fromBlock > toBlock) {
            console.log("No New Blocks Found From:" + fromBlock);
            return { events: [], breakpoint: null };
        }
        if (step <= 0) {
            pastEvents.push(await this.getPastEventsFromTo(start, toBlock));
            end = toBlock;
            console.log("getEvents from", start, "to", end);
        }
        else {
            let count = 0;
            while (end < toBlock && count < 10) {
                end = start + step - 1 < toBlock ? start + step - 1 : toBlock;
                console.log("getEvents from", start, "to", end);
                let group = await this.getPastEventsFromTo(start, end);
                if (group.length != 0) {
                    pastEvents.push(group);
                }
                start += step;
                count++;
            }
        }
        return { events: pastEvents, breakpoint: end };
    }
}
export async function withBrowserProvider(cb) {
    let provider = new DelphinusBrowserProvider();
    try {
        return await cb(provider);
    }
    catch (e) {
        throw e;
    }
}
// For read-only purposes without private key, we can use a provider to read the blockchain state
export async function withReadOnlyProvider(cb, providerUrl) {
    let provider = new DelphinusReadOnlyProvider(providerUrl);
    try {
        return await cb(provider);
    }
    catch (e) {
        throw e;
    }
}
// For non browser mode, we need to provide a private key to sign transactions
// Provider is required to read the blockchain state
// Wrap ethers wallet implementation to provide a unified interface and necessary methods
export async function withDelphinusWalletProvider(cb, provider, privateKey) {
    let wallet = new DelphinusWalletProvider(privateKey, provider);
    try {
        return await cb(wallet);
    }
    catch (e) {
        throw e;
    }
}
