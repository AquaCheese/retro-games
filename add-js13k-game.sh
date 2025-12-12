#!/bin/bash

# Helper script to download and add js13kGames entries
# Usage: ./add-js13k-game.sh <game-url> [game-name] [year]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAMES_DIR="$SCRIPT_DIR/public/games/js13k"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎮 js13kGames Installer${NC}"
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: $0 <game-url-or-zip> [game-name] [year]${NC}"
    echo ""
    echo "Examples:"
    echo "  $0 https://example.com/game.zip my-awesome-game 2023"
    echo "  $0 /path/to/game.zip tetris-clone 2022"
    echo ""
    echo -e "${YELLOW}Finding js13k games:${NC}"
    echo "1. Visit https://js13kgames.com/"
    echo "2. Browse the entries by year"
    echo "3. Download the game ZIP file"
    echo "4. Run this script with the ZIP path"
    exit 1
fi

GAME_URL="$1"
GAME_NAME="${2:-$(basename "$GAME_URL" .zip)}"
GAME_YEAR="${3:-}"

# Sanitize game name (remove special characters)
GAME_NAME=$(echo "$GAME_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g')

GAME_DIR="$GAMES_DIR/$GAME_NAME"

echo -e "Game URL: ${YELLOW}$GAME_URL${NC}"
echo -e "Game Name: ${YELLOW}$GAME_NAME${NC}"
echo -e "Installation Dir: ${YELLOW}$GAME_DIR${NC}"
echo ""

# Create game directory
mkdir -p "$GAME_DIR"

# Download and extract
TEMP_FILE="/tmp/js13k-game-$$.zip"

if [[ "$GAME_URL" == http* ]]; then
    echo "📥 Downloading game..."
    curl -L "$GAME_URL" -o "$TEMP_FILE"
else
    echo "📁 Using local file..."
    cp "$GAME_URL" "$TEMP_FILE"
fi

echo "📦 Extracting game..."
unzip -q "$TEMP_FILE" -d "$GAME_DIR"

# Clean up
rm "$TEMP_FILE"

# Check if index.html exists, if not try to find it
if [ ! -f "$GAME_DIR/index.html" ]; then
    echo -e "${YELLOW}⚠️  index.html not found in root, searching...${NC}"
    
    # Look for HTML file
    HTML_FILE=$(find "$GAME_DIR" -name "*.html" -type f | head -n 1)
    
    if [ -n "$HTML_FILE" ]; then
        # If HTML is in subdirectory, move everything up
        HTML_DIR=$(dirname "$HTML_FILE")
        if [ "$HTML_DIR" != "$GAME_DIR" ]; then
            echo "Moving files from $HTML_DIR to $GAME_DIR"
            mv "$HTML_DIR"/* "$GAME_DIR/"
            rm -rf "$HTML_DIR"
        fi
        
        # Rename to index.html if needed
        if [ "$(basename "$HTML_FILE")" != "index.html" ]; then
            mv "$HTML_FILE" "$GAME_DIR/index.html"
        fi
    else
        echo -e "${RED}❌ No HTML file found! Please add index.html manually.${NC}"
        exit 1
    fi
fi

# Create game metadata file
cat > "$GAME_DIR/game-meta.json" << EOF
{
  "title": "$GAME_NAME",
  "icon": "🎮",
  "description": "js13kGames entry${GAME_YEAR:+ from $GAME_YEAR}",
  "author": "Unknown",
  "year": ${GAME_YEAR:-null},
  "source": "$GAME_URL"
}
EOF

echo ""
echo -e "${GREEN}✅ Game installed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit $GAME_DIR/game-meta.json to customize title, icon, and description"
echo "2. Restart your server: npm run pm2:restart"
echo "3. Visit http://localhost:3000 to play!"
echo ""
echo -e "${YELLOW}Optional: Test the game directly at:${NC}"
echo "http://localhost:3000/games/js13k/$GAME_NAME/index.html"
