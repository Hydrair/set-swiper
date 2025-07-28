import { MagicCard } from '@/types/card';
import { scryfallCache, CACHE_KEYS } from './cache';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

export interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
  };
  card_faces?: Array<{
    name: string;
    image_uris?: {
      normal: string;
    };
  }>;
  mana_cost?: string;
  type_line?: string;
  rarity?: string;
  collector_number?: string;
  cmc?: number;
}

export interface ScryfallSet {
  code: string;
  name: string;
  released_at: string;
  card_count: number;
}

export async function searchCard(cardName: string): Promise<MagicCard | null> {
  const cacheKey = CACHE_KEYS.CARD(cardName);
  
  // Check cache first
  const cached = scryfallCache.get<MagicCard>(cacheKey);
  if (cached) {
    console.log(`Cache hit for card: ${cardName}`);
    return cached;
  }

  try {
    const response = await fetch(
      `${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodeURIComponent(cardName)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Card not found: ${cardName}`);
        return null;
      }
      if (response.status >= 500) {
        throw new Error('Scryfall API is currently experiencing issues. Please try again later.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const card: ScryfallCard = await response.json();
    
    // Handle double-faced cards
    let imageUrl = '';
    if (card.image_uris?.normal) {
      imageUrl = card.image_uris.normal;
    } else if (card.card_faces?.[0]?.image_uris?.normal) {
      imageUrl = card.card_faces[0].image_uris.normal;
    }

    if (!imageUrl) {
      console.warn(`No image found for card: ${cardName}`);
      return null;
    }

    const magicCard: MagicCard = {
      id: card.id,
      name: card.name,
      imageUrl,
      manaCost: card.mana_cost,
      type: card.type_line,
      rarity: card.rarity,
      setNumber: card.collector_number,
      manaValue: card.cmc,
    };

    // Cache the result
    scryfallCache.set(cacheKey, magicCard);
    console.log(`Cached card: ${cardName}`);

    return magicCard;
  } catch (error) {
    console.error(`Error fetching card ${cardName}:`, error);
    if (error instanceof Error && error.message.includes('Scryfall API')) {
      throw error;
    }
    throw new Error('Failed to load card data. Please check your connection and try again.');
  }
}

export async function searchMultipleCards(cardNames: string[]): Promise<MagicCard[]> {
  const cards: MagicCard[] = [];
  
  for (const name of cardNames) {
    // Add delay to respect rate limits
    if (cards.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const card = await searchCard(name);
    if (card) {
      cards.push(card);
    }
  }
  
  return cards;
}

export async function getAllSets(): Promise<ScryfallSet[]> {
  const cacheKey = CACHE_KEYS.SETS;
  
  // Check cache first
  const cached = scryfallCache.get<ScryfallSet[]>(cacheKey);
  if (cached) {
    console.log('Cache hit for all sets');
    return cached;
  }

  try {
    const response = await fetch(`${SCRYFALL_API_BASE}/sets`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const sets = data.data || [];
    
    // Cache the result with longer TTL (7 days for sets)
    scryfallCache.set(cacheKey, sets, 7 * 24 * 60 * 60 * 1000);
    console.log('Cached all sets');
    
    return sets;
  } catch (error) {
    console.error('Error fetching all sets:', error);
    throw new Error('Failed to load sets. Please try again.');
  }
}

export async function searchSets(query: string): Promise<ScryfallSet[]> {
  try {
    const allSets = await getAllSets();
    if (!query.trim()) { return allSets; }
    const searchTerm = query.toLowerCase();
    return allSets.filter(set =>
      set.name.toLowerCase().includes(searchTerm) ||
      set.code.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching sets:', error);
    throw new Error('Failed to search sets. Please try again.');
  }
}

export async function getSetCards(setCode: string): Promise<string[]> {
  const cacheKey = CACHE_KEYS.SET_CARDS(setCode);
  
  // Check cache first
  const cached = scryfallCache.get<string[]>(cacheKey);
  if (cached) {
    console.log(`Cache hit for set cards: ${setCode}`);
    return cached;
  }

  try {
    const response = await fetch(`${SCRYFALL_API_BASE}/cards/search?q=s:${setCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const cardNames = data.data.map((card: any) => card.name as string);
    const uniqueCardNames = [...new Set(cardNames)];
    
    // Cache the result with longer TTL (7 days for set cards)
    scryfallCache.set(cacheKey, uniqueCardNames, 7 * 24 * 60 * 60 * 1000);
    console.log(`Cached set cards: ${setCode}`);
    
    return uniqueCardNames as string[];
  } catch (error) {
    console.error(`Error fetching set cards for ${setCode}:`, error);
    throw new Error(`Failed to load cards from set ${setCode}. Please try again.`);
  }
}

export async function getPopularSets(): Promise<ScryfallSet[]> {
  const cacheKey = CACHE_KEYS.POPULAR_SETS;
  
  // Check cache first
  const cached = scryfallCache.get<ScryfallSet[]>(cacheKey);
  if (cached) {
    console.log('Cache hit for popular sets');
    return cached;
  }

  try {
    const allSets = await getAllSets();
    
    // Filter for recent popular sets (last 2 years, excluding special sets)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    const popularSets = allSets
      .filter(set => {
        const releaseDate = new Date(set.released_at);
        return releaseDate >= twoYearsAgo && 
               set.card_count > 50 && 
               !set.code.includes('p') && // Exclude promo sets
               !set.code.includes('t') && // Exclude token sets
               !set.name.toLowerCase().includes('promo');
      })
      .sort((a, b) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime())
      .slice(0, 20); // Top 20 recent popular sets
    
    // Cache the result with longer TTL (7 days for popular sets)
    scryfallCache.set(cacheKey, popularSets, 7 * 24 * 60 * 60 * 1000);
    console.log('Cached popular sets');
    
    return popularSets;
  } catch (error) {
    console.error('Error fetching popular sets:', error);
    throw new Error('Failed to load popular sets. Please try again.');
  }
} 