import { Chain } from 'viem';
import { SUPPORTED_CHAINS } from '@/resources/constants';
import { goerli, base, optimism } from 'viem/chains';
import { createPublicClient, http, getContractAddress } from 'viem';
import { Client } from 'viem';
import { WalletClient } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';

let activeChain: Chain = SUPPORTED_CHAINS[0];

export const getActiveChain = (): Chain => activeChain;
export const setActiveChain = (chain: Chain) => {
  activeChain = chain;
};

export const getViemClient = () => {
  console.log('getViemClient chain is :', activeChain);
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
    console.log(activeChain.id);
    try {
      await walletClient.switchChain(activeChain);
      return true;
    } catch (error) {
      // @ts-ignore
      console.log(error.code);

      return false;
    }
  } else {
    return true;
  }
};

export const setActiveChainFromURL = (url: string) => {
  console.log('active chain was: ', activeChain.network);
  const regex = /\/group\/(\w+)\//;
  const match = url.match(regex);
  if (match) {
    const chainName = match[1];
    switch (chainName) {
      case goerli.network:
        activeChain = goerli;
        break;
      case base.network:
        activeChain = base;
        break;
      case optimism.network:
        activeChain = optimism;
        break;
    }
    console.log('set active chain to : ', activeChain.network);
  } else {
    console.log('No match found.');
  }
};

export const getWagmiAlchemyClient = (chain: Chain) => {
  console.log('getWagmiAlchemyClient chain is :', chain);
  let apiKey: string | undefined;
  switch (chain) {
    case goerli:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI;
      break;
    case base:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_BASE;
      break;
    case optimism:
      apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_OPTIMISM;
      break;
  }

  if (!apiKey) {
    throw new Error('No API key found for active chain');
  }

  return alchemyProvider({ apiKey });
};
