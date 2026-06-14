# AlgoVis — Algorithm Visualizer

An interactive algorithm visualizer for pathfinding and sorting algorithms, built with React and TypeScript.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Wouter
- **Build**: Vite

## Features

### Pathfinding Visualizer
- Interactive grid (22×50) — click/drag to draw walls
- Move start and end nodes anywhere
- Algorithms: **A\***, **Dijkstra**, **BFS**, **DFS**
- Animated wave for visited nodes, gold highlight for shortest path
- Live stats: nodes visited, path length, time elapsed
- Speed control: Slow / Medium / Fast

### Sorting Visualizer
- Algorithms: **Bubble**, **Insertion**, **Merge**, **Quick**, **Heap**
- Array size slider (10–200 elements)
- Color-coded bars: comparing (red), sorted (green)
- Live comparison and swap counters
- Complexity shown for each algorithm

## Getting Started

```bash
pnpm install
pnpm run dev
```

## Project Structure

```
src/
  pages/
    home.tsx        # Landing page
    pathfinder.tsx  # Pathfinding visualizer
    sorting.tsx     # Sorting visualizer
  utils/
    pathfinding.ts  # A*, Dijkstra, BFS, DFS implementations
    sorting.ts      # Bubble, Insertion, Merge, Quick, Heap implementations
    grid-helpers.ts # Grid creation and reset utilities
```
