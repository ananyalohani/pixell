import Container from "@/components/Container";
import NftCard from "@/components/NftCard";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import React from "react";

type NftData = Nft & {
  creator: User;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data } = await fetcher<NftData[]>(`${NEXT_PUBLIC_BASE_URL}/api/nfts`);

  return {
    props: {
      nfts: data?.filter((item: Nft) => item.onSale).reverse() || null,
    },
  };
};

interface Props {
  nfts: NftData[];
}

export default function Marketplace({ nfts }: Props) {
  return (
    <section>
      <Container className="py-10">
        <h1 className="text-3xl">MarketPlace</h1>
        <div className="grid grid-cols-2 gap-4 my-8 sm:grid-cols-4 sm:gap-8">
          {nfts.map((nft) => (
            <NftCard nft={nft} key={nft.id} />
          ))}
        </div>
      </Container>
    </section>
  );
}
