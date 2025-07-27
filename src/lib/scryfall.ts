import { MagicCard } from '@/types/card';

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
}

export async function searchCard(cardName: string): Promise<MagicCard | null> {
  try {
    const response = await fetch(
      `${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodeURIComponent(cardName)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Card not found: ${cardName}`);
        return null;
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

    return {
      id: card.id,
      name: card.name,
      imageUrl,
      manaCost: card.mana_cost,
      type: card.type_line,
      rarity: card.rarity,
    };
  } catch (error) {
    console.error(`Error fetching card ${cardName}:`, error);
    return null;
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