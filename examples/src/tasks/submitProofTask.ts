import {
  ProvingParams,
  WithSignature,
  ZkWasmUtil,
  ProofSubmitMode,
  InputContextType,
  WithCustomInputContextType,
} from "zkwasm-service-helper";

import { ServiceHelper, ServiceHelperConfig } from "../config";

export async function AddNewProofTask() {
  const image_md5 = "<YOUR_MD5>";
  const public_inputs = "0x22:i64 0x21:i64";
  const private_inputs = "";

  const pb_inputs: Array<string> = ZkWasmUtil.validateInputs(public_inputs);
  const priv_inputs: Array<string> = ZkWasmUtil.validateInputs(private_inputs);

  // Use the helper Enum type to determine the proof submit mode
  const proofSubmitMode = ProofSubmitMode.Auto
    ? ProofSubmitMode.Auto
    : ProofSubmitMode.Manual;

  let provingParams: ProvingParams = {
    user_address: ServiceHelperConfig.userAddress.toLowerCase(),
    md5: image_md5,
    public_inputs: pb_inputs,
    private_inputs: priv_inputs,
    // Whether the proof will be batched and verified through the auto submit service or manually submitted.
    // If the field is not specified, the default value will be ProofSubmitMode.Manual and the proof will not be batched.
    proof_submit_mode: proofSubmitMode,
  };

  // Context type for proof task. If none provided, will default to InputContextType.ImageCurrent in the server and use the image's current context
  const selectedInputContextType = InputContextType.Custom;

  // For Custom Context, upload a binary file first containing the context.
  if (selectedInputContextType === InputContextType.Custom) {
    // Load bytes into Tempfile/Buffer type - Server side example with NodeJS
    const contextBytes = new Uint8Array(64);
    contextBytes.fill(1);
    ZkWasmUtil.validateContextBytes(contextBytes);
    let bytesFile = await ZkWasmUtil.bytesToTempFile(contextBytes);

    // // LOADING AS FILE DIRECTLY - Server side example with NodeJS
    // let bytesFile = await ZkWasmUtil.loadContexFileAsBytes("<YourFilePath>");
    // // Convert uint8array to buffer
    // const contextBytes: Buffer = Buffer.from(bytesFile);

    let context_info: WithCustomInputContextType = {
      input_context: bytesFile,
      input_context_md5: ZkWasmUtil.convertToMd5(contextBytes),
      input_context_type: selectedInputContextType,
    };

    // // LOADING AS FILE DIRECTLY - Browser side example
    // let contextFile = await ZkWasmUtil.loadContexFileAsBytes("<YourFilePath>");

    // let context_info: WithCustomInputContextType = {
    //   input_context: contextFile,
    //   input_context_md5: ZkWasmUtil.convertToMd5(contextFile),
    //   input_context_type: selectedInputContextType,
    // };
    provingParams = { ...provingParams, ...context_info };
  } else {
    provingParams = {
      ...provingParams,
      input_context_type: selectedInputContextType,
    };
  }
  const msgString = ZkWasmUtil.createProvingSignMessage(provingParams);

  let signature: string;
  try {
    signature = await ZkWasmUtil.signMessage(
      msgString,
      ServiceHelperConfig.privateKey
    );
  } catch (e: unknown) {
    console.log("error signing message", e);
    return;
  }

  const fullParams: WithSignature<ProvingParams> = {
    ...provingParams,
    signature: signature,
  };

  const response = await ServiceHelper.addProvingTask(fullParams);
  console.log(response);
}

AddNewProofTask();
