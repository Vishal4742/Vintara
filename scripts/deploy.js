const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Vintara deployment on Rootstock...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Deploy MockToken for testing
  console.log("\n📦 Deploying MockToken...");
  const MockToken = await ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy(
    "Vintara Test Token",
    "VTT",
    ethers.parseEther("1000000") // 1M tokens
  );
  await mockToken.waitForDeployment();
  console.log("MockToken deployed to:", await mockToken.getAddress());

  // Deploy PyTH Oracle
  console.log("\n🔮 Deploying PyTH Oracle...");
  const PythOracle = await ethers.getContractFactory("PythOracle");
  const pythOracle = await PythOracle.deploy();
  await pythOracle.waitForDeployment();
  console.log("PyTH Oracle deployed to:", await pythOracle.getAddress());

  // Deploy ENS Resolver
  console.log("\n🌐 Deploying ENS Resolver...");
  const ENSResolver = await ethers.getContractFactory("ENSResolver");
  const ensResolver = await ENSResolver.deploy(ethers.constants.AddressZero); // Mock registry for now
  await ensResolver.waitForDeployment();
  console.log("ENS Resolver deployed to:", await ensResolver.getAddress());

  // Deploy YieldVault (updated with PyTH Oracle integration)
  console.log("\n🏦 Deploying YieldVault...");
  const YieldVault = await ethers.getContractFactory("YieldVault");
  const yieldVault = await YieldVault.deploy(
    await mockToken.getAddress(),
    await pythOracle.getAddress() // PyTH Oracle integration
  );
  await yieldVault.waitForDeployment();
  console.log("YieldVault deployed to:", await yieldVault.getAddress());

  // Deploy LendingProtocol (updated with PyTH Oracle and ENS integration)
  console.log("\n💰 Deploying LendingProtocol...");
  const LendingProtocol = await ethers.getContractFactory("LendingProtocol");
  const lendingProtocol = await LendingProtocol.deploy(
    await mockToken.getAddress(), // rBTC token
    await mockToken.getAddress(), // USDT token (using same for simplicity)
    await pythOracle.getAddress(), // PyTH Oracle
    await ensResolver.getAddress() // ENS Resolver
  );
  await lendingProtocol.waitForDeployment();
  console.log(
    "LendingProtocol deployed to:",
    await lendingProtocol.getAddress()
  );

  // Deploy LiquidityPool
  console.log("\n🔄 Deploying LiquidityPool...");
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(
    await mockToken.getAddress(),
    await mockToken.getAddress(), // Using same token for simplicity
    ethers.parseEther("0.003") // 0.3% fee
  );
  await liquidityPool.waitForDeployment();
  console.log("LiquidityPool deployed to:", await liquidityPool.getAddress());

  // Deploy YieldFarming
  console.log("\n🌾 Deploying YieldFarming...");
  const YieldFarming = await ethers.getContractFactory("YieldFarming");
  const yieldFarming = await YieldFarming.deploy(
    await mockToken.getAddress(), // Reward token
    ethers.parseEther("1000"), // Reward per block
    100 // Block duration
  );
  await yieldFarming.waitForDeployment();
  console.log("YieldFarming deployed to:", await yieldFarming.getAddress());

  // Deploy PriceOracle
  console.log("\n📊 Deploying PriceOracle...");
  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.waitForDeployment();
  console.log("PriceOracle deployed to:", await priceOracle.getAddress());

  // Deploy Governance
  console.log("\n🗳️ Deploying Governance...");
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(
    await mockToken.getAddress(), // Governance token
    100, // Voting period
    10, // Quorum
    50 // Threshold
  );
  await governance.waitForDeployment();
  console.log("Governance deployed to:", await governance.getAddress());

  // Configure contracts
  console.log("\n⚙️ Configuring contracts...");

  // Set up PyTH Oracle with initial prices
  const rbtcPriceId =
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
  const usdtPriceId =
    "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b";

  await pythOracle.connect(deployer).updatePrice(
    rbtcPriceId,
    BigInt("4500000000000"), // $45,000 in 8 decimals
    BigInt("950000000"), // 95% confidence
    -8, // 8 decimal places
    Math.floor(Date.now() / 1000)
  );

  await pythOracle.connect(deployer).updatePrice(
    usdtPriceId,
    BigInt("100000000"), // $1.00 in 8 decimals
    BigInt("980000000"), // 98% confidence
    -8, // 8 decimal places
    Math.floor(Date.now() / 1000)
  );
  console.log("✅ Set up PyTH Oracle with initial prices");

  // Register some ENS names for testing
  const aliceNameHash = ethers.keccak256(
    ethers.toUtf8Bytes("alice.vintara.eth")
  );
  const bobNameHash = ethers.keccak256(ethers.toUtf8Bytes("bob.vintara.eth"));

  await ensResolver
    .connect(deployer)
    .registerENSName(aliceNameHash, "alice.vintara.eth", deployer.address);

  await ensResolver
    .connect(deployer)
    .registerENSName(bobNameHash, "bob.vintara.eth", deployer.address);
  console.log("✅ Registered test ENS names");

  // Set price feeds in oracle
  await priceOracle.setPriceFeed(
    await mockToken.getAddress(),
    ethers.parseEther("1") // $1 price
  );
  console.log("✅ Set price feed in oracle");

  // Transfer some tokens to contracts for initial liquidity
  await mockToken.transfer(
    await yieldVault.getAddress(),
    ethers.parseEther("10000")
  );
  await mockToken.transfer(
    await liquidityPool.getAddress(),
    ethers.parseEther("5000")
  );
  console.log("✅ Transferred initial tokens to contracts");

  // Verify deployments
  console.log("\n🔍 Verifying deployments...");
  try {
    await hre.run("verify:verify", {
      address: await mockToken.getAddress(),
      constructorArguments: [
        "Vintara Test Token",
        "VTT",
        ethers.parseEther("1000000"),
      ],
    });
    console.log("✅ MockToken verified");
  } catch (error) {
    console.log("❌ MockToken verification failed:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    contracts: {
      MockToken: await mockToken.getAddress(),
      PythOracle: await pythOracle.getAddress(),
      ENSResolver: await ensResolver.getAddress(),
      YieldVault: await yieldVault.getAddress(),
      LendingProtocol: await lendingProtocol.getAddress(),
      LiquidityPool: await liquidityPool.getAddress(),
      YieldFarming: await yieldFarming.getAddress(),
      PriceOracle: await priceOracle.getAddress(),
      Governance: await governance.getAddress(),
    },
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(
    __dirname,
    "..",
    "deployments",
    `${hre.network.name}.json`
  );

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved to: ${deploymentPath}`);

  console.log("\n✅ Vintara deployment completed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log("\nContract Addresses:");
  Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    console.log(`${name}: ${address}`);
  });

  console.log("\n🔗 Explorer Links:");
  const explorerUrl =
    hre.network.name === "rootstockTestnet"
      ? "https://explorer.testnet.rsk.co"
      : "https://explorer.rsk.co";

  Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    console.log(`${name}: ${explorerUrl}/address/${address}`);
  });

  console.log("\n🎉 Ready for testing! You can now:");
  console.log("1. Test the contracts using the deployed addresses");
  console.log("2. Interact with the frontend using these contract addresses");
  console.log("3. Verify contracts on the block explorer");
  console.log("4. Submit your hackathon project!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
