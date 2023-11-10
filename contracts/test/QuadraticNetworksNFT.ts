import { expect } from 'chai';
const { ethers } = require('hardhat');
import hre from 'hardhat';
import { toChecksumAddress } from 'ethereum-checksum-address';
import { Signer } from 'ethers';

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
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let user3: Signer;
  let user4: Signer;
  beforeEach(async function () {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
  });
  // MARK: Constructor Tests
  // it('Require one initialOwner in constructor', async function () {
  //   let initialOwners: any[] = [];
  //   try {
  //     const quadraticNetworkNFTContract = await ethers.deployContract(
  //       'QuadraticNetworksNFT',
  //       ['Test', 'Test', initialOwners, 10]
  //     );
  //   } catch (error) {
  //     // Check that the error message matches the expected one
  //     // console.log(JSON.stringify(error.error));
  //     expect(error).to.exist;
  //   }
  // });
  // it('Assign tokens to three users in constructor', async function () {
  //   let initialOwners = [WALLET_ADDRESS_1, WALLET_ADDRESS_2, WALLET_ADDRESS_3];
  //   const quadraticNetworkNFTContract = await ethers.deployContract(
  //     'QuadraticNetworksNFT',
  //     ['Test', 'Test', initialOwners, 10]
  //   );
  //   console.log('running for loop');
  //   for (let i = 0; i < initialOwners.length; i++) {
  //     let address = initialOwners[i];
  //     let ownedNFTs = await quadraticNetworkNFTContract.getOwnedNFTs(address);
  //     console.log(address, ' : ', ownedNFTs);
  //     expect(ownedNFTs.length).to.equal(1);
  //   }
  // });
  // it('Prevent duplicates from minting in constructor', async function () {
  //   let initialOwners = [
  //     WALLET_ADDRESS_1,
  //     WALLET_ADDRESS_1,
  //     WALLET_ADDRESS_1,
  //     WALLET_ADDRESS_2,
  //     WALLET_ADDRESS_3,
  //   ];
  //   const quadraticNetworkNFTContract = await ethers.deployContract(
  //     'QuadraticNetworksNFT',
  //     ['Test', 'Test', initialOwners, 10]
  //   );
  //   console.log('running for loop');
  //   for (let i = 0; i < initialOwners.length; i++) {
  //     let address = initialOwners[i];
  //     let ownedNFTs = await quadraticNetworkNFTContract.getOwnedNFTs(address);
  //     console.log(address, ' : ', ownedNFTs);
  //     expect(ownedNFTs.length).to.equal(1);
  //   }
  // });

  // MARK: nomination tests
  // it('Require nft ownership to nominate', async function () {
  //   let initialOwners: any[] = [await user1.getAddress()];
  //   const quadraticNetworkNFTContract = await ethers.deployContract(
  //     'QuadraticNetworksNFT',
  //     ['Test', 'Test', initialOwners, 10]
  //   );

  //   let user2ConnectedContract = quadraticNetworkNFTContract.connect(user2);

  //   try {
  //     await user2ConnectedContract.nominate(await user3.getAddress());
  //   } catch (error) {
  //     console.log('error exists');
  //     console.log(error);
  //     // Check that the error message matches the expected one
  //     // console.log(JSON.stringify(error.error));
  //     expect(error).to.exist;
  //   }
  // });
  it('Ensure nominations are accurate', async function () {
    let initialOwners: any[] = [await user1.getAddress()];
    const quadraticNetworkNFTContract = await ethers.deployContract(
      'QuadraticNetworksNFT',
      ['Test', 'Test', initialOwners, 10]
    );

    let user1ConnectedContract = quadraticNetworkNFTContract.connect(user1);

    // have user1 nominate user3
    await user1ConnectedContract.nominate(await user3.getAddress());
    let user1Nomination =
      await quadraticNetworkNFTContract.getAddressNomination(
        await user1.getAddress()
      );

    expect(user1Nomination).to.equal(await user3.getAddress());
  });
});
