
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const ROWS = 15;
const COLS = 20;

type Node = {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    isPath: boolean;
};

export default function PathfindingVisualizer() {
    const [grid, setGrid] = useState<Node[][]>([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [algorithm, setAlgorithm] = useState("dijkstra");

    // Refs for animation
    const animationSpeed = 20;
    const timeouts = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        initializeGrid();
    }, []);

    const initializeGrid = () => {
        const newGrid = [];
        for (let row = 0; row < ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < COLS; col++) {
                currentRow.push(createNode(col, row));
            }
            newGrid.push(currentRow);
        }
        setGrid(newGrid);
    };

    const createNode = (col: number, row: number) => {
        return {
            col,
            row,
            isStart: row === 7 && col === 4,
            isEnd: row === 7 && col === 15,
            isWall: false,
            isVisited: false,
            isPath: false,
        };
    };

    const clearPath = () => {
        const newGrid = grid.map(row => row.map(node => ({
            ...node,
            isVisited: false,
            isPath: false
        })));
        setGrid(newGrid);
        stopAnimation();
    };

    const resetGrid = () => {
        initializeGrid();
        stopAnimation();
        setIsPlaying(false);
    };

    const stopAnimation = () => {
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
        setIsPlaying(false);
    };

    const handleMouseDown = (row: number, col: number) => {
        if (isPlaying) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!mouseIsPressed || isPlaying) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
    };

    const getNewGridWithWallToggled = (grid: Node[][], row: number, col: number) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        if (node.isStart || node.isEnd) return newGrid; // Don't toggle start/end

        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    const visualizeAlgorithm = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        clearPath();

        // Prepare grid for backend (0: empty, 1: wall)
        const backendGrid = grid.map(row => row.map(node => node.isWall ? 1 : 0));
        const startNode = grid.flat().find(n => n.isStart);
        const endNode = grid.flat().find(n => n.isEnd);

        try {
            const res = await fetch("/api/pathfind", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grid: backendGrid,
                    start: [startNode?.row, startNode?.col],
                    end: [endNode?.row, endNode?.col],
                    algorithm
                }),
            });

            const data = await res.json();
            if (data.steps) {
                animateAlgorithm(data.steps);
            }
        } catch (error) {
            console.error("Pathfinding error:", error);
            setIsPlaying(false);
        }
    };

    const animateAlgorithm = (steps: any[]) => {
        let delay = 0;

        steps.forEach((step) => {
            if (step.type === "visit") {
                step.nodes.forEach((pos: number[]) => {
                    const timeout = setTimeout(() => {
                        setGrid((prevGrid) => {
                            const newGrid = prevGrid.map(row => [...row]);
                            if (newGrid[pos[0]] && newGrid[pos[0]][pos[1]]) {
                                newGrid[pos[0]][pos[1]] = { ...newGrid[pos[0]][pos[1]], isVisited: true };
                            }
                            return newGrid;
                        });
                    }, delay);
                    timeouts.current.push(timeout);
                    delay += animationSpeed;
                });
            } else if (step.type === "path") {
                step.nodes.forEach((pos: number[]) => {
                    const timeout = setTimeout(() => {
                        setGrid((prevGrid) => {
                            const newGrid = prevGrid.map(row => [...row]);
                            if (newGrid[pos[0]] && newGrid[pos[0]][pos[1]]) {
                                newGrid[pos[0]][pos[1]] = { ...newGrid[pos[0]][pos[1]], isPath: true };
                            }
                            return newGrid;
                        });
                    }, delay);
                    timeouts.current.push(timeout);
                    delay += animationSpeed * 2; // Path animation is slower/more emphasized
                });
            }
        });

        const finishTimeout = setTimeout(() => setIsPlaying(false), delay);
        timeouts.current.push(finishTimeout);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto select-none" onMouseUp={handleMouseUp}>
            <Card className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                            disabled={isPlaying}
                        >
                            <option value="dijkstra">Dijkstra's Algorithm</option>
                            <option value="astar">A* Search</option>
                            <option value="bfs">Breadth-First Search (BFS)</option>
                            <option value="dfs">Depth-First Search (DFS)</option>
                        </select>

                        <Button variant="outline" onClick={resetGrid} disabled={isPlaying} className="px-4">
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm shadow-[0_0_10px_#22c55e]"></div> Start</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm shadow-[0_0_10px_#ef4444]"></div> End</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white/20 rounded-sm"></div> Wall</div>
                    </div>

                    <Button
                        variant={isPlaying ? "secondary" : "primary"}
                        onClick={visualizeAlgorithm}
                        disabled={isPlaying}
                        className="w-full md:w-auto shadow-lg"
                    >
                        {isPlaying ? (
                            <><Pause className="w-4 h-4 mr-2" /> Visualizing...</>
                        ) : (
                            <><Play className="w-4 h-4 mr-2" /> Find Path</>
                        )}
                    </Button>
                </div>
            </Card>

            <Card className="p-4 md:p-8 flex justify-center items-center bg-black/40 overflow-x-auto">
                <div
                    className="grid gap-[2px] bg-white/5 p-1 rounded-lg"
                    style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
                >
                    {grid.map((row, rowIdx) =>
                        row.map((node, colIdx) => (
                            <motion.div
                                key={`${rowIdx}-${colIdx}`}
                                initial={false}
                                animate={{
                                    backgroundColor: node.isStart ? "#22c55e" :
                                        node.isEnd ? "#ef4444" :
                                            node.isPath ? "#eab308" :
                                                node.isVisited ? "rgba(0, 240, 255, 0.5)" :
                                                    node.isWall ? "rgba(255, 255, 255, 0.2)" :
                                                        "rgba(0, 0, 0, 0.3)",
                                    scale: node.isVisited || node.isPath ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                                className={`
                                w-6 h-6 md:w-8 md:h-8 rounded-[2px] cursor-pointer relative
                                ${node.isPath ? "shadow-[0_0_15px_#eab308] z-10" : ""}
                                ${node.isStart ? "shadow-[0_0_15px_#22c55e] z-10" : ""}
                                ${node.isEnd ? "shadow-[0_0_15px_#ef4444] z-10" : ""}
                            `}
                                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                            />
                        ))
                    )}
                </div>
            </Card>

            <p className="text-center text-muted-foreground text-sm">
                <MousePointer2 className="w-4 h-4 inline mr-1" /> Click and drag on the grid to draw walls.
            </p>
        </div>
    );
}
