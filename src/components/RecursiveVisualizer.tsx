
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BoardStep = {
    type: "place" | "remove" | "check";
    row: number;
    col: number;
    status: string;
    points?: [number, number][];
};

export default function RecursiveVisualizer() {
    const [algorithm, setAlgorithm] = useState("nqueens");
    const [n, setN] = useState(8);
    const [order, setOrder] = useState(4);
    const [board, setBoard] = useState(Array(n).fill(null).map(() => Array(n).fill(0)));
    const [triangles, setTriangles] = useState<[number, number][][]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState("Ready");
    const timeouts = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        resetBoard(n);
    }, [n]);

    const resetBoard = (size: number) => {
        setBoard(Array(size).fill(null).map(() => Array(size).fill(0)));
        stopAnimation();
        setStatus("Ready");
    };

    const stopAnimation = () => {
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
        setIsPlaying(false);
    };

    const visualizeRecursive = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        if (algorithm === "nqueens") {
            resetBoard(n);
        } else {
            setTriangles([]);
        }
        setStatus("Solving...");

        try {
            const body = algorithm === "nqueens"
                ? { algorithm: "nqueens", n }
                : { algorithm: "sierpinski", order };

            const res = await fetch("/api/recursive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.steps) {
                if (algorithm === "nqueens") {
                    animateNQueens(data.steps);
                } else {
                    animateSierpinski(data.steps);
                }
            }
        } catch (error) {
            console.error("Recursive Error:", error);
            setIsPlaying(false);
        }
    };

    const animateSierpinski = (steps: BoardStep[]) => {
        let delay = 0;
        steps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                if (step.points) {
                    setTriangles(prev => [...prev, step.points as [number, number][]]);
                }
                if (index === steps.length - 1) {
                    setIsPlaying(false);
                    setStatus("Fractal Complete!");
                }
            }, delay);
            timeouts.current.push(timeout);
            delay += 1000 / steps.length; // Scale drawing to fixed duration
        });
    };

    const animateNQueens = (steps: BoardStep[]) => {
        let delay = 0;
        const speed = 100; //ms

        steps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                setBoard(prev => {
                    const newBoard = prev.map(r => [...r]);
                    if (step.type === "place" && step.status === "placed") {
                        newBoard[step.row][step.col] = 1; // Queen placed
                    } else if (step.type === "place" && step.status === "backtrack") {
                        newBoard[step.row][step.col] = 0; // Backtrack
                    }
                    return newBoard;
                });
                setStatus(step.status === "placed" ? `Placed Queen at (${step.row}, ${step.col})` :
                    step.status === "backtrack" ? "Backtracking..." : "Checking...");

                if (index === steps.length - 1) {
                    setIsPlaying(false);
                    setStatus("Solution Found!");
                }
            }, delay);
            timeouts.current.push(timeout);
            delay += speed;
        });
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto items-center">
            <Card className="p-6 w-full flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <select
                        value={algorithm}
                        onChange={(e) => {
                            setAlgorithm(e.target.value);
                            stopAnimation();
                        }}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none"
                        disabled={isPlaying}
                    >
                        <option value="nqueens">N-Queens Backtracking</option>
                        <option value="sierpinski">Sierpinski Fractal</option>
                    </select>

                    {algorithm === "nqueens" ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Board Size (N): {n}</span>
                            <input
                                type="range"
                                min="4"
                                max="10"
                                value={n}
                                onChange={(e) => setN(Number(e.target.value))}
                                className="w-32 accent-accent h-2 bg-white/10 rounded-full outline-none"
                                disabled={isPlaying}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Order: {order}</span>
                            <input
                                type="range"
                                min="1"
                                max="7"
                                value={order}
                                onChange={(e) => setOrder(Number(e.target.value))}
                                className="w-32 accent-accent h-2 bg-white/10 rounded-full outline-none"
                                disabled={isPlaying}
                            />
                        </div>
                    )}
                </div>

                <div className="bg-black/40 px-4 py-2 rounded-lg border border-accent/20 min-w-[200px] text-center">
                    <span className="text-accent text-sm font-mono animate-pulse">{status}</span>
                </div>

                <Button
                    variant={isPlaying ? "secondary" : "primary"}
                    onClick={isPlaying ? stopAnimation : visualizeRecursive}
                    className="bg-accent hover:bg-accent/80 shadow-[0_0_15px_rgba(112,0,255,0.4)]"
                >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? "Simulating..." : `Visualize ${algorithm === "nqueens" ? "N-Queens" : "Sierpinski"}`}
                </Button>
            </Card>

            {algorithm === "nqueens" ? (
                <Card className="p-8 bg-black/40 border-accent/20 relative">
                    <div
                        className="grid gap-1 bg-white/5 p-2 rounded-lg"
                        style={{
                            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                            width: 'min(80vw, 500px)',
                            height: 'min(80vw, 500px)'
                        }}
                    >
                        {board.map((row, r) =>
                            row.map((cell, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className={`
                                    rounded-sm flex items-center justify-center text-xl md:text-3xl transition-all duration-300
                                    ${(r + c) % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}
                                    ${cell === 1 ? 'bg-accent/40 shadow-[inset_0_0_20px_rgba(112,0,255,0.5)]' : ''}
                                `}
                                >
                                    <AnimatePresence>
                                        {cell === 1 && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                            >
                                                <Crown className="text-accent fill-accent" width="60%" height="60%" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            ) : (
                <Card className="p-8 bg-black/40 border-accent/20 overflow-hidden relative" style={{ width: 'min(80vw, 500px)', height: 'min(80vw, 500px)' }}>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {triangles.map((pts, i) => (
                            <motion.polygon
                                key={i}
                                points={pts.map(p => p.join(',')).join(' ')}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="fill-accent/60 stroke-accent/40 stroke-[0.1]"
                            />
                        ))}
                    </svg>
                </Card>
            )}
        </div>
    );
}
