"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { searchCard } from "@/lib/scryfall";
import { MagicCard } from "@/types/card";
import { Heart, X } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import CompletionScreen from "./CompletionScreen";
import SwipeCard from "./SwipeCard";

export default function CardDisplay() {
  const {
    cardList,
    currentCardIndex,
    favorites,
    error,
    nextCard,
    addToFavorites,
    setError,
  } = useAppStore();

  const [currentCard, setCurrentCard] = useState<MagicCard | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  // Load current card data
  useEffect(() => {
    if (cardList.length === 0 || currentCardIndex >= cardList.length) {
      setCurrentCard(null);
      return;
    }

    const loadCard = async () => {
      setIsLoadingCard(true);
      setError(null);

      try {
        const cardName = cardList[currentCardIndex];
        const cardData = await searchCard(cardName);

        if (cardData) {
          setCurrentCard(cardData);
        } else {
          setError(`Could not find card: ${cardName}`);
          // Auto-advance to next card if current one fails
          setTimeout(() => nextCard(), 2000);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("Scryfall API")) {
            setError(
              "Scryfall API is currently experiencing issues. Please try again later."
            );
          } else {
            setError(error.message);
          }
        } else {
          setError("Failed to load card. Please try again.");
        }
        console.error("Error loading card:", error);
      } finally {
        setIsLoadingCard(false);
      }
    };

    loadCard();
  }, [cardList, currentCardIndex, nextCard, setError]);

  const onSwipe = (direction: string) => {
    console.log("You swiped: " + direction);

    if (direction === "right" && currentCard) {
      addToFavorites(currentCard);
    }

    // Move to next card after a short delay
    setTimeout(() => {
      nextCard();
    }, 300);
  };

  const onCardLeftScreen = (direction: string) => {
    console.log(
      currentCard?.name + " left the screen in direction: " + direction
    );
  };

  const handleSwipeRight = () => {
    // This will be handled by the SwipeCard component
    onSwipe("right");
  };

  const handleSwipeLeft = () => {
    // This will be handled by the SwipeCard component
    onSwipe("left");
  };

  // Show completion screen
  if (cardList.length === 0) {
    return null;
  }

  if (currentCardIndex >= cardList.length) {
    return (
      <CompletionScreen
        totalCards={cardList.length}
        favoritesCount={favorites.length}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full">
      <ProgressIndicator
        currentIndex={currentCardIndex}
        totalCount={cardList.length}
      />

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Card display - centered in available space */}
      <div className="flex items-center justify-center px-4 relative flex-1">
        {/* Placeholder card behind the main card */}
        <div
          id="card-placeholder"
          className="relative w-full max-w-[280px] md:max-w-xs my-4"
        >
          <div className="relative bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-60">
            <div className="aspect-[745/1040] flex items-center justify-center bg-gray-300">
              <div className="text-center text-gray-500">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-400 rounded-full mx-auto mb-2"></div>
                <p className="text-xs md:text-sm">Next card</p>
              </div>
            </div>
            <div className="p-2 md:p-3">
              <div className="h-3 md:h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 md:h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div
          id="main-card"
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[280px] md:max-w-xs z-10"
        >
          {currentCard ? (
            <SwipeCard
              card={currentCard}
              onSwipe={onSwipe}
              onCardLeftScreen={onCardLeftScreen}
              isLoading={isLoadingCard}
            />
          ) : (
            <div
              id="no-card"
              className="aspect-[745/1040] flex items-center justify-center bg-gray-100 rounded-lg"
            >
              <p className="text-gray-600">No card to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section with instructions and buttons */}
      <div className="mt-auto pt-4 md:pt-6 pb-4">
        {/* Swipe/Click buttons */}
        <div className="mb-4 flex justify-center space-x-8 md:space-x-12">
          <button
            id="skip-button"
            onClick={handleSwipeLeft}
            disabled={isLoadingCard}
            className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label="Skip card"
          >
            <X className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          </button>

          <button
            id="like-button"
            onClick={handleSwipeRight}
            disabled={isLoadingCard}
            className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label="Like card"
          >
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
