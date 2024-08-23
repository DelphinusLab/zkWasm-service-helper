import { WithSignature } from "../../interface/interface.js";
import { ZkWasmServiceHelper } from "../service-helper.js";

export abstract class SignedRequest {
  helper: ZkWasmServiceHelper;
  user_address: string;
  // Nonce not necessary for every request, usually included for requests which modify state
  protected nonce: number | undefined;
  protected signature: string | undefined;

  constructor(service_url: string, user_address: string) {
    this.user_address = user_address.toLowerCase();
    this.helper = new ZkWasmServiceHelper(service_url, "", "");
  }

  async fetchNonce(): Promise<number> {
    const response = await this.helper.queryUser({
      user_address: this.user_address,
    });
    this.setNonce(response.nonce);
    return response.nonce;
  }

  // Allow setting custom nonce
  setNonce(nonce: number) {
    this.nonce = nonce;
  }

  setSignature(signature: string) {
    this.signature = signature;
  }

  // When creating the message, ensure that the fields are in the correct order with the fields to be submitted from the inheriting class.
  // We should also fetch the nonce inside this method to ensure that the nonce is always up to date.
  abstract createSignMessage(): Promise<string>;

  // Create message without async calls and nonce fetching, aka from the fields already set
  abstract createSignMessageFromFields(): string;
  // Ensure param ordering matches the message created in createSignMessage
  // For JSON stringified messages, the fields must match the deserialization order in the server as well.
  abstract createSignedTaskParams(): WithSignature<unknown>;

  abstract submitTask(signature: string): Promise<unknown>;
}
