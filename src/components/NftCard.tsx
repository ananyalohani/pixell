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
      <div className="flex flex-col transition-all bg-white border border-gray-200 rounded-lg cursor-pointer hover:-translate-y-1 hover:drop-shadow group">
        <img src={nft.uri} className="border-b border-gray-200 rounded-t-lg" />
        <div className="w-full p-3 space-y-2">
          <div className="flex flex-row justify-between">
            <h2 className="text-sm font-semibold">{nft.name}</h2>
            <div className="flex flex-row items-center space-x-0">
              <FaEthereum className="h-4 text-purple-500" />
              <p className="text-sm font-medium text-gray-700">{nft.price}</p>
            </div>
          </div>
          <p className="text-xs truncate">
            Creator:{" "}
            <code className="p-1 text-gray-700 bg-gray-200">{nft.creator.publicAddress}</code>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NftCard;
