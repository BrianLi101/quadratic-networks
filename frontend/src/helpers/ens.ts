import { mainnet } from 'viem/chains';
import { createPublicClient, http, getContractAddress } from 'viem';

import { normalize } from 'viem/ens';
let apiKey = process.env.NEXT_PUBLIC_ALCHEMY_URL_ETHEREUM;

export const resolveENSToAddress = async (ens: string) => {
  // ens only resolves on mainnet
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(apiKey),
  });

  try {
    if (!ens) return;
    var address = await publicClient.getEnsAddress({
      name: normalize(ens),
    });
    // Return original ens if no address found
    if (!address) return ens;
    return address;
  } catch (error) {
    return ens;
  }
};

export const resolveAddressToENS = async (address: string) => {
  // ens only resolves on mainnet
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(apiKey),
  });

  try {
    if (!address) return;
    var ens = await publicClient.getEnsName({
      address: address as `0x${string}`,
    });
    // Return original ens if no address found
    if (!ens) return address;
    return ens;
  } catch (error) {
    return address;
  }
};
