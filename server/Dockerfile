# Stage 1: Build the application
FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:22-slim
WORKDIR /usr/src/app
# Chỉ copy những file cần thiết cho production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
# Mở port mà NestJS đang chạy
EXPOSE 7000
RUN apt-get update -y && apt-get install -y openssl
# Lệnh để chạy ứng dụng
CMD ["node", "dist/main"]