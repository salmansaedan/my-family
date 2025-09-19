// PM2 Configuration for Al-Saedan Family App
module.exports = {
  apps: [
    {
      name: 'al-saedan-family-app',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=al-saedan-family-db --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring (wrangler handles hot reload)
      instances: 1, // Development mode uses only one instance
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log'
    }
  ]
}