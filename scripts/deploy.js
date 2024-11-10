const hre = require("hardhat");

async function main() {
  // Get the contract factory for SportsBetting
  const SportsBetting = await hre.ethers.getContractFactory("SportsBetting");
  
  // Deploy the contract
  const sportsBetting = await SportsBetting.deploy();
  
  // Wait for the contract to be deployed
  await sportsBetting.deployed();

  // Log the contract address
  console.log("SportsBetting contract deployed to:", sportsBetting.address);
}

// Run the main deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
