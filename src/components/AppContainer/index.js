// import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
// import { cache } from '@emotion/css';
// import { CacheProvider } from '@emotion/react';
import { GlobalStyles } from 'twin.macro';
import Header from '../Header';
import { useAppState } from '../../context/AppContext';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import SneakyBird from '../../../artifacts/contracts/SneakyBird.sol/SneakyBird.json';
import { default as environment } from '../../config/environment';

export const providerOptions = {
    walletlink: {
        package: CoinbaseWalletSDK, // Required
        options: {
            appName: 'Web 3 Modal Demo', // Required
            infuraId: 'c1bc8f3b771c4cbeb01bd597a820a3fb', // Required unless you provide a JSON RPC url; see `rpc` below
        },
    },
    // walletconnect: {
    //     package: WalletConnect, // required
    //     options: {
    //         infuraId: 'c1bc8f3b771c4cbeb01bd597a820a3fb', // required
    //     },
    // },
};

// eslint-disable-next-line
function AppContainer({ Component, pageProps }) {
    const { state, actions } = useAppState();
    const connect = async () => {
        try {
            const web3Modal = new Web3Modal({
                // network: 'local', // optional
                network: 'rinkeby', // optional
                theme: 'dark',
                providerOptions,
            });
            const provider = await web3Modal.connect();

            const web3Provider = new ethers.providers.Web3Provider(provider);

            const signer = await web3Provider.getSigner();
            const address = await signer.getAddress();
            const { name, chainId } = await web3Provider.getNetwork();
            const contract = new ethers.Contract(
                environment.default.sneakyBird.contractAddress,
                SneakyBird.abi,
                signer,
            );

            actions.walletConnected({
                provider,
                web3Provider,
                address,
                contract,
                network: { name, chainId },
            });
        } catch (ex) {
            console.error(ex);
        }
    };
    return (
        <>
            {/* <CacheProvider cache={cache}> */}
            <GlobalStyles />
            <Header onWalletConnect={connect} address={state.address} />
            <Component {...pageProps} />
            {/* </CacheProvider> */}
        </>
    );
}

export default AppContainer;
