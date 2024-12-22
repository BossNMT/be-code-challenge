#!/bin/bash

# Di chuyển đến thư mục chứa mã nguồn sau khi đã xây dựng
cd /home/dat_xe_cong_nghe


# Dừng ứng dụng hiện tại
export PATH=/root/.nvm/versions/node/v18.17.0/bin/pm2
pm2 stop nestjs-app

# Pull mã nguồn mới từ repository
git fetch
git pull

# Cài đặt dependencies và build ứng dụng
export PATH=/root/.nvm/versions/node/v18.17.0/bin/yarn
yarn install
yarn build

# Khởi động lại ứng dụng với PM2
pm2 start ecosystem.config.js
