import React, { useState } from "react";
import StakingCard from "./components/StakingCard";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider } from "wagmi";
import { mainnet } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

// infura "https://mainnet.infura.io/v3/0199a0d37b5b4fc79cdd982d17c3b659"

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = "0455f8bc86f40e4f7a5b6ba24aa1e20d";

// 2. Create a metadata object - optional
const metadata = {
  name: "GameBuild",
  description: "GameBuild Deposit",
  url: "https://game.build/deposit", // origin must match your domain & subdomain
  icons: ["https://game.build/image/logo.png"],
};

// includeWalletIds:
// //"c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
// "e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b",

// 3. Set the networks
const networks = [mainnet];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#00BB7F",
    "--w3m-color-mix-strength": 40,
    "--w3m-border-radius-master": ".8rem",
    "--w3m-z-index": 40,
  },
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function App({ children }) {
  const [selected, setSelected] = useState("stake");

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Top Bar */}
        <div className="top-bar">
          <div>GameBuild</div>
          <div className="button-group">
            {/* <button className="button-1">Button 1</button>
            <button className="button-2">Button 2</button> */}
            <w3m-button />
          </div>
        </div>

        <div className="staking-page">
          {/* Header */}
          <header className="header">
            <h1>Deposit your Game Token</h1>
          </header>

          {/* Deposit and Withdraw Section */}
          <section className="staking-section">
            <h2>Deposit</h2>
            <p>Enter the amount of TON you want to deposit below:</p>
            <StakingCard />
          </section>

          {/* Rewards Section */}
          <section className="rewards-section">
            <h2>Your Rewards</h2>
            <p>Current Staked Amount: 100 TON</p>
            <p>Rewards Earned: 5 TON</p>
            <button>Claim Rewards</button>
          </section>

          {/* Unstake Section */}
          <section className="unstake-section">
            <h2>Unstake Your TON</h2>
            <p>Available to Unstake: 100 TON</p>
            <button>Unstake TON</button>
          </section>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
