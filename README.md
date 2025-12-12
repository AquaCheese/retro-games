# 🕹️ Retro Games Server

A lightweight retro gaming arcade server for Raspberry Pi, featuring classic games playable directly in your web browser!

## ⚡ NEW: One-Click Game Installation!

Browse and install js13kGames directly from your web interface - no terminal needed! 

1. Click "Browse & Install More Games" on the homepage
2. Click "Install" on any game you like
3. Game downloads to your Pi automatically
4. Click "Play" to launch!

**Features:**
- 🎮 10+ curated js13k games ready to install
- ⬇️ One-click installation
- 💾 Games stay installed permanently
- 🗑️ Easy deletion to free up space
- 🔍 Filter by year, category, or install status

## 🎮 Games Included

### Built-in Games
- **Snake** - Classic snake game with arrow key controls
- **Pong** - Play against AI in the original arcade game
- **Breakout** - Break bricks and beat your high score

### Adding js13kGames Entries

#### NEW: Web-Based Installation (Easiest!) 🎉

**No terminal needed!** Just use your web browser:

1. Start your server and open `http://localhost:3000`
2. Click **"Browse & Install More Games"**
3. Browse 10+ curated js13k games
4. Click **"Install"** on any game
5. Wait 1-5 seconds while it downloads to your Pi
6. Click **"Play"** to launch!

**Features:**
- Filter by year (2020-2023), category, or install status
- See ratings and descriptions
- One-click install and delete
- Games download to your Pi and stay there permanently

#### Command Line Method

You can still use the command-line installer:

```bash
# Download and install a js13k game
./add-js13k-game.sh <game-zip-url> [game-name] [year]
```

**Example:**
```bash
./add-js13k-game.sh https://example.com/awesome-game.zip space-invaders 2023
```

#### Manual Method

1. **Browse js13kGames:**
   - Visit https://js13kgames.com/
   - Choose a year and browse entries
   - Download the game ZIP file

2. **Extract to games folder:**
   ```bash
   mkdir -p public/games/js13k/your-game-name
   unzip game.zip -d public/games/js13k/your-game-name
   ```

3. **Ensure index.html exists:**
   - The game folder must contain an `index.html` file
   - If the main HTML has a different name, rename it

4. **Add metadata (optional but recommended):**
   ```bash
   cat > public/games/js13k/your-game-name/game-meta.json << 'EOF'
   {
     "title": "Your Game Title",
     "icon": "🚀",
     "description": "An awesome space shooter!",
     "author": "Game Developer",
     "year": 2023
   }
   EOF
   ```

5. **Restart the server:**
   ```bash
   npm run pm2:restart
   ```

The game will automatically appear on your homepage!

### Game Directory Structure

```
public/games/
├── built-in/           # Built-in games (Snake, Pong, Breakout)
│   ├── snake.html
│   ├── pong.html
│   ├── breakout.html
│   └── game-info.json
└── js13k/              # js13kGames entries
    ├── space-game/
    │   ├── index.html
    │   └── game-meta.json
    └── puzzle-game/
        ├── index.html
        └── game-meta.json
```

## 🚀 Quick Start

### Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm
- pm2 (for production deployment)

### Installation

1. Clone or download this repository:
```bash
git clone <your-repo-url>
cd retro-games
```

2. Install dependencies:
```bash
npm install
```

3. Install pm2 globally (if not already installed):
```bash
sudo npm install -g pm2
```

### Running the Server

#### Development Mode
```bash
npm start
```

#### Production Mode with pm2
```bash
npm run pm2:start
```

#### Other pm2 Commands
```bash
npm run pm2:stop      # Stop the server
npm run pm2:restart   # Restart the server
npm run pm2:logs      # View server logs
npm run pm2:monit     # Monitor server performance
```

### 🍓 Raspberry Pi Deployment with HTTPS

Want to deploy on your Raspberry Pi with automatic HTTPS?

📖 **See the complete deployment guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

⚡ **Quick cheat sheet:** [QUICK-DEPLOY.md](QUICK-DEPLOY.md)

**What you'll get:**
- ✅ Server running 24/7 on your Pi
- ✅ Free HTTPS with Caddy & Let's Encrypt
- ✅ Auto-restart on crashes and reboots
- ✅ External access from anywhere
- ✅ Free domain with DuckDNS

