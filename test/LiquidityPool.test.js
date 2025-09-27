const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityPool", function () {
  let liquidityPool;
  let tokenA;
  let tokenB;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy MockTokens
    const MockToken = await ethers.getContractFactory("MockToken");
    tokenA = await MockToken.deploy(
      "Token A",
      "TKA",
      ethers.parseEther("1000000")
    );
    tokenB = await MockToken.deploy(
      "Token B",
      "TKB",
      ethers.parseEther("1000000")
    );

    await tokenA.waitForDeployment();
    await tokenB.waitForDeployment();

    // Deploy LiquidityPool
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(
      await tokenA.getAddress(),
      await tokenB.getAddress(),
      ethers.parseEther("0.003") // 0.3% fee
    );
    await liquidityPool.waitForDeployment();

    // Transfer tokens to users
    await tokenA.transfer(user1.address, ethers.parseEther("1000"));
    await tokenB.transfer(user1.address, ethers.parseEther("1000"));
    await tokenA.transfer(user2.address, ethers.parseEther("1000"));
    await tokenB.transfer(user2.address, ethers.parseEther("1000"));

    // Approve liquidity pool
    await tokenA
      .connect(user1)
      .approve(await liquidityPool.getAddress(), ethers.parseEther("1000"));
    await tokenB
      .connect(user1)
      .approve(await liquidityPool.getAddress(), ethers.parseEther("1000"));
    await tokenA
      .connect(user2)
      .approve(await liquidityPool.getAddress(), ethers.parseEther("1000"));
    await tokenB
      .connect(user2)
      .approve(await liquidityPool.getAddress(), ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token addresses", async function () {
      expect(await liquidityPool.tokenA()).to.equal(await tokenA.getAddress());
      expect(await liquidityPool.tokenB()).to.equal(await tokenB.getAddress());
    });

    it("Should set the correct fee rate", async function () {
      expect(await liquidityPool.feeRate()).to.equal(
        ethers.parseEther("0.003")
      );
    });

    it("Should set the correct owner", async function () {
      expect(await liquidityPool.owner()).to.equal(owner.address);
    });
  });

  describe("Liquidity Provision", function () {
    it("Should allow users to add liquidity", async function () {
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");

      await expect(liquidityPool.connect(user1).addLiquidity(amountA, amountB))
        .to.emit(liquidityPool, "LiquidityAdded")
        .withArgs(user1.address, amountA, amountB);

      const lpBalance = await liquidityPool.balanceOf(user1.address);
      expect(lpBalance).to.be.gt(0);
    });

    it("Should not allow zero liquidity additions", async function () {
      await expect(
        liquidityPool.connect(user1).addLiquidity(0, ethers.parseEther("100"))
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should maintain proper ratio for subsequent liquidity additions", async function () {
      // First liquidity addition
      await liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("100"), ethers.parseEther("200"));

      // Second liquidity addition should maintain 1:2 ratio
      await expect(
        liquidityPool
          .connect(user2)
          .addLiquidity(ethers.parseEther("50"), ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
  });

  describe("Token Swaps", function () {
    beforeEach(async function () {
      // Add initial liquidity
      await liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("100"), ethers.parseEther("200"));
    });

    it("Should allow token swaps", async function () {
      const swapAmount = ethers.parseEther("10");
      const minAmountOut = ethers.parseEther("15");

      await expect(
        liquidityPool
          .connect(user2)
          .swap(await tokenA.getAddress(), swapAmount, minAmountOut)
      )
        .to.emit(liquidityPool, "Swap")
        .withArgs(
          user2.address,
          await tokenA.getAddress(),
          swapAmount,
          await tokenB.getAddress()
        );
    });

    it("Should not allow swaps below minimum amount", async function () {
      const swapAmount = ethers.parseEther("10");
      const minAmountOut = ethers.parseEther("50"); // Unrealistically high

      await expect(
        liquidityPool
          .connect(user2)
          .swap(await tokenA.getAddress(), swapAmount, minAmountOut)
      ).to.be.revertedWith("Insufficient output amount");
    });

    it("Should apply correct fee to swaps", async function () {
      const swapAmount = ethers.parseEther("10");
      const minAmountOut = ethers.parseEther("15");

      const balanceBefore = await tokenB.balanceOf(user2.address);

      await liquidityPool
        .connect(user2)
        .swap(await tokenA.getAddress(), swapAmount, minAmountOut);

      const balanceAfter = await tokenB.balanceOf(user2.address);
      const received = balanceAfter - balanceBefore;

      // The received amount should be less than the theoretical amount due to fees
      expect(received).to.be.lt(ethers.parseEther("20")); // 20 would be 1:2 ratio without fees
    });
  });

  describe("Liquidity Removal", function () {
    beforeEach(async function () {
      // Add liquidity first
      await liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("100"), ethers.parseEther("200"));
    });

    it("Should allow users to remove liquidity", async function () {
      const lpBalance = await liquidityPool.balanceOf(user1.address);
      const removeAmount = lpBalance / 2n; // Remove half

      await expect(liquidityPool.connect(user1).removeLiquidity(removeAmount))
        .to.emit(liquidityPool, "LiquidityRemoved")
        .withArgs(user1.address, removeAmount);

      const newLpBalance = await liquidityPool.balanceOf(user1.address);
      expect(newLpBalance).to.equal(lpBalance - removeAmount);
    });

    it("Should not allow removing more liquidity than owned", async function () {
      const lpBalance = await liquidityPool.balanceOf(user1.address);

      await expect(
        liquidityPool.connect(user1).removeLiquidity(lpBalance + 1n)
      ).to.be.revertedWith("Insufficient LP balance");
    });
  });

  describe("Price Calculation", function () {
    beforeEach(async function () {
      // Add initial liquidity
      await liquidityPool
        .connect(user1)
        .addLiquidity(ethers.parseEther("100"), ethers.parseEther("200"));
    });

    it("Should calculate correct output amount for swaps", async function () {
      const inputAmount = ethers.parseEther("10");
      const outputAmount = await liquidityPool.getAmountOut(
        await tokenA.getAddress(),
        inputAmount
      );

      // With 1:2 ratio, 10 tokenA should give approximately 20 tokenB (minus fees)
      expect(outputAmount).to.be.closeTo(
        ethers.parseEther("20"),
        ethers.parseEther("1")
      );
    });

    it("Should maintain price impact within reasonable bounds", async function () {
      const smallSwap = ethers.parseEther("1");
      const largeSwap = ethers.parseEther("50");

      const smallOutput = await liquidityPool.getAmountOut(
        await tokenA.getAddress(),
        smallSwap
      );
      const largeOutput = await liquidityPool.getAmountOut(
        await tokenA.getAddress(),
        largeSwap
      );

      // Large swap should have more price impact (lower ratio)
      const smallRatio = (smallOutput * 1000n) / smallSwap;
      const largeRatio = (largeOutput * 1000n) / largeSwap;

      expect(largeRatio).to.be.lt(smallRatio);
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to update fee rate", async function () {
      const newFeeRate = ethers.parseEther("0.005"); // 0.5%

      await expect(liquidityPool.setFeeRate(newFeeRate))
        .to.emit(liquidityPool, "FeeRateUpdated")
        .withArgs(newFeeRate);

      expect(await liquidityPool.feeRate()).to.equal(newFeeRate);
    });

    it("Should not allow non-owner to update fee rate", async function () {
      await expect(
        liquidityPool.connect(user1).setFeeRate(ethers.parseEther("0.005"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow fee rate above 10%", async function () {
      await expect(
        liquidityPool.setFeeRate(ethers.parseEther("0.11"))
      ).to.be.revertedWith("Fee rate cannot exceed 10%");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause the contract", async function () {
      await liquidityPool.pause();
      expect(await liquidityPool.paused()).to.be.true;
    });

    it("Should not allow operations when paused", async function () {
      await liquidityPool.pause();

      await expect(
        liquidityPool
          .connect(user1)
          .addLiquidity(ethers.parseEther("100"), ethers.parseEther("200"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow owner to unpause the contract", async function () {
      await liquidityPool.pause();
      await liquidityPool.unpause();
      expect(await liquidityPool.paused()).to.be.false;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very small amounts correctly", async function () {
      const smallAmount = ethers.parseEther("0.001");

      await expect(
        liquidityPool.connect(user1).addLiquidity(smallAmount, smallAmount * 2n)
      ).to.not.be.reverted;
    });

    it("Should handle maximum precision in calculations", async function () {
      // Add liquidity with precise amounts
      await liquidityPool
        .connect(user1)
        .addLiquidity(
          ethers.parseEther("100.123456789"),
          ethers.parseEther("200.987654321")
        );

      // Swap should still work
      await expect(
        liquidityPool
          .connect(user2)
          .swap(
            await tokenA.getAddress(),
            ethers.parseEther("1"),
            ethers.parseEther("1.5")
          )
      ).to.not.be.reverted;
    });
  });
});
