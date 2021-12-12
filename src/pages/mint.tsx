import Container from "@/components/Container";
import { useGridContext } from "@/context/GridContext";
import React, { ReactElement, useEffect, useRef } from "react";

interface Props {}

export default function Mint({}: Props): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderCanvas } = useGridContext();

  useEffect(() => {
    if (canvasRef?.current) renderCanvas(canvasRef);
  }, [canvasRef]);

  return (
    <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <Container className="py-8">
        <h1 className="text-2xl text-center text-white sm:text-3xl">Mint Your NFT!</h1>
        <div className="flex flex-row flex-wrap items-center justify-center max-w-2xl gap-8 p-8 mx-auto my-6 bg-white rounded-lg drop-shadow-lg">
          <div className="overflow-auto border shadow-xl">
            <canvas height="448" width="448" ref={canvasRef}></canvas>
          </div>
        </div>
      </Container>
    </section>
  );
}
