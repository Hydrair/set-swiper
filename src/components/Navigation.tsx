"use client";

import { Heart, Plus, GalleryVerticalEnd } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  currentView: "input" | "swipe" | "favorites";
  onViewChange: (view: "input" | "swipe" | "favorites") => void;
}

export default function Navigation({
  currentView,
  onViewChange,
}: NavigationProps) {
  const { favorites } = useAppStore();

  return (
    <nav className="bg-theme-nav shadow-theme-sm border-b border-theme-primary">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onViewChange("input")}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to Add Cards"
          >
            <Logo />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <button
                onClick={() => onViewChange("input")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "input"
                    ? "bg-theme-accent text-theme-accent"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-button"
                }`}
              >
                <Plus className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Add Cards</span>
              </button>

              <button
                onClick={() => onViewChange("swipe")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "swipe"
                    ? "bg-theme-accent text-theme-accent"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-button"
                }`}
              >
                <GalleryVerticalEnd className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Swipe</span>
              </button>

              <button
                onClick={() => onViewChange("favorites")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  currentView === "favorites"
                    ? "bg-theme-accent text-theme-accent"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-button"
                }`}
              >
                <Heart className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
