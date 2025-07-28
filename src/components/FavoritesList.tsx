'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { Trash2, Download, Eye, ChevronDown } from 'lucide-react';

export default function FavoritesList() {
  const { favorites, removeFromFavorites, sortBy, setSortBy } = useAppStore();
  const [showImages, setShowImages] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'setNumber', label: 'By Set Number' },
    { value: 'manaValue', label: 'By Mana Value' },
    { value: 'type', label: 'By Type' }
  ] as const;

  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites];
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'setNumber':
        return sorted.sort((a, b) => {
          const aNum = parseInt(a.setNumber || '0') || 0;
          const bNum = parseInt(b.setNumber || '0') || 0;
          return aNum - bNum;
        });
      case 'manaValue':
        return sorted.sort((a, b) => {
          const aMana = a.manaValue || 0;
          const bMana = b.manaValue || 0;
          return aMana - bMana;
        });
      case 'type':
        return sorted.sort((a, b) => {
          const aType = a.type || '';
          const bType = b.type || '';
          return aType.localeCompare(bType);
        });
      default:
        return sorted;
    }
  }, [favorites, sortBy]);

  const exportFavorites = () => {
    const cardNames = sortedFavorites.map(card => card.name).join('\n');
    const blob = new Blob([cardNames], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg h-screen overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Favorites ({favorites.length})
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImages(!showImages)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showImages ? 'Hide Images' : 'Show Images'}
          </button>
          <button
            onClick={exportFavorites}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export List
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFavorites.map((card) => (
            <div key={card.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              {showImages && (
                <div className="relative aspect-[745/1040] mb-3 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{card.name}</h3>
                  {card.manaCost && (
                    <p className="text-xs text-gray-600 mb-1">
                      Mana Cost: {card.manaCost}
                    </p>
                  )}
                  {card.type && (
                    <p className="text-xs text-gray-600 mb-1">
                      {card.type}
                    </p>
                  )}
                  {card.setNumber && (
                    <p className="text-xs text-gray-500 mt-1">#{card.setNumber}</p>
                  )}
                </div>
                <button
                  onClick={() => removeFromFavorites(card.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 