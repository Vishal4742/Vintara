const { ethers } = require("ethers");

// Direct configuration
const PRIVATE_KEY =
  "0x8e708320cec9208f109987c3a5bd905f354d3edc6b1056f7d66b62de1a85d550";
const RSK_TESTNET_RPC =
  "https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T";

async function deployContracts() {
  try {
    console.log("🚀 Starting Vintara DeFi Protocol Deployment");
    console.log("🌐 Network: RSK Testnet");
    console.log("🔗 RPC:", RSK_TESTNET_RPC);

    // Connect to network
    const provider = new ethers.JsonRpcProvider(RSK_TESTNET_RPC);

    // Load wallet
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("👤 Deploying from:", wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Wallet balance:", ethers.formatEther(balance), "RBTC");

    if (balance < ethers.parseEther("0.1")) {
      console.log(
        "⚠️  Warning: Low balance. Get more testnet RBTC from: https://faucet.rsk.co"
      );
    }

    // Check network
    const network = await provider.getNetwork();
    console.log(
      "✅ Connected to network:",
      network.name,
      "Chain ID:",
      network.chainId
    );

    // Simple MockToken ABI and bytecode for testing
    const MockTokenABI = [
      "constructor(string memory name, string memory symbol, uint256 initialSupply)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
    ];

    // Deploy MockToken first
    console.log("\n📝 Deploying MockToken...");
    const MockTokenFactory = new ethers.ContractFactory(
      MockTokenABI,
      "0x608060405234801561001057600080fd5b50600436106100575760003560e01c806306fdde031461005c578063095ea7b31461007a57806318160ddd1461009657806323b872dd146100b4578063313ce567146100d0575b600080fd5b6100646100ee565b604051610071919061012c565b60405180910390f35b610094600480360381019061008f9190610198565b61017c565b005b61009e610194565b6040516100ab91906101e7565b60405180910390f35b6100ce60048036038101906100c99190610203565b61019a565b005b6100d86101b9565b6040516100e59190610272565b60405180910390f35b60606040518060400160405280600a81526020017f4d6f636b20546f6b656e00000000000000000000000000000000000000000000815250905090565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60025490565b6101a26101be565b6101b38383836101c6565b505050565b60006012905090565b50565b505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101f3826101c8565b9050919050565b600080fd5b600080fd5b600080fd5b60008083601f84011261021b5761021a6101f6565b5b8235905067ffffffffffffffff811115610238576102376101fb565b5b60208301915083600182028301111561025457610253610200565b5b9250929050565b6000819050919050565b61026d8161025a565b82525050565b60006020820190506102886000830184610264565b9291505056fea2646970667358221220...",
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
      network: "RSK Testnet",
      chainId: 31,
      deployer: wallet.address,
      timestamp: new Date().toISOString(),
      contracts: {
        mockToken: mockTokenAddress,
      },
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
deployContracts()
  .then(() => {
    console.log("✅ Deployment script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });
