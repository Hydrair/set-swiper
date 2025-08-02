# PWA Setup Guide

## Overview

Set Swiper is now configured as a Progressive Web App (PWA) with the following features:

- ✅ **Web App Manifest** - Defines app metadata and icons
- ✅ **Service Worker** - Enables offline functionality and caching
- ✅ **Install Prompt** - Allows users to install the app on their device
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Theme Support** - Light and dark mode

## PWA Features

### 1. Installable

- Users can install the app on their home screen
- Works on Android (Chrome) and iOS (Safari)
- App runs in standalone mode (no browser UI)

### 2. Offline Support

- Service worker caches essential resources
- App works offline for basic functionality
- Automatic cache updates

### 3. App-like Experience

- Full-screen mode when installed
- Native app-like navigation
- Custom theme colors

## Setup Instructions

### 1. Generate Icons

The app needs PNG icons in multiple sizes. You can generate them from the SVG:

```bash
# Option 1: Use an online converter
# Upload public/icons/icon.svg to a converter like:
# - https://convertio.co/svg-png/
# - https://cloudconvert.com/svg-to-png

# Option 2: Use a design tool
# - Figma, Sketch, or Adobe Illustrator

# Option 3: Use command line tools
npm install -g svg2png
svg2png public/icons/icon.svg -o public/icons/icon-512x512.png -w 512 -h 512
```

### 2. Required Icon Sizes

Place these PNG files in `public/icons/`:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### 3. Test PWA Features

#### Install Prompt

1. Open the app in Chrome/Edge
2. Look for the install button (bottom-left corner)
3. Click to install the app

#### Offline Testing

1. Install the app
2. Turn off internet connection
3. Open the app - it should still work

#### Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run PWA audit
4. Should score 90+ points

## PWA Configuration Files

### manifest.json

- App metadata and icons
- Theme colors and display settings
- Install prompt configuration

### sw.js (Service Worker)

- Caches essential resources
- Handles offline functionality
- Manages cache updates

### pwa-register.js

- Registers service worker
- Handles install prompts
- Manages app installation

## Browser Support

### Full PWA Support

- Chrome/Edge (Android/Desktop)
- Safari (iOS)
- Firefox (Android)

### Limited Support

- Safari (Desktop) - No install prompt
- Firefox (Desktop) - Limited features

## Customization

### Theme Colors

Update these files to change theme colors:

- `public/manifest.json` - `theme_color`
- `src/app/layout.tsx` - `themeColor` metadata
- `src/app/layout.tsx` - `meta name="theme-color"`

### App Name

Update these files to change app name:

- `public/manifest.json` - `name` and `short_name`
- `src/app/layout.tsx` - `title` metadata
- `src/app/layout.tsx` - `apple-mobile-web-app-title`

## Troubleshooting

### Install Button Not Showing

- Ensure HTTPS is enabled (required for PWA)
- Check browser console for errors
- Verify manifest.json is accessible

### Service Worker Not Registering

- Check browser console for registration errors
- Ensure sw.js is accessible at `/sw.js`
- Verify HTTPS is enabled

### Icons Not Loading

- Check file paths in manifest.json
- Verify PNG files exist in public/icons/
- Test icon URLs directly in browser

## Development Notes

### Service Worker Updates

- Service worker updates automatically
- Cache version is managed in sw.js
- Old caches are cleaned up automatically

### Testing

- Use Chrome DevTools > Application tab
- Check Service Workers and Manifest sections
- Test offline functionality

### Deployment

- Ensure HTTPS is enabled
- Verify all icon files are deployed
- Test PWA features after deployment
