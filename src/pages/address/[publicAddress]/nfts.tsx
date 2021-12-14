import Container from "@/components/Container";
import NftCard from "@/components/NftCard";
import { fetcher } from "@/lib/api";
import { Nft, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import React from "react";
import { Table, Tbody, Td, Th, Tooltip, Tr, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { ClipboardCopyIcon } from "@heroicons/react/solid";

type NftWithUser = Nft & { creator: User };
type NftData = {
  created: NftWithUser[];
  bought: NftWithUser[];
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { publicAddress } = ctx.params!;
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data: user, error: userError } = await fetcher<User>(
    `${NEXT_PUBLIC_BASE_URL}/api/auth?publicAddress=${publicAddress}`
  );
  const { data: nftData, error: nftError } = await fetcher(
    `${NEXT_PUBLIC_BASE_URL}/api/user/${user?.id}/nfts`
  );

  console.error(userError || nftError);
  const { createdNFTs, ownedNFTs } = nftData;

  const bought = ownedNFTs.filter(
    (nft: NftWithUser) => nft.creatorId !== nft.ownerId
  );

  return {
    props: {
      userId: nftData.id,
      publicAddress: nftData.publicAddress,
      nfts:
        { created: createdNFTs.reverse(), bought: bought.reverse() } || null,
      error: userError || nftError || null,
    },
  };
};

interface Props {
  userId: string;
  publicAddress: string;
  nfts: NftData;
  error?: string;
}

export default function MyNfts({ userId, publicAddress, nfts, error }: Props) {
  const toast = useToast();

  return (
    <section>
      <Container className="py-8">
        <h1 className="mb-6 text-2xl">User Details</h1>
        <Table size="sm" className="border-collapse" width="container.sm">
          <Tbody>
            <Tr>
              <Th className="py-4">Public Address</Th>
              <Td className="flex flex-row items-center space-x-2">
                <code
                  className="address"
                  onClick={() => {
                    window.navigator.clipboard.writeText(publicAddress);
                    toast({
                      title: "Address Copied!",
                      description:
                        "The public address of the user was copied to clipboard.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  {publicAddress}
                </code>
                <ClipboardCopyIcon className="h-4 text-gray-400" />
              </Td>
            </Tr>
            <Tr>
              <Th className="py-4">Total Creations</Th>
              <Td className="flex flex-row items-center space-x-2">
                {nfts.created.length}
              </Td>
            </Tr>
            <Tr>
              <Th className="py-4">Total Purchases</Th>
              <Td className="flex flex-row items-center space-x-2">
                {nfts.bought.length}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Container>
      <Container className="py-8">
        <h1 className="text-2xl">Creations</h1>
        <div className="grid grid-cols-4 gap-8 mt-8">
          {nfts.created.length > 0 ? (
            nfts.created.map((nft) => <NftCard nft={nft} key={nft.id} />)
          ) : (
            <p>Nothing to show here.</p>
          )}
        </div>
      </Container>
      <Container className="py-8">
        <h1 className="text-2xl">Purchases</h1>
        <div className="grid grid-cols-4 gap-8 my-8">
          {nfts.bought.length > 0 ? (
            nfts.bought.map((nft) => <NftCard nft={nft} key={nft.id} />)
          ) : (
            <p>Nothing to show here.</p>
          )}
        </div>
      </Container>
    </section>
  );
}
