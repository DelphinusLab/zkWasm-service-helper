import { ZkWasmServiceHelper } from "../../helper/service-helper.js";
export class SignedRequest {
    helper;
    user_address;
    // Nonce not necessary for every request, usually included for requests which modify state
    nonce;
    signature;
    constructor(service_url, user_address) {
        this.user_address = user_address;
        this.helper = new ZkWasmServiceHelper(service_url, "", "");
    }
    async fetchNonce() {
        const response = await this.helper.queryUser({
            user_address: this.user_address,
        });
        this.setNonce(response.nonce);
        return response.nonce;
    }
    // Allow setting custom nonce
    setNonce(nonce) {
        this.nonce = nonce;
    }
    setSignature(signature) {
        this.signature = signature;
    }
}
