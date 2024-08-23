import { SetMaintenanceModeParams, WithSignature } from "interface/interface";
import { SignedRequest } from "./shared";
export declare class MaintenanceRequest extends SignedRequest {
    params: SetMaintenanceModeParams;
    constructor(params: SetMaintenanceModeParams, service_url: string, user_address: string);
    createSignMessage(): Promise<string>;
    createSignMessageFromFields(): string;
    createSignedTaskParams(): WithSignature<SetMaintenanceModeParams>;
    submitTask(signature: string): Promise<string>;
    private setMaintenanceMode;
}
