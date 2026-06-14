import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { bubbleSort, insertionSort, mergeSort, quickSort, heapSort, SortAnimation } from "@/utils/sorting";

type AlgoKey = "bubble" | "insertion" | "merge" | "quick" | "heap";

const ALGOS: { key: AlgoKey; label: string; complexity: string }[] = [
  { key: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
  { key: "insertion", label: "Insertion Sort", complexity: "O(n²)" },
  { key: "merge", label: "Merge Sort", complexity: "O(n log n)" },
  { key: "quick", label: "Quick Sort", complexity: "O(n log n)" },
  { key: "heap", label: "Heap Sort", complexity: "O(n log n)" },
];

const SPEEDS = { slow: 80, medium: 20, fast: 3 };

function randomArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 380) + 20);
}

const MAX_H = 400;

export default function Sorting() {
  const [size, setSize] = useState(60);
  const [array, setArray] = useState(() => randomArray(60));
  const [algo, setAlgo] = useState<AlgoKey>("merge");
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>("medium");
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const generateNew = useCallback(() => {
    clearTimeouts();
    setIsRunning(false);
    setComparing([]);
    setSorted([]);
    setStats({ comparisons: 0, swaps: 0 });
    setArray(randomArray(size));
  }, [size]);

  useEffect(() => { generateNew(); }, [size]);

  const visualize = useCallback(() => {
    if (isRunning) return;
    clearTimeouts();
    setSorted([]);
    setComparing([]);
    setStats({ comparisons: 0, swaps: 0 });

    const runners = { bubble: bubbleSort, insertion: insertionSort, merge: mergeSort, quick: quickSort, heap: heapSort };
    const animations: SortAnimation[] = runners[algo]([...array]);

    const delay = SPEEDS[speed];
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;

    setIsRunning(true);
    let maxT = 0;

    animations.forEach((anim, i) => {
      const t = setTimeout(() => {
        if (anim.type === "compare") {
          comparisons++;
          setComparing(anim.indices as number[]);
          setStats(s => ({ ...s, comparisons }));
        } else if (anim.type === "swap") {
          swaps++;
          [arr[anim.indices[0]], arr[anim.indices[1]]] = [arr[anim.indices[1]], arr[anim.indices[0]]];
          setArray([...arr]);
          setStats(s => ({ ...s, swaps }));
        } else if (anim.type === "overwrite") {
          arr[anim.index] = anim.value;
          setArray([...arr]);
        } else if (anim.type === "sorted") {
          setSorted(s => [...s, anim.index]);
          setComparing([]);
        }
      }, i * delay);
      timeoutsRef.current.push(t);
      maxT = Math.max(maxT, i * delay);
    });

    const doneT = setTimeout(() => {
      setIsRunning(false);
      setComparing([]);
      setSorted(Array.from({ length: arr.length }, (_, i) => i));
    }, maxT + delay + 100);
    timeoutsRef.current.push(doneT);
  }, [isRunning, array, algo, speed]);

  useEffect(() => () => clearTimeouts(), []);

  function getBarColor(i: number) {
    if (sorted.includes(i)) return "bg-emerald-400";
    if (comparing.includes(i)) return "bg-rose-400";
    return "bg-primary/70";
  }

  const barWidth = Math.max(2, Math.floor(780 / size) - 1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">← AlgoVis</Link>
          <span className="text-border">|</span>
          <span className="font-mono text-sm text-accent font-semibold">Sorting</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <span>Comparisons: <span className="text-foreground">{stats.comparisons}</span></span>
          <span>Swaps: <span className="text-foreground">{stats.swaps}</span></span>
        </div>
      </header>

      <div className="border-b border-border px-6 py-3 flex flex-wrap items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          {ALGOS.map(a => (
            <button
              key={a.key}
              onClick={() => { if (!isRunning) { setAlgo(a.key); generateNew(); } }}
              disabled={isRunning}
              title={a.complexity}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${algo === a.key ? "bg-accent/20 text-accent border border-accent/40" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {a.label} <span className="opacity-50">{a.complexity}</span>
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Size:</span>
          <input
            type="range" min={10} max={200} value={size}
            onChange={e => !isRunning && setSize(Number(e.target.value))}
            disabled={isRunning}
            className="w-24 accent-primary"
          />
          <span className="text-xs font-mono text-muted-foreground w-6">{size}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Speed:</span>
          {(["slow", "medium", "fast"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              disabled={isRunning}
              className={`px-2 py-1 rounded text-xs font-mono capitalize transition-all ${speed === s ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={generateNew}
            disabled={isRunning}
            className="px-3 py-1.5 rounded text-xs font-mono bg-secondary text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
          >
            New Array
          </button>
          <button
            onClick={visualize}
            disabled={isRunning}
            className="px-5 py-1.5 rounded text-xs font-mono font-bold bg-accent text-accent-foreground hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isRunning ? "Sorting..." : "Sort"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-center px-8 py-6 overflow-hidden">
        <div className="flex items-end gap-[1px]" style={{ height: `${MAX_H}px` }}>
          {array.map((val, i) => (
            <div
              key={i}
              style={{ height: `${(val / 400) * MAX_H}px`, width: `${barWidth}px` }}
              className={`rounded-t-sm transition-colors duration-75 ${getBarColor(i)}`}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border px-6 py-2 flex gap-6 text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary/70 inline-block"/> Unsorted</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-400 inline-block"/> Comparing</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"/> Sorted</span>
      </div>
    </div>
  );
}
