# 🚀 Quick Setup Cheat Sheet

## One-Page Raspberry Pi Deployment

### 1️⃣ Install Node.js & PM2 (on Pi)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2️⃣ Deploy Your Code (on Pi)

```bash
# Upload from your computer
scp -r /path/to/retro-games/* pi@raspberrypi.local:/home/pi/retro-games/

# Or clone from GitHub
git clone https://github.com/YOUR_USERNAME/retro-games.git ~/retro-games

# Install dependencies
cd ~/retro-games
npm install
```

### 3️⃣ Start with PM2 (on Pi)

```bash
cd ~/retro-games
pm2 start ecosystem.config.js
pm2 startup  # Run the command it outputs
pm2 save
```

### 4️⃣ Setup Free Domain (DuckDNS)

1. Go to https://www.duckdns.org/
2. Sign in and create subdomain: `mygames.duckdns.org`
3. On Pi:

```bash
mkdir ~/duckdns
echo 'url="https://www.duckdns.org/update?domains=mygames&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -' > ~/duckdns/duck.sh
chmod +x ~/duckdns/duck.sh
./duck.sh

# Auto-update (add to crontab)
crontab -e
# Add: */5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

### 5️⃣ Install Caddy (on Pi)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### 6️⃣ Configure Caddy (on Pi)

```bash
sudo nano /etc/caddy/Caddyfile
```

Paste this (replace domain):

```caddyfile
mygames.duckdns.org {
    reverse_proxy localhost:3000
    encode gzip
}
```

Save and restart:

```bash
sudo systemctl restart caddy
sudo systemctl enable caddy
```

### 7️⃣ Setup Firewall (on Pi)

```bash
sudo apt install ufw
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 8️⃣ Router Port Forwarding

1. Find Pi IP: `hostname -I`
2. Login to router (usually 192.168.1.1)
3. Forward ports:
   - Port 80 → Pi IP:80
   - Port 443 → Pi IP:443

### ✅ Done!

Visit: `https://mygames.duckdns.org`

---

## Common Commands

```bash
# PM2
pm2 status                 # Check status
pm2 logs retro-games      # View logs
pm2 restart retro-games   # Restart app

# Caddy
sudo systemctl status caddy   # Check Caddy
sudo systemctl restart caddy  # Restart Caddy
sudo journalctl -u caddy -f   # View logs

# System
sudo reboot               # Reboot Pi
df -h                    # Disk space
free -h                  # Memory usage
```

## Troubleshooting

**HTTPS not working?**
```bash
# Check domain resolves
nslookup mygames.duckdns.org

# Check Caddy logs
sudo journalctl -u caddy -n 50

# Verify port forwarding in router
```

**Can't access externally?**
```bash
# Get public IP
curl ifconfig.me

# Check if ports are open (from external network)
telnet mygames.duckdns.org 443
```

**PM2 not starting on boot?**
```bash
pm2 startup
# Run the command it outputs
pm2 save
```

---

## URLs After Setup

- **Local:** http://192.168.1.X:3000
- **External:** https://mygames.duckdns.org
- **API:** https://mygames.duckdns.org/api/catalog
- **Browse:** https://mygames.duckdns.org/browse.html

Enjoy! 🎮
