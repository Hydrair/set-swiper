import { scryfallCache, CACHE_KEYS } from './cache';
import { MagicCard } from '@/types/card';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

export interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
  };
  mana_cost?: string;
  type_line?: string;
  rarity?: string;
  collector_number?: string;
  cmc?: number;
}

export interface ScryfallSet {
  code: string;
  name: string;
  card_count: number;
  released_at: string;
}

export async function searchCard(cardName: string): Promise<MagicCard | null> {
  try {
    const cacheKey = CACHE_KEYS.CARD_SEARCH(cardName);
    const cached = scryfallCache.get<MagicCard>(cacheKey);
    if (cached) return cached;

    // Add delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 75));

    const response = await fetch(`${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodeURIComponent(cardName)}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const card: ScryfallCard = await response.json();
    const imageUrl = card.image_uris?.normal || '';

    const result: MagicCard = {
      id: card.id,
      name: card.name,
      imageUrl,
      manaCost: card.mana_cost,
      type: card.type_line,
      rarity: card.rarity,
      setNumber: card.collector_number,
      manaValue: card.cmc,
    };

    scryfallCache.set(cacheKey, result, 24 * 60 * 60 * 1000); // 24 hour cache
    return result;
  } catch (error) {
    console.error('Error searching card:', error);
    throw new Error(`Failed to find card: ${cardName}`);
  }
}

export async function searchMultipleCards(cardNames: string[]): Promise<MagicCard[]> {
  const cards: MagicCard[] = [];

  for (const name of cardNames) {
    // Add delay to respect rate limits
    if (cards.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 75));
    }

    const card = await searchCard(name);
    if (card) {
      cards.push(card);
    }
  }

  return cards;
}

export async function getAllSets(): Promise<ScryfallSet[]> {
  try {
    const cacheKey = CACHE_KEYS.SETS_LIST;
    const cached = scryfallCache.get<ScryfallSet[]>(cacheKey);
    if (cached) return cached;

    // Add delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 75));

    const response = await fetch(`${SCRYFALL_API_BASE}/sets`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sets: ${response.status}`);
    }

    const data = await response.json();
    const sets = data.data as ScryfallSet[];

    scryfallCache.set(cacheKey, sets, 24 * 60 * 60 * 1000); // 24 hour cache
    console.log(sets);
    return sets;
  } catch (error) {
    console.error('Error fetching sets:', error);
    throw new Error('Failed to load sets. Please try again.');
  }
}

export async function searchSets(query: string): Promise<ScryfallSet[]> {
  try {
    const allSets = await getAllSets();
    return allSets.filter(set =>
      set.name.toLowerCase().includes(query.toLowerCase()) ||
      set.code.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching sets:', error);
    throw new Error('Failed to search sets. Please try again.');
  }
}

export async function getSetCards(setCode: string): Promise<string[]> {
  try {
    const cacheKey = CACHE_KEYS.SET_CARDS(setCode);
    const cached = scryfallCache.get<string[]>(cacheKey);
    if (cached) return cached;

    const allCardNames: string[] = [];
    let hasMore = true;
    let page = 1;

    while (hasMore) {
      // Add delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 75));

      const response = await fetch(
        `${SCRYFALL_API_BASE}/cards/search?q=s:${setCode}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch set cards: ${response.status}`);
      }

      const data = await response.json();
      const cardNames = data.data.map((card: { name: string }) => card.name) as string[];

      allCardNames.push(...cardNames);

      // Check if there are more pages
      hasMore = data.has_more;
      page++;
    }

    // Remove duplicates (some cards might appear multiple times in a set)
    const uniqueCardNames = [...new Set(allCardNames)];

    scryfallCache.set(cacheKey, uniqueCardNames, 60 * 60 * 1000); // 1 hour cache
    return uniqueCardNames;
  } catch (error) {
    console.error('Error fetching set cards:', error);
    throw new Error('Failed to load cards from this set. Please try again.');
  }
}

export async function getPopularSets(): Promise<ScryfallSet[]> {
  try {
    const cacheKey = CACHE_KEYS.POPULAR_SETS;
    const cached = scryfallCache.get<ScryfallSet[]>(cacheKey);
    if (cached) return cached;

    const allSets = await getAllSets();

    // Filter for popular/recent sets
    const popularSets = allSets
      .filter(set => {
        // Exclude non-standard sets
        const excludedCodes = ['fun', 'j21', 'j22', 'j23', 'mb1', 'pz1', 'pz2', 'pz3', 'pz4', 'pz5'];
        if (excludedCodes.includes(set.code)) return false;

        // Only include sets with reasonable card counts
        if (set.card_count < 10 || set.card_count > 500) return false;

        // Only include sets from recent years
        const releaseYear = new Date(set.released_at).getFullYear();
        return releaseYear >= 2015;
      })
      .sort((a, b) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime())
      .slice(0, 20); // Top 20 most recent popular sets

    scryfallCache.set(cacheKey, popularSets, 24 * 60 * 60 * 1000); // 24 hour cache
    return popularSets;
  } catch (error) {
    console.error('Error fetching popular sets:', error);
    throw new Error('Failed to load popular sets. Please try again.');
  }
} 