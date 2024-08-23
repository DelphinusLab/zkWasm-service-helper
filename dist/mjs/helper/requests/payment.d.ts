import { ZkWasmServiceHelper } from "../../helper/service-helper.js";
import { PaymentParams, SubscriptionRequest } from "../../interface/interface.js";
export declare class Payment {
    helper: ZkWasmServiceHelper;
    constructor(server_url: string);
    addPayment(payRequest: PaymentParams): Promise<any>;
    addSubscription(subscription: SubscriptionRequest): Promise<any>;
}
