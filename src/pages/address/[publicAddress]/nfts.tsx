import Container from "@/components/Container";
import NftCard from "@/components/NftCard";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";

type NftWithUser = Nft & { creator: User };

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { publicAddress } = ctx.params!;
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data: user, error: userError } = await fetcher(
    `${NEXT_PUBLIC_BASE_URL}/api/auth?publicAddress=${publicAddress}`
  );
  const { data: nftData, error: nftError } = await fetcher(
    `${NEXT_PUBLIC_BASE_URL}/api/user/${user.id}/nfts`
  );

  console.error(userError || nftError);
  const { createdNFTs, ownedNFTs } = nftData.user;

  const bought = ownedNFTs.filter(
    (nft: NftWithUser) =>
      !createdNFTs.find((createdNft: NftWithUser) => nft.id === createdNft.id)
  );

  return {
    props: {
      nfts: { created: createdNFTs, bought } || null,
      error: userError || nftError || null,
    },
  };
};

interface Props {
  nfts: {
    created: NftWithUser[];
    bought: NftWithUser[];
  };
  error?: string;
}

export default function MyNfts({ nfts, error }: Props) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <section>
      <Container className="py-10">
        <h1 className="text-3xl">Creations</h1>
        <div className="grid grid-cols-4 gap-8 my-8">
          {nfts.created.length > 0 ? (
            nfts.created.map((nft) => <NftCard nft={nft} />)
          ) : (
            <p>Nothing to show here.</p>
          )}
        </div>
      </Container>
      <Container className="py-10">
        <h1 className="text-3xl">Purchases</h1>
        <div className="grid grid-cols-4 gap-8 my-8">
          {nfts.bought.length > 0 ? (
            nfts.bought.map((nft) => <NftCard nft={nft} />)
          ) : (
            <p>Nothing to show here.</p>
          )}
        </div>
      </Container>
    </section>
  );
}
