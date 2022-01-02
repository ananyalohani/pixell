import { Nft, User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { FaEthereum } from "react-icons/fa";

interface Props {
  nft: Nft & {
    creator: User;
  };
}

const NftCard = ({ nft }: Props) => {
  return (
    <Link href={`/marketplace/${nft.id}`} passHref>
      <div className="flex flex-col transition-all bg-white border border-gray-300 rounded-lg cursor-pointer group hover:-translate-y-1 hover:drop-shadow">
        <div className="relative overflow-hidden border-b border-gray-200 rounded-t-lg">
          <img
            src={`https://cloudflare-ipfs.com/ipfs/${nft.uri.split("/").pop()}`}
          />
          {!nft.onSale && (
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full transition-opacity bg-white select-none bg-opacity-80 group-hover:opacity-0">
              <div className="transform -rotate-12">
                <span className="px-2 py-1 text-2xl font-black text-red-400 bg-red-100 border-8 border-red-300 rounded-lg">
                  SOLD
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-full p-3 space-y-2">
          <div className="flex flex-row justify-between">
            <h2 className="text-sm font-semibold">{nft.name}</h2>
            {nft.onSale && (
              <div className="flex flex-row items-center space-x-0">
                <FaEthereum className="h-4 text-purple-500" />
                <p className="text-sm font-medium text-gray-700">{nft.price}</p>
              </div>
            )}
          </div>
          <p className="text-xs truncate">
            Creator:{" "}
            <code className="p-1 text-gray-700 bg-gray-200">
              {nft.creator.publicAddress}
            </code>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NftCard;
