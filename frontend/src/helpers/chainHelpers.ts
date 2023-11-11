import { Chain } from 'viem';
import { SUPPORTED_CHAINS } from '@/resources/constants';
import { goerli, base, optimism } from 'viem/chains';
import { createPublicClient, http, getContractAddress } from 'viem';

let activeChain: Chain = SUPPORTED_CHAINS[0];

export const getActiveChain = () => activeChain;

export const getViemClient = () => {
  let apiKey: string | undefined;
  switch (activeChain) {
    case goerli:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_URL_GOERLI;
      break;
    case base:
      apiKey = process.env.NEXT_PUBLIC_BASE_URL_GOERLI;
      break;
    case optimism:
      apiKey = process.env.NEXT_PUBLIC_OPTIMISM_URL_GOERLI;
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
