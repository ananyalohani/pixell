import { GridSize } from "@/types";
import React, { useContext, useState, createContext } from "react";

const GridContext = createContext<any>(undefined);

interface GridContextProps {
  children: React.ReactNode;
}

const GridContextProvider = ({ children }: GridContextProps) => {
  const [gridSize, setGridSize] = useState<GridSize>();
  const [gridSelectorOpen, setGridSelectorOpen] = useState<boolean>(true);
};
