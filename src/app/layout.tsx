import type { Metadata } from "next";
import { Outfit, Roboto_Mono } from "next/font/google"; // Use Roboto Mono for code
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const mono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Algorithm Visualizer Pro | Parchezzi Tech",
  description: "A premium, real-time algorithm visualizer for learning and exploration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${mono.variable} antialiased bg-background text-foreground`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#0a0a0a] bg-[radial-gradient(#ffffff33_1px,#0a0a0a_1px)] [background-size:20px_20px] opacity-10"></div>
        {children}
      </body>
    </html>
  );
}
