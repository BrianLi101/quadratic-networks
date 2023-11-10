import { expect } from 'chai';
import { ethers } from 'hardhat';
import hre from 'hardhat';

const WALLET_ADDRESS_1 = '0x0293563835C83D2c9d91D17A1943352f42c2b4E1';
const WALLET_ADDRESS_2 = '0x34dd5766D4D0623575834d3a664816e828316b98';
const WALLET_ADDRESS_3 = '0x0285d44A2011a880144d22924b495c307c0BaF88';

describe('QuadraticNetworksNFT', function () {
  it('Deployment should assign the total supply of tokens to the owner', async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract('QuadraticNetworksNFT', [
      'Test',
      'Test',
      [WALLET_ADDRESS_1, WALLET_ADDRESS_2, WALLET_ADDRESS_3],
    ]);

    // const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(3);
  });
  // it('Should deploy QuadraticNetworksNFT and retrieve data', async function () {
  //   const MyContract = await ethers.getContractFactory('QuadraticNetworksNFT');
  //   const myContract = await MyContract.deploy();

  //   await myContract.deployed();

  //   // Perform some contract interactions and assertions
  //   const data = await myContract.getData();
  //   expect(data).to.equal('Hello, world!');
  // });
});
