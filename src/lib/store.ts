import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, MagicCard } from '@/types/card';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      cardList: [],
      currentCardIndex: 0,
      favorites: [],
      isLoading: false,
      error: null,
      sortBy: 'alphabetical',

      // Actions
      addCards: (cardNames: string[]) => {
        const cleanNames = cardNames
          .map(name => name.trim())
          .filter(name => name.length > 0);

        set({
          cardList: cleanNames,
          currentCardIndex: 0,
          error: null
        });
      },

      removeCard: (index: number) => {
        const { cardList } = get();
        const newList = cardList.filter((_, i) => i !== index);
        set({
          cardList: newList,
          currentCardIndex: Math.min(get().currentCardIndex, newList.length - 1)
        });
      },

      nextCard: () => {
        const { currentCardIndex, cardList } = get();
        if (currentCardIndex < cardList.length) {
          set({ currentCardIndex: currentCardIndex + 1 });
        }
      },

      addToFavorites: (card: MagicCard) => {
        const { favorites } = get();
        if (!favorites.find(fav => fav.id === card.id)) {
          set({ favorites: [...favorites, card] });
        }
      },

      removeFromFavorites: (cardId: string) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter(card => card.id !== cardId)
        });
      },

      resetProgress: () => {
        set({ currentCardIndex: 0 });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setSortBy: (sortBy: 'alphabetical' | 'setNumber' | 'manaValue' | 'type') => {
        set({ sortBy });
      },
    }),
    {
      name: 'set-swiper-storage',
      partialize: (state) => ({
        cardList: state.cardList,
        currentCardIndex: state.currentCardIndex,
        favorites: state.favorites,
        sortBy: state.sortBy,
      }),
    }
  )
); 