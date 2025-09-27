const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ENSResolver", function () {
  let ensResolver;
  let owner;
  let resolver;
  let manager;
  let addr1;
  let mockENSRegistry;

  beforeEach(async function () {
    [owner, resolver, manager, addr1] = await ethers.getSigners();

    // Deploy mock ENS registry
    const MockENSRegistry = await ethers.getContractFactory("MockENSRegistry");
    mockENSRegistry = await MockENSRegistry.deploy();
    await mockENSRegistry.deployed();

    const ENSResolver = await ethers.getContractFactory("ENSResolver");
    ensResolver = await ENSResolver.deploy(mockENSRegistry.address);
    await ensResolver.deployed();

    // Grant roles
    await ensResolver.grantRole(
      await ensResolver.RESOLVER_ROLE(),
      resolver.address
    );
    await ensResolver.grantRole(
      await ensResolver.MANAGER_ROLE(),
      manager.address
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(
        await ensResolver.hasRole(
          await ensResolver.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.be.true;
    });

    it("Should set the ENS registry", async function () {
      expect(await ensResolver.ensRegistry()).to.equal(mockENSRegistry.address);
    });
  });

  describe("ENS Name Registration", function () {
    it("Should allow resolver to register ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await ensResolver.connect(resolver).registerENSName(nameHash, name, addr);

      expect(await ensResolver.nameToAddress(nameHash)).to.equal(addr);
      expect(await ensResolver.addressToName(addr)).to.equal(nameHash);
      expect(await ensResolver.supportedNames(nameHash)).to.be.true;
    });

    it("Should not allow non-resolver to register ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await expect(
        ensResolver.connect(addr1).registerENSName(nameHash, name, addr)
      ).to.be.revertedWith("AccessControl: account");
    });

    it("Should not allow registering with zero address", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = ethers.constants.AddressZero;

      await expect(
        ensResolver.connect(resolver).registerENSName(nameHash, name, addr)
      ).to.be.revertedWith("InvalidAddress");
    });

    it("Should not allow duplicate registrations", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await ensResolver.connect(resolver).registerENSName(nameHash, name, addr);

      await expect(
        ensResolver.connect(resolver).registerENSName(nameHash, name, addr)
      ).to.be.revertedWith("AddressAlreadyRegistered");
    });
  });

  describe("ENS Name Updates", function () {
    beforeEach(async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await ensResolver.connect(resolver).registerENSName(nameHash, name, addr);
    });

    it("Should allow resolver to update ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const newAddr = manager.address;

      await ensResolver
        .connect(resolver)
        .updateENSName(nameHash, name, newAddr);

      expect(await ensResolver.nameToAddress(nameHash)).to.equal(newAddr);
      expect(await ensResolver.addressToName(newAddr)).to.equal(nameHash);
      expect(await ensResolver.addressToName(addr1.address)).to.equal(
        ethers.constants.HashZero
      );
    });

    it("Should not allow updating non-existent ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("nonexistent.vintara.eth")
      );
      const name = "nonexistent.vintara.eth";
      const newAddr = manager.address;

      await expect(
        ensResolver.connect(resolver).updateENSName(nameHash, name, newAddr)
      ).to.be.revertedWith("ENSNameNotFound");
    });
  });

  describe("ENS Name Resolution", function () {
    beforeEach(async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await ensResolver.connect(resolver).registerENSName(nameHash, name, addr);
    });

    it("Should resolve ENS names to addresses", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const resolvedAddr = await ensResolver.resolveENSName(nameHash);
      expect(resolvedAddr).to.equal(addr1.address);
    });

    it("Should resolve ENS name strings to addresses", async function () {
      const name = "alice.vintara.eth";
      const resolvedAddr = await ensResolver.resolveENSNameString(name);
      expect(resolvedAddr).to.equal(addr1.address);
    });

    it("Should return ENS names for addresses", async function () {
      const nameHash = await ensResolver.getENSNameForAddress(addr1.address);
      expect(nameHash).to.equal(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("alice.vintara.eth"))
      );
    });

    it("Should check ENS support", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      expect(await ensResolver.isENSSupported(nameHash)).to.be.true;

      const unsupportedHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("unsupported.eth")
      );
      expect(await ensResolver.isENSSupported(unsupportedHash)).to.be.false;
    });

    it("Should check if address has ENS name", async function () {
      expect(await ensResolver.hasENSName(addr1.address)).to.be.true;
      expect(await ensResolver.hasENSName(manager.address)).to.be.false;
    });
  });

  describe("Batch Operations", function () {
    beforeEach(async function () {
      // Register multiple ENS names
      const names = ["alice.vintara.eth", "bob.vintara.eth"];
      const addresses = [addr1.address, manager.address];

      for (let i = 0; i < names.length; i++) {
        const nameHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(names[i])
        );
        await ensResolver
          .connect(resolver)
          .registerENSName(nameHash, names[i], addresses[i]);
      }
    });

    it("Should batch resolve ENS names", async function () {
      const nameHashes = [
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("alice.vintara.eth")),
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("bob.vintara.eth")),
      ];

      const addresses = await ensResolver.batchResolveENSNames(nameHashes);
      expect(addresses[0]).to.equal(addr1.address);
      expect(addresses[1]).to.equal(manager.address);
    });
  });

  describe("Name or Address Resolution", function () {
    it("Should resolve valid addresses", async function () {
      const addr = addr1.address;
      const resolvedAddr = await ensResolver.resolveNameOrAddress(addr);
      expect(resolvedAddr).to.equal(addr);
    });

    it("Should resolve ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await ensResolver.connect(resolver).registerENSName(nameHash, name, addr);

      const resolvedAddr = await ensResolver.resolveNameOrAddress(name);
      expect(resolvedAddr).to.equal(addr);
    });
  });

  describe("Management Functions", function () {
    it("Should allow manager to add authorized addresses", async function () {
      await ensResolver.connect(manager).addAuthorizedAddress(addr1.address);
      expect(await ensResolver.authorizedAddresses(addr1.address)).to.be.true;
    });

    it("Should allow manager to remove authorized addresses", async function () {
      await ensResolver.connect(manager).addAuthorizedAddress(addr1.address);
      await ensResolver.connect(manager).removeAuthorizedAddress(addr1.address);
      expect(await ensResolver.authorizedAddresses(addr1.address)).to.be.false;
    });

    it("Should allow manager to update ENS registry", async function () {
      const newRegistry = manager.address;
      await ensResolver.connect(manager).updateENSRegistry(newRegistry);
      expect(await ensResolver.ensRegistry()).to.equal(newRegistry);
    });

    it("Should not allow non-manager to manage addresses", async function () {
      await expect(
        ensResolver.connect(addr1).addAuthorizedAddress(addr1.address)
      ).to.be.revertedWith("AccessControl: account");
    });
  });

  describe("ENS Name Removal", function () {
    beforeEach(async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await ensResolver.connect(resolver).registerENSName(nameHash, name, addr);
    });

    it("Should allow resolver to remove ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";

      await ensResolver.connect(resolver).removeENSName(nameHash, name);

      expect(await ensResolver.nameToAddress(nameHash)).to.equal(
        ethers.constants.AddressZero
      );
      expect(await ensResolver.addressToName(addr1.address)).to.equal(
        ethers.constants.HashZero
      );
      expect(await ensResolver.supportedNames(nameHash)).to.be.false;
    });

    it("Should not allow removing non-existent ENS names", async function () {
      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("nonexistent.vintara.eth")
      );
      const name = "nonexistent.vintara.eth";

      await expect(
        ensResolver.connect(resolver).removeENSName(nameHash, name)
      ).to.be.revertedWith("ENSNameNotFound");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow admin to pause", async function () {
      await ensResolver.pause();
      expect(await ensResolver.paused()).to.be.true;
    });

    it("Should not allow operations when paused", async function () {
      await ensResolver.pause();

      const nameHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("alice.vintara.eth")
      );
      const name = "alice.vintara.eth";
      const addr = addr1.address;

      await expect(
        ensResolver.connect(resolver).registerENSName(nameHash, name, addr)
      ).to.be.revertedWith("Pausable: paused");
    });
  });
});

// Mock ENS Registry for testing
contract("MockENSRegistry", function () {
  // This would be a simple mock contract for testing
  // In a real implementation, you'd use the actual ENS registry
});
