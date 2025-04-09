import {
  AddImageParams,
  WithSignature,
  ZkWasmUtil,
  ProvePaymentSrc,
  WithInitialContext,
} from "zkwasm-service-helper";

import path from "node:path";

import fs from "node:fs";
import { ServiceHelper, ServiceHelperConfig, Web3ChainConfig } from "../config";

export async function AddNewWasmImage() {
  const __dirname = path.resolve(path.dirname(""));
  const wasmFilePath = path.resolve(__dirname, "./data/image.wasm");
  const contextFilePath = path.resolve(__dirname, "./data/context.data");
  const fileSelected: Buffer = fs.readFileSync(wasmFilePath);
  const md5 = ZkWasmUtil.convertToMd5(fileSelected as Uint8Array);

  let params: AddImageParams = {
    name: "image.wasm",
    image_md5: md5,
    image: fileSelected,
    user_address: ServiceHelperConfig.userAddress.toLowerCase(),
    description_url: "",
    avator_url: "",
    circuit_size: 22,
    // Determines whether the credits will be deducted from the user supplying proof requests (default) or the user who created the image
    // Currently Enum values are Default and CreatorPay
    prove_payment_src: ProvePaymentSrc.Default,

    // Networks which the auto submit service will batch and submit the proof to.
    // Unsupported networks will be rejected.
    // If empty array, Auto Submitted proofs will be rejected.
    auto_submit_network_ids: [Web3ChainConfig.chainId],
  };

  // Optional Initial Context information

  // Upload a binary file first
  let [contextFile, contextMd5] =
    await ZkWasmUtil.loadContexFileAsBytes(contextFilePath);

  if (contextFile) {
    let context_info: WithInitialContext = {
      initial_context: contextFile,
      initial_context_md5: contextMd5,
    };
    params = { ...params, ...context_info };
  }

  let msg = ZkWasmUtil.createAddImageSignMessage(params);
  let signature: string = await ZkWasmUtil.signMessage(
    msg,
    ServiceHelperConfig.privateKey,
  ); //Need user private key to sign the msg
  let task: WithSignature<AddImageParams> = {
    ...params,
    signature,
  };

  let response = await ServiceHelper.addNewWasmImage(task);

  console.log("Add Image Response: ", response);
}

AddNewWasmImage();
