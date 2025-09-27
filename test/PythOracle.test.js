const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PythOracle", function () {
  let pythOracle;
  let owner;
  let updater;
  let manager;
  let addr1;

  // PyTH price feed IDs (these are the actual PyTH price feed IDs)
  const RBTC_PRICE_ID =
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
  const USDT_PRICE_ID =
    "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b";

  beforeEach(async function () {
    [owner, updater, manager, addr1] = await ethers.getSigners();

    const PythOracle = await ethers.getContractFactory("PythOracle");
    pythOracle = await PythOracle.deploy();
    await pythOracle.deployed();

    // Grant roles
    await pythOracle.grantRole(
      await pythOracle.UPDATER_ROLE(),
      updater.address
    );
    await pythOracle.grantRole(
      await pythOracle.MANAGER_ROLE(),
      manager.address
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(
        await pythOracle.hasRole(
          await pythOracle.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.be.true;
    });

    it("Should set the right price feed names", async function () {
      expect(await pythOracle.priceFeedNames(RBTC_PRICE_ID)).to.equal(
        "rBTC/USD"
      );
      expect(await pythOracle.priceFeedNames(USDT_PRICE_ID)).to.equal(
        "USDT/USD"
      );
    });
  });

  describe("Price Updates", function () {
    it("Should allow updater to update prices", async function () {
      const price = ethers.BigNumber.from("4500000000000"); // $45,000 in 8 decimals
      const conf = ethers.BigNumber.from("950000000"); // 95% confidence
      const expo = -8; // 8 decimal places
      const publishTime = Math.floor(Date.now() / 1000);

      await pythOracle
        .connect(updater)
        .updatePrice(RBTC_PRICE_ID, price, conf, expo, publishTime);

      const priceData = await pythOracle.getPriceData(RBTC_PRICE_ID);
      expect(priceData.price).to.equal(price);
      expect(priceData.conf).to.equal(conf);
      expect(priceData.isValid).to.be.true;
    });

    it("Should not allow non-updater to update prices", async function () {
      const price = ethers.BigNumber.from("4500000000000");
      const conf = ethers.BigNumber.from("950000000");
      const expo = -8;
      const publishTime = Math.floor(Date.now() / 1000);

      await expect(
        pythOracle
          .connect(addr1)
          .updatePrice(RBTC_PRICE_ID, price, conf, expo, publishTime)
      ).to.be.revertedWith("AccessControl: account");
    });

    it("Should reject invalid prices", async function () {
      const price = 0; // Invalid price
      const conf = ethers.BigNumber.from("950000000");
      const expo = -8;
      const publishTime = Math.floor(Date.now() / 1000);

      await expect(
        pythOracle
          .connect(updater)
          .updatePrice(RBTC_PRICE_ID, price, conf, expo, publishTime)
      ).to.be.revertedWith("InvalidPrice");
    });

    it("Should reject low confidence prices", async function () {
      const price = ethers.BigNumber.from("4500000000000");
      const conf = ethers.BigNumber.from("100000000"); // 10% confidence (too low)
      const expo = -8;
      const publishTime = Math.floor(Date.now() / 1000);

      await expect(
        pythOracle
          .connect(updater)
          .updatePrice(RBTC_PRICE_ID, price, conf, expo, publishTime)
      ).to.be.revertedWith("LowConfidence");
    });
  });

  describe("Price Retrieval", function () {
    beforeEach(async function () {
      // Set up test prices
      const rbtcPrice = ethers.BigNumber.from("4500000000000"); // $45,000
      const usdtPrice = ethers.BigNumber.from("100000000"); // $1.00
      const conf = ethers.BigNumber.from("950000000"); // 95%
      const expo = -8;
      const publishTime = Math.floor(Date.now() / 1000);

      await pythOracle
        .connect(updater)
        .updatePrice(RBTC_PRICE_ID, rbtcPrice, conf, expo, publishTime);

      await pythOracle
        .connect(updater)
        .updatePrice(USDT_PRICE_ID, usdtPrice, conf, expo, publishTime);
    });

    it("Should return correct rBTC price", async function () {
      const price = await pythOracle.getRBTCPrice();
      expect(price).to.equal(ethers.BigNumber.from("4500000000000"));
    });

    it("Should return correct USDT price", async function () {
      const price = await pythOracle.getUSDTPrice();
      expect(price).to.equal(ethers.BigNumber.from("100000000"));
    });

    it("Should calculate correct price ratio", async function () {
      const ratio = await pythOracle.getRBTCToUSDTRatio();
      expect(ratio).to.equal(ethers.BigNumber.from("45000000000000000000000")); // 45,000 * 10^18
    });

    it("Should return price validity", async function () {
      expect(await pythOracle.isPriceValid(RBTC_PRICE_ID)).to.be.true;
      expect(await pythOracle.isPriceValid(USDT_PRICE_ID)).to.be.true;
    });
  });

  describe("Batch Operations", function () {
    it("Should allow batch price updates", async function () {
      const priceIds = [RBTC_PRICE_ID, USDT_PRICE_ID];
      const prices = [
        ethers.BigNumber.from("4500000000000"), // $45,000
        ethers.BigNumber.from("100000000"), // $1.00
      ];
      const confs = [
        ethers.BigNumber.from("950000000"), // 95%
        ethers.BigNumber.from("980000000"), // 98%
      ];
      const expos = [-8, -8];
      const publishTimes = [
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
      ];

      await pythOracle
        .connect(updater)
        .batchUpdatePrices(priceIds, prices, confs, expos, publishTimes);

      expect(await pythOracle.getRBTCPrice()).to.equal(prices[0]);
      expect(await pythOracle.getUSDTPrice()).to.equal(prices[1]);
    });
  });

  describe("Management Functions", function () {
    it("Should allow manager to set price feed names", async function () {
      const newPriceId =
        "0x1234567890123456789012345678901234567890123456789012345678901234";
      const newName = "ETH/USD";

      await pythOracle.connect(manager).setPriceFeedName(newPriceId, newName);
      expect(await pythOracle.priceFeedNames(newPriceId)).to.equal(newName);
    });

    it("Should allow manager to update Hermes endpoint", async function () {
      const newEndpoint =
        "https://new-hermes.pyth.network/v2/updates/price/latest";
      await pythOracle.connect(manager).updateHermesEndpoint(newEndpoint);
      expect(await pythOracle.hermesEndpoint()).to.equal(newEndpoint);
    });

    it("Should not allow non-manager to set price feed names", async function () {
      const newPriceId =
        "0x1234567890123456789012345678901234567890123456789012345678901234";
      const newName = "ETH/USD";

      await expect(
        pythOracle.connect(addr1).setPriceFeedName(newPriceId, newName)
      ).to.be.revertedWith("AccessControl: account");
    });
  });

  describe("Price Age and Validation", function () {
    it("Should reject stale prices", async function () {
      const price = ethers.BigNumber.from("4500000000000");
      const conf = ethers.BigNumber.from("950000000");
      const expo = -8;
      const staleTime = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago (stale)

      await pythOracle
        .connect(updater)
        .updatePrice(RBTC_PRICE_ID, price, conf, expo, staleTime);

      // Fast forward time to make price stale
      await ethers.provider.send("evm_increaseTime", [400]);
      await ethers.provider.send("evm_mine", []);

      await expect(pythOracle.getPrice(RBTC_PRICE_ID)).to.be.revertedWith(
        "PriceTooOld"
      );
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow admin to pause", async function () {
      await pythOracle.pause();
      expect(await pythOracle.paused()).to.be.true;
    });

    it("Should not allow price updates when paused", async function () {
      await pythOracle.pause();

      const price = ethers.BigNumber.from("4500000000000");
      const conf = ethers.BigNumber.from("950000000");
      const expo = -8;
      const publishTime = Math.floor(Date.now() / 1000);

      await expect(
        pythOracle
          .connect(updater)
          .updatePrice(RBTC_PRICE_ID, price, conf, expo, publishTime)
      ).to.be.revertedWith("Pausable: paused");
    });
  });
});
