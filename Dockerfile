FROM node:18

# Tạo thư mục app
WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Cổng chạy app
EXPOSE 3000

# Lệnh khởi động
CMD ["node", "server.js"]