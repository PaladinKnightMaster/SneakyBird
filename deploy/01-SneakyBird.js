const { networkConfig } = require('../helper-hardhat-config');
const hre = require('hardhat');
const contractName = 'SneakyBird';
module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log, get } = deployments;

    const { deployer } = await getNamedAccounts();

    const chainId = await getChainId();

    let linkTokenAddress;
    let vrfCoordinatorAddress;
    const mockableChainIds = ['31337', '1337'];

    if (mockableChainIds.includes(chainId)) {
        const linkToken = await get('LinkToken');
        const VRFCoordinatorMock = await get('VRFCoordinatorMock');
        linkTokenAddress = linkToken.address;
        vrfCoordinatorAddress = VRFCoordinatorMock.address;
    } else {
        linkTokenAddress = networkConfig[chainId].linkToken;
        vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
    }
    const keyHash = networkConfig[chainId].keyHash;
    log('----------------------------------------------------');
    const SneakyBird = await deploy(contractName, {
        from: deployer,
        log: true,
        args: [vrfCoordinatorAddress, linkTokenAddress, keyHash],
    });

    log(`You have deployed an NFT contract to ${SneakyBird.address}`);
    log(
        `Verify with:\n npx hardhat verify --network ${networkConfig[chainId].name} ${
            SneakyBird.address
        } ${[vrfCoordinatorAddress, linkTokenAddress, keyHash].toString().replace(/,/g, ' ')}`,
    );

    const accounts = await hre.ethers.getSigners();
    const [signer] = accounts;

    // fund with LINK
    const fundAmount = String(0.1 * 10 ** 18);
    const linkTokenContract = await hre.ethers.getContractFactory('LinkToken');
    const linkToken = new hre.ethers.Contract(
        linkTokenAddress,
        linkTokenContract.interface,
        signer,
    );

    let fund_tx = await linkToken.transfer(SneakyBird.address, fundAmount);
    await fund_tx.wait(1);
};

module.exports.tags = ['all', 'sneakybird'];
