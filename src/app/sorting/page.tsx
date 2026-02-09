
"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

const SortingVisualizer = dynamic(() => import('@/components/SortingVisualizer'), {
    ssr: false,
});

export default function SortingPage() {
    return (
        <div className="min-h-screen relative py-12 px-6">
            {/* Background Glows */}
            <div className="absolute top-20 left-20 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                        Sorting Visualizer
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Select an algorithm and watch how elements are compared and swapped to achieve sorted order.
                        Powered by Python serverless functions.
                    </p>
                </header>

                <SortingVisualizer />
            </div>
        </div>
    );
}
