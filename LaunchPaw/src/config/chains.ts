import { Chain } from "@rainbow-me/rainbowkit";

export const memeSubnet = {
  id: 1_337,
  name: "MemeSubnet",
  nativeCurrency: {
    decimals: 18,
    name: "AVAX",
    symbol: "AVAX",
  },
  rpcUrls: {
    public: {
      http: [
        "https://subnets.avacloud.io/ed77962b-2d49-4396-bb3a-1a8efb172859",
      ],
    },
    default: {
      http: [
        "https://subnets.avacloud.io/ed77962b-2d49-4396-bb3a-1a8efb172859",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://subnets.avacloud.io/ed77962b-2d49-4396-bb3a-1a8efb172859",
    },
  },
} as const satisfies Chain;
