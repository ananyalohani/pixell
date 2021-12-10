import { useGridContext } from "@/context/GridContext";
import {
  CashIcon,
  DownloadIcon,
  PencilIcon,
  PhotographIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import React, { useRef, useState } from "react";
import { SketchPicker } from "react-color";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = () => {
    const dimension = 448 / Number(gridSize);
    const canvas = canvasRef!.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      colorGrid.forEach((row, i) => {
        row.forEach((cell, j) => {
          ctx.fillStyle = cell || "white";
          ctx.fillRect(j * dimension, i * dimension, dimension, dimension);
        });
      });
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef?.current) return;
    const anchor = document.createElement("a");
    anchor.download = `an-awesome-nft_${Date.now()}.png`;
    anchor.href = canvasRef.current.toDataURL();
    anchor.click();
  };

  // canvasRef.current?.toBlob((blob) => blob?.stream())

  return (
    <div className="flex flex-row flex-wrap items-center justify-center w-full gap-8 p-8 my-6 bg-white rounded-lg drop-shadow-lg">
      <div className="">
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
              renderCanvas();
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div
          ref={gridRef}
          className={`border-gray-300 bg-white w-80 h-80 sm:w-112 sm:h-112 ${
            preview ? "hidden" : "grid"
          }`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {colorGrid.map((row, i) => {
            return row.map((col, j) => {
              const isSelected = selectedCell[0] === i && selectedCell[1] === j;
              return (
                <div
                  key={`${i}-${j}`}
                  style={{ backgroundColor: col }}
                  className={`hover:bg-pink-50 border cursor-pointer ${
                    isSelected ? "border-gray-400" : "border-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedCell([i, j]);
                    colorCell(i, j, pickedColor!);
                    renderCanvas();
                  }}
                ></div>
              );
            });
          })}
        </div>
        <div className={`${preview ? "block" : "hidden"} overflow-auto border shadow-xl`}>
          <canvas height="448" width="448" ref={canvasRef}></canvas>
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
              onClick={downloadCanvas}
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
