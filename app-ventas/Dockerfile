# Fase de construcción
FROM node:16.15.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build --prod

# Fase de producción
FROM nginx:1.21.6-alpine
COPY --from=build /app/dist/app-ventas /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080