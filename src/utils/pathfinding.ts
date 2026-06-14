import { Cell } from "./grid-helpers";

export type PathfindingResult = {
  visitedInOrder: Cell[];
  shortestPath: Cell[];
};

function getNeighbors(node: Cell, grid: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isWall);
}

function getAllNodes(grid: Cell[][]): Cell[] {
  return grid.flat();
}

function getShortestPath(endNode: Cell): Cell[] {
  const path: Cell[] = [];
  let current: Cell | null = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.parent;
  }
  return path.length > 1 ? path : [];
}

function heuristic(a: Cell, b: Cell): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function dijkstra(grid: Cell[][], startNode: Cell, endNode: Cell): PathfindingResult {
  const visitedInOrder: Cell[] = [];
  startNode.distance = 0;
  const unvisited = getAllNodes(grid);

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift()!;
    if (closest.distance === Infinity) break;
    if (closest.isWall) continue;
    closest.isVisited = true;
    visitedInOrder.push(closest);
    if (closest === endNode) break;
    for (const neighbor of getNeighbors(closest, grid)) {
      if (!neighbor.isVisited) {
        neighbor.distance = closest.distance + 1;
        neighbor.parent = closest;
      }
    }
  }
  return { visitedInOrder, shortestPath: getShortestPath(endNode) };
}

export function aStar(grid: Cell[][], startNode: Cell, endNode: Cell): PathfindingResult {
  const visitedInOrder: Cell[] = [];
  const openSet: Cell[] = [startNode];
  startNode.g = 0;
  startNode.h = heuristic(startNode, endNode);
  startNode.f = startNode.h;

  while (openSet.length) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    if (current.isWall) continue;
    current.isVisited = true;
    visitedInOrder.push(current);
    if (current === endNode) break;

    for (const neighbor of getNeighbors(current, grid)) {
      if (neighbor.isVisited) continue;
      const tentativeG = current.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        if (!openSet.includes(neighbor)) openSet.push(neighbor);
      }
    }
  }
  return { visitedInOrder, shortestPath: getShortestPath(endNode) };
}

export function bfs(grid: Cell[][], startNode: Cell, endNode: Cell): PathfindingResult {
  const visitedInOrder: Cell[] = [];
  const queue: Cell[] = [startNode];
  startNode.isVisited = true;

  while (queue.length) {
    const current = queue.shift()!;
    visitedInOrder.push(current);
    if (current === endNode) break;
    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.parent = current;
        queue.push(neighbor);
      }
    }
  }
  return { visitedInOrder, shortestPath: getShortestPath(endNode) };
}

export function dfs(grid: Cell[][], startNode: Cell, endNode: Cell): PathfindingResult {
  const visitedInOrder: Cell[] = [];
  const stack: Cell[] = [startNode];

  while (stack.length) {
    const current = stack.pop()!;
    if (current.isVisited || current.isWall) continue;
    current.isVisited = true;
    visitedInOrder.push(current);
    if (current === endNode) break;
    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited) {
        neighbor.parent = current;
        stack.push(neighbor);
      }
    }
  }
  return { visitedInOrder, shortestPath: getShortestPath(endNode) };
}
