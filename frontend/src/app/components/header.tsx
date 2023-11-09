import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6">
      <Link href="/" className="">
        ZuGroups
      </Link>

      {/* <Link
        href="/"
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        Connect
      </Link> */}
      <w3m-button />
    </header>
  );
}
