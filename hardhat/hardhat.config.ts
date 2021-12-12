/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";

dotenv.config();
const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env;

const config = {
  solidity: "0.8.0",
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {},
    ropsten: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

export default config;
