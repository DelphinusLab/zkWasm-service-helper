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
exports.ModifyRequest = void 0;
const shared_js_1 = require("./shared.js");
class ModifyRequest extends shared_js_1.SignedRequest {
    constructor(service_url, params, user_address) {
        super(service_url, user_address);
        this.md5 = params.md5;
        this.description_url = params.description_url;
        this.avator_url = params.avator_url;
    }
    createSignMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = yield this.fetchNonce();
            this.nonce = nonce;
            // No need to sign the file itself, just the md5
            return this.createSignMessageFromFields();
        });
    }
    createSignMessageFromFields() {
        let message = JSON.stringify({
            md5: this.md5,
            user_address: this.user_address,
            nonce: this.nonce,
            description_url: this.description_url,
            avator_url: this.avator_url,
        });
        return message;
    }
    createSignedTaskParams() {
        return {
            md5: this.md5,
            user_address: this.user_address,
            nonce: this.nonce,
            description_url: this.description_url || "",
            avator_url: this.avator_url || "",
            signature: this.signature,
        };
    }
    submitTask() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.helper.modifyImage(this.createSignedTaskParams());
        });
    }
}
exports.ModifyRequest = ModifyRequest;
