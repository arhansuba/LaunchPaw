import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { ArrowLeft, Star, Copy, MessageSquare, History } from "lucide-react";
import { TokenFactoryABI, TokenABI } from "../abi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { Address } from "viem";
import BondingCurveProgress from "../components/BondingCurveProgress";
import PriceChart from "../components/PriceChart";
import { useAccount } from "wagmi";
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
  virtualLiquidity?: string;
  volume24h?: string;
  tokensCreated?: string;
  holders?: number;
  priceChange?: number;
}

const COMMENTS = [
  {
    author: "0x1234...5678",
    content: "Great project! Love the tokenomics and the team behind it.",
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
  },
  {
    author: "0x8765...4321",
    content:
      "The bonding curve mechanism is really innovative. Looking forward to seeing how this grows!",
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
  },
  {
    author: "0x9876...5432",
    content: "Just bought some tokens. The community is amazing!",
    timestamp: Date.now() - 3600000 * 8, // 8 hours ago
  },
  {
    author: "0x3456...7890",
    content: "This could be the next big thing in the meme token space.",
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
  },
];

interface Comment {
  author: string;
  content: string;
  timestamp: number;
}

const MemePage = () => {
  const [comments, setComments] = useState<Comment[]>(COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const { tokenAddress } = useParams();
  const { data: walletClient } = useWalletClient();
  const [token, setToken] = useState<MemeToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [cost, setCost] = useState("");
  const { address: userAddress, isConnected } = useAccount();
  const handlePostComment = () => {
    if (!isConnected || !newComment.trim()) return;

    setIsPostingComment(true);

    // Add new comment to the list
    const newCommentObj: Comment = {
      author: userAddress || "0x0000...0000",
      content: newComment.trim(),
      timestamp: Date.now(),
    };

    setComments((prevComments) => [newCommentObj, ...prevComments]);
    setNewComment("");
    setIsPostingComment(false);
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const [activeTab, setActiveTab] = useState<"comments" | "history">(
    "comments"
  );

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!walletClient || !tokenAddress) return;

      try {
        console.log(tokenAddress);
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESSES.TOKEN_FACTORY,
          TokenFactoryABI,
          signer
        );

        const tokenContract = new ethers.Contract(
          tokenAddress,
          TokenABI,
          signer
        );
        const totalSupply = await tokenContract.totalSupply();
        setTotalSupply(totalSupply.toString());
        console.log("Total supply:", totalSupply.toString());

        const cost = await contract.getCost(totalSupply, 1);

        // Mock data for demonstration
        const mockData = {
          price: "0.000033",
          marketCap: "7k",
          virtualLiquidity: "13k",
          volume24h: "245.21",
          tokensCreated: "5",
          holders: 3,
          priceChange: 3.92,
          tokenAddress,
        };

        const tokenData = await contract.addressToMemeTokenMapping(
          tokenAddress
        );
        console.log("Token data:", tokenData);
        const data: MemeToken = {
          name: tokenData[0],
          symbol: tokenData[1],
          description: tokenData[2],
          tokenImageUrl: tokenData[3],
          fundingRaised: tokenData[4],
          tokenAddress: tokenData[5],
          creatorAddress: tokenData[6],
          isLiquidityCreated: tokenData[7],
        };
        setToken({
          ...data,
          ...mockData,
        });

        setCost(cost.toString());
        console.log("Cost:", cost.toString());
      } catch (error) {
        console.error("Error fetching token details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDetails();
  }, [walletClient, tokenAddress]);

  if (isLoading || !token || !token.tokenAddress) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    if (!address || address.length < 42) return address;
    const prefix = address.substring(0, 6);
    const suffix = address.substring(address.length - 4);
    return `${prefix}...${suffix}`;
  };

  const handleBuy = async () => {
    if (!walletClient || !tokenAddress || !buyAmount || !token) return;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.TOKEN_FACTORY,
      TokenFactoryABI,
      signer
    );

    // function buyMemeToken(address memeTokenAddress, uint tokenQty)
    const tx = await contract.buyMemeToken(token.tokenAddress, buyAmount);
    await tx.wait();

    // Implement buy functionality
    console.log("Buying:", buyAmount);
  };

  const handleSell = async () => {
    if (!walletClient || !tokenAddress || !buyAmount || !token) return;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.TOKEN_FACTORY,
      TokenFactoryABI,
      signer
    );

    // function sellMemeToken(address memeTokenAddress, uint tokenQty)
    const tx = await contract.sellMemeToken(token.tokenAddress, buyAmount, {
      gasLimit: 1000000,
    });
    await tx.wait();

    // Implement buy functionality
    console.log("Selling:", buyAmount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/marketplace"
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-start gap-6">
              <img
                src={token.tokenImageUrl || "https://via.placeholder.com/150"}
                alt={token.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{token.name}</h1>
                  <button className="p-1 hover:bg-white/10 rounded-lg">
                    <Star className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-gray-400">${token.symbol}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">
                      Contract
                    </span>
                    <span className="text-gray-400">
                      {formatAddress(token.tokenAddress)}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(token.tokenAddress)
                      }
                    >
                      <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-gray-300">{token.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Price</div>
              <div className="text-lg font-semibold">${token.price}</div>
              <div className="text-sm text-green-400">
                +{token.priceChange}%
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Market Cap</div>
              <div className="text-lg font-semibold">${token.marketCap}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">
                Virtual Liquidity
              </div>
              <div className="text-lg font-semibold">
                ${token.virtualLiquidity}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">24H Volume</div>
              <div className="text-lg font-semibold">${token.volume24h}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Token Created</div>
              <div className="text-lg font-semibold">{token.tokensCreated}</div>
            </div>
          </div>
          <PriceChart
            currentPrice={token.price || "0.000033"}
            tokenSymbol={token.symbol}
          />
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "comments" ? "bg-purple-500" : "bg-white/10"
                }`}
                onClick={() => setActiveTab("comments")}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </div>
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "history" ? "bg-purple-500" : "bg-white/10"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Trading History
                </div>
              </button>
            </div>

            {activeTab === "comments" ? (
              <div className="space-y-4">
                {isConnected ? (
                  <>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full bg-black/20 rounded-xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {500 - newComment.length} characters remaining
                      </span>
                      <button
                        onClick={handlePostComment}
                        disabled={isPostingComment || !newComment.trim()}
                        className="px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPostingComment ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 bg-white/5 rounded-xl">
                    <p className="text-gray-400">
                      Please connect your wallet to post comments
                    </p>
                  </div>
                )}
                <div className="mt-6 space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="bg-black/20 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-400">
                            {formatAddress(comment.author)}
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400">No comments yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-400">
                  No trading history available
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/4 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Trade</h2>
              <div className="text-sm text-gray-400">Balance: 0 AVAX</div>
            </div>
            <div className="space-y-4">
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full bg-black/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleBuy}
                className="w-full py-4 bg-purple-500 rounded-xl font-medium hover:bg-purple-600 transition"
              >
                Buy Token
              </button>
              <button
                onClick={handleSell}
                className="w-full py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition"
              >
                Sell Token
              </button>
            </div>
          </div>

          <BondingCurveProgress
            currentSupply={ethers.parseEther(totalSupply)} // You'll need to add this to your token interface
            tokenSymbol={token.symbol}
            currentPrice={token.price || "0.000033"}
            tokenAddress={token.tokenAddress}
          />
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default MemePage;
