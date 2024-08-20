import { SignatureRequest } from "../../interface/interface.js";

export abstract class SignedRequest {
  user_address: string;
  // Nonce not necessary for every request, usually included for requests which modify state
  nonce: number | undefined;
  protected signature: string | undefined;

  constructor(user_address: string) {
    this.user_address = user_address;
  }

  abstract requiresNonce(): boolean;
  // When creating the message, ensure that the fields are in the correct order with the fields to be submitted from the inheriting class.
  abstract createSignMessage(): string;
  // Ensure param ordering matches the message created in createSignMessage
  abstract createSignedTaskParams(): SignatureRequest<unknown>;

  abstract submitTask(endpoint: string): Promise<unknown>;

  setSignature(signature: string) {
    this.signature = signature;
  }
}
