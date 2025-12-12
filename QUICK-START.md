# Quick Start Guide - One-Click Game Installation

## 🎮 How It Works

Your server now has a **web-based game browser** that lets you discover and install js13k games with one click!

### What Happens When You Click Install:

1. **You browse** available games at `http://your-pi:3000/browse.html`
2. **You click "INSTALL"** on any game you like
3. **The Pi downloads** the game ZIP from js13kgames.com
4. **The Pi extracts** and sets up the game automatically
5. **The game is saved** permanently on your Pi (in `public/games/js13k/`)
6. **Click "PLAY"** to launch the game from your Pi (no more downloading needed!)

### Features:

- ✅ **One-click installation** - Just click "Install" button
- ✅ **Games stay installed** - Downloaded once, play forever
- ✅ **Filter by year/category** - Find exactly what you want
- ✅ **See what's installed** - Green badge shows installed games
- ✅ **Delete unwanted games** - Free up space anytime
- ✅ **10 curated games** - Hand-picked excellent js13k entries

## 🚀 Usage

1. Start your server:
   ```bash
   npm start
   # or
   npm run pm2:start
   ```

2. Open your browser:
   ```
   http://localhost:3000
   ```

3. Click **"BROWSE & INSTALL MORE GAMES"** button

4. Browse the catalog, filter by year/category/status

5. Click **"INSTALL"** on any game you like

6. Wait for download (usually 1-5 seconds)

7. Click **"PLAY"** to launch!

## 📊 API Endpoints

- `GET /api/games` - List currently installed games
- `GET /api/catalog` - Browse available games with install status
- `POST /api/install/:gameId` - Install a game (downloads to Pi)
- `DELETE /api/games/:gameId` - Remove an installed game

## 🎯 Pre-loaded Game Catalog

The server comes with 10 excellent games ready to install:

### 2023 Games:
- Road Blocks - Medieval road building puzzle
- Solitaire XIII - Classic card game
- Mini Kingdom - Kingdom building strategy

### 2022 Games:
- Space Garden - Grow plants in space
- The Wandering Wraith - Spooky action adventure
- Undergarden - Underground digging arcade

### 2021 Games:
- Q1K3 - First-person shooter (4.8★!)
- Offline Paradise - Island building sim
- Captain Callisto - Space exploration

### 2020 Games:
- Underrun - Fast-paced dungeon crawler

All games are under 13KB and run entirely in the browser!

## 💾 Storage

Games are stored in: `public/games/js13k/[game-id]/`

Each game includes:
- `index.html` - The game itself
- `game-meta.json` - Metadata (title, icon, author, etc.)
- Any additional assets (images, sounds, etc.)

## 🔧 Adding More Games to Catalog

Edit `game-catalog.js` to add more games to the browse list. Each game needs:
- `id` - Unique identifier
- `title` - Game name
- `downloadUrl` - Direct link to ZIP file
- `icon`, `description`, `author`, `year`, `category`

## 🌐 External Access

Once installed, games run from YOUR Pi, so:
- ✅ Fast loading (local network)
- ✅ Works offline (after installation)
- ✅ No external dependencies
- ✅ Your own personal game arcade!
