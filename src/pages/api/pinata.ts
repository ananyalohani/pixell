import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import FormData from "form-data";
import dotenv from "dotenv";
import axios from "axios";
import { Blob } from "node:buffer";
import fs from "fs";

dotenv.config();
const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const { dataUrl } = req.body;
    console.log(typeof dataUrl);

    // const blob = new Blob([req.body]);
    const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
    const stream = Readable.from(buffer);

    const formData = new FormData();
    formData.append("file", stream);
    formData.append("pinataMetadata", JSON.stringify({}));
    formData.append("pinataOptions", JSON.stringify({}));

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: `${PINATA_API_KEY}`,
          pinata_secret_api_key: `${PINATA_API_SECRET}`,
        },
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }

    res.end();
  }
}
