import Container from "@/components/Container";
import Button from "@/components/Button";
import React, { useState } from "react";
import GridSelector from "@/components/GridSelector";
import { GridSize } from "@/types";

export default function Create() {
  const [gridSize, setGridSize] = useState<GridSize>();

  return (
    <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <Container className="py-8">
        <h1 className="text-2xl text-center text-white sm:text-3xl">
          Create Your Own Pixel Art
        </h1>
        <GridSelector gridSize={gridSize} setGridSize={setGridSize} />
      </Container>
    </section>
  );
}
