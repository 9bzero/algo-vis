# algo-vis

I wanted to really *understand* pathfinding — not just know that Dijkstra works, but see why it fans out the way it does, and why A* is faster when you give it a good heuristic. So I built this.

Draw walls. Pick an algorithm. Watch it go.

## Pathfinding

| Algorithm | Weighted | Shortest path |
|---|---|---|
| Dijkstra | ✓ | ✓ |
| A* | ✓ | ✓ (with admissible heuristic) |
| BFS | ✗ | ✓ on unweighted grids |
| DFS | ✗ | ✗ |

A* uses Manhattan distance as its heuristic. It is not always faster than Dijkstra in the worst case, but in practice it explores significantly fewer nodes on open grids.

## Sorting

Merge Sort · Quick Sort · Heap Sort · Bubble Sort · Insertion Sort · Selection Sort

Each bar represents one element. Comparisons light up orange, swaps turn red.

## Features

- Interactive grid — click/drag to draw walls and weighted cells
- Weighted cells cost more to traverse (useful for showing why Dijkstra prefers cheaper paths)
- Diagonal movement toggle
- Adjustable animation speed
- Sorting array size and speed sliders

## Run

```bash
npm install
npm run dev
```

## Known limitations

- The grid resets when you switch algorithms (intentional — avoids stale state)
- Diagonal pathfinding is experimental and can produce slightly suboptimal paths around corners
- Mobile layout works but the grid is small; desktop is the intended experience