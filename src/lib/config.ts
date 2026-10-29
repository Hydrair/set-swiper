// Configuration for the Set Swiper app
export const CONFIG = {
  // Path prefix the app is served from (e.g. /set-swiper on GitHub Pages)
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? '',

  // Cache duration for card data (in milliseconds)
  CARD_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours

  // Scryfall API rate limiting delay (in milliseconds)
  // See https://scryfall.com/docs/api/rate-limits
  SCRYFALL_DELAY: 100,

  // /cards/search and /cards/named are limited to 2 requests per second
  SCRYFALL_SEARCH_DELAY: 500,

  // Safety limit for paginated search results (175 cards per page)
  SCRYFALL_MAX_PAGES: 100,
} as const;
