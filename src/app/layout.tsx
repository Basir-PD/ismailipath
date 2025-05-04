import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { fetchCategories } from "./lib/notion";
import NavigationProvider from "./components/NavigationProvider";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await fetchCategories();

  return (
    <html lang="en" className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#f9f9f9]`}>
        <NavigationProvider>
          <Navbar />
          <div className="flex-grow flex">
            <Sidebar categories={categories} />
            <main className="flex-1 max-w-4xl mx-auto py-8 px-4 md:px-8">{children}</main>
          </div>
          <footer className="border-t py-4 mt-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} IsmailiPath. All rights reserved.</div>
          </footer>
        </NavigationProvider>
      </body>
    </html>
  );
}
