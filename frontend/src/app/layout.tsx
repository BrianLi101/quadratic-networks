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
console.log(JSON.stringify(publicProvider));

export const metadata: Metadata = {
  title: 'ZuGroups',
  description: 'Quadratic membership for scaling groups',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== 'undefined') {
    // Code that should only run on the client side
    return null;
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Modal>
          <Header />
          {children}
        </Web3Modal>
      </body>
    </html>
  );
}
