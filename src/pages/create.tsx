import Container from "@/components/Container";
import Designer from "@/components/Designer";
import GridSelector from "@/components/GridSelector";
import { useGridContext } from "@/context/GridContext";
import { useEthers } from "@usedapp/core";
import React from "react";

export default function Create() {
  const { createView } = useGridContext();
  const { account, chainId } = useEthers();

  return (
    <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <Container className="py-8">
        {account && chainId === 3 ? (
          <>
            <h1 className="text-2xl text-center text-white sm:text-3xl">
              Create Your Own Pixel Art
            </h1>
            {createView === "grid-selector" ? <GridSelector /> : <Designer />}
          </>
        ) : (
          <>
            <h1 className="text-2xl text-center text-white sm:text-3xl">
              Looks like you're not connected to the right network.
            </h1>
            <p className="mt-3 text-lg font-bold text-center text-white">
              Make sure your MetaMask account is connected to the Ropsten
              Network.
            </p>
          </>
        )}
      </Container>
    </section>
  );
}
