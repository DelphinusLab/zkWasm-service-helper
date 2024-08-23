import { ProvePaymentSrc, RequiresNonce, ResetImageParams, TaskReceipt, WithSignature } from "../../interface/interface.js";
import { SignedRequest } from "./shared.js";
export declare class ResetTask extends SignedRequest {
    md5: string;
    circuit_size: number;
    prove_payment_src: ProvePaymentSrc;
    auto_submit_network_ids: number[];
    reset_context: unknown;
    reset_context_md5: string | undefined;
    constructor(service_url: string, params: ResetImageParams, user_address: string);
    createSignMessage(): Promise<string>;
    createSignMessageFromFields(): string;
    createSignedTaskParams(): WithSignature<RequiresNonce<ResetImageParams>>;
    submitTask(signature: string): Promise<TaskReceipt>;
    private addResetTask;
}
