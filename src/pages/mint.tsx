import Container from "@/components/Container";
import { useGridContext } from "@/context/GridContext";
import React, { ReactElement, useEffect, useRef } from "react";
import { Formik } from "formik";
import Button from "@/components/Button";

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
        <div className="flex flex-col items-center justify-center max-w-2xl p-10 mx-auto my-6 bg-white rounded-lg drop-shadow-lg">
          <div className="mb-10 overflow-auto border border-gray-200 shadow-xl rounded-xl">
            <canvas height="448" width="448" ref={canvasRef}></canvas>
          </div>
          <h2 className="mb-4 text-2xl">Details</h2>
          <Formik
            initialValues={{ filename: "", price: undefined, description: "" }}
            onSubmit={(values) => {}}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-gray-700">Name</label>
                  <input
                    className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-gray-700">Price</label>
                  <input
                    className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-gray-700">Description</label>
                  <textarea
                    className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                    required
                  />
                </div>
                <Button type="submit">Mint</Button>
              </form>
            )}
          </Formik>
          <form></form>
        </div>
      </Container>
    </section>
  );
}
