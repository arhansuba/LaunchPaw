import { Chain } from "@rainbow-me/rainbowkit";

export const eduChain = {
  id: 31_337, // Using standard Hardhat chainId for local development
  name: "EduChain",
  nativeCurrency: {
    decimals: 18,
    name: "EDU",
    symbol: "EDU",
  },
  rpcUrls: {
    public: {
      http: [
        "http://localhost:8545", // Local development
      ],
    },
    default: {
      http: [
        "http://localhost:8545", // Local development
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://localhost:8545", // You can update this with your actual explorer URL
    },
  },
} as const satisfies Chain;

// In case you need testnet configuration
export const eduChainTestnet = {
  id: 31_338, // Different from local to avoid conflicts
  name: "EduChain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "EDU",
    symbol: "EDU",
  },
  rpcUrls: {
    public: {
      http: [
        "YOUR_TESTNET_RPC_URL", // Replace with actual testnet URL
      ],
    },
    default: {
      http: [
        "YOUR_TESTNET_RPC_URL", // Replace with actual testnet URL
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Testnet Explorer",
      url: "YOUR_TESTNET_EXPLORER_URL", // Replace with actual explorer URL
    },
  },
} as const satisfies Chain;