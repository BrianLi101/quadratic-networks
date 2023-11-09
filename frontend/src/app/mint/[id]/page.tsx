// TODO: Abstract client component into separate file so page does not
// need to be client component
"use client";

export default function Group({ params }: { params: { id: string } }) {
  const handleConnectWallet = async () => {
    console.log("connect wallet");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">
          You&apos;ve been invited to join [groupName]
        </h1>

        <button
          onClick={handleConnectWallet}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Mint
        </button>
      </div>
    </main>
  );
}
