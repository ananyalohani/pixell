import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { GridContextProvider } from "@/context/GridContext";
import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";
import "../styles/tailwind.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <DAppProvider config={{}}>
      <GridContextProvider>
        <ChakraProvider>
          <Head>
            <title>Pixell</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <meta
              name="description"
              content="Pixell is a pixel art NFT marketplace on the Ethereum blockchain. Create, mint, sell and buy NFTs on the Ropsten Testnet."
            />
          </Head>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </ChakraProvider>
      </GridContextProvider>
    </DAppProvider>
  );
};

export default App;
