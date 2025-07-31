"use client";

import { Eye } from "lucide-react";

export default function EmptyFavorites() {
  return (
    <div
      id="favorites-list"
      className="w-full max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No favorites yet
        </h2>
        <p className="text-gray-600">
          Start swiping to add cards to your favorites!
        </p>
      </div>
    </div>
  );
}
