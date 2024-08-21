import {
  ModifyImageParams,
  RequiresNonce,
  TaskReceipt,
  WithSignature,
} from "../../interface/interface.js";

import { SignedRequest } from "./shared.js";

export class ModifyRequest extends SignedRequest {
  md5: string;

  description_url: string | undefined;
  avator_url: string | undefined;

  constructor(
    service_url: string,
    params: ModifyImageParams,
    user_address: string
  ) {
    super(service_url, user_address);

    this.md5 = params.md5;
    this.description_url = params.description_url;
    this.avator_url = params.avator_url;
  }

  async createSignMessage(): Promise<string> {
    const nonce = await this.fetchNonce();
    this.nonce = nonce;
    // No need to sign the file itself, just the md5
    return this.createSignMessageFromFields();
  }

  createSignMessageFromFields(): string {
    let message = JSON.stringify({
      user_address: this.user_address,
      nonce: this.nonce,
      md5: this.md5,
      description_url: this.description_url,
      avator_url: this.avator_url,
    });
    return message;
  }

  createSignedTaskParams(): WithSignature<RequiresNonce<ModifyImageParams>> {
    return {
      user_address: this.user_address,
      nonce: this.nonce!,
      md5: this.md5,
      description_url: this.description_url || "",
      avator_url: this.avator_url || "",
      signature: this.signature!,
    };
  }

  async submitTask(): Promise<string> {
    return await this.helper.modifyImage(this.createSignedTaskParams());
  }
}
