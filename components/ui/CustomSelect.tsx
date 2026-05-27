"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = "Select...", className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent border-b border-border/50 hover:border-border focus:border-moss outline-none py-[7px] text-[14px] font-ui transition-colors group cursor-pointer text-left"
      >
        <span className={!selectedOption ? "text-ink-tertiary" : "text-ink"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <CaretDown size={14} className="text-ink-tertiary group-hover:text-ink-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col py-1.5 max-h-[280px] overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-[14px] font-ui flex items-center justify-between transition-colors",
                  value === option.value 
                    ? "bg-moss-light text-moss font-medium" 
                    : "text-ink-secondary hover:bg-surface-hover hover:text-ink"
                )}
              >
                {option.label}
                {value === option.value && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                    <Check size={16} weight="bold" className="text-moss" />
                  </motion.div>
                )}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-4 py-3 text-[13px] font-ui text-ink-tertiary italic">
                No options available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
