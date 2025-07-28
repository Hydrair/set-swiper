# Set Swiper

A Tinder-style web application for Magic: The Gathering cards built with React, Next.js, and NextAuth.js.

## Features

- 🔐 **User Authentication**: Sign in with Google or demo credentials
- 🃏 **Card Swiping**: Tinder-style interface for Magic cards
- 📚 **Set Support**: Add entire Magic sets to your deck
- ❤️ **Favorites**: Save and manage your favorite cards
- 📊 **Sorting**: Sort cards by alphabetical, set number, mana value, or type
- 📱 **Responsive**: Works on desktop and mobile devices
- 💾 **Persistence**: User data is saved between sessions

## Tech Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **API**: Scryfall API for Magic card data
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd magic-card-tinder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   
   # Google OAuth (Optional - for Google login)
   GOOGLE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-client-secret
   ```

4. **Generate a secret key**
   ```bash
   openssl rand -base64 32
   ```
   Use this as your `NEXTAUTH_SECRET`

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication Setup

### Demo Login
The app includes a demo login for testing:
- **Email**: `demo@example.com`
- **Password**: `demo`

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

## Usage

### Adding Cards

1. **Individual Cards**: Enter card names one per line
2. **By Set**: Search and select Magic sets to add all cards

### Swiping

- **Swipe Right**: Add card to favorites
- **Swipe Left**: Skip to next card
- **Click Buttons**: Use the heart/X buttons for precise control

### Managing Favorites

- **View**: See all your favorite cards
- **Sort**: Sort by alphabetical, set number, mana value, or type
- **Export**: Download your favorites list as a text file
- **Remove**: Delete individual cards from favorites

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/auth/          # NextAuth.js API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── providers.tsx      # Session provider
├── components/            # React components
│   ├── Auth.tsx          # Authentication component
│   ├── CardDisplay.tsx   # Swiping interface
│   ├── CardInput.tsx     # Card input forms
│   ├── FavoritesList.tsx # Favorites management
│   ├── Navigation.tsx    # Navigation bar
│   ├── SetInput.tsx      # Set selection
│   └── SortSelector.tsx  # Sorting dropdown
├── lib/                  # Utility libraries
│   ├── scryfall.ts       # Scryfall API client
│   └── store.ts          # Zustand store
└── types/               # TypeScript types
    └── card.ts          # Card and app state types
```

## API Integration

The app uses the [Scryfall API](https://scryfall.com/docs/api) to fetch Magic card data:

- **Card Search**: Fuzzy search for individual cards
- **Set Data**: Fetch all cards from specific Magic sets
- **Card Images**: High-quality card images from Scryfall CDN

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Scryfall](https://scryfall.com/) for the Magic card API
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
