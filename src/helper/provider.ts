import {
  InterfaceAbi,
  AbstractProvider,
  WebSocketProvider,
  JsonRpcProvider,
  AbstractSigner,
  Eip1193Provider,
  BrowserProvider,
  JsonRpcSigner,
  Wallet,
  TransactionRequest,
} from "ethers";
import { DelphinusContract } from "./client";
import { ChainDetails, ChainInfo } from "interface/interface";

export abstract class DelphinusProvider<T extends AbstractProvider> {
  readonly provider: T;
  constructor(provider: T) {
    this.provider = provider;
  }
  // Subscribe to provider level events such as a new block
  async subscribeEvent<T>(eventName: string, cb: (event: T) => unknown) {
    return this.provider.on(eventName, cb);
  }
  // Read only version of contract
  getContractWithoutSigner(contractAddress: string, abi: InterfaceAbi) {
    return new DelphinusContract(contractAddress, abi, this.provider);
  }
}

// Signer class is to sign transactions from a node client (non-browser environment)
// Requires private key
export abstract class DelphinusSigner<T extends AbstractSigner> {
  readonly signer: T;
  constructor(signer: T) {
    this.signer = signer;
  }

  get provider() {
    return this.signer.provider;
  }
  // Subscribe to provider level events such as a new block
  async subscribeEvent<T>(eventName: string, cb: (event: T) => unknown) {
    return this.provider?.on(eventName, cb);
  }

  // Contract instance with signer attached
  getContractWithSigner(
    contractAddress: string,
    abi: InterfaceAbi
  ): DelphinusContract {
    return new DelphinusContract(contractAddress, abi, this.signer);
  }
}

// DelphinusBaseProvider is a type alias for WebSocketProvider and JsonRpcProvider
export type DelphinusBaseProvider = WebSocketProvider | JsonRpcProvider;

// GetBaseProvider is a helper function to get a provider from a url
export function GetBaseProvider(providerUrl: string) {
  if (providerUrl.startsWith("ws")) {
    return new WebSocketProvider(providerUrl);
  } else {
    return new JsonRpcProvider(providerUrl);
  }
}

// extend window interface for ts to recognize ethereum
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

// BrowserProvider implementation is exclusively for browser wallets such as MetaMask which implements EIP-1193
export class DelphinusBrowserProvider extends DelphinusProvider<BrowserProvider> {
  constructor() {
    if (!window.ethereum) {
      throw "MetaMask not installed, Browser mode is not available.";
    }
    // https://eips.ethereum.org/EIPS/eip-1193#summary
    super(new BrowserProvider(window.ethereum));
  }

  async connect() {
    let address = (await this.provider.getSigner()).address;
    return address;
  }

  close() {
    this.provider.destroy();
  }

  async onAccountChange<T>(cb: (account: string) => T) {
    this.subscribeEvent("accountsChanged", cb);
  }

  async getNetworkId() {
    return (await this.provider.getNetwork()).chainId;
  }
  async getJsonRpcSigner(): Promise<JsonRpcSigner> {
    let signer = await this.provider.getSigner();
    return signer;
  }
  async getContractWithSigner(
    contractAddress: string,
    abi: InterfaceAbi
  ): Promise<DelphinusContract> {
    return new DelphinusContract(
      contractAddress,
      abi,
      await this.getJsonRpcSigner()
    );
  }

  async switchNet(chainInfo: ChainDetails) {
    let { chainHexId, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } =
      chainInfo;
    let id = await this.getNetworkId();
    let idHex = "0x" + id.toString(16);
    console.log("switch chain", idHex, chainHexId);
    if (idHex != chainHexId) {
      try {
        await this.provider.send("wallet_switchEthereumChain", [
          { chainId: chainHexId },
        ]);
      } catch (e: any) {
        if (e.code == 4902) {
          try {
            await this.provider.send("wallet_addEthereumChain", [
              {
                chainId: chainHexId,
                chainName: chainName,
                rpcUrls: rpcUrls,
                nativeCurrency: nativeCurrency,
                blockExplorerUrls:
                  blockExplorerUrls.length > 0 ? blockExplorerUrls : null,
              },
            ]);

            await this.provider.send("wallet_switchEthereumChain", [
              { chainId: chainHexId },
            ]);
          } catch (e) {
            throw new Error("Add Network Rejected by User.");
          }
        } else {
          throw new Error("Can not switch to chain " + chainHexId);
        }
      }
    }
    id = await this.getNetworkId();
    console.log("switched", id, chainHexId);
    return;
  }

  // Wrapper for personal_sign method
  async sign(message: string): Promise<string> {
    let signer = await this.provider.getSigner();
    return await signer.signMessage(message);
  }
}

// Read only provider mode for node client (non-browser environment) when no private key is provided
export class DelphinusReadOnlyProvider extends DelphinusProvider<DelphinusBaseProvider> {
  constructor(providerUrl: string) {
    super(GetBaseProvider(providerUrl));
  }
}

// Wallet provider is for node client (non-browser environment) with functionality to sign transactions
export class DelphinusWalletProvider extends DelphinusSigner<Wallet> {
  constructor(privateKey: string, provider: DelphinusBaseProvider) {
    super(new Wallet(privateKey, provider));
  }

  get provider() {
    // will never be null as we are passing in a provider in the constructor
    return this.signer.provider!;
  }

  // Simulate a call to a contract method on the current blockchain state
  async call(req: TransactionRequest) {
    return await this.signer.call(req);
  }
}
