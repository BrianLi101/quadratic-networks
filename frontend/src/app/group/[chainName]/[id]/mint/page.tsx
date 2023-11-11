// TODO: Abstract client component into separate file so page does not
// need to be client component
'use client';

import {
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi';
import WagmiProvider from '@/components/WagmiProvider';
import abi from '@/contracts/QuadraticNetworksNFT/abi.json';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { createPublicClient, http, getContractAddress } from 'viem';

import { getContract } from 'viem';
import LoadingIndicator from '@/components/LoadingIndicator';

import {
  getViemClient,
  checkOrSwitchToActiveChain,
  setActiveChainFromURL,
} from '@/helpers/chainHelpers';

function MintPage({ params }: { params: { id: string; chainName: string } }) {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [minted, setMinted] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [userAlreadyMinted, setUserAlreadyMinted] = useState<boolean>();
  const [minting, setMinting] = useState<boolean>();
  const { config } = usePrepareContractWrite({
    address: params.id as `0x${string}`,
    abi,
    functionName: 'mint',
  });
  const { write, isLoading, data: mintHash } = useContractWrite(config);

  useEffect(() => {
    if (typeof window === 'object') {
      // chain configuration won't work until window has loaded
      setActiveChainFromURL(window.location.href);
      // must happen after window has loaded because of the chain configuration
      loadContractData();
    }
  }, []);

  useEffect(() => {
    if (address) {
      const checkForNFT = async () => {
        if (address) {
          const contract = getContract({
            address: params.id as `0x${string}`,
            abi,
            publicClient: getViemClient(),
          });
          const userNFTBalance = (await contract.read.balanceOf({
            // @ts-ignore
            args: [address],
          })) as BigInt;
          if (parseInt(userNFTBalance.toString()) > 0) {
            setUserAlreadyMinted(true);
          }
        }
      };
      checkForNFT();
    }
  }, [address, params.id]);

  useEffect(() => {
    if (mintHash) {
      awaitNominationTransaction(mintHash.hash);
    }
  }, [mintHash]);

  const loadContractData = async () => {
    setLoading(true);
    const contract = getContract({
      address: params.id as `0x${string}`,
      abi,
      publicClient: getViemClient(),
    });
    const totalSupply = (await contract.read.totalSupply()) as BigInt;
    console.log(totalSupply.toString());

    setLoading(false);
  };

  const awaitNominationTransaction = async (hash: `0x${string}`) => {
    setMinting(true);
    const transaction = await getViemClient().waitForTransactionReceipt({
      hash,
    });
    console.log('transaction finished: ', transaction);
    toast.success('Minted!');
    setMinted(true);
    setMinting(false);
  };
  const checkMintPermission = async () => {
    const contract = getContract({
      address: params.id as `0x${string}`,
      abi,
      publicClient: getViemClient(),
    });

    // @ts-ignore
    return await contract.read.checkMintPermission({ args: [address] });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-2xl">
          {userAlreadyMinted
            ? 'You are already a member!'
            : `You've been invited to join!`}
        </h1>

        {!userAlreadyMinted && (
          <button
            onClick={async () => {
              let allowed = await checkMintPermission();
              if (!allowed) {
                toast.error(
                  `You don't have enough nominations to mint this NFT.`
                );
                return;
              }
              if (!walletClient) return;
              if (!(await checkOrSwitchToActiveChain(walletClient))) return;
              write && write();
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded items-center"
            disabled={minting}
          >
            Mint {minting && <LoadingIndicator />}
          </button>
        )}
        <button
          onClick={async () => {
            window.location.href = window.location.href.replace('/mint', '');
          }}
          className={
            userAlreadyMinted
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded items-center'
              : 'mbg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded items-center'
          }
          disabled={minting}
        >
          View Group
        </button>
      </div>
    </main>
  );
}

const WrappedMintPage = (props: any) => {
  return (
    <WagmiProvider>
      <MintPage {...props} />
    </WagmiProvider>
  );
};
export default WrappedMintPage;
