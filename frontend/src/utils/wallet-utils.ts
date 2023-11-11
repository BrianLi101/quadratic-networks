import { ethers } from "ethers";

/**
 * Resolves an ETH wallet address to its ENS name.
 * @param address The Ethereum wallet address to resolve.
 * @param providerUrl The Ethereum node provider URL.
 * @returns The ENS name or null if the address does not have an ENS name.
 */
async function resolveAddressToENS(
  address: string,
  providerUrl: string
): Promise<string | null> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const ensName = await provider.lookupAddress(address);
    return ensName;
  } catch (error) {
    console.error("Error resolving address to ENS:", error);
    return null;
  }
}

// Example usage
const providerUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"; // Replace with your Ethereum node provider URL
const address = "0x..."; // Replace with the Ethereum address you want to resolve
resolveAddressToENS(address, providerUrl)
  .then((ensName) => console.log("ENS Name:", ensName))
  .catch((error) => console.error(error));
