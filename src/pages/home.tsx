import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(198 93% 60%)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight font-mono text-primary">AlgoVis</span>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/pathfinder" className="hover:text-foreground transition-colors">Pathfinding</Link>
          <Link href="/sorting" className="hover:text-foreground transition-colors">Sorting</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-6 tracking-widest uppercase">
            Algorithm Visualizer
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            See algorithms{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(198 93% 60%), hsl(267 57% 65%))" }}>
              think
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
            Watch pathfinding and sorting algorithms work in real time. Draw obstacles, tune speed, and develop genuine intuition for how computers solve problems.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <Link href="/pathfinder">
              <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(198 93% 60%)" strokeWidth="2">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
                  </svg>
                </div>
                <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Pathfinding</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Draw walls, pick a start and end. Watch A*, Dijkstra, BFS, and DFS navigate the maze you create.</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {["A*", "Dijkstra", "BFS", "DFS"].map(a => (
                    <span key={a} className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground font-mono">{a}</span>
                  ))}
                </div>
              </div>
            </Link>

            <Link href="/sorting">
              <div className="group p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-card/80 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(267 57% 65%)" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="9" y2="18"/>
                  </svg>
                </div>
                <h2 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Sorting</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Watch bars get compared and swapped. From O(n²) bubble sort to O(n log n) merge and heap sort.</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {["Bubble", "Merge", "Quick", "Heap", "Insertion"].map(a => (
                    <span key={a} className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground font-mono">{a}</span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-8 py-4 text-center text-xs text-muted-foreground font-mono">
        Built with React + TypeScript &mdash; open source on GitHub
      </footer>
    </div>
  );
}
