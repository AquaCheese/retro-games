# 🚀 Raspberry Pi Deployment Guide with Caddy HTTPS

Complete guide to deploy your retro games server on Raspberry Pi with automatic HTTPS using Caddy.

## 📋 Prerequisites

- Raspberry Pi (any model with network connectivity)
- Raspberry Pi OS installed
- SSH access to your Pi
- A domain name (required for HTTPS)
  - Free options: DuckDNS, No-IP, FreeDNS
  - Paid options: Namecheap, Google Domains, etc.

## 🎯 Overview

We'll set up:
1. Node.js and npm
2. PM2 for process management
3. Caddy as reverse proxy with automatic HTTPS
4. Auto-start on boot

## 📦 Step 1: Initial Pi Setup

### Connect to your Raspberry Pi

```bash
ssh pi@raspberrypi.local
# Default password is usually 'raspberry' - change it!
passwd
```

### Update system

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## 📁 Step 2: Deploy Your Game Server

### Clone or upload your project

**Option A: Upload from your computer**
```bash
# On your local machine (in the retro-games directory)
scp -r ./* pi@raspberrypi.local:/home/pi/retro-games/
```

**Option B: Clone from GitHub**
```bash
# On the Pi
cd ~
git clone https://github.com/YOUR_USERNAME/retro-games.git
cd retro-games
```

**Option C: Manual setup**
```bash
# On the Pi
mkdir -p ~/retro-games
cd ~/retro-games

# Then upload files using SCP, SFTP, or create them manually
```

### Install dependencies

```bash
cd ~/retro-games
npm install
```

### Test the server

```bash
# Quick test
npm start

# Open another terminal and test
curl http://localhost:3000/health

# Stop the test (Ctrl+C)
```

## 🔧 Step 3: Install and Configure PM2

### Install PM2 globally

```bash
sudo npm install -g pm2
```

### Start your server with PM2

```bash
cd ~/retro-games
pm2 start ecosystem.config.js
```

### Configure PM2 to start on boot

```bash
# Generate startup script
pm2 startup

# This will output a command like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi

# Copy and run that exact command, then:
pm2 save
```

### Verify PM2 is running

```bash
pm2 status
pm2 logs retro-games
```

## 🌐 Step 4: Set Up Your Domain

You need a domain name for HTTPS. Here are free options:

### Option A: DuckDNS (Recommended - Free & Easy)

1. **Visit https://www.duckdns.org/**
2. **Sign in** with Google/GitHub
3. **Create a subdomain**: `mygames.duckdns.org`
4. **Note your token**

5. **Install DuckDNS updater on Pi:**

```bash
# Create directory
mkdir -p ~/duckdns
cd ~/duckdns

# Create update script
cat > duck.sh << 'EOF'
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=YOUR_SUBDOMAIN&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
EOF

# Replace YOUR_SUBDOMAIN and YOUR_TOKEN with your actual values
nano duck.sh

# Make executable
chmod +x duck.sh

# Test it
./duck.sh
cat duck.log  # Should say "OK"

# Add to crontab (updates every 5 minutes)
crontab -e
# Add this line:
# */5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

### Option B: No-IP

1. Visit https://www.noip.com/
2. Create free account and hostname
3. Install their dynamic DNS updater on Pi

## 🔒 Step 5: Install and Configure Caddy

### Install Caddy

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Verify installation
caddy version
```

### Configure Caddy

Create Caddyfile:

```bash
sudo nano /etc/caddy/Caddyfile
```

**Add this configuration:**

```caddyfile
# Replace mygames.duckdns.org with YOUR domain
mygames.duckdns.org {
    # Automatic HTTPS with Let's Encrypt
    # Caddy handles certificates automatically!
    
    # Reverse proxy to your Node.js app
    reverse_proxy localhost:3000
    
    # Enable compression
    encode gzip
    
    # Security headers
    header {
        # Enable HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        # Prevent clickjacking
        X-Frame-Options "SAMEORIGIN"
        # Prevent MIME sniffing
        X-Content-Type-Options "nosniff"
        # XSS Protection
        X-XSS-Protection "1; mode=block"
    }
    
    # Logging
    log {
        output file /var/log/caddy/retro-games.log
        format json
    }
}

# Optional: Redirect www to non-www
www.mygames.duckdns.org {
    redir https://mygames.duckdns.org{uri} permanent
}
```

**For local network access (optional):**

```caddyfile
# Local network access without domain
:80 {
    reverse_proxy localhost:3000
}

# Your domain with HTTPS
mygames.duckdns.org {
    reverse_proxy localhost:3000
    encode gzip
}
```

### Start Caddy

```bash
# Reload Caddy configuration
sudo systemctl reload caddy

# Check status
sudo systemctl status caddy

# Enable auto-start on boot
sudo systemctl enable caddy

# View logs
sudo journalctl -u caddy -f
```

