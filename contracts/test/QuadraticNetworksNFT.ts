import { expect } from 'chai';
const { ethers } = require('hardhat');
import hre from 'hardhat';
import { toChecksumAddress } from 'ethereum-checksum-address';

const WALLET_ADDRESS_1 = toChecksumAddress(
  '0x0293563835C83D2c9d91D17A1943352f42c2b4E1'
);
const WALLET_ADDRESS_2 = toChecksumAddress(
  '0x34dd5766D4D0623575834d3a664816e828316b98'
);
const WALLET_ADDRESS_3 = toChecksumAddress(
  '0x0285d44A2011a880144d22924b495c307c0BaF88'
);

describe('QuadraticNetworksNFT', function () {
  it('Assign tokens to three users in constructor', async function () {
    let initialOwners = [WALLET_ADDRESS_1, WALLET_ADDRESS_2, WALLET_ADDRESS_3];
    const quadraticNetworkNFTContract = await ethers.deployContract(
      'QuadraticNetworksNFT',
      ['Test', 'Test', initialOwners, 10]
    );

    console.log('running for loop');
    for (let i = 0; i < initialOwners.length; i++) {
      let address = initialOwners[i];
      let ownedNFTs = await quadraticNetworkNFTContract.getOwnedNFTs(address);
      console.log(address, ' : ', ownedNFTs);
      expect(ownedNFTs.length).to.equal(1);
    }
  });
  it('Prevent duplicates from minting in constructor', async function () {
    let initialOwners = [
      WALLET_ADDRESS_1,
      WALLET_ADDRESS_1,
      WALLET_ADDRESS_1,
      WALLET_ADDRESS_2,
      WALLET_ADDRESS_3,
    ];
    const quadraticNetworkNFTContract = await ethers.deployContract(
      'QuadraticNetworksNFT',
      ['Test', 'Test', initialOwners, 10]
    );

    console.log('running for loop');
    for (let i = 0; i < initialOwners.length; i++) {
      let address = initialOwners[i];
      let ownedNFTs = await quadraticNetworkNFTContract.getOwnedNFTs(address);
      console.log(address, ' : ', ownedNFTs);
      expect(ownedNFTs.length).to.equal(1);
    }
  });
});
