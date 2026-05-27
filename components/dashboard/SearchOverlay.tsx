"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useSearchOverlay } from "@/hooks/useSearchOverlay";
import { cn } from "@/lib/utils";

// Mock popular searches
const POPULAR_SEARCHES = [
  "Chevening",
  "Fully funded Masters",
  "DAAD Germany",
  "Swedish scholarships",
  "No GPA requirement",
  "Commonwealth"
];

interface SearchOverlayProps {
  scholarships?: any[];
}

export function SearchOverlay({ scholarships = [] }: SearchOverlayProps) {
  const { isOpen, closeSearch } = useSearchOverlay();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = scholarships.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.provider?.toLowerCase().includes(q) ||
        s.countryOfStudy?.toLowerCase().includes(q)
      ).slice(0, 10);
      setResults(filtered);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [query, scholarships]);

  const highlightMatch = (text: string, q: string) => {
    if (!q || !text) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === q.toLowerCase() ? (
            <span key={i} className="text-moss">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const handleSelect = (id: string) => {
    closeSearch();
    router.push(`/scholarship/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#161514]/70 backdrop-blur-md"
            onClick={closeSearch}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[640px] mx-4 bg-surface border border-border rounded-[24px] shadow-[0_32px_80px_rgba(22,21,20,0.2)] overflow-hidden flex flex-col"
          >
            {/* Input Row */}
            <div className="flex items-center gap-3 px-5 py-4.5 border-b border-border">
              <MagnifyingGlass size={20} className="text-ink-secondary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by scholarship, country, field..."
                className="flex-1 bg-transparent border-none outline-none font-ui text-[16px] text-ink placeholder:text-ink-tertiary"
              />
              <span className="shrink-0 border border-border font-ui text-[11px] text-ink-tertiary px-2 py-0.5 rounded-md uppercase tracking-wider">
                ESC
              </span>
            </div>

            {/* Results Area */}
            <div className="max-h-[420px] overflow-y-auto p-2 scrollbar-none">
              
              {!query.trim() && (
                <div className="py-4 px-3">
                  <div className="font-ui text-[11px] text-ink-tertiary uppercase tracking-wider mb-3 px-1">
                    POPULAR SEARCHES
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map(s => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="bg-surface border border-border text-ink-secondary hover:bg-surface-hover hover:text-ink hover:border-border-strong font-ui text-[13px] px-3.5 py-1.5 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && results.length > 0 && (
                <div className="flex flex-col gap-1">
                  {results.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelect(s.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-hover transition-colors text-left group"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                        (s.matchScore || 0) > 0.8 
                          ? "bg-moss-light border-moss text-moss" 
                          : "bg-surface border-border text-ink-secondary group-hover:bg-bg"
                      )}>
                        <span className="font-ui text-[11px] font-bold">
                          {Math.round((s.matchScore || 0) * 100)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col">
                        <span className="font-ui text-[14px] font-medium text-ink truncate">
                          {highlightMatch(s.title, query)}
                        </span>
                        <span className="font-ui text-[12px] text-ink-secondary truncate mt-0.5">
                          {s.provider} {s.countryOfStudy ? `· ${s.countryOfStudy}` : ""}
                        </span>
                      </div>

                      {s.deadline && (
                        <div className="shrink-0 border border-border font-ui text-[11px] font-medium px-2 py-0.5 rounded-full text-ink-secondary">
                          {new Date(s.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <span className="font-ui text-[14px] text-ink-secondary mb-1">
                    No scholarships found for &apos;{query}&apos;
                  </span>
                  <span className="font-ui text-[13px] text-ink-tertiary">
                    Try &apos;funded Masters&apos; or search by country
                  </span>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
