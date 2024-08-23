import { WithSignature } from "../../interface/interface.js";
import { ZkWasmServiceHelper } from "../service-helper.js";
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
    abstract createSignedTaskParams(): WithSignature<unknown>;
    abstract submitTask(signature: string): Promise<unknown>;
}