## 🔥 Step 6: Configure Firewall (Optional but Recommended)

```bash
# Install UFW if not already installed
sudo apt install ufw

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 🌍 Step 7: Router Port Forwarding

You need to forward ports from your router to your Raspberry Pi.

### Find your Pi's local IP

```bash
hostname -I
# Example output: 192.168.1.100
```

### Configure Router Port Forwarding

1. **Access your router** (usually http://192.168.1.1 or http://192.168.0.1)
2. **Login** with admin credentials
3. **Find Port Forwarding** settings (might be under Advanced, NAT, or Virtual Server)
4. **Add these rules:**

| Service Name | External Port | Internal IP | Internal Port | Protocol |
|--------------|--------------|-------------|---------------|----------|
| HTTP         | 80           | 192.168.1.100 | 80          | TCP      |
| HTTPS        | 443          | 192.168.1.100 | 443         | TCP      |

Replace `192.168.1.100` with your Pi's actual IP.

### Optional: Set Static IP for Pi

```bash
# Edit dhcpcd.conf
sudo nano /etc/dhcpcd.conf

# Add at the end (adjust to your network):
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4

# For WiFi use wlan0 instead:
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4

# Reboot to apply
sudo reboot
```

## ✅ Step 8: Test Your Setup

### Test locally

```bash
curl http://localhost
curl https://localhost -k
```

### Test from external

From another device (not on your network):

```
https://mygames.duckdns.org
```

You should see your game arcade with a valid HTTPS certificate! 🎉

## 📊 Step 9: Monitor and Maintain

### Check PM2 status

```bash
pm2 status
pm2 logs retro-games
pm2 monit
```

### Check Caddy status

```bash
sudo systemctl status caddy
sudo journalctl -u caddy -f
sudo tail -f /var/log/caddy/retro-games.log
```

### Restart services

```bash
# Restart game server
pm2 restart retro-games

# Restart Caddy
sudo systemctl restart caddy

# Restart entire Pi
sudo reboot
```

### Update your game server

```bash
cd ~/retro-games
git pull  # If using Git
npm install  # If dependencies changed
pm2 restart retro-games
```

## 🔧 Troubleshooting

### HTTPS not working

1. **Check domain is pointing to your IP:**
   ```bash
   nslookup mygames.duckdns.org
   ```

2. **Check ports are open:**
   ```bash
   # From external network
   telnet mygames.duckdns.org 443
   ```

3. **Check Caddy logs:**
   ```bash
   sudo journalctl -u caddy -n 50
   ```

4. **Verify port forwarding** in router

5. **Wait a few minutes** - Let's Encrypt can take time

### Can't access externally

1. **Find your public IP:**
   ```bash
   curl ifconfig.me
   ```

2. **Verify DuckDNS is updated:**
   Visit https://www.duckdns.org/ and check your domain

3. **Check router port forwarding** is enabled

4. **Check firewall:**
   ```bash
   sudo ufw status
   ```

### PM2 not starting on boot

```bash
# Regenerate startup script
pm2 unstartup
pm2 startup
# Run the generated command
pm2 save
```

## 📱 Bonus: Mobile Access

Your games are now accessible from anywhere:

- **At home:** `https://mygames.duckdns.org`
- **On phone:** `https://mygames.duckdns.org`
- **At friend's house:** `https://mygames.duckdns.org`

All with HTTPS automatically handled by Caddy!

## 🔐 Security Best Practices

1. **Change default Pi password:**
   ```bash
   passwd
   ```

2. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Use SSH keys instead of passwords:**
   ```bash
   # On your computer
   ssh-keygen -t rsa -b 4096
   ssh-copy-id pi@raspberrypi.local
   ```

4. **Disable password authentication (after setting up SSH keys):**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   sudo systemctl restart ssh
   ```

5. **Consider fail2ban:**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

## 📝 Quick Reference

```bash
# PM2 Commands
pm2 status                    # View all processes
pm2 logs retro-games         # View logs
pm2 restart retro-games      # Restart server
pm2 stop retro-games         # Stop server
pm2 monit                    # Monitor in real-time

# Caddy Commands
sudo systemctl status caddy   # Check status
sudo systemctl restart caddy  # Restart Caddy
sudo systemctl reload caddy   # Reload config
sudo journalctl -u caddy -f   # View logs

# System Commands
sudo reboot                   # Reboot Pi
sudo shutdown -h now         # Shutdown Pi
df -h                        # Check disk space
free -h                      # Check memory
```

## 🎮 Your Game Server is Live!

You now have:
- ✅ Retro games server running 24/7 on your Pi
- ✅ PM2 keeping it alive and auto-restarting
- ✅ Caddy providing automatic HTTPS with Let's Encrypt
- ✅ External access from anywhere in the world
- ✅ One-click game installation from web browser

Enjoy your personal game arcade! 🕹️
