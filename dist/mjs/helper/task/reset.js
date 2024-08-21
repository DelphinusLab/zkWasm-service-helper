import { SignedRequest } from "./shared.js";
export class ResetTask extends SignedRequest {
    md5;
    circuit_size;
    prove_payment_src;
    auto_submit_network_ids;
    reset_context;
    reset_context_md5;
    constructor(service_url, params, user_address) {
        super(service_url, user_address);
        this.md5 = params.md5;
        this.circuit_size = params.circuit_size;
        this.prove_payment_src = params.prove_payment_src;
        this.auto_submit_network_ids = params.auto_submit_network_ids;
    }
    async createSignMessage() {
        const nonce = await this.fetchNonce();
        this.nonce = nonce;
        // No need to sign the file itself, just the md5
        return this.createSignMessageFromFields();
    }
    createSignMessageFromFields() {
        let message = "";
        message += this.user_address;
        message += this.nonce;
        message += this.md5;
        message += this.circuit_size;
        message += this.prove_payment_src;
        for (const chainId of this.auto_submit_network_ids) {
            message += chainId;
        }
        if (this.reset_context) {
            message += this.reset_context_md5;
        }
        return message;
    }
    createSignedTaskParams() {
        return {
            user_address: this.user_address,
            nonce: this.nonce,
            md5: this.md5,
            circuit_size: this.circuit_size,
            prove_payment_src: this.prove_payment_src,
            auto_submit_network_ids: this.auto_submit_network_ids,
            signature: this.signature,
        };
    }
    async submitTask() {
        return await this.helper.addResetTask(this.createSignedTaskParams());
    }
}
