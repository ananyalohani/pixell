import Hero from "@/components/Hero";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { GetServerSideProps } from "next";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import NftCard from "@/components/NftCard";
import Link from "next/link";

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

export default function Home({ nfts }: Props) {
  return (
    <>
      <Hero />
      <Container className="py-10">
        <section className="flex flex-col space-y-8">
          <h1 className="text-2xl">Latest Drops</h1>
          <div className="grid w-full grid-cols-5 gap-4">
            {nfts.slice(4).map((nft) => (
              <NftCard nft={nft} />
            ))}
          </div>
          <Link passHref href="/marketplace">
            <Button className="self-end">Go to Marketplace</Button>
          </Link>
        </section>
      </Container>
    </>
  );
}
