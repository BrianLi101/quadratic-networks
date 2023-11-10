'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function NewGroup() {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const [deploying, setDeploying] = useState<boolean>(false);

  const handleSubmit = async () => {
    console.log('user clicked submit');
    setDeploying(true);
    try {
      const response = true;
      const id = '1';

      if (response) {
        console.log('success submit');

        // TODO: Route to group page
        // router.push(`/group/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
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
            />
          </div>
          {/* <div className="mb-6">
            <label htmlFor="groupImage">Upload image:</label>
            <input
              type="file"
              id="groupImage"
              name="groupImage"
              className="mt-2 mb-6"
            />
          </div> */}
        </form>
        <h1>{deploying}</h1>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          disabled={!address}
        >
          Create group {deploying && <LoadingIndicator />}
        </button>
      </div>
    </main>
  );
}
