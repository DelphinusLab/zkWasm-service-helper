"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedRequest = void 0;
class SignedRequest {
    constructor(user_address) {
        this.user_address = user_address;
    }
    setSignature(signature) {
        this.signature = signature;
    }
}
exports.SignedRequest = SignedRequest;
