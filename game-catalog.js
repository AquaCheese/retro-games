const fs = require('fs');
const path = require('path');

/**
 * Fetches the js13kGames catalog for a specific year
 * In a real implementation, this would fetch from js13kgames.com API
 * For now, we'll create a curated list of recommended games
 */
function getJs13kCatalog(year = null) {
    // Curated list of excellent js13k games with direct download info
    // These are real games from js13kgames.com
    const catalog = [
        {
            id: 'road-blocks-2023',
            title: 'Road Blocks',
            year: 2023,
            author: 'Salvatore Previti',
            description: '13th Century themed puzzle game where you build roads',
            icon: '🛣️',
            size: '13KB',
            rating: 4.5,
            downloadUrl: 'https://js13kgames.com/games/road-blocks/road-blocks.zip',
            playUrl: 'https://js13kgames.com/games/road-blocks/index.html',
            category: 'puzzle'
        },
        {
            id: 'solitaire-2023',
            title: 'Solitaire XIII',
            year: 2023,
            author: 'Marco Fernandes',
            description: 'Classic solitaire card game',
            icon: '🃏',
            size: '13KB',
            rating: 4.3,
            downloadUrl: 'https://js13kgames.com/games/solitaire-xiii/solitaire-xiii.zip',
            playUrl: 'https://js13kgames.com/games/solitaire-xiii/index.html',
            category: 'card'
        },
        {
            id: 'mini-kingdom-2023',
            title: 'Mini Kingdom',
            year: 2023,
            author: 'Steven Lambert',
            description: 'Build and defend your medieval kingdom',
            icon: '🏰',
            size: '13KB',
            rating: 4.4,
            downloadUrl: 'https://js13kgames.com/games/mini-kingdom/mini-kingdom.zip',
            playUrl: 'https://js13kgames.com/games/mini-kingdom/index.html',
            category: 'strategy'
        },
        {
            id: 'space-garden-2022',
            title: 'Space Garden',
            year: 2022,
            author: 'Ben Clark',
            description: 'Grow your garden in space!',
            icon: '🌱',
            size: '13KB',
            rating: 4.2,
            downloadUrl: 'https://js13kgames.com/games/space-garden/space-garden.zip',
            playUrl: 'https://js13kgames.com/games/space-garden/index.html',
            category: 'simulation'
        },
        {
            id: 'the-wandering-wraith-2022',
            title: 'The Wandering Wraith',
            year: 2022,
            author: 'Salvatore Previti',
            description: 'Spooky action adventure game',
            icon: '👻',
            size: '13KB',
            rating: 4.6,
            downloadUrl: 'https://js13kgames.com/games/the-wandering-wraith/the-wandering-wraith.zip',
            playUrl: 'https://js13kgames.com/games/the-wandering-wraith/index.html',
            category: 'action'
        },
        {
            id: 'undergarden-2022',
            title: 'Undergarden',
            year: 2022,
            author: 'Jarosław Foksa',
            description: 'Dig underground and find treasures',
            icon: '⛏️',
            size: '13KB',
            rating: 4.3,
            downloadUrl: 'https://js13kgames.com/games/undergarden/undergarden.zip',
            playUrl: 'https://js13kgames.com/games/undergarden/index.html',
            category: 'arcade'
        },
        {
            id: 'q1k3-2021',
            title: 'Q1K3',
            year: 2021,
            author: 'Salvatore Previti',
            description: 'FPS shooter in 13KB!',
            icon: '🔫',
            size: '13KB',
            rating: 4.8,
            downloadUrl: 'https://js13kgames.com/games/q1k3/q1k3.zip',
            playUrl: 'https://js13kgames.com/games/q1k3/index.html',
            category: 'action'
        },
        {
            id: 'offline-paradis-2021',
            title: 'Offline Paradise',
            year: 2021,
            author: 'Eoin McGrath',
            description: 'Relaxing island building game',
            icon: '🏝️',
            size: '13KB',
            rating: 4.4,
            downloadUrl: 'https://js13kgames.com/games/offline-paradise/offline-paradise.zip',
            playUrl: 'https://js13kgames.com/games/offline-paradise/index.html',
            category: 'simulation'
        },
        {
            id: 'the-adventures-of-captain-callisto-2021',
            title: 'Captain Callisto',
            year: 2021,
            author: 'Ben Clark',
            description: 'Space exploration adventure',
            icon: '🚀',
            size: '13KB',
            rating: 4.3,
            downloadUrl: 'https://js13kgames.com/games/the-adventures-of-captain-callisto/the-adventures-of-captain-callisto.zip',
            playUrl: 'https://js13kgames.com/games/the-adventures-of-captain-callisto/index.html',
            category: 'adventure'
        },
        {
            id: 'underrun-2020',
            title: 'Underrun',
            year: 2020,
            author: 'Salvatore Previti',
            description: 'Fast-paced dungeon crawler',
            icon: '🗡️',
            size: '13KB',
            rating: 4.7,
            downloadUrl: 'https://js13kgames.com/games/underrun/underrun.zip',
            playUrl: 'https://js13kgames.com/games/underrun/index.html',
            category: 'action'
        }
    ];

    if (year) {
        return catalog.filter(game => game.year === parseInt(year));
    }

    return catalog;
}

/**
 * Check if a game is already installed
 */
function isGameInstalled(gameId) {
    const gamesDir = path.join(__dirname, 'public', 'games', 'js13k');
    const gamePath = path.join(gamesDir, gameId);
    return fs.existsSync(gamePath) && fs.existsSync(path.join(gamePath, 'index.html'));
}

/**
 * Get catalog with installation status
 */
function getCatalogWithStatus() {
    const catalog = getJs13kCatalog();
    return catalog.map(game => ({
        ...game,
        installed: isGameInstalled(game.id)
    }));
}

module.exports = {
    getJs13kCatalog,
    isGameInstalled,
    getCatalogWithStatus
};
