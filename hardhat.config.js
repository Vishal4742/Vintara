require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-network-helpers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Rootstock Mainnet
    rootstock: {
      url: "https://public-node.rsk.co",
      chainId: 30,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 60000000, // 0.06 gwei
    },
    // Rootstock Testnet
    rootstockTestnet: {
      url: "https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T",
      chainId: 31,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 60000000, // 0.06 gwei
    },
    // Local development
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      rootstock: "your-api-key-here",
      rootstockTestnet: "your-api-key-here",
    },
    customChains: [
      {
        network: "rootstock",
        chainId: 30,
        urls: {
          apiURL: "https://blockscout.com/rsk/api",
          browserURL: "https://blockscout.com/rsk",
        },
      },
      {
        network: "rootstockTestnet",
        chainId: 31,
        urls: {
          apiURL: "https://blockscout.com/rsk/testnet/api",
          browserURL: "https://blockscout.com/rsk/testnet",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
