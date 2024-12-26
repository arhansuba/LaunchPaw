"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Erc1155TokenBalance,
  Erc20TokenBalance,
  TransactionDetails,
} from "@avalabs/avacloud-sdk/models/components";
import { Erc721TokenBalance } from "@avalabs/avacloud-sdk/models/components/erc721tokenbalance";
import { Card } from "./Card";
import { AvaCloudSDK } from "@avalabs/avacloud-sdk";
const avaCloudSDK = new AvaCloudSDK({
  apiKey: import.meta.env.VITE_AVACLOUD_API_KEY,
  chainId: "43114", // Avalanche Mainnet
  network: "mainnet",
});

export default function BasicWallet() {
  // const { address } = useAccount();
  const address = "0xC5ec7765481F90aCBcC61DE0bb5C7904f2E63077";
  const [erc20Balances, setErc20Balances] = useState<Erc20TokenBalance[]>([]);
  const [erc721Balances, setErc721Balances] = useState<Erc721TokenBalance[]>(
    []
  );
  const [erc1155Balances, setErc1155Balances] = useState<Erc1155TokenBalance[]>(
    []
  );
  const [recentTransactions, setRecentTransactions] =
    useState<TransactionDetails>();
  const [activeTab, setActiveTab] = useState("nfts");

  async function getBlockHeight() {
    const result = await avaCloudSDK.data.evm.blocks.getLatestBlocks({
      pageSize: 1,
    });
    return Number(result.result.blocks[0].blockNumber);
  }

  const listERC721Balances = async (address: string) => {
    const result = await avaCloudSDK.data.evm.balances.listErc721Balances({
      pageSize: 10,
      address: address,
    });
    const balances: Erc721TokenBalance[] = [];
    for await (const page of result) {
      balances.push(...page.result.erc721TokenBalances);
    }
    return balances;
  };

  const listErc1155Balances = async (address: string) => {
    const result = await avaCloudSDK.data.evm.balances.listErc1155Balances({
      pageSize: 10,
      address: address,
    });
    const balances: Erc1155TokenBalance[] = [];
    for await (const page of result) {
      balances.push(...page.result.erc1155TokenBalances);
    }
    return balances;
  };
  const listRecentTransactions = async (address: string) => {
    const blockHeight = await getBlockHeight();
    const result = await avaCloudSDK.data.evm.transactions.listTransactions({
      pageSize: 10,
      startBlock: blockHeight - 100000,
      endBlock: blockHeight,
      address: address,
      sortOrder: "desc",
    });
    const transactions: TransactionDetails = {
      erc20Transfers: [],
      erc721Transfers: [],
      erc1155Transfers: [],
      nativeTransaction: {
        blockNumber: "",
        blockTimestamp: 0,
        blockHash: "",
        blockIndex: 0,
        txHash: "",
        txStatus: "",
        txType: 0,
        gasLimit: "",
        gasUsed: "",
        gasPrice: "",
        nonce: "",
        from: {
          name: undefined,
          symbol: undefined,
          decimals: undefined,
          logoUri: undefined,
          address: "",
        },
        to: {
          name: undefined,
          symbol: undefined,
          decimals: undefined,
          logoUri: undefined,
          address: "",
        },
        value: "",
      },
    };
    for await (const page of result) {
      for (const transaction of page.result.transactions) {
        if (transaction.erc20Transfers) {
          if (transactions.erc20Transfers) {
            transactions.erc20Transfers.push(...transaction.erc20Transfers);
          }
        } else if (transaction.erc721Transfers) {
          if (transactions.erc721Transfers) {
            transactions.erc721Transfers.push(...transaction.erc721Transfers);
          }
        } else if (transaction.erc1155Transfers) {
          if (transactions.erc1155Transfers) {
            transactions.erc1155Transfers.push(...transaction.erc1155Transfers);
          }
        }
      }
    }
    return transactions;
  };

  async function listErc20Balances(address: string, blockNumber: string) {
    const result = await avaCloudSDK.data.evm.balances.listErc20Balances({
      blockNumber: blockNumber,
      pageSize: 10,
      address: address,
    });
    const balances: Erc20TokenBalance[] = [];
    for await (const page of result) {
      balances.push(...page.result.erc20TokenBalances);
    }
    return balances;
  }

  const fetchERC20Balances = async (address: string) => {
    const blockResult = await getBlockHeight();
    const blockNumber = blockResult;
    const balanceResult = await listErc20Balances(
      address,
      blockNumber.toString()
    );
    const balances = balanceResult;
    return balances as Erc20TokenBalance[];
  };

  const fetchERC721Balances = async (address: string) => {
    const result = await listERC721Balances(address);
    const balances = result;
    return balances as Erc721TokenBalance[];
  };

  const fetchERC1155Balances = async (address: string) => {
    const result = await listErc1155Balances(address);
    const balances = result;
    return balances as Erc1155TokenBalance[];
  };

  const fetchRecentTransactions = async (address: string) => {
    const result = await listRecentTransactions(address);
    const transactions = result;
    return transactions as TransactionDetails;
  };

  useEffect(() => {
    if (address) {
      fetchERC20Balances(address).then(setErc20Balances);
      fetchERC721Balances(address).then(setErc721Balances);
      fetchERC1155Balances(address).then(setErc1155Balances);
      fetchRecentTransactions(address).then(setRecentTransactions);
    }
  }, [address]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      ></motion.div>
      {address ? (
        <div className="flex lg:flex-row gap-8">
          <motion.main
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-grow"
          >
            <div className="flex gap-4 mb-8">
              {["nfts", "erc20", "erc1155"].map((tab) => (
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

            {activeTab === "nfts" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {erc721Balances.map((nft, index) => (
                  <motion.div
                    key={`${nft.address}-${nft.tokenId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="token-card"
                  >
                    {nft.metadata.imageUri && (
                      <img
                        src={nft.metadata.imageUri}
                        alt={nft.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
                    <p className="text-sm text-white/60">#{nft.tokenId}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "erc20" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {erc20Balances.map((token, index) => (
                  <motion.div
                    key={token.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="token-card"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {token.logoUri ? (
                        <img
                          src={token.logoUri}
                          alt={token.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-xl font-bold">
                            {token.symbol?.[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{token.name}</h3>
                        <p className="text-sm text-white/60">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-300">
                        {(
                          Number(token.balance) /
                          10 ** Number(token.decimals)
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "erc1155" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {erc1155Balances.map((token, index) => (
                  <motion.div
                    key={`${token.address}-${token.tokenId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="token-card"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {token.metadata?.name || `Token #${token.tokenId}`}
                    </h3>
                    <p className="text-2xl font-bold text-primary-300">
                      {token.balance}
                    </p>
                  </motion.div>
                ))}
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
