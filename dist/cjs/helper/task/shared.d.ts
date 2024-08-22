import { ZkWasmServiceHelper } from "../../helper/service-helper.js";
import { SignatureRequest } from "../../interface/interface.js";
export declare abstract class SignedRequest {
    helper: ZkWasmServiceHelper;
    user_address: string;
    protected nonce: number | undefined;
    protected signature: string | undefined;
    constructor(service_url: string, user_address: string);
    fetchNonce(): Promise<number>;
    setNonce(nonce: number): void;
    setSignature(signature: string): void;
    abstract createSignMessage(): Promise<string>;
    abstract createSignMessageFromFields(): string;
    abstract createSignedTaskParams(): SignatureRequest<unknown>;
    abstract submitTask(signature: string): Promise<unknown>;
}
