import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IsmailiPath",
  description: "Discover spiritual knowledge and teachings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-grow">{children}</div>
        <footer className="border-t py-4 mt-8">
          <div className="max-w-2xl mx-auto px-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} IsmailiPath. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
