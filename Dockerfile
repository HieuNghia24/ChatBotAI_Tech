FROM node:18

WORKDIR /app

# Copy toàn bộ source
COPY . .

# Chuyển vào thư mục con chứa server.js
WORKDIR /app/chatbox-support-fixed

# Expose port
EXPOSE 3000

# Chạy server.js
CMD ["node", "server.js"]