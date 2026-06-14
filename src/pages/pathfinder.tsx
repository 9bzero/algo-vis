import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { createGrid, clearGridPaths, Cell } from "@/utils/grid-helpers";
import { dijkstra, aStar, bfs, dfs } from "@/utils/pathfinding";

const ROWS = 22;
const COLS = 50;
const START_ROW = 11;
const START_COL = 10;
const END_ROW = 11;
const END_COL = 40;

type AlgoKey = "dijkstra" | "astar" | "bfs" | "dfs";
type Mode = "wall" | "start" | "end";

const ALGOS: { key: AlgoKey; label: string; desc: string }[] = [
  { key: "dijkstra", label: "Dijkstra", desc: "Guarantees shortest path, explores evenly" },
  { key: "astar", label: "A*", desc: "Fastest to goal using heuristic distance" },
  { key: "bfs", label: "BFS", desc: "Shortest path on unweighted grids" },
  { key: "dfs", label: "DFS", desc: "Fast but does not guarantee shortest path" },
];

const SPEEDS = { slow: 60, medium: 20, fast: 5 };

function initGrid(): Cell[][] {
  const g = createGrid(ROWS, COLS);
  g[START_ROW][START_COL].isStart = true;
  g[END_ROW][END_COL].isEnd = true;
  return g;
}

