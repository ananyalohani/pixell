import dotenv from "dotenv";
import FormData from "form-data";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

dotenv.config();
const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const { dataUrl, metadata } = req.body;
    const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
    const stream = Readable.from(buffer);
    const filename = `an-awesome-nft_${Date.now()}.png`;
    (stream as any).path = filename;

    const formData = new FormData();
    formData.append("file", stream);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: filename,
      })
    );
    formData.append("pinataOptions", JSON.stringify({}));

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData as any,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: `${PINATA_API_KEY}`,
          pinata_secret_api_key: `${PINATA_API_SECRET}`,
        },
      });

      res.status(200).json({
        data: await response.json(),
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    }

    res.end();
  }
}
