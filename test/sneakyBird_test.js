const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SneakyBird", function () {
  it("Should create an NFT", async function () {
    const SneakyBird = await ethers.getContractFactory("SneakyBird");
    const sneakybird = await SneakyBird.deploy();
    await sneakybird.deployed();

    // Still worling on the contract... need to finish these tests:
    // 1. Funding Link to the deployed Contract
    // 2. Call CreateNFT function to try to mint an NFT.


  });
});
