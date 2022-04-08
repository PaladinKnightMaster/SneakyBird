const hre = require('hardhat');
const { networkConfig } = require('../helper-hardhat-config');

async function main() {
    // We get the contract to deploy
    const SneakyBird = await hre.ethers.getContractFactory('SneakyBird');
    const sneakyBird = await SneakyBird.deploy(
        networkConfig[hre.network.config.chainId]['vrfCoordinator'],
        networkConfig[hre.network.config.chainId]['linkToken'],
        networkConfig[hre.network.config.chainId]['keyHash'],
    );

    await sneakyBird.deployed();

    console.log('SneakyBird deployed to the', hre.network.name, 'network at:', sneakyBird.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
