// Configuration for the Set Swiper app
export const CONFIG = {
  // Enable server-side image caching
  // Set to true to cache images on the server and reduce Scryfall API calls
  ENABLE_IMAGE_CACHING: false,

  // Cache duration for card data (in milliseconds)
  CARD_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours

  // Cache duration for card images (in milliseconds)
  IMAGE_CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Scryfall API rate limiting delay (in milliseconds)
  // See https://scryfall.com/docs/api/rate-limits
  SCRYFALL_DELAY: 100,

  // /cards/search and /cards/named are limited to 2 requests per second
  SCRYFALL_SEARCH_DELAY: 500,

  // Safety limit for paginated search results (175 cards per page)
  SCRYFALL_MAX_PAGES: 100,
} as const;
