export interface MagicCard {
  id: string;
  name: string;
  imageUrl: string;
  manaCost?: string;
  type?: string;
  rarity?: string;
  setNumber?: string;
  manaValue?: number;
}

export interface AppState {
  // Card list management
  cardList: string[];
  currentCardIndex: number;
  favorites: MagicCard[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Sort options
  sortBy: 'alphabetical' | 'setNumber' | 'manaValue' | 'type';
  
  // User management
  userId: string | null;
  
  // Actions
  addCards: (cardNames: string[]) => void;
  removeCard: (index: number) => void;
  nextCard: () => void;
  addToFavorites: (card: MagicCard) => void;
  removeFromFavorites: (cardId: string) => void;
  resetProgress: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSortBy: (sortBy: 'alphabetical' | 'setNumber' | 'manaValue' | 'type') => void;
  setUserId: (userId: string | null) => void;
  clearUserData: () => void;
} 