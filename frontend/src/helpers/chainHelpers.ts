import { Chain } from 'viem';
import { SUPPORTED_CHAINS } from '@/resources/constants';
import { goerli, base, optimism } from 'viem/chains';
import { createPublicClient, http, getContractAddress } from 'viem';
import { Client } from 'viem';
import { WalletClient } from 'wagmi';
let activeChain: Chain = SUPPORTED_CHAINS[0];

export const getActiveChain = () => activeChain;
export const setActiveChain = (chain: Chain) => {
  activeChain = chain;
};

export const getViemClient = () => {
  let apiKey: string | undefined;
  switch (activeChain) {
    case goerli:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_URL_GOERLI;
      break;
    case base:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_URL_BASE;
      break;
    case optimism:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_URL_OPTIMISM;
      break;
  }

  if (!apiKey) {
    throw new Error('No API key found for active chain');
  }

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(apiKey),
  });

  return publicClient;
};

export const checkOrSwitchToActiveChain = async (
  walletClient: WalletClient
) => {
  console.log(walletClient.chain?.name);
  console.log(activeChain.name);
  if (walletClient.chain?.id !== activeChain.id) {
    try {
      await walletClient.switchChain(activeChain);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return true;
  }
};

export const setActiveChainFromURL = (url: string) => {
  const regex = /\/group\/(\w+)\//;
  const match = url.match(regex);
  if (match) {
    const chainName = match[1];
    switch (activeChain) {
      case goerli:
        activeChain = goerli;
        break;
      case base:
        activeChain = base;
        break;
      case optimism:
        activeChain = optimism;
        break;
    }
  } else {
    console.log('No match found.');
  }
};
