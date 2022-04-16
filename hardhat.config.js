require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');
require('dotenv-safe').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [
            {
                version: '0.8.3',
            },
            {
                version: '0.7.0',
            },
            {
                version: '0.6.6',
            },
            {
                version: '0.4.24',
            },
        ],
    },
    networks: {
        rinkeby: {
            url: process.env.NEXTJS_APP_RINKEBY_RPC_URL,
            accounts: [process.env.NEXTJS_APP_PRIVATE_KEY],
            chainId: 4,
        },
        local: {
            url: 'http://127.0.0.1:7545',
            accounts: [
                'd6521de1e0347649436dcaff3cfbeb1037116e79fa179cbbc46decba0bfa0d05',
                '2e6730003b9857a0686b5d35b0a67658c2de6be68c6167771d6dae2643cc7905',
            ],
        },
    },
    etherscan: {
        apiKey: process.env.NEXTJS_APP_ETHERSCAN_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
};
