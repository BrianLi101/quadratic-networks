import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      {/* <div className="flex items-center">
        <h1 className="text-xl font-bold">Quadratic Lands</h1>
      </div> */}
      <Link
        href="/"
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        Disconnect wallet
      </Link>
    </header>
  );
}
