import {
  AddImageParams,
  ZkWasmUtil,
  ProvePaymentSrc,
  WithInitialContext,
  SetupTask,
} from "zkwasm-service-helper";

import path from "node:path";

import fs from "node:fs";
import { ServiceHelperConfig } from "../config";

export async function AddNewWasmImage() {
  const __dirname = path.resolve(path.dirname(""));
  const wasmFilePath = path.resolve(__dirname, "./src/files/image.wasm");
  const contextFilePath = path.resolve(__dirname, "./src/files/context.data");
  const fileSelected: Buffer = fs.readFileSync(wasmFilePath);
  const server_url = ServiceHelperConfig.serverUrl;
  const md5 = ZkWasmUtil.convertToMd5(fileSelected as Uint8Array);
  const user_address = ServiceHelperConfig.userAddress.toLowerCase();

  let params: AddImageParams = {
    name: "image.wasm",
    image_md5: md5,
    image: fileSelected,
    user_address: user_address,
    description_url: "",
    avator_url: "",
    circuit_size: 22,
    // Determines whether the credits will be deducted from the user supplying proof requests (default) or the user who created the image
    // Currently Enum values are Default and CreatorPay
    prove_payment_src: ProvePaymentSrc.Default,

    // Networks which the auto submit service will batch and submit the proof to.
    // Unsupported networks will be rejected.
    // If empty array, Auto Submitted proofs will be rejected.
    auto_submit_network_ids: [11155111],
  };

  // Optional Initial Context information

  // Upload a binary file first
  let [contextFile, contextMd5] = await ZkWasmUtil.loadContexFileAsBytes(
    contextFilePath
  );

  if (contextFile) {
    let context_info: WithInitialContext = {
      initial_context: contextFile,
      initial_context_md5: contextMd5,
    };
    params = { ...params, ...context_info };
  }

  const setupTask = new SetupTask(server_url, params, user_address);

  // Create message for signing, internally fetches nonce for user as well.
  const message = await setupTask.createSignMessage();
  const signature: string = await ZkWasmUtil.signMessage(
    message,
    ServiceHelperConfig.privateKey
  ); //Need user private key to sign the msg

  let response = await setupTask.submitTask(signature);

  console.log("Add Image Response: ", response);
}

AddNewWasmImage();
