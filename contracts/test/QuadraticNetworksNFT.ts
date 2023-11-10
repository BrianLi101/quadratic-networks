import { expect, assert } from 'chai';
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

const logAllTokensAndNominations = async (quadraticNetworkNFTContract: any) => {
  let allTokens = await quadraticNetworkNFTContract.getAllTokens();
  console.log({ allTokens });
  let nominations = await quadraticNetworkNFTContract.getAllNominations();
  console.log({ nominations });
};

describe('QuadraticNetworksNFT', function () {
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let user3: Signer;
  let user4: Signer;
  let user5: Signer;
  let mintingUser: Signer;
  beforeEach(async function () {
    [owner, user1, user2, user3, user4, user5, mintingUser] =
      await ethers.getSigners();
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
  //     expect(parseInt(ownedNFTs[0])).to.equal(i);
  //   }
  //   await logAllTokensAndNominations(quadraticNetworkNFTContract);
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
  // it('Ensure nominations are accurate', async function () {
  //   let initialOwners: any[] = [await user1.getAddress()];
  //   const quadraticNetworkNFTContract = await ethers.deployContract(
  //     'QuadraticNetworksNFT',
  //     ['Test', 'Test', initialOwners, 10]
  //   );

  //   let user1ConnectedContract = quadraticNetworkNFTContract.connect(user1);

  //   // have user1 nominate user3
  //   await user1ConnectedContract.nominate(await user3.getAddress());
  //   let user1Nomination =
  //     await quadraticNetworkNFTContract.getAddressNomination(
  //       await user1.getAddress()
  //     );

  //   expect(user1Nomination).to.equal(await user3.getAddress());
  // });

  // MARK: mint and checkMintPermission
  // it('Check for mint permission at 1 in network', async function () {
  //   // user2 will attempt to mint with no nominations, with 1 wrong nomination, and with 1 correct nomination
  //   let initialOwners: any[] = [await user1.getAddress()];
  //   const quadraticNetworkNFTContract = await ethers.deployContract(
  //     'QuadraticNetworksNFT',
  //     ['Test', 'Test', initialOwners, 10]
  //   );

  //   let user1ConnectedContract = quadraticNetworkNFTContract.connect(user1);
  //   let user2ConnectedContract = quadraticNetworkNFTContract.connect(user2);

  //   await logAllTokensAndNominations(quadraticNetworkNFTContract);

  //   // check for mint permission with no nominations
  //   let permission1 = await user2ConnectedContract.checkMintPermission(
  //     await user2.getAddress()
  //   );
  //   console.log({ permission1 });
  //   expect(permission1).to.equal(false);

  //   // try to mint with no nominations
  //   // await user2ConnectedContract
  //   //   .mint()
  //   //   .then(() => {
  //   //     console.log('failed as expected');
  //   //     assert.fail('Mint should have failed');
  //   //   })
  //   //   .finally(() => {
  //   //     return;
  //   //   });

  //   // have user1 nominate wrong user (user3)
  //   await user1ConnectedContract.nominate(await user3.getAddress());
  //   let permission2 = await user2ConnectedContract.checkMintPermission(
  //     await user2.getAddress()
  //   );
  //   console.log({ permission2 });
  //   expect(permission2).to.equal(false);

  //   // have user1 nominate user2
  //   await user1ConnectedContract.nominate(await user2.getAddress());
  //   let permission3 = await user2ConnectedContract.checkMintPermission(
  //     await user2.getAddress()
  //   );
  //   console.log({ permission3 });
  //   expect(permission3).to.equal(true);

  //   // try to mint with 1 nomination
  //   await user2ConnectedContract
  //     .mint()
  //     .then(() => {})
  //     .catch((error: any) => {
  //       assert.fail('Mint should have worked');
  //     })
  //     .finally(() => {
  //       return;
  //     });

  //   let ownedNFTs = await quadraticNetworkNFTContract.getOwnedNFTs(
  //     await user2.getAddress()
  //   );
  //   console.log(await user2.getAddress(), ' : ', ownedNFTs);
  //   expect(ownedNFTs.length).to.equal(1);
  //   await logAllTokensAndNominations(quadraticNetworkNFTContract);
  // });
  it('Check for mint permission at 3 in network', async function () {
    // mintingUser will attempt to mint with 1 right nomination, and with 2 right nominations
    let initialOwners: any[] = [
      await user1.getAddress(),
      await user2.getAddress(),
      // await user3.getAddress(),
    ];
    const quadraticNetworkNFTContract = await ethers.deployContract(
      'QuadraticNetworksNFT',
      ['Test', 'Test', initialOwners, 10]
    );

    let user1ConnectedContract = quadraticNetworkNFTContract.connect(user1);
    let user2ConnectedContract = quadraticNetworkNFTContract.connect(user2);
    let user3ConnectedContract = quadraticNetworkNFTContract.connect(user3);
    let mintingUserConnectedContract =
      quadraticNetworkNFTContract.connect(mintingUser);

    await logAllTokensAndNominations(quadraticNetworkNFTContract);

    // check for mint permission with 1 right nominations
    await user1ConnectedContract.nominate(await mintingUser.getAddress());
    let permission1 = await mintingUserConnectedContract.checkMintPermission(
      await mintingUser.getAddress()
    );
    console.log({ permission1 });
    expect(permission1).to.equal(false);

    // try to mint with no nominations
    // await user3ConnectedContract
    //   .mint()
    //   .then(() => {
    //     console.log('failed as expected');
    //     assert.fail('Mint should have failed');
    //   })
    //   .finally(() => {
    //     return;
    //   });
    // have user1 nominate user2
    await user1ConnectedContract.nominate(await user2.getAddress());
    let permission3 = await user2ConnectedContract.checkMintPermission(
      await user2.getAddress()
    );
    console.log({ permission3 });
    expect(permission3).to.equal(true);

    // try to mint with 1 nomination
    await user2ConnectedContract
      .mint()
      .then(() => {})
      .catch((error: any) => {
        assert.fail('Mint should have worked');
      })
      .finally(() => {
        return;
      });

    let ownedNFTs = await quadraticNetworkNFTContract.getOwnedNFTs(
      await user2.getAddress()
    );
    console.log(await user2.getAddress(), ' : ', ownedNFTs);
    expect(ownedNFTs.length).to.equal(1);
    await logAllTokensAndNominations(quadraticNetworkNFTContract);
  });
});
