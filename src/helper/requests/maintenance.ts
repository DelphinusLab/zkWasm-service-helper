import {
  RequiresNonce,
  SetMaintenanceModeParams,
  WithSignature,
} from "interface/interface";
import { SignedRequest } from "./shared.js";
import { TaskEndpoint } from "../../helper/service-helper";

export class MaintenanceRequest extends SignedRequest {
  params: SetMaintenanceModeParams;

  constructor(
    params: SetMaintenanceModeParams,
    service_url: string,
    user_address: string
  ) {
    super(service_url, user_address);
    this.params = params;
  }

  async createSignMessage(): Promise<string> {
    const nonce = await this.fetchNonce();
    this.nonce = nonce;

    return this.createSignMessageFromFields();
  }

  createSignMessageFromFields(): string {
    let message = "";
    message += this.user_address;
    message += this.nonce;
    message += this.params.request_type;
    message += this.params.mode;
    return message;
  }

  createSignedTaskParams(): WithSignature<SetMaintenanceModeParams> {
    return {
      user_address: this.user_address,
      nonce: this.nonce!,
      request_type: this.params.request_type,
      mode: this.params.mode,
      signature: this.signature!,
    };
  }

  async submitTask(signature: string): Promise<string> {
    this.setSignature(signature);
    return await this.setMaintenanceMode(this.createSignedTaskParams());
  }

  private async setMaintenanceMode(
    params: WithSignature<RequiresNonce<SetMaintenanceModeParams>>
  ): Promise<string> {
    return await this.helper.sendRequestWithSignature<
      RequiresNonce<SetMaintenanceModeParams>
    >("POST", TaskEndpoint.SET_MAINTENANCE_MODE, params, false);
  }
}
