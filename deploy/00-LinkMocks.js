module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();
    const mockableChainIds = ['31337', '1337'];

    // If we are on a local development network, we need to deploy mocks!
    if (mockableChainIds.includes(chainId)) {
        log('Local network detected! Deploying mocks...');
        const linkToken = await deploy('LinkToken', { from: deployer, log: true });
        await deploy('VRFCoordinatorMock', {
            from: deployer,
            log: true,
            args: [linkToken.address],
        });
        log('Mocks Deployed!');
        log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        log(
            "You are deploying to a local network, you'll need a local network running to interact",
        );
        log('Please run `npx hardhat console` to interact with the deployed smart contracts!');
        log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }
};
module.exports.tags = ['all', 'mocks'];
