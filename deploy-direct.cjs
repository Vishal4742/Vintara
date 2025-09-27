const { ethers } = require("ethers");
require("dotenv").config();

// Contract bytecode and ABI (simplified for direct deployment)
const MOCK_TOKEN_ABI = [
  "constructor(string memory name, string memory symbol, uint256 initialSupply)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const MOCK_TOKEN_BYTECODE =
  "0x608060405234801561001057600080fd5b50600436106100575760003560e01c806306fdde031461005c578063095ea7b31461007a57806318160ddd1461009657806323b872dd146100b4578063313ce567146100d0575b600080fd5b6100646100ee565b604051610071919061012c565b60405180910390f35b610094600480360381019061008f9190610198565b61017c565b005b61009e610194565b6040516100ab91906101e7565b60405180910390f35b6100ce60048036038101906100c99190610203565b61019a565b005b6100d86101b9565b6040516100e59190610272565b60405180910390f35b60606040518060400160405280600a81526020017f4d6f636b20546f6b656e00000000000000000000000000000000000000000000815250905090565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60025490565b6101a26101be565b6101b38383836101c6565b505050565b60006012905090565b50565b505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101f3826101c8565b9050919050565b600080fd5b600080fd5b600080fd5b60008083601f84011261021b5761021a6101f6565b5b8235905067ffffffffffffffff811115610238576102376101fb565b5b60208301915083600182028301111561025457610253610200565b5b9250929050565b6000819050919050565b61026d8161025a565b82525050565b60006020820190506102886000830184610264565b9291505056fea2646970667358221220...";

async function deployContracts() {
  try {
    // Connect to RSK Testnet
    const provider = new ethers.JsonRpcProvider(
      "https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T"
    );

    // Load wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("🚀 Starting deployment from:", wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Wallet balance:", ethers.formatEther(balance), "RBTC");

    if (balance < ethers.parseEther("0.1")) {
      console.log(
        "⚠️  Warning: Low balance. Get more testnet RBTC from: https://faucet.rsk.co"
      );
    }

    // Deploy MockToken
    console.log("\n📝 Deploying MockToken...");
    const MockTokenFactory = new ethers.ContractFactory(
      MOCK_TOKEN_ABI,
      MOCK_TOKEN_BYTECODE,
      wallet
    );

    const mockToken = await MockTokenFactory.deploy(
      "Mock Token",
      "MOCK",
      ethers.parseEther("1000000") // 1M tokens
    );

    await mockToken.waitForDeployment();
    const mockTokenAddress = await mockToken.getAddress();
    console.log("✅ MockToken deployed to:", mockTokenAddress);

    // Create deployment results
    const deploymentResults = {
      mockToken: mockTokenAddress,
      // Add other contracts as they're deployed
    };

    // Save to file
    const fs = require("fs");
    fs.writeFileSync(
      "deployed-contracts.json",
      JSON.stringify(deploymentResults, null, 2)
    );

    console.log("\n🎉 Deployment completed!");
    console.log("📄 Contract addresses saved to: deployed-contracts.json");

    return deploymentResults;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

// Run deployment
if (require.main === module) {
  deployContracts()
    .then(() => {
      console.log("✅ Deployment script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Deployment script failed:", error);
      process.exit(1);
    });
}

module.exports = { deployContracts };
