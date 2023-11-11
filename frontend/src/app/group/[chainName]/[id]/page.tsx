// TODO: Abstract client component into separate file so page does not
// need to be client component
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WagmiProvider from "@/components/WagmiProvider";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import {
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWalletClient,
} from "wagmi";
import abi from "@/contracts/QuadraticNetworksNFT/abi.json";
import { getContract } from "viem";
import LoadingIndicator from "@/components/LoadingIndicator";

import {
  getViemClient,
  checkOrSwitchToActiveChain,
} from "@/helpers/chainHelpers";

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
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [members, setMembers] = useState<Membership[]>();
  const [nominees, setNominees] = useState<Nominee[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [nominating, setNominating] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(1);
  const [nomineeAddress, setNomineeAddress] = useState<string>();
  const [name, setName] = useState<string>();

  const getAddressFromEns = async (ens: string | undefined) => {
    if (!ens) return;
    var address = await getViemClient().getEnsAddress({ name: ens });
    return address;
  };

  const { config } = usePrepareContractWrite({
    address: params.id as `0x${string}`,
    abi,
    functionName: "nominate",
    args: [getAddressFromEns(nomineeAddress)],
  });
  const { write, isLoading, data: nominationHash } = useContractWrite(config);

  useEffect(() => {
    loadContractData();
  }, []);

  useEffect(() => {
    if (nominationHash) {
      console.log("got nomination hash", nominationHash);

      awaitNominationTransaction(nominationHash.hash);
    }
  }, [nominationHash]);

  const awaitNominationTransaction = async (hash: `0x${string}`) => {
    setNominating(true);

    const transaction = await getViemClient().waitForTransactionReceipt({
      hash,
    });
    console.log("transaction finished: ", transaction);
    toast.success("Nominated!");

    setNominating(false);
    loadContractData();
  };

  const loadContractData = async () => {
    setLoading(true);
    const contract = getContract({
      address: params.id as `0x${string}`,
      abi,
      publicClient: getViemClient(),
    });
    const totalSupply = (await contract.read.totalSupply()) as BigInt;
    console.log(totalSupply.toString());

    const allNominations =
      (await contract.read.getAllNominations()) as Nomination[];
    const nominationMap: { [id: Address]: Nominee } = {};
    allNominations.map(({ nominee, nominator }) => {
      if (nominee === "0x0000000000000000000000000000000000000000") return;

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
      // @ts-ignore
      args: [totalSupply],
    })) as BigInt;
    setThreshold(parseInt(threshold.toString()));
    console.log(threshold.toString());

    const name = (await contract.read.name()) as string;
    setName(name);
    console.log(name);

    setLoading(false);
    setLoading(false);
  };

  function canMemberJoinGroup(walletAddress: string): boolean {
    if (!nominees) return false;
    const nominee = nominees.find((nom) => nom.address === walletAddress);
    return nominee !== undefined && nominee.nominators.length >= threshold;
  }

  const handleNominationClick = async () => {
    if (!nomineeAddress || !walletClient) return;
    console.log(`Nominate clicked for address: ${nomineeAddress}`);

    if (!(await checkOrSwitchToActiveChain(walletClient))) return;

    try {
      write && write();
      loadContractData();
    } catch (error) {}
  };

  function handleShareMintLink(walletAddress: string) {
    console.log(`Share mint link clicked for address: ${walletAddress}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {loading && (
          <div className="w-full h-100 flex justify-center items-center">
            <LoadingIndicator />
          </div>
        )}

        <h1 className="text-2xl mt-8 mb-4">{name ? name : "..."}</h1>

        <div className="w-full flex flex-row mt-2 mb-6">
          <input
            type="text"
            id="groupName"
            className="py-3 px-4 rounded bg-green-800 flex-1"
            name="groupName"
            placeholder="E.g. 0x123... or vitalik.eth"
            required
            value={nomineeAddress}
            onChange={(e) => {
              setNomineeAddress(e.target.value);
              // setNomineeAddress(e.target.value);
            }}
          />
          <button
            type="submit"
            onClick={handleNominationClick}
            className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            disabled={loading || nominating}
          >
            Nominate {nominating && <LoadingIndicator />}
          </button>
        </div>

        {nominees && (
          <div className="mt-10">
            <h2 className="text-lg">Nominees ({nominees.length})</h2>
            <p className="text-gray-400">Threshold: {threshold}</p>

            {nominees.map((nominee) => (
              <div className="flex items-center py-2" key={nominee.address}>
                <p
                  className={`flex-grow ${
                    canMemberJoinGroup(nominee.address) ? "text-green-500" : ""
                  }`}
                >
                  {nominee.address}
                </p>
                <p className="mr-6">
                  {nominee.nominators.length} / {threshold} required
                </p>
                {nominee.nominators.length >= threshold ? (
                  <button
                    type="submit"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        window.location.href + "/mint"
                      );
                      toast.success("Copied!");
                    }}
                    className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    disabled={!address || loading || nominating}
                  >
                    Copy Mint Link
                  </button>
                ) : (
                  <button
                    onClick={() => handleNominationClick()}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    Nominate {nominating && <LoadingIndicator />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg">Members ({members ? members.length : ""})</h2>
          {members &&
            members.map((member) => (
              <div className="flex py-2" key={member.tokenId.toString()}>
                <p>{member.tokenId.toString()}</p>:<p>{member.owner}</p>
              </div>
            ))}
        </div>

        <div className="collapse">
          <input type="checkbox" />
          <div className="collapse-title text-lg">Show Mint QR ⬇️</div>
          <div className="collapse-content">
            <QRCode value={window?.location.href} />
            <button
              type="submit"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href + "/mint");
                toast.success("Copied!");
              }}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              disabled={!address || loading || nominating}
            >
              Copy Mint Link
            </button>
          </div>
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
