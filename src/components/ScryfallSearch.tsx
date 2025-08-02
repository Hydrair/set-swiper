"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import SortSelector from "./SortSelector";

interface ScryfallSearchProps {
  onCardsAdded: () => void;
}

export default function ScryfallSearch({ onCardsAdded }: ScryfallSearchProps) {
  const { addCards, setError } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 75));

      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("No cards found matching your search criteria.");
          return;
        }
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        setError("No cards found matching your search criteria.");
        return;
      }

      const cardNames = data.data.map((card: { name: string }) => card.name);
      addCards(cardNames);
      setSearchQuery("");
      onCardsAdded();
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search for cards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-theme-card rounded-lg shadow-theme-lg p-6">
      <h2 className="text-2xl font-bold text-theme-primary mb-4">
        Search with Scryfall Syntax
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="searchQuery"
            className="block text-sm font-medium text-theme-secondary mb-2"
          >
            Enter Scryfall search query:
          </label>
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-theme-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-theme-primary bg-theme-input"
            placeholder="e.g., c:red pow=3, c:blue t:instant"
            disabled={isLoading}
          />
        </div>

        <SortSelector />

        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Searching..." : "Search & Start Swiping!"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-theme-accent rounded-lg">
        <h3 className="text-lg font-semibold text-theme-accent mb-3">
          Scryfall Search Syntax Examples:
        </h3>
        <div className="space-y-2 text-sm text-theme-accent">
          <div>
            <strong>Color:</strong>{" "}
            <code className="bg-theme-accent px-1 rounded">c:red</code> (red
            cards), <code className="bg-theme-accent px-1 rounded">c:u</code>{" "}
            (blue cards)
          </div>
          <div>
            <strong>Power/Toughness:</strong>{" "}
            <code className="bg-theme-accent px-1 rounded">pow=3</code> (power
            3), <code className="bg-theme-accent px-1 rounded">tou&gt;5</code>{" "}
            (toughness &gt;5)
          </div>
          <div>
            <strong>Type:</strong>{" "}
            <code className="bg-theme-accent px-1 rounded">t:instant</code>{" "}
            (instants),{" "}
            <code className="bg-theme-accent px-1 rounded">t:creature</code>{" "}
            (creatures)
          </div>
          <div>
            <strong>Rarity:</strong>{" "}
            <code className="bg-theme-accent px-1 rounded">r:rare</code> (rare
            cards),{" "}
            <code className="bg-theme-accent px-1 rounded">r:mythic</code>{" "}
            (mythic cards)
          </div>
          <div>
            <strong>Combined:</strong>{" "}
            <code className="bg-theme-accent px-1 rounded">
              c:red pow=3 t:creature
            </code>{" "}
            (red creatures with power 3)
          </div>
          <div className="mt-3 text-xs">
            <a
              href="https://scryfall.com/docs/syntax"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-accent hover:text-theme-accent underline"
            >
              View full Scryfall syntax guide →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
