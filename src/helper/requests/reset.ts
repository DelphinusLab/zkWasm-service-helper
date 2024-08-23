import { TaskEndpoint } from "helper/service-helper.js";
import {
  ProvePaymentSrc,
  RequiresNonce,
  ResetImageParams,
  TaskReceipt,
  WithSignature,
} from "../../interface/interface.js";

import { SignedRequest } from "./shared.js";

export class ResetTask extends SignedRequest {
  md5: string;

  circuit_size: number;
  prove_payment_src: ProvePaymentSrc;
  auto_submit_network_ids: number[];

  reset_context: unknown;
  reset_context_md5: string | undefined;

  constructor(
    service_url: string,
    params: ResetImageParams,
    user_address: string
  ) {
    super(service_url, user_address);

    this.md5 = params.md5;

    this.circuit_size = params.circuit_size;
    this.prove_payment_src = params.prove_payment_src;
    this.auto_submit_network_ids = params.auto_submit_network_ids;
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

    message += this.md5;

    message += this.circuit_size;

    message += this.prove_payment_src;
    for (const chainId of this.auto_submit_network_ids) {
      message += chainId;
    }

    if (this.reset_context) {
      message += this.reset_context_md5;
    }
    return message;
  }

  createSignedTaskParams(): WithSignature<RequiresNonce<ResetImageParams>> {
    return {
      user_address: this.user_address,
      nonce: this.nonce!,
      md5: this.md5,
      circuit_size: this.circuit_size,
      prove_payment_src: this.prove_payment_src,
      auto_submit_network_ids: this.auto_submit_network_ids,
      signature: this.signature!,
    };
  }

  async submitTask(signature: string): Promise<TaskReceipt> {
    this.setSignature(signature);
    return await this.addResetTask(this.createSignedTaskParams());
  }

  private async addResetTask(
    task: WithSignature<RequiresNonce<ResetImageParams>>
  ) {
    let response = await this.helper.sendRequestWithSignature<
      RequiresNonce<ResetImageParams>
    >("POST", TaskEndpoint.RESET, task, true);

    if (this.helper.endpoint.enable_logs) {
      console.log("get addResetTask response:", response.toString());
    }
    return response;
  }
}
