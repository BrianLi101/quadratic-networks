import Link from "next/link";
import Image from "next/image";

const MOCK_GROUPS = [
  {
    id: "1",
    name: "Quadratic Lands",
    image: "https://picsum.photos/200",
    maxGroupSize: 100,
    chain: "Polygon",
  },
  {
    id: "2",
    name: "Cold Plunge DAO",
    image: "https://picsum.photos/200",
    maxGroupSize: 100,
    chain: "Base",
  },
];

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex lg:flex-col">
        <h1 className="text-2xl">Dashboard</h1>
        <Link
          href="/group/new"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Create group
        </Link>

        {/* <div className="mt-6">
          <h1 className="text-lg">Your groups</h1>
          {MOCK_GROUPS.map((group) => (
            <Link
              href={`/group/${group.id}`}
              key={group.id}
              className="flex py-2"
            >
              <Image
                src={group.image}
                alt={group.name}
                width={64}
                height={64}
              />
              <div className="flex flex-col ml-4">
                <p>{group.name}</p>
                <p>{group.maxGroupSize}</p>
                <p>{group.chain}</p>
              </div>
            </Link>
          ))}
        </div> */}
      </div>
    </main>
  );
}
