import { SignedRequest } from "./shared.js";
import { TaskEndpoint } from "../../helper/service-helper.js";
export class MaintenanceRequest extends SignedRequest {
    params;
    constructor(params, service_url, user_address) {
        super(service_url, user_address);
        this.params = params;
    }
    async createSignMessage() {
        const nonce = await this.fetchNonce();
        this.nonce = nonce;
        return this.createSignMessageFromFields();
    }
    createSignMessageFromFields() {
        let message = "";
        message += this.user_address;
        message += this.nonce;
        message += this.params.request_type;
        message += this.params.mode;
        return message;
    }
    createSignedTaskParams() {
        return {
            user_address: this.user_address,
            nonce: this.nonce,
            request_type: this.params.request_type,
            mode: this.params.mode,
            signature: this.signature,
        };
    }
    async submitTask(signature) {
        this.setSignature(signature);
        return await this.setMaintenanceMode(this.createSignedTaskParams());
    }
    async setMaintenanceMode(params) {
        return await this.helper.sendRequestWithSignature("POST", TaskEndpoint.SET_MAINTENANCE_MODE, params, false);
    }
}
