import { AddImageParams, ProvePaymentSrc, RequiresNonce, TaskReceipt, WithSignature } from "../../interface/interface.js";
import { SignedRequest } from "./shared.js";
export declare class SetupTask extends SignedRequest {
    md5: string;
    wasm_bytes: ArrayBuffer;
    image_name: string;
    description_url: string | undefined;
    avator_url: string | undefined;
    circuit_size: number;
    prove_payment_src: ProvePaymentSrc;
    auto_submit_network_ids: number[];
    initial_context: unknown;
    initial_context_md5: string | undefined;
    constructor(service_url: string, params: AddImageParams, user_address: string);
    createSignMessage(): Promise<string>;
    createSignMessageFromFields(): string;
    createSignedTaskParams(): WithSignature<RequiresNonce<AddImageParams>>;
    submitTask(signature: string): Promise<TaskReceipt>;
    private addNewWasmImage;
}
