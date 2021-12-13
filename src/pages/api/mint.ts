import "dotenv/config";
import prisma from "@/lib/prisma";
import FormData from "form-data";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env as Record<string, any>;

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: number;
}

const pinatify = (hash: string): string => `https://gateway.pinata.cloud/ipfs/${hash}`;

async function uploadImageToPinata(dataUrl: string): Promise<string | undefined> {
  const API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
  const stream = Readable.from(buffer);
  const filename = `an-awesome-nft_${Date.now()}.png`;
  (stream as any).path = filename;

  const formData = new FormData();
  formData.append("file", stream);
  formData.append("pinataMetadata", JSON.stringify({ name: filename }));
  formData.append("pinataOptions", JSON.stringify({}));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData as any,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });
    const data = (await response.json()) as PinataResponse;
    return data.IpfsHash;
  } catch (err: any) {
    console.error(err);
    return undefined;
  }
}

async function uploadMetadataToPinata(
  metadata: Record<string, any>,
  ipfsHash: string
): Promise<string> {
  const API_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  const payload = {
    image: pinatify(ipfsHash),
    createdAt: new Date(),
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    ...metadata,
  };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as PinataResponse;
  return data.IpfsHash;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { dataUrl, price, ...metadata } = req.body;

    // Get the currently auth'ed user
    const user = await prisma.user.findUnique({
      where: { publicAddress: metadata.creatorAddress },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    // Upload the image to IPFS and get its hash
    const imageHash = await uploadImageToPinata(dataUrl);
    if (!imageHash) {
      return res.status(500).json({
        error: "An internal server error occured",
      });
    }

    // Upload the metadata to IPFS and get its hash
    let metadataHash: string;
    try {
      metadataHash = await uploadMetadataToPinata(metadata, imageHash);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to upload metadata",
      });
    }

    // Create an entry in the DB for this NFT
    try {
      const nft = await prisma.nft.create({
        data: {
          uri: pinatify(imageHash),
          metadataUri: pinatify(metadataHash),
          onSale: false,
          price,
          ownerId: user.id,
          creatorId: user.id,
          description: metadata.description,
          name: metadata.name,
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
        },
      });
      return res.json({ data: nft });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to create NFT entry in the database",
      });
    }
  }
}
