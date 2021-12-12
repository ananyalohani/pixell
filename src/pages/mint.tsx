import Container from "@/components/Container";
import { useGridContext } from "@/context/GridContext";
import React, { ReactElement, useEffect, useRef } from "react";
import { Formik } from "formik";
import Button from "@/components/Button";
import { fetcher } from "@/lib/api";
import { useEthers } from "@usedapp/core";

interface Props {}

interface NftDetails {
  name: string;
  price: number;
  description: string;
}

export default function Mint({}: Props): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderCanvas } = useGridContext();
  const { account } = useEthers();

  useEffect(() => {
    if (canvasRef?.current) renderCanvas(canvasRef);
  }, [canvasRef]);

  const mintNft = async (values: NftDetails) => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    if (dataUrl) {
      await fetcher("/api/mint", "POST", {
        dataUrl,
        creatorAddress: account,
        ...values,
      });
    }
  };

  return (
    <section className="flex-1 w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <Container className="py-8">
        <h1 className="text-2xl text-center text-white sm:text-3xl">Mint Your NFT!</h1>
        <div className="flex max-w-4xl gap-10 p-10 mx-auto my-6 bg-white rounded-lg drop-shadow-lg">
          <div className="mb-10 overflow-auto border border-gray-200 shadow-xl rounded-xl">
            <canvas height="448" width="448" ref={canvasRef}></canvas>
          </div>
          <div className="flex-1">
            <h2 className="mb-4 text-2xl">Details</h2>
            <Formik<NftDetails>
              initialValues={{ name: "", price: 0, description: "" }}
              onSubmit={mintNft}
            >
              {({ values, handleSubmit, handleChange }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-gray-700">Name</label>
                    <input
                      onChange={handleChange}
                      name="name"
                      className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                      required
                      value={values.name}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-gray-700">Price</label>
                    <input
                      onChange={handleChange}
                      name="price"
                      type="number"
                      min="0"
                      className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                      required
                      value={values.price}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-gray-700">Description</label>
                    <textarea
                      onChange={handleChange}
                      name="description"
                      className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-200 rounded"
                      required
                      value={values.description}
                    />
                  </div>
                  <Button type="submit">Mint</Button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </Container>
    </section>
  );
}
