"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import FavoriteCard from "./FavoriteCard";
import FavoritesHeader from "./FavoritesHeader";
import EmptyFavorites from "./EmptyFavorites";

export default function FavoritesList() {
  const { favorites, removeFromFavorites, sortBy, setSortBy } = useAppStore();
  const [showImages, setShowImages] = useState(true);

  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites];
    switch (sortBy) {
      case "alphabetical":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "setNumber":
        return sorted.sort((a, b) => {
          const aNum = parseInt(a.setNumber || "0") || 0;
          const bNum = parseInt(b.setNumber || "0") || 0;
          return aNum - bNum;
        });
      default:
        return sorted;
    }
  }, [favorites, sortBy]);

  const exportFavorites = () => {
    const cardNames = sortedFavorites.map((card) => card.name).join("\n");
    const blob = new Blob([cardNames], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favorites.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (favorites.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <div
      id="favorites-list"
      className="w-full max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg h-[calc(100vh-100px)] flex flex-col"
    >
      <FavoritesHeader
        favoritesCount={favorites.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showImages={showImages}
        onToggleView={() => setShowImages(!showImages)}
        onExport={exportFavorites}
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        {showImages ? (
          // Grid view with images
          <div className="flex flex-wrap gap-4">
            {sortedFavorites.map((card) => (
              <FavoriteCard
                key={card.id}
                card={card}
                onRemove={removeFromFavorites}
                showImage={true}
              />
            ))}
          </div>
        ) : (
          // List view without images
          <div className="space-y-2">
            {sortedFavorites.map((card) => (
              <FavoriteCard
                key={card.id}
                card={card}
                onRemove={removeFromFavorites}
                showImage={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
