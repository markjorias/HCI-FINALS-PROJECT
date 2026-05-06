# Deploying to Azure Virtual Machine (Ubuntu)

This project is now structured for professional deployment on a Virtual Machine. Follow these steps to deploy:

## 1. Provision an Azure VM
*   Create a new Ubuntu VM in the Azure Portal.
*   Ensure Port **80** (HTTP) and **22** (SSH) are open in the Networking settings.

## 2. Set Up the Environment
Connect to your VM via SSH and run:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

## 3. Clone and Install
```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

## 4. Run the Application
```bash
pm2 start src/server.js --name "coffee-shop"
```

## 5. (Recommended) Configure Nginx as Reverse Proxy
To serve the app on port 80:
```bash
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/coffee-shop
```
Paste this config:
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/coffee-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Your App is now Live!
Visit your Azure VM's Public IP in your browser.
