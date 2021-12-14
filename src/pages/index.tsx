import Hero from "@/components/Hero";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { GetServerSideProps } from "next";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import NftCard from "@/components/NftCard";
import Link from "next/link";

type NftData = Nft & {
  creator: User;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data } = await fetcher<NftData[]>(`${NEXT_PUBLIC_BASE_URL}/api/nfts`);

  return {
    props: {
      nfts:
        data
          ?.filter((item: Nft) => item.onSale)
          .reverse()
          .slice(0, 5) || null,
    },
  };
};

interface Props {
  nfts: NftData[];
}

export default function Home({ nfts }: Props) {
  return (
    <>
      <Hero />
      <Container className="py-10">
        <section className="flex flex-col space-y-8">
          <h1 className="text-2xl">Latest Drops</h1>
          <div className="grid w-full grid-cols-5 gap-4">
            {nfts.map((nft) => (
              <NftCard nft={nft} key={nft.id} />
            ))}
          </div>
          <Link href="/marketplace">
            <Button className="self-end">Go to Marketplace</Button>
          </Link>
        </section>
      </Container>
    </>
  );
}
