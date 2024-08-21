import {
  AddImageParams,
  ProvePaymentSrc,
  RequiresNonce,
  TaskReceipt,
  WithSignature,
} from "../../interface/interface.js";

import { SignedRequest } from "./shared.js";

export class SetupTask extends SignedRequest {
  md5: string;
  wasm_bytes: ArrayBuffer;
  image_name: string;
  description_url: string | undefined;
  avator_url: string | undefined;
  circuit_size: number;
  prove_payment_src: ProvePaymentSrc;
  auto_submit_network_ids: number[];

  initial_context: unknown;
  initial_context_md5: string | undefined;

  constructor(
    service_url: string,
    params: AddImageParams,
    user_address: string
  ) {
    super(service_url, user_address);

    this.md5 = params.image_md5;
    this.image_name = params.name;
    this.description_url = params.description_url;
    this.avator_url = params.avator_url;
    this.circuit_size = params.circuit_size;
    this.prove_payment_src = params.prove_payment_src;
    this.auto_submit_network_ids = params.auto_submit_network_ids;
    this.wasm_bytes = params.image;
  }

  async createSignMessage(): Promise<string> {
    const nonce = await this.fetchNonce();
    this.nonce = nonce;
    // No need to sign the file itself, just the md5
    return this.createSignMessageFromFields();
  }

  createSignMessageFromFields(): string {
    let message = "";
    message += this.user_address;
    message += this.nonce;
    message += this.image_name;
    message += this.md5;
    message += this.description_url;
    message += this.avator_url;
    message += this.circuit_size;

    message += this.prove_payment_src;
    for (const chainId of this.auto_submit_network_ids) {
      message += chainId;
    }

    // Additional params afterwards
    if (this.initial_context) {
      message += this.initial_context_md5;
    }
    return message;
  }

  createSignedTaskParams(): WithSignature<RequiresNonce<AddImageParams>> {
    return {
      user_address: this.user_address,
      nonce: this.nonce!,
      image: this.wasm_bytes,
      image_md5: this.md5,
      name: this.image_name,
      description_url: this.description_url || "",
      avator_url: this.avator_url || "",
      circuit_size: this.circuit_size,
      prove_payment_src: this.prove_payment_src,
      auto_submit_network_ids: this.auto_submit_network_ids,
      signature: this.signature!,
    };
  }

  async submitTask(): Promise<TaskReceipt> {
    return await this.helper.addNewWasmImage(this.createSignedTaskParams());
  }
}
