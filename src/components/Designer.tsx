import { useGridContext } from "@/context/GridContext";
import {
  CashIcon,
  DownloadIcon,
  PencilIcon,
  PhotographIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { exportComponentAsJPEG } from "react-component-export-image";
import Button from "./Button";

interface Props {}

const Designer = (props: Props) => {
  const {
    gridSize,
    colorGrid,
    selectedCell,
    setSelectedCell,
    colorCell,
    preview,
    setPreview,
    clearGrid,
    gridRef,
  } = useGridContext();
  const [pickedColor, setPickedColor] = useState<string>("");

  return (
    <div className="flex flex-row items-center w-full p-8 my-6 space-x-8 bg-white rounded-lg drop-shadow-lg">
      <div className="flex-1">
        <div className="flex flex-row max-w-2xl space-x-8 h-112">
          <SketchPicker
            // @ts-ignore
            width={350}
            className={`${preview ? "pointer-events-none opacity-30" : ""}`}
            disableAlpha={true}
            color={pickedColor}
            onChange={(color: any) => {
              setPickedColor(color.hex);
              colorCell(selectedCell[0], selectedCell[1], color.hex);
            }}
          />
        </div>
      </div>
      <div className="">
        <div
          ref={gridRef}
          className={`grid border-gray-300 w-112 h-112 ${
            preview ? "drop-shadow" : "border"
          } bg-white`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {colorGrid.map((row, i) => {
            return row.map((col, j) => {
              const isSelected = selectedCell[0] === i && selectedCell[1] === j;
              return (
                <div
                  key={`${i}-${j}`}
                  style={{ backgroundColor: col }}
                  className={`${!preview ? "border cursor-pointer" : "pointer-events-none"}  ${
                    isSelected ? "border-gray-400" : "border-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedCell([i, j]);
                    colorCell(i, j, pickedColor!);
                  }}
                ></div>
              );
            });
          })}
        </div>
      </div>
      <div className="flex flex-col flex-1 space-y-6">
        {preview ? (
          <>
            <Button
              className="flex flex-row items-center justify-center space-x-2"
              onClick={() => setPreview(false)}
            >
              <PencilIcon className="w-6 h-6 text-white" />
              <p className="text-white">Edit Design</p>
            </Button>
            <Button
              className="flex flex-row items-center justify-center space-x-2"
              onClick={() => exportComponentAsJPEG(gridRef)}
            >
              <DownloadIcon className="w-6 h-6 text-white" />
              <p className="text-white">Download</p>
            </Button>
            <Button className={`flex flex-row items-center justify-center space-x-2`}>
              <CashIcon className="w-6 h-6 text-white" />
              <p className="text-white">Mint NFT!</p>
            </Button>
          </>
        ) : (
          <>
            <Button
              className="flex flex-row items-center justify-center space-x-2"
              onClick={() => setPreview(true)}
            >
              <PhotographIcon className="w-6 h-6 text-white" />
              <p className="text-white">Preview Design</p>
            </Button>
            <Button
              className="flex flex-row items-center justify-center space-x-2"
              onClick={clearGrid}
            >
              <TrashIcon className="w-6 h-6 text-white" />
              <p className="text-white">Clear Grid</p>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Designer;
