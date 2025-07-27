'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { Trash2, Download, Eye } from 'lucide-react';

export default function FavoritesList() {
  const { favorites, removeFromFavorites } = useAppStore();
  const [showImages, setShowImages] = useState(true);

  const exportFavorites = () => {
    const cardNames = favorites.map(card => card.name).join('\n');
    const blob = new Blob([cardNames], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'magic-card-favorites.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Favorites
        </h2>
        <p className="text-gray-600 text-center py-8">
          No favorite cards yet. Start swiping to add some!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Favorites ({favorites.length})
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImages(!showImages)}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showImages ? 'Hide Images' : 'Show Images'}
          </button>
          
          <button
            onClick={exportFavorites}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((card) => (
          <div
            key={card.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            {showImages && (
              <div className="relative aspect-[745/1040] mb-3 rounded overflow-hidden">
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
                <h3 className="font-semibold text-gray-800 mb-1">
                  {card.name}
                </h3>
                {card.manaCost && (
                  <p className="text-sm text-gray-600 mb-1">
                    Mana Cost: {card.manaCost}
                  </p>
                )}
                {card.type && (
                  <p className="text-sm text-gray-600">
                    {card.type}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => removeFromFavorites(card.id)}
                className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 