import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("PixellNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const nft = await NFT.deploy();
  console.log("Contract deployed to address:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
