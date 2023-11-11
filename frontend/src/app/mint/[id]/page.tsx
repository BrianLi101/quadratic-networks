// TODO: Abstract client component into separate file so page does not
// need to be client component
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Group({ params }: { params: { id: string } }) {
  const [hasMinted, setHasMinted] = useState<boolean>(false);

  const router = useRouter();

  const groupName = "Quadratic Lands";

  const handleMint = async () => {
    // TODO: Connect wallet if not already connected
    console.log("connect wallet", hasMinted);

    setHasMinted(true);
  };

  const handleNominate = () => {
    router.push(`/group/${params.id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">
          {hasMinted
            ? `Congrats! You're now a member of ${groupName}`
            : `You've been invited to join ${groupName}`}
        </h1>

        {hasMinted ? (
          <button
            onClick={handleNominate}
            className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            Nominate new member
          </button>
        ) : (
          <button
            onClick={handleMint}
            className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            Mint
          </button>
        )}
      </div>
    </main>
  );
}
