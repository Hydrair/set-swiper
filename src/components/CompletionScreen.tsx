"use client";

import { Heart } from "lucide-react";

interface CompletionScreenProps {
  totalCards: number;
  favoritesCount: number;
  onRestart: () => void;
}

export default function CompletionScreen({
  totalCards,
  favoritesCount,
  onRestart,
}: CompletionScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          You&apos;ve completed your deck!
        </h2>
        <p className="text-gray-600">
          You&apos;ve swiped through all {totalCards} cards.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-lg font-semibold text-gray-700">
          Favorites: {favoritesCount} cards
        </p>
        <button
          onClick={onRestart}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
