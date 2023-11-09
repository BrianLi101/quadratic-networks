import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div>
          <p className="mb-4 text-3xl">
            Create your own group using quadratic networks
          </p>
          <Link
            href="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
}
