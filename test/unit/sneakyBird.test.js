const { ethers } = require('hardhat');

const { use, expect } = require('chai');
const { deployMockContract, MockProvider, solidity } = require('ethereum-waffle');
const { waffleChai } = require('@ethereum-waffle/chai');
const LinkToken = require('../../artifacts/@chainlink/token/contracts/v0.4/LinkToken.sol/LinkToken.json');
const VrfConsumerBase = require('../../artifacts/@chainlink/contracts/src/v0.8/VRFConsumerBase.sol/VRFConsumerBase.json');
const SneakyBird = require('../../artifacts/contracts/SneakyBird.sol/SneakyBird.json');

use(solidity);
use(waffleChai);

describe('SneakyBird', function () {
    it.only('should construct contract and initialize variables', async () => {
        const [wallet] = new MockProvider().getWallets();
        const LinkTokenMock = await deployMockContract(wallet, LinkToken.abi);
        const VrfCoordinatorMock = await deployMockContract(wallet, VrfConsumerBase.abi);

        await Promise.all([LinkTokenMock.deployed(), VrfCoordinatorMock.deployed()]);
        const contractFactory = new ethers.ContractFactory(
            SneakyBird.abi,
            SneakyBird.bytecode,
            wallet,
        );
        const contract = await contractFactory.deploy(
            VrfCoordinatorMock.address,
            LinkTokenMock.address,
            '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311',
        );

        expect(await contract.mintPrice()).to.equal(ethers.utils.parseEther('0.03'));
        expect(await contract.tokenCounter()).to.equal(0);
        expect(await contract.maxSupply()).to.equal(925);
        expect(await contract.maxPerWallet()).to.equal(3);
    });
});
