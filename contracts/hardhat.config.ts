require('dotenv').config();

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
require('@nomiclabs/hardhat-ethers');

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.ALCHEMY_URL_GOERLI,
    },
  },
};

export default config;
