const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldVault", function () {
  let yieldVault;
  let rBTC;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock rBTC token
    const MockToken = await ethers.getContractFactory("MockToken");
    rBTC = await MockToken.deploy("Wrapped Bitcoin", "rBTC", 18);
    await rBTC.deployed();

    // Deploy YieldVault
    const YieldVault = await ethers.getContractFactory("YieldVault");
    yieldVault = await YieldVault.deploy(rBTC.address);
    await yieldVault.deployed();

    // Mint some rBTC for testing
    await rBTC.mint(owner.address, ethers.utils.parseEther("1000"));
    await rBTC.mint(user1.address, ethers.utils.parseEther("100"));
    await rBTC.mint(user2.address, ethers.utils.parseEther("100"));
  });

  describe("Deployment", function () {
    it("Should set the correct rBTC token address", async function () {
      expect(await yieldVault.rBTC()).to.equal(rBTC.address);
    });

    it("Should set the correct initial yield rate", async function () {
      expect(await yieldVault.getCurrentAPY()).to.equal(1000); // 10%
    });

    it("Should set the correct initial values", async function () {
      expect(await yieldVault.totalAssets()).to.equal(0);
      expect(await yieldVault.totalSupply()).to.equal(0);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit rBTC", async function () {
      const depositAmount = ethers.utils.parseEther("1");

      // Approve and deposit
      await rBTC.connect(user1).approve(yieldVault.address, depositAmount);
      await yieldVault.connect(user1).deposit(depositAmount);

      // Check balances
      expect(await yieldVault.balances(user1.address)).to.equal(depositAmount);
      expect(await yieldVault.totalAssets()).to.equal(depositAmount);
      expect(await yieldVault.totalSupply()).to.equal(depositAmount);
    });

    it("Should emit Deposit event", async function () {
      const depositAmount = ethers.utils.parseEther("1");

      await rBTC.connect(user1).approve(yieldVault.address, depositAmount);

      await expect(yieldVault.connect(user1).deposit(depositAmount))
        .to.emit(yieldVault, "Deposited")
        .withArgs(user1.address, depositAmount, depositAmount);
    });

    it("Should reject zero amount deposits", async function () {
      await expect(yieldVault.connect(user1).deposit(0)).to.be.revertedWith(
        "InvalidAmount()"
      );
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // Setup: user1 deposits 1 rBTC
      const depositAmount = ethers.utils.parseEther("1");
      await rBTC.connect(user1).approve(yieldVault.address, depositAmount);
      await yieldVault.connect(user1).deposit(depositAmount);
    });

    it("Should allow users to withdraw their deposits", async function () {
      const withdrawAmount = ethers.utils.parseEther("0.5");

      await yieldVault.connect(user1).withdraw(withdrawAmount);

      expect(await yieldVault.balances(user1.address)).to.equal(
        ethers.utils.parseEther("0.5")
      );
      expect(await yieldVault.totalAssets()).to.equal(
        ethers.utils.parseEther("0.5")
      );
      expect(await yieldVault.totalSupply()).to.equal(
        ethers.utils.parseEther("0.5")
      );
    });

    it("Should emit Withdrawn event", async function () {
      const withdrawAmount = ethers.utils.parseEther("0.5");

      await expect(yieldVault.connect(user1).withdraw(withdrawAmount))
        .to.emit(yieldVault, "Withdrawn")
        .withArgs(user1.address, withdrawAmount, withdrawAmount);
    });

    it("Should reject withdrawals exceeding balance", async function () {
      const withdrawAmount = ethers.utils.parseEther("2");

      await expect(
        yieldVault.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWith("InvalidAmount()");
    });
  });

  describe("Yield Generation", function () {
    beforeEach(async function () {
      // Setup: user1 deposits 1 rBTC
      const depositAmount = ethers.utils.parseEther("1");
      await rBTC.connect(user1).approve(yieldVault.address, depositAmount);
      await yieldVault.connect(user1).deposit(depositAmount);
    });

    it("Should calculate yield correctly", async function () {
      // Fast forward time by 1 day
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
      await ethers.provider.send("evm_mine");

      const yield = await yieldVault.calculateYield(user1.address);
      expect(yield).to.be.gt(0);
    });

    it("Should allow users to claim yield", async function () {
      // Fast forward time by 1 day
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");

      const yield = await yieldVault.calculateYield(user1.address);

      if (yield.gt(0)) {
        await expect(yieldVault.connect(user1).claimYield())
          .to.emit(yieldVault, "YieldClaimed")
          .withArgs(user1.address, yield);
      }
    });
  });

  describe("Administrative Functions", function () {
    it("Should allow manager to update yield rate", async function () {
      const newRate = 1500; // 15%

      await expect(yieldVault.updateYieldRate(newRate))
        .to.emit(yieldVault, "YieldRateUpdated")
        .withArgs(newRate);

      expect(await yieldVault.getCurrentAPY()).to.equal(newRate);
    });

    it("Should allow admin to pause the contract", async function () {
      await yieldVault.pause();
      expect(await yieldVault.paused()).to.be.true;
    });

    it("Should allow admin to unpause the contract", async function () {
      await yieldVault.pause();
      await yieldVault.unpause();
      expect(await yieldVault.paused()).to.be.false;
    });
  });

  describe("Access Control", function () {
    it("Should reject non-manager yield rate updates", async function () {
      await expect(
        yieldVault.connect(user1).updateYieldRate(1500)
      ).to.be.revertedWith(
        "AccessControl: account " +
          user1.address.toLowerCase() +
          " is missing role " +
          (await yieldVault.MANAGER_ROLE())
      );
    });

    it("Should reject non-admin pause operations", async function () {
      await expect(yieldVault.connect(user1).pause()).to.be.revertedWith(
        "AccessControl: account " +
          user1.address.toLowerCase() +
          " is missing role " +
          (await yieldVault.DEFAULT_ADMIN_ROLE())
      );
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple users correctly", async function () {
      const depositAmount1 = ethers.utils.parseEther("1");
      const depositAmount2 = ethers.utils.parseEther("2");

      // User1 deposits
      await rBTC.connect(user1).approve(yieldVault.address, depositAmount1);
      await yieldVault.connect(user1).deposit(depositAmount1);

      // User2 deposits
      await rBTC.connect(user2).approve(yieldVault.address, depositAmount2);
      await yieldVault.connect(user2).deposit(depositAmount2);

      expect(await yieldVault.totalAssets()).to.equal(
        ethers.utils.parseEther("3")
      );
      expect(await yieldVault.totalSupply()).to.equal(
        ethers.utils.parseEther("3")
      );
    });

    it("Should handle zero balance yield calculation", async function () {
      const yield = await yieldVault.calculateYield(user1.address);
      expect(yield).to.equal(0);
    });
  });
});
