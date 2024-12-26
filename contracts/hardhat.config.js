require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.24",
      },
      {
        version: "0.8.25",
      },
      {
        version: "0.8.28",
      },
    ],
  },
  paths: {
    artifacts: "./src",
  },
  networks: {
    "edu-chain-testnet": {
      // Testnet configuration
      url: `https://rpc.open-campus-codex.gelato.digital`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
    "edu-chain": {
      // Mainnet configuration
      url: `https://rpc.edu-chain.raas.gelato.cloud`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      "edu-chain-testnet": "XXXX",
      "edu-chain": "XXXX",
    },
    customChains: [
      {
        network: "edu-chain-testnet",
        chainId: 656476,
        urls: {
          apiURL: "https://edu-chain-testnet.blockscout.com/api",
          browserURL: "https://edu-chain-testnet.blockscout.com",
        },
      },
      {
        network: "edu-chain",
        chainId: 41923, // Replace with the correct mainnet chain ID if different
        urls: {
          apiURL: "https://educhain.blockscout.com/api",
          browserURL: "https://educhain.blockscout.com",
        },
      },
    ],
  },
};