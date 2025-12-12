const fs = require('fs');
const path = require('path');

/**
 * Discovers all available games in the public/games directory
 * Returns an array of game objects with metadata
 */
function discoverGames() {
    const games = [];
    const gamesDir = path.join(__dirname, 'public', 'games');

    // Scan built-in games
    const builtInDir = path.join(gamesDir, 'built-in');
    if (fs.existsSync(builtInDir)) {
        const gameInfoPath = path.join(builtInDir, 'game-info.json');
        if (fs.existsSync(gameInfoPath)) {
            const gameInfo = JSON.parse(fs.readFileSync(gameInfoPath, 'utf8'));
            Object.entries(gameInfo).forEach(([id, info]) => {
                games.push({
                    id,
                    type: 'built-in',
                    title: info.title,
                    icon: info.icon,
                    description: info.description,
                    url: `/games/built-in/${info.file}`
                });
            });
        }
    }

    // Scan js13k games
    const js13kDir = path.join(gamesDir, 'js13k');
    if (fs.existsSync(js13kDir)) {
        const entries = fs.readdirSync(js13kDir, { withFileTypes: true });
        
        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const gameDir = path.join(js13kDir, entry.name);
                const indexPath = path.join(gameDir, 'index.html');
                const metaPath = path.join(gameDir, 'game-meta.json');
                
                if (fs.existsSync(indexPath)) {
                    let meta = {
                        title: entry.name,
                        icon: '🎮',
                        description: 'js13kGames entry'
                    };
                    
                    // Load custom metadata if available
                    if (fs.existsSync(metaPath)) {
                        const customMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                        meta = { ...meta, ...customMeta };
                    }
                    
                    games.push({
                        id: `js13k-${entry.name}`,
                        type: 'js13k',
                        title: meta.title,
                        icon: meta.icon,
                        description: meta.description,
                        url: `/games/js13k/${entry.name}/index.html`,
                        author: meta.author || 'Unknown',
                        year: meta.year || null
                    });
                }
            }
        });
    }

    return games;
}

module.exports = { discoverGames };
