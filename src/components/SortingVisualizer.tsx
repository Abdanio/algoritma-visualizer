
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type SortStep = {
    array: number[];
    highlight: number[];
    description: string;
};

export default function SortingVisualizer() {
    const [array, setArray] = useState<number[]>([]);
    const [steps, setSteps] = useState<SortStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [algorithm, setAlgorithm] = useState("bubble");
    const [speed, setSpeed] = useState(50);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize random array
    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = () => {
        stopSorting();
        const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 95) + 5);
        setArray(newArray);
        setSteps([]);
        setCurrentStep(0);
    };

    const fetchSortingSteps = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/sort", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ array, algorithm }),
            });
            const data = await res.json();
            if (data.steps) {
                setSteps(data.steps);
                setCurrentStep(0);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Failed to fetch steps:", error);
        } finally {
            setLoading(false);
        }
    };

    const startSorting = () => {
        if (steps.length === 0) {
            fetchSortingSteps();
        } else {
            setIsPlaying(true);
        }
    };

    const stopSorting = () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            intervalRef.current = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, 200 - speed * 1.8); // Speed control
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [isPlaying, currentStep, steps, speed]);

    // Use the array from the current step if available, otherwise the initial array
    const currentArray = steps.length > 0 ? steps[currentStep]?.array : array;
    const highlightIndices = steps.length > 0 ? steps[currentStep]?.highlight : [];
    const description = steps.length > 0 ? steps[currentStep]?.description : "Ready to sort";

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {/* Controls */}
            <Card className="p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <select
                        value={algorithm}
                        onChange={(e) => {
                            setAlgorithm(e.target.value);
                            setSteps([]);
                            setCurrentStep(0);
                        }}
                        className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                        disabled={isPlaying}
                    >
                        <option value="bubble">Bubble Sort</option>
                        <option value="quick">Quick Sort</option>
                        <option value="merge">Merge Sort</option>
                    </select>

                    <Button variant="outline" onClick={resetArray} disabled={isPlaying}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                </div>

                <div className="flex items-center gap-4 flex-1 justify-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Speed</span>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-32 accent-primary appearance-none h-2 bg-white/10 rounded-full outline-none"
                    />
                </div>

                <Button
                    variant={isPlaying ? "secondary" : "primary"}
                    onClick={isPlaying ? stopSorting : startSorting}
                    className="min-w-[120px]"
                >
                    {isPlaying ? (
                        <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : (
                        <><Play className="w-4 h-4 mr-2" /> Start</>
                    )}
                </Button>
            </Card>

            {/* Visualization Area */}
            <Card className="min-h-[400px] flex flex-col justify-end p-8 relative overflow-hidden">
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
                        <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Algorithm</span>
                        <span className="text-primary font-bold">{algorithm.replace(/^\w/, c => c.toUpperCase())} Sort</span>
                    </div>

                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5 max-w-md text-right">
                        <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Current Step</span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={description}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-white text-sm font-medium"
                            >
                                {description}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-end justify-center gap-1.5 h-[300px] w-full">
                    {currentArray?.map((value, idx) => (
                        <motion.div
                            layout
                            key={idx} // Using index as key for now since values are not unique/stable identifiers in simple array sorts without IDs
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`rounded-t-sm w-full relative group overflow-hidden ${highlightIndices?.includes(idx)
                                    ? "bg-secondary shadow-[0_0_15px_#ff00ff]"
                                    : "bg-primary/80 hover:bg-primary"
                                }`}
                            style={{ height: `${value}%` }}
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
