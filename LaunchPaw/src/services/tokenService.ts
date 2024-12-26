import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import { TokenFactoryABI } from "../abi";
import { CONTRACT_ADDRESSES } from "../config/contracts";

export const useTokenService = () => {
  const { data: walletClient } = useWalletClient();

  const createToken = async (
    name: string,
    symbol: string,
    imageUrl: string,
    description: string
  ) => {
    if (!walletClient) throw new Error("Wallet not connected");

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_FACTORY,
        TokenFactoryABI,
        signer
      );

      const tx = await contract.createMemeToken(
        name,
        symbol,
        imageUrl,
        description // 0.1 AVAX for token creation
      );

      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  };

  const buyToken = async (tokenAddress: string, amount: string) => {
    if (!walletClient) throw new Error("Wallet not connected");

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_FACTORY,
        TokenFactoryABI,
        signer
      );

      const tx = await contract.buyMemeToken(
        tokenAddress,
        ethers.parseEther(amount),
        { value: ethers.parseEther(amount) }
      );

      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error buying token:", error);
      throw error;
    }
  };

  const sellToken = async (tokenAddress: string, amount: string) => {
    if (!walletClient) throw new Error("Wallet not connected");

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_FACTORY,
        TokenFactoryABI,
        signer
      );

      const tx = await contract.sellMemeToken(
        tokenAddress,
        ethers.parseEther(amount)
      );

      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error selling token:", error);
      throw error;
    }
  };

  return {
    createToken,
    buyToken,
    sellToken,
  };
};
