import { SignedRequest } from "./shared.js";
export class ModifyRequest extends SignedRequest {
    md5;
    description_url;
    avator_url;
    constructor(service_url, params, user_address) {
        super(service_url, user_address);
        this.md5 = params.md5;
    }
    async createSignMessage() {
        const nonce = await this.fetchNonce();
        this.nonce = nonce;
        // No need to sign the file itself, just the md5
        return this.createSignMessageFromFields();
    }
    createSignMessageFromFields() {
        let message = JSON.stringify({
            user_address: this.user_address,
            nonce: this.nonce,
            md5: this.md5,
            description_url: this.description_url,
            avator_url: this.avator_url,
        });
        return message;
    }
    createSignedTaskParams() {
        return {
            user_address: this.user_address,
            nonce: this.nonce,
            md5: this.md5,
            description_url: this.description_url || "",
            avator_url: this.avator_url || "",
            signature: this.signature,
        };
    }
    async submitTask() {
        return await this.helper.modifyImage(this.createSignedTaskParams());
    }
}
