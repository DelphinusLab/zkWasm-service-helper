import { TaskEndpoint } from "../../helper/service-helper.js";
import { SignedRequest } from "./shared.js";
export class ModifyRequest extends SignedRequest {
    md5;
    description_url;
    avator_url;
    constructor(service_url, params, user_address) {
        super(service_url, user_address);
        this.md5 = params.md5;
        this.description_url = params.description_url;
        this.avator_url = params.avator_url;
    }
    async createSignMessage() {
        const nonce = await this.fetchNonce();
        this.nonce = nonce;
        return this.createSignMessageFromFields();
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
    async submitTask(signature) {
        this.setSignature(signature);
        return await this.modifyImage(this.createSignedTaskParams());
    }
    async modifyImage(data) {
        let response = await this.helper.sendRequestWithSignature("POST", TaskEndpoint.MODIFY, data);
        if (this.helper.endpoint.enable_logs) {
            console.log("get modifyImage response:", response.toString());
        }
        return response;
    }
}
