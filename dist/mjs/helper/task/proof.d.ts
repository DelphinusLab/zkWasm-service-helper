import { InputContextType, ProofSubmitMode, ProvingParams, RequiresNonce, TaskReceipt, WithSignature } from "../../interface/interface.js";
import { SignedRequest } from "./shared.js";
export declare class ProvingTask extends SignedRequest {
    md5: string;
    public_inputs: string[];
    private_inputs: string[];
    proof_submit_mode: ProofSubmitMode;
    input_context_type: InputContextType;
    input_context?: unknown;
    input_context_md5: string | undefined;
    constructor(service_url: string, params: ProvingParams, user_address: string);
    createSignMessage(): Promise<string>;
    createSignMessageFromFields(): string;
    createSignedTaskParams(): WithSignature<RequiresNonce<ProvingParams>>;
    submitTask(): Promise<TaskReceipt>;
}
