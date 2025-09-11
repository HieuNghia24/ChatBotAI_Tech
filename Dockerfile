# Sử dụng Node.js 18 chính thức
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json trước để tối ưu cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Cổng mà app sẽ chạy
EXPOSE 3000

# Command khởi chạy app
CMD ["npm", "start"]