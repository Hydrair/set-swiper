'use client';

import { Heart, Plus, Home } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Auth from './Auth';
import Logo from './Logo';

interface NavigationProps {
  currentView: 'input' | 'swipe' | 'favorites';
  onViewChange: (view: 'input' | 'swipe' | 'favorites') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { favorites } = useAppStore();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1">
              <button
                onClick={() => onViewChange('input')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'input'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Cards
              </button>
              
              <button
                onClick={() => onViewChange('swipe')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'swipe'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Swipe
              </button>
              
              <button
                onClick={() => onViewChange('favorites')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  currentView === 'favorites'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-4 h-4 mr-1" />
                Favorites
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
            
            <Auth />
          </div>
        </div>
      </div>
    </nav>
  );
} 