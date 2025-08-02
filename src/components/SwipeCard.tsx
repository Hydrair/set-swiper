"use client";

import Image from "next/image";
import TinderCard from "react-tinder-card";
import { MagicCard } from "@/types/card";

interface SwipeCardProps {
  card: MagicCard;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (direction: string) => void;
  isLoading?: boolean;
}

export default function SwipeCard({
  card,
  onSwipe,
  onCardLeftScreen,
  isLoading = false,
}: SwipeCardProps) {
  if (isLoading) {
    return (
      <div
        id="loading-card"
        className="aspect-[745/1040] flex items-center justify-center bg-theme-secondary rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-theme-secondary">Loading card...</p>
        </div>
      </div>
    );
  }

  return (
    <TinderCard
      onSwipe={onSwipe}
      onCardLeftScreen={onCardLeftScreen}
      swipeRequirementType="position"
      swipeThreshold={150}
      className="absolute w-full"
    >
      <div
        id="swipeable-card"
        className="relative bg-theme-card rounded-lg shadow-theme-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="relative aspect-[745/1040]">
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover select-none"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        <div className="p-2 md:p-3">
          <h3 className="text-sm md:text-base font-semibold text-theme-primary mb-1">
            {card.name}
          </h3>
          {card.manaCost && (
            <p className="text-xs text-theme-secondary mb-1">
              Mana Cost: {card.manaCost}
            </p>
          )}
          {card.type && (
            <p className="text-xs text-theme-secondary">{card.type}</p>
          )}
        </div>
      </div>
    </TinderCard>
  );
}
