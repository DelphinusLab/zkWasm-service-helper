import { WebSocketProvider, JsonRpcProvider, BrowserProvider, Wallet, } from "ethers";
import { DelphinusContract } from "./client.js";
export class DelphinusProvider {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    // Subscribe to provider level events such as a new block
    async subscribeEvent(eventName, cb) {
        return this.provider.on(eventName, cb);
    }
    // Read only version of contract
    getContractWithoutSigner(contractAddress, abi) {
        return new DelphinusContract(contractAddress, abi, this.provider);
    }
}
// Signer class is to sign transactions from a node client (non-browser environment)
// Requires private key
export class DelphinusSigner {
    signer;
    constructor(signer) {
        this.signer = signer;
    }
    get provider() {
        return this.signer.provider;
    }
    // Subscribe to provider level events such as a new block
    async subscribeEvent(eventName, cb) {
        return this.provider?.on(eventName, cb);
    }
    // Contract instance with signer attached
    getContractWithSigner(contractAddress, abi) {
        return new DelphinusContract(contractAddress, abi, this.signer);
    }
}
// GetBaseProvider is a helper function to get a provider from a url
export function GetBaseProvider(providerUrl) {
    if (providerUrl.startsWith("ws")) {
        return new WebSocketProvider(providerUrl);
    }
    else {
        return new JsonRpcProvider(providerUrl);
    }
}
// BrowserProvider implementation is exclusively for browser wallets such as MetaMask which implements EIP-1193
export class DelphinusBrowserProvider extends DelphinusProvider {
    constructor() {
        if (!window.ethereum) {
            throw "MetaMask not installed, Browser mode is not available.";
        }
        // https://eips.ethereum.org/EIPS/eip-1193#summary
        super(new BrowserProvider(window.ethereum));
    }
    async connect() {
        let address = (await this.provider.getSigner()).address;
        return address;
    }
    close() {
        this.provider.destroy();
    }
    async onAccountChange(cb) {
        this.subscribeEvent("accountsChanged", cb);
    }
    async getNetworkId() {
        return (await this.provider.getNetwork()).chainId;
    }
    async getJsonRpcSigner() {
        let signer = await this.provider.getSigner();
        return signer;
    }
    async getContractWithSigner(contractAddress, abi) {
        return new DelphinusContract(contractAddress, abi, await this.getJsonRpcSigner());
    }
    async switchNet(chainHexId) {
        let id = await this.getNetworkId();
        let idHex = "0x" + id.toString(16);
        console.log("switch chain", idHex, chainHexId);
        if (idHex != chainHexId) {
            try {
                await this.provider.send("wallet_switchEthereumChain", [
                    { chainId: chainHexId },
                ]);
            }
            catch (e) {
                // throw switch chain error to the caller
                throw e;
            }
        }
    }
    // Wrapper for personal_sign method
    async sign(message) {
        let signer = await this.provider.getSigner();
        return await signer.signMessage(message);
    }
}
// Read only provider mode for node client (non-browser environment) when no private key is provided
export class DelphinusReadOnlyProvider extends DelphinusProvider {
    constructor(providerUrl) {
        super(GetBaseProvider(providerUrl));
    }
}
// Wallet provider is for node client (non-browser environment) with functionality to sign transactions
export class DelphinusWalletProvider extends DelphinusSigner {
    constructor(privateKey, provider) {
        super(new Wallet(privateKey, provider));
    }
    get provider() {
        // will never be null as we are passing in a provider in the constructor
        return this.signer.provider;
    }
    // Simulate a call to a contract method on the current blockchain state
    async call(req) {
        return await this.signer.call(req);
    }
}
