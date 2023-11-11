import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { goerli } from 'viem/chains';

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI;
console.log({ apiKey });
if (!apiKey) {
  throw new Error('ALCHEMY_API_KEY_GOERLI is not defined in the environment.');
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey })]
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
