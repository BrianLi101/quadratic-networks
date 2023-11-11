// TODO: Abstract client component into separate file so page does not
// need to be client component
'use client';

import {
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
} from 'wagmi';
import WagmiProvider from '@/components/WagmiProvider';
import abi from '@/contracts/QuadraticNetworksNFT/abi.json';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { createPublicClient, http, getContractAddress } from 'viem';
import { goerli } from 'viem/chains';

import { getContract } from 'viem';
import LoadingIndicator from '@/components/LoadingIndicator';

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL_GOERLI),
});
function MintPage({ params }: { params: { id: string; chainName: string } }) {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const [minted, setMinted] = useState<boolean>();
  const [minting, setMinting] = useState<boolean>();
  const { config } = usePrepareContractWrite({
    address: params.id as `0x${string}`,
    abi,
    functionName: 'mint',
  });
  const { write, isLoading, data: mintHash } = useContractWrite(config);

  useEffect(() => {
    if (mintHash) {
      awaitNominationTransaction(mintHash.hash);
    }
  }, [mintHash]);
  const awaitNominationTransaction = async (hash: `0x${string}`) => {
    setMinting(true);
    const transaction = await publicClient.waitForTransactionReceipt({
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
      publicClient,
    });

    return await contract.read.checkMintPermission({ args: [address] });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">You&apos;ve been invited to join!</h1>

        <button
          onClick={async () => {
            let allowed = await checkMintPermission();
            if (!allowed) {
              toast.error(
                `You don't have enough nominations to mint this NFT.`
              );
              return;
            }
            write && write();
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          disabled={!address || minting}
        >
          Mint {minting && <LoadingIndicator />}
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