import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import { http } from "viem";

export const eduChain = {
  id: 31337, // Using Hardhat's default chainId
  name: "EduChain",
  nativeCurrency: {
    decimals: 18,
    name: "EDU",
    symbol: "EDU",
  },
  rpcUrls: {
    default: {
      http: [
        "http://localhost:8545", // Local Hardhat node
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://localhost:8545",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1,
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "LaunchPaw",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // Get this from WalletConnect
  chains: [eduChain],
  transports: {
    [eduChain.id]: http("http://localhost:8545"),
  },
});

// Configuration for when you deploy to testnet
export const testnetConfig = {
  ...config,
  chains: [{
    ...eduChain,
    id: 31338,
    name: "EduChain Testnet",
    rpcUrls: {
      default: {
        http: [
          "YOUR_TESTNET_RPC_URL", // Add your testnet RPC URL
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Testnet Explorer",
        url: "YOUR_TESTNET_EXPLORER_URL", // Add your testnet explorer URL
      },
    },
  }],
  transports: {
    31338: http("YOUR_TESTNET_RPC_URL"), // Add your testnet RPC URL
  },
};