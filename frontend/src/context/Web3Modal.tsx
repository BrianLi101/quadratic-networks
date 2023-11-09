"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { arbitrum, mainnet } from "viem/chains";

// 1. Get projectId
const projectId = "a130840a7593badf0b0cbe9c3b9891e1";

// 2. Create wagmiConfig
const metadata = {
  name: "ZuGroups",
  description:
    "ZuGroups is a quadratic membership mechanism for scaling groups.",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
