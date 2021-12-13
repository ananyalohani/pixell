import Container from "@/components/Container";
import NftCard from "@/components/NftCard";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data } = await fetcher(`${NEXT_PUBLIC_BASE_URL}/api/nfts`);

  return {
    props: {
      nfts: data?.nfts ?? null,
    },
  };
};

interface Props {
  nfts: (Nft & {
    creator: User;
  })[];
}

export default function Marketplace({ nfts }: Props) {
  useEffect(() => {
    console.log(nfts);
  });

  return (
    <section>
      <Container className="py-10">
        <h1 className="text-3xl">MarketPlace</h1>
        <div className="grid grid-cols-4 gap-8 my-8">
          {nfts.map((nft) => (
            <NftCard nft={nft} />
          ))}
        </div>
      </Container>
    </section>
  );
}
