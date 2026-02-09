
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  // const [selectedAlgo, setSelectedAlgo] = useState('bubble');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide">
              CREATED BY <span className="font-bold">PARCHEZZI TECH</span>
            </div>
            <div className="px-3 py-1 rounded-md border border-yellow-500/30 bg-yellow-500/5 text-yellow-500 text-[11px] font-semibold tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              Status: Still Under Development
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-primary to-secondary animate-pulse-slow">
            Algorithm <br />
            Visualizer
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the elegance of algorithms in real-time. A high-performance visualization engine running on serverless Python.
          </p>

          <div className="flex justify-center gap-4">
            <Button variant="primary">
              <Play className="w-5 h-5 mr-2" /> Start Visualizing
            </Button>
            <Button variant="outline">
              <Layers className="w-5 h-5 mr-2" /> View Source
            </Button>
          </div>
        </motion.div>

        {/* Algorithm Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link href="/sorting" passHref legacyBehavior>
            <Card className="group hover:border-primary/50 transition-colors cursor-pointer" title="Sorting Algorithms">
              <a className="block h-full">
                <div className="h-40 bg-linear-to-b from-primary/5 to-transparent rounded-lg mb-4 flex items-end justify-center gap-1 p-4">
                  {[40, 70, 30, 80, 50, 90, 20, 60].map((h, i) => (
                    <div key={i} className="w-3 bg-primary/40 rounded-t-sm group-hover:bg-primary transition-colors duration-500" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Visualize Bubble, Merge, Quick, and Heap sort with real-time comparisons and swaps.
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
                  Launch Visualizer <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </a>
            </Card>
          </Link>

          <Link href="/pathfinding" passHref legacyBehavior>
            <Card className="group hover:border-secondary/50 transition-colors cursor-pointer" title="Pathfinding">
              <a className="block h-full">
                <div className="h-40 bg-linear-to-b from-secondary/5 to-transparent rounded-lg mb-4 grid grid-cols-6 gap-1 p-4 opacity-70">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${(i === 4 || i === 15) ? 'bg-secondary' : 'bg-muted'}`} />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Watch Dijkstra, A*, and BFS navigate complex mazes to find the optimal path.
                </p>
                <div className="flex items-center text-secondary text-sm font-medium group-hover:underline">
                  Launch Visualizer <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </a>
            </Card>
          </Link>

          <Link href="/recursive" passHref legacyBehavior>
            <Card className="group hover:border-accent/50 transition-colors cursor-pointer" title="Recursive Patterns">
              <a className="block h-full">
                <div className="h-40 bg-linear-to-b from-accent/5 to-transparent rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-accent/40 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-12 h-12 border-2 border-accent/60 rounded-full" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore the beauty of Fractals, N-Queens, and other recursive backtracking problems.
                </p>
                <div className="flex items-center text-accent text-sm font-medium group-hover:underline">
                  Launch Visualizer <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </a>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 text-center text-muted-foreground text-sm border-t border-white/5 relative z-10">
        <p>© 2026 Parchezzi Tech. All rights reserved.</p>
        <p className="mt-2 text-primary/50 font-medium tracking-wide italic">"Innovating education through visualization"</p>
      </footer>
    </div>
  );
}
