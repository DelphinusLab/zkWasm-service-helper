import { ZkWasmServiceHelper } from "zkwasm-service-helper";

// Exporting a config object for example usage.
export const ServiceHelperConfig = {
  serverUrl: "https://rpc.zkwasmhub.com:8090",
  privateKey: "",
  userAddress: "",
};
export const ServiceHelper = new ZkWasmServiceHelper(
  ServiceHelperConfig.serverUrl,
  "",
  ""
);

// Example information required for verifying a proof.
export const Web3ChainConfig = {
  providerUrl: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
  chainId: 97,
};
