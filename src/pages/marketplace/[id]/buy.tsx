import Button from "@/components/Button";
import Container from "@/components/Container";
import { fetcher } from "@/lib/api";
import { Spinner, useToast } from "@chakra-ui/react";
import { Contract } from "@ethersproject/contracts";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { Nft, User } from "@prisma/client";
import {
  TransactionStatus,
  useContractFunction,
  useEthers,
} from "@usedapp/core";
import { utils } from "ethers";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import pixellContract from "../../../../hardhat/artifacts/contracts/NFT.sol/PixellNFT.json";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!;
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data, error } = await fetcher(
    `${NEXT_PUBLIC_BASE_URL}/api/nfts/${id}`
  );

  console.log(error);

  if (error || !data?.nft.onSale) {
    return {
      notFound: true,
    };
  }

  // Convert ETH to USD
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum"
  );
  const jsonRes = (await res.json()) as any[];
  data.nft.usdPrice = jsonRes[0].current_price * data.nft.price;

  return {
    props: {
      nft: data.nft,
    },
  };
};

interface Props {
  nft: Nft & {
    creator: User;
    owner: User;
    usdPrice: number;
  };
}

const BUY_STAGES = [
  "Confirming transaction",
  "Getting account details",
  "Buying the NFT",
  "Disabling buying on the NFT",
  "Updating the database entry for the token",
];

export default function BuyNft({ nft }: Props): ReactElement<Props> {
  const [buyStage, setBuyStage] = useState<number>(0);
  const [errorStage, setErrorStage] = useState<number>();
  const buyStateRef = useRef<TransactionStatus>();
  const disallowBuyStateRef = useRef<TransactionStatus>();
  const { width, height } = useWindowSize();
  const { replace, query } = useRouter();
  const toast = useToast();

  const wethInterface = new utils.Interface(pixellContract.abi);
  const wethContractAdress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
  const contract = new Contract(wethContractAdress, wethInterface);
  const { state: buyState, send: buyNft } = useContractFunction(
    contract,
    "buyNFT"
  );
  const { state: disallowBuyState, send: disallowBuy } = useContractFunction(
    contract,
    "disallowBuy"
  );
  const { account } = useEthers();

  useEffect(() => {
    if (account === nft.owner.publicAddress) {
      replace(`/marketplace/${query.id}`);
      return;
    }
  }, [account]);

  buyStateRef.current = buyState;
  disallowBuyStateRef.current = disallowBuyState;

  const handleBuy = async () => {
    setBuyStage(1);
    let user: User;

    // Getting account details
    try {
      const { data, error } = await fetcher(
        `/api/auth?publicAddress=${account}`
      );
      if (error || !data) throw new Error(error);
      user = data;
      console.log({ user });
      setBuyStage(2);
    } catch (err: any) {
      setErrorStage(1);
      toast({
        status: "error",
        title: "An error occured!",
        description: err.message,
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create the buy transaction
    try {
      await buyNft(nft.tokenId, {
        value: utils.parseEther(nft.price.toString()),
      });
      if (buyStateRef.current!.status === "Success") setBuyStage(3);
      else throw new Error("Could not create buy transaction");
    } catch (err: any) {
      setErrorStage(2);
      toast({
        status: "error",
        title: "An error occured!",
        description: err.message,
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Disallow buying the NFT again
    try {
      await disallowBuy(nft.tokenId);
      if (disallowBuyStateRef.current!.status === "Success") setBuyStage(4);
      else throw new Error("Could not create disallow buy transaction");
    } catch (err: any) {
      setErrorStage(3);
      toast({
        status: "error",
        title: "An error occured!",
        description: err.message,
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update database to reflect onSale: false
    try {
      await fetcher(`/api/nfts/${nft.id}`, "PATCH", {
        onSale: false,
        ownerId: user!.id,
      });
      setBuyStage(5);
    } catch (err: any) {
      setErrorStage(4);
      toast({
        status: "error",
        title: "An error occured!",
        description: err.message,
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };

  const Buying: React.FC = () => (
    <>
      <div className="space-y-5 ">
        <h2 className="text-2xl">Buying '{nft.name}'...</h2>
        <div>
          <p className="text-sm leading-relaxed text-gray-600">
            This NFT costs{" "}
            <strong>
              ETH {nft.price} (~
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(nft.usdPrice)}
              )
            </strong>
            , plus the accompanying gas fees.
          </p>
        </div>
        {buyStage === 0 && (
          <div className="pb-10 space-y-2">
            <p className="leading-relaxed text-gray-600">
              Are you sure you want to continue with this purchase?
            </p>
            <div className="flex w-full gap-3">
              <Button className="flex-1" onClick={handleBuy}>
                Yep, let's buy!
              </Button>
              <Link href={`/marketplace/${nft!.id}`}>
                <Button className="flex-1">Nah, take me back</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-5">
        {BUY_STAGES.map((label, step) => {
          if (errorStage === step) {
            return (
              <div key={step} className="flex items-center gap-2">
                <XCircleIcon className="w-6 h-6 text-red-300" />
                <span className="leading-relaxed text-red-700">{label}</span>
              </div>
            );
          }
          if (buyStage > step) {
            return (
              <div key={step} className="flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-green-300" />
                <span className="leading-relaxed text-green-700">{label}</span>
              </div>
            );
          }
          if (buyStage === step) {
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

  const Bought = () => (
    <>
      <div className="space-y-5 ">
        <h2 className="text-2xl">'{nft.name}' bought! 🎉</h2>
        <div>
          <p className="text-sm leading-relaxed text-gray-600">
            You have successfully purchased this NFT. It's all yours now ;)
          </p>
        </div>
      </div>
      <div className="space-y-5">
        {BUY_STAGES.map((label, step) => (
          <div key={step} className="flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-green-300" />
            <span className="leading-relaxed text-green-700">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-5">
        <Link href={`/address/${account}/nfts`}>
          <Button className="flex-1">View your purchases</Button>
        </Link>
        <Link href={`/marketplace`}>
          <Button className="flex-1">Go back to the Marketplace</Button>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {buyStage === BUY_STAGES.length && (
        <Confetti width={width} height={height} recycle={false} />
      )}
      <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
        <Container className="py-8">
          <h1 className="text-2xl text-center text-white sm:text-3xl">
            Buy that NFT!
          </h1>
          <div className="flex items-center max-w-4xl p-0 mx-auto my-6 bg-white rounded-lg drop-shadow-lg">
            <div className="flex-1 py-10 pl-10 space-y-4">
              {buyStage === BUY_STAGES.length ? <Bought /> : <Buying />}
            </div>
            <div className="overflow-auto transform scale-75 border border-gray-200 shadow-xl rounded-xl">
              <img
                src={nft.uri}
                className="self-start flex-1 max-w-md rounded-xl drop-shadow-lg"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
