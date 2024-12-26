import axios from "axios";
import { PINATA_CONFIG } from "../config/pinata";

export const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_CONFIG.API_KEY,
          pinata_secret_api_key: PINATA_CONFIG.SECRET_KEY,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return `${PINATA_CONFIG.GATEWAY_URL}/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload image to IPFS");
  }
};
