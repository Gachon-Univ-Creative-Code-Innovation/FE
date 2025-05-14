# 1단계: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]