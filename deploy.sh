#!/bin/bash

# Dừng ứng dụng hiện tại
pm2 stop be-code-challenge

# Pull mã nguồn mới từ repository
git fetch
git pull

yarn install
yarn build

# Khởi động lại ứng dụng với PM2
pm2 start ecosystem.config.js
