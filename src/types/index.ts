export const GRID_SIZES = [4, 8, 16, 32] as const;
export type GridSize = typeof GRID_SIZES[number] | undefined;
