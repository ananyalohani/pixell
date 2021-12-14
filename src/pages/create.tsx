import Container from "@/components/Container";
import Designer from "@/components/Designer";
import GridSelector from "@/components/GridSelector";
import { useGridContext } from "@/context/GridContext";
import React from "react";

export default function Create() {
  const { createView } = useGridContext();

  return (
    <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <Container className="py-8">
        <h1 className="text-2xl text-center text-white sm:text-3xl">
          Create Your Own Pixel Art
        </h1>
        {createView === "grid-selector" ? <GridSelector /> : <Designer />}
      </Container>
    </section>
  );
}
