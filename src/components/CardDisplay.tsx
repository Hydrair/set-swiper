'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import TinderCard from 'react-tinder-card';
import { useAppStore } from '@/lib/store';
import { searchCard } from '@/lib/scryfall';
import { MagicCard } from '@/types/card';
import { Heart, X } from 'lucide-react';

export default function CardDisplay() {
  const { 
    cardList, 
    currentCardIndex, 
    favorites, 
    isLoading, 
    error,
    nextCard, 
    addToFavorites, 
    setLoading, 
    setError 
  } = useAppStore();

  const [currentCard, setCurrentCard] = useState<MagicCard | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const tinderCardRef = useRef<any>(null);

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
          if (error.message.includes('Scryfall API')) {
            setError('Scryfall API is currently experiencing issues. Please try again later.');
          } else {
            setError(error.message);
          }
        } else {
          setError('Failed to load card. Please try again.');
        }
        console.error('Error loading card:', error);
      } finally {
        setIsLoadingCard(false);
      }
    };

    loadCard();
  }, [cardList, currentCardIndex, nextCard, setError]);

  const onSwipe = (direction: string) => {
    console.log('You swiped: ' + direction);
    setSwipeDirection(direction);
    
    if (direction === 'right' && currentCard) {
      addToFavorites(currentCard);
    }
    
    // Move to next card after a short delay
    setTimeout(() => {
      nextCard();
      setSwipeDirection(null);
    }, 300);
  };

  const onCardLeftScreen = (direction: string) => {
    console.log(currentCard?.name + ' left the screen in direction: ' + direction);
  };

  const handleSwipeRight = () => {
    if (tinderCardRef.current) {
      tinderCardRef.current.swipe('right');
    }
  };

  const handleSwipeLeft = () => {
    if (tinderCardRef.current) {
      tinderCardRef.current.swipe('left');
    }
  };

  // Show completion screen
  if (cardList.length === 0) {
    return null;
  }

  if (currentCardIndex >= cardList.length) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            You've completed your deck!
          </h2>
          <p className="text-gray-600">
            You've swiped through all {cardList.length} cards.
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-700">
            Favorites: {favorites.length} cards
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full">
      {/* Progress indicator */}
      <div className="mb-6 text-center pt-4">
        <div className="text-sm text-gray-600 mb-2">
          Card {currentCardIndex + 1} of {cardList.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / cardList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Card display - centered in available space */}
      <div className="flex items-center justify-center px-4 relative flex-1">
        {/* Placeholder card behind the main card */}
        <div id="card-placeholder" className="relative w-full max-w-xs my-4">
          <div className="relative bg-gray-200 rounded-lg shadow-md overflow-hidden opacity-60">
            <div className="aspect-[745/1040] flex items-center justify-center bg-gray-300">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Next card</p>
              </div>
            </div>
            <div className="p-3">
              <div className="h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div id="main-card" className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-xs z-10">
          {isLoadingCard ? (
            <div id="loading-card" className="aspect-[745/1040] flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading card...</p>
              </div>
            </div>
          ) : currentCard ? (
            <TinderCard
              ref={tinderCardRef}
              onSwipe={onSwipe}
              onCardLeftScreen={onCardLeftScreen}
              swipeRequirementType="position"
              swipeThreshold={150}
              className="absolute w-full"
            >
              <div 
                id="swipeable-card"
                className="relative bg-white rounded-lg shadow-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
                onDragStart={(e) => e.preventDefault()}
              >
                <div className="relative aspect-[745/1040]">
                  <Image
                    src={currentCard.imageUrl}
                    alt={currentCard.name}
                    fill
                    className="object-cover select-none"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
                
                <div className="p-3">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {currentCard.name}
                  </h3>
                  {currentCard.manaCost && (
                    <p className="text-xs text-gray-600 mb-1">
                      Mana Cost: {currentCard.manaCost}
                    </p>
                  )}
                  {currentCard.type && (
                    <p className="text-xs text-gray-600">
                      {currentCard.type}
                    </p>
                  )}
                </div>
              </div>
            </TinderCard>
          ) : (
            <div id="no-card" className="aspect-[745/1040] flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-600">No card to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section with instructions and buttons */}
      <div className="mt-auto pt-6">
        {/* Swipe/Click buttons */}
        <div className="mb-4 flex justify-center space-x-12">
          <button
            id="skip-button"
            onClick={handleSwipeLeft}
            disabled={isLoadingCard}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label="Skip card"
          >
            <X className="w-8 h-8 text-red-600" />
          </button>
          
          <button
            id="like-button"
            onClick={handleSwipeRight}
            disabled={isLoadingCard}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label="Like card"
          >
            <Heart className="w-8 h-8 text-green-600" />
          </button>
        </div>
      </div>
    </div>
  );
} 