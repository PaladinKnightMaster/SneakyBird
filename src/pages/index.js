import tw, { styled } from 'twin.macro';
import { useAppState } from '../context/AppContext';

import React, { useState } from 'react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { ethers } from 'ethers';

const MintButton = styled(Button)`
    ${tw`px-10 py-3`}
`;

const Page = () => {
    const { state } = useAppState();
    const { contract } = state;

    //TEMPORARY STATE
    //TODO: REMOVE
    const [tempMintState, setTempMintState] = useState({});

    const mint = async () => {
        contract.on('requestedNFT', console.log);

        const transaction = await contract
            .createNFT(1, { value: ethers.utils.parseEther('0.03'), gasLimit: 2100000 })
            .catch(console.error);

        // console.log(transaction);
        setTempMintState(transaction);
        await transaction.wait().catch(console.log);
    };

    return (
        <div className="px-10">
            <div className="mt-[-20px]">
                <Logo />
            </div>

            <h2 className="text-[40px] font-thin mt-[80px] text-center">
                Our first limited edition NFT
            </h2>

            <div className="flex justify-center items-center mt-[20px]">
                <div>
                    <MintButton onClick={mint}>Mint</MintButton>
                </div>
            </div>

            <pre>{JSON.stringify(tempMintState, null, 2)}</pre>
        </div>
    );
};

export default Page;
