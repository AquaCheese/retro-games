const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { discoverGames } = require('./game-discovery');
const { getCatalogWithStatus } = require('./game-catalog');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/games', (req, res) => {
    try {
        const games = discoverGames();
        res.json({ games, count: games.length });
    } catch (error) {
        console.error('Error discovering games:', error);
        res.status(500).json({ error: 'Failed to discover games' });
    }
});

app.get('/api/catalog', (req, res) => {
    try {
        const catalog = getCatalogWithStatus();
        res.json({ games: catalog, count: catalog.length });
    } catch (error) {
        console.error('Error fetching catalog:', error);
        res.status(500).json({ error: 'Failed to fetch game catalog' });
    }
});

app.post('/api/install/:gameId', async (req, res) => {
    const { gameId } = req.params;
    
    try {
        const catalog = require('./game-catalog').getJs13kCatalog();
        const game = catalog.find(g => g.id === gameId);
        
        if (!game) {
            return res.status(404).json({ error: 'Game not found in catalog' });
        }

        const gamesDir = path.join(__dirname, 'public', 'games', 'js13k');
        const gameDir = path.join(gamesDir, gameId);
        
        // Check if already installed
        if (fs.existsSync(gameDir)) {
            return res.json({ success: true, message: 'Game already installed', gameId });
        }

        console.log(`📥 Downloading ${game.title}...`);
        
        // Download the game ZIP
        const response = await axios({
            method: 'get',
            url: game.downloadUrl,
            responseType: 'arraybuffer',
            timeout: 30000
        });

        console.log(`📦 Extracting ${game.title}...`);
        
        // Create game directory
        fs.mkdirSync(gameDir, { recursive: true });
        
        // Extract ZIP
        const zip = new AdmZip(response.data);
        zip.extractAllTo(gameDir, true);
        
        // Find index.html and move to root if needed
        const entries = fs.readdirSync(gameDir);
        const indexPath = path.join(gameDir, 'index.html');
        
        if (!fs.existsSync(indexPath)) {
            // Look for index.html in subdirectories
            const findIndex = (dir) => {
                const items = fs.readdirSync(dir, { withFileTypes: true });
                for (const item of items) {
                    const fullPath = path.join(dir, item.name);
                    if (item.isFile() && item.name === 'index.html') {
                        return fullPath;
                    }
                    if (item.isDirectory()) {
                        const found = findIndex(fullPath);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            const foundIndex = findIndex(gameDir);
            if (foundIndex) {
                const subDir = path.dirname(foundIndex);
                if (subDir !== gameDir) {
                    // Move everything from subdirectory to root
                    const items = fs.readdirSync(subDir);
                    items.forEach(item => {
                        fs.renameSync(
                            path.join(subDir, item),
                            path.join(gameDir, item)
                        );
                    });
                }
            }
        }
        
        // Create metadata file
        const metadata = {
            title: game.title,
            icon: game.icon,
            description: game.description,
            author: game.author,
            year: game.year,
            category: game.category,
            installedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(gameDir, 'game-meta.json'),
            JSON.stringify(metadata, null, 2)
        );
        
        console.log(`✅ ${game.title} installed successfully!`);
        
        res.json({
            success: true,
            message: 'Game installed successfully',
            gameId,
            url: `/games/js13k/${gameId}/index.html`
        });
        
    } catch (error) {
        console.error(`Error installing game ${gameId}:`, error.message);
        res.status(500).json({ 
            error: 'Failed to install game', 
            details: error.message 
        });
    }
});

app.delete('/api/games/:gameId', (req, res) => {
    const { gameId } = req.params;
    
    try {
        const gameDir = path.join(__dirname, 'public', 'games', 'js13k', gameId);
        
        if (!fs.existsSync(gameDir)) {
            return res.status(404).json({ error: 'Game not found' });
        }
        
        // Delete the game directory
        fs.rmSync(gameDir, { recursive: true, force: true });
        
        console.log(`🗑️  Deleted game: ${gameId}`);
        
        res.json({ success: true, message: 'Game deleted successfully', gameId });
        
    } catch (error) {
        console.error(`Error deleting game ${gameId}:`, error);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Retro Games Server running on port ${PORT}`);
    console.log(`📡 Accessible at http://localhost:${PORT}`);
    console.log(`🌍 External access: http://<your-raspberry-pi-ip>:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    process.exit(0);
});
