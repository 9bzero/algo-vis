export type Cell = {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  f: number;
  g: number;
  h: number;
  parent: Cell | null;
};

export const createNode = (col: number, row: number): Cell => ({
  col, row,
  isStart: false, isEnd: false,
  distance: Infinity,
  isVisited: false, isWall: false, isPath: false,
  f: Infinity, g: Infinity, h: Infinity,
  parent: null,
});

export const createGrid = (rows: number, cols: number): Cell[][] =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => createNode(col, row))
  );

export const clearGridPaths = (grid: Cell[][]): Cell[][] =>
  grid.map(row =>
    row.map(cell => ({
      ...cell,
      isVisited: false, isPath: false,
      distance: Infinity, f: Infinity, g: Infinity, h: Infinity,
      parent: null,
    }))
  );
