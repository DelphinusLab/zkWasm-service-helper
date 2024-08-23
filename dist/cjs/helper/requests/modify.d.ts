import { ModifyImageParams, RequiresNonce, WithSignature } from "../../interface/interface.js";
import { SignedRequest } from "./shared.js";
export declare class ModifyRequest extends SignedRequest {
    md5: string;
    description_url: string | undefined;
    avator_url: string | undefined;
    constructor(service_url: string, params: ModifyImageParams, user_address: string);
    createSignMessage(): Promise<string>;
    createSignMessageFromFields(): string;
    createSignedTaskParams(): WithSignature<RequiresNonce<ModifyImageParams>>;
    submitTask(signature: string): Promise<string>;
    modifyImage(data: WithSignature<RequiresNonce<ModifyImageParams>>): Promise<any>;
}
