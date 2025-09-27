const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vintara - Complete System Test", function () {
  let contracts = {};
  let owner;
  let user1;
  let user2;
  let treasury;

  before(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();
    console.log("Setting up complete Vintara system...");
  });

  beforeEach(async function () {
    // Deploy all contracts
    console.log("Deploying contracts...");

    // Deploy MockToken
    const MockToken = await ethers.getContractFactory("MockToken");
    contracts.mockToken = await MockToken.deploy(
      "Vintara Test Token",
      "VTT",
      ethers.parseEther("1000000")
    );
    await contracts.mockToken.waitForDeployment();

    // Deploy YieldVault
    const YieldVault = await ethers.getContractFactory("YieldVault");
    contracts.yieldVault = await YieldVault.deploy(
      await contracts.mockToken.getAddress(),
      treasury.address,
      ethers.parseEther("0.1")
    );
    await contracts.yieldVault.waitForDeployment();

    // Deploy LendingProtocol
    const LendingProtocol = await ethers.getContractFactory("LendingProtocol");
    contracts.lendingProtocol = await LendingProtocol.deploy();
    await contracts.lendingProtocol.waitForDeployment();

    // Deploy LiquidityPool
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    contracts.liquidityPool = await LiquidityPool.deploy(
      await contracts.mockToken.getAddress(),
      await contracts.mockToken.getAddress(),
      ethers.parseEther("0.003")
    );
    await contracts.liquidityPool.waitForDeployment();

    // Deploy YieldFarming
    const YieldFarming = await ethers.getContractFactory("YieldFarming");
    contracts.yieldFarming = await YieldFarming.deploy(
      await contracts.mockToken.getAddress(),
      ethers.parseEther("1000"),
      100
    );
    await contracts.yieldFarming.waitForDeployment();

    // Deploy PriceOracle
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    contracts.priceOracle = await PriceOracle.deploy();
    await contracts.priceOracle.waitForDeployment();

    // Deploy Governance
    const Governance = await ethers.getContractFactory("Governance");
    contracts.governance = await Governance.deploy(
      await contracts.mockToken.getAddress(),
      100,
      10,
      50
    );
    await contracts.governance.waitForDeployment();

    // Setup contracts
    await setupContracts();
  });

  async function setupContracts() {
    // Add supported token to lending protocol
    await contracts.lendingProtocol.addSupportedToken(
      await contracts.mockToken.getAddress(),
      ethers.parseEther("0.8"),
      ethers.parseEther("0.1")
    );

    // Set price feed
    await contracts.priceOracle.setPriceFeed(
      await contracts.mockToken.getAddress(),
      ethers.parseEther("1")
    );

    // Transfer tokens to users
    await contracts.mockToken.transfer(
      user1.address,
      ethers.parseEther("1000")
    );
    await contracts.mockToken.transfer(
      user2.address,
      ethers.parseEther("1000")
    );

    // Approve contracts
    await contracts.mockToken
      .connect(user1)
      .approve(
        await contracts.yieldVault.getAddress(),
        ethers.parseEther("1000")
      );
    await contracts.mockToken
      .connect(user1)
      .approve(
        await contracts.lendingProtocol.getAddress(),
        ethers.parseEther("1000")
      );
    await contracts.mockToken
      .connect(user1)
      .approve(
        await contracts.liquidityPool.getAddress(),
        ethers.parseEther("1000")
      );

    await contracts.mockToken
      .connect(user2)
      .approve(
        await contracts.yieldVault.getAddress(),
        ethers.parseEther("1000")
      );
    await contracts.mockToken
      .connect(user2)
      .approve(
        await contracts.lendingProtocol.getAddress(),
        ethers.parseEther("1000")
      );
    await contracts.mockToken
      .connect(user2)
      .approve(
        await contracts.liquidityPool.getAddress(),
        ethers.parseEther("1000")
      );
  }

  describe("System Integration", function () {
    it("Should allow complete DeFi workflow", async function () {
      console.log("Testing complete DeFi workflow...");

      // 1. User deposits to yield vault
      await contracts.yieldVault
        .connect(user1)
        .deposit(ethers.parseEther("100"));
      console.log("✅ User deposited to yield vault");

      // 2. User provides liquidity
      await contracts.liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("50"), ethers.parseEther("100"));
      console.log("✅ User provided liquidity");

      // 3. User deposits collateral for lending
      await contracts.lendingProtocol
        .connect(user1)
        .depositCollateral(
          await contracts.mockToken.getAddress(),
          ethers.parseEther("200")
        );
      console.log("✅ User deposited collateral");

      // 4. User borrows against collateral
      await contracts.lendingProtocol
        .connect(user1)
        .borrow(
          await contracts.mockToken.getAddress(),
          ethers.parseEther("100")
        );
      console.log("✅ User borrowed against collateral");

      // 5. User stakes in yield farming
      const lpBalance = await contracts.liquidityPool.balanceOf(user1.address);
      await contracts.liquidityPool
        .connect(user1)
        .approve(await contracts.yieldFarming.getAddress(), lpBalance);
      await contracts.yieldFarming.connect(user1).stake(lpBalance);
      console.log("✅ User staked in yield farming");

      // Verify all positions
      const vaultBalance = await contracts.yieldVault.balanceOf(user1.address);
      const collateralBalance =
        await contracts.lendingProtocol.getCollateralBalance(
          user1.address,
          await contracts.mockToken.getAddress()
        );
      const borrowBalance = await contracts.lendingProtocol.getBorrowBalance(
        user1.address,
        await contracts.mockToken.getAddress()
      );
      const stakedBalance = await contracts.yieldFarming.getStakedBalance(
        user1.address
      );

      expect(vaultBalance).to.equal(ethers.parseEther("100"));
      expect(collateralBalance).to.equal(ethers.parseEther("200"));
      expect(borrowBalance).to.equal(ethers.parseEther("100"));
      expect(stakedBalance).to.be.gt(0);

      console.log("✅ All positions verified");
    });

    it("Should handle multiple users interacting with the system", async function () {
      console.log("Testing multi-user interactions...");

      // User1 deposits to yield vault
      await contracts.yieldVault
        .connect(user1)
        .deposit(ethers.parseEther("100"));

      // User2 provides liquidity
      await contracts.liquidityPool
        .connect(user2)
        .addLiquidity(ethers.parseEther("75"), ethers.parseEther("150"));

      // User1 swaps tokens
      await contracts.liquidityPool
        .connect(user1)
        .swap(
          await contracts.mockToken.getAddress(),
          ethers.parseEther("10"),
          ethers.parseEther("15")
        );

      // User2 deposits collateral and borrows
      await contracts.lendingProtocol
        .connect(user2)
        .depositCollateral(
          await contracts.mockToken.getAddress(),
          ethers.parseEther("150")
        );
      await contracts.lendingProtocol
        .connect(user2)
        .borrow(
          await contracts.mockToken.getAddress(),
          ethers.parseEther("75")
        );

      // Verify system state
      const totalVaultSupply = await contracts.yieldVault.totalSupply();
      const totalLiquidity = await contracts.liquidityPool.totalSupply();
      const totalCollateral =
        await contracts.lendingProtocol.getTotalCollateral(
          await contracts.mockToken.getAddress()
        );

      expect(totalVaultSupply).to.be.gt(0);
      expect(totalLiquidity).to.be.gt(0);
      expect(totalCollateral).to.be.gt(0);

      console.log("✅ Multi-user interactions successful");
    });

    it("Should handle yield generation across all protocols", async function () {
      console.log("Testing yield generation...");

      // Setup positions
      await contracts.yieldVault
        .connect(user1)
        .deposit(ethers.parseEther("100"));
      await contracts.liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("50"), ethers.parseEther("100"));

      // Generate yield by transferring tokens to contracts
      await contracts.mockToken.transfer(
        await contracts.yieldVault.getAddress(),
        ethers.parseEther("10")
      );
      await contracts.mockToken.transfer(
        await contracts.liquidityPool.getAddress(),
        ethers.parseEther("5")
      );

      // Check yield generation
      const vaultBalance = await contracts.yieldVault.balanceOf(user1.address);
      const lpBalance = await contracts.liquidityPool.balanceOf(user1.address);

      expect(vaultBalance).to.be.gt(ethers.parseEther("100"));
      expect(lpBalance).to.be.gt(0);

      console.log("✅ Yield generation successful");
    });

    it("Should handle governance voting", async function () {
      console.log("Testing governance...");

      // Transfer governance tokens to users
      await contracts.mockToken.transfer(
        user1.address,
        ethers.parseEther("1000")
      );
      await contracts.mockToken.transfer(
        user2.address,
        ethers.parseEther("1000")
      );

      // Approve governance contract
      await contracts.mockToken
        .connect(user1)
        .approve(
          await contracts.governance.getAddress(),
          ethers.parseEther("1000")
        );
      await contracts.mockToken
        .connect(user2)
        .approve(
          await contracts.governance.getAddress(),
          ethers.parseEther("1000")
        );

      // Create proposal
      await contracts.governance.connect(user1).createProposal(
        "Test Proposal",
        "This is a test proposal",
        await contracts.yieldVault.getAddress(),
        "0x" // Empty calldata for test
      );

      // Vote on proposal
      await contracts.governance.connect(user1).vote(0, true);
      await contracts.governance.connect(user2).vote(0, false);

      // Check voting results
      const proposal = await contracts.governance.getProposal(0);
      expect(proposal.votesFor).to.be.gt(0);
      expect(proposal.votesAgainst).to.be.gt(0);

      console.log("✅ Governance voting successful");
    });
  });

  describe("Security Tests", function () {
    it("Should prevent unauthorized access", async function () {
      // Non-owner should not be able to pause contracts
      await expect(
        contracts.yieldVault.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        contracts.lendingProtocol
          .connect(user1)
          .addSupportedToken(
            await contracts.mockToken.getAddress(),
            ethers.parseEther("0.8"),
            ethers.parseEther("0.1")
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should handle edge cases gracefully", async function () {
      // Test with zero amounts
      await expect(
        contracts.yieldVault.connect(user1).deposit(0)
      ).to.be.revertedWith("Amount must be greater than 0");

      await expect(
        contracts.liquidityPool
          .connect(user1)
          .addLiquidity(0, ethers.parseEther("100"))
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should maintain system invariants", async function () {
      // Test that total supply equals sum of balances
      await contracts.yieldVault
        .connect(user1)
        .deposit(ethers.parseEther("100"));
      await contracts.yieldVault
        .connect(user2)
        .deposit(ethers.parseEther("200"));

      const totalSupply = await contracts.yieldVault.totalSupply();
      const user1Balance = await contracts.yieldVault.balanceOf(user1.address);
      const user2Balance = await contracts.yieldVault.balanceOf(user2.address);

      expect(totalSupply).to.equal(user1Balance + user2Balance);
    });
  });

  describe("Gas Optimization", function () {
    it("Should use reasonable gas for common operations", async function () {
      // Test gas usage for common operations
      const depositTx = await contracts.yieldVault
        .connect(user1)
        .deposit(ethers.parseEther("100"));
      const depositReceipt = await depositTx.wait();
      console.log(`Deposit gas used: ${depositReceipt.gasUsed.toString()}`);

      const addLiquidityTx = await contracts.liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("50"), ethers.parseEther("100"));
      const addLiquidityReceipt = await addLiquidityTx.wait();
      console.log(
        `Add liquidity gas used: ${addLiquidityReceipt.gasUsed.toString()}`
      );

      // Gas usage should be reasonable (less than 500k gas for most operations)
      expect(depositReceipt.gasUsed).to.be.lt(500000);
      expect(addLiquidityReceipt.gasUsed).to.be.lt(500000);
    });
  });
});
