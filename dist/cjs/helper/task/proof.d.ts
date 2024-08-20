import { InputContextType, ProofSubmitMode, ProvingParams, RequiresNonce, WithSignature } from "../../interface/interface.js";
import { SignedRequest } from "./shared";
export declare class ProvingTask extends SignedRequest {
    md5: string;
    public_inputs: string[];
    private_inputs: string[];
    proof_submit_mode: ProofSubmitMode;
    input_context_type: InputContextType;
    input_context?: unknown;
    input_context_md5: string | undefined;
    constructor(params: ProvingParams, user_address: string, nonce: number);
    requiresNonce(): boolean;
    createSignMessage(): string;
    createSignedTaskParams(): WithSignature<RequiresNonce<ProvingParams>>;
    submitTask(server_url: string): Promise<void>;
}
