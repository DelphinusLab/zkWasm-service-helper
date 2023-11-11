"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelphinusWalletProvider = exports.DelphinusReadOnlyProvider = exports.DelphinusBrowserProvider = exports.GetBaseProvider = exports.DelphinusSigner = exports.DelphinusProvider = void 0;
const ethers_1 = require("ethers");
const client_js_1 = require("./client.js");
class DelphinusProvider {
    constructor(provider) {
        this.provider = provider;
    }
    // Subscribe to provider level events such as a new block
    subscribeEvent(eventName, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.on(eventName, cb);
        });
    }
    // Read only version of contract
    getContractWithoutSigner(contractAddress, abi) {
        return new client_js_1.DelphinusContract(contractAddress, abi, this.provider);
    }
}
exports.DelphinusProvider = DelphinusProvider;
// Signer class is to sign transactions from a node client (non-browser environment)
// Requires private key
class DelphinusSigner {
    constructor(signer) {
        this.signer = signer;
    }
    get provider() {
        return this.signer.provider;
    }
    // Subscribe to provider level events such as a new block
    subscribeEvent(eventName, cb) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.provider) === null || _a === void 0 ? void 0 : _a.on(eventName, cb);
        });
    }
    // Contract instance with signer attached
    getContractWithSigner(contractAddress, abi) {
        return new client_js_1.DelphinusContract(contractAddress, abi, this.signer);
    }
}
exports.DelphinusSigner = DelphinusSigner;
// GetBaseProvider is a helper function to get a provider from a url
function GetBaseProvider(providerUrl) {
    if (providerUrl.startsWith("ws")) {
        return new ethers_1.WebSocketProvider(providerUrl);
    }
    else {
        return new ethers_1.JsonRpcProvider(providerUrl);
    }
}
exports.GetBaseProvider = GetBaseProvider;
// BrowserProvider implementation is exclusively for browser wallets such as MetaMask which implements EIP-1193
class DelphinusBrowserProvider extends DelphinusProvider {
    constructor() {
        if (!window.ethereum) {
            throw "MetaMask not installed, Browser mode is not available.";
        }
        // https://eips.ethereum.org/EIPS/eip-1193#summary
        super(new ethers_1.BrowserProvider(window.ethereum));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let address = (yield this.provider.getSigner()).address;
            return address;
        });
    }
    close() {
        this.provider.destroy();
    }
    onAccountChange(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            this.subscribeEvent("accountsChanged", cb);
        });
    }
    getNetworkId() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.provider.getNetwork()).chainId;
        });
    }
    getJsonRpcSigner() {
        return __awaiter(this, void 0, void 0, function* () {
            let signer = yield this.provider.getSigner();
            return signer;
        });
    }
    getContractWithSigner(contractAddress, abi) {
        return __awaiter(this, void 0, void 0, function* () {
            return new client_js_1.DelphinusContract(contractAddress, abi, yield this.getJsonRpcSigner());
        });
    }
    switchNet(chainHexId) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = yield this.getNetworkId();
            let idHex = "0x" + id.toString(16);
            console.log("switch chain", idHex, chainHexId);
            if (idHex != chainHexId) {
                try {
                    yield this.provider.send("wallet_switchEthereumChain", [
                        { chainId: chainHexId },
                    ]);
                }
                catch (e) {
                    // throw switch chain error to the caller
                    throw e;
                }
            }
        });
    }
    // Wrapper for personal_sign method
    sign(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let signer = yield this.provider.getSigner();
            return yield signer.signMessage(message);
        });
    }
}
exports.DelphinusBrowserProvider = DelphinusBrowserProvider;
// Read only provider mode for node client (non-browser environment) when no private key is provided
class DelphinusReadOnlyProvider extends DelphinusProvider {
    constructor(providerUrl) {
        super(GetBaseProvider(providerUrl));
    }
}
exports.DelphinusReadOnlyProvider = DelphinusReadOnlyProvider;
// Wallet provider is for node client (non-browser environment) with functionality to sign transactions
class DelphinusWalletProvider extends DelphinusSigner {
    constructor(privateKey, provider) {
        super(new ethers_1.Wallet(privateKey, provider));
    }
    get provider() {
        // will never be null as we are passing in a provider in the constructor
        return this.signer.provider;
    }
    // Simulate a call to a contract method on the current blockchain state
    call(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signer.call(req);
        });
    }
}
exports.DelphinusWalletProvider = DelphinusWalletProvider;
