import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import SneakyBird from '../.././artifacts/contracts/SneakyBird.sol/SneakyBird.json';
import BigNumber from 'bignumber.js';

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
    const [data, setData] = useState();
    const [nfts, setNfts] = useState([]);

    const loadNfts = async (requestIds, contract) => {
        Promise.all(
            requestIds.map(async (id) => {
                const parsed = {
                    requestIdToSender: await contract.requestIdToSender(id),
                    requestIdToTokenURI: await contract.requestIdToTokenURI(id),
                    tokenIdToMaterial: await contract.tokenIdToMaterial(id),
                    requestIdToTokenId: BigNumber(await contract.requestIdToTokenId(id)),
                };
                console.log(parsed);
                return parsed;
                // await contract.IdToToken(id);
            }),
        ).then(setNfts);
    };

    const connectWallet = async () => {
        try {
            const web3Modal = new Web3Modal({
                // network: 'local', // optional
                network: 'rinkeby', // optional
                theme: 'dark',
                providerOptions,
            });
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            const signer = await library.getSigner();
            const contract = new ethers.Contract(
                '0x408937dB243A993928c857c8a59CAd4f0B816aF6',
                SneakyBird.abi,
                signer,
            );

            const contractBalance = await library.getBalance(contract.address);
            // const transaction = await contract.createNFT('testURI').catch(console.log);

            // const requestIdToSender = contract.requestIdToSender();
            // const requestIdToTokenURI = contract.requestIdToTokenURI();
            // const tokenIdToMaterial = contract.tokenIdToMaterial();
            // const requestIdToTokenId = contract.requestIdToTokenId();
            // const IdToToken = contract.IdToToken();
            if (localStorage.getItem('requestIds')) {
                loadNfts(JSON.parse(localStorage.getItem('requestIds')), contract);
            }
            setData({
                accounts,
                network,
                chainId: network.chainId,
                contract,
                contractBalance: ethers.utils.formatEther(contractBalance),
                // signer: library.getSigner(),
                // contract,
                // requestIdToSender,
                // requestIdToTokenURI,
                // tokenIdToMaterial,
                // requestIdToTokenId,
                // IdToToken,
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (!data?.accounts) {
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

    const mint = async () => {
        const { contract } = data;
        contract.on('requestedNFT', (requestId) => {
            const requestIds = JSON.parse(localStorage.getItem('requestIds') || '[]');
            requestIds.push(requestId);
            localStorage.setItem('requestIds', JSON.stringify(requestIds));
            loadNfts(requestIds, data.contract);
        });
        const transaction = await contract
            .createNFT('testURI', { gasLimit: 2100000 })
            .catch(console.log);

        setData({
            ...data,
            transaction,
            contract,
        });
    };

    return (
        <>
            <div className="flex justify-center items-center pt-20">
                <div>
                    <button
                        className="block rounded px-5 py-3 bg-blue-500 text-white shadow-lg"
                        type="button"
                        onClick={mint}
                    >
                        Mint
                    </button>
                </div>
            </div>
            {console.log('TEST', data.nfts)}
            <pre>
                {JSON.stringify(
                    {
                        nfts,
                        transaction: data.transaction,
                        accounts: data.accounts,
                        network: data.network,
                        contractAddress: data.contract?.address,
                        requestIdToSender: data.requestIdToSender,
                        requestIdToTokenURI: data.requestIdToTokenURI,
                        tokenIdToMaterial: data.tokenIdToMaterial,
                        requestIdToTokenId: data.requestIdToTokenId,
                        IdToToken: data.IdToToken,
                        contractBalance: data.contractBalance,
                    },
                    null,
                    2,
                )}
            </pre>
        </>
    );
};

export default Page;
