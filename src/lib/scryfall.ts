import { scryfallCache, CACHE_KEYS } from './cache';
import { MagicCard } from '@/types/card';
import { CONFIG } from './config';

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

interface ScryfallList<T> {
  data: T[];
  has_more: boolean;
  next_page?: string;
  total_cards?: number;
}

type RateLimitBucket = 'search' | 'default';

const RATE_LIMIT_DELAYS: Record<RateLimitBucket, number> = {
  search: CONFIG.SCRYFALL_SEARCH_DELAY,
  default: CONFIG.SCRYFALL_DELAY,
};

const MAX_RATE_LIMIT_RETRIES = 3;

// Requests are chained per bucket so concurrent callers can't exceed the rate limit
const rateLimitQueues: Record<RateLimitBucket, Promise<void>> = {
  search: Promise.resolve(),
  default: Promise.resolve(),
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function waitForRateLimit(bucket: RateLimitBucket): Promise<void> {
  const turn = rateLimitQueues[bucket];
  rateLimitQueues[bucket] = turn.then(() => sleep(RATE_LIMIT_DELAYS[bucket]));
  return turn;
}

async function scryfallFetch(url: string, bucket: RateLimitBucket): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    await waitForRateLimit(bucket);

    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    if (response.status !== 429 || attempt >= MAX_RATE_LIMIT_RETRIES) {
      return response;
    }

    // Back off before retrying, honoring Retry-After if Scryfall sends it
    const retryAfter = Number(response.headers.get('Retry-After'));
    const backoff = retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
    console.warn(`Scryfall rate limit hit, retrying in ${backoff}ms`);
    await sleep(backoff);
  }
}

/**
 * Fetches every page of a Scryfall card search by following `next_page`.
 * Returns an empty list if the query matches no cards.
 */
export async function searchAllCardNames(
  query: string,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const allCardNames: string[] = [];
  let nextUrl: string | undefined =
    `${SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(query)}`;
  let page = 0;

  while (nextUrl) {
    if (++page > CONFIG.SCRYFALL_MAX_PAGES) {
      console.warn('Reached maximum page limit, stopping pagination');
      break;
    }

    const response = await scryfallFetch(nextUrl, 'search');

    if (!response.ok) {
      // Scryfall answers 404 when a query has no matches
      if (response.status === 404 && page === 1) {
        return [];
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data: ScryfallList<{ name: string }> = await response.json();
    allCardNames.push(...data.data.map((card) => card.name));
    onProgress?.(allCardNames.length, data.total_cards ?? allCardNames.length);

    nextUrl = data.has_more ? data.next_page : undefined;
  }

  // Remove duplicates (some cards might appear multiple times)
  return [...new Set(allCardNames)];
}

export async function searchCard(cardName: string): Promise<MagicCard | null> {
  try {
    const cacheKey = CACHE_KEYS.CARD_SEARCH(cardName);
    const cached = scryfallCache.get<MagicCard>(cacheKey);
    if (cached) return cached;

    const response = await scryfallFetch(
      `${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodeURIComponent(cardName)}`,
      'search'
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const card: ScryfallCard = await response.json();

    const result: MagicCard = {
      id: card.id,
      name: card.name,
      imageUrl: card.image_uris?.normal || '',
      manaCost: card.mana_cost,
      type: card.type_line,
      rarity: card.rarity,
      setNumber: card.collector_number,
      manaValue: card.cmc,
    };

    scryfallCache.set(cacheKey, result, CONFIG.CARD_CACHE_DURATION);
    return result;
  } catch (error) {
    console.error('Error searching card:', error);
    throw new Error(`Failed to find card: ${cardName}`);
  }
}

export async function searchMultipleCards(cardNames: string[]): Promise<MagicCard[]> {
  const cards: MagicCard[] = [];

  for (const name of cardNames) {
    // searchCard is rate limited internally
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

    const response = await scryfallFetch(`${SCRYFALL_API_BASE}/sets`, 'default');

    if (!response.ok) {
      throw new Error(`Failed to fetch sets: ${response.status}`);
    }

    const data = await response.json();
    const sets = data.data as ScryfallSet[];

    scryfallCache.set(cacheKey, sets, CONFIG.CARD_CACHE_DURATION);
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

    const uniqueCardNames = await searchAllCardNames(`s:${setCode}`);

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

    scryfallCache.set(cacheKey, popularSets, CONFIG.CARD_CACHE_DURATION);
    return popularSets;
  } catch (error) {
    console.error('Error fetching popular sets:', error);
    throw new Error('Failed to load popular sets. Please try again.');
  }
} 