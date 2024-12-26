import React, { useEffect, useState } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Twitter,
} from "lucide-react";
import { useAccount, useWalletClient } from "wagmi";
import { formatEther } from "viem";
import { ethers } from "ethers";
import { TokenFactoryABI } from "../abi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { Link, useNavigate } from "react-router-dom";
import Chatbot from "../components/ChatBot";

interface MemeToken {
  name: string;
  symbol: string;
  description: string;
  tokenImageUrl: string;
  fundingRaised: bigint;
  tokenAddress: string;
  creatorAddress: string;
  isLiquidityCreated: boolean;
  price?: string;
  marketCap?: string;
  priceChange?: number;
}

const Marketplace = () => {
  const { data: walletClient } = useWalletClient();
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletClient) return;

      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESSES.TOKEN_FACTORY,
          TokenFactoryABI,
          signer
        );

        const tokenCount = await contract.getMemeTokenCount();
        const fetchedTokens = [];

        for (let i = 0; i < tokenCount; i++) {
          const memeToken = await contract.getMemeTokenByIndex(i);
          // Add mock price data
          fetchedTokens.push({
            name: memeToken[0],
            symbol: memeToken[1],
            description: memeToken[2],
            tokenImageUrl: memeToken[3],
            fundingRaised: memeToken[4],
            tokenAddress: memeToken[5],
            creatorAddress: memeToken[6],
            isLiquidityCreated: memeToken[7],
            price: "0.000033",
            marketCap: "7.3k",
            priceChange: Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1),
          });
        }

        setTokens(fetchedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [walletClient]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Marketplace
        </h1>
        <p className="text-gray-400">
          Discover and trade the latest meme tokens
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
            Latest
          </button>
          <button className="px-6 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
            Trending
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTokens.map((token) => (
            <div
              key={token.tokenAddress}
              onClick={() => navigate(`/token/${token.tokenAddress}`)}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/10 transition cursor-pointer"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={token.tokenImageUrl || "https://via.placeholder.com/400"}
                  alt={token.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg px-3 py-1 text-sm">
                  <div className="flex items-center gap-1">
                    {(token.priceChange ?? 0) > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={
                        (token.priceChange ?? 0) > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {Math.abs(token.priceChange ?? 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{token.name}</h3>
                    <div className="text-sm text-gray-400">${token.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">${token.price}</div>
                    <div className="text-sm text-gray-400">
                      MC: ${token.marketCap}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {token.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Twitter className="h-4 w-4" />
                  </div>
                  <div>{formatEther(token.fundingRaised)} AVAX</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Chatbot />
    </div>
  );
};

export default Marketplace;
