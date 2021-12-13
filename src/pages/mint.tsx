import Button from "@/components/Button";
import Container from "@/components/Container";
import { useGridContext } from "@/context/GridContext";
import { fetcher } from "@/lib/api";
import { Nft } from "@prisma/client";
import { useContractFunction, useEthers } from "@usedapp/core";
import { Formik } from "formik";
import Link from "next/link";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import pixellContract from "../../hardhat/artifacts/contracts/NFT.sol/PixellNFT.json";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { Spinner } from "@chakra-ui/spinner";

interface Props {}

interface NftDetails {
  name: string;
  price: number;
  description: string;
}

export default function Mint({}: Props): ReactElement {
  const [minting, setMinting] = useState<boolean>(false);
  const [mintStage, setMintStage] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderCanvas } = useGridContext();

  const wethInterface = new utils.Interface(pixellContract.abi);
  const wethContractAdress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new Contract(wethContractAdress, wethInterface);
  const { state: mintState, send: mintNft } = useContractFunction(contract, "mintNFT");
  const { state: allowBuyState, send: allowBuy } = useContractFunction(contract, "allowBuy");
  const { account } = useEthers();

  useEffect(() => {
    if (canvasRef?.current) renderCanvas(canvasRef);
  }, [canvasRef]);

  const mintStages = [
    "Uploading your NFT and its metadata",
    "Adding the NFT to the blockchain",
    "Enable the token to be bought",
  ];

  const handleMint = async (values: NftDetails) => {
    if (!canvasRef.current) return;
    setMinting(true);

    // Get the token ID, image and metadata hash
    const dataUrl = canvasRef.current.toDataURL();
    const { data: nft, error } = await fetcher<Nft>("/api/mint", "POST", {
      dataUrl,
      creatorAddress: account,
      ...values,
    });
    if (error || !nft) {
      console.error(error);
      return;
    }
    setMintStage(1);

    // Sign the contract using the user's wallet to mint the NFT
    // and it to the blockchain
    await mintNft(account, nft.metadataUri, nft.tokenId);
    setMintStage(2);

    // Sign the contract to allow buying the NFT at the specified price
    await allowBuy(nft.tokenId, values.price);
    setMintStage(3);
  };

  const DetailsForm: React.FC = () => (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl">Details</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Let's setup your NFT's name and price!
        </p>
      </div>
      <Formik<NftDetails>
        initialValues={{ name: "", price: 0, description: "" }}
        onSubmit={handleMint}
      >
        {({ values, handleSubmit, handleChange }) => (
          <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-gray-700">Name</label>
              <input
                onChange={handleChange}
                name="name"
                className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                required
                value={values.name}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-gray-700">Price</label>
              <input
                onChange={handleChange}
                name="price"
                type="number"
                min="0"
                className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                required
                value={values.price}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-gray-700">Description</label>
              <textarea
                onChange={handleChange}
                name="description"
                className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                required
                value={values.description}
              />
            </div>
            <Button type="submit">Mint</Button>
            <Link href="/create">
              <a className="text-xs italic text-right text-gray-400 underline">
                Unsure? Let's edit again!
              </a>
            </Link>
          </form>
        )}
      </Formik>
    </>
  );

  const Minting: React.FC = () => (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl">Minting...</h2>
        <p className="text-sm leading-relaxed text-gray-600">Your NFT is being minted!</p>
      </div>
      <div>
        {mintStages.map((label, step) => {
          if (mintStage < step) {
            return (
              <div>
                <CheckCircleIcon className="w-6 h-6 text-green-300" />
                <span className="leading-relaxed text-green-700">{label}</span>
              </div>
            );
          }

          if (mintStage === step) {
            return (
              <div>
                <Spinner className="w-5 h-5 text-gray-400" />
                <span className="leading-relaxed text-gray-700">{label}</span>
              </div>
            );
          }

          return (
            <div>
              <Spinner className="w-5 h-5 text-gray-100" />
              <span className="leading-relaxed text-gray-400">{label}</span>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <Container className="py-8">
        <CheckCircleIcon className="w-6 h-6 text-green-300" />
        <h1 className="text-2xl text-center text-white sm:text-3xl">Mint Your NFT!</h1>
        <div className="flex items-center max-w-4xl gap-10 p-0 mx-auto my-6 bg-white rounded-lg drop-shadow-lg">
          <div className="flex-1 py-10 pl-10 space-y-4">
            {minting ? <Minting /> : <DetailsForm />}
          </div>
          <div className="overflow-auto transform scale-75 border border-gray-200 shadow-xl rounded-xl">
            <canvas height="448" width="448" ref={canvasRef}></canvas>
          </div>
        </div>
      </Container>
    </section>
  );
}
