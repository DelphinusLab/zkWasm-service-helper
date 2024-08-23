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
exports.SignedRequest = void 0;
const service_helper_js_1 = require("../service-helper.js");
class SignedRequest {
    constructor(service_url, user_address) {
        this.user_address = user_address.toLowerCase();
        this.helper = new service_helper_js_1.ZkWasmServiceHelper(service_url, "", "");
    }
    fetchNonce() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.helper.queryUser({
                user_address: this.user_address,
            });
            this.setNonce(response.nonce);
            return response.nonce;
        });
    }
    // Allow setting custom nonce
    setNonce(nonce) {
        this.nonce = nonce;
    }
    setSignature(signature) {
        this.signature = signature;
    }
}
exports.SignedRequest = SignedRequest;
