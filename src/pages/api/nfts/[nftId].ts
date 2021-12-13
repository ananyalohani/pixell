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
        return res.status(200).json({ data: { nft } });
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

    case "PATCH":
      try {
        const nft = await prisma.nft.update({
          where: { id: req.query.nftId as string },
          data: req.body,
        });
        return res.json({ data: nft });
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }
}
