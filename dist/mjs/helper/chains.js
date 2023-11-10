// List of supported chains in zkwasm service
// TODO: Might need to add these server-side and directly send to client, or clients can implement their own chain details
// as long as they are compatible with the zkwasm service.
// Currently using ChainInfo type but no public RPC url is provided there.
// Would most of the time be used to add a chain to the wallet.
export const GoerliChainInfo = {
    chainHexId: "0x5",
    chainName: "Goerli Testnet",
    rpcUrls: ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
        name: "GoerliETH",
        symbol: "ETH",
        decimals: 18,
    },
    blockExplorerUrls: [],
};
export const SepoliaChainInfo = {
    chainHexId: "0xaa36a7",
    chainName: "Sepolia Testnet",
    rpcUrls: ["https://rpc.testnet.sepolia.io"],
    nativeCurrency: {
        name: "SepoliaETH",
        symbol: "ETH",
        decimals: 18,
    },
    blockExplorerUrls: [],
};
export const BSCTestnetChainInfo = {
    chainHexId: "0x61",
    chainName: "BSC Testnet",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
    },
    blockExplorerUrls: [],
};
