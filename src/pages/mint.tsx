import Button from "@/components/Button";
import Container from "@/components/Container";
import { useGridContext } from "@/context/GridContext";
import { fetcher } from "@/lib/api";
import { Spinner } from "@chakra-ui/spinner";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { Nft } from "@prisma/client";
import { useContractFunction, useEthers } from "@usedapp/core";
import { utils } from "ethers";
import { Formik } from "formik";
import Link from "next/link";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import pixellContract from "../../hardhat/artifacts/contracts/NFT.sol/PixellNFT.json";

interface Props {}

interface NftDetails {
  name: string;
  price: number;
  description: string;
}

const MINT_STAGES = [
  "Uploading your NFT and its metadata",
  "Adding the NFT to the blockchain",
  "Enabling the token to be bought",
  "Updating token on database",
];

export default function Mint({}: Props): ReactElement {
  const [mintStage, setMintStage] = useState<number>(-1);
  const [tokenId, setTokenId] = useState<number>(-1);
  const [nft, setNft] = useState<Nft>();
  const tokenRef = useRef<number>(tokenId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderCanvas } = useGridContext();
  const { width, height } = useWindowSize();

  const wethInterface = new utils.Interface(pixellContract.abi);
  const wethContractAdress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
  const contract = new Contract(wethContractAdress, wethInterface);
  const { state: mintState, send: mintNft } = useContractFunction(
    contract,
    "mintNFT"
  );
  const { state: allowBuyState, send: allowBuy } = useContractFunction(
    contract,
    "allowBuy"
  );
  const { account } = useEthers();

  tokenRef.current = tokenId;

  useEffect(() => {
    if (canvasRef?.current) renderCanvas(canvasRef);
  }, [canvasRef]);

  useEffect(() => {
    if (mintState.status === "Success") {
      setTokenId(
        parseInt(mintState.receipt!.logs[0].topics[3].substring(2)!, 16)
      );
    }
  }, [mintState]);

  const handleMint = async (values: NftDetails) => {
    if (!canvasRef.current) return;
    setMintStage(0);

    // Change the values.price string to number
    values.price = Number(values.price);

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
    setNft(nft);
    setMintStage(1);

    // Fetching the IPFS image file from CF's gateway so that CF can cache
    // it before a user reaches the marketplace and finds it empty :(
    try {
      fetch(`https://cloudflare-ipfs.com/ipfs/${nft.uri.split("/").pop()}`, {
        mode: "no-cors",
      });
    } catch (err) {}

    // Sign the contract using the user's wallet to mint the NFT
    // and it to the blockchain
    try {
      await mintNft(nft.metadataUri);
      await new Promise<void>((resolve) => {
        setInterval(() => {
          if (tokenRef.current > 0) resolve();
        });
      });
      setMintStage(2);
    } catch (err) {
      console.error(err);
      return;
    }

    // Sign the contract to allow buying the NFT at the specified price
    try {
      await allowBuy(tokenRef.current!, parseEther(values.price.toString()));
      setMintStage(3);
    } catch (err) {
      console.error(err);
      return;
    }

    // Update database entry
    await fetcher(`/api/nfts/${nft.id}`, "PATCH", {
      onSale: true,
      tokenId: tokenRef.current!,
    });
    setMintStage(4);
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-sm space-y-4"
          >
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
                pattern="^\d*(\.\d{0,4})?$"
                min="0.0001"
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
        <p className="text-sm leading-relaxed text-gray-600">
          Your NFT is being minted!
        </p>
      </div>
      <div className="space-y-5">
        {MINT_STAGES.map((label, step) => {
          if (mintStage > step) {
            return (
              <div key={step} className="flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-green-300" />
                <span className="leading-relaxed text-green-700">{label}</span>
              </div>
            );
          }
          if (mintStage === step) {
            return (
              <div key={step} className="flex items-center gap-2">
                <Spinner className="w-5 h-5 text-gray-400" />
                <span className="leading-relaxed text-gray-700">
                  {label}...
                </span>
              </div>
            );
          }
          return (
            <div key={step} className="flex items-center gap-2">
              <Spinner className="w-5 h-5 text-gray-100" />
              <span className="leading-relaxed text-gray-400">{label}...</span>
            </div>
          );
        })}
      </div>
    </>
  );

  const Minted: React.FC = () => (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl">Minted! 🎉</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Yayy! Your NFT has been minted.
        </p>
      </div>
      <div className="space-y-5">
        {MINT_STAGES.map((label, step) => (
          <div key={step} className="flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-green-300" />
            <span className="leading-relaxed text-green-700">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-5">
        <Link href={`/marketplace/${nft!.id}`}>
          <Button className="flex-1">View on Marketplace</Button>
        </Link>
        <a href={nft!.uri} target="_blank">
          <Button className="flex-1">View on Pinata (IPFS)</Button>
        </a>
      </div>
    </>
  );

  return (
    <>
      {mintStage === MINT_STAGES.length && (
        <Confetti width={width} height={height} recycle={false} />
      )}
      <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
        <Container className="py-8">
          <h1 className="text-2xl text-center text-white sm:text-3xl">
            Mint Your NFT!
          </h1>
          <div className="flex items-center max-w-4xl p-0 mx-auto my-6 bg-white rounded-lg drop-shadow-lg">
            <div className="flex-1 py-10 pl-10 space-y-4">
              {mintStage === MINT_STAGES.length ? (
                <Minted />
              ) : mintStage >= 0 ? (
                <Minting />
              ) : (
                <DetailsForm />
              )}
            </div>
            <div className="overflow-auto transform scale-75 border border-gray-200 shadow-xl rounded-xl">
              <canvas height="448" width="448" ref={canvasRef}></canvas>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
