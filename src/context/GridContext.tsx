import { GridSize } from "@/types";
import React, { useContext, useState, createContext, useEffect } from "react";

// @ts-ignore
const GridContext = createContext<GridContextProps>();

interface GridContextProps {
  gridSize: GridSize;
  setGridSize: React.Dispatch<React.SetStateAction<GridSize>>;
  createView: "grid-selector" | "design";
  setCreateView: React.Dispatch<React.SetStateAction<"grid-selector" | "design">>;
  selectedCell: [number, number];
  setSelectedCell: React.Dispatch<React.SetStateAction<[number, number]>>;
  colorGrid: string[][];
  colorCell: (row: number, col: number, color: string) => void;
  onGridSelected: () => void;
}

const GridContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [gridSize, setGridSize] = useState<GridSize>();
  const [createView, setCreateView] = useState<"grid-selector" | "design">("grid-selector");
  const [colorGrid, setColorGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0]);
  const [preview, setPreview] = useState<boolean>(false);

  const onGridSelected = () => {
    if (!gridSize) return;
    setCreateView("design");
    initializeGrid();
  };

  const initializeGrid = () => {
    if (!gridSize) return;
    const gridArray = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let i = 0; i < gridSize; i++) {
        row.push("");
      }
      gridArray.push(row);
    }
    setColorGrid(gridArray);
  };

  const colorCell = (row: number, col: number, color: string) => {
    const gridArray = colorGrid.slice();
    gridArray[row][col] = color;
    setColorGrid(gridArray);
  };

  const ctxProps: GridContextProps = {
    gridSize,
    setGridSize,
    createView,
    setCreateView,
    selectedCell,
    setSelectedCell,
    colorGrid,
    colorCell,
    onGridSelected,
  };

  return <GridContext.Provider value={ctxProps}>{children}</GridContext.Provider>;
};

const useGridContext = () => useContext(GridContext);

export { GridContextProvider, useGridContext };
