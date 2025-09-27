const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldVault", function () {
  let yieldVault;
  let mockToken;
  let owner;
  let user1;
  let user2;
  let treasury;

  beforeEach(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();

    // Deploy MockToken
    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await MockToken.deploy(
      "Mock Token",
      "MTK",
      ethers.parseEther("1000000")
    );
    await mockToken.waitForDeployment();

    // Deploy YieldVault
    const YieldVault = await ethers.getContractFactory("YieldVault");
    yieldVault = await YieldVault.deploy(
      await mockToken.getAddress(),
      treasury.address,
      ethers.parseEther("0.1") // 10% fee
    );
    await yieldVault.waitForDeployment();

    // Transfer tokens to users for testing
    await mockToken.transfer(user1.address, ethers.parseEther("1000"));
    await mockToken.transfer(user2.address, ethers.parseEther("1000"));

    // Approve vault to spend tokens
    await mockToken
      .connect(user1)
      .approve(await yieldVault.getAddress(), ethers.parseEther("1000"));
    await mockToken
      .connect(user2)
      .approve(await yieldVault.getAddress(), ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await yieldVault.token()).to.equal(await mockToken.getAddress());
    });

    it("Should set the correct treasury address", async function () {
      expect(await yieldVault.treasury()).to.equal(treasury.address);
    });

    it("Should set the correct fee rate", async function () {
      expect(await yieldVault.feeRate()).to.equal(ethers.parseEther("0.1"));
    });

    it("Should set the correct owner", async function () {
      expect(await yieldVault.owner()).to.equal(owner.address);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit tokens", async function () {
      const depositAmount = ethers.parseEther("100");

      await expect(yieldVault.connect(user1).deposit(depositAmount))
        .to.emit(yieldVault, "Deposit")
        .withArgs(user1.address, depositAmount);

      expect(await yieldVault.balanceOf(user1.address)).to.equal(depositAmount);
      expect(await yieldVault.totalSupply()).to.equal(depositAmount);
    });

    it("Should not allow zero deposits", async function () {
      await expect(yieldVault.connect(user1).deposit(0)).to.be.revertedWith(
        "Amount must be greater than 0"
      );
    });

    it("Should not allow deposits when paused", async function () {
      await yieldVault.pause();

      await expect(
        yieldVault.connect(user1).deposit(ethers.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // User1 deposits 100 tokens
      await yieldVault.connect(user1).deposit(ethers.parseEther("100"));
    });

    it("Should allow users to withdraw their tokens", async function () {
      const withdrawAmount = ethers.parseEther("50");

      await expect(yieldVault.connect(user1).withdraw(withdrawAmount))
        .to.emit(yieldVault, "Withdraw")
        .withArgs(user1.address, withdrawAmount);

      expect(await yieldVault.balanceOf(user1.address)).to.equal(
        ethers.parseEther("50")
      );
    });

    it("Should not allow withdrawals exceeding balance", async function () {
      await expect(
        yieldVault.connect(user1).withdraw(ethers.parseEther("150"))
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should not allow zero withdrawals", async function () {
      await expect(yieldVault.connect(user1).withdraw(0)).to.be.revertedWith(
        "Amount must be greater than 0"
      );
    });
  });

  describe("Yield Generation", function () {
    beforeEach(async function () {
      // Users deposit tokens
      await yieldVault.connect(user1).deposit(ethers.parseEther("100"));
      await yieldVault.connect(user2).deposit(ethers.parseEther("200"));
    });

    it("Should generate yield for depositors", async function () {
      // Simulate yield by transferring tokens to vault
      await mockToken.transfer(
        await yieldVault.getAddress(),
        ethers.parseEther("30")
      );

      // Check that users can withdraw more than they deposited
      const user1Balance = await yieldVault.balanceOf(user1.address);
      const user2Balance = await yieldVault.balanceOf(user2.address);

      expect(user1Balance).to.be.gt(ethers.parseEther("100"));
      expect(user2Balance).to.be.gt(ethers.parseEther("200"));
    });
  });

  describe("Administrative Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await yieldVault.pause();
      expect(await yieldVault.paused()).to.be.true;
    });

    it("Should allow owner to unpause the contract", async function () {
      await yieldVault.pause();
      await yieldVault.unpause();
      expect(await yieldVault.paused()).to.be.false;
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(yieldVault.connect(user1).pause()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should allow owner to update fee rate", async function () {
      const newFeeRate = ethers.parseEther("0.05");
      await yieldVault.setFeeRate(newFeeRate);
      expect(await yieldVault.feeRate()).to.equal(newFeeRate);
    });

    it("Should not allow fee rate above 100%", async function () {
      await expect(
        yieldVault.setFeeRate(ethers.parseEther("1.1"))
      ).to.be.revertedWith("Fee rate cannot exceed 100%");
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to set fee rate", async function () {
      await expect(
        yieldVault.connect(user1).setFeeRate(ethers.parseEther("0.05"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple deposits and withdrawals correctly", async function () {
      // Multiple deposits
      await yieldVault.connect(user1).deposit(ethers.parseEther("100"));
      await yieldVault.connect(user1).deposit(ethers.parseEther("50"));

      expect(await yieldVault.balanceOf(user1.address)).to.equal(
        ethers.parseEther("150")
      );

      // Partial withdrawal
      await yieldVault.connect(user1).withdraw(ethers.parseEther("75"));
      expect(await yieldVault.balanceOf(user1.address)).to.equal(
        ethers.parseEther("75")
      );
    });

    it("Should handle yield distribution correctly with multiple users", async function () {
      // Users deposit different amounts
      await yieldVault.connect(user1).deposit(ethers.parseEther("100"));
      await yieldVault.connect(user2).deposit(ethers.parseEther("200"));

      // Generate yield
      await mockToken.transfer(
        await yieldVault.getAddress(),
        ethers.parseEther("30")
      );

      // Check proportional distribution
      const user1Balance = await yieldVault.balanceOf(user1.address);
      const user2Balance = await yieldVault.balanceOf(user2.address);

      // User2 should have approximately 2x the balance of user1
      expect(user2Balance).to.be.closeTo(
        user1Balance * 2n,
        ethers.parseEther("0.1")
      );
    });
  });
});
