require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.25",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
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
    // Add local network for testing
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    }
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