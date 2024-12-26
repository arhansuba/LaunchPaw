import React, { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { TokenFactoryABI, TokenABI } from "../abi";
import Chatbot from "../components/ChatBot";

interface TokenData {
  name: string;
  symbol: string;
  tokenImageUrl: string;
  tokenAddress: string;
  price: string;
  priceChange: number;
  volume: string;
  marketCap: string;
  holders: number;
}

const Rankings = () => {
  const { data: walletClient } = useWalletClient();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [stats, setStats] = useState({
    topGainer: 0,
    activeTraders: 0,
    tradingVolume: "0",
  });

  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletClient) return;

      try {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESSES.TOKEN_FACTORY,
          TokenFactoryABI,
          signer
        );

        // Get total number of tokens
        const tokenCount = await contract.getMemeTokenCount();
        const tokenDataPromises = [];

        // Fetch data for each token
        for (let i = 0; i < tokenCount; i++) {
          tokenDataPromises.push(fetchTokenData(contract, i, signer));
          console.log("tokenDataPromises", tokenDataPromises);
        }
        console.log("tokenDataPromises", tokenDataPromises);
        const fetchedTokens = await Promise.all(tokenDataPromises);
        console.log("fetchedTokens", fetchedTokens);
        // Sort tokens by market cap
        const sortedTokens = fetchedTokens.sort(
          (a, b) => Number(b.marketCap) - Number(a.marketCap)
        );

        setTokens(sortedTokens);

        // Calculate statistics
        const topGainer = Math.max(...sortedTokens.map((t) => t.priceChange));
        const totalVolume = sortedTokens.reduce(
          (acc, t) => acc + Number(t.volume),
          0
        );
        const uniqueTraders = new Set(sortedTokens.flatMap((t) => t.holders))
          .size;

        setStats({
          topGainer,
          activeTraders: uniqueTraders,
          tradingVolume: totalVolume.toString(),
        });
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [walletClient]);

  const fetchTokenData = async (
    contract: ethers.Contract,
    index: number,
    signer: ethers.Signer
  ): Promise<TokenData> => {
    const [
      name,
      symbol,
      description,
      tokenImageUrl,
      fundingRaised,
      tokenAddress,
      creatorAddress,
      isLiquidityCreated,
      holders,
    ] = await contract.getMemeTokenByIndex(index);

    console.log("name", name);
    console.log("symbol", symbol);
    console.log("description", description);
    console.log("tokenImageUrl", tokenImageUrl);
    console.log("fundingRaised", fundingRaised);
    console.log("tokenAddress", tokenAddress);
    console.log("creatorAddress", creatorAddress);
    console.log("isLiquidityCreated", isLiquidityCreated);

    const tokenContract = new ethers.Contract(tokenAddress, TokenABI, signer);
    // Get additional token info
    const price = 0.0001; // Placeholder price
    const totalMinted = await tokenContract.totalSupply();
    console.log("price", price);
    console.log("holders", holders);
    console.log("totalMinted", totalMinted);
    // Calculate market cap
    const marketCap = (price * Number(totalMinted)).toString();

    console.log("marketCap", marketCap);
    // Mock price change and volume for now
    // In production, these would come from an oracle or historical data
    const priceChange = Math.random() * 20 * (Math.random() > 0.5 ? 1 : -1);
    console.log("priceChange", priceChange);
    const volume = (Number(marketCap) * (Math.random() * 0.2)).toString();
    console.log("volume", volume);
    console.log(
      name,
      symbol,
      tokenImageUrl,
      tokenAddress,
      price,
      priceChange,
      volume,
      marketCap,
      Number(holders)
    );
    return {
      name,
      symbol,
      tokenImageUrl,
      tokenAddress,
      price: price.toString(),
      priceChange,
      volume,
      marketCap,
      holders: Number(holders),
    };
  };

  const formatNumber = (
    value: string | number,
    decimals: number = 2
  ): string => {
    const num = Number(value);
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Token Rankings
        </h1>
        <p className="text-gray-400">
          Discover the top performing meme tokens on MemeVerse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-medium">Top Gainers</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">
            +{stats.topGainer.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-400">24h Best Performance</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium">Active Traders</h3>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {stats.activeTraders}
          </div>
          <p className="text-sm text-gray-400">Last 24 hours</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium">Trading Volume</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {formatNumber(stats.tradingVolume)}
          </div>
          <p className="text-sm text-gray-400">24h Volume</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Top Tokens</h2>
          <div className="flex space-x-2">
            {(["24h", "7d", "30d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  timeframe === t
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="pb-4 pl-4">#</th>
                <th className="pb-4">Token</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">24h Change</th>
                <th className="pb-4">Volume</th>
                <th className="pb-4">Market Cap</th>
                <th className="pb-4">Holders</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr
                  key={token.tokenAddress}
                  className="border-t border-gray-800 hover:bg-white/5 transition cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/token/${token.tokenAddress}`)
                  }
                >
                  <td className="py-4 pl-4">{index + 1}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      {token.tokenImageUrl ? (
                        <img
                          src={token.tokenImageUrl}
                          alt={token.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-gray-400">
                          {token.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{formatNumber(token.price, 6)}</td>
                  <td
                    className={`py-4 ${
                      token.priceChange > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {token.priceChange > 0 ? "+" : ""}
                    {token.priceChange.toFixed(1)}%
                  </td>
                  <td className="py-4">{formatNumber(token.volume)}</td>
                  <td className="py-4">{formatNumber(token.marketCap)}</td>
                  <td className="py-4">{token.holders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Rankings;
