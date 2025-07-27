'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { searchMultipleCards } from '@/lib/scryfall';

interface CardInputProps {
  onCardsAdded?: () => void;
}

export default function CardInput({ onCardsAdded }: CardInputProps) {
  const [cardText, setCardText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addCards, setLoading, setError } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardText.trim()) {
      setError('Please enter some card names');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const cardNames = cardText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (cardNames.length === 0) {
        setError('Please enter at least one card name');
        return;
      }

      // Add cards to the list
      addCards(cardNames);
      
      // Clear the input
      setCardText('');
      
      // Trigger navigation callback if provided
      if (onCardsAdded) {
        onCardsAdded();
      }
      
    } catch (error) {
      setError('Failed to process cards. Please try again.');
      console.error('Error processing cards:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Add Your Magic Cards
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardInput" className="block text-sm font-medium text-gray-700 mb-2">
            Enter card names (one per line):
          </label>
          <textarea
            id="cardInput"
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            placeholder="Lightning Bolt&#10;Counterspell&#10;Black Lotus&#10;..."
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !cardText.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Start Swiping!'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2"><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Enter one card name per line</li>
          <li>Card names are case-insensitive</li>
          <li>Partial names work (e.g., "Lightning" will find "Lightning Bolt")</li>
          <li>Cards will be loaded from Scryfall as you swipe</li>
        </ul>
      </div>
    </div>
  );
} 