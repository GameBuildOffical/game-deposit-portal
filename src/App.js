import React from "react";
import { BrowserRouter } from "react-router-dom";
import StakingCard from "./components/StakingCard";
import InfoCard from "./components/InfoCard";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import logo from "./assets/images/gamebuildlogo.png";

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
// Custom RPC URL (replace with your Infura or Alchemy endpoint)
const sepoliaWithCustomRPC = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/0199a0d37b5b4fc79cdd982d17c3b659"], // Infura
      // or "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY", // Alchemy
    },
  },
};

// 3. Set the networks
const networks = [sepoliaWithCustomRPC];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  // themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#0180ff",
    // "--w3m-color-mix": "#00BB7F",
    "--w3m-color-mix-strength": 10,
    "--w3m-border-radius-master": "40px",
    //"--w3m-z-index": 4,
  },
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    email: false, // Disables email login
    socials: [], // Disables all social logins
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function App({ children }) {
  return (
    <BrowserRouter basename="/staging/deposit">
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* Top Bar */}
          <div className="top-bar">
            <div className="logo-container">
              <img src={logo} alt="logo" className="button-logo" />
              <div className="brand-name">GameBuild</div>
            </div>
            <div className="button-group">
              <w3m-button balance="hide" size="md" />
            </div>
          </div>

          <div className="staking-page">
            {/* Deposit and Withdraw Section */}
            <h2>Deposit your GAME Token</h2>
            <p>
              Deposit $60,000 GAME to create
              <br />
              Campaigns on GameBuild TMA!
            </p>

            <StakingCard />

            {/* Info Section */}
            <section className="info-section">
              <InfoCard />
            </section>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  );
}

export default App;
