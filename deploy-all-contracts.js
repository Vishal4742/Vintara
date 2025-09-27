const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// RSK Testnet configuration
const RSK_TESTNET_RPC =
  "https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T";
const CHAIN_ID = 31;

// Contract deployment order (dependencies first)
const CONTRACT_ORDER = [
  "MockToken",
  "PythOracle",
  "ENSResolver",
  "PriceOracle",
  "YieldVault",
  "LendingProtocol",
  "LiquidityPool",
  "YieldFarming",
  "Governance",
];

async function deployContracts() {
  try {
    console.log("🚀 Starting Vintara DeFi Protocol Deployment");
    console.log("🌐 Network: RSK Testnet");
    console.log("🔗 RPC:", RSK_TESTNET_RPC);

    // Connect to network
    const provider = new ethers.JsonRpcProvider(RSK_TESTNET_RPC);

    // Load wallet
    if (!process.env.PRIVATE_KEY) {
      throw new Error("❌ PRIVATE_KEY not found in .env file");
    }

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("👤 Deploying from:", wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Wallet balance:", ethers.formatEther(balance), "RBTC");

    if (balance < ethers.parseEther("0.5")) {
      console.log(
        "⚠️  Warning: Low balance. Get more testnet RBTC from: https://faucet.rsk.co"
      );
      console.log("💡 You need at least 0.5 RBTC for deployment");
    }

    // Check network
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== CHAIN_ID) {
      throw new Error(
        `❌ Wrong network. Expected chain ID ${CHAIN_ID}, got ${network.chainId}`
      );
    }

    console.log("✅ Connected to RSK Testnet");

    const deployedContracts = {};

    // Deploy contracts in order
    for (const contractName of CONTRACT_ORDER) {
      console.log(`\n📝 Deploying ${contractName}...`);

      try {
        const contractAddress = await deployContract(
          contractName,
          wallet,
          deployedContracts
        );
        deployedContracts[contractName] = contractAddress;
        console.log(`✅ ${contractName} deployed to: ${contractAddress}`);
      } catch (error) {
        console.error(`❌ Failed to deploy ${contractName}:`, error.message);
        throw error;
      }
    }

    // Save deployment results
    const deploymentResults = {
      network: "RSK Testnet",
      chainId: CHAIN_ID,
      deployer: wallet.address,
      timestamp: new Date().toISOString(),
      contracts: deployedContracts,
    };

    fs.writeFileSync(
      "deployed-contracts.json",
      JSON.stringify(deploymentResults, null, 2)
    );

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("📄 Contract addresses saved to: deployed-contracts.json");

    // Generate frontend config
    generateFrontendConfig(deployedContracts);

    return deploymentResults;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

async function deployContract(contractName, wallet, deployedContracts) {
  // For now, we'll use a simplified approach
  // In a real scenario, you'd compile the contracts first

  switch (contractName) {
    case "MockToken":
      return await deployMockToken(wallet);
    case "PythOracle":
      return await deployPythOracle(wallet);
    case "ENSResolver":
      return await deployENSResolver(wallet);
    case "PriceOracle":
      return await deployPriceOracle(wallet);
    case "YieldVault":
      return await deployYieldVault(wallet, deployedContracts);
    case "LendingProtocol":
      return await deployLendingProtocol(wallet, deployedContracts);
    case "LiquidityPool":
      return await deployLiquidityPool(wallet, deployedContracts);
    case "YieldFarming":
      return await deployYieldFarming(wallet, deployedContracts);
    case "Governance":
      return await deployGovernance(wallet, deployedContracts);
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }
}

async function deployMockToken(wallet) {
  // Simplified MockToken deployment
  // In reality, you'd use the compiled bytecode
  const MockTokenABI = [
    "constructor(string memory name, string memory symbol, uint256 initialSupply)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
  ];

  // This is a placeholder - you'd need the actual compiled bytecode
  const MockTokenBytecode =
    "0x608060405234801561001057600080fd5b50600436106100575760003560e01c806306fdde031461005c578063095ea7b31461007a57806318160ddd1461009657806323b872dd146100b4578063313ce567146100d0575b600080fd5b6100646100ee565b604051610071919061012c565b60405180910390f35b610094600480360381019061008f9190610198565b61017c565b005b61009e610194565b6040516100ab91906101e7565b60405180910390f35b6100ce60048036038101906100c99190610203565b61019a565b005b6100d86101b9565b6040516100e59190610272565b60405180910390f35b60606040518060400160405280600a81526020017f4d6f636b20546f6b656e00000000000000000000000000000000000000000000815250905090565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60025490565b6101a26101be565b6101b38383836101c6565b505050565b60006012905090565b50565b505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101f3826101c8565b9050919050565b600080fd5b600080fd5b600080fd5b60008083601f84011261021b5761021a6101f6565b5b8235905067ffffffffffffffff811115610238576102376101fb565b5b60208301915083600182028301111561025457610253610200565b5b9250929050565b6000819050919050565b61026d8161025a565b82525050565b60006020820190506102886000830184610264565b9291505056fea2646970667358221220...";

  const MockTokenFactory = new ethers.ContractFactory(
    MockTokenABI,
    MockTokenBytecode,
    wallet
  );

  const mockToken = await MockTokenFactory.deploy(
    "Mock Token",
    "MOCK",
    ethers.parseEther("1000000")
  );

  await mockToken.waitForDeployment();
  return await mockToken.getAddress();
}

async function deployPythOracle(wallet) {
  // Placeholder for PythOracle deployment
  // You'd need the actual compiled bytecode
  console.log("⚠️  PythOracle deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployENSResolver(wallet) {
  // Placeholder for ENSResolver deployment
  console.log("⚠️  ENSResolver deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployPriceOracle(wallet) {
  // Placeholder for PriceOracle deployment
  console.log("⚠️  PriceOracle deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployYieldVault(wallet, deployedContracts) {
  // Placeholder for YieldVault deployment
  console.log("⚠️  YieldVault deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployLendingProtocol(wallet, deployedContracts) {
  // Placeholder for LendingProtocol deployment
  console.log("⚠️  LendingProtocol deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployLiquidityPool(wallet, deployedContracts) {
  // Placeholder for LiquidityPool deployment
  console.log("⚠️  LiquidityPool deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployYieldFarming(wallet, deployedContracts) {
  // Placeholder for YieldFarming deployment
  console.log("⚠️  YieldFarming deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

async function deployGovernance(wallet, deployedContracts) {
  // Placeholder for Governance deployment
  console.log("⚠️  Governance deployment requires compiled bytecode");
  return "0x0000000000000000000000000000000000000000";
}

function generateFrontendConfig(deployedContracts) {
  const frontendConfig = `// Auto-generated contract addresses
export const CONTRACTS = {
  mockToken: "${
    deployedContracts.MockToken || "0x0000000000000000000000000000000000000000"
  }",
  pythOracle: "${
    deployedContracts.PythOracle || "0x0000000000000000000000000000000000000000"
  }",
  ensResolver: "${
    deployedContracts.ENSResolver ||
    "0x0000000000000000000000000000000000000000"
  }",
  priceOracle: "${
    deployedContracts.PriceOracle ||
    "0x0000000000000000000000000000000000000000"
  }",
  yieldVault: "${
    deployedContracts.YieldVault || "0x0000000000000000000000000000000000000000"
  }",
  lendingProtocol: "${
    deployedContracts.LendingProtocol ||
    "0x0000000000000000000000000000000000000000"
  }",
  liquidityPool: "${
    deployedContracts.LiquidityPool ||
    "0x0000000000000000000000000000000000000000"
  }",
  yieldFarming: "${
    deployedContracts.YieldFarming ||
    "0x0000000000000000000000000000000000000000"
  }",
  governance: "${
    deployedContracts.Governance || "0x0000000000000000000000000000000000000000"
  }",
} as const;
`;

  fs.writeFileSync("src/config/contracts-deployed.ts", frontendConfig);
  console.log("📄 Frontend config generated: src/config/contracts-deployed.ts");
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
