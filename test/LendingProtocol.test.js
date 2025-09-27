const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingProtocol", function () {
  let lendingProtocol;
  let collateralToken;
  let borrowToken;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy MockTokens
    const MockToken = await ethers.getContractFactory("MockToken");
    collateralToken = await MockToken.deploy(
      "Collateral Token",
      "CTK",
      ethers.parseEther("1000000")
    );
    borrowToken = await MockToken.deploy(
      "Borrow Token",
      "BTK",
      ethers.parseEther("1000000")
    );

    await collateralToken.waitForDeployment();
    await borrowToken.waitForDeployment();

    // Deploy LendingProtocol
    const LendingProtocol = await ethers.getContractFactory("LendingProtocol");
    lendingProtocol = await LendingProtocol.deploy();
    await lendingProtocol.waitForDeployment();

    // Add supported tokens
    await lendingProtocol.addSupportedToken(
      await collateralToken.getAddress(),
      ethers.parseEther("0.8"), // 80% collateral factor
      ethers.parseEther("0.1") // 10% interest rate
    );

    await lendingProtocol.addSupportedToken(
      await borrowToken.getAddress(),
      ethers.parseEther("0.8"), // 80% collateral factor
      ethers.parseEther("0.1") // 10% interest rate
    );

    // Transfer tokens to users
    await collateralToken.transfer(user1.address, ethers.parseEther("1000"));
    await borrowToken.transfer(user1.address, ethers.parseEther("1000"));

    // Approve lending protocol
    await collateralToken
      .connect(user1)
      .approve(await lendingProtocol.getAddress(), ethers.parseEther("1000"));
    await borrowToken
      .connect(user1)
      .approve(await lendingProtocol.getAddress(), ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await lendingProtocol.owner()).to.equal(owner.address);
    });
  });

  describe("Token Management", function () {
    it("Should allow owner to add supported tokens", async function () {
      const MockToken = await ethers.getContractFactory("MockToken");
      const newToken = await MockToken.deploy(
        "New Token",
        "NTK",
        ethers.parseEther("1000000")
      );
      await newToken.waitForDeployment();

      await expect(
        lendingProtocol.addSupportedToken(
          await newToken.getAddress(),
          ethers.parseEther("0.7"),
          ethers.parseEther("0.05")
        )
      )
        .to.emit(lendingProtocol, "TokenAdded")
        .withArgs(
          await newToken.getAddress(),
          ethers.parseEther("0.7"),
          ethers.parseEther("0.05")
        );
    });

    it("Should not allow non-owner to add tokens", async function () {
      await expect(
        lendingProtocol
          .connect(user1)
          .addSupportedToken(
            await collateralToken.getAddress(),
            ethers.parseEther("0.7"),
            ethers.parseEther("0.05")
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Collateral Management", function () {
    it("Should allow users to deposit collateral", async function () {
      const depositAmount = ethers.parseEther("100");

      await expect(
        lendingProtocol
          .connect(user1)
          .depositCollateral(await collateralToken.getAddress(), depositAmount)
      )
        .to.emit(lendingProtocol, "CollateralDeposited")
        .withArgs(
          user1.address,
          await collateralToken.getAddress(),
          depositAmount
        );

      const collateralBalance = await lendingProtocol.getCollateralBalance(
        user1.address,
        await collateralToken.getAddress()
      );
      expect(collateralBalance).to.equal(depositAmount);
    });

    it("Should not allow zero collateral deposits", async function () {
      await expect(
        lendingProtocol
          .connect(user1)
          .depositCollateral(await collateralToken.getAddress(), 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Borrowing", function () {
    beforeEach(async function () {
      // User deposits collateral
      await lendingProtocol
        .connect(user1)
        .depositCollateral(
          await collateralToken.getAddress(),
          ethers.parseEther("100")
        );
    });

    it("Should allow users to borrow against collateral", async function () {
      const borrowAmount = ethers.parseEther("50");

      await expect(
        lendingProtocol
          .connect(user1)
          .borrow(await borrowToken.getAddress(), borrowAmount)
      )
        .to.emit(lendingProtocol, "Borrowed")
        .withArgs(user1.address, await borrowToken.getAddress(), borrowAmount);

      const borrowBalance = await lendingProtocol.getBorrowBalance(
        user1.address,
        await borrowToken.getAddress()
      );
      expect(borrowBalance).to.equal(borrowAmount);
    });

    it("Should not allow borrowing more than collateral allows", async function () {
      // Try to borrow more than 80% of collateral value
      const excessiveBorrow = ethers.parseEther("90");

      await expect(
        lendingProtocol
          .connect(user1)
          .borrow(await borrowToken.getAddress(), excessiveBorrow)
      ).to.be.revertedWith("Insufficient collateral");
    });
  });

  describe("Repayment", function () {
    beforeEach(async function () {
      // Setup: deposit collateral and borrow
      await lendingProtocol
        .connect(user1)
        .depositCollateral(
          await collateralToken.getAddress(),
          ethers.parseEther("100")
        );
      await lendingProtocol
        .connect(user1)
        .borrow(await borrowToken.getAddress(), ethers.parseEther("50"));
    });

    it("Should allow users to repay borrowed tokens", async function () {
      const repayAmount = ethers.parseEther("25");

      await expect(
        lendingProtocol
          .connect(user1)
          .repay(await borrowToken.getAddress(), repayAmount)
      )
        .to.emit(lendingProtocol, "Repaid")
        .withArgs(user1.address, await borrowToken.getAddress(), repayAmount);

      const borrowBalance = await lendingProtocol.getBorrowBalance(
        user1.address,
        await borrowToken.getAddress()
      );
      expect(borrowBalance).to.equal(ethers.parseEther("25"));
    });
  });

  describe("Liquidation", function () {
    beforeEach(async function () {
      // Setup: deposit collateral and borrow
      await lendingProtocol
        .connect(user1)
        .depositCollateral(
          await collateralToken.getAddress(),
          ethers.parseEther("100")
        );
      await lendingProtocol.connect(user1).borrow(
        await borrowToken.getAddress(),
        ethers.parseEther("80") // Close to liquidation threshold
      );
    });

    it("Should allow liquidation when health factor is too low", async function () {
      // Simulate price drop by reducing collateral factor
      await lendingProtocol.setCollateralFactor(
        await collateralToken.getAddress(),
        ethers.parseEther("0.5") // Reduce to 50%
      );

      const healthFactor = await lendingProtocol.getHealthFactor(user1.address);
      expect(healthFactor).to.be.lt(ethers.parseEther("1.2")); // Below liquidation threshold

      // Liquidator can now liquidate
      await expect(
        lendingProtocol
          .connect(user2)
          .liquidate(
            user1.address,
            await collateralToken.getAddress(),
            await borrowToken.getAddress(),
            ethers.parseEther("20")
          )
      ).to.emit(lendingProtocol, "Liquidated");
    });
  });

  describe("Interest Rate Calculation", function () {
    it("Should calculate interest correctly over time", async function () {
      // This would require time manipulation in a real test
      // For now, we'll test the interest rate calculation function
      const principal = ethers.parseEther("100");
      const rate = ethers.parseEther("0.1"); // 10% annual
      const time = 365 * 24 * 60 * 60; // 1 year in seconds

      // This is a simplified test - actual implementation would be more complex
      expect(
        await lendingProtocol.calculateInterest(principal, rate, time)
      ).to.be.gt(principal);
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to modify protocol parameters", async function () {
      await expect(
        lendingProtocol
          .connect(user1)
          .setCollateralFactor(
            await collateralToken.getAddress(),
            ethers.parseEther("0.9")
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple borrows and repays correctly", async function () {
      // Multiple borrows
      await lendingProtocol
        .connect(user1)
        .borrow(await borrowToken.getAddress(), ethers.parseEther("30"));
      await lendingProtocol
        .connect(user1)
        .borrow(await borrowToken.getAddress(), ethers.parseEther("20"));

      const totalBorrowed = await lendingProtocol.getBorrowBalance(
        user1.address,
        await borrowToken.getAddress()
      );
      expect(totalBorrowed).to.equal(ethers.parseEther("50"));

      // Partial repayment
      await lendingProtocol
        .connect(user1)
        .repay(await borrowToken.getAddress(), ethers.parseEther("20"));

      const remainingBorrow = await lendingProtocol.getBorrowBalance(
        user1.address,
        await borrowToken.getAddress()
      );
      expect(remainingBorrow).to.equal(ethers.parseEther("30"));
    });
  });
});
