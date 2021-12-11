import dotenv from "dotenv";
import pinataSDK from "@pinata/sdk";

dotenv.config();

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;
const pinata = pinataSDK(PINATA_API_KEY!, PINATA_API_SECRET!);

pinata
  .testAuthentication()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });

export default pinata;
