"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import SetInput from "./SetInput";
import ScryfallSearch from "./ScryfallSearch";
import SortSelector from "./SortSelector";

interface CardInputProps {
  onCardsAdded: () => void;
}

export default function CardInput({ onCardsAdded }: CardInputProps) {
  const { addCards, setError } = useAppStore();
  const [inputMethod, setInputMethod] = useState<
    "individual" | "set" | "search"
  >("individual");
  const [cardInput, setCardInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardInput.trim()) {
      setError("Please enter at least one card name.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cardNames = cardInput
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (cardNames.length === 0) {
        setError("Please enter at least one valid card name.");
        return;
      }

      addCards(cardNames);
      setCardInput("");
      onCardsAdded();
    } catch (error) {
      setError("Failed to add cards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setInputMethod("individual")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMethod === "individual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Individual Cards
          </button>
          <button
            onClick={() => setInputMethod("set")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMethod === "set"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            By Set
          </button>
          <button
            onClick={() => setInputMethod("search")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMethod === "search"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Search
          </button>
        </div>
      </div>

      {inputMethod === "individual" ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add Your Magic Cards
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="cardInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter card names (one per line):
              </label>
              <textarea
                id="cardInput"
                value={cardInput}
                onChange={(e) => setCardInput(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
                placeholder="Lightning Bolt&#10;Counterspell&#10;Black Lotus&#10;..."
                disabled={isLoading}
              />
            </div>

            <SortSelector />

            <button
              type="submit"
              disabled={isLoading || !cardInput.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : "Start Swiping!"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Tips:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enter one card name per line</li>
              <li>Card names are case-insensitive</li>
              <li>Use exact card names for best results</li>
              <li>Choose your preferred sorting method before adding cards</li>
            </ul>
          </div>
        </div>
      ) : inputMethod === "set" ? (
        <SetInput onCardsAdded={onCardsAdded} />
      ) : (
        <ScryfallSearch onCardsAdded={onCardsAdded} />
      )}
    </div>
  );
}
