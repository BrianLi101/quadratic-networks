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
import LoadingIndicator from '@/components/LoadingIndicator';
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

type Address = `0x${string}`;
interface Nominee {
  address: Address;
  nominators: Address[];
}
interface Nomination {
  nominator: Address;
  nominee: Address;
}

interface Membership {
  tokenId: BigInt;
  owner: Address;
}

function Group({ params }: { params: { chainName: string; id: string } }) {
  const [group, setGroup] = useState({} as any);
  const [members, setMembers] = useState<Membership[]>();
  const [nominees, setNominees] = useState<Nominee[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(1);
  const [nomineeAddress, setNomineeAddress] = useState<string>();
  const quadraticContract = {
    address: params.id,
    abi: abi,
  };

  const { config } = usePrepareContractWrite({
    address: params.id as `0x${string}`,
    abi,
    functionName: 'nominate',
    args: [nomineeAddress],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    loadContractData();
  }, []);
  // TODO: Fetch group data from the server
  useEffect(() => {
    const group = MOCK_GROUPS.find((group: any) => group.id === params.id);
    setGroup({ ...group, nominees: MOCK_NOMINEES, members: MOCK_MEMBERS });
  }, [params.id]);

  const loadContractData = async () => {
    setLoading(true);
    const contract = getContract({
      address: params.id as `0x${string}`,
      abi,
      publicClient,
    });
    const totalSupply = (await contract.read.totalSupply()) as BigInt;
    console.log(totalSupply.toString());

    const allNominations =
      (await contract.read.getAllNominations()) as Nomination[];
    const nominationMap: { [id: Address]: Nominee } = {};
    allNominations.forEach(({ nominator, nominee }) => {
      if (nominee === '0x0000000000000000000000000000000000000000') return;
      let existingNominee = nominationMap[nominee];
      if (existingNominee) {
        nominationMap[nominee] = {
          ...existingNominee,
          nominators: [...existingNominee.nominators, nominator],
        };
      } else {
        nominationMap[nominee] = {
          address: nominee,
          nominators: [nominator],
        };
      }
    });
    setNominees(Object.values(nominationMap));
    console.log(allNominations);
    const allTokens = await contract.read.getAllTokens();
    setMembers(allTokens as Membership[]);
    console.log(allTokens);

    const threshold = (await contract.read.getNominationThreshold({
      args: [totalSupply],
    })) as BigInt;
    setThreshold(parseInt(threshold.toString()));
    console.log(threshold.toString());
    setLoading(false);
  };

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
        {loading && <LoadingIndicator />}
        <h1>
          {params.chainName} : {params.id}
        </h1>

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

        {nominees && (
          <div className="mt-10">
            <h2 className="text-lg">Nominees ({nominees.length})</h2>
            <p className="text-gray-400">Threshold: {threshold}</p>

            {nominees.map((nominee) => (
              <div className="flex items-center py-2" key={nominee.address}>
                <p
                  className={`flex-grow ${
                    canMemberJoinGroup(nominee.address) ? 'text-green-500' : ''
                  }`}
                >
                  {nominee.address}
                </p>
                <p className="mr-6">{nominee.nominators.length}</p>
                {nominee.nominators.length >= threshold ? (
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
                    onClick={() => handleNominationClick(nominee.address)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    Nominate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg">Members ({members ? members.length : ''})</h2>
          {members &&
            members.map((member) => (
              <div className="flex py-2" key={member.tokenId.toString()}>
                <p>{member.tokenId.toString()}</p>:<p>{member.owner}</p>
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
