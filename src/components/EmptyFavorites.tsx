"use client";

import { Eye } from "lucide-react";

export default function EmptyFavorites() {
  return (
    <div
      id="favorites-list"
      className="w-full max-w-full mx-auto p-8 bg-theme-card rounded-lg shadow-theme-lg text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-theme-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-theme-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-theme-primary mb-2">
          No favorites yet
        </h2>
        <p className="text-theme-secondary">
          Start swiping to add cards to your favorites!
        </p>
      </div>
    </div>
  );
}
