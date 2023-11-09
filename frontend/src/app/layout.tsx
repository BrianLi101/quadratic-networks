import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Web3Modal } from "@/context/Web3Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZuGroups",
  description: "Quadratic membership for scaling groups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
