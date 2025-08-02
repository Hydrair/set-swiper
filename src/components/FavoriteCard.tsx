"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { MagicCard } from "@/types/card";

interface FavoriteCardProps {
  card: MagicCard;
  onRemove: (cardId: string) => void;
  showImage?: boolean;
}

export default function FavoriteCard({
  card,
  onRemove,
  showImage = true,
}: FavoriteCardProps) {
  if (showImage) {
    return (
      <div className="bg-theme-secondary rounded-lg p-4 border border-theme-primary hover:shadow-theme-md transition-shadow w-50 h-80">
        <div className="relative aspect-[745/1040] mb-3 rounded-lg overflow-hidden bg-theme-tertiary hover:scale-105 transition-all duration-300">
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-theme-primary mb-1 line-clamp-2"
              title={card.name}
            >
              {card.name}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <button
              onClick={() => onRemove(card.id)}
              className="p-1 text-theme-tertiary hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove from favorites"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {card.setNumber && (
              <p className="text-xs text-theme-tertiary mt-1">
                #{card.setNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-primary hover:shadow-theme-md transition-shadow">
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-theme-primary mb-1 line-clamp-2"
          title={card.name}
        >
          {card.name}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-theme-secondary">
          {card.manaCost && <span>Mana: {card.manaCost}</span>}
          {card.type && <span>Type: {card.type}</span>}
          {card.setNumber && <span>Set #: {card.setNumber}</span>}
          {card.manaValue && <span>CMC: {card.manaValue}</span>}
        </div>
      </div>
      <button
        onClick={() => onRemove(card.id)}
        className="ml-4 p-2 text-theme-tertiary hover:text-red-500 transition-colors flex-shrink-0"
        aria-label="Remove from favorites"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
