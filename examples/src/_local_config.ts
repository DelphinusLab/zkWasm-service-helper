import { ZkWasmServiceHelper } from "zkwasm-service-helper";

// Exporting a config object for example usage.
export const ServiceHelperConfig = {
  serverUrl: "http://101.36.120.170:20130",
  //serverUrl: "https://rpc.zkwasmhub.com:8090",
  privateKey:
    "d6c1fc4e3269ab18e97ffe5ae4a05bb191022c89ca3d35d7ade816a43a1b18d2",
  userAddress: "0xD04B7dc3d29456d6Ff4FFBd2eEa605618d0372d8",
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
