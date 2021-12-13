import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get all nfts: /nfts
  switch (req.method) {
    case "GET":
      try {
        const nfts = await prisma.nft.findMany({
          include: {
            creator: true,
          },
        });
        res.status(200).json({ data: { nfts } });
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
