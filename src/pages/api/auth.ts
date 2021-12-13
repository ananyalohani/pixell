import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      if (!req.body.publicAddress) {
        res.status(403).json({
          error: "Unauthorized",
          data: null,
        });
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          publicAddress: req.body.publicAddress,
        },
      });
      if (user) {
        res.status(200).json({
          data: { user },
        });
        return;
      }
      const newUser = await prisma.user.create({
        data: {
          publicAddress: req.body.publicAddress,
        },
      });
      res.status(200).json({
        data: { user: newUser },
      });
      return;

    case "GET":
      const authUser = await prisma.user.findUnique({
        where: {
          publicAddress: req.query.publicAddress as string,
        },
      });
      res.status(200).json({ data: authUser });
      return;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }
}
