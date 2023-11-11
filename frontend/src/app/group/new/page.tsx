'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useWalletClient,
  useTransaction,
  WalletClient,
} from 'wagmi';
import LoadingIndicator from '@/components/LoadingIndicator';
import toast from 'react-hot-toast';

import WagmiProvider from '@/components/WagmiProvider';
import abi from '@/contracts/QuadraticNetworksNFT/abi.json';
import bytecode from '@/contracts/QuadraticNetworksNFT/bytecode.json';
import { goerli } from 'viem/chains';
import { getContractAddress } from 'viem';
import { Chain } from 'viem';
import { SUPPORTED_CHAINS } from '@/resources/constants';
import {
  getViemClient,
  getActiveChain,
  setActiveChain,
  checkOrSwitchToActiveChain,
} from '@/helpers/chainHelpers';

function NewGroup() {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [deploying, setDeploying] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [chain, setChain] = useState<Chain>(getActiveChain());
  const [foundingMembers, setFoundingMembers] = useState<string[]>([address!]);
  const [name, setName] = useState<string>();

  const getTransaction = async (hash: `0x${string}`) => {
    console.log('getTransaction called');
    let transaction = await getViemClient().getTransaction({
      hash: hash,
    });
    console.log({ transaction });
    let contractAddressData = await getContractAddress({
      from: address!,
      nonce: BigInt(transaction.nonce),
    });
    console.log({ contractAddressData });
    router.push(`/group/${getActiveChain().network}/${contractAddressData}`);
  };
  const handleSubmit = async () => {
    console.log('user clicked submit');
    if (!name) {
      toast.error('Missing group name.');
      return;
    }
    if (!walletClient) return null;

    if (!(await checkOrSwitchToActiveChain(walletClient))) return;

    setDeploying(true);
    try {
      console.log('attempting to deploy contract');
      const hash = await walletClient.deployContract({
        abi,
        bytecode: bytecode.bytecode as `0x${string}`,
        args: [name, name.toUpperCase(), foundingMembers, 1000000],
        chain: getActiveChain(),
      });
      console.log({ hash });
      const transaction = await getViemClient().waitForTransactionReceipt({
        hash: hash,
      });
      setTransactionHash(hash);
      await getTransaction(hash);
      setDeploying(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMember = () => {
    setFoundingMembers([...foundingMembers, '']);
  };

  const handleMemberChange = (value: string, index: number) => {
    const newMembers = [...foundingMembers];
    newMembers[index] = value;
    setFoundingMembers(newMembers);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = foundingMembers.filter((_, i) => i !== index);
    setFoundingMembers(newMembers);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24 bg-[#19473F]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">Create new quadratic group</h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col">
            <label htmlFor="groupName">Group name:</label>
            <input
              type="text"
              id="groupName"
              className="py-3 px-4 rounded bg-green-800 mt-2 mb-6"
              name="groupName"
              placeholder="E.g. Secret society"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          {foundingMembers.map((member, index) => (
            <div key={index} className="flex flex-col mt-4">
              <label htmlFor={`foundingMember-${index}`}>
                {`Founding member ${index + 1}:`}
              </label>
              <input
                type="text"
                id={`foundingMember-${index}`}
                className="py-3 px-4 rounded bg-green-800 mt-2 mb-2"
                value={member}
                onChange={(e) => handleMemberChange(e.target.value, index)}
                placeholder="0x123..."
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="bg-red-200 hover:bg-red-300 text-gray-800 font-bold py-1 px-3 rounded mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMember}
            className="text-gray-200 mt-2 mb-6 px-3 py-2 border border-gray-200 rounded"
          >
            Add founding member
          </button>

          {/* <div className="mb-6">
            <label htmlFor="groupImage">Upload image:</label>
            <input
              type="file"
              id="groupImage"
              name="groupImage"
              className="mt-2 mb-6"
            />
          </div> */}

          <div className="dropdown">
            <label tabIndex={0} className="btn">
              Chain: {chain.name}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {SUPPORTED_CHAINS.map((c) => {
                return (
                  <li
                    key={c.id}
                    onClick={() => {
                      setActiveChain(c);
                      setChain(c);
                    }}
                  >
                    <a>{c.name}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </form>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          disabled={deploying}
        >
          Create group {deploying && <LoadingIndicator />}
        </button>
      </div>
    </main>
  );
}

const WrappedNewGroup = () => {
  return (
    <WagmiProvider>
      <NewGroup />
    </WagmiProvider>
  );
};
export default WrappedNewGroup;
