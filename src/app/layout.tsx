import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UVA Ranked - Student Voting Platform",
  description: "Vote on UVA students using ELO ranking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-[#232D4B] text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              UVA Ranked
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-[#E57200] transition-colors">
                Vote
              </Link>
              <Link href="/leaderboard" className="hover:text-[#E57200] transition-colors">
                Leaderboard
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
