import { NextRequest, NextResponse } from 'next/server';
import { scryfallCache, CACHE_KEYS } from '@/lib/cache';
import { CONFIG } from '@/lib/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  const cardId = searchParams.get('id');

  if (!imageUrl || !cardId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // Check if we have the image cached
    const cacheKey = CACHE_KEYS.CARD_IMAGE(cardId);
    const cachedImage = scryfallCache.get<{ data: string; contentType: string }>(cacheKey);

    if (cachedImage) {
      const imageBuffer = Buffer.from(cachedImage.data, 'base64');
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': cachedImage.contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
        },
      });
    }

    // Fetch the image from Scryfall
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Cache the image data
    const imageData = {
      data: Buffer.from(imageBuffer).toString('base64'),
      contentType,
    };

    scryfallCache.set(cacheKey, imageData, CONFIG.IMAGE_CACHE_DURATION);

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching card image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
