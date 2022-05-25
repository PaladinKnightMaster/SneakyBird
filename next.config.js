/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        RPC_URL_RINKEBY: process.env.RPC_URL_RINKEBY,
        RPC_URL: process.env.RPC_URL,
        ETHERSCAN_KEY: process.env.ETHERSCAN_KEY,
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        IPFS_PROJECT_SECRET: process.env.IPFS_PROJECT_SECRET,
        IPFS_PROJECT_ID: process.env.IPFS_PROJECT_ID,
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    },
};

module.exports = nextConfig;
