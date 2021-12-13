import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get user by Id: /user/[userId]
  switch (req.method) {
    case "GET":
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.query.userId as string,
          },
        });
        res.status(200).json({ data: { user } });
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
