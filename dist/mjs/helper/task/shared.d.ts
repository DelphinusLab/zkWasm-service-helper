import { SignatureRequest } from "../../interface/interface.js";
export declare abstract class SignedRequest {
    user_address: string;
    nonce: number | undefined;
    protected signature: string | undefined;
    constructor(user_address: string);
    abstract requiresNonce(): boolean;
    abstract createSignMessage(): string;
    abstract createSignedTaskParams(): SignatureRequest<unknown>;
    abstract submitTask(endpoint: string): Promise<unknown>;
    setSignature(signature: string): void;
}
