import { http, createConfig } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";
import { metaMask } from "@wagmi/connectors";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const projectId = "0455f8bc86f40e4f7a5b6ba24aa1e20d";

export const wagmiAdapter = WagmiAdapter({
  autoConnect: true,
  //chains: [mainnet],
  connectors: [metaMask()], //[walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(
      "https://mainnet.infura.io/v3/0199a0d37b5b4fc79cdd982d17c3b659"
    ),
  },
  ssr: true,
});
