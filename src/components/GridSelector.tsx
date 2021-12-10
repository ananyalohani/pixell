import { GridSize, GRID_SIZES } from "@/types";
import React from "react";
import Button from "./Button";

interface Props {
  gridSize: GridSize;
  setGridSize: React.Dispatch<React.SetStateAction<GridSize | undefined>>;
}

const GridSelector = ({ gridSize, setGridSize }: Props) => {
  return (
    <div className="flex flex-col items-center max-w-3xl px-10 py-8 mx-auto my-6 space-y-8 bg-white rounded-lg drop-shadow-lg">
      <div className="w-full">
        <h2 className="mb-3 text-xl font-semibold text-center">
          Select the Grid Size
        </h2>
        <div className="w-full h-px bg-gray-200" />
      </div>
      <div className="flex flex-row justify-around w-full">
        {GRID_SIZES.map((sz) => (
          <div
            key={sz}
            className={`flex items-center justify-center w-32 h-32 text-lg font-medium border-2 rounded-md cursor-pointer font-code ${
              gridSize === sz
                ? "text-purple-700 bg-purple-200 border-purple-300"
                : "text-gray-800 bg-gray-200 border-gray-300"
            }`}
            onClick={() => setGridSize(sz)}
          >
            {sz}✕{sz}
          </div>
        ))}
      </div>
      <Button>Start Designing!</Button>
    </div>
  );
};

export default GridSelector;
