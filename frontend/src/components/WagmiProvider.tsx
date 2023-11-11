import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { goerli, optimism } from 'viem/chains';
import { SUPPORTED_CHAINS } from '@/resources/constants';

const optimismApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_OPTIMISM;
const baseApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_BASE;
const goerliApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  SUPPORTED_CHAINS,
  [
    alchemyProvider({ apiKey: optimismApiKey! }),
    alchemyProvider({ apiKey: baseApiKey! }),
    alchemyProvider({ apiKey: goerliApiKey! }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const WagmiProvider = ({ children }: { children: any }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

export default WagmiProvider;
