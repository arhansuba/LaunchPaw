require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.25",
  networks: {
    skale: {
      url: "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet",
      accounts: [
        "70da3ff3da418eee005a376ea30fe469fb5e78b7c36b35a24f369b3adbfdc61c",
      ],
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [
        "70da3ff3da418eee005a376ea30fe469fb5e78b7c36b35a24f369b3adbfdc61c",
      ],
    },
    memeSubnet: {
      url: "https://subnets.avacloud.io/cbef19a7-d2ba-47f7-a31d-190e4be54ba6",
      accounts: [
        "70da3ff3da418eee005a376ea30fe469fb5e78b7c36b35a24f369b3adbfdc61c",
      ],
    },
  },
};

// AMOY:
// Deploying contracts with the account: 0xAddc0142a647aE0C1081d202d35D943C4A5c06d2
// NFTCollection deployed to: 0xACEBf59C1bF0FdA1e5B936034aE6b57fB82ab770
// RewardToken deployed to: 0x391371AC48F31fb5136ecC14B27d1aB547326d40
// NFTStaking deployed to: 0xbd88E8CDAE3b6EcfD9513182288c5A95271d2386
