import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { fetchCategories } from "@/app/lib/notion";
import NavigationProvider from "@/app/components/NavigationProvider";
import Footer from "@/app/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "B. Payenda",
  description: "Discover spiritual knowledge and teachings on the Ismaili Path - Explore insightful articles on spirituality, history, and wisdom",
  keywords: "Ismaili, spirituality, knowledge, teachings, wisdom, guidance",
  authors: [{ name: "B. Payenda" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: "B. Payenda",
    description: "Discover spiritual knowledge and teachings on the Ismaili Path",
    url: "https://ismailipath.com",
    siteName: "B. Payenda",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await fetchCategories();

  return (
    <html lang="en" className="light scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${inter.variable} 
        antialiased min-h-screen flex flex-col bg-[var(--background)] overflow-x-hidden`}
      >
        <NavigationProvider>
          <Navbar />
          <div className="flex-grow flex relative">
            <Sidebar categories={categories} />
            <main className="flex-1 container-narrow py-6 md:py-8 transition-all duration-300 ease-in-out">{children}</main>
          </div>
          <Footer />
        </NavigationProvider>
      </body>
    </html>
  );
}
