"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function SortSelector() {
  const { sortBy, setSortBy } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "alphabetical", label: "Alphabetical" },
    { value: "setNumber", label: "By Set Number" },
    { value: "manaValue", label: "By Mana Value" },
    { value: "type", label: "By Type" },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value: (typeof sortOptions)[number]["value"]) => {
    setSortBy(value);
    setIsOpen(false);
  };

  const currentSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ||
    "Alphabetical";

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-theme-secondary mb-2">
        <span className="hidden md:inline">Sort Cards By:</span>
        <span className="md:hidden">Sort:</span>
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-theme-primary rounded-md bg-theme-input text-theme-primary hover:bg-theme-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className="hidden md:inline">{currentSortLabel}</span>
        <span className="md:hidden">{currentSortLabel.split(" ").pop()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-theme-card border border-theme-primary rounded-md shadow-theme-lg">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-theme-button focus:outline-none focus:bg-theme-button transition-colors ${
                sortBy === option.value
                  ? "bg-theme-accent text-theme-accent"
                  : "text-theme-primary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
