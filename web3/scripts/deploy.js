// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Check if we're on localhost/hardhat network
  const network = await hre.ethers.provider.getNetwork();
  if (
    network.chainId === 1337 ||
    network.chainId === 84532 ||
    network.chainId === 11155111
  ) {
    // Local network
    console.log("\nDeploying Mock Tokens for Local Testing:");
    console.log("------------------------");

    // Deploy mock USDT
    const MockStableCoins = await hre.ethers.getContractFactory("StableCoins");
    const mockUSDT = await MockStableCoins.deploy("USDT", "USDT", 6);
    await mockUSDT.deployed();
    console.log("Mock USDT deployed to:", mockUSDT.address);

    // Deploy mock USDC
    console.log("Deploy mock USDC");
    const mockUSDC = await MockStableCoins.deploy("USDC", "USDC", 6);
    await mockUSDC.deployed();
    console.log("Mock USDC deployed to:", mockUSDC.address);

    // Deploy mock TBC
    const MockERC20 = await hre.ethers.getContractFactory("FUTURESYNCX");
    console.log("Deploy mock FSX");
    const mockFSX = await MockERC20.deploy();
    await mockFSX.deployed();
    console.log("Mock FSX deployed to:", mockFSX.address);

    const usdtAddress = mockUSDT.address;
    const usdcAddress = mockUSDC.address;
    const fsxAddress = mockFSX.address;

    // Mint some tokens to deployer
    const mintAmount = hre.ethers.utils.parseUnits("1000000000", 6); // 1B tokens
    await mockUSDT.mint(deployer.address, mintAmount);
    await mockUSDC.mint(deployer.address, mintAmount);

    // Deploy TokenICO Contract
    console.log("\nDeploying TokenICO contract...");
    const TokenICO = await hre.ethers.getContractFactory("TokenICO");
    const tokenICO = await TokenICO.deploy();

    await tokenICO.deployed();

    console.log("\nDeployment Successful!");
    console.log("------------------------");
    console.log("NEXT_PUBLIC_TOKEN_ICO_ADDRESS:", tokenICO.address);
    console.log("NEXT_PUBLIC_OWNER_ADDRESS:", deployer.address);
    console.log("NEXT_PUBLIC_USDT_ADDRESS:", usdtAddress);
    console.log("NEXT_PUBLIC_USDC_ADDRESS:", usdcAddress);
    console.log("NEXT_PUBLIC_FSX_ADDRESS:", fsxAddress);

    if (network.chainId === 84532) {
      if (!tokenICO.address) {
        console.error(
          "Please set the NEXT_PUBLIC_TOKEN_ICO_ADDRESS environment variable"
        );
        process.exit(1);
      }

      console.log("Verifying TokenICO contract at address:", tokenICO.address);

      try {
        await hre.run("verify:verify", {
          address: tokenICO.address,
          constructorArguments: [],
        });

        console.log("Contract verification successful!");
      } catch (error) {
        if (error.message.includes("Already Verified")) {
          console.log("Contract is already verified!");
        } else {
          console.error("Verification failed:", error);
          process.exit(1);
        }
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
