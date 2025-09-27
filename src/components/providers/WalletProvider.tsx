import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { useTheme } from "@/components/providers/ThemeProvider";

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProviderWrapper>{children}</RainbowKitProviderWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function RainbowKitProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <RainbowKitProvider
      theme={theme === "dark" ? darkTheme() : lightTheme()}
      appInfo={{
        appName: "Vintara",
        learnMoreUrl: "https://vintara.com",
      }}
      initialChain={31} // Rootstock Testnet
    >
      {children}
    </RainbowKitProvider>
  );
}
