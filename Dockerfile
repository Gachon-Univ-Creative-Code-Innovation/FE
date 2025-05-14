# 1단계: Vite 앱 빌드
FROM node:18-alpine AS build
WORKDIR /app

# package.json, package-lock.json 먼저 복사해서 캐시 활용
COPY package*.json ./
RUN npm ci

# 나머지 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: 빌드된 정적 파일을 Nginx로 서빙
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 포트
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]