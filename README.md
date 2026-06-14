<div align="center">

  # AlgoVis — Algorithm Visualizer

  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

  **Watch pathfinding and sorting algorithms think — step by step, in real time.**

  </div>

  ---

  ## Visualizers

  ### Pathfinding
  Interactive 22×50 grid where you draw walls and watch algorithms find the shortest path.

  | Algorithm | Guarantees Shortest Path | Strategy |
  |-----------|------------------------|----------|
  | **A*** | Yes | Heuristic (Manhattan distance) |
  | **Dijkstra** | Yes | Uniform cost |
  | **BFS** | Yes | Level-by-level |
  | **DFS** | No | Depth-first stack |

  ### Sorting
  Animated bar chart showing comparisons and swaps in real time.

  | Algorithm | Time Complexity | Space |
  |-----------|----------------|-------|
  | **Merge Sort** | O(n log n) | O(n) |
  | **Quick Sort** | O(n log n) avg | O(log n) |
  | **Heap Sort** | O(n log n) | O(1) |
  | **Insertion Sort** | O(n²) | O(1) |
  | **Bubble Sort** | O(n²) | O(1) |

  ## Controls

  - **Pathfinding** — Click or drag to draw walls · Move start/end nodes · Choose algorithm · Control speed
  - **Sorting** — Adjust array size (10–200) · Choose algorithm · Control speed · Generate new array

  ## Getting Started

  ```bash
  npm install
  npm run dev
  ```

  ## Implementation Details

  All algorithms are implemented from scratch in TypeScript with no external algorithm libraries:

  ```
  src/utils/
    pathfinding.ts   # A*, Dijkstra, BFS, DFS — pure TypeScript
    sorting.ts       # Bubble, Insertion, Merge, Quick, Heap — animation frames
    grid-helpers.ts  # Grid creation and path clearing utilities
  ```

  Each sorting algorithm produces an array of `SortAnimation` frames (`compare`, `swap`, `overwrite`, `sorted`) that are replayed at a configurable speed using `setTimeout`.

  ---

  <div align="center">Made with TypeScript · Part of my <a href="https://github.com/9bzero">developer portfolio</a></div>
  