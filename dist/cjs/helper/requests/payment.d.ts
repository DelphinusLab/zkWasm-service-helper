import { ZkWasmServiceHelper } from "helper/service-helper";
import { PaymentParams, SubscriptionRequest } from "interface/interface";
export declare class Payment {
    helper: ZkWasmServiceHelper;
    constructor(server_url: string);
    addPayment(payRequest: PaymentParams): Promise<any>;
    addSubscription(subscription: SubscriptionRequest): Promise<any>;
}
