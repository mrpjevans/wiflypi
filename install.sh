#!/bin/bash

# Get up to date
sudo apt -y update
sudo apt -y upgrade

# Deps
sudo apt -y install git nodejs npm

# Get repo
cd
git clone https://github.com/mrpjevans/wiflypi.git

# Build
cd wiflypi
npm install
npm run build

# Create web service
cat > ./wiflypi_web.service << EOM
[Unit]
Description=WiFlyPi Web Server

[Service]
ExecStart=/usr/bin/node $(pwd)/dist/web/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOM

sudo mv ./wiflypi_web.service /usr/lib/systemd/wiflypi_web.service
sudo systemctl enable /usr/lib/systemd/wiflypi_web.service

# Create cron job
CRON_JOB="*/2 *	* * *	root	/usr/bin/node $(pwd)/dist/watcher/watcher.js 2>&1"

# Check the current user's crontab for the line
if cat /etc/crontab | grep -Fxq "$CRON_JOB"; then
    echo "Cron job already exists, skipping"
else
		echo "Creating cron job"
    sudo sh -c 'echo $CRON_JOB >> /etc/crontab'
fi

echo "WiFlyPi installed"
