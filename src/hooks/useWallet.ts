import { useAccount, useBalance, useDisconnect } from "wagmi";

export function useWallet() {
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();

  const formatAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async (addr?: string) => {
    if (addr) {
      await navigator.clipboard.writeText(addr);
    }
  };

  const getExplorerUrl = (addr?: string) => {
    if (!addr || !chain?.blockExplorers?.default) return "";
    return `${chain.blockExplorers.default.url}/address/${addr}`;
  };

  const formatBalance = (decimals = 4) => {
    if (!balance) return "0";
    return Number(balance.formatted).toFixed(decimals);
  };

  const balanceInUSD = (btcPrice = 43000) => {
    if (!balance) return 0;
    return Number(balance.formatted) * btcPrice;
  };

  return {
    // Core wallet data
    address,
    isConnected,
    isConnecting,
    chain,
    balance,
    balanceLoading,
    
    // Actions
    disconnect,
    refetchBalance,
    
    // Utility functions
    formatAddress,
    copyAddress,
    getExplorerUrl,
    formatBalance,
    balanceInUSD,
    
    // Computed values
    formattedAddress: formatAddress(address),
    formattedBalance: formatBalance(),
    explorerUrl: getExplorerUrl(address),
  };
}