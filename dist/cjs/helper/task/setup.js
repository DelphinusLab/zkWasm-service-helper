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
exports.SetupTask = void 0;
const service_helper_1 = require("../service-helper");
const shared_1 = require("./shared");
class SetupTask extends shared_1.SignedRequest {
    constructor(params, user_address, nonce) {
        super(user_address);
        this.nonce = nonce;
        this.md5 = params.image_md5;
        this.image_name = params.name;
        this.description_url = params.description_url;
        this.avator_url = params.avator_url;
        this.circuit_size = params.circuit_size;
        this.prove_payment_src = params.prove_payment_src;
        this.auto_submit_network_ids = params.auto_submit_network_ids;
        this.wasm_bytes = params.image;
    }
    requiresNonce() {
        return true;
    }
    createSignMessage() {
        // No need to sign the file itself, just the md5
        let message = "";
        message += this.user_address;
        message += this.nonce;
        message += this.image_name;
        message += this.md5;
        message += this.description_url;
        message += this.avator_url;
        message += this.circuit_size;
        message += this.prove_payment_src;
        for (const chainId of this.auto_submit_network_ids) {
            message += chainId;
        }
        // Additional params afterwards
        // if (this.initial_context) {
        //   message += this.initial_context_md5;
        // }
        return message;
    }
    createSignedTaskParams() {
        return {
            user_address: this.user_address,
            nonce: this.nonce,
            image: this.wasm_bytes,
            image_md5: this.md5,
            name: this.image_name,
            description_url: this.description_url || "",
            avator_url: this.avator_url || "",
            circuit_size: this.circuit_size,
            prove_payment_src: this.prove_payment_src,
            auto_submit_network_ids: this.auto_submit_network_ids,
            signature: this.signature,
        };
    }
    submitTask(server_url) {
        return __awaiter(this, void 0, void 0, function* () {
            const helper = new service_helper_1.ZkWasmServiceHelper(server_url, "", "");
            return yield helper.addNewWasmImage(this.createSignedTaskParams());
        });
    }
}
exports.SetupTask = SetupTask;
