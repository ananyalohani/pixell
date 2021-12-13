import Container from "@/components/Container";
import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import { DuplicateIcon } from "@heroicons/react/outline";
import { FaEthereum } from "react-icons/fa";
import Button from "@/components/Button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!;
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data, error } = await fetcher(`${NEXT_PUBLIC_BASE_URL}/api/nfts/${id}`);
  console.log(data, error);

  if (error) {
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
    usdPrice: number;
  };
}

export default function NftPage({ nft }: Props): ReactElement {
  return (
    <section>
      <Container className="py-16">
        <div className="flex flex-row space-x-16">
          <img src={nft.uri} className="flex-1 max-w-md rounded-xl drop-shadow-lg" />
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl">NFT Name</h1>
            <div className="flex flex-row items-center space-x-2">
              <FaEthereum className="h-10 text-purple-500" />
              <p className="text-2xl font-bold">{nft.price}</p>
              <p className="text-gray-500 ">
                (
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD" }).format(
                  nft.usdPrice
                )}
                )
              </p>
            </div>
            <div className="flex flex-col space-y-1 text-sm text-gray-800">
              <h2 className="text-lg font-semibold">Description</h2>
              <div className="">
                Enim eu ullamco sit consequat laboris esse ex. Aliqua labore veniam commodo id eu
                dolore esse pariatur. Consectetur labore eiusmod cupidatat ex nostrud excepteur
                Lorem consectetur in. In consectetur reprehenderit sunt exercitation duis. Enim
                ipsum ut eu quis non cupidatat duis eu deserunt dolore elit. Eu ea reprehenderit
                aliqua nostrud reprehenderit nisi nulla duis velit ut sint esse.
              </div>
            </div>
            <div className="flex flex-col space-y-1 text-sm text-gray-800">
              <h2 className="text-lg font-semibold">Details</h2>
              <div className="flex flex-row items-center space-x-2">
                <p>Creator: </p>
                <code
                  className="p-1 bg-gray-100 rounded cursor-pointer hover:underline"
                  onClick={() => {
                    window.navigator.clipboard.writeText(nft.creator.publicAddress);
                  }}
                >
                  {nft.creator.publicAddress}
                </code>
                <DuplicateIcon className="h-4 text-gray-400" />
              </div>
            </div>
            <Button>Buy</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
