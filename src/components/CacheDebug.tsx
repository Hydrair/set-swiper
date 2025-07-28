'use client';

import { useState, useEffect } from 'react';
import { Database, X } from 'lucide-react';
import { scryfallCache } from '@/lib/cache';

export default function CacheDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    keys: [] as string[]
  });

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const stats = scryfallCache.getStats();
      setCacheStats({
        size: stats.size,
        keys: stats.keys
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Database className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-gray-900">Cache Debug</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-1 text-xs text-gray-600">
        <div>Size: {cacheStats.size} items</div>
        <div>Keys: {cacheStats.keys.length}</div>
      </div>
    </div>
  );
} 