"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Eye, ChevronDown, Copy } from "lucide-react";

interface FavoritesHeaderProps {
  favoritesCount: number;
  sortBy: "alphabetical" | "setNumber" | "manaValue" | "type";
  onSortChange: (
    value: "alphabetical" | "setNumber" | "manaValue" | "type"
  ) => void;
  showImages: boolean;
  onToggleView: () => void;
  onExport: () => void;
  onCopy: () => void;
}

export default function FavoritesHeader({
  favoritesCount,
  sortBy,
  onSortChange,
  showImages,
  onToggleView,
  onExport,
  onCopy,
}: FavoritesHeaderProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "alphabetical", label: "Alphabetical" },
    { value: "setNumber", label: "By Set Number" },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value: (typeof sortOptions)[number]["value"]) => {
    onSortChange(value);
    setShowSortDropdown(false);
  };

  const currentSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ||
    "Alphabetical";

  return (
    <div className="flex justify-between items-center mb-6 flex-shrink-0">
      <h2 className="text-2xl font-bold text-theme-primary">
        Your Favorites ({favoritesCount})
      </h2>
      <div className="flex space-x-2">
        {/* Sort Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center px-3 py-2 text-sm bg-theme-button text-theme-secondary rounded-md hover:bg-theme-button-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <span className="hidden md:inline">Sort: {currentSortLabel}</span>
            <ChevronDown
              className={`w-4 h-4 md:ml-1 transition-transform ${
                showSortDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSortDropdown && (
            <div className="absolute z-10 right-0 mt-1 w-48 bg-theme-card border border-theme-primary rounded-md shadow-theme-lg">
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

        <button
          onClick={onToggleView}
          className="flex items-center px-3 py-2 text-sm bg-theme-button text-theme-secondary rounded-md hover:bg-theme-button-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Eye className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">
            {showImages ? "List View" : "Grid View"}
          </span>
        </button>
        <button
          onClick={onCopy}
          className="flex items-center px-3 py-2 text-sm bg-theme-button text-theme-secondary rounded-md hover:bg-theme-button-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Copy className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Copy List</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Download className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Export List</span>
        </button>
      </div>
    </div>
  );
}
