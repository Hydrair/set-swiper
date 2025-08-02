"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  getAllSets,
  getSetCards,
  getPopularSets,
  ScryfallSet,
} from "@/lib/scryfall";
import { Search, Loader2 } from "lucide-react";
import SortSelector from "./SortSelector";

interface SetInputProps {
  onCardsAdded: () => void;
}

export default function SetInput({ onCardsAdded }: SetInputProps) {
  const { addCards, setError } = useAppStore();
  const [sets, setSets] = useState<ScryfallSet[]>([]);
  const [popularSets, setPopularSets] = useState<ScryfallSet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSets, setIsLoadingSets] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      try {
        setIsLoadingSets(true);
        const [allSets, popular] = await Promise.all([
          getAllSets(),
          getPopularSets(),
        ]);
        setSets(allSets);
        setPopularSets(popular);
      } catch (error) {
        console.error("Error loading sets:", error);
        setError("Failed to load sets. Please try again.");
      } finally {
        setIsLoadingSets(false);
      }
    };

    loadSets();
  }, [setError]);

  const handleSetClick = async (setCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const cardNames = await getSetCards(setCode);

      if (cardNames.length === 0) {
        setError("No cards found in this set.");
        return;
      }

      addCards(cardNames);
      onCardsAdded();
    } catch (error) {
      console.error("Error loading set cards:", error);
      setError("Failed to load cards from this set. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSets = sets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPopularSets = popularSets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-theme-card rounded-lg shadow-theme-lg h-[calc(100vh-200px)] min-h-[600px] flex flex-col">
      <div className="p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-theme-primary mb-4">
          Add Cards by Set
        </h2>
        <div className="space-y-4">
          <SortSelector />

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
            <input
              type="text"
              placeholder="Search sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-theme-primary border-theme-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-theme-input"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
        {isLoadingSets ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-theme-secondary">Loading sets...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Popular Sets */}
            {filteredPopularSets.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-theme-primary mb-3">
                  Popular Sets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPopularSets.map((set) => (
                    <button
                      key={set.code}
                      onClick={() => handleSetClick(set.code)}
                      disabled={isLoading}
                      className="flex items-center justify-between p-3 border border-theme-primary rounded-lg hover:bg-theme-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-medium text-theme-primary">
                          {set.name}
                        </div>
                        <div className="text-sm text-theme-secondary">
                          {set.code.toUpperCase()} • {set.card_count} cards
                        </div>
                      </div>
                      {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Sets */}
            {filteredSets.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-theme-primary mb-3">
                  All Sets
                </h3>
                <div className="space-y-2">
                  {filteredSets.map((set) => (
                    <button
                      key={set.code}
                      onClick={() => handleSetClick(set.code)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-between p-3 border border-theme-primary rounded-lg hover:bg-theme-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-medium text-theme-primary">
                          {set.name}
                        </div>
                        <div className="text-sm text-theme-secondary">
                          {set.code.toUpperCase()} • {set.card_count} cards •{" "}
                          {new Date(set.released_at).getFullYear()}
                        </div>
                      </div>
                      {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredSets.length === 0 &&
              filteredPopularSets.length === 0 &&
              searchTerm && (
                <div className="text-center py-8 text-theme-tertiary">
                  No sets found matching &quot;{searchTerm}&quot;
                </div>
              )}
          </div>
        )}
      </div>

      <div className="p-6 flex-shrink-0 text-sm text-theme-tertiary">
        <p className="mb-2">
          <strong>Tips:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click on any set to add all its cards to your deck</li>
          <li>Use the search to find specific sets</li>
          <li>Popular sets are shown first for easy access</li>
          <li>Choose your preferred sorting method before adding cards</li>
        </ul>
      </div>
    </div>
  );
}
