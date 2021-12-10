export const GRID_SIZES = [16, 32, 64, 128] as const;
export type GridSize = typeof GRID_SIZES[number] | undefined;
