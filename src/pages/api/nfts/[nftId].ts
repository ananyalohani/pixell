import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get nft by its Id: /nfts/[nftId]
  switch (req.method) {
    case "GET":
      try {
        const nft = await prisma.nft.findUnique({
          include: {
            creator: true,
          },
          where: {
            id: req.query.nftId as string,
          },
        });
        if (!nft) res.status(404).json({ error: "Not Found" });
        res.status(200).json({ data: { nft } });
      } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      return;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }
}
