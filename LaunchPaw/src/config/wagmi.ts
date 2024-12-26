import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import { http } from "viem";

export const memeSubnet = {
  id: 1113042,
  name: "MemeSubnet",
  nativeCurrency: {
    decimals: 18,
    name: "AVAX",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: {
      http: [
        "https://subnets.avacloud.io/cbef19a7-d2ba-47f7-a31d-190e4be54ba6",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://subnets.avacloud.io/cbef19a7-d2ba-47f7-a31d-190e4be54ba6",
    },
  },
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
  iconBackground: "#fff",
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1,
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "MemeVerse",
  projectId: "1a9e65dd4c23a6f9ad2d43b5062f264b",
  chains: [memeSubnet],
  transports: {
    [memeSubnet.id]: http(
      "https://subnets.avacloud.io/ed77962b-2d49-4396-bb3a-1a8efb172859"
    ),
  },
});
