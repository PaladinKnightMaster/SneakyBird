const { expect } = require("chai");
const { ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");




describe("SneakyBird", function () {
  it("Should Deploy the SneakyBird Contract and pass the VRFCoordinator args to the constructor", async function () {
    const SneakyBird = await ethers.getContractFactory("SneakyBird");
    const sneakybird = await SneakyBird.deploy(
      networkConfig[network.config.chainId]["vrfCoordinator"],
      networkConfig[network.config.chainId]["linkToken"],
      networkConfig[network.config.chainId]["keyHash"]
    );
    await sneakybird.deployed(
      console.log("   Contract deployed to the", network.name, "network at:", sneakybird.address)
    );

    // Still worling on the contract... need to finish these tests:
    // 1. Funding Link to the deployed Contract
    // 2. Call CreateNFT function to try to mint an NFT.


  });
});
