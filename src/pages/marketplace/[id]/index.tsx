import Button from "@/components/Button";
import Container from "@/components/Container";
import { fetcher } from "@/lib/api";
import { Table, Tbody, Td, Th, Tooltip, Tr, useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { CollectionIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { Nft, User } from "@prisma/client";
import { useEthers } from "@usedapp/core";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";

type NftData = Nft & {
  creator: User;
  owner: User;
  usdPrice: number;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!;
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data, error } = await fetcher<NftData>(
    `${NEXT_PUBLIC_BASE_URL}/api/nfts/${id}`
  );

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
  // @ts-ignore
  data.usdPrice = jsonRes[0].current_price * data.price;

  return {
    props: {
      nft: data,
    },
  };
};

interface Props {
  nft: NftData;
}

export default function NftPage({ nft }: Props): ReactElement {
  const [owner, setOwner] = useState<User>();
  const toast = useToast();
  const { query } = useRouter();
  const { account } = useEthers();

  useEffect(() => {
    if (account) {
      fetcher<User>(`/api/auth?publicAddress=${account}`)
        .then(({ data, error }) => {
          if (error || !data) throw new Error(error);
          setOwner(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [account]);

  return (
    <section>
      <Container className="py-16">
        <div className="flex flex-col space-y-16 lg:space-y-0 lg:space-x-16 lg:flex-row">
          <img
            src={nft.uri}
            className="self-start flex-1 max-w-md rounded-xl drop-shadow-lg"
          />
          <div className="flex flex-col w-full space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl">{nft.name}</h1>
              <div className="flex flex-row items-center space-x-2">
                {!nft.onSale && (
                  <span className="px-3 text-lg font-bold text-red-400 border-2 border-red-200 rounded-md bg-red-50 py-1/2">
                    SOLD
                  </span>
                )}
                <FaEthereum className="h-10 text-purple-500" />
                <p className="text-2xl font-bold">{nft.price}</p>
                <p className="text-gray-500 ">
                  (
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(nft.usdPrice)}
                  )
                </p>
              </div>
              <p className="text-sm italic text-gray-800">{nft.description}</p>
            </div>
            <div className="flex flex-col space-y-4 overflow-auto text-sm text-gray-800">
              <h2 className="text-lg font-semibold">Details</h2>
              <Table size="sm" className="border-collapse">
                <Tbody>
                  <Tr>
                    <Th>Creator</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      <Tooltip
                        label="View User's Collection"
                        hasArrow
                        fontSize="sm"
                      >
                        <code className="address">
                          <Link
                            href={`/address/${nft.creator.publicAddress}/nfts`}
                          >
                            {nft.creator.publicAddress}
                          </Link>
                        </code>
                      </Tooltip>
                      <CollectionIcon className="h-4 text-gray-400" />
                    </Td>
                  </Tr>
                  <Tr>
                    <Th className="py-4">Owner</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      <Tooltip
                        label="View User's Collection"
                        hasArrow
                        fontSize="sm"
                      >
                        <code className="address">
                          <Link
                            href={`/address/${nft.owner.publicAddress}/nfts`}
                          >
                            {nft.owner.publicAddress}
                          </Link>
                        </code>
                      </Tooltip>
                      <CollectionIcon className="h-4 text-gray-400" />
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Contract Address</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      <Tooltip label="View on Etherscan" hasArrow fontSize="sm">
                        <code className="address">
                          <a
                            href={`https://ropsten.etherscan.io/address/${nft.contractAddress}`}
                            target="_blank"
                            rel="noopener"
                          >
                            {nft.contractAddress}
                          </a>
                        </code>
                      </Tooltip>
                      <ExternalLinkIcon className="h-4 text-gray-400" />
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Token ID</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      {nft.tokenId}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Created At</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      {new Date(nft.createdAt).toLocaleString("en-IN")}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Token Standard</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      ERC-721 URI Storage
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Network</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      Ropsten
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
            {!nft.onSale ? (
              <Button disabled>Sold</Button>
            ) : !owner ? (
              <Spinner />
            ) : (
              owner!.id !== nft.ownerId && (
                <Link href={`/marketplace/${query.id}/buy`}>
                  <Button>Buy</Button>
                </Link>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
