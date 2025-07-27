'use client';

import { useAppStore } from '@/lib/store';
import { Heart, Plus, Home } from 'lucide-react';

type View = 'input' | 'swipe' | 'favorites';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { cardList, favorites } = useAppStore();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-800">
              Set Swiper
            </h1>
            
            <div className="flex space-x-1">
              <button
                onClick={() => onViewChange('input')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'input'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Cards
              </button>
              
              {cardList.length > 0 && (
                <button
                  onClick={() => onViewChange('swipe')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'swipe'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Swipe
                </button>
              )}
              
              <button
                onClick={() => onViewChange('favorites')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'favorites'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorites
                {favorites.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {cardList.length > 0 && (
            <div className="text-sm text-gray-600">
              {cardList.length} cards in deck
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 