FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build with environment variable for API URL
# Default to localhost for local builds, override with --build-arg in Render
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production image using nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx default listens on 80
EXPOSE 80

# Simple health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]


