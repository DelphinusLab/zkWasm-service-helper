import { ZkWasmServiceHelper } from "zkwasm-service-helper";
import { Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const SERVER_URL = process.env.SERVER_URL;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const PROVIDER_URL = process.env.PROVIDER_URL;
export const CHAIN_ID = process.env.CHAIN_ID;
export const MANUAL_TASK_ID_TO_VERIFY = process.env.MANUAL_TASK_ID_TO_VERIFY;
export const AUTO_TASK_ID_TO_VERIFY = process.env.AUTO_TASK_ID_TO_VERIFY;
export const TASK_ID_TO_QUERY = process.env.TASK_ID_TO_QUERY;
export const MD5_TO_QUERY = process.env.MD5_TO_QUERY;
export const SUBMIT_AUTO_SUBMIT_PROOF =
  (process.env.SUBMIT_AUTO_SUBMIT_PROOF || "false") === "true";

// Exporting a config object for example usage.
export const ServiceHelperConfig = {
  serverUrl: SERVER_URL!,
  privateKey: PRIVATE_KEY!,
  userAddress: new Wallet(PRIVATE_KEY!).address,
};
export const ServiceHelper = new ZkWasmServiceHelper(
  ServiceHelperConfig.serverUrl,
  "",
  "",
);

// Example information required for verifying a proof.
export const Web3ChainConfig = {
  providerUrl: PROVIDER_URL!,
  chainId: CHAIN_ID!,
};
