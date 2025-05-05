"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
}

export default function SearchModal({ isOpen, onClose, categories }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle mounting state for client-side rendering
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Focus the search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 inset-x-0 mx-auto max-w-2xl w-[90%] bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center border-b-2 border-[var(--neutral-200)] pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for articles, topics, or categories..."
                    className="w-full outline-none text-lg"
                    autoComplete="off"
                  />
                  {searchTerm && (
                    <button type="button" onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button type="submit" className="absolute -top-10 left-0 opacity-0">
                  Search
                </button>
              </form>
            </div>

            {/* Quick categories */}
            <div className="px-4 pt-2 pb-4">
              <p className="text-sm text-gray-500 mb-2">Popular Categories:</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    className="px-3 py-1 text-sm bg-[var(--neutral-100)] hover:bg-[var(--neutral-200)] rounded-md transition-colors"
                    onClick={() => {
                      router.push(`/categories/${encodeURIComponent(category.name)}`);
                      onClose();
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
