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
exports.withDelphinusWalletProvider = exports.withReadOnlyProvider = exports.withBrowserProvider = exports.DelphinusContract = void 0;
const ethers_1 = require("ethers");
const provider_js_1 = require("./provider.js");
class DelphinusContract {
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
        this.contract = new ethers_1.Contract(contractAddress, jsonInterface, signerOrProvider);
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
    getPastEventsFrom(fromBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.queryFilter("*", fromBlock);
        });
    }
    getPastEventsFromTo(fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.queryFilter("*", fromBlock, toBlock);
        });
    }
    getPastEventsFromSteped(fromBlock, toBlock, step) {
        return __awaiter(this, void 0, void 0, function* () {
            let pastEvents = [];
            let start = fromBlock;
            let end = 0;
            if (fromBlock > toBlock) {
                console.log("No New Blocks Found From:" + fromBlock);
                return { events: [], breakpoint: null };
            }
            if (step <= 0) {
                pastEvents.push(yield this.getPastEventsFromTo(start, toBlock));
                end = toBlock;
                console.log("getEvents from", start, "to", end);
            }
            else {
                let count = 0;
                while (end < toBlock && count < 10) {
                    end = start + step - 1 < toBlock ? start + step - 1 : toBlock;
                    console.log("getEvents from", start, "to", end);
                    let group = yield this.getPastEventsFromTo(start, end);
                    if (group.length != 0) {
                        pastEvents.push(group);
                    }
                    start += step;
                    count++;
                }
            }
            return { events: pastEvents, breakpoint: end };
        });
    }
}
exports.DelphinusContract = DelphinusContract;
function withBrowserProvider(cb) {
    return __awaiter(this, void 0, void 0, function* () {
        let provider = new provider_js_1.DelphinusBrowserProvider();
        try {
            return yield cb(provider);
        }
        catch (e) {
            throw e;
        }
    });
}
exports.withBrowserProvider = withBrowserProvider;
// For read-only purposes without private key, we can use a provider to read the blockchain state
function withReadOnlyProvider(cb, providerUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let provider = new provider_js_1.DelphinusReadOnlyProvider(providerUrl);
        try {
            return yield cb(provider);
        }
        catch (e) {
            throw e;
        }
    });
}
exports.withReadOnlyProvider = withReadOnlyProvider;
// For non browser mode, we need to provide a private key to sign transactions
// Provider is required to read the blockchain state
// Wrap ethers wallet implementation to provide a unified interface and necessary methods
function withDelphinusWalletProvider(cb, provider, privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let wallet = new provider_js_1.DelphinusWalletProvider(privateKey, provider);
        try {
            return yield cb(wallet);
        }
        catch (e) {
            throw e;
        }
    });
}
exports.withDelphinusWalletProvider = withDelphinusWalletProvider;
