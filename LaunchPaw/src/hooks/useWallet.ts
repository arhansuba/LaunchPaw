import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const connectWallet = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { accounts, chainId } = await connectAsync({
      connector: connectors[0],
    });

    return {
      address: accounts[0],
      chainId,
    };
  };

  return {
    address,
    isConnected,
    connectWallet,
  };
};