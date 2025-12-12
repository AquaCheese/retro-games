module.exports = {
  apps: [{
    name: 'retro-games',
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Restart on cron schedule (optional)
    // cron_restart: '0 0 * * *',  // Restart daily at midnight
    
    // Min uptime before considered stable
    min_uptime: '10s',
    
    // Max restarts within 1 minute before stopping
    max_restarts: 10,
    
    // Delay between restarts
    restart_delay: 4000
  }]
};
