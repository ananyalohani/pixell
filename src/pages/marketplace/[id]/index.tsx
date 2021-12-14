import Button from "@/components/Button";
import Container from "@/components/Container";
import { fetcher } from "@/lib/api";
import { Table, Tbody, Td, Th, Tooltip, Tr, useToast } from "@chakra-ui/react";
import { ClipboardCopyIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { Nft, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { ReactElement, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import { Spinner } from "@chakra-ui/spinner";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!;
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const { data, error } = await fetcher(
    `${NEXT_PUBLIC_BASE_URL}/api/nfts/${id}`
  );

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
    usdPrice: number;
  };
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
        <div className="flex flex-row space-x-16">
          <img
            src={nft.uri}
            className="self-start flex-1 max-w-md rounded-xl drop-shadow-lg"
          />
          <div className="flex flex-col w-full space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl">{nft.name}</h1>
              <div className="flex flex-row items-center space-x-2">
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
            <div className="flex flex-col space-y-4 text-sm text-gray-800">
              <h2 className="text-lg font-semibold">Details</h2>
              <Table size="sm" className="border-collapse">
                <Tbody>
                  <Tr>
                    <Th className="py-4">Creator</Th>
                    <Td className="flex flex-row items-center space-x-2">
                      <code
                        className="address"
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            nft.creator.publicAddress
                          );
                          toast({
                            title: "Address Copied!",
                            description:
                              "The public address of the creator was copied to clipboard.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          });
                        }}
                      >
                        {nft.creator.publicAddress}
                      </code>
                      <ClipboardCopyIcon className="h-4 text-gray-400" />
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
            {!owner ? (
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
