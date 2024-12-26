"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

interface TokenBalance {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

interface NFTBalance {
  address: string;
  tokenId: string;
  name: string;
  metadata?: {
    name?: string;
    image?: string;
    description?: string;
  }
}

export default function BasicWallet() {
  const { address } = useAccount();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [nftBalances, setNftBalances] = useState<NFTBalance[]>([]);
  const [activeTab, setActiveTab] = useState("tokens");
  const [isLoading, setIsLoading] = useState(false);

  // Standard ERC20 and ERC721 interfaces
  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
  ];

  const ERC721_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function tokenOfOwnerByIndex(address, uint256) view returns (uint256)",
    "function tokenURI(uint256) view returns (string)",
    "function name() view returns (string)"
  ];

  const fetchTokenBalances = async (userAddress: string) => {
    if (!window.ethereum) return;
    
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balances: TokenBalance[] = [];

      // Add your token addresses here
      const tokenAddresses: string[] = [
        // Add your deployed LaunchPaw token addresses
      ];

      for (const tokenAddress of tokenAddresses) {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        
        const [balance, decimals, symbol, name] = await Promise.all([
          contract.balanceOf(userAddress),
          contract.decimals(),
          contract.symbol(),
          contract.name()
        ]);

        if (balance > 0) {
          balances.push({
            address: tokenAddress,
            name,
            symbol,
            decimals,
            balance: balance.toString()
          });
        }
      }

      setTokenBalances(balances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNFTBalances = async (userAddress: string) => {
    if (!window.ethereum) return;
    
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nfts: NFTBalance[] = [];

      // Add your NFT contract addresses here
      const nftAddresses: string[] = [
        // Add your deployed NFT addresses
      ];

      for (const nftAddress of nftAddresses) {
        const contract = new ethers.Contract(nftAddress, ERC721_ABI, provider);
        const balance = await contract.balanceOf(userAddress);
        const name = await contract.name();

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
          let metadata = {};
          
          try {
            const tokenURI = await contract.tokenURI(tokenId);
            if (tokenURI) {
              const response = await fetch(tokenURI);
              metadata = await response.json();
            }
          } catch (error) {
            console.error("Error fetching NFT metadata:", error);
          }

          nfts.push({
            address: nftAddress,
            tokenId: tokenId.toString(),
            name,
            metadata: metadata as any
          });
        }
      }

      setNftBalances(nfts);
    } catch (error) {
      console.error("Error fetching NFT balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      if (activeTab === "tokens") {
        fetchTokenBalances(address);
      } else {
        fetchNFTBalances(address);
      }
    }
  }, [address, activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      {address ? (
        <div className="flex lg:flex-row gap-8">
          <motion.main
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-grow"
          >
            <div className="flex gap-4 mb-8">
              {["tokens", "nfts"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab
                      ? "glass-button"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {tab.toUpperCase()}
                </motion.button>
              ))}
            </div>

            {isLoading ? (
              <motion.div
                className="flex justify-center items-center p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : activeTab === "tokens" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tokenBalances.map((token, index) => (
                  <motion.div
                    key={token.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="token-card"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-xl font-bold">
                          {token.symbol[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{token.name}</h3>
                        <p className="text-sm text-white/60">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-300">
                        {(Number(token.balance) / 10 ** token.decimals).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {tokenBalances.length === 0 && (
                  <p className="text-center text-white/60 col-span-3">No tokens found</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {nftBalances.map((nft, index) => (
                  <motion.div
                    key={`${nft.address}-${nft.tokenId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="token-card"
                  >
                    {nft.metadata?.image && (
                      <img
                        src={nft.metadata.image}
                        alt={nft.metadata.name || nft.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-2">
                      {nft.metadata?.name || nft.name}
                    </h3>
                    <p className="text-sm text-white/60">#{nft.tokenId}</p>
                  </motion.div>
                ))}
                {nftBalances.length === 0 && (
                  <p className="text-center text-white/60 col-span-3">No NFTs found</p>
                )}
              </motion.div>
            )}
          </motion.main>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/60"
        >
          <p className="text-xl">Connect your wallet to view your portfolio</p>
        </motion.div>
      )}
    </div>
  );
}