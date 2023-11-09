// TODO: Abstract client component into separate file so page does not
// need to be client component
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NewNomination() {
  const searchParams = useSearchParams();
  console.log(searchParams);

  const groupId = searchParams.get("groupId");

  // const { groupId } = router.query; // Access groupId from the query

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">Nominate new member</h1>
        {/* TODO: Add form */}
        <p>Group: {groupId}</p>
        <p>Enter ENS or wallet address</p>
        <Link
          href={`/group/${groupId}`}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Nominate
        </Link>
      </div>
    </main>
  );
}
