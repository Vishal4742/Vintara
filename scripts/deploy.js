const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Vintara deployment on Rootstock...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy mock tokens for testing
  console.log("\n📦 Deploying mock tokens...");

  const MockToken = await ethers.getContractFactory("MockToken");
  const rBTC = await MockToken.deploy("Wrapped Bitcoin", "rBTC", 18);
  await rBTC.deployed();
  console.log("rBTC deployed to:", rBTC.address);

  const usdt = await MockToken.deploy("Tether USD", "USDT", 6);
  await usdt.deployed();
  console.log("USDT deployed to:", usdt.address);

  const vint = await MockToken.deploy("Vintara Token", "VINT", 18);
  await vint.deployed();
  console.log("VINT deployed to:", vint.address);

  // Deploy PriceOracle
  console.log("\n🔮 Deploying PriceOracle...");
  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.deployed();
  console.log("PriceOracle deployed to:", priceOracle.address);

  // Deploy YieldVault
  console.log("\n🏦 Deploying YieldVault...");
  const YieldVault = await ethers.getContractFactory("YieldVault");
  const yieldVault = await YieldVault.deploy(rBTC.address);
  await yieldVault.deployed();
  console.log("YieldVault deployed to:", yieldVault.address);

  // Deploy LendingProtocol
  console.log("\n💰 Deploying LendingProtocol...");
  const LendingProtocol = await ethers.getContractFactory("LendingProtocol");
  const lendingProtocol = await LendingProtocol.deploy(
    rBTC.address,
    usdt.address
  );
  await lendingProtocol.deployed();
  console.log("LendingProtocol deployed to:", lendingProtocol.address);

  // Deploy LiquidityPool
  console.log("\n🔄 Deploying LiquidityPool...");
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(rBTC.address, usdt.address);
  await liquidityPool.deployed();
  console.log("LiquidityPool deployed to:", liquidityPool.address);

  // Deploy YieldFarming
  console.log("\n🌾 Deploying YieldFarming...");
  const YieldFarming = await ethers.getContractFactory("YieldFarming");
  const yieldFarming = await YieldFarming.deploy(vint.address);
  await yieldFarming.deployed();
  console.log("YieldFarming deployed to:", yieldFarming.address);

  // Deploy Governance
  console.log("\n🗳️ Deploying Governance...");
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(vint.address);
  await governance.deployed();
  console.log("Governance deployed to:", governance.address);

  // Initialize contracts
  console.log("\n⚙️ Initializing contracts...");

  // Add LP pool to yield farming
  await yieldFarming.addPool(liquidityPool.address, 1000, false);
  console.log("Added LP pool to yield farming");

  // Set initial prices in oracle
  await priceOracle.updatePrice(
    rBTC.address,
    ethers.utils.parseUnits("50000", 8),
    9500
  );
  await priceOracle.updatePrice(
    usdt.address,
    ethers.utils.parseUnits("1", 8),
    9800
  );
  await priceOracle.updatePrice(
    vint.address,
    ethers.utils.parseUnits("0.1", 8),
    9000
  );
  console.log("Set initial prices in oracle");

  // Mint some tokens for testing
  await rBTC.mint(deployer.address, ethers.utils.parseEther("100"));
  await usdt.mint(deployer.address, ethers.utils.parseUnits("100000", 6));
  await vint.mint(deployer.address, ethers.utils.parseEther("1000000"));
  console.log("Minted test tokens");

  // Save deployment info
  const deploymentInfo = {
    network: "rootstockTestnet",
    deployer: deployer.address,
    contracts: {
      rBTC: rBTC.address,
      usdt: usdt.address,
      vint: vint.address,
      priceOracle: priceOracle.address,
      yieldVault: yieldVault.address,
      lendingProtocol: lendingProtocol.address,
      liquidityPool: liquidityPool.address,
      yieldFarming: yieldFarming.address,
      governance: governance.address,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✅ Vintara deployment completed successfully!");
  console.log("\n🔗 Contract Addresses:");
  console.log("rBTC Token:", rBTC.address);
  console.log("USDT Token:", usdt.address);
  console.log("VINT Token:", vint.address);
  console.log("PriceOracle:", priceOracle.address);
  console.log("YieldVault:", yieldVault.address);
  console.log("LendingProtocol:", lendingProtocol.address);
  console.log("LiquidityPool:", liquidityPool.address);
  console.log("YieldFarming:", yieldFarming.address);
  console.log("Governance:", governance.address);

  console.log("\n📝 Next Steps:");
  console.log("1. Verify contracts on RSK Explorer");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test all contract functions");
  console.log("4. Deploy to mainnet when ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
