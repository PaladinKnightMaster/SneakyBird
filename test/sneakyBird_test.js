const { expect } = require('chai');
const { ethers, network } = require('hardhat');
const { networkConfig, getNetworkIdFromName } = require('../helper-hardhat-config');

describe('SneakyBird', function () {


    it('Should Deploy the SneakyBird Contract and fund it with LINK token', async function () {
        const { get } = deployments;
        const chainId = await getChainId();
        const accounts = await hre.ethers.getSigners();
        const [signer] = accounts;
        const keyHash = networkConfig[chainId].keyHash;
        let linkTokenAddress;
        let vrfCoordinatorAddress;
        if (chainId == 31337) {
            const linkToken = await get('LinkToken');
            const VRFCoordinatorMock = await get('VRFCoordinatorMock');
            linkTokenAddress = linkToken.address;
            vrfCoordinatorAddress = VRFCoordinatorMock.address;
        } else {
            linkTokenAddress = networkConfig[chainId].linkToken;
            vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
        }
        // Deployment of SneakyBird Contract
        const SneakyBird = await ethers.getContractFactory('SneakyBird');
        sneakybird = await SneakyBird.deploy(vrfCoordinatorAddress, linkTokenAddress, keyHash);
        await sneakybird.deployed(console.log('   Contract deployed to the', network.name, 'network at:', sneakybird.address,));
        // fund the SneakyBird Contract with LINK
        const fundAmount = String(0.1 * 10 ** 18);
        const linkTokenContract = await ethers.getContractFactory('LinkToken');
        const linkToken = new ethers.Contract(linkTokenAddress, linkTokenContract.interface, signer);
        let fund_tx = await linkToken.transfer(sneakybird.address, fundAmount);
        await fund_tx.wait(1);
    })
})