**Estimated setup time:** 20-30 minutes

## 🌍 External Access Setup

To make your retro games accessible from outside your local network:

### 1. Find Your Raspberry Pi's Local IP
```bash
hostname -I
```

### 2. Configure Your Router

**Port Forwarding:**
- Log into your router's admin panel (usually 192.168.1.1 or 192.168.0.1)
- Find Port Forwarding settings
- Forward external port 3000 to your Raspberry Pi's local IP on port 3000
- Protocol: TCP

### 3. Access Your Games

**Local Network:**
```
http://<raspberry-pi-ip>:3000
```

**External Access (after port forwarding):**
```
http://<your-public-ip>:3000
```

**Find your public IP:**
```bash
curl ifconfig.me
```

### 4. Optional: Set Up a Domain Name

For easier access, consider using a free dynamic DNS service like:
- No-IP (https://www.noip.com)
- DuckDNS (https://www.duckdns.org)
- Dynu (https://www.dynu.com)

### 5. Security Recommendations

⚠️ **Important Security Notes:**

- Consider setting up a reverse proxy with nginx
- Use a firewall (UFW) to limit access
- Set up HTTPS with Let's Encrypt for secure connections
- Consider basic authentication for production use

**Example UFW Setup:**
```bash
sudo ufw allow 3000/tcp
sudo ufw enable
```

## 🔧 Configuration

### Change the Port

Edit the `ecosystem.config.js` file or set the PORT environment variable:

```javascript
env: {
  PORT: 8080  // Change to your preferred port
}
```

Or run directly:
```bash
PORT=8080 npm start
```

### PM2 Auto-Start on Boot

To make the server start automatically when your Raspberry Pi boots:

```bash
# Start the server with pm2
npm run pm2:start

# Generate startup script
pm2 startup

# Save the current pm2 process list
pm2 save
```

## 📊 Monitoring

View real-time server status:
```bash
pm2 monit
```

View logs:
```bash
pm2 logs retro-games
```

Check server health:
```
http://<your-ip>:3000/health
```

## 🎯 Game Controls

### Snake
- Arrow Keys: Move
- Space: Restart

### Pong
- W/S or Arrow Up/Down: Move paddle
- Space: Start/Pause

### Breakout
- A/D or Arrow Left/Right: Move paddle
- Space: Start/Restart

## 🛠️ Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
sudo lsof -i :3000

# Kill the process using the port (if needed)
sudo kill -9 <PID>
```

### Can't access externally
1. Verify port forwarding is set up correctly
2. Check firewall settings on Raspberry Pi
3. Ensure your ISP doesn't block incoming connections
4. Test local access first before external

### pm2 issues
```bash
# Reset pm2
pm2 kill
pm2 flush

# Restart
npm run pm2:start
```

## 📁 Project Structure

```
retro-games/
├── server.js                    # Express server
├── game-discovery.js            # Auto-discovers games in folders
├── ecosystem.config.js          # PM2 configuration
├── package.json                 # Dependencies
├── add-js13k-game.sh           # Helper script to add js13k games
├── public/                      # Static files
│   ├── index.html              # Game selection page (dynamic)
│   └── games/                  # Games directory
│       ├── built-in/           # Built-in games
│       │   ├── snake.html
│       │   ├── pong.html
│       │   ├── breakout.html
│       │   └── game-info.json
│       └── js13k/              # js13kGames entries
│           └── [game-folders]/
└── logs/                        # Server logs (auto-created)
```

## 🤝 Contributing

Feel free to add more retro games or improve existing ones!

### Popular js13kGames to Try

Here are some excellent js13k games you can add:

**Visit https://js13kgames.com/ and browse by year:**
- 2023 entries: https://js13kgames.com/entries/2023
- 2022 entries: https://js13kgames.com/entries/2022
- 2021 entries: https://js13kgames.com/entries/2021

**Recommended categories:**
- Action games
- Puzzle games
- Platformers
- Racing games
- Arcade classics

**Tips for choosing games:**
- Look for high ratings and lots of votes
- Check that the game has a playable demo
- Verify it works in modern browsers
- Read comments for known issues

## 📝 License

MIT

## 🎉 Enjoy!

Have fun playing retro games on your Raspberry Pi! 🎮