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
  SCRYFALL_DELAY: 75,
} as const;
