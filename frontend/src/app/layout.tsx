import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { goerli } from 'viem/chains';
import './globals.css';
import Header from './components/header';
import { Web3Modal } from '@/context/Web3Modal';

const inter = Inter({ subsets: ['latin'] });

const apiKey = process.env.ALCHEMY_API_KEY_GOERLI;
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

export const metadata: Metadata = {
  title: 'ZuGroups',
  description: 'Quadratic membership for scaling groups',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <body className={inter.className}>
          <Web3Modal>
            <Header />
            {children}
          </Web3Modal>
        </body>
      </WagmiConfig>
    </html>
  );
}
