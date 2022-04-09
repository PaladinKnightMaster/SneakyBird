import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

export const providerOptions = {
    walletlink: {
        package: CoinbaseWalletSDK, // Required
        options: {
            appName: 'Web 3 Modal Demo', // Required
            infuraId: 'c1bc8f3b771c4cbeb01bd597a820a3fb', // Required unless you provide a JSON RPC url; see `rpc` below
        },
    },
    walletconnect: {
        package: WalletConnect, // required
        options: {
            infuraId: 'c1bc8f3b771c4cbeb01bd597a820a3fb', // required
        },
    },
};

const Page = () => {
    const [test, setTest] = useState();

    const connectWallet = async () => {
        try {
            const web3Modal = new Web3Modal({
                network: 'rinkeby', // optional
                providerOptions,
            });
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();

            setTest({ accounts, network, chainId: network.chainId });
        } catch (error) {
            console.log(error);
        }
    };

    if (!test?.accounts) {
        return (
            <div className="flex justify-center items-center h-full">
                <div>
                    <button
                        className="block h-auto rounded px-5 py-3 bg-blue-500 text-white shadow-lg"
                        type="button"
                        onClick={connectWallet}
                    >
                        connect wallet
                    </button>
                </div>
            </div>
        );
    }

    return <pre>{JSON.stringify(test, null, 2)}</pre>;
};

export default Page;
