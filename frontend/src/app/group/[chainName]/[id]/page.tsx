// TODO: Abstract client component into separate file so page does not
// need to be client component
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import WagmiProvider from '@/components/WagmiProvider';
import {
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';
import { createPublicClient, http, getContractAddress } from 'viem';
import { goerli } from 'viem/chains';
import abi from '@/contracts/QuadraticNetworksNFT/abi.json';
import { getContract } from 'viem';
export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL_GOERLI),
});

const MOCK_GROUPS = [
  {
    id: '1',
    name: 'Quadratic Lands',
    image: 'https://picsum.photos/200',
    maxGroupSize: 100,
    chain: 'Polygon',
  },
  {
    id: '2',
    name: 'Cold Plunge DAO',
    image: 'https://picsum.photos/200',
    maxGroupSize: 100,
    chain: 'Base',
  },
];

const MOCK_MEMBERS = [
  {
    id: '1',
    // nominator: "alice.eth",
    walletAddress: 'alice.eth',
    // image: "https://picsum.photos/200",
  },
  {
    id: '2',
    // nominator: "charles.eth",
    walletAddress: '0x123',
    // image: "https://picsum.photos/200",
  },
  {
    id: '3',
    // nominator: "charles.eth",
    walletAddress: '0x456',
    // image: "https://picsum.photos/200",
  },
];

const MOCK_NOMINEES = [
  {
    id: '1',
    nominator: 'alice.eth',
    walletAddress: 'bob.eth',
    nominations: 1,
    // image: "https://picsum.photos/200",
  },
  {
    id: '2',
    nominator: 'charles.eth',
    walletAddress: '0x123',
    nominations: 1,
    // image: "https://picsum.photos/200",
  },
];

function calculateThreshold(memberCount: number): number {
  const threshold = Math.ceil(Math.pow(memberCount, 0.5));
  return threshold;
}

function Group({ params }: { params: { chainName: string; id: string } }) {
  const [group, setGroup] = useState({} as any);
  const [nomineeAddress, setNomineeAddress] = useState<string>();
  const quadraticContract = {
    address: params.id,
    abi: abi,
  };

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...quadraticContract,
        functionName: 'getAllNominations',
        chainId: goerli.id,
        allowFailure: false,
      },
    ],
  });
  const { config } = usePrepareContractWrite({
    address: params.id as `0x${string}`,
    abi,
    functionName: 'nominate',
    args: [nomineeAddress],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);
  // TODO: Fetch group data from the server
  useEffect(() => {
    const group = MOCK_GROUPS.find((group: any) => group.id === params.id);
    setGroup({ ...group, nominees: MOCK_NOMINEES, members: MOCK_MEMBERS });
  }, [params.id]);

  const testContract = async () => {
    const contract = getContract({
      address: params.id as `0x${string}`,
      abi,
      publicClient,
    });
    const totalSupply = (await contract.read.totalSupply()) as BigInt;
    console.log(totalSupply.toString());

    const allNominations = await contract.read.getAllNominations();
    console.log(allNominations);
    const allTokens = await contract.read.getAllTokens();
    console.log(allTokens);
    const threshold = (await contract.read.getNominationThreshold({
      args: [totalSupply],
    })) as BigInt;
    console.log(threshold.toString());
  };
  const threshold = calculateThreshold(MOCK_MEMBERS.length);

  function canMemberJoinGroup(walletAddress: string): boolean {
    const nominee = group.nominees.find(
      (nom: any) => nom.walletAddress === walletAddress
    );
    return nominee !== undefined && nominee.nominations >= threshold;
  }

  function handleNominationClick(walletAddress: string) {
    console.log(`Nominate clicked for address: ${walletAddress}`);

    setNomineeAddress(walletAddress);
    write && write();

    setGroup((prevGroup: any) => {
      const updatedNominees = prevGroup.nominees.map((nominee: any) => {
        if (nominee.walletAddress === walletAddress) {
          return { ...nominee, nominations: nominee.nominations + 1 };
        }
        return nominee;
      });

      return { ...prevGroup, nominees: updatedNominees };
    });
  }

  function handleShareMintLink(walletAddress: string) {
    console.log(`Share mint link clicked for address: ${walletAddress}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Link href="/dashboard" className="font-bold">
          Back
        </Link>
        <h1>
          {params.chainName} : {params.id}
        </h1>
        <Image
          src={group.image}
          alt={group.name}
          width={120}
          height={120}
          className="mt-10"
        />

        <h1 className="text-2xl mt-8 mb-4">{group?.name}</h1>

        <Link
          href={{
            pathname: '/nomination/new',
            query: { groupId: group.id }, // Pass the group ID as a query parameter
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Nominate member
        </Link>

        <div className="mt-10">
          <h2 className="text-lg">Nominees ({MOCK_NOMINEES.length})</h2>
          <p className="text-gray-400">Threshold: {threshold}</p>

          {group?.nominees &&
            group.nominees.map((nominee: any) => (
              <div className="flex items-center py-2" key={nominee.id}>
                <p
                  className={`flex-grow ${
                    canMemberJoinGroup(nominee.walletAddress)
                      ? 'text-green-500'
                      : ''
                  }`}
                >
                  {nominee.walletAddress}
                </p>
                <p className="mr-6">{nominee.nominations}</p>
                {nominee.nominations >= threshold ? (
                  // <button
                  //   onClick={() => handleShareMintLink(nominee.walletAddress)}
                  //   className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  // >
                  //   Share mint link
                  // </button>
                  <Link
                    href={`/mint/${params.id}`}
                    className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <p>Share mint link</p>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleNominationClick(nominee.walletAddress)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    Nominate
                  </button>
                )}
              </div>
            ))}
        </div>
        <button
          onClick={() => testContract()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Test Contract
        </button>
        <div className="mt-6">
          <h2 className="text-lg">Members ({MOCK_MEMBERS.length})</h2>
          {group?.members &&
            group.members.map((member: any) => (
              <div className="flex py-2" key={member.id}>
                <p>{member.walletAddress}</p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

const WrappedGroup = (props: any) => {
  return (
    <WagmiProvider>
      <Group {...props} />
    </WagmiProvider>
  );
};
export default WrappedGroup;