export default function Pathfinder() {
  const [grid, setGrid] = useState<Cell[][]>(initGrid);
  const [algo, setAlgo] = useState<AlgoKey>("astar");
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>("medium");
  const [mode, setMode] = useState<Mode>("wall");
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [stats, setStats] = useState({ visited: 0, path: 0, time: 0 });
  const [startPos, setStartPos] = useState({ row: START_ROW, col: START_COL });
  const [endPos, setEndPos] = useState({ row: END_ROW, col: END_COL });
  const mouseDown = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const resetGrid = useCallback(() => {
    clearTimeouts();
    setIsRunning(false);
    setIsDone(false);
    setStats({ visited: 0, path: 0, time: 0 });
    setGrid(initGrid());
    setStartPos({ row: START_ROW, col: START_COL });
    setEndPos({ row: END_ROW, col: END_COL });
  }, []);

  const clearPath = useCallback(() => {
    clearTimeouts();
    setIsRunning(false);
    setIsDone(false);
    setStats({ visited: 0, path: 0, time: 0 });
    setGrid(g => {
      const fresh = clearGridPaths(g);
      fresh[startPos.row][startPos.col].isStart = true;
      fresh[endPos.row][endPos.col].isEnd = true;
      return fresh;
    });
  }, [startPos, endPos]);

  const handleCellInteract = useCallback((row: number, col: number) => {
    if (isRunning) return;
    setGrid(g => {
      const newGrid = g.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      if (mode === "wall") {
        if (!cell.isStart && !cell.isEnd) cell.isWall = !cell.isWall;
      } else if (mode === "start") {
        if (!cell.isEnd && !cell.isWall) {
          newGrid[startPos.row][startPos.col].isStart = false;
          cell.isStart = true;
          setStartPos({ row, col });
        }
      } else if (mode === "end") {
        if (!cell.isStart && !cell.isWall) {
          newGrid[endPos.row][endPos.col].isEnd = false;
          cell.isEnd = true;
          setEndPos({ row, col });
        }
      }
      return newGrid;
    });
  }, [isRunning, mode, startPos, endPos]);

  const visualize = useCallback(() => {
    if (isRunning) return;
    clearTimeouts();
    setIsDone(false);

    const freshGrid = clearGridPaths(grid).map(r => r.map(c => ({ ...c })));
    freshGrid[startPos.row][startPos.col].isStart = true;
    freshGrid[endPos.row][endPos.col].isEnd = true;

    const startNode = freshGrid[startPos.row][startPos.col];
    const endNode = freshGrid[endPos.row][endPos.col];

    const t0 = performance.now();
    const runners = { dijkstra, astar: aStar, bfs, dfs };
    const { visitedInOrder, shortestPath } = runners[algo](freshGrid, startNode, endNode);
    const elapsed = performance.now() - t0;

    setIsRunning(true);
    setGrid(freshGrid);

    const delay = SPEEDS[speed];
    let maxT = 0;

    visitedInOrder.forEach((node, i) => {
      const t = setTimeout(() => {
        setGrid(g => {
          const ng = g.map(r => r.map(c => ({ ...c })));
          if (!ng[node.row][node.col].isStart && !ng[node.row][node.col].isEnd) {
            ng[node.row][node.col].isVisited = true;
          }
          return ng;
        });
        setStats(s => ({ ...s, visited: i + 1 }));
      }, i * delay);
      timeoutsRef.current.push(t);
      maxT = Math.max(maxT, i * delay);
    });

    shortestPath.forEach((node, i) => {
      const t = setTimeout(() => {
        setGrid(g => {
          const ng = g.map(r => r.map(c => ({ ...c })));
          if (!ng[node.row][node.col].isStart && !ng[node.row][node.col].isEnd) {
            ng[node.row][node.col].isPath = true;
            ng[node.row][node.col].isVisited = false;
          }
          return ng;
        });
        setStats(s => ({ ...s, path: i + 1 }));
      }, maxT + delay + i * delay * 2);
      timeoutsRef.current.push(t);
    });

    const doneT = setTimeout(() => {
      setIsRunning(false);
      setIsDone(true);
      setStats({ visited: visitedInOrder.length, path: shortestPath.length, time: Math.round(elapsed) });
    }, maxT + delay + shortestPath.length * delay * 2 + 100);
    timeoutsRef.current.push(doneT);
  }, [isRunning, grid, algo, speed, startPos, endPos]);

  useEffect(() => () => clearTimeouts(), []);

  function getCellClass(cell: Cell) {
    if (cell.isStart) return "bg-emerald-400 border-emerald-300 scale-110 z-10 relative";
    if (cell.isEnd) return "bg-rose-400 border-rose-300 scale-110 z-10 relative";
    if (cell.isPath) return "cell-path bg-yellow-400/90 border-yellow-300";
    if (cell.isVisited) return "cell-visited bg-blue-500/70 border-blue-400/50";
    if (cell.isWall) return "bg-slate-700 border-slate-600";
    return "bg-slate-900/40 border-slate-800 hover:bg-slate-800/60";
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">← AlgoVis</Link>
          <span className="text-border">|</span>
          <span className="font-mono text-sm text-primary font-semibold">Pathfinding</span>
        </div>
        <div className="flex items-center gap-3">
          {isDone && stats.path === 0 && (
            <span className="text-xs text-destructive font-mono">No path found</span>
          )}
          {isDone && stats.path > 0 && (
            <span className="text-xs text-emerald-400 font-mono">Path: {stats.path - 2} nodes &bull; {stats.visited} visited &bull; {stats.time}ms</span>
          )}
        </div>
      </header>

      <div className="border-b border-border px-6 py-3 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {ALGOS.map(a => (
            <button
              key={a.key}
              onClick={() => !isRunning && setAlgo(a.key)}
              disabled={isRunning}
              title={a.desc}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${algo === a.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex gap-2">
          {(["wall", "start", "end"] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded text-xs font-mono capitalize transition-all ${mode === m
                ? m === "start" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : m === "end" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-slate-500/20 text-slate-300 border border-slate-500/40"
                : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {m === "wall" ? "Draw Walls" : m === "start" ? "Move Start" : "Move End"}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Speed:</span>
          {(["slow", "medium", "fast"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              disabled={isRunning}
              className={`px-2 py-1 rounded text-xs font-mono capitalize transition-all ${speed === s ? "bg-accent/20 text-accent border border-accent/40" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={clearPath}
            disabled={isRunning}
            className="px-3 py-1.5 rounded text-xs font-mono bg-secondary text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
          >
            Clear Path
          </button>
          <button
            onClick={resetGrid}
            disabled={isRunning}
            className="px-3 py-1.5 rounded text-xs font-mono bg-secondary text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
          >
            Reset Board
          </button>
          <button
            onClick={visualize}
            disabled={isRunning}
            className="px-5 py-1.5 rounded text-xs font-mono font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Visualize"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div
          className="border border-border rounded-lg overflow-hidden"
          onMouseLeave={() => { mouseDown.current = false; }}
        >
          {grid.map((row, ri) => (
            <div key={ri} className="flex">
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  onMouseDown={() => { mouseDown.current = true; handleCellInteract(ri, ci); }}
                  onMouseUp={() => { mouseDown.current = false; }}
                  onMouseEnter={() => { if (mouseDown.current && mode === "wall") handleCellInteract(ri, ci); }}
                  className={`w-5 h-5 border-[0.5px] transition-colors cursor-pointer select-none ${getCellClass(cell)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-6 py-2 flex gap-6 text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"/> Start</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-400 inline-block"/> End</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-700 inline-block"/> Wall</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500/70 inline-block"/> Visited</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block"/> Shortest Path</span>
        <span className="ml-auto">Click or drag to draw walls</span>
      </div>
    </div>
  );
}
