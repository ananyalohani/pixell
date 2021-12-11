import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import FormData from "form-data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const buffer = Buffer.from(req.body, "binary");
    const stream = Readable.from(buffer);
    const formData = new FormData();
    formData.append("file", req.body);
    formData.append("pinataOptions", JSON.stringify({}));
    res.end();
  }
}
