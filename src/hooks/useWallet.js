import { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

function useWallet() {
    const [library, setLibrary] = useState();

    const connect = async () => {
        const web3Modal = new Web3Modal({
            network: 'local', // optional
            // network: 'rinkeby', // optional
            theme: 'dark',
            options: {
                walletlink: {
                    package: CoinbaseWalletSDK, // Required
                    options: {
                        appName: 'Sneaky Bird', // Required
                        infuraId: 'c1bc8f3b771c4cbeb01bd597a820a3fb', // Required unless you provide a JSON RPC url; see `rpc` below
                    },
                },
                walletconnect: {
                    package: WalletConnect, // required
                    options: {
                        infuraId: 'c1bc8f3b771c4cbeb01bd597a820a3fb', // required
                    },
                },
            },
        });

        web3Modal
            .connect()
            .then((provider) => {
                setLibrary(new ethers.providers.Web3Provider(provider));
            })
            .catch(console.error);
    };

    return {
        library,
        connect,
    };
}

export default useWallet;
