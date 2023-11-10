// TODO: Abstract client component into separate file so page does not
// need to be client component
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewNomination() {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams);

  const groupId = searchParams.get("groupId");

  const handleSubmit = async () => {
    try {
      const response = true;

      if (response) {
        console.log("success submit");

        router.push(`/group/${groupId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">Nominate new member</h1>
        {/* TODO: Add form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p>Group: {groupId}</p>
          <label htmlFor="walletAddress">Enter ENS or wallet address:</label>
          <input
            type="text"
            id="walletAddress"
            name="walletAddress"
            className="py-3 px-4 rounded bg-green-800 mt-2 mb-6"
            placeholder="Enter address"
            required
          />
        </form>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Nominate
        </button>
        {/* <p>Group: {groupId}</p>
        <p>Enter ENS or wallet address</p>
        <Link
          href={`/group/${groupId}`}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Nominate
        </Link> */}
      </div>
    </main>
  );
}
