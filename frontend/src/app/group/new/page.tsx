import Link from "next/link";

export default function NewGroup() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Create new quadratic group</h1>
        {/* TODO: Add form */}
        <p>Name</p>
        <p>Upload image</p>
        <p>Max group size</p>
        <p>Chain</p>
        <Link
          href="/dashboard"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Create group
        </Link>
      </div>
    </main>
  );
}
