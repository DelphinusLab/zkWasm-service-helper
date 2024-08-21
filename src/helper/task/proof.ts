import {
  ContextOptions,
  InputContextType,
  ProofSubmitMode,
  ProvingParams,
  RequiresNonce,
  TaskReceipt,
  WithSignature,
} from "../../interface/interface.js";

import { SignedRequest } from "./shared.js";

export class ProvingTask extends SignedRequest {
  md5: string;
  public_inputs: string[];
  private_inputs: string[];
  proof_submit_mode: ProofSubmitMode;
  input_context_type: InputContextType;
  input_context?: unknown;
  input_context_md5: string | undefined;

  constructor(
    service_url: string,
    params: ProvingParams,
    user_address: string,
    nonce: number
  ) {
    super(service_url, user_address);
    this.nonce = nonce;
    this.md5 = params.md5;
    this.public_inputs = params.public_inputs;
    this.private_inputs = params.private_inputs;
    this.proof_submit_mode = params.proof_submit_mode;
    this.input_context_type =
      params.input_context_type || InputContextType.ImageCurrent;
    this.input_context = params.input_context;
    this.input_context_md5 = params.input_context_md5;
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

    // for array elements, append one by one
    for (const input of this.public_inputs) {
      message += input;
    }

    for (const input of this.private_inputs) {
      message += input;
    }

    message += this.proof_submit_mode;

    // Only handle input_context if selected input_context_type.Custom
    if (
      this.input_context_type === InputContextType.Custom &&
      this.input_context
    ) {
      message += this.input_context_md5;
    }
    if (this.input_context_type) {
      message += this.input_context_type;
    }

    return message;
  }

  createSignedTaskParams(): WithSignature<RequiresNonce<ProvingParams>> {
    let context: ContextOptions;

    switch (this.input_context_type) {
      case InputContextType.Custom:
        context = {
          input_context: this.input_context,
          // todo: remove assertion and do proper checks
          input_context_md5: this.input_context_md5!,
          input_context_type: this.input_context_type,
        };
        break;
      case InputContextType.ImageInitial:
        context = {
          input_context_type: this.input_context_type,
        };
        break;

      case InputContextType.ImageCurrent:
        context = {
          input_context_type: this.input_context_type,
        };
        break;
      default:
        context = {
          input_context_type: this.input_context_type,
        };
    }
    return {
      user_address: this.user_address,
      nonce: this.nonce!,
      md5: this.md5,
      public_inputs: this.public_inputs,
      private_inputs: this.private_inputs,
      proof_submit_mode: this.proof_submit_mode,
      ...context,
      signature: this.signature!,
    };
  }

  async submitTask(): Promise<TaskReceipt> {
    return await this.helper.addProvingTask(this.createSignedTaskParams());
  }
}
