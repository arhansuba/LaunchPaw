export const PINATA_CONFIG = {
  API_KEY: import.meta.env.VITE_PINATA_API_KEY,
  SECRET_KEY: import.meta.env.VITE_PINATA_SECRET_API_KEY,
  GATEWAY_URL: "https://pink-absolute-catshark-415.mypinata.cloud/ipfs",
} as const;
