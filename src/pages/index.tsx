import Hero from "@/components/Hero";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import pixellContract from "../../hardhat/artifacts/contracts/NFT.sol/PixellNFT.json";
import { useContractFunction, useEthers } from "@usedapp/core";
import { useEffect } from "react";

export default function Home() {
  const wethInterface = new utils.Interface(pixellContract.abi);
  const wethContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new Contract(wethContractAddress!, wethInterface);
  const { account } = useEthers();
  const { state: mintState, send: mintNFT } = useContractFunction(contract, "mintNFT", {
    transactionName: "Unwrap",
  });
  const { state: allowBuyState, send: allowBuy } = useContractFunction(contract, "allowBuy", {
    transactionName: "Unwrap",
  });

  useEffect(() => {
    console.log("mintState:", mintState);
    console.log("tokenId:", parseInt(mintState.receipt?.logs[0].topics[3].substring(2)!, 16));
  }, [mintState]);

  const testMint = () => {
    // Tested !
    mintNFT(
      account,
      "https://gateway.pinata.cloud/ipfs/QmUP2p8eNMocekUBGNTxrnGpQZrGY16WcJKHYm1ppet8DZ"
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const testAllowBuy = () => {
    // Not tested
    const tokenId = 2;
    const price = 0.03;
    allowBuy(2, 0.03).then((res) => {
      console.log(allowBuyState);
    });
  };

  return (
    <>
      <Hero />
      <Container className="py-10">
        <section className="flex flex-col space-y-8">
          <h1 className="text-2xl">Latest Drops</h1>
          <div className="flex flex-row justify-between w-full">
            <div className="w-48 h-48 bg-pink-100"></div>
            <div className="w-48 h-48 bg-pink-100"></div>
            <div className="w-48 h-48 bg-pink-100"></div>
            <div className="w-48 h-48 bg-pink-100"></div>
            <div className="w-48 h-48 bg-pink-100"></div>
          </div>
          <Button className="self-end">Go to Marketplace</Button>
          <Button onClick={testMint}>Test Minting Contract</Button>
        </section>
      </Container>
    </>
  );
}
