import { AddImageParams, ProvePaymentSrc, RequiresNonce, WithSignature } from "interface/interface.js";
import { SignedRequest } from "./shared";
export declare class SetupTask extends SignedRequest {
    md5: string;
    wasm_bytes: ArrayBuffer;
    image_name: string;
    description_url: string | undefined;
    avator_url: string | undefined;
    circuit_size: number;
    prove_payment_src: ProvePaymentSrc;
    auto_submit_network_ids: number[];
    constructor(params: AddImageParams, user_address: string, nonce: number);
    requiresNonce(): boolean;
    createSignMessage(): string;
    createSignedTaskParams(): WithSignature<RequiresNonce<AddImageParams>>;
    submitTask(server_url: string): Promise<void>;
}
