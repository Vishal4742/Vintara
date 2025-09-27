const { run } = require("hardhat");

async function main() {
  console.log("🧪 Running Vintara test suite...");

  try {
    // Run all tests
    await run("test");
    console.log("✅ All tests passed!");
  } catch (error) {
    console.error("❌ Tests failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test runner failed:", error);
    process.exit(1);
  });
