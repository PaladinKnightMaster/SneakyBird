export default {
    ethereum: {
        network: process.env.ETHEREUM_NETWORK,
        rpcUrl: process.env.RPC_URL,
        rpcUrlRinkeby: process.env.RPC_URL_RINKEBY,
        etherscanKey: process.env.NEXTJS_APP_ETHERSCAN_KEY,
        privateKey: process.env.NEXTJS_APP_PRIVATE_KEY,
    },
    ipfs: {
        secret: process.env.IPFS_PROJECT_SECRET,
        projectId: process.env.IPFS_PROJECT_ID,
    },
};
