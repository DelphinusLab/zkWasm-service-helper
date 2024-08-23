import { TaskEndpoint, ZkWasmServiceHelper } from "helper/service-helper";
export class Payment {
    helper;
    constructor(server_url) {
        this.helper = new ZkWasmServiceHelper(server_url, "", "");
    }
    async addPayment(payRequest) {
        const response = await this.helper.endpoint.invokeRequest("POST", TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
        if (this.helper.endpoint.enable_logs) {
            console.log("get addPayment response:", response.toString());
        }
        return response;
    }
    async addSubscription(subscription) {
        const response = await this.helper.endpoint.invokeRequest("POST", TaskEndpoint.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
        if (this.helper.endpoint.enable_logs) {
            console.log("get addSubscription response:", response.toString());
        }
        return response;
    }
}
