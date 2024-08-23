import { TaskEndpoint, ZkWasmServiceHelper } from "helper/service-helper";
import { PaymentParams, SubscriptionRequest } from "interface/interface";

export class Payment {
  helper: ZkWasmServiceHelper;

  constructor(server_url: string) {
    this.helper = new ZkWasmServiceHelper(server_url, "", "");
  }

  async addPayment(payRequest: PaymentParams) {
    const response = await this.helper.endpoint.invokeRequest(
      "POST",
      TaskEndpoint.PAY,
      JSON.parse(JSON.stringify(payRequest))
    );
    if (this.helper.endpoint.enable_logs) {
      console.log("get addPayment response:", response.toString());
    }
    return response;
  }

  async addSubscription(subscription: SubscriptionRequest) {
    const response = await this.helper.endpoint.invokeRequest(
      "POST",
      TaskEndpoint.SUBSCRIBE,
      JSON.parse(JSON.stringify(subscription))
    );
    if (this.helper.endpoint.enable_logs) {
      console.log("get addSubscription response:", response.toString());
    }
    return response;
  }
}
