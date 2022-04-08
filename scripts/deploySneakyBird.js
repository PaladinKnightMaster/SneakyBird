const { network } = require("hardhat");
const hre = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");


async function main() {

  // We get the contract to deploy
  const SneakyBird = await hre.ethers.getContractFactory("SneakyBird");
  const sneakyBird = await SneakyBird.deploy(
    networkConfig[network.config.chainId]["vrfCoordinator"],
    networkConfig[network.config.chainId]["linkToken"],
    networkConfig[network.config.chainId]["keyHash"]
  );

  await sneakyBird.deployed();

  console.log("SneakyBird deployed to the", network.name, "network at:", sneakyBird.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 